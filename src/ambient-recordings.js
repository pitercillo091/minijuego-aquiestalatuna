(function(root){
  'use strict';
  const tracks=[
    {id:'clavelitos',title:'Clavelitos',performer:'Tuna de Distrito de Murcia',file:'MP3/01_Clavelitos_Tuna_de_Distrito_de_Murcia.mp3'},
    {id:'cielito-lindo',title:'Cielito Lindo',performer:'Tuna de Arquitectura Técnica de Madrid',file:'MP3/02_Cielito_Lindo_Tuna_de_Arquitectura_Tecnica_de_Madrid.mp3'},
    {id:'estudiantina-madrilena',title:'Estudiantina Madrileña',performer:'Tuna de Arquitectura Técnica de Madrid',file:'MP3/05_Estudiantina_Madrilena_Tuna_de_Arquitectura_Tecnica_de_Madrid.mp3'},
    {id:'cintas-de-mi-capa',title:'Las Cintas de mi Capa',performer:'Tuna de Arquitectura Técnica de Madrid',file:'MP3/06_Las_Cintas_de_mi_Capa_Tuna_de_Arquitectura_Tecnica_de_Madrid.mp3'},
    {id:'isa-canaria',title:'La Isa Canaria',performer:'Tuna de Antiguos Alumnos Salesianos',file:'MP3/07_La_Isa_Canaria_Tuna_Antiguos_Alumnos_Salesianos.mp3'},
    {id:'morena-de-mi-copla',title:'La Morena de mi Copla',performer:'Rondalla de Lopera',file:'MP3/08_La_Morena_de_mi_Copla_Rondalla_de_Lopera.mp3'},
    {id:'maria-portuguesa',title:'María la Portuguesa',performer:'Rondalla de Lopera',file:'MP3/09_Maria_la_Portuguesa_Rondalla_de_Lopera.mp3'},
    {id:'soy-cordobes',title:'Soy Cordobés',performer:'Tuna de Derecho de Córdoba',file:'MP3/11_Soy_Cordobes_Tuna_de_Derecho_de_Cordoba.mp3'},
    {id:'guantanamera',title:'Guantanamera',performer:'Tuna de Antiguos Alumnos Salesianos',file:'MP3/12_Guantanamera_Tuna_Antiguos_Alumnos_Salesianos.mp3'},
    {id:'viva-espana',title:'Viva España',performer:'Tuna de Distrito de Granada',file:'MP3/13_Y_Viva_Espana_Tuna_de_Distrito_de_Granada.mp3'},
    {id:'isa-de-ronda',title:'Isa de Ronda',performer:'Tuna de Ingenieros de Telecomunicación de Valencia',file:'MP3/14_Isa_de_Ronda_Tuna_de_Ingenieros_de_Telecomunicacion_de_Valencia.mp3'},
    {id:'san-cayetano',title:'San Cayetano',performer:'Tuna de Ingenieros Aeronáuticos de Madrid',file:'MP3/15_Verbena_de_San_Cayetano_Tuna_de_Ingenieros_Aeronauticos_de_Madrid.mp3'},
    {id:'todos-los-besos',title:'Todos los Besos',performer:'Audio de archivo local, convertido desde el MP4 aportado',file:'MP3/16_Todos_los_Besos_desde_video.mp3'}
  ];
  const api={tracks};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TunaAmbientRecordings=api;
})(globalThis);
