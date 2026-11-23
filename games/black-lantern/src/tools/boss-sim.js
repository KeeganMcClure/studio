// Boss simulator (Combat → Bosses, Tuning check). Runs the REAL battle code: it loads the built dist/index.html in
// Chromium, starts a team from a template, then for each fight resets to that checkpoint, sets the case's choices
// (victims saved, names, cider...), and calls the case's own boss entry, so the story's set-up (horrors before the
// fight, the boss's moves and phases for this run) and every battle rule are the game's own.
// Time is sped up in the page (timers fire at once, no drawing, dialog boxes close themselves), and an AI answers the
// battle's own menus (uiWait in battle.js) in place of a player. Two AI players:
//   careful  heals or revives when an agent is low or Downed, Slips or Defends when low with no heal coming, braces
//            for known horrors when WP allows, uses Aimed shot and Spot weak point when they pay, and throws Molotovs at
//            things that burn (only if the team has one; see --give)
//   plain    Fight only, plus meds (items) when an agent is low: the bible's earlier simulator
// Usage (after npm run build):
//   node tools/boss-sim.js [--boss gleaner] [--team "FIELD TEAM"] [--n 300] [--seed 1] [--ai careful,plain]
//                          [--only <scenario label part>] [--give 0:molotov,1:firstaid] [--json] [--trace]
//                          [--patch "<js: types, o, E>"]   (try numbers without editing the case; e.g. "o.hp+=5")
// Add a later case's boss to BOSSES below: its case id, the scenarios to run (the case's weakening choices), and a
// setup that sets those choices in the page before the case's boss entry runs.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');

