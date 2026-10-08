-- Expand the current public-ranking campaign without deleting historical rows.
-- Existing scores stay under midi-20-v1 and are not shown against MP3 charts.
alter table public.game_rank_sessions
  add column if not exists campaign_version text not null default 'midi-20-v1';
alter table public.game_rankings
  add column if not exists campaign_version text not null default 'midi-20-v1';

alter table public.game_rank_sessions
  drop constraint if exists game_rank_sessions_level_check;
alter table public.game_rank_sessions
  add constraint game_rank_sessions_level_check check (level between 1 and 26);
alter table public.game_rankings
  drop constraint if exists game_rankings_level_check;
alter table public.game_rankings
  add constraint game_rankings_level_check check (level between 1 and 26);

alter table public.game_rankings
  drop constraint if exists game_rankings_player_id_level_key;
alter table public.game_rankings
  drop constraint if exists game_rankings_player_id_level_campaign_version_key;
alter table public.game_rankings
  drop constraint if exists game_rankings_player_level_campaign_key;
alter table public.game_rankings
  add constraint game_rankings_player_level_campaign_key unique (player_id, level, campaign_version);

create index if not exists game_rankings_campaign_level_order_idx
  on public.game_rankings (campaign_version, level, score desc, accuracy desc, played_at asc);

