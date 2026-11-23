// Black Lantern · seasons/test-season.js · DEV BUILD ONLY
// A made-up test season for checking the season flow (spec 009, Done when): three stand-in regular cases and two
// stand-in agency cases, the second the finale, with small unlock counts so a test is quick. Nothing here is the real
// season's data. The build leaves this file out of Release (tools/build.js drops data-dev parts when STUDIO_CHANNEL is
// release), and even on Dev it only stands in for Season 1 while Dev: test season is switched on from the title.
// Each stand-in walks Still Harvest's town and ends from Start → Dev: finish case, through the real debrief.
(function(){
 const W='DEV ONLY · TEST SEASON';
 const card=(file,title,town,pin)=>({file,title,town,place:W,hook:['A stand-in case for the test season.','Start, then Dev: finish case, ends it.'],pin});
 const stand=(id,c)=>registerCase({id,card:c,
  opening:async()=>{await bigHatScene(async()=>{await say('BIG HAT','Stand-in case, '+c.title+'. Walk around, then Start, Dev: finish case.')});
   G.mode='world';goMap('town',14,16,'up');checkpoint();await fade(0)},
  next:()=>'Start, then Dev: finish case.',items:{},quiet:false,
  label:()=>'clean',facts:l=>({label:l,clues:[],saved:0,overstep:stepName(),san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),items:[],choices:{},tried:[],lost:[]}),
  debrief:{clues:[],lines:{clean:[['BIG HAT','Stand-in closed. Sit.']]},stories:[{name:'Nothing happened',skill:'Persuade',verb:'sell it',pass:[['BIG HAT','Nothing happened. Good.']]}],weak:{name:'Kids',pass:[]}}});
 stand('test-a',card(91,'STAND-IN A','TESTVILLE','#7fbf6a'));
 stand('test-b',card(92,'STAND-IN B','TESTVILLE','#3fb8a8'));
 stand('test-c',card(93,'STAND-IN C','TESTVILLE','#d9772b'));
 stand('test-l1',card(1,'STAND-IN AGENCY','RECORDS','#7a1a18'));
 stand('test-l2',card(2,'STAND-IN FINALE','RECORDS','#7a1a18'));
 registerSeason({id:'test',n:1,regular:['test-a','test-b','test-c'],agency:[{id:caseById('lantern-01')?'lantern-01':'test-l1',at:1},{id:'test-l2',at:2,finale:true}],  // a built first agency case stands in for test-l1, so its real unlock can be tried (spec 014)
  text:{unlock:{'lantern-01':(SEASONS[1]&&SEASONS[1].text.unlock['lantern-01'])||[],'test-l1':['Test agency case. It pins on now.'],'test-l2':['Test finale. It pins on now.']},end:['Test season over.']}});
})();
