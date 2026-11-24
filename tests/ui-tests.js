window.addEventListener('load',async()=>{
 const r=document.querySelector('#board').shadowRoot,results=[];
 const check=(name,fn)=>{try{fn();results.push('PASS · '+name);}catch(e){results.push('FAIL · '+name+': '+e.message);}};
 const assert=(v,s)=>{if(!v)throw Error(s);};
 await document.fonts.ready;
 check('Outfit, Source Han Sans and consistent Lucide icons are used',()=>{
  assert(document.fonts.check('400 16px "SylloCN"','作业'),'Chinese font did not load');
  assert(document.fonts.check('400 16px "VCIOutfit"','Syllo'),'Latin font did not load');
  assert(parseFloat(getComputedStyle(r.querySelector('.task .task-title')).fontSize)>=15,'body text too small');
  assert(r.querySelectorAll('.nav button[data-tab]:not([data-tab="home"]) > svg[viewBox="0 0 24 24"]').length===6,'mixed or missing module icons');
 });
 check('school identity follows each connected site without an XMUM default',()=>{
  for(const host of ['alpha.example','beta.example']){
   const doc=new DOMParser().parseFromString('<meta property="og:site_name" content="Campus '+host+'"><link rel="icon" href="/school.svg"><link rel="icon" href="https://tracker.invalid/icon.svg">','text/html');
   const v=StudyIdentity.discover(doc,'https://'+host+'/my/');
   assert(v.logoUrls.length===1&&v.logoUrls[0]==='https://'+host+'/school.svg','wrong site logo');
   assert(v.name==='Campus '+host,'site name not discovered');
  }
  assert(!StudyIdentity.markup(null).includes('<img'),'unconnected preview must use app mark');
  assert(!StudyIdentity.markup({origin:'https://alpha.example',logoUrls:['javascript:alert(1)','https://other.example/logo.png']}).includes('<img'),'unsafe logo accepted');
 });
 check('homepage omits statistic cards and uses course badges without secondary course filters',()=>{
  assert(!r.querySelector('.metric-grid'),'statistic cards still render');
  assert(!r.querySelector('[data-task-course]'),'secondary course filters remain');
  assert(!r.querySelector('.task-icon'),'generic task icons remain');
  const labels=[...r.querySelectorAll('.course-badge')].map(x=>x.textContent);
  assert(labels.includes('CST108')&&labels.includes('BSC130')&&labels.includes('BSC106'),'course labels missing or wrong');
  assert(r.querySelector('.courses-panel>.section-head').textContent.includes('本学期课程'),'current courses not emphasized');
 });
 check('homepage task and current-course panels use one visual system',()=>{
  const panels=[...r.querySelectorAll('.dashboard-panel')],heads=panels.map(p=>p.querySelector('.section-head h2, .home-grades h3'));
  assert(panels.length===4,'missing primary panels');
  for(const property of ['borderRadius','paddingTop','paddingLeft','borderTopWidth'])assert(getComputedStyle(panels[0])[property]===getComputedStyle(panels[1])[property],'panel mismatch: '+property);
  for(const property of ['fontSize','fontWeight','color'])assert(getComputedStyle(heads[0])[property]===getComputedStyle(heads[1])[property],'heading mismatch: '+property);
 });
 check('homepage uses top controls and compact parallel task filters',()=>{
  assert(!r.querySelector('.dashboard-heading'),'homepage title row still renders');
  assert(getComputedStyle(r.querySelector('.main>.heading')).display==='none','homepage title row is visible');
  assert(r.querySelector('.topbar-unified .page-toolbar .semester-filter'),'semester control missing from top bar');
  assert(r.querySelector('.topbar-unified .page-toolbar [data-edit-terms]'),'course control missing from top bar');
  assert(r.querySelector('.topbar-unified .page-toolbar [data-act="sync"]'),'refresh control missing from top bar');
  assert(r.querySelectorAll('.assignments-panel .section-head .home-filters button').length===4,'task filters not parallel with the assignment heading');
  assert(!r.querySelector('.assignments-panel [data-tab="tasks"]'),'redundant full-page task link remains');
  assert(r.querySelectorAll('.home-course-grid .home-course-item').length===3,'course card grid missing');
 });
 check('home provides six one-click module entrances',()=>{
  assert(r.querySelectorAll('.nav button[data-tab]:not([data-tab="home"])').length===6,'missing module entrances');
  assert(!r.querySelector('.home-mode .calendar'),'home must not contain the timetable');
  for(const [id,title] of [['tasks','作业'],['notices','通知'],['materials','课件'],['grades','成绩'],['calendar','日程'],['courses','课程']]){
   r.querySelector('.nav button[data-tab="'+id+'"]').click();assert(r.querySelector('h1').textContent===title,'wrong destination for '+id);
   r.querySelector('[data-tab="home"]').click();
  }
  r.querySelector('.nav button[data-tab="tasks"]').click();
 });
 check('section pages pair context with usable horizontal layouts',()=>{
  assert(r.querySelector('.task-grid'),'task page still uses one long column');
  assert(getComputedStyle(r.querySelector('.task-grid')).gridTemplateColumns.split(' ').length===2,'task grid should use two columns on desktop');
  r.querySelector('[data-tab="calendar"]').click();
  assert(r.querySelector('.schedule-layout>.calendar')&&r.querySelector('.schedule-layout>.schedule-rail'),'calendar and its tools are not paired');
  r.querySelector('[data-tab="notices"]').click();
  assert(r.querySelectorAll('.notice-grid>.notice-card').length===3,'notices are not shown as cards');
  r.querySelector('[data-tab="materials"]').click();
  assert(getComputedStyle(r.querySelector('.materials')).gridTemplateColumns.split(' ').length===3,'materials do not use the available columns');
  assert(!r.querySelector('.summary'),'duplicated summary row still renders');
  r.querySelector('[data-tab="tasks"]').click();
 });
 check('every page keeps its controls in the same top toolbar',()=>{
  const tabs=['tasks','notices','materials','grades','calendar','courses'];
  for(const id of tabs){
   r.querySelector('.nav button[data-tab="'+id+'"]').click();
   const bar=r.querySelector('.topbar-unified .page-toolbar');
   assert(bar,'missing unified toolbar on '+id);
   assert(bar.querySelector('.semester-filter'),'semester control missing on '+id);
   assert(bar.querySelector('[data-edit-terms]'),'course editor missing on '+id);
   assert(bar.querySelector('[data-act="sync"]'),'refresh control missing on '+id);
   assert(!r.querySelector('.main>.heading .buttons'),'duplicate page buttons still render on '+id);
   assert(!r.querySelector('.tabsbar-filters'),'filters still sit under the heading on '+id);
  }
  r.querySelector('.nav button[data-tab="tasks"]').click();
  assert(r.querySelectorAll('.page-toolbar .toolbar-filters button').length===5,'task filters are not in the top toolbar');
  assert(!r.querySelector('.all-tasks .task-filters'),'duplicated task filters remain in the panel');
 });
 check('demo module links explain missing destinations instead of opening Moodle home',()=>{
  assert(!r.querySelector('a[href="https://l.xmu.edu.my/"]'),'demo still links to Moodle home');
  const a=r.querySelector('[data-unavailable-link]');assert(a,'demo link missing');
  a.click();const sheet=r.querySelector('dialog[open]');assert(sheet?.textContent.includes('虚构'),'missing demo explanation');
  assert(!a.hasAttribute('target'),'demo link must not open a new tab');
  sheet.close();
 });
 check('VCI slide-over opens the selected item and closes',()=>{
  const button=r.querySelector('[data-open-details]');button.click();
  const d=r.querySelector('dialog[open]');assert(d,'details panel did not open');
  assert(d.querySelector('#detail-title').textContent.includes('Tutorial'),'wrong item details');
  d.querySelector('[data-close-sheet]').click();assert(!r.querySelector('dialog[open]'),'panel did not close');
 });
 check('personal pin toggles without changing submission status',()=>{
  r.querySelector('[data-pin]').click();assert(r.querySelector('[data-pin]').getAttribute('aria-pressed')==='true','pin not selected');
  assert(r.querySelector('.task .chip').textContent==='待提交','pin altered official submission status');
  r.querySelector('[data-pin]').click();assert(r.querySelector('[data-pin]').getAttribute('aria-pressed')==='false','pin not cleared');
 });
 check('warm dark-mode toggle is functional and reversible',()=>{
  r.querySelector('.nav [data-tab="home"]').click();r.querySelector('[data-act="theme"]').click();
  assert(r.querySelector('.app').classList.contains('is-dark'),'dark mode missing');
  r.querySelector('[data-act="theme"]').click();assert(!r.querySelector('.app').classList.contains('is-dark'),'light mode not restored');
 });
 check('module navigation has animation and respects reduced-motion',()=>{
  r.querySelector('.nav [data-tab="calendar"]').click();
  const animations=r.querySelector('.main').getAnimations();
  assert(matchMedia('(prefers-reduced-motion: reduce)').matches?animations.length===0:animations.length>0,'incorrect motion behavior');
 });
 check('calendar events have finite localized time positions',()=>{
  r.querySelector('[data-tab="calendar"]').click();
  const cells=[...r.querySelectorAll('.calitem')];assert(cells.length>=6,'fixture events missing');
  assert(cells.every(c=>!c.getAttribute('style').includes('NaN')),'NaN position');
  const lab=cells.find(c=>c.textContent.includes('Programming lab'));
  assert(lab.style.getPropertyValue('--top')==='62px','10:00 should have the correct time position');
 });
 check('course filtering changes task count and course materials',()=>{
  r.querySelector('[data-tab="materials"]').click();
  const s=r.querySelector('#courses');s.value='demo-cs';s.dispatchEvent(new Event('change'));
  assert(r.querySelectorAll('.course-card').length===1,'course cards not filtered');
  r.querySelector('[data-tab="tasks"]').click();
  assert(r.querySelectorAll('.task').length===1,'submitted work included in pending');
 });
 check('opening one course focuses it without hiding the rest',()=>{
  const sel=r.querySelector('#courses');sel.value='';sel.dispatchEvent(new Event('change'));
  r.querySelector('[data-tab="home"]').click();
  r.querySelector('.home-course-item').click();
  assert(r.querySelectorAll('.course-card').length===3,'opening one course hid every other course');
  const focused=r.querySelector('.course-card.is-focus');
  assert(focused&&r.querySelectorAll('.course-card.is-focus').length===1,'opened course is not promoted');
  assert(getComputedStyle(focused).gridColumnStart==='1'&&getComputedStyle(focused).gridColumnEnd==='-1','focused course does not span the available row');
  assert(getComputedStyle(focused.querySelector('.material-list')).gridTemplateColumns.split(' ').length>=2,'focused materials leave desktop space unused');
  assert([...r.querySelectorAll('.course-card:not(.is-focus)')].every(c=>getComputedStyle(c).display==='flex'),'focus layout leaked into other course cards');
  r.querySelector('[data-clear-focus]').click();
  assert(r.querySelectorAll('.course-card').length===3,'clearing focus did not restore all courses');
  r.querySelector('[data-tab="tasks"]').click();
  assert(r.querySelectorAll('.task').length===3,'course focus leaked into the task list');
  selReset();
  function selReset(){const s=r.querySelector('#courses');if(s){s.value='';s.dispatchEvent(new Event('change'));}}
 });
 check('search is retained after render and can be cleared',()=>{
  const q=r.querySelector('#search');q.value='Pointers';q.dispatchEvent(new Event('input'));
  assert(r.querySelector('#search').value==='Pointers','search text lost');
  const clear=r.querySelector('#search');clear.value='';clear.dispatchEvent(new Event('input'));
 });
 check('submitted work has a separate category',()=>{
  r.querySelector('[data-tab="tasks"]').click();r.querySelector('[data-task-filter="submitted"]').click();
  assert(r.querySelectorAll('.task').length===1,'wrong submitted count');
  assert(r.querySelector('.task').textContent.includes('Pointers'),'wrong submitted work');
 });
 check('manual schedule uses Malaysia time and appears on calendar',()=>{
  r.querySelector('[data-tab="calendar"]').click();
  const form=r.querySelector('#manual');form.elements.title.value='UI regression study session';
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  form.elements.when.value=today+'T09:00';form.requestSubmit();
  assert(r.textContent.includes('UI regression study session'),'manual event missing');
  const c=[...r.querySelectorAll('.calitem')].find(x=>x.textContent.includes('UI regression study session'));
  assert(c&&c.textContent.includes('09:00'),'wrong timezone or missing event');
 });
 const fixture=document.createElement('div');fixture.hidden=true;document.body.append(fixture);
 const live=fixture.attachShadow({mode:'open'});
 Studyboard.mount(live,{mode:'live',load:async()=>({courses:[],events:[],materials:[],notices:[],quizzes:[],warnings:[],assignments:[{id:'fixture',title:'Fixture assignment',courseId:'1',course:'Test course',status:'pending',type:'assignment',url:'https://l.xmu.edu.my/mod/assign/view.php?id=42'}]})});
 await Promise.resolve();
 check('real module links retain the exact activity URL and ID',()=>{
  live.querySelector('.nav button[data-tab="tasks"]').click();
  const a=live.querySelector('.task-title a');
  assert(a?.getAttribute('href')==='https://l.xmu.edu.my/mod/assign/view.php?id=42','activity URL changed');
  assert(a.target==='_blank','real module should open normally');
 });
 fixture.remove();
 const second=document.createElement('div');second.hidden=true;document.body.append(second);const foreign=second.attachShadow({mode:'open'});
 Studyboard.mount(foreign,{mode:'live',school:{name:'Campus',origin:'https://campus.example',logoUrls:[]},load:async()=>({courses:[],events:[],materials:[],notices:[],quizzes:[],warnings:[],assignments:[{id:'other',title:'Exact module',status:'pending',url:'https://campus.example/mod/assign/view.php?id=77'}]})});
 await Promise.resolve();
 check('connected-school activity links and detail links use that school origin',()=>{
  foreign.querySelector('[data-tab="tasks"]').click();
  assert(foreign.querySelector('.task-title a').getAttribute('href')==='https://campus.example/mod/assign/view.php?id=77','connected origin rejected');
  foreign.querySelector('[data-open-details]').click();
  assert(foreign.querySelector('dialog .sheet-footer a').getAttribute('href')==='https://campus.example/mod/assign/view.php?id=77','detail page lost exact module URL');foreign.querySelector('dialog').close();
 });second.remove();

 const timelineHost=document.createElement('div');timelineHost.hidden=true;document.body.append(timelineHost);const timeline=timelineHost.attachShadow({mode:'open'}),now=Date.now();
 const timed=[['future','Upcoming','pending',now+86400000],['expired','Recent overdue','pending',now-86400000],['draft','Overdue draft','draft',now-2*86400000],['recent','Recently submitted','submitted',now-3600000],['old','Old submission','submitted',now-10*86400000],['undated','No date submission','submitted',null],['unknown','Unknown status','unknown',now-3*86400000]].map(([id,title,status,due])=>({id,title,status,due,type:'assignment',url:null}));
 Studyboard.mount(timeline,{mode:'demo',load:async()=>({courses:[],events:[],materials:[],notices:[],quizzes:[],warnings:[],assignments:timed})});await Promise.resolve();
 const titles=()=>[...timeline.querySelectorAll('.task-title')].map(x=>x.textContent);
 check('overdue open submissions have a separate full list and leave upcoming work',()=>{
  assert(titles().join('|')==='Upcoming','expired submission mixed into home pending');
  timeline.querySelector('[data-task-filter="overdue"]').click();
  assert(timeline.querySelector('h1').textContent==='学习总览','home filter must preserve the current page');
  assert(titles().join('|')==='Recent overdue|Overdue draft','overdue classification or order incorrect');
 });
 check('submitted and all sort newest deadlines first with missing dates last',()=>{
  timeline.querySelector('[data-task-filter="submitted"]').click();
  assert(titles().join('|')==='Recently submitted|Old submission|No date submission','submitted order incorrect');
  timeline.querySelector('[data-task-filter="all"]').click();
  assert(titles().join('|')==='Upcoming|Recently submitted|Recent overdue|Overdue draft|Unknown status|Old submission|No date submission','all order incorrect');
 });timelineHost.remove();
 const termHost=document.createElement('div');termHost.hidden=true;document.body.append(termHost);const termRoot=termHost.attachShadow({mode:'open'});
 const termOrigin='https://semester-test.example',storeKey='syllo-semesters:'+termOrigin;localStorage.removeItem(storeKey);
 const termData={courses:[{id:'current',name:'Current course',grade:'0 / 20',startdate:(Date.now()-86400000)/1000,enddate:(Date.now()+86400000)/1000},{id:'past',name:'Past course',startdate:1000000000,enddate:1001000000},{id:'unknown',name:'Undated course'}],assignments:[],materials:[],notices:[],quizzes:[],events:[],warnings:[]};
 Studyboard.mount(termRoot,{mode:'live',school:{origin:termOrigin},load:async()=>termData});await Promise.resolve();
 check('homepage identifies current courses without hiding uncertain courses',()=>{
  assert(termRoot.querySelector('.home-course-list').textContent.includes('Current course'),'current course absent');
  assert(!termRoot.querySelector('.home-course-list').textContent.includes('Past course'),'historical course shown as current');
  assert(termRoot.querySelector('.term-hint').textContent.includes('1 门学期待确认'),'uncertain course not disclosed');
 });
 check('homepage only shows published current-course grades and can hide them',()=>{
  const grade=termRoot.querySelector('.home-course-grade');assert(grade?.textContent==='0 / 20','published zero grade hidden');
  assert(termRoot.querySelectorAll('.home-course-grade').length===1,'unpublished grade shown');
  termRoot.querySelector('[data-toggle-home-grades]').click();assert(!termRoot.querySelector('.home-course-grade'),'grade hide failed');
  termRoot.querySelector('[data-toggle-home-grades]').click();assert(termRoot.querySelector('.home-course-grade'),'grade restore failed');
 });
 check('manual semester correction overrides detection and persists per school',()=>{
  termRoot.querySelector('[data-edit-terms]').click();const dialog=termRoot.querySelector('dialog');
  assert(!dialog.querySelector('[data-add-current]'),'other courses shown before adding');
  assert(!dialog.querySelector('select'),'old status dropdowns remain');
  dialog.querySelector('[data-show-add]').click();dialog.querySelector('[data-add-current="past"]').click();dialog.querySelector('[data-save]').click();
  assert(termRoot.querySelector('.home-course-list').textContent.includes('Past course'),'manual correction not applied');
  assert(JSON.parse(localStorage.getItem(storeKey)).past==='current','manual correction not saved');
  termRoot.querySelector('[data-edit-terms]').click();termRoot.querySelector('[data-reset]').click();termRoot.querySelector('[data-save]').click();
  assert(!termRoot.querySelector('.home-course-list').textContent.includes('Past course'),'restore automatic failed');
 });
 check('current-course editor removes selected courses and cancellation leaves them unchanged',()=>{
  termRoot.querySelector('[data-edit-terms]').click();termRoot.querySelector('[data-remove-current="current"]').click();termRoot.querySelector('[data-cancel]').click();
  assert(termRoot.querySelector('.home-course-list').textContent.includes('Current course'),'cancel applied changes');
  termRoot.querySelector('[data-edit-terms]').click();termRoot.querySelector('[data-remove-current="current"]').click();termRoot.querySelector('[data-save]').click();
  assert(!termRoot.querySelector('.home-course-list').textContent.includes('Current course'),'remove failed');
  termRoot.querySelector('[data-edit-terms]').click();termRoot.querySelector('[data-reset]').click();termRoot.querySelector('[data-save]').click();
  assert(termRoot.querySelector('.home-course-list').textContent.includes('Current course'),'automatic restore failed');
 });termHost.remove();localStorage.removeItem(storeKey);localStorage.removeItem('syllo-home-grades:'+termOrigin);
 const visitHost=document.createElement('div');visitHost.hidden=true;document.body.append(visitHost);const visitRoot=visitHost.attachShadow({mode:'open'}),visitKey='syllo-course-visits:'+termOrigin;
 localStorage.setItem(visitKey,JSON.stringify({unknown:[Date.now()-3000,Date.now()-2000,Date.now()-1000],past:[Date.now()-3000,Date.now()-2000,Date.now()-1000]}));
 Studyboard.mount(visitRoot,{mode:'live',school:{origin:termOrigin},load:async()=>termData});await Promise.resolve();
 check('recent repeated visits only infer undated courses and preserve explicit historical dates',()=>{
  const text=visitRoot.querySelector('.home-course-list').textContent;
  assert(text.includes('Undated course'),'frequent undated course not inferred');
  assert(!text.includes('Past course'),'historical course wrongly promoted by visits');
 });visitHost.remove();localStorage.removeItem(visitKey);
 const fullHost=document.createElement('div');fullHost.hidden=true;document.body.append(fullHost);const fullRoot=fullHost.attachShadow({mode:'open'});
 const completeList=[{id:'soon',title:'Soon due',due:Date.now()+600000},{id:'tomorrow',title:'Tomorrow work',due:Date.now()+86400000},{id:'later',title:'Three days away',due:Date.now()+3*86400000},{id:'none',title:'No deadline',due:null}].map(x=>({...x,status:'pending',type:'assignment',url:null}));
 Studyboard.mount(fullRoot,{mode:'demo',load:async()=>({courses:[],assignments:completeList,events:[],materials:[],notices:[],quizzes:[],warnings:[]})});await Promise.resolve();
 check('homepage renders every pending item with a total and no hidden trailing rows',()=>{
  assert(fullRoot.querySelectorAll('.task').length===4,'homepage truncates pending tasks');
  assert(fullRoot.querySelector('.assignments-panel .task-total').textContent.includes('4'),'total missing');
  assert(getComputedStyle(fullRoot.querySelector('.task:last-child')).display!=='none','last task is hidden');
  assert(getComputedStyle(fullRoot.querySelector('.tasklist')).overflowY==='auto','complete list cannot scroll');
 });
 check('deadline labels show remaining days while missing deadlines have no invented countdown',()=>{
  const rows=[...fullRoot.querySelectorAll('.task')];
  assert(rows[2].querySelector('.deadline-countdown').textContent==='还剩3天','remaining days wrong');
  assert(rows[1].querySelector('.deadline-countdown').textContent==='明天截止','tomorrow label wrong');
  assert(!rows[3].querySelector('.deadline-countdown'),'countdown invented for missing date');
 });fullHost.remove();
 const courseCountHost=document.createElement('div');courseCountHost.hidden=true;document.body.append(courseCountHost);const courseCountRoot=courseCountHost.attachShadow({mode:'open'});
 const sixCourses=Array.from({length:6},(_,i)=>({id:'six-'+i,name:'Current '+(i+1),startdate:Date.now()/1000-86400,enddate:Date.now()/1000+86400}));
 Studyboard.mount(courseCountRoot,{mode:'demo',load:async()=>({courses:sixCourses,assignments:[],materials:[],notices:[],quizzes:[],events:[],warnings:[]})});await Promise.resolve();
 check('all six current courses render and match the homepage count',()=>{
  assert(courseCountRoot.querySelectorAll('.home-course-item').length===6,'current courses truncated');
  assert(courseCountRoot.querySelector('.courses-panel .task-total').textContent.includes('6 门'),'current course count mismatched');
  assert(courseCountRoot.querySelector('.home-course-list').textContent.includes('Current 6'),'sixth course missing');
 });courseCountHost.remove();
 const productHost=document.createElement('div');productHost.hidden=true;document.body.append(productHost);const productRoot=productHost.attachShadow({mode:'open'});
 const detailedCourse={id:'detailed',name:'CST200 Full Course Name With Important Details 2026/09',startdate:Date.now()/1000-86400,enddate:Date.now()/1000+86400,url:'https://campus.example/course/view.php?id=1',gradeUrl:'https://campus.example/grade/report/user/index.php?id=1',grade:'—',gradeItems:[{name:'Lab 1',value:'8 / 10'}],image:'data:image/png;base64,iVBORw0KGgo='};
 let invoked=0;
 Studyboard.mount(productRoot,{mode:'live',school:{origin:'https://campus.example'},initialData:{courses:[detailedCourse],assignments:[],materials:[],notices:[],events:[],quizzes:[],warnings:[],syncedAt:Date.now()},skipInitialLoad:true,load:async()=>{invoked++;throw Error('Unexpected cold scan');}});
 check('cached dashboard renders immediately without a fresh startup scan',()=>{assert(invoked===0,'cache startup performed a scan');assert(productRoot.querySelector('.home-course-item').textContent.includes('Full Course Name'),'cache content absent');});
 check('published grade items appear on home even when the course total is unpublished',()=>{assert(productRoot.querySelector('.home-grades').textContent.includes('Lab 1'),'published component grade omitted');assert(productRoot.querySelector('.home-grades').textContent.includes('8 / 10'),'published score absent');});
 check('full names and real course covers replace decorative course art',()=>{
  productRoot.querySelector('[data-tab="courses"]').click();
  assert(productRoot.querySelector('.course-body h3').textContent===detailedCourse.name,'full course name truncated');
  assert(productRoot.querySelector('img[data-course-cover]'),'Moodle cover missing');assert(!productRoot.querySelector('.art-lines'),'decorative logo still rendered');
 });
 check('dead avatar and irrelevant footer copy are removed',()=>{
  assert(!productRoot.querySelector('.avatar'),'dead avatar still shown');
  assert(!productRoot.textContent.includes('个人学习工作台'),'old footer still shown');
  assert(productRoot.querySelector('.moodle-credit img[alt="Moodle"]'),'Moodle attribution missing');
 });productHost.remove();
 document.querySelector('#results').textContent=results.join('\n');
 document.title=results.some(x=>x.startsWith('FAIL'))?'UI tests failed':results.length+' UI tests passed';
});
