export const KEY='sleep-question-30:session:v1';
export const TTL=2*60*60*1000;
const fields=new Set(["bed","wake","caffeine","nap","napMinutes","rest","trigger","action","insight","method","caffeineNone","hold"]);
function valid(data){return data&&typeof data==='object'&&!Array.isArray(data)&&Object.entries(data).every(([k,v])=>fields.has(k)&&(['caffeineNone','hold'].includes(k)?typeof v==='boolean':typeof v==='string'&&v.length<=1000));}
export function createSession(storage,now=Date.now){
 let memory=null,available=true;
 const remove=()=>{memory=null;try{storage.removeItem(KEY);return true}catch{available=false;return false}};
 function read(){let raw;try{raw=available?storage.getItem(KEY):memory}catch{available=false;raw=memory}if(!raw)return null;
 try{const v=JSON.parse(raw);if(v.version!==1||typeof v.at!=='number'||v.at>now()||now()-v.at>=TTL||!valid(v.data)){remove();return null}return v.data}catch{remove();return null}}
 function write(data){const raw=JSON.stringify({version:1,at:now(),data});memory=raw;try{storage.setItem(KEY,raw)}catch{available=false}return available}
 return {read,write,clear:remove,get available(){return available}};
}
