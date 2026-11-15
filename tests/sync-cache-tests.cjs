const assert=require('node:assert/strict');
const {accountKey,responseKey,cachedResponse,mapLimit}=require('../desktop/sync-cache.cjs');
(async()=>{
 const one={site:'https://campus.example',token:'fictional-one'},two={...one,token:'fictional-two'};
 assert.notEqual(accountKey(one),accountKey(two));
 assert.notEqual(accountKey(one),accountKey({...one,site:'https://other.example'}));
 const entries=new Map([[responseKey('core_course_get_contents',{courseid:1}),{time:1000,value:['course contents']}] ]);
 assert.equal(cachedResponse(entries,'core_course_get_contents',{courseid:1},2000).hit,true);
 assert.equal(cachedResponse(entries,'core_course_get_contents',{courseid:2},2000).hit,false);
 assert.equal(cachedResponse(entries,'core_course_get_contents',{courseid:1},1000+6*3600000).hit,false);
 entries.set(responseKey('mod_assign_get_submission_status',{assignid:1}),{time:1000,value:'stale'});
 assert.equal(cachedResponse(entries,'mod_assign_get_submission_status',{assignid:1},1001).hit,false);
 let active=0,max=0;
 const result=await mapLimit([1,2,3,4,5,6],3,async n=>{active++;max=Math.max(max,active);await new Promise(resolve=>setTimeout(resolve,5));active--;return n*2;});
 assert.deepEqual(result,[2,4,6,8,10,12]);assert.equal(max,3);
 console.log('PASS: account-isolated cache keys, content reuse/expiry, fresh submission states, bounded parallelism and stable results.');
})().catch(error=>{console.error(error);process.exitCode=1;});
