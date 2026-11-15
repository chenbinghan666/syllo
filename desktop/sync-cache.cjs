const crypto=require('node:crypto');
const accountKey=connection=>crypto.createHash('sha256').update(connection.site+'\n'+connection.token).digest('hex');
const responseKey=(name,args)=>name+':'+JSON.stringify(args);
function cachedResponse(entries,name,args,now=Date.now()){
 const ttl=name==='core_course_get_contents'?6*3600000:name==='core_enrol_get_users_courses'?60000:0;
 const hit=entries.get(responseKey(name,args));
 return ttl&&hit&&now-hit.time<ttl?{hit:true,value:hit.value}:{hit:false};
}
async function mapLimit(items,limit,work){
 const output=new Array(items.length);let index=0;
 await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(index<items.length){const slot=index++;output[slot]=await work(items[slot],slot);}}));return output;
}
module.exports={accountKey,responseKey,cachedResponse,mapLimit};