// ---- the bosses. setup runs in the page (plain game globals: G, party...), with the scenario as its argument ----
const BOSSES = {
  gleaner: {
    case: 'still-harvest',
    entry: 'bossIntro',  // still-harvest.js: the fourth likeness (if the names are live), the lines, then battle()
    // the case's choices that change the fight: victims cut down (−HP each), the deduction (right = no names),
    // and the cider (names hit 1/1d6 instead of 1/1d4). By default the names are live and the cider isn't drunk.
    scenarios: [
      { label: '0 saved', rescued: 0, names: true, cider: false },
      { label: '0 saved, cider', rescued: 0, names: true, cider: true },
      { label: '0 saved, deduced', rescued: 0, names: false, cider: false },
      { label: '3 saved', rescued: 3, names: true, cider: false },
      { label: '3 saved, cider', rescued: 3, names: true, cider: true },
      { label: '3 saved, deduced', rescued: 3, names: false, cider: false },
    ],
    setup: s => { G.rescued = s.rescued; G.flags.deduce = s.names ? 'wrong' : 'right'; G.flags.cider = s.cider ? 1 : 0; delete G.flags.fourthSeen; },
  },
  // Good Manners (spec 010 part B): its weakening choices are Tanner kept (−8 HP, no Mimic), the copybook taken (no class
  // laugh in phase 1) or read aloud (also −8 HP and no phase-2 heal), and Voss tearing up his copy (−6 HP). The lesson
  // on the curb makes Identify free. "all" makes every choice.
  graduate: {
    case: 'good-manners',
    entry: 'gmBoss',  // good-manners.js: bossFight without the ending
    scenarios: [
      { label: 'none' },
      { label: 'kept', kept: 1 },
      { label: 'book taken', book: 'taken' },
      { label: 'book aloud', book: 'aloud' },
      { label: 'kept, aloud', kept: 1, book: 'aloud' },
      { label: 'all', kept: 1, book: 'aloud', torn: 1, lesson: 1 },
    ],
    setup: s => { const F = G.flags; F.ph = 3; F.kept = s.kept ? 1 : 0; F.book = s.book || null; F.voss = s.torn ? 'torn' : null;
      G.clues = G.clues.filter(c => c.id !== 'lesson'); if (s.lesson) G.clues.push({ id: 'lesson', text: '' }); G.fs.ident = []; goMap('under', 10, 5, 'up'); },
  },
  // Lot 83 (spec 011 part B): its weakening choices are Walt talked down (−8 HP, no "Gracie" heal), its name read in
  // the books (−6 HP, no phase-2 heal), and the jars: Unit 6's iced (two fewer feeding heals) and the crawler's jar
  // stopped (one fewer). Ledger 83 makes Identify free. "all" makes every choice.
  lodger: {
    case: 'lot-83',
    entry: 'l83Boss',  // lot-83.js: bossFight without the ending
    scenarios: [
      { label: 'none' },
      { label: 'walt', walt: 1 },
      { label: 'read', read: 1 },
      { label: 'jars', iced: 1, crawler: 1 },
      { label: 'walt, jars', walt: 1, iced: 1, crawler: 1 },
      { label: 'all', walt: 1, read: 1, iced: 1, crawler: 1, ledger: 1 },
    ],
    setup: s => { const F = G.flags; F.ph = 1; F.walt = s.walt ? 'down' : null; F.read = s.read ? 1 : 0; F.iced = s.iced ? 1 : 0; F.crawler = s.crawler ? 1 : 0; F.cold = 0; delete F.pulled;
      G.clues = G.clues.filter(c => c.id !== 'ledger'); if (s.ledger) G.clues.push({ id: 'ledger', text: '' }); G.fs.ident = []; goMap('pump', 8, 5, 'up'); },
  },
  // Lost Hour (spec 016 part B): its weakening choices are the count (memory 1 and 2: −8 HP, a lost first turn on a good
  // roll, no phase-2 fog shield), the headlights (−6 HP, no Lamp heals; flares only dim them) and the card given back
  // (−6 HP, a free round). Who carries the tally matters too: Ray (bait) can be taken by two holds, which ends the fight
  // "won" but is the worst ending, so the table counts those apart; the tally cut out leaves it no Take and −1 damage.
  // "all" makes every choice.
  surveyor: {
    case: 'lost-hour',
    entry: 'lhBoss',  // lost-hour.js: bossFight without the ending
    scenarios: [
      { label: 'none (Ray)', carrier: 'ray' },
      { label: 'none (cut)', carrier: 'cut' },
      { label: 'count (Ray)', carrier: 'ray', count: 1 },
      { label: 'lights (Ray)', carrier: 'ray', light: 'car' },
      { label: 'flares (Ray)', carrier: 'ray', light: 'flares' },
      { label: 'card (Ray)', carrier: 'ray', card: 1 },
      { label: 'all (Ray)', carrier: 'ray', count: 1, light: 'car', card: 1 },
      { label: 'all (cut)', carrier: 'cut', count: 1, light: 'car', card: 1 },
    ],
    setup: s => { const F = G.flags; F.ph = 3; F.carrier = s.carrier; F.light = s.light || null; F.unfolded = s.card ? 1 : 0; delete F.taken; delete F.takenAgent; delete F.folded; delete F.revenge;
      G.clues = G.clues.filter(c => !['memory1', 'memory2'].includes(c.id)); if (s.count) G.clues.push({ id: 'memory1', text: '' }, { id: 'memory2', text: '' }); G.fs.ident = []; goMap('field', 15, 12, 'up'); },
  },
  // LANTERN 01 (spec 014 part B): its weakening choices are his service record in hand (−6 HP; reading his name, here
  // taken as read in phase 1, drops phase 2's shield), the Psalter's page burned (−8 HP, no phase-2 heal) and the right
  // deduction (−6 HP, Identify free, and the van's brine: its weakness, 3 throws). "all" makes every choice. An agency
  // case isn't on the board until it unlocks, so prep pins it first (as the Dev shortcut does).
  tenant: {
    case: 'lantern-01',
    entry: 'l01Boss',  // lantern-01.js: bossFight without the ending
    prep: () => { const s = loadSeason(); if (!s.agency.some(a => a.id === 'lantern-01')) s.agency.push({ id: 'lantern-01', played: true }); s.cases['lantern-01'] = { file: 1, state: 'open', ending: null }; store.set(seasonKey(), s); },
    scenarios: [
      { label: 'none' },
      { label: 'record read', record: 1, named: 1 },
      { label: 'burned', burn: 1 },
      { label: 'brine', brine: 1 },
      { label: 'all', record: 1, named: 1, burn: 1, right: 1, brine: 1 },
    ],
    setup: s => { const F = G.flags; F.ph = 1; F.coat = 1; F.canIn = 1; F.named = s.named ? 1 : 0; F.talked = 0; F.burn = s.burn ? 'safe' : null; F.deduce = s.right ? 'right' : 'half';
      G.clues = G.clues.filter(c => c.id !== 'record'); if (s.record) G.clues.push({ id: 'record', text: '' }); G.fs.ident = [];
      if (s.brine) gearOf(party[0]).it.push(newItem('brine')); goMap('cannery', 12, 4, 'up'); },
  },
  // Tracking (spec 018 part B): its weakening choices are the copies burned (−2 HP each, and no heals: each copy not
  // burned is a door she heals 5 through, up to 3), the stage lights woken (no −10 to hit her while she dances), her name
  // said (−6 HP, no second-phase speed) and the chant read backward (−8 HP). Each watch of the tape adds 2 HP, and 3 or
  // more make her faster. "all" makes every choice; the case's budget is a team that watches once or twice.
  vesper: {
    case: 'tracking',
    entry: 'trkBoss',  // tracking.js: bossFight without the ending
    scenarios: [
      { label: 'none, 1 watch', w: 1 },
      { label: 'none, 0 watches', w: 0 },
      { label: 'none, 4 watches', w: 4 },
      { label: 'burned all', w: 1, burned: 5 },
      { label: 'lights', w: 1, lights: 1 },
      { label: 'name, chant', w: 1, name: 1, read: 1 },
      { label: 'all, 1 watch', w: 1, burned: 5, lights: 1, name: 1, read: 1 },
      { label: 'all, 2 watches', w: 2, burned: 5, lights: 1, name: 1, read: 1 },
    ],
    setup: s => { const F = G.flags; F.ph = 3; F.trk = s.w; F.cp = {}; ['bin', 'wes', 'travis', 'gideon', 'bar'].forEach((k, i) => { F.cp[k] = i < (s.burned || 0) ? 'burned' : 'royce'; });
      F.lights = s.lights ? 1 : 0; F.darlene = s.name ? 1 : 0; F.read = s.read ? 1 : 0; F.knowLight = s.w >= 2 ? 1 : 0; F.boss = 0; G.fs.ident = []; goMap('dub', 8, 6, 'up'); },
  },
  // Dead Air (spec 020 part B): its weakening choices are the 3/9/79 cart burned (−8 HP, no callers), Emile's name said
  // on the air (−8 HP, no phase-2 heal) and a dead carrier keyed with the crystal (−6 HP, the first dead air fails, and
  // the circle can't take anyone). The guest mic makes Identify free. "all" makes every choice.
  nightline: {
    case: 'dead-air',
    entry: 'daBoss',  // dead-air.js: bossFight without the ending
    scenarios: [
      { label: 'none' },
      { label: 'burn', burn: 1 },
      { label: 'name', name: 1 },
      { label: 'carrier', carrier: 1 },
      { label: 'burn, name', burn: 1, name: 1 },
      { label: 'all', burn: 1, name: 1, carrier: 1, ebooth: 1 },
    ],
    setup: s => { const F = G.flags; F.ph = 3; F.burn = s.burn ? 1 : 0; F.name = s.name ? 1 : 0; F.carrier = s.carrier ? 1 : 0; F.boss = 0; F.named = null;
      F.woke = {}; F.taken = null; F.circle = 1; F.lucien = 'safe';
      G.clues = G.clues.filter(c => c.id !== 'ebooth'); if (s.ebooth) G.clues.push({ id: 'ebooth', text: '' }); G.fs.ident = []; goMap('radials', 11, 12, 'up'); },
  },
};

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : d; };
const bossId = opt('boss', 'gleaner'), BOSS = BOSSES[bossId];
if (!BOSS) { console.error('Unknown boss: ' + bossId + ' (known: ' + Object.keys(BOSSES).join(', ') + ')'); process.exit(1); }
const N = +opt('n', 300), SEED = +opt('seed', 1), TEAM = opt('team', 'FIELD TEAM');
const AIS = String(opt('ai', 'careful,plain')).split(',');
const ONLY = opt('only', null), JSONOUT = !!opt('json', false);
const PATCH = opt('patch', null);  // JS run before each fight, e.g. --patch "o.hp+=5; E.gleaner.hit=60" (see installPage)
const TRACE = !!opt('trace', false);  // print one fight's battle lines (the first AI and scenario), to check the AI's play
const GIVE = String(opt('give', '')).split(',').filter(Boolean).map(s => { const [i, k] = s.split(':'); return { i: +i, k }; });

