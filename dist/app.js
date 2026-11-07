import {createSession} from './session.js';
'use strict';
const session=createSession({getItem:k=>sessionStorage.getItem(k),setItem:(k,v)=>sessionStorage.setItem(k,v),removeItem:k=>sessionStorage.removeItem(k)});
let state=session.read()||{};
const steps=['start','note','questions','plan','finish'];
const labels=['はじめに','昨日を振り返る','質問してもらう','1つ決める','持ち帰る'];
function navigate(focus=false){
 checkExpiry();
 const requested=location.hash.slice(1)||'start';if(requested==='main'){document.querySelector('#main').focus();return;}
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

function syncFields(){document.querySelectorAll('#notes input,#notes select,#actionForm input,#actionForm textarea,#method').forEach(el=>{if(el.type==='checkbox')el.checked=!!state[el.name];else el.value=state[el.name]||''})}
function checkExpiry(){if(Object.keys(state).length&&!session.read()){state={};syncFields();renderResult();document.querySelector('#storageStatus').textContent='保存期限が切れたため、このタブのメモを消しました。'}}
document.querySelector('#notes').addEventListener('input',event=>{checkExpiry();const el=event.target;if(!el.name)return;state[el.name]=el.type==='checkbox'?el.checked:el.value;if(!saveState())document.querySelector('#storageStatus').textContent='この端末では一時保存できません。画面を離れるとメモが失われる場合があります。'});
document.querySelector('#notes').addEventListener('submit',event=>event.preventDefault());
document.querySelector('#clearNotes').addEventListener('click',clearAll);
window.addEventListener('pageshow',()=>{checkExpiry();syncFields()});document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkExpiry();syncFields()}});setInterval(checkExpiry,1000);
window.addEventListener('hashchange',()=>navigate(true));syncFields();navigate();


async function copyText(text,status){try{await navigator.clipboard.writeText(text);status.textContent='コピーしました。'}catch{status.textContent='コピーできませんでした。表示された文を選択してコピーしてください。'}}
document.querySelector('#copyPrompt').addEventListener('click',()=>copyText(document.querySelector('#prompt').value,document.querySelector('#copyStatus')));
const cardQuestions=['昨日の生活で、眠りのために振り返りたい場面はどこですか？','その場面で、普段は何をしていますか？','そこから、来週無理なく変えられそうなことは何ですか？'];let cardIndex=0;
document.querySelector('#cardNext').addEventListener('click',()=>{if(cardIndex<2){cardIndex++;document.querySelector('#cardQuestion').textContent=cardQuestions[cardIndex];document.querySelector('#cardCount').textContent=(cardIndex+1)+' / 3';if(cardIndex===2)document.querySelector('#cardNext').textContent='3問を終えて、一歩を決める';}else{location.hash='plan'}});

function renderResult(){const text=state.hold?'今回は行動の決定を保留します。':state.trigger?.trim()&&state.action?.trim()?`来週、「もし${state.trigger.trim()}なら、${state.action.trim()}」を試します。`:'まだ行動は決めていません。';document.querySelector('#resultText').textContent=text+(state.insight?.trim()?'\n質問されて気づいたのは、'+state.insight.trim()+'です。':'');}
function clearAll(){const ok=session.clear();state={};syncFields();renderResult();for(const id of ['storageStatus','resultStatus','storageGlobal'])document.getElementById(id).textContent=ok?'このタブの記録を消しました。外部AIの履歴やクリップボードは消えません。':'画面の記録は消しましたが、一時保存の消去に失敗しました。共用端末ではブラウザーのサイトデータを削除してください。';}
function saveAction(event){checkExpiry();const el=event.target;if(!el.name)return;state[el.name]=el.type==='checkbox'?el.checked:el.value;saveState();renderResult();}
document.querySelector('#actionForm').addEventListener('input',saveAction);document.querySelector('#actionForm').addEventListener('submit',e=>e.preventDefault());document.querySelector('#method').addEventListener('change',saveAction);
document.querySelector('#copyResult').addEventListener('click',()=>{checkExpiry();renderResult();copyText(document.querySelector('#resultText').textContent,document.querySelector('#resultStatus'))});
document.querySelector('#printResult').addEventListener('click',()=>{checkExpiry();renderResult();window.print()});document.querySelector('#finishClear').addEventListener('click',clearAll);
for(const name of ['click','keydown'])document.addEventListener(name,()=>{checkExpiry();if(Object.keys(state).length)saveState()});
renderResult();

let timerEnd=0,timerRemaining=1800000,timerRunning=false;
function timerDraw(){if(timerRunning){timerRemaining=Math.max(0,timerEnd-Date.now());if(timerRemaining===0){timerRunning=false;document.querySelector('#timerToggle').textContent='開始';}}const seconds=Math.ceil(timerRemaining/1000);document.querySelector('#timerReadout').textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
document.querySelector('#timerToggle').addEventListener('click',()=>{timerRunning=!timerRunning;if(timerRunning){if(timerRemaining===0)timerRemaining=1800000;timerEnd=Date.now()+timerRemaining;}document.querySelector('#timerToggle').textContent=timerRunning?'一時停止':'再開';timerDraw()});document.querySelector('#timerReset').addEventListener('click',()=>{timerRunning=false;timerRemaining=1800000;document.querySelector('#timerToggle').textContent='開始';timerDraw()});setInterval(timerDraw,1000);

function saveState(){const ok=session.write(state);if(!ok)for(const id of ['storageStatus','resultStatus','storageGlobal'])document.getElementById(id).textContent='この端末では一時保存できません。画面を離れると内容が失われる場合があります。';return ok;}
