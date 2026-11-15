const assert=require('node:assert/strict');
const {sync,submissionStatus}=require('../desktop/moodle-api.cjs');
const {infer}=require('../semesters.js');
const fixedNow=Date.parse('2026-11-14T12:00:00+08:00');
assert.equal(infer({name:'CST108 2026/09'},fixedNow,'https://l.xmu.edu.my').kind,'current');
assert.equal(infer({name:'Old 202604',lastaccess:fixedNow/1000},fixedNow,'https://l.xmu.edu.my').kind,'past');
assert.equal(infer({name:'CST108 202609'},Date.parse('2027-01-10'),'https://l.xmu.edu.my').kind,'current');
assert.equal(infer({name:'Undated'},fixedNow,'https://l.xmu.edu.my').kind,'unknown');
assert.equal(infer({name:'Active',startdate:fixedNow/1000-1000,enddate:fixedNow/1000+1000},fixedNow,'https://campus.example').kind,'current');
const names=['core_enrol_get_users_courses','core_course_get_contents','mod_assign_get_assignments','mod_assign_get_submission_status','mod_forum_get_forums_by_courses','mod_forum_get_forum_discussions','gradereport_user_get_grade_items','core_calendar_get_calendar_events','mod_quiz_get_quizzes_by_courses','mod_quiz_get_user_attempts','message_popup_get_popup_notifications'];
async function fixture(name,args){
 if(name==='core_webservice_get_site_info')return {userid:7,functions:names.map(name=>({name}))};
 if(name==='core_enrol_get_users_courses')return [{id:3,fullname:'Example course'}];
 if(name==='core_course_get_contents')return [{modules:[{id:9,name:'Example PDF',modname:'resource',url:'https://campus.example/mod/resource/view.php?id=9'}]}];
 if(name==='gradereport_user_get_grade_items')return {usergrades:[{gradeitems:[{itemtype:'course',gradeformatted:'18 / 25'},{itemtype:'mod',itemname:'Lab',gradeformatted:'8 / 10'}]}]};
 if(name==='mod_assign_get_assignments')return {courses:[{id:3,assignments:[{id:1,cmid:10,name:'A',duedate:2000},{id:2,cmid:11,name:'Team',teamsubmission:1}]}]};
 if(name==='mod_assign_get_submission_status')return {lastattempt:{submission:{status:args.assignid===1?'draft':'new'},teamsubmission:{status:'submitted'}}};
 if(name==='mod_forum_get_forums_by_courses')return [{id:1,course:3,name:'Announcements',type:'news'}];
 if(name==='mod_forum_get_forum_discussions')return {discussions:args.page===0?Array.from({length:100},(_,id)=>({discussion:id+1,name:'Notice'})):[{discussion:101,name:'Last notice'}]};
 if(name==='message_popup_get_popup_notifications')return {notifications:[{id:1,subject:'Personal notice',fullmessage:'Details'}]};
 if(name==='mod_quiz_get_quizzes_by_courses')return {quizzes:[]};
 if(name==='core_calendar_get_calendar_events')return {events:[]};
 throw Error('Unexpected request '+name);
}
(async()=>{
 assert.equal(submissionStatus({lastattempt:{}},{}),'pending');
 assert.equal(submissionStatus({lastattempt:{teamsubmission:null}},{teamsubmission:1}),'pending');
 assert.equal(submissionStatus(null,{}),'unknown');
 assert.equal(submissionStatus({lastattempt:{submission:{status:'unrecognized'}}},{}),'unknown');
 const data=await sync(fixture,{site:'https://campus.example'});
 assert.equal(data.assignments[0].status,'draft');assert.equal(data.assignments[1].status,'submitted');
 assert.equal(data.assignments[0].url,'https://campus.example/mod/assign/view.php?id=10');
 assert.equal(data.courses[0].grade,'18 / 25');assert.equal(data.courses[0].gradeItems[1].value,'8 / 10');
 assert.equal(data.notices.length,102);assert.equal(data.notices.at(-1).source,'Moodle 个人通知');
 const degraded=await sync(async(name,args)=>{if(name==='core_course_get_contents')throw Error('Course denied');return fixture(name,args);},{site:'https://campus.example'});
 assert.equal(degraded.materials.length,0);assert.ok(degraded.warnings.includes('Course denied'));assert.equal(degraded.assignments.length,2);
 console.log('PASS: submission semantics, team status, connected-school URLs, raw grade details, announcement pagination, personal notifications, partial-failure coverage');
})().catch(error=>{console.error(error);process.exitCode=1;});
