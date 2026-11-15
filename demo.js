/* Fictional demonstration content. No actual grades or account records. */
(()=>{
 const base='https://l.xmu.edu.my',tz={timeZone:'Asia/Kuala_Lumpur'};
 const today=new Date(new Intl.DateTimeFormat('en-CA',{...tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+'T00:00:00+08:00');
 const weekdays={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6},wd=weekdays[new Intl.DateTimeFormat('en-US',{...tz,weekday:'short'}).format(today)];
 const monday=today.getTime()+(-wd+(wd>4?7:0))*86400000;
 const at=(n,h=17)=>monday+n*86400000+h*3600000;
 const courses=[{id:'demo-cs',name:'CST108 Programming Practice',grade:'—'},{id:'demo-ma',name:'BSC130 Calculus II',grade:'—'},{id:'demo-ph',name:'BSC106 General Physics',grade:'—'}].map(c=>({...c,startdate:Math.floor(Date.now()/1000)-30*86400,enddate:Math.floor(Date.now()/1000)+60*86400,url:null,gradeUrl:null}));
 const item=(title,c,n,h=17,status='pending',type='assignment')=>({id:title,title,courseId:c.id,course:c.name,due:at(n,h),status,type,url:null,source:'虚构演示'});
 const assignments=[item('Tutorial 3: Functions & arrays',courses[0],1,22),item('Problem set 5: Integration',courses[1],2,17,'draft'),item('Lab report: Motion & forces',courses[2],4,18),item('Tutorial 2: Pointers',courses[0],0,20,'submitted'),{...item('Reading reflection',courses[2],4),due:null,status:'unknown'}];
 const materials=[['Topic 04: Functions',0],['Lab 05: Practice exercises',0],['Week 7 lecture slides',0],['Reading: Recursion patterns',0],['Starter code: Arrays',0],['Lab 06: Strings',0],['Sample midterm answers',0],['Chapter 06: Integration',1],['Worked examples: Substitution',1],['Week 7 tutorial sheet',1],['Integration by parts notes',1],['Past quiz: Integration',1],['Formula summary',1],['Lecture 08: Motion & forces',2],['Lab handbook',2],['Week 7 problem set',2],['Experiment data sheet',2],['Error analysis guide',2],['Lab safety checklist',2]].map(([title,c],i)=>({...item(title,courses[c],0),type:i===1||i===8||i===14?'folder':'resource'}));
 const notices=[{...item('Midterm assessment: Please check the venue',courses[1],1),important:true},{...item('Week 8 lecture notes are available',courses[0],0),important:false},{...item('Laboratory safety briefing',courses[2],0),important:false}].map(n=>({...n,source:'虚构课程公告'}));
 const events=[...assignments.filter(a=>a.due),item('Programming lab',courses[0],0,10,'unknown','class'),item('Calculus tutorial',courses[1],2,9,'unknown','class'),item('Physics lecture',courses[2],3,14,'unknown','class')];
 Studyboard.mount(document.querySelector('#board').attachShadow({mode:'open'}),{mode:'demo',close:()=>window.open(base,'_blank','noopener'),load:async()=>({courses,assignments,materials,notices,quizzes:[item('Practice quiz: Limits',courses[1],3,19,'unknown','quiz')],events,warnings:['所有内容均为虚构演示，不代表你的实际课程、成绩或正式考试安排。'],syncedAt:Date.now(),mode:'demo'})});
})();
