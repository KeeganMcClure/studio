// Rushlight · content/stub.js
// Placeholder content so the forked engine boots with no Black Lantern case.
// The engine still expects these names from a content file; the vertical slice replaces this file.
const MAPS={};
let MAZE=null;
const townClues=()=>0;
async function bossIntro(){}
async function caseOpening(){
 await say('','Rushlight. The build is set up; the vertical slice starts here.');
 // No map yet, so nothing to checkpoint: back to the title without saving.
 store.set(B.key('game'),null);leave();B.goto('title');B.render();
}
