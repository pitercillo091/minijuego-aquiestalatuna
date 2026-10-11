-- Stable identity and chart versions survive campaign reordering. Original
-- numeric level/campaign columns and historical scores are retained intact.
create table if not exists public.game_rank_chart_catalog (
  level_key text primary key,
  song_id text not null,
  difficulty text not null,
  chart_key text not null,
  display_level smallint not null unique,
  playable_seconds smallint not null check(playable_seconds in (60,120)),
  expected_notes smallint not null,
  accuracy_threshold numeric(5,4) not null
);
alter table public.game_rank_chart_catalog enable row level security;
revoke all on table public.game_rank_chart_catalog from public,anon,authenticated;
grant all on table public.game_rank_chart_catalog to service_role;
alter table public.game_rankings add column if not exists level_key text;
alter table public.game_rankings add column if not exists chart_key text;
alter table public.game_rank_sessions add column if not exists level_key text;
alter table public.game_rank_sessions add column if not exists chart_key text;
alter table public.game_rank_sessions add column if not exists playable_seconds smallint not null default 60;
alter table public.game_rank_sessions drop constraint if exists game_rank_sessions_level_check;
alter table public.game_rank_sessions add constraint game_rank_sessions_level_check check(level>0);
alter table public.game_rankings drop constraint if exists game_rankings_level_check;
alter table public.game_rankings add constraint game_rankings_level_check check(level>0);
alter table public.game_rank_sessions drop constraint if exists game_rank_sessions_difficulty_check;
alter table public.game_rank_sessions add constraint game_rank_sessions_difficulty_check check(difficulty in ('normal','dificil','experto'));
alter table public.game_rankings drop constraint if exists game_rankings_difficulty_check;
alter table public.game_rankings add constraint game_rankings_difficulty_check check(difficulty in ('normal','dificil','experto'));
alter table public.game_rank_sessions drop constraint if exists game_rank_sessions_expected_notes_check;
alter table public.game_rank_sessions add constraint game_rank_sessions_expected_notes_check check(expected_notes between 1 and 1200);
alter table public.game_rankings drop constraint if exists game_rankings_hits_check;
alter table public.game_rankings drop constraint if exists game_rankings_misses_check;
alter table public.game_rankings drop constraint if exists game_rankings_notes_check;
alter table public.game_rankings add constraint game_rankings_hits_check check(hits between 0 and 1200);
alter table public.game_rankings add constraint game_rankings_misses_check check(misses between 0 and 1200);
alter table public.game_rankings add constraint game_rankings_notes_check check(notes between 1 and 1200);
alter table public.game_rankings drop constraint if exists game_rankings_score_check;
alter table public.game_rankings drop constraint if exists game_rankings_max_score_check;
alter table public.game_rankings add constraint game_rankings_score_check check(score between 0 and 300000);
alter table public.game_rankings add constraint game_rankings_max_score_check check(max_score between 1 and 300000);

