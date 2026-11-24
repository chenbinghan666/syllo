const {app,BrowserWindow,ipcMain,shell,safeStorage,session}=require('electron');
const path=require('node:path'),fs=require('node:fs'),crypto=require('node:crypto');
const {sync}=require('./moodle-api.cjs');
const {focusOrCreate}=require('./window-lifecycle.cjs');
const {accountKey,responseKey,cachedResponse}=require('./sync-cache.cjs');
const ws=require('./web-session.cjs');
let responseCache=new Map(),forceSync=false,syncJob=null,webReady=false,webLoginJob=null,webError=null;
const ROOT=path.resolve(__dirname,'..');
const APP_ICON=path.join(ROOT,'assets','syllo-logo.png');
let main,connection=null,pending=null;
app.setName('Syllo');
app.setAppUserModelId('com.syllo.desktop');
const singleInstance=app.requestSingleInstanceLock();
if(!singleInstance)app.quit();
function logFault(kind,error){
 try{const line=new Date().toISOString()+' '+kind+' '+((error&&(error.stack||error.message))||String(error))+'\n';fs.appendFileSync(path.join(app.getPath('userData'),'errors.log'),line);}catch{}
}
process.on('uncaughtException',error=>{logFault('uncaughtException',error);});
process.on('unhandledRejection',error=>{logFault('unhandledRejection',error);});
app.on('second-instance',()=>{if(app.isReady())focusOrCreate(main,createMainWindow);});
const cachePath=()=>path.join(app.getPath('userData'),'learning-cache.enc');
function readCache(){try{if(!connection||!safeStorage.isEncryptionAvailable()||!fs.existsSync(cachePath()))return null;const cache=JSON.parse(safeStorage.decryptString(fs.readFileSync(cachePath())));if(cache.account!==accountKey(connection)||cache.version!==2)return null;responseCache=new Map(cache.responses||[]);for(const c of cache.data.courses||[]){if(c.coverUrl&&c.image)responseCache.set('image:'+c.coverUrl,{time:cache.data.syncedAt,value:c.image});}return cache.data;}catch{return null;}}
function saveCache(data){if(safeStorage.isEncryptionAvailable())fs.writeFileSync(cachePath(),safeStorage.encryptString(JSON.stringify({version:2,account:accountKey(connection),data,responses:[...responseCache].filter(([key])=>!key.startsWith('image:'))})));}
const vault=()=>path.join(app.getPath('userData'),'connection.enc');
const allowed=new Set(['core_webservice_get_site_info','core_enrol_get_users_courses','core_course_get_contents','mod_assign_get_assignments','mod_assign_get_submission_status','mod_forum_get_forums_by_courses','mod_forum_get_forum_discussions','gradereport_user_get_grade_items','core_calendar_get_calendar_events','mod_quiz_get_quizzes_by_courses','mod_quiz_get_user_attempts','message_popup_get_popup_notifications','tool_mobile_get_autologin_key']);
function siteURL(raw){const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)throw Error('请输入不含参数的 HTTPS 学校 Moodle 网址。');u.pathname=u.pathname.replace(/\/(?:my\/?|login\/index\.php)$/,'').replace(/\/$/,'');return u.href.replace(/\/$/,'');}
async function publicConfig(raw){const site=siteURL(raw),r=await fetch(site+'/lib/ajax/service.php?info=tool_mobile_get_public_config',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify([{index:0,methodname:'tool_mobile_get_public_config',args:{}}]),redirect:'error',signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error('学校连接失败：HTTP '+r.status);const rows=await r.json();if(rows[0]?.error||!rows[0]?.data)throw Error('该站点未提供 Moodle 移动端配置。');const cfg=rows[0].data;if(!cfg.enablewebservices||!cfg.enablemobilewebservice)throw Error('该学校未启用 Moodle 移动端接口。');if(new URL(cfg.wwwroot).origin!==new URL(site).origin)throw Error('学校返回了不同的站点地址，请核对网址。');return {site:siteURL(cfg.wwwroot),name:cfg.sitename||new URL(site).hostname,logo:cfg.logourl||'',loginMode:cfg.typeoflogin};}
function append(params,key,value){if(Array.isArray(value))value.forEach((v,i)=>append(params,key+'['+i+']',v));else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>append(params,key+'['+k+']',v));else if(value!==undefined&&value!==null)params.append(key,String(value));}
async function api(name,args={}){if(!connection)throw Error('请先连接学校。');if(!allowed.has(name))throw Error('Syllo 只允许预设的读取接口。');const requestConnection=connection;const cached=!forceSync&&cachedResponse(responseCache,name,args);if(cached?.hit)return cached.value;const body=new URLSearchParams({wstoken:connection.token,wsfunction:name,moodlewsrestformat:'json'});for(const [k,v]of Object.entries(args))append(body,k,v);const r=await fetch(connection.site+'/webservice/rest/server.php',{method:'POST',headers:{'User-Agent':'Syllo/0.8 MoodleMobile'},body,redirect:'error',signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('读取失败：HTTP '+r.status);const d=await r.json();if(connection!==requestConnection)throw Error('账号连接已改变，请重新读取');if(d.exception)throw Object.assign(Error(d.message||d.errorcode||'学校拒绝了读取请求'),{code:d.errorcode||''});if(['core_course_get_contents','core_enrol_get_users_courses'].includes(name))responseCache.set(responseKey(name,args),{time:Date.now(),value:d});return d;}
function save(){if(safeStorage.isEncryptionAvailable())fs.writeFileSync(vault(),safeStorage.encryptString(JSON.stringify(connection)));}
const siteOrigin=()=>new URL(connection.site).origin;
const quietWindow=()=>new BrowserWindow({show:false,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
async function landingOf(url){const hidden=quietWindow();try{await hidden.loadURL(url);return hidden.webContents.getURL();}finally{if(!hidden.isDestroyed())hidden.destroy();}}
// MoodleSession is a browser-session cookie; keep it across restarts only when the user chose to remember the login.
async function keepWebCookies(){
 if(!connection?.remember)return;
 try{const site=connection.site;for(const cookie of await session.defaultSession.cookies.get({url:siteOrigin()})){if(!cookie.session)continue;const next=ws.persistentCookie(cookie,site);if(next)await session.defaultSession.cookies.set(next);}await session.defaultSession.cookies.flushStore();}
 catch(error){logFault('web-session','keep-cookies '+((error&&error.message)||'error'));}
}
// Diagnostics record only the stage and Moodle's error code: never tokens, cookies or full redirect URLs.
function webFailure(stage,error,waitMs=0){const f=ws.describeFailure(Object.assign({},error&&{code:error.code,message:error.message},{stage}),waitMs);webError=f;logFault('web-session',f.stage+' '+f.code);return Object.assign(Error(f.message),{code:f.code});}
async function establishWebSession(){
 if(webReady||!connection?.privateToken)return;
 if(webLoginJob)return webLoginJob;
 const requestConnection=connection;
 webLoginJob=(async()=>{
  try{if(ws.isSignedInUrl(await landingOf(connection.site+'/my/'),connection.site)){webReady=true;webError=null;await keepWebCookies();return;}}catch{/* No reusable session: request a single-use key below. */}
  if(connection!==requestConnection)throw Error('账号连接已改变，请重试');
  const wait=ws.keyWaitMs(connection.lastKeyAt);if(wait>0)throw webFailure('key',null,wait);
  let result;
  try{const info=connection.userid?null:await api('core_webservice_get_site_info');if(info)connection.userid=info.userid;connection.lastKeyAt=Date.now();if(connection.remember)save();result=await api('tool_mobile_get_autologin_key',{privatetoken:connection.privateToken});}
  catch(error){throw webFailure('key',error);}
  let target;try{target=new URL(result.autologinurl);}catch{throw webFailure('key',{code:'badurl',message:'学校返回的网页授权地址无效'});}
  if(target.origin!==siteOrigin())throw webFailure('key',{code:'originmismatch',message:'学校网页授权地址不匹配'});
  target.search=new URLSearchParams({userid:String(connection.userid),key:result.key,urltogo:connection.site+'/my/'}).toString();
  let landed='';try{landed=await landingOf(target.href);}catch{throw webFailure('consume',{code:'loadfailed',message:'无法打开学校网页授权，请检查网络'});}
  if(!ws.isSignedInUrl(landed,connection.site))throw webFailure('consume',{code:'notsignedin',message:'网页授权尚未生效，请选择「更新网页登录」'});
  webReady=true;webError=null;await keepWebCookies();
 })().finally(()=>{webLoginJob=null;});return webLoginJob;
}
async function openSchool(url){
 if(!connection)return;try{if(new URL(url).origin!==siteOrigin())return;}catch{return;}
 const win=new BrowserWindow({width:1100,height:800,title:'Moodle · 正在恢复登录…',icon:APP_ICON,autoHideMenuBar:true,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
 win.webContents.setWindowOpenHandler(({url})=>{try{if(new URL(url).protocol==='https:')shell.openExternal(url);}catch{}return {action:'deny'};});
 let notice='';try{await establishWebSession();}catch(error){notice=(error&&error.message)||'自动网页登录未生效';}
 if(win.isDestroyed())return;
 const showNotice=text=>{notice=text;if(!win.isDestroyed())win.setTitle('Moodle · '+text);};
 win.webContents.on('page-title-updated',event=>{if(notice)event.preventDefault();});
 if(notice)showNotice(notice);else win.setTitle('Moodle · Syllo');
 let repaired=false;win.webContents.on('did-navigate',async(_,current)=>{
  if(repaired||!/\/login\//.test(current)||!connection?.privateToken)return;repaired=true;webReady=false;
  try{await establishWebSession();if(webReady&&!win.isDestroyed()){notice='';win.setTitle('Moodle · Syllo');await win.loadURL(url);}}catch(error){showNotice((error&&error.message)||'请在页面中登录');}
 });
 win.loadURL(url).catch(()=>{if(!win.isDestroyed())win.setTitle('Moodle · 无法加载，请检查网络');});
}
async function coverImage(raw){
 if(!raw||!connection)return '';try{
  const url=new URL(raw,connection.site);if(url.origin!==new URL(connection.site).origin)return '';
  const key='image:'+url.href,hit=responseCache.get(key);if(!forceSync&&hit&&Date.now()-hit.time<86400000)return hit.value;
  if(url.pathname.includes('/pluginfile.php')&&!url.pathname.includes('/webservice/pluginfile.php'))url.pathname=url.pathname.replace('/pluginfile.php','/webservice/pluginfile.php');
  if(url.pathname.includes('/webservice/pluginfile.php'))url.searchParams.set('token',connection.token);
  const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(15000)});const type=(r.headers.get('content-type')||'').split(';')[0];
  if(!r.ok||!/^image\/(png|jpeg|webp|gif|svg\+xml)$/.test(type)||Number(r.headers.get('content-length'))>3000000)return '';
  const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length>3000000)return '';const value='data:'+type+';base64,'+bytes.toString('base64');responseCache.set(key,{time:Date.now(),value});return value;
 }catch{return '';}
}
function safeProfile(){if(!connection)return null;let logo='';try{const u=new URL(connection.logo);if(u.origin===new URL(connection.site).origin)logo=u.href;}catch{}return {name:connection.name,origin:new URL(connection.site).origin,site:connection.site,webLoginReady:(Boolean(connection.privateToken)&&!webError)||webReady,webLoginNotice:webError?webError.message:'',logoUrls:logo?[logo]:[]};}
function login(profile){return new Promise((resolve,reject)=>{
 if(pending)return reject(Error('已有登录窗口，请先完成或关闭。'));
 const passport=crypto.randomBytes(24).toString('hex');let done=false;
 const win=new BrowserWindow({width:960,height:760,title:'登录学校 Moodle · Syllo',icon:APP_ICON,autoHideMenuBar:true,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});pending=win;
 const finish=(err)=>{if(done)return;done=true;pending=null;if(!win.isDestroyed())win.close();err?reject(err):resolve(safeProfile());};
 const receive=(event,url)=>{if(!/^(?:syllo|moodlemobile):/i.test(url))return;event.preventDefault();try{const encoded=url.split('token=')[1];if(!encoded)throw Error('学校没有返回授权结果。');const parts=Buffer.from(decodeURIComponent(encoded),'base64').toString('utf8').split(':::');const expected=crypto.createHash('md5').update(profile.site+passport).digest('hex');if(parts[0]!==expected||!parts[1])throw Error('登录回调校验失败，请重新连接。');connection={...profile,token:parts[1],privateToken:parts[2]||((connection?.site===profile.site&&connection?.token===parts[1])?connection.privateToken:null)};webReady=true;responseCache.clear();if(profile.remember)save();else if(fs.existsSync(vault()))fs.unlinkSync(vault());finish();}catch(e){finish(e);}};
 win.webContents.on('will-redirect',receive);win.webContents.on('will-navigate',receive);
 win.webContents.setWindowOpenHandler(({url})=>{if(url.startsWith('https://'))shell.openExternal(url);return {action:'deny'};});
 win.on('closed',()=>{if(!done){done=true;pending=null;reject(Error('登录已取消。'));}});
 const url=new URL(profile.site+'/admin/tool/mobile/launch.php');url.search=new URLSearchParams({service:'moodle_mobile_app',passport,urlscheme:'syllo'}).toString();
 win.loadURL(url.href).catch(()=>finish(Error('无法打开学校授权页面，请检查网络。')));
 });}
function createMainWindow(){
 if(main&&!main.isDestroyed())return main;
 main=new BrowserWindow({width:1320,height:850,minWidth:800,minHeight:620,title:'Syllo',icon:APP_ICON,autoHideMenuBar:true,backgroundColor:'#f6f3ee',webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});
 main.webContents.setWindowOpenHandler(({url})=>{try{if(url==='https://moodle.org/'){shell.openExternal(url);return {action:'deny'};}if(connection&&new URL(url).origin===new URL(connection.site).origin)openSchool(url);}catch{}return {action:'deny'};});
 main.webContents.on('will-navigate',e=>e.preventDefault());

 const created=main;
 created.on('closed',()=>{if(main===created)main=null;app.quit();});
 created.webContents.on('render-process-gone',(_,details)=>logFault('render-process-gone',details.reason));
 created.webContents.on('did-fail-load',(_,code,description)=>logFault('did-fail-load',code+' '+description));
 created.loadFile(path.join(__dirname,'index.html')).catch(()=>{if(!created.isDestroyed())created.setTitle('Syllo · 页面加载失败，请重新启动');});
 return created;
}
app.whenReady().then(()=>{
 if(!singleInstance)return;
 try{if(fs.existsSync(vault())&&safeStorage.isEncryptionAvailable())connection=JSON.parse(safeStorage.decryptString(fs.readFileSync(vault())));}catch{}
 createMainWindow();
 const local=event=>{if(event.sender!==main.webContents||!event.senderFrame.url.startsWith('file://'))throw Error('无效的应用请求');};
 ipcMain.handle('profile',event=>{local(event);return safeProfile();});
 ipcMain.handle('connect',async(event,site,remember)=>{local(event);webReady=false;webError=null;const profile=await publicConfig(site);profile.remember=Boolean(remember);return login(profile);});
 ipcMain.handle('cached',event=>{local(event);return readCache();});
 ipcMain.handle('reauthorize',async event=>{local(event);if(!connection)throw Error('请先连接学校');await session.defaultSession.clearStorageData({origin:new URL(connection.site).origin,storages:['cookies']});webReady=false;webError=null;return login({site:connection.site,name:connection.name,logo:connection.logo,remember:connection.remember});});
 ipcMain.handle('sync',async(event,options={})=>{local(event);if(syncJob)return syncJob;forceSync=Boolean(options.force);const requestConnection=connection;syncJob=(async()=>{const data=await sync(api,safeProfile(),message=>{if(main&&!main.isDestroyed())main.webContents.send('progress',message);},{coverImage});if(connection!==requestConnection)throw Error('账号连接已改变，请重新读取');connection.userid=data.accountId;if(connection.remember)save();try{saveCache(data);}catch{data.warnings.push('本机缓存保存失败，下次启动可能需要重新同步。');}return data;})().finally(()=>{syncJob=null;forceSync=false;});return syncJob;});
 ipcMain.handle('disconnect',event=>{local(event);if(connection){try{session.defaultSession.clearStorageData({origin:new URL(connection.site).origin,storages:['cookies']}).catch(()=>{});}catch{}}connection=null;responseCache.clear();webReady=false;webError=null;if(fs.existsSync(cachePath()))fs.unlinkSync(cachePath());if(fs.existsSync(vault()))fs.unlinkSync(vault());return true;});
 ipcMain.handle('open-school',event=>{local(event);if(connection)openSchool(connection.site);});
});
app.on('window-all-closed',()=>app.quit());
