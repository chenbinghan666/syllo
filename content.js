(() => {
  if (document.querySelector('input[name="password"]')) return;
  const launcher = document.createElement('button');
  launcher.innerHTML = StudyIdentity.mark.replace('<svg ', '<svg width="19" height="19" ')+'<span>打开Syllo</span>';
  launcher.style.cssText = 'position:fixed;right:24px;bottom:24px;z-index:2147483646;background:#b76542;color:white;border:0;border-radius:12px;padding:13px 19px;display:flex;align-items:center;gap:9px;box-shadow:0 4px 16px #8b492826;cursor:pointer;font:600 14px "VCIOutfit","SylloCN",sans-serif';
  document.body.append(launcher);
  let host;
  function open() {
    if(host) return;
    host=document.createElement('div');
    host.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#f6f3ee;overflow:auto';
    document.body.append(host);
    const shadow=host.attachShadow({mode:'open'}), overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    Studyboard.mount(shadow,{mode:'live',school:StudyIdentity.discover(document,location.href),close:()=>{host.remove();host=null;document.body.style.overflow=overflow;},load:StudyParser.sync});
  }
  launcher.onclick=open;
  if(location.hash==='#studyboard') open();
})();