// ---- in the page: speed up time, quiet the dialog, and plug the AI into the battle's menus ----
function installPage() {
  // timers fire at once (in order, on the next task); no frames are drawn
  const ch = new MessageChannel(), q = new Map(); let id = 1e6;
  ch.port1.onmessage = e => { const f = q.get(e.data); if (f) { q.delete(e.data); f(); } };
  window.setTimeout = (f, ms, ...a) => { const i = ++id; q.set(i, () => f(...a)); ch.port2.postMessage(i); return i; };
  window.clearTimeout = i => q.delete(i);
  cancelAnimationFrame(raf); window.requestAnimationFrame = () => 0;
  // seeded dice, so a run can be repeated
  let s = 1; window.__seed = v => { s = v >>> 0 || 1; };
  Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  // dialog boxes and menus outside the battle's own: lines close at once; a brace question asks the AI; other
  // menus (a Breaking Point's choice) take the first row
  window.__log = [];
  const note = t => { if (window.__trace) window.__log.push(String(t)); };
  say = (name, text) => { note((name ? name + ': ' : '') + text); return Promise.resolve(); };
  const bs = bsay; bsay = (t, ms) => { note('  ' + t); return bs(t, ms); };
  ask = async (name, text, opts) => (window.__ai && window.__ai.ask ? window.__ai.ask(name, text, opts) : opts.length - 1);
  choose = async () => 0;
  checkpoint = () => {}; gameOver = async () => {}; if (typeof ending === 'function') ending = async () => {};
  fade = async () => {};
  // --patch: try other numbers without a rebuild; runs just before the fight starts, as (types, o, E) with the case's
  // enemy cards E and battle()'s options o (o.hp is the boss's HP this run)
  const bt = battle; battle = (types, o = {}) => { if (window.__patch) window.__patch(types, o, caseById(G.case).enemies); return bt(types, o); };
  // record each fight as it ends, before endBattle tidies up
  const endB = endBattle;
  endBattle = async res => {
    const e = Bt.en[0];
    window.__last = { res, rounds: Bt.round, downed: party.filter(m => m.wasDowned).length, dead: party.filter(m => m.dead).length,
      snapped: party.filter(m => m.out || m.san <= 0).length, bossHp: e ? e.hp : 0, bossMax: e ? e.mhp : 0, phase2: Bt.phase === 2, taken: !!(G.flags && G.flags.taken),
      wpLeft: party.reduce((t, m) => t + (m.wp | 0), 0), sanLost: party.reduce((t, m) => t + ((m.san0 | 0) - (m.san | 0)), 0) };
    return endB(res);
  };

  // ---- the AI players ----
  const up = () => party.filter(m => !m.ko && !m.dead && !m.gone && !m.out);
  const boss = () => aliveFoes()[0];
  const hasIt = (m, k) => gearOf(m).it.find(it => it.k === k && it.u > 0);
  const HEALS = [['firstaid', 6], ['medkit', 6], ['painkillers', 4]];  // items that heal (heal6, heal4)
  const healItem = m => { for (const [k] of HEALS) { const it = hasIt(m, k); if (it) return it; } return null; };
  const itemsRow = (m, it) => gearOf(m).w.length + gearOf(m).it.indexOf(it);
  const mvList = m => MV.filter(mv => hasMove(m, mv));
  const canMove = (m, key) => { const mv = mvList(m).find(x => x.key === key); return mv && !moveWhy(m, mv) ? mv : null; };
  const skillRow = (m, key) => mvList(m).findIndex(x => x.key === key);
  // agents who act after m and before the boss acts again (for Exposed, which ends at the boss's next turn)
  function before(m) {
    const q = Bt.queue.slice(Bt.queue.indexOf(m) + 1), out = [];
    for (const x of q) { if (!x.a) return out; if (x !== m) out.push(x); }
    for (const x of turnOrder(false)) { if (!x.a) return out; if (x !== m) out.push(x); }
    return out;
  }
  // the damage an agent's next shot is worth: an Aimed shot (−20%, double) if they have it and the WP, else a Fight
  const shotValue = (x, e, mod) => { const W = x.w; const avg = (W.dmg[0] * (W.dmg[1] + 1)) / 2 + (W.bonus || 0);
    const plain = attackChance(x, e, W, mod, true) / 100 * avg, aim = canMove(x, 'aimed') ? attackChance(x, e, W, mod - 20) / 100 * avg * 2 : 0; return Math.max(plain, aim); };
  function careful(m) {
    const e = boss(), team = up(), dn = party.filter(x => x.ko && !x.dead && !x.gone);
    // a Downed teammate: Revive, or an Adrenaline shot
    if (dn.length) {
      if (canMove(m, 'revive')) return { c: 1, row: skillRow(m, 'revive'), t: dn[0] };
      const ad = hasIt(m, 'adrenaline'); if (ad) return { c: 2, row: itemsRow(m, ad), t: dn[0] };
    }
    // someone low: heal the lowest (a boss hit is 3–6, a crit up to 12)
    const low = team.filter(x => x.hp <= Math.min(6, x.mhp - 3)).sort((a, b) => a.hp - b.hp)[0];
    if (low) {
      const hi = healItem(m);
      if (low.hp <= 4 && hi) return { c: 2, row: itemsRow(m, hi), t: low };
      if (canMove(m, 'patch')) return { c: 1, row: skillRow(m, 'patch'), t: low };
      if (hi) return { c: 2, row: itemsRow(m, hi), t: low };
    }
    if (team.filter(x => x.hp <= x.mhp - 3).length >= 2 && canMove(m, 'triage')) return { c: 1, row: skillRow(m, 'triage') };
    // low with no heal coming from anyone: Slip (Dodge 40+) or Defend
    if (m.hp <= 4 && !team.some(x => x !== m && (canMove(x, 'patch') || healItem(x)))) return { c: 3, row: skillVal(m.a, 'Dodge') >= 40 ? 1 : 0 };
    if (!e) return { c: 0 };
    // salt water (a can of brine) against things that can't stand it
    const br = hasIt(m, 'brine'); if (br && e.weak === 'salt') return { c: 2, row: itemsRow(m, br), t: e };
    // fire against things that burn
    const mo = hasIt(m, 'molotov'); if (mo && ((e.tags || []).includes('burns') || e.weak === 'fire')) return { c: 2, row: itemsRow(m, mo), t: e };
    // Spot weak point when the agents acting before the boss's next turn gain more than this agent's own shot
    if (canMove(m, 'spot') && !chip(e, 'exposed')) {
      const gain = before(m).filter(x => !x.ko && !x.out).reduce((t, x) => t + shotValue(x, e, 20) - shotValue(x, e, 0), 0);
      if (gain * (chanceOf(m, 'Search') / 100) > shotValue(m, e, 0)) return { c: 1, row: skillRow(m, 'spot'), t: e };
    }
    // Aimed shot when double damage at −20% beats a plain shot, keeping 1 WP spare once the fight is half done
    if (canMove(m, 'aimed')) {
      const aimed = attackChance(m, e, m.w, -20) / 100 * 2, plain = attackChance(m, e, m.w, 0, true) / 100;
      if (aimed > plain && m.wp >= 1) return { c: 1, row: skillRow(m, 'aimed'), t: e };
    }
    return { c: 0, t: e };
  }
  function plain(m) {
    const team = up(), low = team.filter(x => x.hp <= 4).sort((a, b) => a.hp - b.hp)[0], hi = healItem(m);
    if (low && hi) return { c: 2, row: itemsRow(m, hi), t: low };
    return { c: 0, t: boss() };
  }
  const AI = { careful, plain };
  window.__useAI = name => {
    const pol = AI[name];
    window.__ai = {
      // brace for a known horror: careful agents with WP to spare do; plain ones don't
      ask: (who, text, opts) => (name === 'careful' && /brace/i.test(text) && (party.find(m => m.name.toUpperCase() === who) || {}).wp > 6 ? 0 : opts.length - 1),
    };
    uiWait = ui => {
      const m = ui.m; let r;
      if (ui.kind === 'cmd') {
        m.__tries = m.__turn === Bt.round ? (m.__tries | 0) + 1 : 0; m.__turn = Bt.round;
        m.__plan = m.__tries === 0 ? pol(m) : m.__tries === 1 ? { c: 0, t: boss() } : { c: 3, row: 0 };  // a plan that fails falls back to Fight, then Defend
        r = m.__plan.c;
        if (window.__trace) window.__log.push(`> ${m.name} ${m.hp}/${m.mhp} HP ${m.wp} WP: ${['Fight', 'Skills', 'Items', 'Guard'][r]}${m.__plan.row != null ? ' row ' + m.__plan.row : ''}${m.__plan.t ? ' → ' + m.__plan.t.name : ''}`);
      } else if (ui.kind === 'list') {
        const p = m.__plan || {}; const i = p.row; r = i != null && i >= 0 && ui.rows[i] && !ui.rows[i].dis ? i : -1;
      } else if (ui.kind === 'target') {
        const p = m.__plan || {}; r = ui.opts.includes(p.t) ? p.t : null;
        if (r == null) r = ui.opts.find(x => x.a ? !x.ko : true) || ui.opts[0] || null;
      } else if (ui.kind === 'msg') { r = undefined; }
      return Promise.resolve(r);
    };
  };
}

