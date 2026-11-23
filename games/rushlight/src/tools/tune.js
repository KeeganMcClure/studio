// Tuning checks (each slice spec's "The tuning check"): simulated fights in the real build, auto-played, on 3 seeds.
// The company is the seed's own Free Company at level 1, fresh for each fight; foes are the bible's cards.
// Usage: node tools/build.js && node tools/tune.js [part]   (part: b, c, d, e; all by default)
// Prints the numbers; it never changes a card. Results go to dev-notes.md.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const SEEDS = ['0001-A', '4242-C', '9021-M'];
const want = process.argv[2] || 'all';
const SCEN = {
  // the order parts print in: b, c, d1, d2, e
  b: [
    ['felled tree: 3 road bandits', 'tree', "()=>[0,1,2].map(()=>RLG._t.foe('bandit'))", {}],
    ['felled tree, Ambushed', 'treeA', "()=>[0,1,2].map(()=>RLG._t.foe('bandit'))", { battle: { ambush: true } }],
    ['night attack: 2 road bandits', 'night', "()=>[0,1].map(()=>RLG._t.foe('bandit'))", {}],
    ['night attack: the rooks', 'rooks', "()=>[0,1,2,3].map(()=>RLG._t.foe('rook'))", {}],
  ],
  d1: [
    ['Pell: 2 road bandits, then Pell (HP 22, DEX 16, 50%, 1d4+1)', 'pell', "[()=>[RLG._t.foe('bandit'),RLG._t.foe('bandit')],()=>[Object.assign(RLG._t.foe('bandit'),{name:'Pell',lvl:3,hp:22,dex:16,hit:50,dmg:'1d4+1',nerve:'Skittish',target:true})]]", { seq: true, battle: { bounty: true } }],
  ],
  d2: [
    ['the Withy Hag: 3 road bandits and the Veteran leader', 'hag', "[()=>[Object.assign(RLT_FOE('bandit'),{quirk:'Veteran',noQuirk:true,name:'The Withy Hag'}),RLT_FOE('bandit'),RLT_FOE('bandit'),RLT_FOE('bandit')]]".replace(/RLT_FOE/g,'RLG._t.foe'), { seq: true }],
    ['the wool buyer: the felled tree with the client in it (HP 12, 1 in 4 attacks)', 'wool', "[()=>[RLG._t.foe('bandit'),RLG._t.foe('bandit'),RLG._t.foe('bandit')]]", { seq: true, client: true, crit: 'client' }],
    ['the Noonwife at level 2, careful (the sexton -15% HP, no Question)', 'noonP', "[()=>[{name:'The Noonwife',base:'The Noonwife',kind:'Unnatural',lvl:3,hp:49,dex:16,hit:60,dmg:'1d4+2',sprite:'noonwife',faceless:true,target:true,ai:'noon',horror:{tier:'Disturbing',id:'nw'+Math.random()}}]]", { seq: true, level: 2, battle: { target: true, noQuestion: true, countdown: { label: 'NOON BELL', n: 12 }, mercPre: 'noonMerc' }, crit: 'target' }],
    ['the Noonwife at level 2, no prep', 'noonN', "[()=>[{name:'The Noonwife',base:'The Noonwife',kind:'Unnatural',lvl:3,hp:58,dex:16,hit:60,dmg:'1d4+2',sprite:'noonwife',faceless:true,target:true,ai:'noon',horror:{tier:'Disturbing',id:'nw'+Math.random()}}]]", { seq: true, level: 2, battle: { target: true, countdown: { label: 'NOON BELL', n: 12 }, mercPre: 'noonMerc' }, crit: 'target' }],
    ['Severa by day (Stunned, in the rafters)', 'owlD', "[()=>[{name:'Severa',base:'Severa',kind:'Beast',lvl:3,hp:20,dex:18,hit:55,dmg:'1d4+1',sprite:'severa',nerve:'Skittish',ai:'owl',onHurt:true,fits:['Old','Maneater']}]]", { seq: true, battle: { stunFirst: true, rafters: true, setFight: true, mercPre: 'owlMerc' }, crit: 'owl' }],
    ['Severa by night (she acts first, Silent wing)', 'owlN', "[()=>[{name:'Severa',base:'Severa',kind:'Beast',lvl:3,hp:20,dex:18,hit:55,dmg:'1d4+1',sprite:'severa',nerve:'Skittish',ai:'owl',onHurt:true,fits:['Old','Maneater'],lurker:true,silent:true}]]", { seq: true, battle: { setFight: true, mercPre: 'owlMerc' }, crit: 'owl' }],
    ['the Counter at level 2, careful (muffled, nest burned -15%)', 'countP', "[()=>[{name:'The Counter',base:'The Counter',kind:'Unnatural',lvl:3,hp:41,dex:18,hit:65,dmg:'1d6+2',sprite:'counter',faceless:true,target:true,ai:'counter',horror:{tier:'Disturbing',id:'ct'+Math.random()}}]]", { seq: true, level: 2, battle: { target: true, stunFirst: true }, crit: 'target' }],
    ['the Counter at level 2, no prep', 'countN', "[()=>[{name:'The Counter',base:'The Counter',kind:'Unnatural',lvl:3,hp:48,dex:18,hit:65,dmg:'1d6+2',sprite:'counter',faceless:true,target:true,ai:'counter',horror:{tier:'Disturbing',id:'ct'+Math.random()}}]]", { seq: true, level: 2, battle: { target: true }, crit: 'target' }],
  ],
  e: [
    ['the Hollow Monk at level 3, careful (pumps -15% and no rising, the greeting, a church-lit lamp)', 'monkP', "[()=>[{name:'The Hollow Monk',base:'The Hollow Monk',kind:'Unnatural',lvl:4,hp:66,dex:12,hit:60,dmg:'1d4+2',sprite:'monk',target:true,great:true,ai:'monk',onHurt:true,onZero:true,horror:{tier:'Severe',id:'mk'+Math.random()}}]]", { seq: true, level: 3, den: { pumps: true }, kit: "p=>p[0].slots.push({id:'churchlamp',n:1})", battle: "()=>({target:true,great:true,extraMoves:m=>[...(!Bt.greetUsed?[{label:'Greet him',run:async mm=>{Bt.greetUsed=true;Bt.greeted=mm}}]:[])]})", crit: 'target' }],
    ['the Hollow Monk at level 3, no prep (he rises once)', 'monkN', "[()=>[{name:'The Hollow Monk',base:'The Hollow Monk',kind:'Unnatural',lvl:4,hp:78,dex:12,hit:60,dmg:'1d4+2',sprite:'monk',target:true,great:true,ai:'monk',onHurt:true,onZero:true,horror:{tier:'Severe',id:'mk'+Math.random()}}]]", { seq: true, level: 3, den: { pumps: false }, battle: "()=>({target:true,great:true,extraMoves:m=>[...(Bt.lampOut&&m.slots.some(s=>['torch','lantern','rushbundle'].includes(s.id))?[{label:'Light a lamp',run:async()=>{Bt.lampOut=false}}]:[])]})", crit: 'target' }],
  ],
  c: [
    ['the reeve\'s men or bounty hunters: 2 men-at-arms', 'maa', "()=>[0,1].map(()=>RLG._t.foe('manatarms'))", {}],
  ],
};
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('page error:', e.message));
  await page.goto(url); await page.waitForTimeout(500);
  for (const part of Object.keys(SCEN)) {
    if (want !== 'all' && want !== part) continue;
    for (const [label, , mk, o] of SCEN[part]) {
      console.log(`\nPart ${part.toUpperCase()} · ${label}`);
      for (const seed of SEEDS) {
        if (o.seq) {
          const rows = await page.evaluate(async ([s, mk, o]) => { if (typeof o.battle === 'string') o.battle = eval(o.battle); if (typeof o.kit === 'string') o.kit = eval(o.kit); if (o.battle && o.battle.mercPre) o.battle.mercPre = window[o.battle.mercPre] || eval(o.battle.mercPre); return await RLG._t.simSeq(s, eval(mk), 20, o); }, [seed, mk, o]);
          const n = rows.length, ok = rows.filter(r => r.downed <= 1 && !r.dead).length;
          if (o.client) { console.log(`  ${seed}: the client lived in ${rows.filter(r => r.clientAlive).length}/${n} runs · won ${rows.filter(r => r.won).length}/${n} · deaths ${rows.reduce((a, r) => a + r.dead, 0)}`); continue; }
          console.log(`  ${seed}: won ${rows.filter(r => r.won).length}/${n} · Downed per run ${(rows.reduce((a, r) => a + r.downed, 0) / n).toFixed(2)} · runs with at most 1 merc Downed and nobody dead ${ok}/${n} (${Math.round(ok / n * 100)}%) · deaths ${rows.reduce((a, r) => a + r.dead, 0)} · rounds ${(rows.reduce((a, r) => a + r.rounds, 0) / n).toFixed(1)} · SAN lost ${(rows.reduce((a, r) => a + r.san, 0) / n).toFixed(1)}`);
          continue;
        }
        const rows = await page.evaluate(async ([s, mk, o]) => await RLG._t.sim(s, eval(mk), 20, o), [seed, mk, o]);
        const n = rows.length, avg = k => (rows.reduce((a, r) => a + r[k], 0) / n).toFixed(1);
        console.log(`  ${seed}: wins ${rows.filter(r => r.res === 'win').length}/${n} · fights with a merc Downed ${rows.filter(r => r.downs).length} · ` +
          `HP lost ${avg('hpLost')} · rounds ${avg('rounds')} (max ${Math.max(...rows.map(r => r.rounds))}) · rations taken ${avg('taken')} (net ${avg('netRations')})`);
      }
    }
  }
  await browser.close();
})();
