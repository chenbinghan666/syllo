const bridge=window.SylloDesktop,form=document.getElementById('connection-form'),statusEl=document.getElementById('status'),submit=document.getElementById('submit');
let unsubscribe;
async function openBoard(profile){
 const cached=await bridge.cached();
 document.getElementById('connect').hidden=true;document.getElementById('board').hidden=false;document.getElementById('disconnect').hidden=false;
 const host=document.getElementById('board'),root=host.shadowRoot||host.attachShadow({mode:'open'});
 Studyboard.mount(root,{mode:'live',school:profile,initialData:cached?{...cached,fromCache:true}:null,skipInitialLoad:Boolean(cached&&Date.now()-cached.syncedAt<300000),reauthorize:async()=>{const updated=await bridge.reauthorize();await openBoard(updated);},close:()=>bridge.openSchool(),load:async(progress,options)=>{unsubscribe?.();unsubscribe=bridge.progress(progress);try{return await bridge.sync(options);}finally{unsubscribe?.();unsubscribe=null;}}});
}
form.addEventListener('submit',async event=>{event.preventDefault();if(!bridge)return;submit.disabled=true;statusEl.textContent='正在检查学校接口，即将打开学校登录窗口…';try{const profile=await bridge.connect(document.getElementById('site').value,document.getElementById('remember').checked);openBoard(profile);}catch(error){statusEl.textContent=error.message.replace(/^Error invoking remote method '[^']+': Error: /,'');}finally{submit.disabled=false;}});
document.getElementById('disconnect').onclick=async()=>{await bridge.disconnect();location.reload();};
if(bridge)bridge.profile().then(profile=>{if(profile)openBoard(profile);});else{submit.disabled=true;statusEl.textContent='请通过 Syllo.exe 打开此页面。浏览器预览不能完成客户端登录。';}