// one batch of fights in the page; returns the per-fight records
function runBatch({ cp, scen, ai, n, seed, entry, setupSrc, give, trace, patch }) {
  const setup = eval('(' + setupSrc + ')');
  window.__patch = patch ? eval('((types, o, E) => { ' + patch + ' })') : null;
  window.__trace = trace; window.__log = [];
  window.__useAI(ai); window.__seed(seed);
  return (async () => {
    const out = [];
    for (let i = 0; i < n; i++) {
      restore(cp); G.mode = 'world'; G.busy = 0;
      for (const g of give) { const m = party[g.i]; if (m) gearOf(m).it.push(newItem(g.k)); }
      setup(scen); window.__last = null;
      await window[entry]();
      out.push(window.__last || { res: 'none' });
      if (Bt) { Bt = null; G.mode = 'world'; }
    }
    return out;
  })();
}

const pct = x => (100 * x).toFixed(0) + '%';
function summarize(recs) {
  const n = recs.length, wins = recs.filter(r => r.res === 'win');
  const avg = (a, k) => a.length ? a.reduce((t, r) => t + r[k], 0) / a.length : 0;
  return {
    fights: n, win: wins.length / n, rounds: avg(recs, 'rounds'), winRounds: avg(wins, 'rounds'), downed: avg(recs, 'downed'),
    winLe1: wins.length ? wins.filter(r => r.downed <= 1).length / wins.length : 0, deaths: avg(recs, 'dead'),
    anyDeath: recs.filter(r => r.dead > 0).length / n, phase2: recs.filter(r => r.phase2).length / n,
    bossLeftOnLoss: avg(recs.filter(r => r.res !== 'win'), 'bossHp'), hp: recs[0] && recs[0].bossMax,
    ends: recs.reduce((t, r) => (t[r.res] = (t[r.res] || 0) + 1, t), {}), snapped: avg(recs, 'snapped'),
    taken: recs.filter(r => r.taken).length / n, winKept: recs.filter(r => r.res === 'win' && !r.taken).length / n,
  };
}

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 375, height: 667 } })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.dismiss());
  await page.goto(url); await page.waitForTimeout(600);
  // start the team from its template and tap through the briefing to the case's first checkpoint
  const row = t => page.locator('#list .row', { hasText: t }).first().click();
  await row('New game'); await page.waitForTimeout(150);
  await row(TEAM); await page.waitForTimeout(150);
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);  // Start on Your team: the case board
  if (BOSS.prep) await page.evaluate(BOSS.prep);
  await page.evaluate(id => { const i = boardTargets(boardLayout()).findIndex(t => t.id === id); if (i >= 0) CB.sel = i; }, BOSS.case);  // the boss's case card
  for (let i = 0; i < 400 && !await page.evaluate(() => !!localStorage.getItem('bl.game')); i++) { await page.keyboard.press('z'); await page.waitForTimeout(50); }
  const cp = await page.evaluate(() => localStorage.getItem('bl.game'));
  if (!cp) throw new Error('No checkpoint: the team never reached the case');
  const cs = JSON.parse(JSON.parse(cp));
  if (cs.case !== BOSS.case) throw new Error(`The checkpoint is in ${cs.case}, not ${BOSS.case}`);
  for (let i = 0; i < 40; i++) { await page.keyboard.press('x'); await page.waitForTimeout(30); }
  await page.evaluate(installPage);
  const team = await page.evaluate(() => party.map(m => `${m.name} (${profOf(m.a).name}) ${m.hp} HP ${m.wp} WP, ${m.w.name}`).join(' · '));
  if (!JSONOUT) console.log(`Boss: ${bossId} · team: ${TEAM}: ${team}${GIVE.length ? ' · given: ' + GIVE.map(g => g.i + ':' + g.k).join(', ') : ''} · ${N} fights each, seed ${SEED}`);

  const results = [];
  const scens = BOSS.scenarios.filter(s => !ONLY || s.label.includes(ONLY));
  outer: for (const ai of AIS) for (const scen of scens) {
    const t0 = Date.now();
    const recs = await page.evaluate(runBatch, { cp: JSON.parse(cp), scen, ai, n: TRACE ? 1 : N, seed: SEED, entry: BOSS.entry, setupSrc: BOSS.setup.toString(), give: GIVE, trace: TRACE, patch: PATCH });
    if (TRACE) { console.log((await page.evaluate(() => window.__log)).join('\n')); console.log(JSON.stringify(recs[0])); break outer; }
    const s = Object.assign({ ai, scenario: scen.label }, summarize(recs), { secs: (Date.now() - t0) / 1000 });
    results.push(s);
    if (!JSONOUT) console.log(`${ai.padEnd(8)} ${scen.label.padEnd(18)} HP ${String(s.hp).padStart(2)} · win ${pct(s.win).padStart(4)} · rounds ${s.rounds.toFixed(1).padStart(4)} (wins ${s.winRounds.toFixed(1)}) · Downed ${s.downed.toFixed(2)} · wins with ≤1 Downed ${pct(s.winLe1).padStart(4)} · deaths ${s.deaths.toFixed(2)} (a death in ${pct(s.anyDeath)}) · boss HP left on a loss ${s.bossLeftOnLoss.toFixed(1)}${s.taken ? ` · carrier taken ${pct(s.taken)} (won and kept ${pct(s.winKept)})` : ''} · ${s.secs.toFixed(0)}s`);
  }
  if (JSONOUT) console.log(JSON.stringify(results, null, 1));
  if (errors.length) { console.error('Page errors:\n' + [...new Set(errors)].join('\n')); process.exitCode = 1; }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
