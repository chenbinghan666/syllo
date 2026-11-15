const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('SylloDesktop',{
 profile:()=>ipcRenderer.invoke('profile'),connect:(site,remember)=>ipcRenderer.invoke('connect',site,remember),cached:()=>ipcRenderer.invoke('cached'),reauthorize:()=>ipcRenderer.invoke('reauthorize'),sync:options=>ipcRenderer.invoke('sync',options),disconnect:()=>ipcRenderer.invoke('disconnect'),openSchool:()=>ipcRenderer.invoke('open-school'),
 progress:callback=>{const listener=(_,text)=>callback(text);ipcRenderer.on('progress',listener);return ()=>ipcRenderer.removeListener('progress',listener);}
});