create or replace function public.game_rankings_submit(
  p_token_hash text,
  p_player_name text,
  p_score integer,
  p_accuracy numeric,
  p_hits integer,
  p_misses integer,
  p_notes integer,
  p_delete_token_hash text
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  challenge public.game_rank_sessions%rowtype;
  result_id uuid;
  was_better boolean := false;
  ratio numeric;
  cap integer;
begin
  select * into challenge from public.game_rank_sessions where token_hash = p_token_hash for update;
  if not found or challenge.used_at is not null or challenge.expires_at < now() then
    raise exception using errcode = '22023', message = 'session_invalid';
  end if;
  if now() - challenge.started_at < interval '55 seconds' or now() - challenge.started_at > interval '15 minutes' then
    raise exception using errcode = '22023', message = 'duration_invalid';
  end if;
  if p_player_name is null or char_length(p_player_name) not between 1 and 24
    or p_player_name !~ '^[[:alnum:] ._''-´’]+$' or p_player_name ~ '[0-9]{7,}' then
    raise exception using errcode = '22023', message = 'name_invalid';
  end if;
  if p_notes <> challenge.expected_notes or p_hits < 0 or p_misses < 0
    or p_hits + p_misses <> challenge.expected_notes then
    raise exception using errcode = '22023', message = 'note_totals_invalid';
  end if;
  ratio := p_hits::numeric / challenge.expected_notes;
  if abs(ratio - p_accuracy) > 0.005 or ratio < challenge.accuracy_threshold then
    raise exception using errcode = '22023', message = 'accuracy_invalid';
  end if;
  cap := challenge.expected_notes * 210 + 1000;
  if p_score < 0 or p_score > cap then
    raise exception using errcode = '22023', message = 'score_invalid';
  end if;
  if p_token_hash !~ '^[a-f0-9]{64}$' or p_delete_token_hash !~ '^[a-f0-9]{64}$' then
    raise exception using errcode = '22023', message = 'token_invalid';
  end if;

  update public.game_rank_sessions set used_at = now() where token_hash = p_token_hash;
  insert into public.game_rankings as stored (
    player_id, player_name, level, campaign_version, song_id, difficulty, score, accuracy,
    hits, misses, notes, max_score, chart_version, session_hash, delete_token_hash
  ) values (
    challenge.player_id, upper(trim(p_player_name)), challenge.level, challenge.campaign_version,
    challenge.song_id, challenge.difficulty, p_score, ratio, p_hits, p_misses, p_notes,
    cap, challenge.chart_version, p_token_hash, p_delete_token_hash
  )
  on conflict (player_id, level, campaign_version) do update set
    player_name = excluded.player_name, song_id = excluded.song_id,
    difficulty = excluded.difficulty, score = excluded.score, accuracy = excluded.accuracy,
    hits = excluded.hits, misses = excluded.misses, notes = excluded.notes,
    max_score = excluded.max_score, chart_version = excluded.chart_version,
    session_hash = excluded.session_hash, delete_token_hash = excluded.delete_token_hash,
    played_at = now()
  where excluded.score > stored.score
     or (excluded.score = stored.score and excluded.accuracy > stored.accuracy)
  returning id into result_id;
  if result_id is null then
    select id into result_id from public.game_rankings
      where player_id = challenge.player_id and level = challenge.level
        and campaign_version = challenge.campaign_version;
  else
    was_better := true;
  end if;
  return jsonb_build_object('id', result_id, 'improved', was_better, 'level', challenge.level);
end;
$$;

create or replace function public.game_rankings_page(
  p_mode text,
  p_level smallint default 1,
  p_limit integer default 20,
  p_offset integer default 0
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare result jsonb;
begin
  if p_limit < 1 or p_limit > 50 or p_offset < 0 or p_offset > 5000 then
    raise exception using errcode = '22023', message = 'page_invalid';
  end if;
  if p_mode = 'level' then
    if p_level < 1 or p_level > 26 then
      raise exception using errcode = '22023', message = 'level_invalid';
    end if;
    select jsonb_build_object(
      'total', (select count(*) from public.game_rankings r where r.level = p_level and r.campaign_version = 'mp3-13-two-rounds-v1'),
      'rows', coalesce((
        select jsonb_agg(to_jsonb(q)) from (
          select row_number() over (order by r.score desc, r.accuracy desc, r.played_at asc) + p_offset as rank,
            r.player_name, r.score, r.accuracy, r.played_at
          from public.game_rankings r
          where r.level = p_level and r.campaign_version = 'mp3-13-two-rounds-v1'
          order by r.score desc, r.accuracy desc, r.played_at asc
          limit p_limit offset p_offset
        ) q
      ), '[]'::jsonb)
    ) into result;
  elsif p_mode = 'general' then
    select jsonb_build_object(
      'total', (select count(distinct player_id) from public.game_rankings where campaign_version = 'mp3-13-two-rounds-v1'),
      'rows', coalesce((
        select jsonb_agg(to_jsonb(q)) from (
          with personal_best as (
            select distinct on (r.player_id, r.level) r.player_id, r.level, r.accuracy, r.score
            from public.game_rankings r where r.campaign_version = 'mp3-13-two-rounds-v1'
            order by r.player_id, r.level, r.accuracy desc, r.score desc, r.played_at asc
          ), totals as (
            select b.player_id, count(*)::integer as levels_played,
              round((sum(b.accuracy) / 26 * 100)::numeric, 2) as general_score
            from personal_best b group by b.player_id
          )
          select row_number() over (order by t.general_score desc, t.levels_played desc, t.player_id) + p_offset as rank,
            latest.player_name, t.general_score, t.levels_played
          from totals t
          join lateral (
            select r.player_name from public.game_rankings r
            where r.player_id = t.player_id and r.campaign_version = 'mp3-13-two-rounds-v1'
            order by r.played_at desc limit 1
          ) latest on true
          order by t.general_score desc, t.levels_played desc, t.player_id
          limit p_limit offset p_offset
        ) q
      ), '[]'::jsonb)
    ) into result;
  else
    raise exception using errcode = '22023', message = 'mode_invalid';
  end if;
  return result;
end;
$$;

revoke all on function public.game_rankings_submit(text,text,integer,numeric,integer,integer,integer,text) from public, anon, authenticated;
revoke all on function public.game_rankings_page(text,smallint,integer,integer) from public, anon, authenticated;
grant execute on function public.game_rankings_submit(text,text,integer,numeric,integer,integer,integer,text) to service_role;
grant execute on function public.game_rankings_page(text,smallint,integer,integer) to service_role;
