'use strict';
const steps=['start','note','questions','plan','finish'];
const labels=['はじめに','昨日を振り返る','質問してもらう','1つ決める','持ち帰る'];
function navigate(focus=false){
 const requested=location.hash.slice(1)||'start';
 const id=[...steps,'help','guide','sources'].includes(requested)?requested:'start';
 document.querySelectorAll('main>section').forEach(section=>section.hidden=section.id!==id);
 const index=steps.indexOf(id);
 document.querySelector('#progress').textContent=index>=0?`${index+1} / 5　${labels[index]}`:'教材のサポート';
 document.querySelectorAll('aside nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});
 const back=document.querySelector('#back'),next=document.querySelector('#next');
 back.href='#'+(index>0?steps[index-1]:'start'); back.textContent=index>0?'← '+labels[index-1]:'はじめに戻る';
 next.hidden=index===steps.length-1||index<0;
 next.href='#'+(steps[index+1]||'start');next.textContent=(labels[index+1]||'')+' →';
 document.title=(index>=0?labels[index]:document.querySelector('#'+id+' h1').textContent)+' | 眠りの習慣を見直す30分';
 if(focus){document.querySelector('#main').focus();window.scrollTo(0,0)}
}
window.addEventListener('hashchange',()=>navigate(true));navigate();
