/* Read-only same-origin adapter. Account data stays in memory. */
globalThis.StudyParser = (() => {
  const BASE='https://l.xmu.edu.my';
  const text=n=>(n?.textContent||'').replace(/\s+/g,' ').trim();
  const all=(d,s)=>Array.from(d.querySelectorAll(s));
  function url(raw) {
    try {const u=new URL(raw,BASE);return u.origin===BASE&&u.protocol==='https:'?u.href:'';} catch {return '';}
  }
  function classify(title,component='') {
    if(component==='mod_assign') return 'assignment';
    if(component==='mod_quiz') return 'quiz';
    if(/exam|mid.?term|final|考试|期中|期末/i.test(title)) return 'exam';
    if(/lecture|tutorial|class\b|上课|课表/i.test(title)) return 'class';
    return 'event';
  }
  function grades(doc) {
    const table=doc.querySelector('#overview-grade,table.overview-grade');
    if(!table) throw Error('成绩总览结构未识别；请查看原始成绩页。');
    return all(table,'tr').flatMap(row=>{
      const a=row.querySelector('a[href*="/course/"]');if(!a)return [];
      const href=url(a.getAttribute('href'));if(!href)return [];
      const id=new URL(href).searchParams.get('id');
      return [{id,name:text(a),grade:text(row.querySelector('td:last-child')),url:BASE+'/course/view.php?id='+id,gradeUrl:href}];
    });
  }
  function calendar(doc) {
    return all(doc,'[data-event-id]').map(el=>{
      const links=all(el,'a[href]');
      const t=links.find(a=>a.getAttribute('href').includes('time='));
      const due=t&&url(t.getAttribute('href'))?Number(new URL(url(t.getAttribute('href'))).searchParams.get('time'))*1000:null;
      const a=links.find(a=>/\/mod\//.test(a.getAttribute('href'))),c=links.find(a=>/\/course\/view/.test(a.getAttribute('href')));
      const title=el.getAttribute('data-event-title')||text(el.querySelector('h3'));
      const type=classify(title,el.getAttribute('data-event-component'));
      return {id:'event-'+el.dataset.eventId,title,due,type,courseId:el.dataset.courseId,course:text(c),url:url(a?.getAttribute('href')||t?.getAttribute('href')||'/calendar/view.php'),status:'unknown',inferred:type==='exam'||type==='class',source:'Moodle 日历'};
    });
  }
  function course(doc,c) {
    const main=doc.querySelector('[role="main"],#region-main')||doc;
    const seen=new Set(),result={materials:[],assignments:[],forums:[],quizzes:[]};
    for(const a of all(main,'a[href*="/mod/"]')) {
      const href=url(a.getAttribute('href'));if(!href||seen.has(href))continue;seen.add(href);
      const type=new URL(href).pathname.split('/')[2];
      const title=text(a.querySelector('.instancename')||a).replace(/\s+(文件|文件夹|作业|讨论区|测验)$/,'');if(!title)continue;
      const item={id:href,title,url:href,courseId:c.id,course:c.name,type,source:'课程页面'};
      if(['resource','folder','url','page','book'].includes(type))result.materials.push(item);
      if(type==='assign')result.assignments.push({...item,type:'assignment',status:'unknown',due:null});
      if(type==='quiz')result.quizzes.push({...item,type:'quiz',status:'unknown',due:null});
      if(type==='forum'&&/announcement|通知|公告/i.test(title))result.forums.push(item);
    }
    return result;
  }
  function assignment(doc) {
    const rows=all(doc,'tr');
    const row=rows.find(r=>/^(提交状态|Submission status)$/i.test(text(r.querySelector('th,td'))));
    if(!row)return {status:'unknown',statusText:'未能识别提交状态'};
    const statusText=text(row.querySelector('td:last-child'));
    const status=/已经提交|已提交|Submitted for grading/i.test(statusText)?'submitted':/草稿|Draft/i.test(statusText)?'draft':/尚未提交|未提交|No submissions|Nothing has been submitted/i.test(statusText)?'pending':'unknown';
    const dueRow=rows.find(r=>/^(截止日期|截止时间|Due date)$/i.test(text(r.querySelector('th,td'))));
    let dueText=text(dueRow?.querySelector('td:last-child'));
    if(!dueText)dueText=all(doc,'[data-region="activity-dates"] div').map(text).find(t=>/^(Due:|截止)/i.test(t))||'';
    return {status,statusText,dueText,due:parseDue(dueText)};
  }
  function parseDue(s) {
    let m=s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日.*?(\d{1,2}):(\d{2})/);
    if(m)return Date.parse(`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}T${m[4].padStart(2,'0')}:${m[5]}:00+08:00`);
    m=s.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4}),?\s+(\d{1,2}):(\d{2})(?:\s*([ap]m))?/i);
    if(!m)return null;
    const month=['january','february','march','april','may','june','july','august','september','october','november','december'].indexOf(m[2].toLowerCase())+1;
    let h=Number(m[4]);if(m[6])h=h%12+(/pm/i.test(m[6])?12:0);
    return Date.parse(`${m[3]}-${String(month).padStart(2,'0')}-${m[1].padStart(2,'0')}T${String(h).padStart(2,'0')}:${m[5]}:00+08:00`);
  }
  function notices(doc,c) {
    return all(doc,'a[href*="/mod/forum/discuss.php"]').map(a=>({id:url(a.getAttribute('href')),url:url(a.getAttribute('href')),title:text(a),course:c.name,courseId:c.id,source:'课程公告',important:/exam|deadline|urgent|cancel|important|考试|截止|取消|重要/i.test(text(a))})).filter(x=>x.url&&x.title);
  }
  async function page(path) {
    const target=url(path);if(!target)throw Error('已阻止非学校域名请求');
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
    try {
      const response=await fetch(target,{credentials:'same-origin',signal:controller.signal,redirect:'error'});
      if(!response.ok)throw Error('学校页面返回 HTTP '+response.status);
      const doc=new DOMParser().parseFromString(await response.text(),'text/html');
      if(doc.querySelector('input[name="password"]'))throw Error('登录已过期，请先登录 XMUM Moodle');
      return doc;
    } finally {clearTimeout(timeout);}
  }
  function unique(xs){return Array.from(new Map(xs.map(x=>[x.id,x])).values());}
  async function sync(progress=()=>{}) {
    const data={courses:[],events:[],assignments:[],materials:[],notices:[],quizzes:[],warnings:[],syncedAt:Date.now(),mode:'live'};
    progress('正在读取课程与成绩…');data.courses=grades(await page('/grade/report/overview/index.php'));
    progress('正在读取近期日历…');
    try{data.events=calendar(await page('/calendar/view.php?view=upcoming'));}catch(e){data.warnings.push('日历：'+e.message);}
    for(let i=0;i<data.courses.length;i++) {
      const c=data.courses[i];progress(`正在整理课程 ${i+1}/${data.courses.length}：${c.name}`);
      try {
        const items=course(await page(c.url),c);
        data.materials.push(...items.materials);data.assignments.push(...items.assignments);data.quizzes.push(...items.quizzes);
        for(const f of items.forums)try{data.notices.push(...notices(await page(f.url),c));}catch(e){data.warnings.push(c.name+' 公告：'+e.message);}
      }catch(e){data.warnings.push(c.name+'：'+e.message);}
    }
    for(let i=0;i<data.assignments.length;i++) {
      const a=data.assignments[i];progress(`核对提交状态 ${i+1}/${data.assignments.length}…`);
      try{Object.assign(a,assignment(await page(a.url)));}catch(e){data.warnings.push(a.title+'：'+e.message);}
      const matching=data.events.find(e=>new URL(e.url).pathname===new URL(a.url).pathname&&new URL(e.url).searchParams.get('id')===new URL(a.url).searchParams.get('id'));
      if(matching){a.due=matching.due;matching.status=a.status;}
    }
    data.materials=unique(data.materials);data.notices=unique(data.notices);
    data.warnings.push('近期日历受 Moodle 预告范围限制，不代表整个学期。尚未解析附件课表、线下考试、Turnitin 或教务系统。缺少时间的任务请查看原页面。');
    return data;
  }
  return {grades,calendar,course,assignment,notices,classify,sync,url,parseDue};
})();