insert into public.game_rank_chart_catalog(level_key,song_id,difficulty,chart_key,display_level,playable_seconds,expected_notes,accuracy_threshold) values
('clavelitos:normal','clavelitos','normal','clavelitos-normal-9f3cbcc9dcd6',1,60,46,0.5),
('cielito-lindo:normal','cielito-lindo','normal','cielito-lindo-normal-b7bc08cd2103',2,60,54,0.5),
('estudiantina-madrilena:normal','estudiantina-madrilena','normal','estudiantina-madrilena-normal-8482b708bf8e',3,60,45,0.5),
('cintas-capa:normal','cintas-capa','normal','cintas-capa-normal-9c2303fb7952',4,60,49,0.525),
('isa-canaria:normal','isa-canaria','normal','isa-canaria-normal-ba23a0eb6d3e',5,60,51,0.525),
('morena-copla:normal','morena-copla','normal','morena-copla-normal-4f6a0feb2a1d',6,60,50,0.525),
('maria-portuguesa:normal','maria-portuguesa','normal','maria-portuguesa-normal-fc23cace6c75',7,60,48,0.55),
('soy-cordobes:normal','soy-cordobes','normal','soy-cordobes-normal-8255a53cf0a2',8,60,46,0.55),
('guantanamera:normal','guantanamera','normal','guantanamera-normal-c5071163de80',9,60,47,0.55),
('viva-espana:normal','viva-espana','normal','viva-espana-normal-d05e5943ef08',10,60,47,0.575),
('isa-de-ronda:normal','isa-de-ronda','normal','isa-de-ronda-normal-e99f1f2887ec',11,60,51,0.575),
('san-cayetano:normal','san-cayetano','normal','san-cayetano-normal-b47858d0fb17',12,60,50,0.575),
('todos-los-besos:normal','todos-los-besos','normal','todos-los-besos-normal-4bacd5090f22',13,60,48,0.6),
('el-legia:normal','el-legia','normal','el-legia-normal-95f42a4f7119',14,60,50,0.6),
('clavelitos:hard','clavelitos','dificil','clavelitos-hard-d32108855e98',15,60,156,0.545),
('cielito-lindo:hard','cielito-lindo','dificil','cielito-lindo-hard-a0f5a2cfcd1b',16,60,121,0.545),
('estudiantina-madrilena:hard','estudiantina-madrilena','dificil','estudiantina-madrilena-hard-f166e5c52f22',17,60,111,0.545),
('cintas-capa:hard','cintas-capa','dificil','cintas-capa-hard-cc072b3f2c9e',18,60,130,0.5700000000000001),
('isa-canaria:hard','isa-canaria','dificil','isa-canaria-hard-d5fc933a2253',19,60,110,0.5700000000000001),
('morena-copla:hard','morena-copla','dificil','morena-copla-hard-8ca4c07a07e8',20,60,107,0.5700000000000001),
('maria-portuguesa:hard','maria-portuguesa','dificil','maria-portuguesa-hard-f59cd2b9d52a',21,60,112,0.5950000000000001),
('soy-cordobes:hard','soy-cordobes','dificil','soy-cordobes-hard-f06de93196dc',22,60,108,0.5950000000000001),
('guantanamera:hard','guantanamera','dificil','guantanamera-hard-172bcf665fb3',23,60,126,0.5950000000000001),
('viva-espana:hard','viva-espana','dificil','viva-espana-hard-70ef41bbbd80',24,60,127,0.62),
('isa-de-ronda:hard','isa-de-ronda','dificil','isa-de-ronda-hard-0e8f2639a79d',25,60,103,0.62),
('san-cayetano:hard','san-cayetano','dificil','san-cayetano-hard-f02ea4e0de5a',26,60,133,0.62),
('todos-los-besos:hard','todos-los-besos','dificil','todos-los-besos-hard-e64d9197cfad',27,60,129,0.645),
('el-legia:hard','el-legia','dificil','el-legia-hard-a54b133e1db9',28,60,138,0.645),
('clavelitos:expert','clavelitos','experto','clavelitos-expert-91e921d7311a',29,120,391,0.59),
('cielito-lindo:expert','cielito-lindo','experto','cielito-lindo-expert-c7652e902e84',30,120,401,0.59),
('estudiantina-madrilena:expert','estudiantina-madrilena','experto','estudiantina-madrilena-expert-523ad6670562',31,120,386,0.59),
('cintas-capa:expert','cintas-capa','experto','cintas-capa-expert-fb8b33de281a',32,120,499,0.615),
('isa-canaria:expert','isa-canaria','experto','isa-canaria-expert-8b4830761626',33,120,364,0.615),
('morena-copla:expert','morena-copla','experto','morena-copla-expert-e7402dfc4171',34,120,340,0.615),
('maria-portuguesa:expert','maria-portuguesa','experto','maria-portuguesa-expert-3795da02fed4',35,120,397,0.64),
('soy-cordobes:expert','soy-cordobes','experto','soy-cordobes-expert-047b1d349d53',36,120,410,0.64),
('guantanamera:expert','guantanamera','experto','guantanamera-expert-1466960e7208',37,120,477,0.64),
('viva-espana:expert','viva-espana','experto','viva-espana-expert-97fdd2351549',38,120,330,0.6649999999999999),
('isa-de-ronda:expert','isa-de-ronda','experto','isa-de-ronda-expert-33d3dfd4cee0',39,120,233,0.6649999999999999),
('san-cayetano:expert','san-cayetano','experto','san-cayetano-expert-fe572ce674c6',40,120,384,0.6649999999999999),
('todos-los-besos:expert','todos-los-besos','experto','todos-los-besos-expert-e3f5fd24b6ad',41,120,321,0.69),
('el-legia:expert','el-legia','experto','el-legia-expert-e61d2488fe60',42,120,425,0.69)
on conflict(level_key) do update set chart_key=excluded.chart_key,display_level=excluded.display_level,playable_seconds=excluded.playable_seconds,expected_notes=excluded.expected_notes,accuracy_threshold=excluded.accuracy_threshold;
update public.game_rankings set level_key='clavelitos:normal',chart_key='clavelitos-normal-9f3cbcc9dcd6' where campaign_version='mp3-13-two-rounds-v1' and song_id='clavelitos' and difficulty='normal';
update public.game_rank_sessions set level_key='clavelitos:normal',chart_key='clavelitos-normal-9f3cbcc9dcd6' where campaign_version='mp3-13-two-rounds-v1' and song_id='clavelitos' and difficulty='normal';
update public.game_rankings set level_key='cielito-lindo:normal',chart_key='cielito-lindo-normal-b7bc08cd2103' where campaign_version='mp3-13-two-rounds-v1' and song_id='cielito-lindo' and difficulty='normal';
update public.game_rank_sessions set level_key='cielito-lindo:normal',chart_key='cielito-lindo-normal-b7bc08cd2103' where campaign_version='mp3-13-two-rounds-v1' and song_id='cielito-lindo' and difficulty='normal';
update public.game_rankings set level_key='estudiantina-madrilena:normal',chart_key='estudiantina-madrilena-normal-8482b708bf8e' where campaign_version='mp3-13-two-rounds-v1' and song_id='estudiantina-madrilena' and difficulty='normal';
update public.game_rank_sessions set level_key='estudiantina-madrilena:normal',chart_key='estudiantina-madrilena-normal-8482b708bf8e' where campaign_version='mp3-13-two-rounds-v1' and song_id='estudiantina-madrilena' and difficulty='normal';
update public.game_rankings set level_key='cintas-capa:normal',chart_key='cintas-capa-normal-9c2303fb7952' where campaign_version='mp3-13-two-rounds-v1' and song_id='cintas-capa' and difficulty='normal';
update public.game_rank_sessions set level_key='cintas-capa:normal',chart_key='cintas-capa-normal-9c2303fb7952' where campaign_version='mp3-13-two-rounds-v1' and song_id='cintas-capa' and difficulty='normal';
update public.game_rankings set level_key='isa-canaria:normal',chart_key='isa-canaria-normal-ba23a0eb6d3e' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-canaria' and difficulty='normal';
update public.game_rank_sessions set level_key='isa-canaria:normal',chart_key='isa-canaria-normal-ba23a0eb6d3e' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-canaria' and difficulty='normal';
update public.game_rankings set level_key='morena-copla:normal',chart_key='morena-copla-normal-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='morena-copla' and difficulty='normal';
update public.game_rank_sessions set level_key='morena-copla:normal',chart_key='morena-copla-normal-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='morena-copla' and difficulty='normal';
update public.game_rankings set level_key='maria-portuguesa:normal',chart_key='maria-portuguesa-normal-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='maria-portuguesa' and difficulty='normal';
update public.game_rank_sessions set level_key='maria-portuguesa:normal',chart_key='maria-portuguesa-normal-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='maria-portuguesa' and difficulty='normal';
update public.game_rankings set level_key='soy-cordobes:normal',chart_key='soy-cordobes-normal-8255a53cf0a2' where campaign_version='mp3-13-two-rounds-v1' and song_id='soy-cordobes' and difficulty='normal';
update public.game_rank_sessions set level_key='soy-cordobes:normal',chart_key='soy-cordobes-normal-8255a53cf0a2' where campaign_version='mp3-13-two-rounds-v1' and song_id='soy-cordobes' and difficulty='normal';
update public.game_rankings set level_key='guantanamera:normal',chart_key='guantanamera-normal-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='guantanamera' and difficulty='normal';
update public.game_rank_sessions set level_key='guantanamera:normal',chart_key='guantanamera-normal-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='guantanamera' and difficulty='normal';
update public.game_rankings set level_key='viva-espana:normal',chart_key='viva-espana-normal-d05e5943ef08' where campaign_version='mp3-13-two-rounds-v1' and song_id='viva-espana' and difficulty='normal';
update public.game_rank_sessions set level_key='viva-espana:normal',chart_key='viva-espana-normal-d05e5943ef08' where campaign_version='mp3-13-two-rounds-v1' and song_id='viva-espana' and difficulty='normal';
update public.game_rankings set level_key='isa-de-ronda:normal',chart_key='isa-de-ronda-normal-e99f1f2887ec' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-de-ronda' and difficulty='normal';
update public.game_rank_sessions set level_key='isa-de-ronda:normal',chart_key='isa-de-ronda-normal-e99f1f2887ec' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-de-ronda' and difficulty='normal';
update public.game_rankings set level_key='san-cayetano:normal',chart_key='san-cayetano-normal-b47858d0fb17' where campaign_version='mp3-13-two-rounds-v1' and song_id='san-cayetano' and difficulty='normal';
update public.game_rank_sessions set level_key='san-cayetano:normal',chart_key='san-cayetano-normal-b47858d0fb17' where campaign_version='mp3-13-two-rounds-v1' and song_id='san-cayetano' and difficulty='normal';
update public.game_rankings set level_key='todos-los-besos:normal',chart_key='todos-los-besos-normal-4bacd5090f22' where campaign_version='mp3-13-two-rounds-v1' and song_id='todos-los-besos' and difficulty='normal';
update public.game_rank_sessions set level_key='todos-los-besos:normal',chart_key='todos-los-besos-normal-4bacd5090f22' where campaign_version='mp3-13-two-rounds-v1' and song_id='todos-los-besos' and difficulty='normal';
update public.game_rankings set level_key='clavelitos:hard',chart_key='clavelitos-hard-d32108855e98' where campaign_version='mp3-13-two-rounds-v1' and song_id='clavelitos' and difficulty='dificil';
update public.game_rank_sessions set level_key='clavelitos:hard',chart_key='clavelitos-hard-d32108855e98' where campaign_version='mp3-13-two-rounds-v1' and song_id='clavelitos' and difficulty='dificil';
update public.game_rankings set level_key='cielito-lindo:hard',chart_key='cielito-lindo-hard-a0f5a2cfcd1b' where campaign_version='mp3-13-two-rounds-v1' and song_id='cielito-lindo' and difficulty='dificil';
update public.game_rank_sessions set level_key='cielito-lindo:hard',chart_key='cielito-lindo-hard-a0f5a2cfcd1b' where campaign_version='mp3-13-two-rounds-v1' and song_id='cielito-lindo' and difficulty='dificil';
update public.game_rankings set level_key='estudiantina-madrilena:hard',chart_key='estudiantina-madrilena-hard-f166e5c52f22' where campaign_version='mp3-13-two-rounds-v1' and song_id='estudiantina-madrilena' and difficulty='dificil';
update public.game_rank_sessions set level_key='estudiantina-madrilena:hard',chart_key='estudiantina-madrilena-hard-f166e5c52f22' where campaign_version='mp3-13-two-rounds-v1' and song_id='estudiantina-madrilena' and difficulty='dificil';
update public.game_rankings set level_key='cintas-capa:hard',chart_key='cintas-capa-hard-cc072b3f2c9e' where campaign_version='mp3-13-two-rounds-v1' and song_id='cintas-capa' and difficulty='dificil';
update public.game_rank_sessions set level_key='cintas-capa:hard',chart_key='cintas-capa-hard-cc072b3f2c9e' where campaign_version='mp3-13-two-rounds-v1' and song_id='cintas-capa' and difficulty='dificil';
update public.game_rankings set level_key='isa-canaria:hard',chart_key='isa-canaria-hard-d5fc933a2253' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-canaria' and difficulty='dificil';
update public.game_rank_sessions set level_key='isa-canaria:hard',chart_key='isa-canaria-hard-d5fc933a2253' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-canaria' and difficulty='dificil';
update public.game_rankings set level_key='morena-copla:hard',chart_key='morena-copla-hard-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='morena-copla' and difficulty='dificil';
update public.game_rank_sessions set level_key='morena-copla:hard',chart_key='morena-copla-hard-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='morena-copla' and difficulty='dificil';
update public.game_rankings set level_key='maria-portuguesa:hard',chart_key='maria-portuguesa-hard-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='maria-portuguesa' and difficulty='dificil';
update public.game_rank_sessions set level_key='maria-portuguesa:hard',chart_key='maria-portuguesa-hard-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='maria-portuguesa' and difficulty='dificil';
update public.game_rankings set level_key='soy-cordobes:hard',chart_key='soy-cordobes-hard-f06de93196dc' where campaign_version='mp3-13-two-rounds-v1' and song_id='soy-cordobes' and difficulty='dificil';
update public.game_rank_sessions set level_key='soy-cordobes:hard',chart_key='soy-cordobes-hard-f06de93196dc' where campaign_version='mp3-13-two-rounds-v1' and song_id='soy-cordobes' and difficulty='dificil';
update public.game_rankings set level_key='guantanamera:hard',chart_key='guantanamera-hard-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='guantanamera' and difficulty='dificil';
update public.game_rank_sessions set level_key='guantanamera:hard',chart_key='guantanamera-hard-legacy-v1' where campaign_version='mp3-13-two-rounds-v1' and song_id='guantanamera' and difficulty='dificil';
update public.game_rankings set level_key='viva-espana:hard',chart_key='viva-espana-hard-70ef41bbbd80' where campaign_version='mp3-13-two-rounds-v1' and song_id='viva-espana' and difficulty='dificil';
update public.game_rank_sessions set level_key='viva-espana:hard',chart_key='viva-espana-hard-70ef41bbbd80' where campaign_version='mp3-13-two-rounds-v1' and song_id='viva-espana' and difficulty='dificil';
update public.game_rankings set level_key='isa-de-ronda:hard',chart_key='isa-de-ronda-hard-0e8f2639a79d' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-de-ronda' and difficulty='dificil';
update public.game_rank_sessions set level_key='isa-de-ronda:hard',chart_key='isa-de-ronda-hard-0e8f2639a79d' where campaign_version='mp3-13-two-rounds-v1' and song_id='isa-de-ronda' and difficulty='dificil';
update public.game_rankings set level_key='san-cayetano:hard',chart_key='san-cayetano-hard-f02ea4e0de5a' where campaign_version='mp3-13-two-rounds-v1' and song_id='san-cayetano' and difficulty='dificil';
update public.game_rank_sessions set level_key='san-cayetano:hard',chart_key='san-cayetano-hard-f02ea4e0de5a' where campaign_version='mp3-13-two-rounds-v1' and song_id='san-cayetano' and difficulty='dificil';
update public.game_rankings set level_key='todos-los-besos:hard',chart_key='todos-los-besos-hard-e64d9197cfad' where campaign_version='mp3-13-two-rounds-v1' and song_id='todos-los-besos' and difficulty='dificil';
update public.game_rank_sessions set level_key='todos-los-besos:hard',chart_key='todos-los-besos-hard-e64d9197cfad' where campaign_version='mp3-13-two-rounds-v1' and song_id='todos-los-besos' and difficulty='dificil';
update public.game_rankings set level_key=song_id||':'||case difficulty when 'dificil' then 'hard' when 'experto' then 'expert' else 'normal' end,chart_key=campaign_version||':'||chart_version where level_key is null;
update public.game_rank_sessions set level_key=song_id||':'||case difficulty when 'dificil' then 'hard' when 'experto' then 'expert' else 'normal' end,chart_key=campaign_version||':'||chart_version where level_key is null;


