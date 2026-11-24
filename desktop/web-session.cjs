// Helpers for restoring the Moodle web session without asking for credentials again.
// Moodle allows one autologin key per user every few minutes (tool_mobile | autologinmintimebetweenreq,
// default 6 minutes), and its MoodleSession cookie is a browser-session cookie that Chromium drops on restart.
const KEY_INTERVAL_MS=6*60*1000;
const COOKIE_LIFETIME_S=12*60*60;

function keyWaitMs(lastKeyAt,now=Date.now(),interval=KEY_INTERVAL_MS){
 const last=Number(lastKeyAt)||0;if(!last||last>now)return 0;return Math.max(0,last+interval-now);
}
function isSignedInUrl(current,site){
 try{const u=new URL(current),s=new URL(site);if(u.origin!==s.origin)return false;return !/\/login\/|\/auth\/[^/]+\/login|\/admin\/tool\/mobile\/autologin\.php/i.test(u.pathname);}catch{return false;}
}
function persistentCookie(cookie,site,now=Date.now()){
 const s=new URL(site);const host=(cookie.domain||'').replace(/^\./,'');
 if(!host||!(s.hostname===host||s.hostname.endsWith('.'+host)))return null;
 const out={url:s.origin+(cookie.path||'/'),name:cookie.name,value:cookie.value,path:cookie.path||'/',secure:Boolean(cookie.secure),httpOnly:Boolean(cookie.httpOnly),expirationDate:Math.floor(now/1000)+COOKIE_LIFETIME_S};
 if(cookie.domain&&cookie.domain.startsWith('.'))out.domain=cookie.domain;
 if(cookie.sameSite&&cookie.sameSite!=='unspecified')out.sameSite=cookie.sameSite;
 return out;
}
function describeFailure(error,waitMs=0){
 const code=(error&&error.code)||'';
 if(code==='autologinkeygenerationlockout'||waitMs>0){const min=Math.max(1,Math.ceil((waitMs||KEY_INTERVAL_MS)/60000));return {stage:'key',code:code||'local-wait',message:'学校限制自动登录频率，约 '+min+' 分钟后再试，或选择「更新网页登录」'};}
 if(code==='invalidprivatetoken')return {stage:'key',code,message:'网页授权已失效，请选择「更新网页登录」'};
 if(code==='apprequired'||code==='autologinnotallowedtoadmins'||code==='enablewsdescription')return {stage:'key',code,message:'学校未开放自动网页登录，请在打开的页面登录'};
 return {stage:(error&&error.stage)||'unknown',code:code||'error',message:(error&&error.message)||'自动网页登录未生效'};
}
module.exports={KEY_INTERVAL_MS,COOKIE_LIFETIME_S,keyWaitMs,isSignedInUrl,persistentCookie,describeFailure};
