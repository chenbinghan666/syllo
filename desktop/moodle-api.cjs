const {mapLimit}=require('./sync-cache.cjs');
function submissionStatus(state,assignment){
 const attempt=state?.lastattempt;
 if(!attempt)return 'unknown';
 const submission=assignment.teamsubmission?attempt.teamsubmission:attempt.submission;
 const raw=submission?.status;
 if(raw==='submitted')return 'submitted';
 if(raw==='draft')return 'draft';
 if(raw==='new'||raw==='reopened')return 'pending';
 // Moodle omits the submission property completely when there is no record.
 if(!submission)return 'pending';
 return 'unknown';
}
async function sync(api,profile,progress=()=>{},services={}){
 const data={courses:[],assignments:[],materials:[],notices:[],quizzes:[],events:[],warnings:[],syncedAt:Date.now(),mode:'live'};
 const info=await api('core_webservice_get_site_info');
 data.accountId=info.userid;
 const functions=new Set((info.functions||[]).map(x=>x.name));
 const read=async(name,args)=>{if(!functions.has(name))throw Error('账号未开放接口 '+name);return api(name,args);};
 const optional=async(name,args,fallback)=>{try{return await read(name,args);}catch(e){data.warnings.push(e.message);return fallback;}};
 progress('读取课程…');
 const rawCourses=await read('core_enrol_get_users_courses',{userid:info.userid});
 data.courses=rawCourses.map(c=>({id:String(c.id),name:c.fullname,shortname:c.shortname||'',startdate:c.startdate||0,enddate:c.enddate||0,lastaccess:c.lastaccess||0,coverUrl:c.courseimage||c.overviewfiles?.find(f=>f.mimetype?.startsWith('image/'))?.fileurl||'',image:'',grade:'—',url:profile.site+'/course/view.php?id='+c.id,gradeUrl:profile.site+'/grade/report/user/index.php?id='+c.id}));
 const courseMap=new Map(data.courses.map(c=>[Number(c.id),c]));
 const item=(x,course)=>({id:String(x.id),title:x.name||x.subject||x.title||'',courseId:course?.id||'',course:course?.name||'',url:x.url||'',source:'Moodle 官方接口'});
 await mapLimit(data.courses,4,async c=>{
  progress('整理课程：'+c.name);
  const [sections,grades,image]=await Promise.all([optional('core_course_get_contents',{courseid:Number(c.id)},[]),optional('gradereport_user_get_grade_items',{courseid:Number(c.id),userid:info.userid},null),services.coverImage?services.coverImage(c.coverUrl):Promise.resolve('')]);c.image=image;
  for(const section of sections)for(const m of section.modules||[]){if(['resource','folder','url','page','book'].includes(m.modname))data.materials.push({...item(m,c),type:m.modname});}

  const total=grades?.usergrades?.[0]?.gradeitems?.find(g=>g.itemtype==='course');if(total)c.grade=total.gradeformatted||'—';c.gradeItems=(grades?.usergrades?.[0]?.gradeitems||[]).map(g=>({name:g.itemname||g.itemmodule||'课程总成绩',value:g.gradeformatted||'—'}));
 });
 progress('读取作业和提交状态…');
 const assignments=await optional('mod_assign_get_assignments',{courseids:data.courses.map(c=>Number(c.id))},{courses:[]});
 const assignmentRows=(assignments.courses||[]).flatMap(group=>(group.assignments||[]).map(a=>({a,courseId:group.id})));
 await mapLimit(assignmentRows,4,async({a,courseId})=>{
  const c=courseMap.get(courseId),state=await optional('mod_assign_get_submission_status',{assignid:a.id},null);
  const status=submissionStatus(state,a);
  data.assignments.push({...item(a,c),id:'assign-'+a.id,type:'assignment',description:a.intro||'',status,due:a.duedate?a.duedate*1000:null,url:profile.site+'/mod/assign/view.php?id='+a.cmid});
 });
 progress('读取课程公告…');
 const forums=await optional('mod_forum_get_forums_by_courses',{courseids:data.courses.map(c=>Number(c.id))},[]);
 for(const f of forums.filter(f=>f.type==='news'||/announcement|公告|通知/i.test(f.name))){
  let page=0;while(true){const result=await optional('mod_forum_get_forum_discussions',{forumid:f.id,page,perpage:100},{discussions:[]});const rows=result.discussions||[];for(const n of rows)data.notices.push({...item({...n,title:n.name||n.subject},courseMap.get(f.course)),id:'discussion-'+(n.discussion||n.discussionid||n.id),description:n.message||'',url:profile.site+'/mod/forum/discuss.php?d='+(n.discussion||n.discussionid||n.id),important:/exam|deadline|urgent|考试|截止/i.test(n.name||n.subject||'')});if(rows.length<100)break;if(++page>=100){data.warnings.push('公告分页超过本次读取上限。');break;}}
 }
 progress('读取测验和日历…');
 const quizzes=await optional('mod_quiz_get_quizzes_by_courses',{courseids:data.courses.map(c=>Number(c.id))},{quizzes:[]});
 await mapLimit(quizzes.quizzes||[],4,async q=>{const result=await optional('mod_quiz_get_user_attempts',{quizid:q.id,userid:info.userid},null);data.quizzes.push({...item(q,courseMap.get(q.course)),id:'quiz-'+q.id,type:'quiz',due:q.timeclose?q.timeclose*1000:null,status:result?.attempts?.some(a=>a.state==='finished')?'submitted':'unknown',url:profile.site+'/mod/quiz/view.php?id='+q.coursemodule});});
 const events=await optional('core_calendar_get_calendar_events',{events:{courseids:data.courses.map(c=>Number(c.id))},options:{userevents:1,siteevents:1,timestart:Math.floor(Date.now()/1000)-30*86400,timeend:Math.floor(Date.now()/1000)+365*86400}},{events:[]});
 data.events=(events.events||[]).filter(e=>e.timestart).map(e=>({...item({...e,title:e.name},courseMap.get(e.courseid)),id:'event-'+e.id,type:e.modulename==='assign'?'assignment':e.modulename==='quiz'?'quiz':'event',due:e.timestart*1000,status:'unknown',url:e.url||profile.site+'/calendar/view.php?view=day&time='+e.timestart}));
 progress('读取个人通知…');
 for(let offset=0;offset<10000;offset+=100){
  const batch=await optional('message_popup_get_popup_notifications',{useridto:info.userid,newestfirst:1,limit:100,offset},{notifications:[]});
  const notifications=batch.notifications||[];
  for(const n of notifications)data.notices.push({id:'notification-'+n.id,title:n.subject||n.smallmessage||'个人通知',description:n.fullmessage||n.smallmessage||'',course:'个人通知',courseId:'',url:n.contexturl||profile.site+'/message/output/popup/notifications.php',source:'Moodle 个人通知',important:false});
  if(notifications.length<100)break;if(offset===9900)data.warnings.push('个人通知超过本次10000条读取上限。');
 }
 data.warnings.push('第三方插件内容和附件内课表尚未完整接入。日历读取范围为过去30天至未来365天。');
 return data;
}
module.exports={sync,submissionStatus};
