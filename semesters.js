/* Course grouping is a heuristic, not an official academic-calendar assertion. */
(function(root){
 const monthKey=stamp=>{const d=new Date(stamp);return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit'}).format(d).slice(0,7);};
 function infer(course,now,origin){
  const raw=(course.name||'')+' '+(course.shortname||'');
  const named=raw.match(/(20\d{2})[\/._ -]?(0[1-9]|1[0-2])(?!\d)/);
  const start=Number(course.startdate)*1000,end=Number(course.enddate)*1000;
  const stamp=named?`${named[1]}-${named[2]}`:start>0?monthKey(start):null;
  const label=stamp?stamp.slice(0,4)+'年'+Number(stamp.slice(5))+'月课程':'学期待确认';
  if(start>0&&end>start){
   if(start<=now&&now<=end)return {kind:'current',label,stamp,reason:'Moodle 开课与结课日期'};
   if(end<now)return {kind:'past',label,stamp,reason:'Moodle 已结课'};
   if(start>now)return {kind:'future',label,stamp,reason:'Moodle 尚未开课'};
  }
  if(!stamp)return {kind:'unknown',label,stamp:null,reason:'缺少可识别的学期或课程日期'};
  const today=monthKey(now),year=Number(today.slice(0,4)),month=Number(today.slice(5));
  if(/(^|\.)xmu\.edu\.my$/.test(new URL(origin).hostname)){
   const termMonth=month>=9?9:month>=4?4:month>=2?2:9;
   const termYear=month<2?year-1:year;
   const current=`${termYear}-${String(termMonth).padStart(2,'0')}`;
   return {kind:stamp===current?'current':stamp<current?'past':'future',label,stamp,reason:'课程标注 / 开课月份，按 XMUM 二月、四月、九月批次推断'};
  }
  return {kind:'unknown',label,stamp,reason:'学校学期规则尚未配置，请按课程日期确认'};
 }
 const api={infer};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.StudySemesters=api;
})(globalThis);
