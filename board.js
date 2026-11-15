globalThis.Studyboard=(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tz={timeZone:'Asia/Kuala_Lumpur'};
 const fmt=(t,options)=>new Intl.DateTimeFormat('zh-CN',{...tz,...options}).format(new Date(t));
 const date=t=>t?fmt(t,{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'时间待核实';
 const key=t=>new Intl.DateTimeFormat('en-CA',{...tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t));
 function remaining(due,now=Date.now()){
  if(!Number.isFinite(due)||due<=0)return '';
  const delta=due-now;if(delta<=0)return '已过截止时间';
  const days=Math.round((Date.parse(key(due)+'T00:00:00+08:00')-Date.parse(key(now)+'T00:00:00+08:00'))/86400000);
  if(days===0){if(delta<3600000)return '今天截止 · 还剩'+Math.ceil(delta/60000)+'分钟';return '今天截止 · 还剩'+Math.ceil(delta/3600000)+'小时';}
  if(days===1)return '明天截止';
  return '还剩'+days+'天';
 }
 const status={submitted:'已提交',pending:'待提交',draft:'草稿',unknown:'待核实'};

 const icon=n=>globalThis.StudyVisuals?.[n==='home'?'today':n]||globalThis.StudyVisuals?.book||'';
 const css=globalThis.StudyThemeCSS;

 const palette=[['#9a571d','#fff0de'],['#526f4d','#eaf3e6'],['#715795','#f0eafa'],['#956070','#faeaf0'],['#786526','#f7f0d7'],['#37746a','#e3f2ed'],['#7c6152','#f1e9e2'],['#635f8b','#ecebf5']];
 const short=s=>new DOMParser().parseFromString(String(s||''),'text/html').body.textContent.replace(/^DEMO\s*[·:]\s*/,'').split(/\s+202\d/)[0];
 function mount(root,opts){
  let data=opts.initialData||{courses:[],events:[],assignments:[],materials:[],notices:[],quizzes:[],warnings:[]},tab='home',query='',courseId='',offset=opts.mode==='demo'&&['Sat','Sun'].includes(new Intl.DateTimeFormat('en-US',{...tz,weekday:'short'}).format(new Date()))?1:0,busy=false,progress='',error='',manual=[],taskFilter='pending',semesterScope='current',darkMode=false,viewMotion=true,pins=new Set();
  const connectedOrigin=opts.school?.origin||'https://l.xmu.edu.my';
 const expandedCourses=new Set();
 let focusCourse='';
 const link=(x,body,cls='')=>{
  let href='';try{const u=new URL(x.url);if(u.origin===connectedOrigin&&u.pathname!=='/')href=u.href;}catch{}
  if(!href)return `<a class="${cls}" href="#" role="button" data-unavailable-link data-item="${esc(JSON.stringify(x))}" title="示例内容或缺少模块地址，无法打开真实模块">${body}</a>`;
  return `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" data-visit-course="${esc(x.courseId||x.id||'')}">${body}</a>`;
 };
  const identity=StudyIdentity.normalize(opts.school);
  const names={home:'学习总览',tasks:'作业',calendar:'日程',notices:'通知',materials:'课件',grades:'成绩',courses:'课程'};
  const colorKey='syllo-course-colors:'+connectedOrigin;
  let courseColors={};try{const saved=JSON.parse(localStorage.getItem(colorKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))courseColors=saved;}catch{}
  const courseColor=id=>{
   if(!id)return ['#626b75','#f0f1f3'];
   let index=courseColors[String(id)];
   if(!Number.isInteger(index)||index<0){index=0;const used=new Set(Object.values(courseColors));while(used.has(index))index++;courseColors[String(id)]=index;try{localStorage.setItem(colorKey,JSON.stringify(courseColors));}catch{}}
   if(index<palette.length)return palette[index];
   const hue=Math.round((index*137.508)%360);return [`hsl(${hue} 28% 35%)`,`hsl(${hue} 45% 93%)`];
  };
  const termStorageKey='syllo-semesters:'+connectedOrigin;
  let termOverrides={};try{termOverrides=JSON.parse(localStorage.getItem(termStorageKey)||'{}');if(!termOverrides||typeof termOverrides!=='object'||Array.isArray(termOverrides))termOverrides={};}catch{}
  const homeGradeKey='syllo-home-grades:'+connectedOrigin;
  let showHomeGrades=true;try{showHomeGrades=localStorage.getItem(homeGradeKey)!=='hidden';}catch{}
  const publishedGrade=c=>{const text=new DOMParser().parseFromString(String(c.grade??''),'text/html').body.textContent.trim();return text&&!/^(?:[—–-]+|n\/?a|not graded|未评分|未公布|暂无成绩)$/i.test(text)?text:'';};
  const visitStorageKey='syllo-course-visits:'+connectedOrigin;
  let courseVisits={};try{const saved=JSON.parse(localStorage.getItem(visitStorageKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))courseVisits=saved;}catch{}
  const recentVisits=id=>(Array.isArray(courseVisits[id])?courseVisits[id]:[]).filter(t=>Number.isFinite(t)&&t<=Date.now()&&t>Date.now()-30*86400000);
  const recordVisit=id=>{if(!data.courses.some(c=>String(c.id)===String(id)))return;courseVisits[id]=[...recentVisits(id),Date.now()].slice(-50);try{localStorage.setItem(visitStorageKey,JSON.stringify(courseVisits));}catch{}};
  const autoTerm=c=>{const detected=StudySemesters.infer(c,Date.now(),connectedOrigin);return detected.kind==='unknown'&&recentVisits(c.id).length>=3?{...detected,kind:'current',reason:'近30天访问至少3次推断，可手动修正'}:detected;};
  const term=c=>['current','past','future','unknown'].includes(termOverrides[c.id])?{...autoTerm(c),kind:termOverrides[c.id],reason:'手动修正'}:autoTerm(c);
  function editTerms(){
   root.querySelector('dialog')?.remove();
   const dialog=document.createElement('dialog');dialog.className='detail-sheet term-editor';dialog.setAttribute('aria-label','调整本学期课程');
   let selected=new Set(data.courses.filter(c=>term(c).kind==='current').map(c=>String(c.id))),removed=new Set(),adding=false,search='',resetAll=false;
   const draw=()=>{
    const chosen=data.courses.filter(c=>selected.has(String(c.id)));
    const candidates=data.courses.filter(c=>!selected.has(String(c.id))&&`${c.name} ${c.shortname||''}`.toLowerCase().includes(search.toLowerCase()));
    dialog.innerHTML=`<header class="sheet-top"><strong>本学期课程 <small>${chosen.length} 门</small></strong><button data-cancel aria-label="关闭课程调整">${icon('close')}</button></header><div class="sheet-body"><p class="note">先确认已整理的课程，移除不属于本学期的课程，或添加遗漏的课程。保存后生效。</p><div class="term-selected-list">${chosen.map(c=>`<article class="term-editor-row"><span><b>${esc(c.name)}</b><small>${esc(term(c).reason)}</small></span><button class="btn term-remove" data-remove-current="${esc(c.id)}" aria-label="移除 ${esc(c.name)}">${icon('close')}移除</button></article>`).join('')||'<div class="empty">还没有本学期课程，点击下方添加。</div>'}</div><button class="btn term-add-toggle" data-show-add>${icon('plus')}${adding?'收起添加列表':'添加课程'}</button>${adding?`<section class="term-add-panel"><label>查找其他课程<input data-course-search placeholder="搜索课程名称或代码" value="${esc(search)}"></label><div class="term-candidates">${candidates.map(c=>`<button data-add-current="${esc(c.id)}" class="term-candidate" aria-label="添加 ${esc(c.name)}"><span><b>${esc(c.name)}</b><small>${esc(autoTerm(c).label)}</small></span>${icon('plus')}</button>`).join('')||'<p class="note">没有匹配的其他课程。</p>'}</div></section>`:''}</div><footer class="sheet-footer"><button class="btn" data-reset>恢复自动识别</button><button class="btn primary" data-save>保存 ${chosen.length} 门课程</button><button class="btn" data-cancel>取消</button></footer>`;
    dialog.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>dialog.close());
    dialog.querySelectorAll('[data-remove-current]').forEach(b=>b.onclick=()=>{selected.delete(b.dataset.removeCurrent);removed.add(b.dataset.removeCurrent);draw();});
    dialog.querySelectorAll('[data-add-current]').forEach(b=>b.onclick=()=>{selected.add(b.dataset.addCurrent);removed.delete(b.dataset.addCurrent);draw();});
    dialog.querySelector('[data-show-add]').onclick=()=>{adding=!adding;draw();if(adding)dialog.querySelector('[data-course-search]').focus();};
    const field=dialog.querySelector('[data-course-search]');if(field)field.oninput=e=>{search=e.target.value;const pos=e.target.selectionStart;draw();const input=dialog.querySelector('[data-course-search]');input.focus();input.setSelectionRange(pos,pos);};
    dialog.querySelector('[data-reset]').onclick=()=>{selected=new Set(data.courses.filter(c=>autoTerm(c).kind==='current').map(c=>String(c.id)));removed.clear();resetAll=true;draw();};
    dialog.querySelector('[data-save]').onclick=()=>{if(resetAll)termOverrides={};for(const c of data.courses){const id=String(c.id);if(selected.has(id)){if(autoTerm(c).kind==='current')delete termOverrides[id];else termOverrides[id]='current';}else if(removed.has(id)||autoTerm(c).kind==='current')termOverrides[id]='past';}try{localStorage.setItem(termStorageKey,JSON.stringify(termOverrides));}catch{}courseId='';dialog.close();render();toast('本学期课程已更新。');};
   };
   root.querySelector('.app').append(dialog);dialog.onclose=()=>dialog.remove();draw();dialog.showModal();
  }
  const currentCourses=()=>data.courses.filter(c=>term(c).kind==='current');
  const hasTerms=()=>data.courses.some(c=>term(c).kind!=='unknown');
  const inScope=c=>semesterScope==='all'||!hasTerms()||term(c).kind===semesterScope||(semesterScope==='current'&&term(c).kind==='unknown');
  const scopedCourses=()=>data.courses.filter(inScope);
  const inSemester=x=>{const c=data.courses.find(c=>String(c.id)===String(x.courseId||x.id));return !c||inScope(c);};
  const match=x=>inSemester(x)&&(!courseId||String(x.courseId||x.id)===courseId)&&(!query||`${x.title||x.name} ${x.course||''}`.toLowerCase().includes(query.toLowerCase()));
  const arr=k=>(data[k]||[]).filter(match);
  const isOpen=x=>['pending','draft'].includes(x.status);
  const hasDue=x=>Number.isFinite(x.due)&&x.due>0;
  const isOverdue=x=>isOpen(x)&&hasDue(x)&&x.due<Date.now();
  const byNewest=(a,b)=>Number(hasDue(b))-Number(hasDue(a))||(hasDue(a)&&hasDue(b)?b.due-a.due:0);
  function taskList(filter,onlyAssignments=false){
   let xs=onlyAssignments?arr('assignments'):[...arr('assignments'),...arr('quizzes')];
   if(filter==='pending')xs=xs.filter(x=>isOpen(x)&&!isOverdue(x));
   else if(filter==='overdue')xs=xs.filter(isOverdue);
   else if(filter!=='all')xs=xs.filter(x=>x.status===filter);
   if(filter==='pending')return xs.sort((a,b)=>Number(pins.has(b.id))-Number(pins.has(a.id))||Number(hasDue(b))-Number(hasDue(a))||(hasDue(a)&&hasDue(b)?a.due-b.due:0));
   return xs.sort(byNewest);
  }
  const pending=()=>taskList('pending',true);
  const events=()=>[...arr('events'),...arr('assignments').filter(a=>a.due&&!data.events.some(e=>e.url?.split('&')[0]===a.url?.split('&')[0])),...manual.filter(match)].filter(e=>e.due).sort((a,b)=>a.due-b.due);
  function courseBadge(item){
   const name=item.course||data.courses.find(c=>String(c.id)===String(item.courseId))?.name||'';
   const code=name.match(/(?:^|[^a-z0-9])([a-z]{2,6}\s*[-.]?\s*\d{1,4}(?:\.\d)?(?:-[a-z])?)(?=$|[^a-z0-9])/i)?.[1];
   const label=code?code.replace(/\s+/g,'').toUpperCase():name?short(name).split(/\s+/).slice(0,2).join(' '):'未归属';
   const [ink,tint]=courseColor(item.courseId);
   return `<span class="course-badge" title="${esc(name||'未读取到所属课程')}" style="--course-ink:${ink};--course-tint:${tint}">${esc(label)}</span>`;
  }
  function taskRow(a){const [ink,tint]=courseColor(a.courseId);return `<article class="task ${esc(a.status)} ${pins.has(a.id)?'pinned':''}" style="--course-ink:${ink};--course-tint:${tint}">${courseBadge(a)}<div class="task-content"><div class="task-title" title="${esc(a.title)}">${link(a,esc(a.title))}</div><div class="task-course">${esc(short(a.course))}</div><div class="task-bottom"><span>${a.due?icon('clock')+date(a.due):esc(a.dueText||'截止时间待核实')}${a.status!=='submitted'&&remaining(a.due)?` <em class="deadline-countdown">${esc(remaining(a.due))}</em>`:''}</span><span class="chip ${esc(a.status)}">${status[a.status]||'待核实'}</span></div></div><div class="task-actions">${a.url?link(a,icon('external')+'<span class="visually-hidden">打开 Moodle 原页面</span>','detail-btn source-link'):''}<button class="pin-btn ${pins.has(a.id)?'is-pinned':''}" data-pin="${esc(a.id)}" aria-label="${pins.has(a.id)?'取消置顶':'置顶此项'}" aria-pressed="${pins.has(a.id)}">${icon('star')}</button><button class="detail-btn" data-open-details="${esc(JSON.stringify(a))}" aria-label="查看详情">${icon('arrow')}</button></div></article>`;}
  function toast(message){
   root.querySelector('.link-feedback')?.remove();const n=document.createElement('div');n.className='link-feedback';n.setAttribute('role','status');n.innerHTML=icon('info')+'<span>'+esc(message)+'</span><button aria-label="关闭提示">'+icon('close')+'</button>';root.querySelector('.app').append(n);n.querySelector('button').onclick=()=>n.remove();setTimeout(()=>n.remove(),4500);
  }
  function showDetails(item){
   root.querySelector('dialog')?.remove();const d=document.createElement('dialog');d.className='detail-sheet';d.setAttribute('aria-labelledby','detail-title');
   let target='';try{const u=new URL(item.url);if(u.origin===connectedOrigin&&u.pathname!=='/')target=u.href;}catch{}
   d.innerHTML=`<header class="sheet-top"><span>${icon('info')}事项详情</span><button data-close-sheet aria-label="关闭详情">${icon('close')}</button></header><div class="sheet-body"><span class="sheet-kicker">${item.type==='assignment'?'作业':item.type==='quiz'?'测验':item.type==='resource'?'课件':'学习事项'}</span><h2 id="detail-title">${esc(item.title||item.name||'演示内容')}</h2><p>${esc(item.course||'')}</p><dl><div><dt>状态</dt><dd>${esc(status[item.status]||'以原页面为准')}</dd></div><div><dt>时间</dt><dd>${item.due?date(item.due):esc(item.dueText||'未读取到具体时间')}</dd></div><div><dt>来源</dt><dd>${esc(item.source||'Moodle 页面')}</dd></div></dl><div class="sheet-description">${esc(new DOMParser().parseFromString(item.description||'','text/html').body.textContent||'')}</div><div class="sheet-note">${opts.mode==='demo'?'当前为虚构演示数据，你可以查看界面和交互。读取真实账户后，这里会保留对应的 Moodle 原始链接。':'仅显示已经读取到的信息。通知正文、作业要求与评分细节请查看原页面。'}</div></div><footer class="sheet-footer">${target?'<a class="btn primary" href="'+esc(target)+'" target="_blank" rel="noopener noreferrer">打开 Moodle 原页面 '+icon('external')+'</a>':'<button class="btn primary" data-close-sheet>知道了</button>'}<button class="btn" data-close-sheet>关闭</button></footer>`;
   root.querySelector('.app').append(d);const close=()=>{d.close();d.remove();};d.querySelectorAll('[data-close-sheet]').forEach(b=>b.onclick=close);d.addEventListener('close',()=>d.remove());d.addEventListener('click',e=>{if(e.target===d&&e.clientX<d.getBoundingClientRect().left)close();});d.showModal();
  }

  const empty=s=>`<div class="empty">${s}</div>`;
  const panel=(title,body,action='')=>`<section class="panel"><div class="panel-head"><h2>${title}</h2>${action}</div>${body}</section>`;
  function calendar(){
   const now=Date.now(),start=new Date(key(now)+'T00:00:00+08:00');
   const weekday=Number(new Intl.DateTimeFormat('en-US',{...tz,weekday:'short'}).format(start).replace(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/g,m=>({Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6}[m])));
   const begin=start.getTime()+(offset*7-weekday)*86400000;
   const dates=Array.from({length:7},(_,i)=>begin+i*86400000),evs=events();
   const heading=fmt(begin,{year:'numeric',month:'long'})+` <span class="hint">${fmt(begin,{day:'numeric'})} — ${fmt(dates[6],{day:'numeric'})}</span>`;
   const heads=dates.map((d,i)=>`<div class="day-head ${key(d)===key(now)?'today':''}"><span>${['周一','周二','周三','周四','周五','周六','周日'][i]}</span><b>${fmt(d,{day:'numeric'}).replace('日','')}</b></div>`);
   const columns=dates.map(d=>{
    const items=evs.filter(e=>key(e.due)===key(d));
    return `<div class="day-col ${key(d)===key(now)?'today':''}">${items.map((e,i)=>{
     const hour=Number(new Intl.DateTimeFormat('en-GB',{...tz,hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date(e.due)).find(p=>p.type==='hour').value);const top=Math.max(7,Math.min(413,(hour-8)*27+8));
     const markup=`<div class="calitem ${e.status==='submitted'?'done':['assignment','quiz'].includes(e.type)?'warm':''}" style="--top:${top}px" title="${esc(e.title)}"><time>${fmt(e.due,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'})}</time><strong>${esc(e.title)}</strong><span class="cal-type">${e.status==='submitted'?'已提交':e.type==='assignment'?'作业截止':e.type==='quiz'?'测验':e.inferred?'安排待核实':e.type==='manual'?'个人安排':'日程'}</span></div>`;
     return e.type==='manual'?markup:link(e,markup);
    }).join('')}${items.length?'':'<span class="agenda-empty">暂无已读取的安排</span>'}</div>`;
   });
   const week=`<div class="week"><div class="time-head"></div>${heads.join('')}<div class="time-axis">${[8,11,14,17,20,23].map((h,i)=>`<span style="--top:${i*81+8}px">${String(h).padStart(2,'0')}:00</span>`).join('')}</div>${columns.join('')}</div>`;
   // On mobile the same seven days reflow into an agenda in chronological order.
   const mobile=`<style>@media(max-width:760px){${dates.map((_,i)=>`.week>.day-head:nth-child(${i+2}){order:${i*2}}.week>.day-col:nth-child(${i+10}){order:${i*2+1}}`).join('')}.week{display:grid;grid-template-columns:1fr}}</style>`;
   return `<section class="panel calendar"><div class="panel-head"><h2>${heading}</h2><div class="cal-tools"><button class="btn icon" data-act="prev" aria-label="上一周">${icon('left')}</button><button class="btn" data-act="today">本周</button><button class="btn icon" data-act="next" aria-label="下一周">${icon('right')}</button></div></div><div class="legend"><span><i></i>上课 / 安排</span><span><i></i>作业 / 测验</span><span><i></i>已提交</span></div>${week}${mobile}<div class="cal-foot"><span>马来西亚时间 UTC+8</span><span>仅显示已读取的安排</span></div></section>`;
  }
  function notices(list){return list.map(n=>`<article class="mini-notice"><div class="task-title">${link(n,esc(n.title))}</div><div class="task-course"><i class="notice-dot ${n.important?'important':''}"></i>${esc(short(n.course))}${n.important?' / 关键词提示':''}</div></article>`).join('')||empty('暂无已读取的课程公告。');}
  const fullName=c=>new DOMParser().parseFromString(String(c.name||''),'text/html').body.textContent;
  function courseCover(c,cls='course-cover'){
   const raw=c.image||c.coverUrl||'';let source='';
   if(/^data:image\/(?:png|jpeg|webp|gif|svg\+xml);base64,/.test(raw))source=raw;
   else try{const u=new URL(raw,connectedOrigin);if(raw&&u.origin===connectedOrigin&&!u.searchParams.has('token'))source=u.href;}catch{}
   return source?`<img class="${cls}" data-course-cover src="${esc(source)}" alt="${esc(fullName(c))}课程封面" loading="lazy">`:'';
  }
  const gradeRows=c=>{
   const rows=(c.gradeItems||[]).filter(g=>publishedGrade({grade:g.value}));
   if(rows.length)return rows;
   return publishedGrade(c)?[{name:'课程成绩',value:publishedGrade(c)}]:[];
  };
  function homeGrades(){
   const courses=currentCourses().filter(c=>gradeRows(c).length);
   if(!courses.length)return '<section class="home-grades"><header><h3>本学期成绩</h3></header><p class="note">暂无已公布成绩，公布后会显示在这里。</p></section>';
   return `<section class="home-grades"><header><h3>本学期成绩</h3><button class="grade-visibility" data-toggle-home-grades aria-pressed="${showHomeGrades}">${showHomeGrades?'隐藏成绩':'显示成绩'}</button></header>${showHomeGrades?courses.map(c=>`<section class="home-grade-course"><h4>${link({url:c.gradeUrl},esc(fullName(c)))}</h4>${gradeRows(c).map(g=>`<div class="home-grade-row"><span>${esc(g.name)}</span><strong class="home-course-grade">${esc(publishedGrade({grade:g.value}))}</strong></div>`).join('')}</section>`).join(''):''}</section>`;
  }
  function courseCards(full=false,grades=false){
   const cs=scopedCourses().filter(c=>(!courseId||String(courseId)===String(c.id))&&(!query||match(c)||arr('materials').some(m=>String(m.courseId)===String(c.id))));
   const ordered=focusCourse?[...cs].sort((x,y)=>(String(y.id)===String(focusCourse))-(String(x.id)===String(focusCourse))):cs;
   return `<div class="materials ${focusCourse?'focus-mode':''}">${ordered.map(c=>{const ms=arr('materials').filter(m=>String(m.courseId)===String(c.id));
    const focused=String(focusCourse)===String(c.id),open=expandedCourses.has(String(c.id))||focused,shown=open?ms:ms.slice(0,5),hidden=open?0:Math.max(0,ms.length-5),cover=courseCover(c);
    return `<section class="course-card ${focused?'is-focus':''} ${cover?'has-cover':''}" data-course-card="${esc(c.id)}" style="--course-ink:${courseColor(c.id)[0]};--course-tint:${courseColor(c.id)[1]}">${cover}<div class="course-body">${focused?'<div class="focus-head"><span class="focus-kicker">正在查看这门课程</span><button class="focus-clear" data-clear-focus>查看全部课程</button></div>':''}<h3>${link(c,esc(fullName(c)))}</h3>${grades?`${gradeRows(c).map(g=>`<div class="file-row grade-row"><span>${esc(g.name)}</span><b>${esc(publishedGrade({grade:g.value}))}</b></div>`).join('')||'<p class="course-meta">暂无已公布成绩</p>'}<div class="file-row">${link({url:c.gradeUrl},'查看 Moodle 评分明细')}</div>`:`<div class="course-meta">${ms.length} 份学习资料</div><div class="material-list">${shown.map(m=>link(m,icon('book')+'<span>'+esc(m.title)+'</span>','file-row')).join('')}${!ms.length?'<p class="note">暂无已读取资料</p>':''}</div>${hidden?`<button class="material-more" data-expand-materials="${esc(c.id)}" aria-expanded="${open}">${open?'收起资料':'展开其余 '+hidden+' 份'}${icon('right')}</button>`:''}`}</div></section>`;}).join('')||empty('当前范围没有课程。')}${!grades&&!query?'<p class="note">每门课程先显示 5 份资料，点击“展开其余”查看全部。资料标题会打开学校原页面。</p>':''}</div>`;
  }
  function homeCourseCard(c){
   const [ink,tint]=courseColor(c.id),count=(data.materials||[]).filter(m=>String(m.courseId)===String(c.id)).length;
   const due=(data.assignments||[]).filter(a=>String(a.courseId)===String(c.id)&&isOpen(a)).length;
   return `<button class="home-course-item" data-course="${esc(c.id)}" data-view-course style="--course-ink:${ink};--course-tint:${tint}"><span class="home-course-top">${courseCover(c,'home-course-cover')||`<span class="home-course-symbol">${icon('book')}</span>`}<span class="course-open" aria-hidden="true">${icon('right')}</span></span><span class="home-course-name">${esc(fullName(c))}</span><span class="home-course-meta"><span>${count} 份课件</span><span>${due?due+' 项待交':'暂无待交作业'}</span></span></button>`;
  }
  function homeNotices(){
   const list=arr('notices');
   return `<section class="dashboard-panel announcements-panel"><div class="section-head"><h2>课程公告 <small class="task-total">${list.length} 条</small></h2><button class="small-link" data-tab="notices">查看全部 ${icon('right')}</button></div><div class="home-announcements" tabindex="0" role="region" aria-label="课程公告">${notices(list)}</div></section>`;
  }
  function pageToolbar(){
   const statuses=[['pending','待处理'],['overdue','已逾期'],['submitted','已提交'],['unknown','待核实'],['all','全部']];
   return `${opts.mode!=='demo'&&opts.school?.webLoginReady===false&&opts.reauthorize?'<button class="btn" data-reauthorize>更新网页登录</button>':''}<select class="semester-filter" aria-label="学期范围">${[['current','本学期 / 待确认'],['past','历史学期'],['future','未开课'],['unknown','学期待确认'],['all','全部学期']].map(([v,n])=>`<option value="${v}" ${semesterScope===v?'selected':''}>${n}</option>`).join('')}</select><button class="btn" data-edit-terms>调整课程</button>${tab==='home'?'':`<select id="courses" class="course-filter" aria-label="筛选课程"><option value="">全部课程</option>${scopedCourses().map(c=>`<option value="${esc(c.id)}" ${courseId===c.id?'selected':''}>${esc(short(c.name))}</option>`).join('')}</select>`}${tab==='tasks'?`<div class="task-filters toolbar-filters" role="group" aria-label="筛选作业状态">${statuses.map(([k,n])=>`<button data-task-filter="${k}" class="${taskFilter===k?'active':''}" aria-pressed="${taskFilter===k}">${n}</button>`).join('')}</div>`:''}<button class="btn theme-toggle" data-act="theme" aria-label="切换${darkMode?'浅色':'深色'}模式">${icon('theme')}</button><button class="btn primary" data-act="sync" ${busy?'disabled':''}>${icon('refresh')}${busy?'整理中…':'刷新内容'}</button>`;
  }
  function homeModules(){
   const list=taskList(taskFilter);
   return `<section class="home-dashboard"><div class="dashboard-grid"><div class="dashboard-main"><section class="dashboard-panel courses-panel"><div class="section-head"><h2>本学期课程 <small class="task-total">${currentCourses().length} 门</small></h2><button class="small-link" data-tab="courses" aria-label="查看课程中心">${icon('arrow')}</button></div><div class="home-course-list" tabindex="0" role="region" aria-label="本学期课程"><div class="home-course-grid">${currentCourses().map(homeCourseCard).join('')||'<p class="note">暂未识别到本学期课程，可调整课程或查看全部。</p>'}</div><p class="term-hint">${data.courses.filter(c=>term(c).kind==='unknown').length} 门学期待确认 · 按课程日期与名称推断</p></div><div class="panel-foot"><button class="small-link" data-tab="courses">打开课程中心 ${icon('right')}</button></div></section><div class="home-support"><section class="dashboard-panel grades-panel" aria-label="本学期成绩">${homeGrades()}</section>${homeNotices()}</div></div><aside class="dashboard-panel assignments-panel" aria-label="作业清单"><div class="section-head"><h2>作业清单 <small class="task-total">${list.length} 项</small></h2><div class="task-filters home-filters" aria-label="筛选作业状态">${[['pending','待处理'],['overdue','已逾期'],['submitted','已提交'],['all','全部']].map(([k,n])=>`<button data-task-filter="${k}" class="${taskFilter===k?'active':''}" aria-pressed="${taskFilter===k}">${n}</button>`).join('')}</div></div><div class="tasklist" role="region" aria-label="首页完整作业清单" tabindex="0">${list.map(taskRow).join('')||empty('当前分类暂无记录。可切换分类查看其他事项。')}</div><div class="panel-foot">${icon('info')}${list.length>2?`共 ${list.length} 项，可在列表内滚动查看`:'提交状态以 Moodle 原页面为准'}</div></aside></div></section><div class="home-bottom"><span><i class="status-dot"></i>${opts.mode==='demo'?'演示模式 · 虚构数据':data.syncedAt?(data.fromCache?'本机缓存 · ':'最近更新 ')+date(data.syncedAt):'等待读取学习内容'}</span><button class="small-link" data-act="info">读取说明 ${icon('info')}</button></div>`;
  }
  function contents(){
   if(tab==='home')return homeModules();
   if(tab==='courses')return courseCards();
   if(tab==='calendar'){
    const upcoming=events().filter(e=>e.due>=Date.now()).slice(0,5);
    return `<div class="schedule-layout">${calendar()}<aside class="schedule-rail">${panel('添加个人安排',`<form id="manual" class="manual-form"><label>安排名称<input name="title" placeholder="例如：物理课 A3-201" maxlength="180" required></label><label>日期与时间（UTC+8）<input name="when" type="datetime-local" required></label><button class="btn primary">${icon('plus')}添加安排</button></form><div class="note">个人安排仅保留在本次看板会话中，关闭页面后需重新添加。</div>`)}${panel('接下来',`<div class="upcoming-list">${upcoming.map(e=>`<article class="upcoming-item" style="--course-ink:${courseColor(e.courseId)[0]};--course-tint:${courseColor(e.courseId)[1]}">${courseBadge(e)}<div><strong>${esc(e.title)}</strong><span>${date(e.due)} · ${e.type==='assignment'?'作业截止':e.type==='quiz'?'测验':e.type==='manual'?'个人安排':'日程'}</span></div></article>`).join('')||empty('接下来七天没有已读取的安排。')}</div>`)}</aside></div>`;
   }
   if(tab==='tasks'){
    const xs=taskList(taskFilter);
    return `<div class="all-tasks">${panel(taskFilter==='overdue'?'已逾期作业与测验':'作业与测验',`<div class="tasklist task-grid">${xs.map(taskRow).join('')||empty('当前分类下没有记录。可切换分类或清除筛选条件。')}</div><div class="note">上方可切换作业状态。已逾期仅包含超过截止时间且未提交或仍为草稿的事项；状态未知的保留在待核实。待处理按截止时间由近到远，已逾期、已提交和全部按截止时间由新到旧，无日期的放在最后。</div>`)}</div>`;
   }
   if(tab==='notices'){
    const list=arr('notices');
    return `<div class="notice-layout">${panel('通知与课程公告',`<div class="notice-grid">${list.map(n=>`<article class="notice-card" style="--course-ink:${courseColor(n.courseId)[0]};--course-tint:${courseColor(n.courseId)[1]}"><div class="notice-card-top">${courseBadge(n)}${n.important?'<span class="notice-flag">关键词提示</span>':''}</div><div class="task-title">${link(n,esc(n.title))}</div><div class="notice-meta">${n.due?date(n.due):'时间以原页面为准'}${n.important?' · 建议优先查看':''}</div></article>`).join('')||empty('暂无已读取的课程公告。')}</div><div class="note">“关键词提示”依据标题判断。展示已读取的公告与通知；具体覆盖范围见下方数据说明。</div>`)}</div>`;
   }
   if(tab==='materials')return courseCards(true);
   return `<div class="grade-layout"><p class="page-note">${icon('info')}成绩按学校原始值显示。不同课程满分可能不同；“—”表示未公布或未读取到成绩，不换算 GPA。</p>${courseCards(false,true)}</div>`;
  }
  function render(){
   const animate=viewMotion&&root.querySelector('.app')&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
   renderContent();
   if(animate){
    const main=root.querySelector('.main');
    main.classList.remove('view-enter');
    main.animate([{transform:'translateY(12px)',filter:'blur(1px)'},{transform:'translateY(0)',filter:'blur(0)'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
    root.querySelector('.nav button.active')?.animate([{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
   }
  }
  function renderContent(){
   const pendingCount=pending().length;
   root.innerHTML=`<style>${css}</style><div class="app ${tab==='home'?'home-mode':''} ${darkMode?'is-dark':''}"><aside class="rail"><div><div class="brand"><img class="brand-symbol" src="${StudyIdentity.base}syllo-logo.png" alt="Syllo 标志" width="42" height="42"><span class="brand-text"><img class="brand-wordmark" src="${StudyIdentity.base}syllo-wordmark.svg" alt="Syllo"></span></div><div class="school" title="${esc(identity.name)}">${esc(identity.name)}</div></div><nav class="nav" aria-label="主要导航">${Object.entries(names).map(([k,v])=>`<button data-tab="${k}" title="${v}" aria-label="${v}" aria-current="${tab===k?'page':'false'}" class="${tab===k?'active':''} ${k==='home'?'nav-overview':''} ${k==='materials'?'nav-section-start':''}">${icon(k)}<span class="nav-label">${v}</span><span class="nav-arrow" aria-hidden="true">${icon('right')}</span>${k==='tasks'&&pendingCount?`<span class="count">${pendingCount}</span>`:''}</button>`).join('')}</nav><div><div class="rail-label">我的课程</div><div class="course-nav">${data.courses.slice(0,6).map(c=>`<button data-course="${esc(c.id)}" class="${courseId===c.id?'active':''}" title="${esc(c.name)}"><i class="sq" style="--course:${courseColor(c.id)[0]}"></i><span>${esc(short(c.name))}</span></button>`).join('')}</div></div><div class="rail-bottom"><button class="school-link" data-act="close">${icon('external')}返回原版 Moodle</button><a class="moodle-credit" href="https://moodle.org/" target="_blank" rel="noopener noreferrer"><span>Powered by</span><img src="${StudyIdentity.base}moodle-logo.svg" alt="Moodle"></a></div></aside><div class="workspace"><header class="topbar topbar-unified"><div class="breadcrumb">${tab==='home'?'<span class="home-context">'+esc(identity.name)+' <span>/</span> 学习空间</span>':esc(identity.name)+' <span aria-hidden="true"> / </span> <b>'+names[tab]+'</b>'}</div><div class="page-toolbar" aria-label="页面设置">${pageToolbar()}</div><div class="top-actions"><label class="searchbox">${icon('search')}<input id="search" aria-label="搜索" placeholder="搜索课程、作业或课件" value="${esc(query)}"></label>${opts.mode==='demo'?'<span class="demo-badge">演示数据</span>':''}</div></header><main class="main ${viewMotion?'view-enter':''}"><div class="heading"><div><h1>${names[tab]}</h1><div class="sub"><span>${fmt(Date.now(),{month:'long',day:'numeric',weekday:'long'})}</span>${tab==='home'?'，选择一个模块，直接开始。':`<span class="summary-inline"><span>${icon('tasks')}<b>${pendingCount}</b> 项待交</span><span>${icon('materials')}<b>${arr('materials').length}</b> 份课件</span>${arr('assignments').filter(x=>x.status==='unknown').length?`<span>${icon('info')}<b>${arr('assignments').filter(x=>x.status==='unknown').length}</b> 项待核实</span>`:''}</span>`}</div></div></div><div class="progress" role="status">${esc(error||progress)}</div><div class="tabsbar" ${tab==='home'?'hidden':''}><div class="tabs" role="navigation" aria-label="内容分类">${[['home','今天'],['tasks','作业'],['notices','通知'],['materials','课件'],['grades','成绩']].map(([k,n])=>`<button data-tab="${k}" class="${tab===k?'active':''}" aria-current="${tab===k?'page':'false'}">${n}</button>`).join('')}</div></div>${contents()}<details class="source" ${tab==='home'?'hidden':''}><summary>${opts.mode==='demo'?'当前为虚构演示数据':'读取范围与数据说明'}${data.syncedAt?' / '+date(data.syncedAt)+' 更新':''}</summary><p>${opts.mode==='demo'?'演示中的课程、作业、通知与成绩均为虚构示例。真实数据请通过 Syllo 客户端连接学校。':'数据仅保留在当前页面内存中。日历范围受 Moodle 预告设置限制，未读取到记录不代表没有课或没有考试。'}<br>${(data.warnings||[]).map(esc).join('<br>')}</p></details><footer class="footer" ${tab==='home'?'hidden':''}>Syllo 0.8 · 学习信息以 Moodle 和学校正式通知为准</footer></main></div></div>`;
   viewMotion=false;
   StudyIdentity.bind(root,identity);
   root.querySelectorAll('[data-course-cover]').forEach(img=>img.addEventListener('error',()=>img.remove()));
   root.querySelectorAll('[data-visit-course]').forEach(a=>a.addEventListener('click',()=>recordVisit(a.dataset.visitCourse)));
   root.querySelectorAll('[data-toggle-home-grades]').forEach(b=>b.onclick=()=>{showHomeGrades=!showHomeGrades;try{localStorage.setItem(homeGradeKey,showHomeGrades?'shown':'hidden');}catch{}render();});
   root.querySelectorAll('[data-reauthorize]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await opts.reauthorize();}catch(e){toast(e.message);}finally{b.disabled=false;}});
   root.querySelectorAll('[data-edit-terms]').forEach(b=>b.onclick=editTerms);
   root.querySelectorAll('[data-unavailable-link]').forEach(a=>a.onclick=e=>{e.preventDefault();try{showDetails(JSON.parse(a.dataset.item));}catch{toast('未读取到事项详情，请到 Moodle 原页面查看。');}});
   root.querySelectorAll('[data-open-details]').forEach(b=>b.onclick=()=>showDetails(JSON.parse(b.dataset.openDetails)));
   root.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{const id=b.dataset.pin;pins.has(id)?pins.delete(id):pins.add(id);render();toast(pins.has(id)?'已置顶，在本次看板会话内优先展示。':'已取消置顶。');});
   root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{if(tab===b.dataset.tab)return;tab=b.dataset.tab;if(tab!=='materials')focusCourse='';viewMotion=true;render();root.host.scrollTop=0;});
   root.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>{recordVisit(b.dataset.course);if(b.hasAttribute('data-view-course')){focusCourse=b.dataset.course;tab='materials';const sel=root.querySelector('#courses');if(sel)sel.value='';courseId='';}else{courseId=courseId===b.dataset.course?'':b.dataset.course;}render();});
   root.querySelectorAll('[data-task-filter]').forEach(b=>b.onclick=()=>{taskFilter=b.dataset.taskFilter;viewMotion=false;render();});
   root.querySelectorAll('[data-clear-focus]').forEach(b=>b.onclick=()=>{focusCourse='';render();});
   root.querySelectorAll('[data-expand-materials]').forEach(b=>b.onclick=()=>{const id=String(b.dataset.expandMaterials);expandedCourses.has(id)?expandedCourses.delete(id):expandedCourses.add(id);render();});
   root.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{const a=b.dataset.act;if(a==='sync')load(true);else if(a==='close')opts.close?.();else if(a==='theme'){darkMode=!darkMode;render();}else if(a==='info'){toast(opts.mode==='demo'?'当前内容均为虚构演示。真实数据需在 Moodle 中通过扩展读取。':'已读取的记录可能受学校页面范围限制，请核对原始通知和活动页面。');}else{offset=a==='today'?0:offset+(a==='prev'?-1:1);render();}});
   root.querySelectorAll('.semester-filter').forEach(el=>el.onchange=e=>{semesterScope=e.target.value;courseId='';focusCourse='';render();});
   const courseSel=root.querySelector('#courses');if(courseSel)courseSel.onchange=e=>{courseId=e.target.value;focusCourse='';render();};
   root.querySelector('#search').oninput=e=>{const pos=e.target.selectionStart;query=e.target.value;render();const el=root.querySelector('#search');el.focus();el.setSelectionRange(pos,pos);};
   const form=root.querySelector('#manual');if(form)form.onsubmit=e=>{e.preventDefault();const f=new FormData(form);manual.push({id:'manual-'+Date.now(),title:f.get('title'),due:Date.parse(f.get('when')+'+08:00'),type:'manual',courseId,source:'个人安排'});render();};
  }
  async function load(force=false){if(busy)return;const hadData=Boolean(data.syncedAt);busy=true;error='';render();try{data=await opts.load(s=>{progress=s;const el=root.querySelector('.progress');if(el)el.textContent=s;},{force});}catch(e){error='读取失败：'+e.message+'。请检查登录状态后重试，已保留上次成功结果。';}finally{busy=false;progress='';viewMotion=true;render();if(!error&&hadData)toast(opts.mode==='demo'?'演示内容已刷新。':'学习内容已更新。');}}
  render();if(!opts.skipInitialLoad)load();
 }
 return {mount};
})();
