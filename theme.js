globalThis.StudyThemeCSS=`
:host{all:initial;font:400 15px/1.6 VCIOutfit,SylloCN,sans-serif;color:#292f36;font-synthesis:none;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
[hidden]{display:none!important}
button,input,select{font:inherit}
button,a{touch-action:manipulation}
button{cursor:pointer;border:0}
button,a,input,select{transition:background-color .16s,color .16s,border-color .16s,box-shadow .16s}
a{color:inherit;text-decoration:none}
a:hover{color:var(--accent)}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid #f98012;outline-offset:3px}
svg{display:block;width:19px;height:19px;flex:none}
h1,h2,h3,h4,p{margin:0}
h1,h2,h3,h4{font-weight:600}
::selection{background:#ffe0b9;color:#713a00}
.app{--canvas:#f5f6f7;--surface:#fff;--ink:#292f36;--muted:#626b75;--line:#e3e6e9;--accent:#b75a00;--accent-soft:#fff1df;--soft:#f5f6f7;--sage:#b75a00;display:grid;grid-template-columns:224px minmax(0,1fr);min-height:100dvh;background:var(--canvas);color:var(--ink);font-family:VCIOutfit,SylloCN,sans-serif}
.app.is-dark{--canvas:#202327;--surface:#282d32;--ink:#edf0f3;--muted:#b0b7c1;--line:#41484f;--accent:#ffad5d;--accent-soft:#483424;--soft:#31373d;--sage:#ffad5d}
.rail{height:calc(100dvh - 24px);position:sticky;top:12px;margin:12px 0 12px 12px;display:flex;flex-direction:column;gap:24px;padding:24px 12px 18px;background:var(--surface);border:1px solid var(--line);border-radius:30px;color:var(--muted);min-height:0;overflow:auto;scrollbar-width:thin}
.brand{display:flex;gap:12px;align-items:center;padding:0 8px;min-height:45px}
.brand-symbol{display:block;width:42px;height:42px;object-fit:contain;flex:none}
.brand-text{display:flex;align-items:center}
.brand-wordmark{width:104px;height:42px;object-fit:contain}
.school-mark{width:42px;height:42px;display:grid;place-items:center;flex:none;position:relative;overflow:hidden;border-radius:11px}
.school-mark svg{width:42px;height:42px}
.school-mark img{position:absolute;width:100%;height:100%;object-fit:contain;background:white;padding:2px}
.school-mark.has-school-logo>svg{visibility:hidden}
.school{margin:12px 8px 0;padding-top:12px;border-top:1px solid #e1e4e7;font-size:11px;line-height:1.6;color:#7b838c;overflow-wrap:anywhere}
.nav{display:grid;gap:5px}
.nav button{position:relative;display:flex;align-items:center;gap:10px;min-height:48px;padding:11px 14px;border-radius:999px;background:transparent;color:var(--muted);text-align:left;font-size:14px;font-weight:500;transition:background .24s,box-shadow .24s,transform .24s cubic-bezier(.22,1,.36,1),color .24s}
.nav button svg{stroke-width:1.65}
.nav button:hover{background:var(--soft);color:var(--ink);transform:translateX(2px)}
.nav button.active{background:var(--accent-soft);color:var(--accent);box-shadow:inset 0 0 0 1px #f9801230,0 5px 12px #a9590010}
.nav button.active:before{content:none}
.nav-overview{margin-bottom:12px}
.nav-section-start{margin-top:14px}
.nav-section-start:after{content:none}
.nav .count{background:var(--accent-soft);color:var(--accent);min-width:22px;text-align:center;font-size:11px;border-radius:999px;padding:1px 5px;order:1}
.rail-label,.course-nav{display:none}
.rail-bottom{margin-top:auto;border-top:1px solid #e1e4e7;padding:14px 8px 0}
.school-link{display:flex;align-items:center;gap:8px;background:transparent;color:#67717c;font-size:12px;padding:7px 0}
.school-link svg{width:15px;height:15px}
.moodle-credit{display:flex;align-items:center;gap:8px;margin-top:14px;color:#8b9199;font-size:10px}
.moodle-credit img{width:74px;height:23px;object-fit:contain}
.workspace{min-width:0;display:flex;flex-direction:column}
.topbar{height:64px;flex:none;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:0 28px;border-bottom:1px solid var(--line);background:var(--surface)}
.breadcrumb{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--muted)}
.breadcrumb span span{padding:0 9px;color:#a5aab0}
.top-actions{display:flex;align-items:center;gap:12px}
.searchbox{display:flex;align-items:center;gap:8px;padding:8px 11px;background:var(--soft);border:1px solid var(--line);border-radius:8px;width:250px;color:var(--muted)}
.searchbox svg{width:15px;height:15px}
.searchbox input{width:100%;min-width:0;background:none;color:var(--ink);border:0;outline:0;font-size:12px}
.demo-badge{font-size:10px;color:var(--accent);background:var(--accent-soft);padding:4px 7px;border-radius:5px}
.main{padding:24px 28px 18px;min-width:0}
.heading,.dashboard-heading{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:22px}
.heading h1,.dashboard-heading h1{font-size:29px;line-height:1.3;font-weight:600}
.sub,.dashboard-heading p{font-size:12px;color:var(--muted);margin-top:7px;line-height:1.65}
.dashboard-date{font-size:11px;color:var(--muted);margin-bottom:5px}
.heading-dot{display:none}
.buttons{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.btn,.small-link{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:9px 12px;font-size:12px;line-height:1.5;min-height:35px}
.btn:hover{background:var(--soft);border-color:#c6ccd2}
.btn.primary{background:#f98012;color:#382008;border-color:#f98012}
.btn.primary:hover{background:#f5a14c;border-color:#f5a14c}
.btn:active{transform:translateY(1px)}
.btn:disabled{opacity:.55;cursor:wait}
.btn svg{width:16px;height:16px}
.theme-toggle{padding:9px;width:36px}
.small-link{border:0;background:transparent;color:var(--muted);padding:3px 0;min-height:0;font-size:11px}
.small-link svg{width:14px;height:14px}
.small-link:hover{color:var(--accent)}
.progress{font-size:12px;line-height:1.7;color:var(--accent);margin-bottom:10px}
.progress:empty{display:none}
.summary{display:flex;gap:20px;font-size:12px;color:var(--muted);margin:10px 0 18px}
.summary span{display:flex;align-items:center;gap:6px}
.summary svg{width:15px;height:15px}
.summary b{color:var(--ink);font-weight:500}
.summary .warm{color:var(--accent)}
.tabsbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:22px}
.tabs{display:flex;gap:4px;flex:1;flex-wrap:wrap;background:var(--soft);padding:4px;border-radius:24px}
.tabs button{padding:9px 16px;background:transparent;color:var(--muted);border:0;border-radius:999px;font-size:13px;min-height:40px}
.tabs button.active{color:var(--accent);background:var(--surface);box-shadow:0 3px 8px #20252b0c}
.course-filter,.semester-filter{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:999px;font-size:12px;padding:9px 12px;max-width:220px}
.semester-filter{max-width:165px}
.home-mode{height:100dvh;min-height:0;overflow:hidden}
.home-mode .workspace{height:100%;min-height:0}
.home-mode .main{flex:1;min-height:0;display:flex;flex-direction:column;padding-bottom:12px}
.home-mode .heading{display:none}
.home-dashboard{flex:1;min-height:0;display:flex;flex-direction:column}
.dashboard-grid{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:14px}
.dashboard-panel,.panel,.course-card{border:1px solid var(--line);border-radius:26px;background:var(--surface);min-width:0}
.dashboard-panel{padding:14px;display:flex;flex-direction:column;min-height:0}
.section-head,.panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px;flex:none;min-height:28px}
.section-head h2,.panel-head h2{font-size:18px;font-weight:600;color:var(--ink);line-height:1.4}
.task-total{font-size:12px;font-weight:400;color:var(--muted);margin-left:6px}
.task-filters{display:flex;gap:3px;flex-wrap:wrap;margin-bottom:15px;flex:none;padding:4px;background:var(--soft);border-radius:24px}
.task-filters button{padding:7px 10px;background:transparent;color:var(--muted);border:0;border-radius:999px;font-size:12px;min-height:36px}
.task-filters button.active{color:var(--accent);background:var(--surface);box-shadow:0 3px 8px #20252b0c}
.task{position:relative;display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);min-width:0}
.task:last-child{border-bottom:0}
.course-badge{width:70px;min-width:70px;min-height:32px;align-self:flex-start;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px 5px;border-radius:7px;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:600;line-height:1.45;overflow-wrap:anywhere}
.task-content{min-width:0;flex:1;padding-right:24px}
.task-title{font-size:15px;line-height:1.5;color:var(--ink);font-weight:500;overflow-wrap:anywhere}
.task-title a:hover{color:var(--accent)}
.task-course{font-size:11px;line-height:1.7;color:var(--muted);margin-top:4px;overflow-wrap:anywhere}
.task-bottom{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:6px;font-size:11px;color:var(--muted)}
.task-bottom>span:first-child{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.task-bottom svg{width:12px;height:12px}
.deadline-countdown{font-style:normal;color:var(--accent);font-size:11px}
.chip{font-size:10px;border-radius:4px;padding:2px 6px;white-space:nowrap;background:var(--soft);color:var(--muted)}
.chip.pending,.chip.draft{color:var(--accent);background:var(--accent-soft)}
.chip.submitted{color:#47654a;background:#edf4ed}
.task-actions{display:flex;gap:5px;flex:none;align-self:flex-start}
.detail-btn,.pin-btn{display:flex;align-items:center;justify-content:center;background:none;color:var(--muted);padding:3px;border-radius:5px;min-width:20px;min-height:24px}
.detail-btn svg,.pin-btn svg{width:14px;height:14px}
.detail-btn:hover,.pin-btn:hover{color:var(--accent);background:var(--accent-soft)}
.pin-btn.is-pinned{color:var(--accent)}
.pin-btn.is-pinned svg{fill:var(--accent-soft)}
.home-mode .tasklist{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding-right:4px;scrollbar-width:thin;scrollbar-color:#c3c8ce transparent}
.tasklist:focus-visible{outline:2px solid #f98012;outline-offset:3px;border-radius:5px}
.panel-foot{display:flex;align-items:center;gap:5px;flex:none;padding-top:12px;border-top:1px solid var(--line);font-size:10px;color:var(--muted);margin-top:8px}
.panel-foot svg{width:12px;height:12px}
.home-bottom{display:flex;align-items:center;justify-content:space-between;gap:15px;font-size:10px;color:var(--muted);padding-top:12px;flex:none}
.status-dot{display:inline-block;width:4px;height:4px;border-radius:50%;background:#a9afb6;margin-right:6px}
.home-course-list{flex:1;min-height:0;overflow:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:#c3c8ce transparent}
.home-course-list>h3{font-size:12px;font-weight:400;color:var(--muted);margin-bottom:8px}
.home-course-item{display:flex;width:100%;align-items:center;gap:11px;padding:11px 0;min-height:48px;border-bottom:1px solid var(--line);background:none;color:var(--ink);text-align:left}
.home-course-item>span{min-width:0;flex:1;font-size:15px;line-height:1.65;overflow-wrap:anywhere}
.home-course-item>svg{width:14px;height:14px;color:var(--muted)}
.home-course-item:hover{color:var(--accent)}
.home-course-cover{width:56px;height:40px;object-fit:cover;border-radius:6px;flex:none}
.term-hint{font-size:10px;line-height:1.7;color:var(--muted);margin:12px 0}
.home-grades{margin-top:24px;margin-bottom:8px;border-top:1px solid var(--line);padding:20px 0 0}
.home-grades>header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.home-grades h3{font-size:16px;font-weight:600}
.grade-visibility{background:none;color:var(--accent);font-size:11px;padding:3px 0}
.home-grade-course{padding:10px 0;border-bottom:1px solid var(--line)}
.home-grade-course:last-child{border:0}
.home-grade-course h4{font-size:12px;font-weight:500;line-height:1.7;margin-bottom:7px}
.home-grade-row{display:flex;justify-content:space-between;gap:12px;font-size:11px;color:var(--muted);padding:3px 0}
.home-course-grade{font-size:12px;color:var(--accent);font-weight:600;white-space:nowrap}
.notice-panel .notice-list{flex:none;margin-top:13px;padding-top:12px;border-top:1px solid var(--line)}
.mini-notice{padding:10px 0;border-bottom:1px solid var(--line)}
.mini-notice:last-child{border:0}
.mini-notice .task-title{font-size:12px;font-weight:400}
.notice-dot{display:inline-block;width:4px;height:4px;border-radius:50%;background:#9aa3ab;margin-right:5px}
.notice-dot.important{background:#f98012}
.browse-course{display:flex;align-items:center;gap:11px;width:100%;padding:12px;border:1px solid var(--line);border-radius:8px;background:var(--soft);text-align:left;color:var(--ink);margin-top:12px;flex:none}
.browse-course>span:nth-child(2){flex:1;min-width:0}
.browse-course strong{font-size:12px;font-weight:500;display:block}
.browse-course small{font-size:10px;color:var(--muted);display:block;margin-top:2px}
.browse-course>svg{width:14px;height:14px}
.course-browse-icon svg{width:19px;height:19px;color:var(--accent)}
.materials{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.course-card{overflow:hidden;align-self:start}
.course-cover{width:100%;height:155px;object-fit:cover;display:block;background:var(--soft)}
.course-body{padding:18px}
.course-body h3{font-size:17px;line-height:1.6;font-weight:600;margin-bottom:10px;overflow-wrap:anywhere}
.course-meta{font-size:12px;color:var(--muted);margin-bottom:12px}
.file-row{display:flex;align-items:center;gap:9px;padding:11px 0;border-top:1px solid var(--line);font-size:12px;line-height:1.65;overflow-wrap:anywhere}
.file-row>span{flex:1;min-width:0}
.file-row svg{width:16px;height:16px;color:var(--muted)}
.file-row b{font-weight:500;white-space:nowrap;color:var(--accent)}
.panel{padding:20px;margin-bottom:18px}
.empty{padding:24px 4px;color:var(--muted);font-size:13px;line-height:1.8}
.note,.source,.footer{font-size:11px;line-height:1.8;color:var(--muted)}
.note{margin-top:13px}
.source{margin-top:18px;border-top:1px solid var(--line);padding-top:12px}
.source summary{cursor:pointer}
.source p{margin-top:9px}
.footer{margin-top:18px}
.hint{font-size:12px;font-weight:400;color:var(--muted)}
.cal-tools{display:flex;gap:6px}
.legend{display:flex;gap:17px;font-size:11px;color:var(--muted);margin:12px 0}
.legend span{display:flex;align-items:center;gap:6px}
.legend i{width:7px;height:7px;background:#e3c8a7;border-radius:2px}
.legend span:nth-child(2) i{background:#f98012}
.legend span:nth-child(3) i{background:#aec8ac}
.week{display:grid;grid-template-columns:48px repeat(7,minmax(0,1fr));border:1px solid var(--line);border-radius:8px;overflow:hidden}
.time-head,.day-head{height:51px;border-bottom:1px solid var(--line);text-align:center;padding:5px;font-size:11px;color:var(--muted)}
.day-head b{display:block;font-size:16px;color:var(--ink);font-weight:500}
.day-head.today{background:var(--accent-soft)}
.time-axis{position:relative;height:430px;color:var(--muted);font-size:10px}
.time-axis span{position:absolute;top:var(--top);left:4px}
.day-col{position:relative;height:430px;border-left:1px solid var(--line);background:repeating-linear-gradient(transparent 0,transparent 80px,var(--line) 80px,var(--line) 81px)}
.calitem{position:absolute;top:var(--top);left:3px;right:3px;min-height:47px;padding:6px 7px;border-left:1px solid #c5a17a;border-radius:4px;background:#f7eee4;color:#775937;font-size:10px;line-height:1.5;overflow:hidden}
.calitem.warm{background:#fff0de;color:#8d4e0e;border-color:#f98012}
.calitem.done{background:#eef5ec;color:#51694a;border-color:#9db395}
.calitem strong{display:block;font-size:10px;font-weight:500}
.calitem time,.cal-type{font-size:9px;display:block}
.agenda-empty{display:none}
.cal-foot{display:flex;justify-content:space-between;gap:12px;font-size:10px;color:var(--muted);margin-top:12px}
.manual-form{display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end}
.manual-form label{font-size:12px;color:var(--muted)}
.manual-form input{display:block;width:100%;padding:9px;border:1px solid var(--line);border-radius:7px;background:var(--surface);color:var(--ink);margin-top:7px;font-size:13px}
.detail-sheet{position:fixed;inset:0 0 0 auto;margin:0;width:min(480px,94vw);max-width:none;height:100dvh;max-height:100dvh;border:0;border-left:1px solid var(--line);padding:0;background:var(--surface);color:var(--ink);box-shadow:-12px 0 45px #00000013;animation:sheetIn .2s ease}
.detail-sheet::backdrop{background:#20252b55;backdrop-filter:blur(2px)}
.sheet-top,.sheet-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 23px;border-bottom:1px solid var(--line)}
.sheet-top>span{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
.sheet-top button{padding:5px;background:none;color:var(--muted)}
.sheet-top svg{width:17px;height:17px}
.sheet-body{padding:26px 23px;overflow:auto;max-height:calc(100dvh - 155px)}
.sheet-kicker{font-size:11px;color:var(--accent)}
.sheet-body h2{font-size:23px;line-height:1.5;margin:12px 0}
.sheet-body>p{font-size:13px;color:var(--muted);line-height:1.8}
.sheet-body dl{margin:24px 0;font-size:12px}
.sheet-body dl>div{display:flex;gap:15px;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)}
.sheet-body dt{color:var(--muted)}
.sheet-body dd{margin:0}
.sheet-description{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.85;margin:20px 0}
.sheet-note{padding:14px;background:var(--soft);border-radius:8px;color:var(--muted);font-size:12px;line-height:1.8}
.sheet-footer{border-bottom:0;border-top:1px solid var(--line);justify-content:flex-end;flex-wrap:wrap}
.term-editor{width:min(650px,96vw)}
.term-editor .sheet-top small{font-size:12px;font-weight:400;color:var(--muted);margin-left:8px}
.term-selected-list{margin-top:16px}
.term-editor-row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:15px 0;border-bottom:1px solid var(--line)}
.term-editor-row>span{flex:1;min-width:0}
.term-editor-row b{font-size:13px;font-weight:500;line-height:1.7;display:block}
.term-editor-row small{display:block;font-size:11px;color:var(--muted);margin-top:5px}
.term-remove{font-size:11px;color:var(--muted);padding:6px 8px;flex:none}
.term-remove svg{width:13px;height:13px}
.term-remove:hover{color:#ac482f;background:#fff0e9}
.term-add-toggle{display:flex;width:100%;justify-content:center;border:1px dashed #c9cfd6;margin-top:18px;background:none;color:var(--accent);padding:11px}
.term-add-panel{background:var(--soft);padding:15px;border-radius:8px;margin-top:14px}
.term-add-panel label{font-size:12px;color:var(--muted)}
.term-add-panel input{display:block;width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:7px;background:var(--surface);color:var(--ink);margin-top:8px;font-size:13px}
.term-candidates{max-height:260px;overflow:auto;margin-top:10px}
.term-candidate{display:flex;width:100%;justify-content:space-between;align-items:center;gap:12px;text-align:left;padding:12px 3px;border-bottom:1px solid var(--line);background:none;color:var(--ink)}
.term-candidate b{font-size:12px;font-weight:500;line-height:1.7;display:block}
.term-candidate small{font-size:10px;color:var(--muted)}
.term-candidate svg{width:16px;height:16px;color:var(--accent)}
.link-feedback{position:fixed;z-index:99;bottom:20px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;width:max-content;max-width:90%;padding:13px 16px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);box-shadow:0 6px 30px #20252b1a;font-size:12px;animation:toastIn .18s ease}
.link-feedback>svg{width:17px;height:17px;color:var(--accent)}
.link-feedback button{background:none;color:var(--muted);padding:3px}
.link-feedback button svg{width:14px;height:14px}
.view-enter{animation:viewIn .38s cubic-bezier(.22,1,.36,1)}
.buttons [data-act=sync]:disabled svg{animation:spin 1s linear infinite}
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@keyframes spin{to{transform:rotate(360deg)}
}
@keyframes viewIn{from{transform:translateY(6px)}
to{transform:translateY(0)}
}
@keyframes sheetIn{from{transform:translateX(30px);opacity:.5}
to{transform:translateX(0);opacity:1}
}
@keyframes toastIn{from{opacity:0;bottom:12px}
to{opacity:1;bottom:20px}
}
@media(max-width:1100px){.app{grid-template-columns:190px minmax(0,1fr)}
.main{padding:20px}
.topbar{padding:0 20px}
.brand-wordmark{width:86px}
.dashboard-grid{gap:14px;grid-template-columns:minmax(0,1fr) 310px}
.dashboard-panel{padding:14px}
.dashboard-heading{align-items:flex-start}
.buttons{max-width:350px}
.task-actions{gap:2px}
.task-content{padding-right:0}
.searchbox{width:225px}
.school{font-size:10px}
}
@media(max-width:760px){.app{grid-template-columns:66px minmax(0,1fr)}
.rail{padding:17px 7px;gap:20px}
.brand{padding:0;justify-content:center;min-height:34px}
.brand-text,.school,.rail-bottom,.nav .count{display:none}
.brand-symbol,.school-mark,.school-mark svg{width:34px;height:34px}
.nav{gap:5px}
.nav button{flex-direction:column;justify-content:center;gap:5px;padding:7px 2px;min-height:47px;font-size:10px}
.nav svg{width:18px;height:18px}
.nav-overview{margin-bottom:7px}
.nav-section-start{margin-top:8px}
.nav-section-start:after{top:-7px;left:8px;right:8px}
.nav button.active:before{top:18px;bottom:18px;width:2px}
.topbar{height:48px;padding:0 13px}
.breadcrumb{display:none}
.top-actions{width:100%;gap:8px}
.searchbox{flex:1;width:auto;min-width:0;background:transparent;border:0;padding:4px}
.searchbox input{font-size:11px}
.searchbox svg{width:13px;height:13px}
.demo-badge{font-size:8px;padding:3px 5px}
.main,.home-mode .main{padding:17px 13px 10px}
.dashboard-heading,.heading{flex-wrap:wrap;gap:12px;margin-bottom:15px}
.dashboard-heading h1,.heading h1{font-size:24px}
.dashboard-date{font-size:10px}
.dashboard-heading p{font-size:10px;margin-top:5px}
.buttons{max-width:100%;gap:5px;justify-content:flex-start}
.btn{font-size:11px;padding:7px 9px;min-height:31px}
.theme-toggle{width:31px;padding:7px}
.semester-filter{font-size:11px;max-width:150px;padding:7px}
.dashboard-grid{grid-template-columns:minmax(0,1fr);gap:12px}
.dashboard-panel{padding:14px}
.section-head h2,.panel-head h2{font-size:16px}
.task-filters{gap:3px;margin-bottom:10px}
.task-filters button{font-size:11px;padding:5px 8px}
.task{gap:9px;padding:12px 0}
.course-badge{width:52px;min-width:52px;font-size:10px;padding:7px 3px}
.task-title{font-size:15px}
.task-course{font-size:10px}
.task-bottom{font-size:10px;gap:5px;align-items:flex-end;flex-wrap:wrap}
.deadline-countdown{font-size:10px}
.task-actions{position:absolute;right:0;top:11px}
.task-content{padding-right:18px}
.pin-btn{display:none}
.detail-btn{min-width:18px}
.detail-btn svg{width:12px;height:12px}
.source-link{display:none}
.panel-foot{font-size:9px}
.home-bottom{font-size:9px;padding-top:9px}
.home-bottom .small-link{font-size:9px}
.summary{gap:12px;font-size:11px}
.summary span:last-child{display:none}
.tabsbar{gap:9px}
.tabs{width:100%;flex:none;gap:4px}
.tabs button{font-size:12px}
.course-filter{width:100%;max-width:none;font-size:12px}
.materials{grid-template-columns:minmax(0,1fr)}
.course-cover{height:150px}
.course-body{padding:15px}
.course-body h3{font-size:16px}
.panel{padding:14px}
.manual-form{grid-template-columns:1fr}
.manual-form input{font-size:16px}
.manual-form .btn{width:100%}
.week{display:grid;grid-template-columns:1fr;border:0}
.time-head,.time-axis{display:none}
.day-head{height:auto;display:flex;align-items:center;gap:8px;padding:9px 0;text-align:left;border:0;border-top:1px solid var(--line)}
.day-head b{margin:0;order:-1}
.day-col{height:auto;min-height:0;border:0;background:none;display:grid;gap:8px;padding-bottom:12px}
.calitem{position:static;font-size:12px;padding:10px;min-height:0}
.calitem strong{font-size:12px}
.calitem time{float:right;margin-left:10px;font-size:10px}
.cal-type{font-size:10px}
.agenda-empty{display:block;font-size:11px;color:var(--muted)}
.legend{gap:10px;font-size:10px}
.cal-foot{font-size:9px}
.sheet-body{padding:22px 18px}
.sheet-top,.sheet-footer{padding:17px 18px}
.sheet-body h2{font-size:21px}
.link-feedback{font-size:11px;padding:11px}
.term-editor-row{gap:10px}
.term-editor-row b{font-size:12px}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
}

.is-dark .brand-wordmark{filter:brightness(0) invert(1)}
.nav-label{flex:1}
.nav-arrow{margin-left:auto;order:2;opacity:.5}
.nav-arrow svg{width:15px;height:15px}
.nav button.active .nav-arrow{opacity:1;transform:translateX(2px)}

.dashboard-main{display:grid;grid-template-rows:minmax(240px,1fr) minmax(180px,.7fr);gap:14px;min-height:0;min-width:0}



.assignments-panel .task{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;padding:12px}
.assignments-panel .course-badge{grid-column:1;grid-row:1;width:auto;min-width:0;justify-self:start;border-radius:999px;padding:5px 10px;min-height:0}
.assignments-panel .task-actions{grid-column:2;grid-row:1;position:static}
.assignments-panel .task-content{grid-column:1/-1;padding:0}
.assignments-panel .task-course{display:none}
.assignments-panel .task-title{font-size:15px;line-height:1.5}
.assignments-panel .task-bottom{align-items:flex-start;gap:8px}
.assignments-panel .deadline-countdown{display:block;flex-basis:100%;margin-top:3px}
.assignments-panel .detail-btn,.assignments-panel .pin-btn{min-width:28px;min-height:28px}
.assignments-panel .section-head{gap:6px}
.assignments-panel .small-link{white-space:nowrap}
.assignments-panel .task-total{margin-left:3px}

.home-course-item{border-radius:14px;padding-left:10px;padding-right:10px;transition:background .24s,transform .24s}
.home-course-item:hover{background:var(--soft);transform:translateX(2px)}
.home-course-cover{border-radius:12px}
.home-grade-row{font-variant-numeric:tabular-nums}
.searchbox{border-radius:999px}
.grade-visibility{border-radius:999px}
.school-link{border-radius:999px;background:var(--ink);color:var(--surface);padding:12px;width:100%;justify-content:center}
.school-link:hover{background:var(--accent);color:var(--surface)}

button:active:not(:disabled){transform:scale(.97)}
.btn:hover:not(:disabled){transform:translateY(-1px)}
.btn:active:not(:disabled){transform:scale(.96)}

.main{view-transition-name:syllo-content}
::view-transition-old(syllo-content){animation:contentOut .15s ease both}
::view-transition-new(syllo-content){animation:contentIn .3s cubic-bezier(.22,1,.36,1) both}
::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
@keyframes contentOut{to{opacity:0;transform:translateY(-3px)}
}
@keyframes contentIn{from{opacity:0;transform:translateY(9px)}
to{opacity:1;transform:translateY(0)}
}

@supports(corner-shape:squircle){.rail,.dashboard-panel,.panel,.course-card,.detail-sheet{corner-shape:squircle}
}

@media(max-width:1100px){.dashboard-main{gap:14px}
.nav button{padding:10px;font-size:13px}
.rail{padding:20px 8px}
.dashboard-panel{padding:14px}
}

@media(max-width:980px),(max-height:640px){.home-mode{height:auto;min-height:100dvh;overflow:visible}
.home-mode .workspace{height:auto}
.dashboard-grid{flex:none}
.dashboard-main{grid-template-rows:auto auto}
.courses-panel{min-height:260px;max-height:520px}
.assignments-panel{max-height:840px}
.home-dashboard{flex:none}
.home-mode .tasklist{max-height:650px}
.home-bottom{margin-top:12px}
}

@media(max-width:850px){.dashboard-grid{grid-template-columns:minmax(0,1fr)}
.assignments-panel{max-height:560px}
.dashboard-main{gap:14px}
.courses-panel{max-height:520px}
}

@media(max-width:760px){.rail{margin:6px 0 6px 5px;top:6px;height:calc(100dvh - 12px);border-radius:24px;padding:16px 5px}
.nav button{padding:9px 2px;font-size:10px;border-radius:18px;min-height:54px}
.nav-arrow{display:none}
.nav-label{flex:none}
.dashboard-panel{border-radius:24px}
.home-mode .main{padding:18px 12px}
.dashboard-main{grid-template-rows:auto auto}
.task-filters button{flex:1;padding:7px 6px}
.tabs button{padding:9px 13px}
.dashboard-heading .buttons{gap:8px}
.assignments-panel .pin-btn{display:flex}
.home-course-item>span{font-size:13px}
.section-head h2{font-size:16px}
.task-total{font-size:11px}
.school-link{padding:10px}
}

@media(prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}
button:hover,button:active{transform:none!important}
}


.home-course-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:2px 2px 8px}
.home-course-grid .home-course-item{display:flex;flex-direction:column;align-items:stretch;gap:8px;padding:12px;border:0;border-radius:24px;background:var(--course-tint);min-height:124px;color:var(--ink);box-shadow:0 2px 4px #20252b04;text-align:left;transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s}
.home-course-grid .home-course-item:hover{transform:translateY(-3px);box-shadow:0 7px 14px #20252b0c}.home-course-grid .home-course-item:active{transform:scale(.98)}
.home-course-grid .home-course-top{display:flex;justify-content:space-between;align-items:center;flex:none}.home-course-symbol{display:grid;place-items:center;background:#ffffff80;border-radius:12px;width:28px;height:28px;color:var(--course-ink)}.home-course-symbol svg{width:20px;height:20px}.course-open{display:grid;place-items:center;border:1px solid #00000012;border-radius:50%;width:28px;height:28px;color:var(--course-ink)}.course-open svg{width:14px;height:14px}.home-course-grid .home-course-name{font-size:14px;line-height:1.65;font-weight:600;flex:1}.home-course-grid .home-course-meta{display:flex;flex-wrap:wrap;gap:6px 12px;justify-content:space-between;flex:none;font-size:11px;line-height:1.5;color:var(--course-ink)}
.task{padding:12px;margin-bottom:8px;border:0;border-radius:24px;background:var(--course-tint,var(--soft));transition:transform .24s,box-shadow .24s}.task:hover{transform:translateY(-2px);box-shadow:0 6px 14px #20252b0a}.task:last-child{margin-bottom:4px}.task .course-badge{background:#ffffff80;color:var(--course-ink);border-radius:999px}.task .chip{border-radius:999px}.task .task-course,.task .task-bottom{color:var(--course-ink)}.task .task-actions{color:var(--course-ink)}.task .deadline-countdown{color:var(--course-ink);font-weight:500}.assignments-panel .tasklist{padding:3px 3px 3px 0}.assignments-panel .task .chip{background:#ffffffa8;color:var(--course-ink)}
.home-announcements{min-height:0;overflow:auto;scrollbar-width:thin}.home-announcements .mini-notice{padding:8px 0}.home-announcements .task-title{font-size:13px}.announcements-panel .section-head{margin-bottom:4px}
.is-dark .task,.is-dark .home-course-grid .home-course-item{background:color-mix(in srgb,var(--course-ink) 24%,var(--surface));--course-tint:var(--soft)}.is-dark .task .task-course,.is-dark .task .task-bottom,.is-dark .task .deadline-countdown,.is-dark .home-course-meta{color:var(--muted)}.is-dark .task .course-badge,.is-dark .assignments-panel .task .chip,.is-dark .home-course-symbol{background:#ffffff12;color:var(--ink)}.is-dark .course-open{color:var(--ink);border-color:var(--line)}
@supports(corner-shape:squircle){.task,.home-course-item{corner-shape:squircle}}
@media(max-width:1100px){.home-course-grid{gap:8px;grid-template-columns:repeat(2,minmax(0,1fr))}.home-course-grid .home-course-item{padding:13px}.home-course-grid .home-course-name{font-size:13px}}
@media(max-width:980px),(max-height:640px){.announcements-panel{max-height:260px}.courses-panel{max-height:650px}}
@media(max-width:600px){.home-course-grid{grid-template-columns:minmax(0,1fr)}.home-course-grid .home-course-item{min-height:120px;padding:12px}.task{padding:14px}.home-mode .courses-panel{max-height:650px}}

.home-support{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;min-height:0}.grades-panel .home-grades{margin:0;padding:0;border:0;overflow:auto;scrollbar-width:thin}.grades-panel .home-grades h3{font-size:18px}.grades-panel .home-grades>header{position:sticky;top:0;background:var(--surface);min-height:28px}.home-grade-course h4{overflow-wrap:anywhere}
@media(max-width:1100px){.home-support{gap:14px;grid-template-columns:minmax(0,1fr)}.dashboard-main{grid-template-rows:minmax(260px,1fr) minmax(220px,.65fr)}.home-support .dashboard-panel{max-height:190px}.grades-panel .home-grades h3{font-size:16px}}
@media(max-width:980px),(max-height:640px){.home-support{grid-template-columns:repeat(2,minmax(0,1fr))}.dashboard-main{grid-template-rows:auto auto}}
@media(max-width:600px){.home-support{grid-template-columns:minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.task:hover,.home-course-grid .home-course-item:hover,.home-course-grid .home-course-item:active{transform:none}}
.course-card{background:var(--course-tint,var(--surface));border:0}.is-dark .course-card{background:color-mix(in srgb,var(--course-ink) 24%,var(--surface))}
.home-mode .dashboard-heading{margin-bottom:14px}.home-mode .section-head{margin-bottom:10px}.home-mode .panel-foot{padding-top:8px;margin-top:8px}.home-mode .home-grade-course{padding:7px 0}.home-mode .home-grade-course h4{margin-bottom:4px}
.assignments-panel .section-head{gap:6px;align-items:center}.assignments-panel .section-head h2{font-size:16px;white-space:nowrap}.assignments-panel .task-total{font-size:10px}.assignments-panel .home-filters{margin:0 0 0 auto;padding:3px;gap:1px;flex-wrap:nowrap}.assignments-panel .home-filters button{font-size:11px;padding:5px 6px;min-height:30px;white-space:nowrap}.assignments-panel .deadline-countdown{margin-top:0}.assignments-panel .task-bottom{margin-top:4px}
@media(min-width:851px) and (max-width:1100px){.dashboard-grid{grid-template-columns:minmax(0,1fr) 330px}}
@media(max-width:600px){.assignments-panel .section-head{gap:4px}.assignments-panel .section-head h2{font-size:15px}.assignments-panel .section-head .task-total{display:none}.assignments-panel .home-filters button{padding:5px 4px;font-size:10px}}

.topbar-unified{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;padding-left:20px;padding-right:20px;height:auto;min-height:64px;padding-top:6px;padding-bottom:6px}
.topbar-unified .breadcrumb{min-width:0;max-width:190px}.topbar-unified .top-actions{justify-self:end;min-width:0}.topbar-unified .searchbox{width:230px}
.page-toolbar{display:flex;align-items:center;justify-content:center;gap:6px;min-width:0;flex-wrap:nowrap}
.page-toolbar .btn{min-height:34px;padding:7px 10px;font-size:11px;white-space:nowrap;flex:none}
.page-toolbar .semester-filter{max-width:145px;padding:7px 10px;font-size:11px;flex:none}
.page-toolbar .course-filter{max-width:150px;padding:7px 10px;font-size:11px;flex:none}
.page-toolbar .theme-toggle{width:34px;padding:7px}
.page-toolbar .toolbar-filters{margin:0;padding:3px;gap:2px;flex-wrap:nowrap;background:var(--soft);border-radius:999px;flex:none}
.page-toolbar .toolbar-filters button{min-height:28px;padding:5px 9px;font-size:11px;white-space:nowrap}
.home-mode .main{padding:12px 18px 10px}
.home-mode .home-dashboard,.home-mode .dashboard-grid{flex:none;align-items:start}
.home-mode .dashboard-main{grid-template-rows:auto auto}
.home-mode .dashboard-panel{padding:12px}
.home-mode .section-head{margin-bottom:8px;min-height:24px}
.home-mode .section-head h2{font-size:16px}
.home-mode .task-total{font-size:10px}
.home-mode .panel-foot{padding-top:6px;margin-top:6px}
.home-course-grid{padding:0 1px 4px;gap:8px}
.home-course-grid .home-course-item{min-height:112px;gap:7px;padding:10px;border-radius:22px}
.home-course-grid .home-course-name{font-size:13px;line-height:1.5}
.home-course-grid .home-course-meta{gap:4px 8px;font-size:10px;line-height:1.4}
.home-course-symbol,.course-open{width:26px;height:26px}
.home-course-symbol svg{width:18px;height:18px}.course-open svg{width:13px;height:13px}
.home-support{gap:10px}
.grades-panel .home-grades h3,.announcements-panel .section-head h2{font-size:16px}
.home-announcements .mini-notice{padding:6px 0}
.assignments-panel .task{padding:10px;margin-bottom:6px;border-radius:22px;gap:4px}
.assignments-panel .task-title{font-size:15px;line-height:1.4}
.assignments-panel .task-bottom{margin-top:2px;font-size:10px}
.assignments-panel .course-badge{padding:4px 9px;font-size:10px}
.assignments-panel .detail-btn,.assignments-panel .pin-btn{min-width:24px;min-height:24px}
.assignments-panel .home-filters button{min-height:28px;padding:4px 6px;font-size:10px}

@media(max-width:1560px){
 .topbar-unified{grid-template-columns:minmax(0,1fr) auto;gap:10px;padding-left:16px;padding-right:16px}
 .topbar-unified .breadcrumb{display:none}
 .page-toolbar{justify-content:flex-start;padding:2px 0;flex-wrap:wrap}
 .topbar-unified .searchbox{width:210px}
}
@media(max-width:1400px){
 .page-toolbar .toolbar-filters{order:1;flex-basis:100%;justify-content:flex-start;max-width:100%}
 .page-toolbar .toolbar-filters button{flex:0 0 auto}
}
@media(max-width:1100px){
 .page-toolbar{gap:4px}
 .page-toolbar .btn{padding:7px 8px}
 .home-course-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
}

@media(max-width:900px){
 .topbar-unified{height:auto;min-height:88px;grid-template-columns:minmax(0,1fr);gap:6px;padding-top:7px;padding-bottom:7px}
 .page-toolbar{grid-column:1;grid-row:1;justify-content:flex-start}
 .topbar-unified .top-actions{grid-column:1;grid-row:2;width:100%}
 .topbar-unified .searchbox{width:auto;flex:1;min-width:0}
 .home-course-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}

@media(max-width:760px){
 .topbar-unified{min-height:92px;padding:8px 10px;gap:6px}
 .topbar-unified .page-toolbar{grid-column:1;grid-row:1;justify-content:flex-start;flex-wrap:wrap;gap:6px;padding-bottom:2px;width:100%}
 .topbar-unified .top-actions{grid-column:1;grid-row:2;width:100%}
 .page-toolbar .semester-filter{max-width:132px;flex:none}
 .page-toolbar .btn{flex:none}
 .page-toolbar .course-filter{max-width:138px}
 .page-toolbar .toolbar-filters{flex-wrap:nowrap;overflow-x:auto;max-width:100%}
 .page-toolbar .btn.primary{font-size:0;width:34px;padding:7px;gap:0}
 .page-toolbar .btn.primary svg{width:16px;height:16px}
 .home-mode .main{padding:10px 10px 8px}
 .home-support{grid-template-columns:minmax(0,1fr)}
}

@media(max-width:430px){
 .page-toolbar .toolbar-filters button{padding:5px 7px;font-size:10px}
 .home-course-grid{grid-template-columns:minmax(0,1fr)}
}

/* Non-home surfaces: one reading row for context, then the working area. */
.main>.heading{margin-bottom:12px;gap:14px}
.main>.heading h1{font-size:26px}
.main>.heading .sub{display:flex;flex-wrap:wrap;align-items:center;gap:4px 14px;margin-top:4px}
.summary-inline{display:inline-flex;flex-wrap:wrap;align-items:center;gap:4px 14px;color:var(--muted)}
.summary-inline>span{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.summary-inline svg{width:13px;height:13px;color:var(--muted)}
.summary-inline b{color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}
.main>.progress{margin-bottom:6px}
.tabsbar{gap:10px;margin-bottom:14px;flex-wrap:wrap}
.tabs{flex:0 0 auto}

.all-tasks,.notice-layout,.grade-layout{max-width:1240px}
.all-tasks .panel,.notice-layout .panel{padding:16px 16px 14px;margin-bottom:12px}
.all-tasks .panel-head,.notice-layout .panel-head{margin-bottom:12px}
.all-tasks .note,.notice-layout .note{margin-top:10px;font-size:10px}

.task-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-content:start;align-items:start}
.task-grid .task{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px;margin:0;padding:12px}
.task-grid .course-badge{grid-column:1;grid-row:1;width:auto;min-width:0;justify-self:start;border-radius:999px;padding:4px 9px;min-height:0;font-size:10px}
.task-grid .task-actions{grid-column:2;grid-row:1;position:static;align-self:start;gap:2px}
.task-grid .task-content{grid-column:1/-1;padding:0}
.task-grid .task-course{display:none}
.task-grid .task-title{font-size:14px;line-height:1.45}
.task-grid .task-bottom{margin-top:3px;font-size:10px;align-items:center;flex-wrap:wrap}
.task-grid .deadline-countdown{font-size:10px;font-weight:500}
.task-grid .detail-btn,.task-grid .pin-btn{min-width:24px;min-height:24px}

.notice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:stretch}
.notice-card{display:flex;flex-direction:column;gap:7px;min-height:118px;padding:12px;border-radius:22px;background:var(--course-tint);color:var(--ink)}
.notice-card .task-title{flex:1;font-size:14px;line-height:1.5;font-weight:500}
.notice-card-top{display:flex;align-items:center;justify-content:space-between;gap:6px}
.notice-card .course-badge{width:auto;min-width:0;background:#ffffff80;color:var(--course-ink);border-radius:999px;padding:4px 9px;min-height:0;font-size:10px}
.notice-flag{font-size:10px;line-height:1.4;color:var(--course-ink);background:#ffffff90;border-radius:999px;padding:3px 8px;white-space:nowrap}
.notice-meta{font-size:10px;line-height:1.5;color:var(--course-ink)}

.schedule-layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:14px;align-items:start;max-width:1320px}
.schedule-layout>.panel{margin:0}
.schedule-layout .calendar{padding:16px 16px 12px}
.schedule-layout .calendar .legend{margin:8px 0}
.schedule-rail .panel{margin:0 0 12px;padding:16px}
.schedule-rail .panel:last-child{margin-bottom:0}
.schedule-rail .panel-head{margin-bottom:10px}
.schedule-rail .panel-head h2{font-size:16px}
.schedule-rail .manual-form{grid-template-columns:minmax(0,1fr);gap:9px}
.schedule-rail .manual-form label{font-size:11px}
.schedule-rail .manual-form input{padding:8px 10px;font-size:13px}
.schedule-rail .manual-form .btn{width:100%}
.schedule-rail .note{font-size:10px;margin-top:9px}
.upcoming-list{display:grid;gap:7px}
.upcoming-item{display:flex;align-items:flex-start;gap:9px;padding:10px;border-radius:18px;background:var(--course-tint);color:var(--ink)}
.upcoming-item .course-badge{width:auto;min-width:0;flex:none;background:#ffffff80;color:var(--course-ink);border-radius:999px;padding:4px 8px;min-height:0;font-size:10px}
.upcoming-item>div{min-width:0}
.upcoming-item strong{display:block;font-size:12px;font-weight:500;line-height:1.5;overflow-wrap:anywhere}
.upcoming-item span{display:block;margin-top:3px;font-size:10px;color:var(--course-ink)}

.page-note{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:9px 13px;border:1px solid var(--line);border-radius:16px;background:var(--surface);font-size:11px;line-height:1.6;color:var(--muted)}
.page-note svg{width:14px;height:14px;color:var(--accent);flex:none}
.materials{gap:12px;align-items:start}
.course-card{display:flex;flex-direction:column}
.course-cover{height:122px}
.course-body{padding:15px}
.course-body h3{font-size:16px;margin-bottom:6px}
.course-meta{margin-bottom:6px;font-size:11px}
.file-row{padding:8px 0;font-size:12px}
.material-more{display:inline-flex;align-items:center;gap:4px;margin-top:6px;padding:5px 10px;border-radius:999px;background:#ffffff9c;color:var(--course-ink);font-size:11px;line-height:1.4;transition:background .18s ease,transform .18s ease}
.material-more svg{width:12px;height:12px;transition:transform .25s ease}
.material-more:hover{background:#ffffffd6}
.material-more[aria-expanded="true"] svg{transform:rotate(-90deg)}
.material-more:active{transform:scale(.97)}
.materials>.note{grid-column:1/-1;margin:0}
.materials.focus-mode{grid-template-columns:repeat(2,minmax(0,1fr));max-width:none}
.materials.focus-mode .course-card.is-focus{grid-column:1/-1}
.materials.focus-mode .course-card.is-focus.has-cover{display:grid;grid-template-columns:minmax(180px,260px) minmax(0,1fr);align-items:stretch}
.materials.focus-mode .course-card.is-focus .course-cover{height:100%;min-height:180px;border-radius:22px 0 0 22px}
.materials.focus-mode .course-card.is-focus .course-body{display:flex;flex-direction:column;padding:18px 20px}
.materials.focus-mode .course-card.is-focus .course-body h3{font-size:18px;margin-bottom:8px}
.materials.focus-mode .course-card.is-focus .material-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 20px}
.focus-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
.focus-kicker{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--course-ink)}
.focus-clear{padding:5px 10px;border-radius:999px;background:#ffffff9c;color:var(--course-ink);font-size:11px}
.focus-clear:hover{background:#ffffffd6}
.materials.focus-mode .course-card.is-focus .file-row{padding:8px 0;border-bottom:1px solid #ffffffa8;border-top:0}
@media(max-width:760px){
 .materials.focus-mode{grid-template-columns:minmax(0,1fr)}
 .materials.focus-mode .course-card.is-focus.has-cover{grid-template-columns:minmax(0,1fr)}
 .materials.focus-mode .course-card.is-focus .course-cover{border-radius:22px 22px 0 0;min-height:130px}
 .materials.focus-mode .course-card.is-focus .course-body{padding:15px}
 .materials.focus-mode .course-card.is-focus .material-list{grid-template-columns:minmax(0,1fr)}
}
.grade-layout .course-card{background:var(--course-tint)}
.grade-layout .file-row{border-top:0;padding:5px 0}
.grade-layout .file-row:last-child{color:var(--course-ink);font-size:11px}
.main>.source{margin-top:12px;padding-top:10px}
.main>.footer{margin-top:10px}

@media(min-width:1024px){
 .materials{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(min-width:1180px){
 .materials.focus-mode .course-card.is-focus .material-list{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(min-width:1081px) and (max-width:1180px){
 .schedule-layout{grid-template-columns:minmax(0,1fr) 262px;gap:12px}
 .schedule-layout .calendar{padding:12px 12px 10px}
 .schedule-layout .calendar .legend{margin:6px 0;gap:8px;font-size:10px}
 .schedule-rail .panel{padding:12px;margin-bottom:10px}
 .schedule-rail .panel-head{margin-bottom:8px}
 .schedule-rail .panel-head h2{font-size:15px}
 .schedule-rail .manual-form{grid-template-columns:minmax(0,1fr);gap:7px}
 .schedule-rail .manual-form input{padding:7px 9px;font-size:12px}
 .schedule-rail .manual-form .btn{width:100%}
 .schedule-rail .note{font-size:10px;margin-top:7px}
}
@media(max-width:1080px){
 .schedule-layout{grid-template-columns:minmax(0,1fr)}
 .schedule-rail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
 .schedule-rail .panel{margin:0;padding:14px}
 .schedule-rail .manual-form{grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;align-items:end}
 .schedule-rail .manual-form .btn{width:auto;white-space:nowrap}
 .schedule-rail .note{display:none}
 .upcoming-item{padding:8px 10px}
}
@media(max-width:1100px){
 .rail{gap:16px}
 .nav button{min-height:44px}
 .school-link{white-space:nowrap;font-size:11px;padding:9px 8px}
 .moodle-credit{margin-top:10px}
 .notice-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:860px){
 .task-grid{grid-template-columns:minmax(0,1fr)}
}
@media(max-width:760px){
 .main>.heading h1{font-size:23px}
 .main>.heading .sub{font-size:11px}
 .tabsbar{gap:8px;margin-bottom:11px}
 .all-tasks .panel,.notice-layout .panel{padding:13px}
 .task-grid .task{padding:12px}
 .notice-grid{grid-template-columns:minmax(0,1fr)}
 .notice-card{min-height:0}
 .schedule-rail{grid-template-columns:minmax(0,1fr)}
 .page-note{align-items:flex-start;font-size:10px}
 .course-cover{height:110px}
}
.is-dark .notice-card,.is-dark .upcoming-item{background:color-mix(in srgb,var(--course-ink) 24%,var(--surface));--course-tint:var(--soft)}
.is-dark .notice-card .course-badge,.is-dark .notice-flag,.is-dark .upcoming-item .course-badge{background:#ffffff12;color:var(--ink)}
.is-dark .notice-meta,.is-dark .upcoming-item span{color:var(--muted)}
@supports(corner-shape:squircle){.notice-card,.upcoming-item,.page-note,.task-grid .task{corner-shape:squircle}}
`;
