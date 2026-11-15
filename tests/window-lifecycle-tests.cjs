const assert=require('node:assert/strict');
const {focusOrCreate}=require('../desktop/window-lifecycle.cjs');
let created=0;const create=()=>{created++;return 'new';};
assert.equal(focusOrCreate(null,create),'new');
assert.equal(focusOrCreate({isDestroyed:()=>true,isMinimized:()=>{throw Error('Destroyed object accessed');}},create),'new');
assert.equal(created,2);
const calls=[];const valid={isDestroyed:()=>false,isMinimized:()=>true,restore:()=>calls.push('restore'),show:()=>calls.push('show'),focus:()=>calls.push('focus')};
assert.equal(focusOrCreate(valid,create),valid);assert.deepEqual(calls,['restore','show','focus']);assert.equal(created,2);
console.log('PASS: closed/destroyed main windows recreate safely; an existing minimized window is restored without a duplicate.');