alter table public.game_rankings drop constraint if exists game_rankings_player_level_campaign_key;
create unique index if not exists game_rankings_stable_best_idx on public.game_rankings(player_id,level_key,chart_key);
create index if not exists game_rankings_stable_order_idx on public.game_rankings(level_key,chart_key,score desc,accuracy desc,played_at asc);

create or replace function public.game_rankings_submit(
  p_token_hash text,p_player_name text,p_score integer,p_accuracy numeric,
  p_hits integer,p_misses integer,p_notes integer,p_delete_token_hash text
) returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare challenge public.game_rank_sessions%rowtype; result_id uuid; was_better boolean:=false; ratio numeric; cap integer;
begin
  select * into challenge from public.game_rank_sessions where token_hash=p_token_hash for update;
  if not found or challenge.used_at is not null or challenge.expires_at<now() then raise exception using errcode='22023',message='session_invalid';end if;
  if now()-challenge.started_at < make_interval(secs=>challenge.playable_seconds-5) or now()-challenge.started_at>interval '15 minutes' then raise exception using errcode='22023',message='duration_invalid';end if;
  if p_player_name is null or char_length(p_player_name) not between 1 and 24 or p_player_name !~ '^[[:alnum:] ._''-´’]+$' or p_player_name ~ '[0-9]{7,}' then raise exception using errcode='22023',message='name_invalid';end if;
  if p_notes<>challenge.expected_notes or p_hits<0 or p_misses<0 or p_hits+p_misses<>challenge.expected_notes then raise exception using errcode='22023',message='note_totals_invalid';end if;
  ratio:=p_hits::numeric/challenge.expected_notes;
  if abs(ratio-p_accuracy)>.005 or ratio<challenge.accuracy_threshold then raise exception using errcode='22023',message='accuracy_invalid';end if;
  cap:=challenge.expected_notes*210+1000;
  if p_score<0 or p_score>cap then raise exception using errcode='22023',message='score_invalid';end if;
  if p_token_hash !~ '^[a-f0-9]{64}$' or p_delete_token_hash !~ '^[a-f0-9]{64}$' then raise exception using errcode='22023',message='token_invalid';end if;
  update public.game_rank_sessions set used_at=now() where token_hash=p_token_hash;
  insert into public.game_rankings as stored(player_id,player_name,level,campaign_version,song_id,difficulty,score,accuracy,hits,misses,notes,max_score,chart_version,session_hash,delete_token_hash,level_key,chart_key)
  values(challenge.player_id,upper(trim(p_player_name)),challenge.level,challenge.campaign_version,challenge.song_id,challenge.difficulty,p_score,ratio,p_hits,p_misses,p_notes,cap,challenge.chart_version,p_token_hash,p_delete_token_hash,challenge.level_key,challenge.chart_key)
  on conflict(player_id,level_key,chart_key) do update set
    player_name=excluded.player_name,score=excluded.score,accuracy=excluded.accuracy,hits=excluded.hits,misses=excluded.misses,notes=excluded.notes,max_score=excluded.max_score,
    session_hash=excluded.session_hash,delete_token_hash=excluded.delete_token_hash,played_at=now()
  where excluded.score>stored.score or (excluded.score=stored.score and excluded.accuracy>stored.accuracy)
  returning id into result_id;
  if result_id is null then select id into result_id from public.game_rankings where player_id=challenge.player_id and level_key=challenge.level_key and chart_key=challenge.chart_key;else was_better:=true;end if;
  return jsonb_build_object('id',result_id,'improved',was_better,'level',challenge.level,'levelKey',challenge.level_key,'chartId',challenge.chart_key);
