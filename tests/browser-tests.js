const results=[];
const test=(name,fn)=>{try{fn();results.push('PASS · '+name);}catch(e){results.push('FAIL · '+name+' — '+e.message);}};
const assert={equal:(a,b)=>{if(a!==b)throw Error(JSON.stringify(a)+' !== '+JSON.stringify(b));},throws:(fn,re)=>{try{fn();}catch(e){if(re.test(e.message))return;throw e;}throw Error('Expected error');}};
const p=globalThis.StudyParser;
const doc=s=>new DOMParser().parseFromString(s,'text/html');
test('calendar deadline does not imply submission is pending',()=>{
 const [e]=p.calendar(doc('<div data-event-id="1" data-course-id="c" data-event-component="mod_assign" data-event-title="Tutorial 2 is due"><a href="/calendar/view.php?view=day&amp;time=1794924000">Date</a><a href="/mod/assign/view.php?id=1">Activity</a></div>'));
 assert.equal(e.type,'assignment');assert.equal(e.status,'unknown');assert.equal(e.due,1794924000000);
 assert.equal(e.url,'https://l.xmu.edu.my/mod/assign/view.php?id=1');
});
test('Chinese and English submission states, including draft and unrecognized',()=>{
 for(const [value,want] of [['已经提交','submitted'],['Submitted for grading','submitted'],['草稿（未提交）','draft'],['Nothing has been submitted for this assignment','pending'],['尚未提交','pending'],['Unexpected','unknown']]){
  assert.equal(p.assignment(doc(`<table><tr><td>提交状态</td><td>${value}</td></tr></table>`)).status,want);
 }
 assert.equal(p.assignment(doc('<button>Marked as done</button>')).status,'unknown');
});
test('raw grades are preserved; missing grades stay missing',()=>{
 const cs=p.grades(doc('<table id="overview-grade"><tr><td><a href="/course/user.php?id=10&amp;mode=grade">Course A</a></td><td>552.69</td></tr><tr><td><a href="/course/user.php?id=20">Course B</a></td><td>-</td></tr></table>'));
 assert.equal(cs[0].grade,'552.69');assert.equal(cs[1].grade,'-');assert.equal(cs[0].id,'10');
 assert.throws(()=>p.grades(doc('<h1>Login</h1>')),/未识别/);
});
test('course activities are grouped and deduplicated; navigation excluded',()=>{
 const x=p.course(doc('<main role="main"><a href="/mod/resource/view.php?id=1">Notes 文件</a><a href="/mod/resource/view.php?id=1">Notes 文件</a><a href="/mod/assign/view.php?id=2">Task 作业</a><a href="/mod/quiz/view.php?id=3">Quiz</a><a href="/mod/forum/view.php?id=4">Announcements</a></main>'),{id:'10',name:'Course'});
 assert.equal(x.materials.length,1);assert.equal(x.assignments.length,1);assert.equal(x.quizzes.length,1);assert.equal(x.forums.length,1);
 assert.equal(x.assignments[0].status,'unknown');
 assert.equal(x.assignments[0].url,'https://l.xmu.edu.my/mod/assign/view.php?id=2');
 assert.equal(x.materials[0].url,'https://l.xmu.edu.my/mod/resource/view.php?id=1');
});
test('date parsing uses Malaysia UTC+8, including 12 am/pm',()=>{
 assert.equal(p.parseDue('Due: 2026年11月17日 星期二 22:00'),Date.parse('2026-11-17T22:00:00+08:00'));
 assert.equal(p.parseDue('Tuesday, 17 November 2026, 10:00 PM'),Date.parse('2026-11-17T22:00:00+08:00'));
 assert.equal(p.parseDue('17 November 2026, 12:00 am'),Date.parse('2026-11-17T00:00:00+08:00'));
 assert.equal(p.parseDue('Not available'),null);
});
test('title-only exam/class inference and destination limits',()=>{
 assert.equal(p.classify('Final examination'),'exam');assert.equal(p.classify('Final examination','mod_quiz'),'quiz');
 assert.equal(p.url('javascript:alert(1)'),'');assert.equal(p.url('https://evil.example/'),'');assert.equal(p.url('//evil.example/'),'');
 assert.equal(p.url('/course/view.php?id=1'),'https://l.xmu.edu.my/course/view.php?id=1');
});

document.querySelector('#results').textContent=results.join('\n');document.title=results.some(x=>x.startsWith('FAIL'))?'Tests failed':'6 tests passed';
