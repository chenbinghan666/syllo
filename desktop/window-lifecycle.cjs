function focusOrCreate(window,create){
 if(!window||window.isDestroyed())return create();
 if(window.isMinimized())window.restore();
 window.show();window.focus();return window;
}
module.exports={focusOrCreate};