end;$$;

-- The existing RPC remains available to old clients. New clients use stable
-- keys; history is separate and never contributes to current general scores.
create or replace function public.game_rankings_stable_page(
 p_mode text,p_level_key text default '',p_limit integer default 20,p_offset integer default 0,p_history boolean default false
) returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare result jsonb; current_chart text; denominator integer;
begin
 if p_limit<1 or p_limit>50 or p_offset<0 or p_offset>5000 then raise exception using errcode='22023',message='page_invalid';end if;
 select count(*) into denominator from public.game_rank_chart_catalog;
 if p_mode='level' then
   select chart_key into current_chart from public.game_rank_chart_catalog where level_key=p_level_key;
   if not found then raise exception using errcode='22023',message='level_invalid';end if;
   select jsonb_build_object('total',(select count(*) from public.game_rankings r where r.level_key=p_level_key and (case when p_history then r.chart_key<>current_chart else r.chart_key=current_chart end)),
    'rows',coalesce((select jsonb_agg(to_jsonb(q)) from (
      select row_number() over(order by r.score desc,r.accuracy desc,r.played_at asc,r.id) as rank,r.player_name,r.score,r.accuracy,r.played_at,r.chart_key as chart_version,r.campaign_version
      from public.game_rankings r where r.level_key=p_level_key and (case when p_history then r.chart_key<>current_chart else r.chart_key=current_chart end)
      order by r.score desc,r.accuracy desc,r.played_at asc,r.id limit p_limit offset p_offset
    )q),'[]'::jsonb)) into result;
 elsif p_mode='general' then
   with eligible as(select r.* from public.game_rankings r join public.game_rank_chart_catalog c on c.level_key=r.level_key and c.chart_key=r.chart_key),
   totals as(select player_id,count(*)::integer as levels_played,round(sum(accuracy)*100/denominator,2) as general_score from eligible group by player_id),
   ordered as(select row_number() over(order by t.general_score desc,t.levels_played desc,t.player_id) as rank,latest.player_name,t.general_score,t.levels_played
     from totals t join lateral(select player_name from eligible e where e.player_id=t.player_id order by played_at desc limit 1)latest on true)
   select jsonb_build_object('total',(select count(*) from totals),'rows',coalesce((select jsonb_agg(to_jsonb(q)) from (select * from ordered order by rank limit p_limit offset p_offset)q),'[]'::jsonb)) into result;
 else raise exception using errcode='22023',message='mode_invalid';end if;
 return result;
end;$$;
revoke all on function public.game_rankings_stable_page(text,text,integer,integer,boolean) from public,anon,authenticated;
grant execute on function public.game_rankings_stable_page(text,text,integer,integer,boolean) to service_role;
revoke all on function public.game_rankings_submit(text,text,integer,numeric,integer,integer,integer,text) from public,anon,authenticated;
grant execute on function public.game_rankings_submit(text,text,integer,numeric,integer,integer,integer,text) to service_role;
