import {test} from 'node:test';import assert from 'node:assert/strict';import {createSession,KEY,TTL} from '../dist/session.js';
function storage(){const map=new Map;return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}}
test('別タブの記録を取得できない',()=>{const a=createSession(storage()),b=createSession(storage());a.write({trigger:'private'});assert.equal(b.read(),null);assert.deepEqual(a.read(),{trigger:'private'})});
test('2時間後には表示・復元できない',()=>{let at=1000;const s=storage(),a=createSession(s,()=>at);a.write({trigger:'private'});at+=TTL;assert.equal(a.read(),null);assert.equal(s.getItem(KEY),null)});
test('終了時に他アプリの保存値を消さない',()=>{const s=storage(),a=createSession(s);s.setItem('other','keep');a.write({trigger:'private'});a.clear();assert.equal(a.read(),null);assert.equal(s.getItem('other'),'keep')});
test('不正な保存値を復元しない',()=>{const s=storage(),a=createSession(s);s.setItem(KEY,'invalid');assert.equal(a.read(),null);assert.equal(s.getItem(KEY),null)});
test('保存不可でもメモリで継続する',()=>{const a=createSession({getItem(){throw Error()},setItem(){throw Error()},removeItem(){throw Error()}});assert.equal(a.write({trigger:'local'}),false);assert.deepEqual(a.read(),{trigger:'local'});a.clear();assert.equal(a.read(),null)});

test('消去のみ失敗したとき成功を返さない',()=>{const s=storage();s.removeItem=()=>{throw Error()};const a=createSession(s);a.write({trigger:'private'});assert.equal(a.clear(),false)});

test('破損したフィールド型を表示しない',()=>{const s=storage(),a=createSession(s);s.setItem(KEY,JSON.stringify({version:1,at:Date.now(),data:{trigger:{},action:'x'}}));assert.equal(a.read(),null)});
