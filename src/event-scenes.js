(function(root){
  'use strict';
  // Native pixel scenery: one 480×270 canvas per cached scene, enlarged 2×.
  // All coordinates below use the existing 960×540 world and collision floor.
  const ids=['wedding','serenade','birthday','retirement','silver','gold','charity','procession'];
  function draw(c,id,location,crest){
    if(!ids.includes(id))id='serenade';
    const night=id==='serenade'||id==='procession',anniversary=id==='silver'||id==='gold',hall=id==='wedding'||anniversary;
    const accent=id==='silver'?'#c9e3ee':id==='gold'?'#efd17c':id==='charity'?'#72d0b7':id==='procession'?'#e5cb91':'#f2ba86';
    const ink='#302b42',cream='#fff0cc',skin='#e3b18c';
    const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,Math.round(w/2)*2,Math.round(h/2)*2);};
    const text=(s,x,y,size=18,color=cream)=>{c.fillStyle=color;c.font=`bold ${size}px monospace`;c.textAlign='center';c.fillText(s,x,y);};
    const oval=(x,y,rx,ry,color)=>{for(let dy=-ry;dy<=ry;dy+=2){const half=Math.sqrt(Math.max(0,1-dy*dy/(ry*ry)))*rx;r(x-half,y+dy,half*2,2,color);}};
    const flower=(x,y,color)=>{r(x-6,y-2,12,6,color);r(x-2,y-6,6,12,color);r(x,y,2,2,'#efce70');};
    const heart=(x,y,s,color)=>{r(x,y,s*2,s,color);r(x+s*3,y,s*2,s,color);r(x-s,y+s,s*7,s*2,color);r(x,y+s*3,s*5,s,color);r(x+s,y+s*4,s*3,s,color);r(x+s*2,y+s*5,s,s,color);};
    const guest=(x,feet,{bride=false,old=false,coat='#577a91',hair='#45363a'}={})=>{
      oval(x,feet+2,13,3,'#30233340');r(x-8,feet-12,6,12,ink);r(x+2,feet-12,6,12,ink);
      r(x-12,feet-38,24,28,bride?'#fff3d3':coat);r(x-16,feet-36,6,22,bride?'#faf3df':coat);r(x+10,feet-36,6,22,bride?'#faf3df':coat);
      r(x-14,feet-17,6,6,skin);r(x+10,feet-17,6,6,skin);r(x-9,feet-58,18,18,skin);r(x-10,feet-60,20,6,old?'#d7cdd2':hair);r(x-10,feet-54,4,10,old?'#d7cdd2':hair);
      r(x-5,feet-50,2,2,ink);r(x+4,feet-50,2,2,ink);r(x-2,feet-44,6,2,'#b96f67');
      if(bride){r(x-14,feet-60,4,27,'#f2efdc');r(x+10,feet-60,4,27,'#f2efdc');r(x-16,feet-22,32,12,'#fff3d3');flower(x+13,feet-20,'#ee91a2');}
      else{r(x-3,feet-38,6,18,'#f4ead8');r(x-5,feet-35,10,4,ink);}
    };
    const balloon=(x,y,color)=>{oval(x+3,y+3,13,18,ink);oval(x,y,13,18,color);r(x-4,y-10,4,6,'#ffffff80');r(x-2,y+18,4,4,color);r(x,y+22,2,38,'#dfcdae');};
    const bunting=(y,colors)=>{for(let x=0;x<960;x+=4)r(x,y+Math.round(Math.sin(x/960*Math.PI)*16),4,2,ink);for(let i=0;i<18;i++){const x=12+i*56,top=y+Math.round(Math.sin(x/960*Math.PI)*16)+4;for(let j=0;j<16;j+=2)r(x+j/2,top+j,20-j,2,colors[i%colors.length]);}};
    const cake=(x,y,label)=>{r(x-42,y+34,84,6,'#693f57');r(x-38,y+2,76,34,'#fbce8d');r(x-38,y+2,76,8,'#fff0ce');r(x-28,y-18,56,22,'#df789c');r(x-28,y-18,56,6,'#fff0ce');for(let i=0;i<5;i++){r(x-22+i*10,y-28,4,10,'#d7def0');r(x-22+i*10,y-34,4,6,'#ffce69');}if(label)text(label,x,y+28,20,ink);};
    const table=(x,y,w=100)=>{r(x,y,w,10,'#eebc91');r(x+4,y+10,w-8,22,'#f2e4d0');for(let dx=10;dx<w-10;dx+=16)r(x+dx,y+14,2,18,'#d2b8af');r(x+12,y+32,6,20,'#78575d');r(x+w-18,y+32,6,20,'#78575d');};

    r(0,0,960,540,night?'#18223e':hall?'#876178':id==='charity'?'#679c8d':'#bd7b7b');
    if(hall){
      r(0,0,960,18,'#49364f');r(0,18,960,8,'#ddb993');r(0,26,960,212,'#c4a6b1');
      for(const x of [18,384,742]){r(x,32,180,173,'#87687d');r(x+12,44,156,150,'#597d9f');for(let y=46;y<184;y+=24)r(x+14,y,152,4,'#6e8faf');r(x+82,44,6,152,'#d9c1b3');r(x+12,110,156,6,'#d9c1b3');r(x-8,28,24,181,'#955166');r(x+164,28,24,181,'#955166');r(x-8,193,28,8,accent);r(x+160,193,28,8,accent);}
      for(const x of [60,450,830]){r(x,26,2,22,accent);r(x-22,48,46,6,accent);for(let i=0;i<5;i++){r(x-20+i*10,52,4,14,'#f8e0a0');r(x-22+i*10,66,8,8,'#ffedc0');}}
    }else if(id==='procession'){
      // Drawn scenery inspired by the project's Arjona / Marmolejo photos.
      // Twilight is an artistic setting, not a claim about those services' times.
      const silver='#b5c2d3',silverLight='#e2e1dc',gold='#d6b571';
      const glow=(x,y,rx=18,ry=24)=>{oval(x,y,rx,ry,'#f8c5770a');oval(x,y,rx*.65,ry*.7,'#f8c57713');};
      const candle=(x,y,h=26)=>{glow(x,y-5);r(x-3,y,6,h,'#bbaa89');r(x-2,y,4,h,'#f7dfad');r(x-2,y-8,4,8,'#e8a459');r(x,y-10,2,8,'#fff3bf');r(x-6,y+h,12,4,silver);};
      r(0,0,960,48,'#293046');r(0,48,960,94,'#35354f');r(0,142,960,104,'#404057');
      for(let i=0;i<32;i++)r((i*149+15)%960,(i*41+8)%71,2,2,'#d4ceb080');
      oval(658,38,17,17,'#c4bd9a');oval(664,33,16,16,'#293046');
      // Church portal and quiet street: a backdrop, not a new collision shape.
      r(20,58,96,188,'#736476');r(118,10,246,236,'#897785');r(108,10,266,10,'#aa938c');
      r(134,26,214,220,'#a18b8a');r(142,32,198,214,'#6e5e70');
      oval(241,109,88,74,'#ccaf94');r(153,109,176,136,'#ccaf94');
      oval(241,108,75,62,'#494052');r(166,108,150,137,'#494052');
      for(const x of [130,342]){r(x,20,12,225,'#b39c93');r(x-4,234,20,12,'#c9ad98');r(x-4,22,20,10,'#c9ad98');}
      r(231,17,20,4,gold);r(239,10,4,18,gold);
      r(28,100,75,94,'#3e394f');r(33,108,65,79,'#a99687');r(45,122,41,66,'#665368');r(60,116,8,10,'#665368');
      for(const [x,y,w,h] of [[388,85,140,161],[535,53,151,193],[693,110,148,136],[850,74,110,172]]){
        r(x,y,w,h,'#686174');r(x-4,y-5,w+8,7,'#8d7780');
        for(let dx=14;dx<w-20;dx+=46){r(x+dx,y+28,24,39,'#333147');r(x+dx+4,y+32,16,29,'#a38e74');r(x+dx+10,y+32,2,29,'#4b465a');r(x+dx-3,y+65,30,4,'#2c2b3e');for(let bx=0;bx<30;bx+=8)r(x+dx-3+bx,y+57,2,12,'#2c2b3e');}
      }
      for(const x of [94,388,738]){glow(x,141,25,32);r(x-2,154,4,90,'#332e43');r(x-9,132,18,22,'#bca47c');r(x-5,136,10,14,'#f4d095');r(x-11,128,22,4,'#302b42');r(x-11,152,22,4,'#302b42');}
      // Contact shadow, silver float and embroidered skirt behind the five tunos.
      oval(236,242,118,9,'#22213570');r(126,210,222,32,'#353047');r(133,212,208,27,'#4e425a');
      for(let x=141;x<337;x+=18){r(x,216,4,17,gold);r(x-2,216,8,3,gold);r(x-2,232,8,3,gold);}
      r(123,202,228,8,silver);r(128,208,218,4,'#8793a9');r(122,200,230,3,silverLight);
      r(161,181,151,19,'#aaa7ac');r(166,185,141,8,silverLight);
      for(let x=172;x<307;x+=22){r(x,186,10,7,'#7c8396');r(x+2,185,6,2,'#f0e1bc');}
      // Radiating halo, crown, face and pale-blue mantle (Virgen de Gracia reference).
      glow(240,81,67,72);oval(240,79,45,46,'#dfcfa41b');
      for(let i=0;i<24;i++){const a=i*Math.PI/12;for(let j=30;j<42;j+=2)r(240+Math.cos(a)*j,79+Math.sin(a)*j,2,2,j>36?silverLight:silver);}
      oval(240,79,29,31,silver);oval(240,79,25,27,'#4c4056');
      r(226,58,28,8,gold);r(225,56,30,3,'#fff0bd');
      for(const x of [228,238,250]){r(x,48,4,9,gold);r(x,46,4,3,silverLight);}r(226,66,27,3,'#a17d58');
      r(228,70,24,23,'#40343d');r(232,73,16,19,'#b98d79');r(232,73,14,4,'#d2a68a');
      r(232,80,3,2,'#443541');r(242,80,3,2,'#443541');r(238,82,3,5,'#a77769');r(236,89,7,2,'#8e5e61');
      for(let y=93;y<179;y+=2){const half=14+(y-93)*.42;r(240-half,y,half*2,2,'#91a8c8');r(240-half+4,y,6,2,'#c0cde0');r(240+half-8,y,5,2,'#617994');}
      for(let y=97;y<180;y+=2){const half=7+(y-97)*.24;r(240-half,y,half*2,2,'#f1e5cc');}
      r(235,94,10,9,'#e6d2af');r(238,99,4,66,gold);
      for(let y=109;y<174;y+=14)for(const x of [227,246]){r(x,y,4,2,gold);r(x+2,y-2,2,6,'#d1bd8e');}
      r(227,111,7,6,'#c6967d');r(222,109,11,3,'#e8dbc6');
      // Niño, small crown and gown; integrated into the same pixel drawing.
      r(256,102,12,12,'#bd937e');r(256,101,12,3,'#5c423f');r(254,98,16,3,gold);r(258,94,3,4,gold);r(266,94,3,4,gold);
      r(259,106,2,2,'#4b3940');r(266,106,2,2,'#4b3940');r(256,115,13,23,'#f4e6cb');r(260,119,3,20,gold);r(270,117,5,5,'#cda087');r(256,138,5,5,'#bf987e');r(264,138,5,5,'#bf987e');
      // Silver candle branches and dense flowers, as in the real floats.
      for(const x of [145,327]){r(x-2,147,4,44,silver);r(x-20,146,40,4,silver);r(x-18,135,4,13,silver);r(x+14,135,4,13,silver);r(x-8,188,16,4,silverLight);candle(x,113,29);candle(x-16,120,15);candle(x+16,120,15);}
      for(let i=0;i<25;i++){const x=129+i*9,y=195-(i%3)*6;r(x-3,y-3,8,8,'#6b836f');flower(x,y,i%5===0?'#c3cde3':i%7===0?'#d9a1b4':'#eee9d7');}
      // Confraternity banners echo the navy/gold colours in Marmolejo's photos.
      for(const x of [48,397]){r(x-1,166,2,71,gold);r(x-17,164,34,4,gold);r(x-15,169,30,43,'#3a4560');r(x-15,169,3,43,gold);r(x+12,169,3,43,gold);r(x-15,212,30,3,gold);r(x-1,177,2,20,silver);r(x-7,184,14,2,silver);}
    }else if(night){
      for(let i=0;i<45;i++)r((i*137+11)%960,(i*37)%126,2,2,'#e4d7a4');oval(86,38,26,26,'#f4dfa1');oval(96,30,24,24,'#18223e');
      r(0,176,960,68,'#243953');r(16,84,138,161,'#bd958b');r(164,44,206,201,'#e0baa0');r(376,123,138,122,'#9db6b1');r(660,72,174,173,'#a78d98');r(838,127,122,118,'#d4a894');
      for(const x of [34,96,192,290,400,470,680,778,860,918]){r(x,150,26,38,ink);r(x+4,154,18,28,'#efc476');r(x+10,154,2,28,'#967157');}
      r(194,69,120,60,ink);r(200,73,108,49,'#f0c47d');r(206,76,4,44,'#ad8a72');r(266,76,4,44,'#ad8a72');r(186,123,138,8,'#78536b');for(let x=188;x<324;x+=14)r(x,123,4,24,ink);r(184,143,142,6,ink);
      guest(239,125,{coat:'#aa6488'});flower(199,128,'#f795a6');flower(299,128,'#f795a6');
      for(const x of [54,386,728]){r(x,182,4,82,ink);r(x-8,163,20,20,'#f2cb83');r(x-12,158,28,6,ink);r(x-12,182,28,6,ink);}
      r(212,194,64,52,'#70516a');r(220,202,48,44,ink);
    }else if(id==='charity'){
      r(0,0,960,90,'#78b4b0');r(0,90,960,155,'#c7dcbb');
      for(let x=30;x<930;x+=120){r(x,78,10,168,'#627e73');oval(x+5,61,51,37,'#448c75');oval(x-22,60,25,24,'#6ca67b');}
      r(16,116,385,122,'#efe0bc');r(10,100,397,24,'#b76779');for(let x=10;x<407;x+=48)r(x,100,24,24,'#f5d491');r(24,124,10,122,'#886862');r(383,124,10,122,'#886862');
      r(64,35,272,57,'#f3e7cc');heart(82,49,4,'#d4637a');text('RONDA SOLIDARIA',227,67,18,'#476e69');
      table(88,184,235);r(162,145,66,8,'#f0d5a5');r(170,153,6,32,'#a88065');r(214,153,6,32,'#a88065');r(167,103,58,42,'#d6a773');r(175,107,42,4,ink);heart(181,117,3,'#e66d80');r(237,156,55,26,'#a4c68b');text('AYUDA',264,174,12,ink);guest(62,216,{coat:'#6291a7'});guest(352,216,{coat:'#ca9c6b'});
      r(640,116,280,122,'#edc790');r(634,100,292,24,'#589d92');for(let x=634;x<926;x+=48)r(x,100,24,24,'#b4d6ad');
    }else if(id==='retirement'){
      // Community tribute hall: oak panels, a clock, a podium and the honoree.
      r(0,0,960,246,'#8ea2a0');r(0,30,960,8,'#f1d59d');r(0,120,960,126,'#ae8368');
      for(let x=0;x<960;x+=28){r(x,120,3,126,'#886b61');r(x+5,122,2,116,'#c3a18b');}
      r(20,43,376,35,'#416968');text('¡FELIZ JUBILACIÓN!',208,67,22,'#ffe5ad');
      r(25,85,76,72,'#6c5556');r(31,91,64,58,'#dcc79d');oval(63,120,24,24,'#f5e7c8');for(const [dx,dy] of [[0,-18],[18,0],[0,18],[-18,0]])r(62+dx,120+dy,4,4,ink);r(62,104,4,18,ink);r(64,118,14,4,ink);
      r(128,88,188,78,'#f0dcae');r(134,94,176,66,'#577e76');text('GRACIAS POR TODO',222,116,16,cream);text('HOY EL RELOJ ESPERA',222,140,12,'#cce0c7');
      guest(349,178,{old:true,coat:'#506f86'});r(325,153,48,10,'#c39a74');r(331,163,36,60,'#977566');r(336,171,26,3,'#d8b697');r(324,145,3,10,ink);r(324,140,12,6,ink);
      table(116,202,159);cake(193,164,'');r(24,214,70,18,'#678b85');r(29,207,58,7,'#7da49a');r(52,199,18,8,'#d2b8a0');text('¡A DISFRUTAR!',214,191,12,'#f3ddaf');
      for(let i=0;i<5;i++)flower(108+i*10,104+i%2*12,'#efcc77');
      r(656,57,278,151,'#e5cfaa');r(668,69,254,127,'#789997');text('TIEMPO PARA LA RONDA',795,109,18,cream);r(730,150,112,35,'#dbb479');r(724,141,124,12,'#8d6260');
    }else{
      r(0,0,960,74,id==='birthday'?'#68a3b2':'#7999aa');r(0,74,960,172,id==='birthday'?'#f3d2a2':'#e2cfbb');
      for(const x of [24,398,756]){r(x,88,164,117,'#af7c88');r(x+10,98,144,97,'#9ccaca');r(x+78,98,6,97,'#ecdec7');r(x+10,146,144,6,'#ecdec7');r(x-2,203,168,8,'#926c78');}
      r(17,31,384,40,id==='birthday'?'#954f82':'#556b86');text(id==='birthday'?'¡FELIZ CUMPLEAÑOS!':'¡POR FIN, SIN DESPERTADOR!',209,58,18,cream);
      bunting(76,['#ed879f','#ffd481','#71bbac','#8979b7']);
      balloon(44,119,'#ed879f');balloon(368,110,'#eec96e');balloon(343,145,'#86cbb5');
      table(122,176,171);cake(207,140,id==='birthday'?'★':'');
      guest(83,220,{coat:'#ba7c99'});guest(329,225,{coat:'#6b9ca6'});r(314,214,24,14,'#e7c175');r(324,212,4,18,'#ac708e');
    }

    if(id==='wedding'||anniversary){
      // Floral pergola and guests have their own silhouettes, not a recolored plaza.
      r(164,49,12,125,accent);r(307,49,12,125,accent);r(164,44,155,12,accent);r(174,57,10,28,'#f6e6ce');r(295,57,10,28,'#f6e6ce');
      for(const x of [163,181,199,217,235,253,271,289,307]){flower(x,47,id==='gold'?'#e9b857':id==='silver'?'#e8e4ed':'#e995a6');r(x+6,52,6,4,'#71917e');}
      if(anniversary){r(207,64,68,29,'#765367');text(id==='silver'?'25 AÑOS':'50 AÑOS',241,84,14,accent);guest(218,165,{old:true,coat:id==='silver'?'#647d9b':'#856359'});guest(268,165,{old:true,coat:id==='silver'?'#aa80a3':'#bf9768'});}
      else{heart(229,69,4,'#cc667f');guest(216,165,{bride:true});guest(267,165,{coat:'#484457'});}
      table(31,214,96);table(334,214,68);flower(70,210,'#efa1b0');flower(367,210,'#efa1b0');
      r(692,30,176,31,'#745163');text(anniversary?'ANIVERSARIO':'CELEBRAMOS EL SÍ',780,51,16,accent);
    }

    // Keep the walkable floor, obstacle geometry and stage entrance unchanged.
    r(0,246,960,20,'#b79685');r(0,266,960,274,night?'#596c85':hall?'#82707e':'#78978c');
    for(let y=276;y<540;y+=26){r(0,y,960,2,'#ffffff12');for(let x=0;x<960;x+=68)r(x+((y/26|0)%2)*34,y,2,26,'#292a4130');}
    r(28,260,370,8,accent);r(28,268,370,6,'#49394b');
    r(763,201,153,63,hall?'#86556b':'#57796f');r(765,265,157,14,'#c19677');r(755,280,175,10,'#906e66');r(765,290,155,6,ink);r(765,195,154,6,accent);r(778,202,6,61,accent);r(900,202,6,61,accent);
    if(crest)c.drawImage(crest,826,209,38,42);else text('LA TUNA',842,241,14);
    r(774,161,136,28,'#302b42');text(location.name.toLocaleUpperCase('es-ES'),842,181,Math.min(14,210/location.name.length),cream);
    for(const [i,o] of root.TunaEngine.obstacles.entries()){oval(o.x+o.w/2,o.y+o.h+5,o.w/2+8,10,'#27314544');r(o.x,o.y,o.w,o.h,i?'#6d647b':'#956a66');r(o.x-6,o.y-4,o.w+12,12,accent);if(hall){r(o.x+6,o.y+8,o.w-12,12,'#e7d7c3');flower(o.x+o.w/2,o.y-10,'#e19aaa');}else{r(o.x+20,o.y-13,30,10,'#e9d0a6');text('♪',o.x+35,o.y-4,12,ink);}}
    // Edge decoration stays clear of every route and collectible.
    for(const x of [23,927]){r(x-12,342,24,38,'#a77d68');r(x-16,336,32,8,accent);r(x-2,308,4,30,'#607560');for(let i=0;i<3;i++)flower(x-10+i*10,310-i%2*8,id==='charity'?'#efc56f':'#e999ad');}
    if(!night)bunting(7,[accent,'#ec9baf','#8bc1b5']);
  }
  root.TunaEventScenes={ids,draw};
})(globalThis);
