function v(){}const ct=t=>t;function lt(t,e){for(const n in e)t[n]=e[n];return t}function K(t){return t()}function H(){return Object.create(null)}function E(t){t.forEach(K)}function T(t){return typeof t=="function"}function Bt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let C;function Lt(t,e){return C||(C=document.createElement("a")),C.href=e,t===C.href}function ut(t){return Object.keys(t).length===0}function at(t,...e){if(t==null)return v;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Tt(t,e,n){t.$$.on_destroy.push(at(e,n))}function Ft(t,e,n,i){if(t){const r=Q(t,e,n,i);return t[0](r)}}function Q(t,e,n,i){return t[1]&&i?lt(n.ctx.slice(),t[1](i(e))):n.ctx}function It(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const u=[],o=Math.max(e.dirty.length,r.length);for(let s=0;s<o;s+=1)u[s]=e.dirty[s]|r[s];return u}return e.dirty|r}return e.dirty}function Ht(t,e,n,i,r,u){if(r){const o=Q(e,n,i,u);t.p(o,r)}}function Wt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function Gt(t,e,n){return t.set(n),e}const U=typeof window<"u";let ft=U?()=>window.performance.now():()=>Date.now(),F=U?t=>requestAnimationFrame(t):v;const $=new Set;function V(t){$.forEach(e=>{e.c(t)||($.delete(e),e.f())}),$.size!==0&&F(V)}function _t(t){let e;return $.size===0&&F(V),{promise:new Promise(n=>{$.add(e={c:t,f:n})}),abort(){$.delete(e)}}}let P=!1;function dt(){P=!0}function ht(){P=!1}function mt(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function pt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let l=0;l<e.length;l++){const _=e[l];_.claim_order!==void 0&&c.push(_)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const l=e[c].claim_order,_=(r>0&&e[n[r]].claim_order<=l?r+1:mt(1,r,h=>e[n[h]].claim_order,l))-1;i[c]=n[_]+1;const a=_+1;n[a]=c,r=Math.max(a,r)}const u=[],o=[];let s=e.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(u.push(e[c-1]);s>=c;s--)o.push(e[s]);s--}for(;s>=0;s--)o.push(e[s]);u.reverse(),o.sort((c,l)=>c.claim_order-l.claim_order);for(let c=0,l=0;c<o.length;c++){for(;l<u.length&&o[c].claim_order>=u[l].claim_order;)l++;const _=l<u.length?u[l]:null;t.insertBefore(o[c],_)}}function yt(t,e){t.appendChild(e)}function X(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function gt(t){const e=Z("style");return xt(X(t),e),e.sheet}function xt(t,e){return yt(t.head||t,e),e.sheet}function bt(t,e){if(P){for(pt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Jt(t,e,n){P&&!n?bt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function Y(t){t.parentNode&&t.parentNode.removeChild(t)}function Kt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function Z(t){return document.createElement(t)}function $t(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function I(t){return document.createTextNode(t)}function Qt(){return I(" ")}function Ut(){return I("")}function Vt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Xt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Yt(t){return t===""?null:+t}function wt(t){return Array.from(t.childNodes)}function vt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function tt(t,e,n,i,r=!1){vt(t);const u=(()=>{for(let o=t.claim_info.last_index;o<t.length;o++){const s=t[o];if(e(s)){const c=n(s);return c===void 0?t.splice(o,1):t[o]=c,r||(t.claim_info.last_index=o),s}}for(let o=t.claim_info.last_index-1;o>=0;o--){const s=t[o];if(e(s)){const c=n(s);return c===void 0?t.splice(o,1):t[o]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=o,s}}return i()})();return u.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,u}function et(t,e,n,i){return tt(t,r=>r.nodeName===e,r=>{const u=[];for(let o=0;o<r.attributes.length;o++){const s=r.attributes[o];n[s.name]||u.push(s.name)}u.forEach(o=>r.removeAttribute(o))},()=>i(e))}function Zt(t,e,n){return et(t,e,n,Z)}function te(t,e,n){return et(t,e,n,$t)}function Et(t,e){return tt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>I(e),!0)}function ee(t){return Et(t," ")}function ne(t,e){e=""+e,t.data!==e&&(t.data=e)}function ie(t,e){t.value=e??""}function re(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function se(t,e,n){for(let i=0;i<t.options.length;i+=1){const r=t.options[i];if(r.__value===e){r.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function oe(t){const e=t.querySelector(":checked");return e&&e.__value}function Nt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function ce(t,e){return new t(e)}const M=new Map;let O=0;function St(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function At(t,e){const n={stylesheet:gt(e),rules:{}};return M.set(t,n),n}function W(t,e,n,i,r,u,o,s=0){const c=16.666/i;let l=`{
`;for(let y=0;y<=1;y+=c){const g=e+(n-e)*u(y);l+=y*100+`%{${o(g,1-g)}}
`}const _=l+`100% {${o(n,1-n)}}
}`,a=`__svelte_${St(_)}_${s}`,h=X(t),{stylesheet:f,rules:d}=M.get(h)||At(h,t);d[a]||(d[a]=!0,f.insertRule(`@keyframes ${a} ${_}`,f.cssRules.length));const m=t.style.animation||"";return t.style.animation=`${m?`${m}, `:""}${a} ${i}ms linear ${r}ms 1 both`,O+=1,a}function kt(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?u=>u.indexOf(e)<0:u=>u.indexOf("__svelte")===-1),r=n.length-i.length;r&&(t.style.animation=i.join(", "),O-=r,O||Ct())}function Ct(){F(()=>{O||(M.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&Y(e)}),M.clear())})}let A;function S(t){A=t}function nt(){if(!A)throw new Error("Function called outside component initialization");return A}function le(t){nt().$$.on_mount.push(t)}function ue(t){nt().$$.after_update.push(t)}const b=[],G=[];let w=[];const J=[],it=Promise.resolve();let L=!1;function rt(){L||(L=!0,it.then(st))}function ae(){return rt(),it}function q(t){w.push(t)}const z=new Set;let x=0;function st(){if(x!==0)return;const t=A;do{try{for(;x<b.length;){const e=b[x];x++,S(e),jt(e.$$)}}catch(e){throw b.length=0,x=0,e}for(S(null),b.length=0,x=0;G.length;)G.pop()();for(let e=0;e<w.length;e+=1){const n=w[e];z.has(n)||(z.add(n),n())}w.length=0}while(b.length);for(;J.length;)J.pop()();L=!1,z.clear(),S(t)}function jt(t){if(t.fragment!==null){t.update(),E(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}function Mt(t){const e=[],n=[];w.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),w=e}let N;function Ot(){return N||(N=Promise.resolve(),N.then(()=>{N=null})),N}function B(t,e,n){t.dispatchEvent(Nt(`${e?"intro":"outro"}${n}`))}const j=new Set;let p;function fe(){p={r:0,c:[],p}}function _e(){p.r||E(p.c),p=p.p}function qt(t,e){t&&t.i&&(j.delete(t),t.i(e))}function de(t,e,n,i){if(t&&t.o){if(j.has(t))return;j.add(t),p.c.push(()=>{j.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const Pt={duration:0};function he(t,e,n,i){const r={direction:"both"};let u=e(t,n,r),o=i?0:1,s=null,c=null,l=null;function _(){l&&kt(t,l)}function a(f,d){const m=f.b-o;return d*=Math.abs(m),{a:o,b:f.b,d:m,duration:d,start:f.start,end:f.start+d,group:f.group}}function h(f){const{delay:d=0,duration:m=300,easing:y=ct,tick:g=v,css:D}=u||Pt,R={start:ft()+d,b:f};f||(R.group=p,p.r+=1),s||c?c=R:(D&&(_(),l=W(t,o,f,m,d,y,D)),f&&g(0,1),s=a(R,m),q(()=>B(t,f,"start")),_t(k=>{if(c&&k>c.start&&(s=a(c,m),c=null,B(t,s.b,"start"),D&&(_(),l=W(t,o,s.b,s.duration,0,y,u.css))),s){if(k>=s.end)g(o=s.b,1-o),B(t,s.b,"end"),c||(s.b?_():--s.group.r||E(s.group.c)),s=null;else if(k>=s.start){const ot=k-s.start;o=s.a+s.d*y(ot/s.duration),g(o,1-o)}}return!!(s||c)}))}return{run(f){T(u)?Ot().then(()=>{u=u(r),h(f)}):h(f)},end(){_(),s=c=null}}}function me(t){t&&t.c()}function pe(t,e){t&&t.l(e)}function Dt(t,e,n,i){const{fragment:r,after_update:u}=t.$$;r&&r.m(e,n),i||q(()=>{const o=t.$$.on_mount.map(K).filter(T);t.$$.on_destroy?t.$$.on_destroy.push(...o):E(o),t.$$.on_mount=[]}),u.forEach(q)}function Rt(t,e){const n=t.$$;n.fragment!==null&&(Mt(n.after_update),E(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function zt(t,e){t.$$.dirty[0]===-1&&(b.push(t),rt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ye(t,e,n,i,r,u,o,s=[-1]){const c=A;S(t);const l=t.$$={fragment:null,ctx:[],props:u,update:v,not_equal:r,bound:H(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:H(),dirty:s,skip_bound:!1,root:e.target||c.$$.root};o&&o(l.root);let _=!1;if(l.ctx=n?n(t,e.props||{},(a,h,...f)=>{const d=f.length?f[0]:h;return l.ctx&&r(l.ctx[a],l.ctx[a]=d)&&(!l.skip_bound&&l.bound[a]&&l.bound[a](d),_&&zt(t,a)),h}):[],l.update(),_=!0,E(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){dt();const a=wt(e.target);l.fragment&&l.fragment.l(a),a.forEach(Y)}else l.fragment&&l.fragment.c();e.intro&&qt(t.$$.fragment),Dt(t,e.target,e.anchor,e.customElement),ht(),st()}S(c)}class ge{$destroy(){Rt(this,1),this.$destroy=v}$on(e,n){if(!T(n))return v;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!ut(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{Dt as A,Rt as B,Ft as C,bt as D,Ht as E,Wt as F,It as G,v as H,Tt as I,$t as J,te as K,q as L,se as M,Vt as N,Kt as O,E as P,Gt as Q,oe as R,ge as S,ct as T,ie as U,he as V,Yt as W,Lt as X,Qt as a,Jt as b,ee as c,de as d,Ut as e,_e as f,qt as g,Y as h,ye as i,ue as j,Z as k,Zt as l,wt as m,Xt as n,le as o,re as p,I as q,Et as r,Bt as s,ae as t,ne as u,fe as v,G as w,ce as x,me as y,pe as z};