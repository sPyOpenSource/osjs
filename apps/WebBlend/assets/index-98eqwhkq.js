(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();var Wd={exports:{}},al={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wx;function Mb(){if(Wx)return al;Wx=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(s,l,c){var f=null;if(c!==void 0&&(f=""+c),l.key!==void 0&&(f=""+l.key),"key"in l){c={};for(var p in l)p!=="key"&&(c[p]=l[p])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:f,ref:l!==void 0?l:null,props:c}}return al.Fragment=e,al.jsx=i,al.jsxs=i,al}var qx;function Eb(){return qx||(qx=1,Wd.exports=Mb()),Wd.exports}var g=Eb(),qd={exports:{}},_t={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yx;function Tb(){if(Yx)return _t;Yx=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),f=Symbol.for("react.context"),p=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),h=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),_=Symbol.for("react.activity"),x=Symbol.iterator;function y(B){return B===null||typeof B!="object"?null:(B=x&&B[x]||B["@@iterator"],typeof B=="function"?B:null)}var T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},R=Object.assign,S={};function b(B,Y,ee){this.props=B,this.context=Y,this.refs=S,this.updater=ee||T}b.prototype.isReactComponent={},b.prototype.setState=function(B,Y){if(typeof B!="object"&&typeof B!="function"&&B!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,B,Y,"setState")},b.prototype.forceUpdate=function(B){this.updater.enqueueForceUpdate(this,B,"forceUpdate")};function C(){}C.prototype=b.prototype;function I(B,Y,ee){this.props=B,this.context=Y,this.refs=S,this.updater=ee||T}var F=I.prototype=new C;F.constructor=I,R(F,b.prototype),F.isPureReactComponent=!0;var q=Array.isArray;function z(){}var j={H:null,A:null,T:null,S:null},w=Object.prototype.hasOwnProperty;function O(B,Y,ee){var ve=ee.ref;return{$$typeof:r,type:B,key:Y,ref:ve!==void 0?ve:null,props:ee}}function G(B,Y){return O(B.type,Y,B.props)}function V(B){return typeof B=="object"&&B!==null&&B.$$typeof===r}function Q(B){var Y={"=":"=0",":":"=2"};return"$"+B.replace(/[=:]/g,function(ee){return Y[ee]})}var Z=/\/+/g;function ae(B,Y){return typeof B=="object"&&B!==null&&B.key!=null?Q(""+B.key):Y.toString(36)}function W(B){switch(B.status){case"fulfilled":return B.value;case"rejected":throw B.reason;default:switch(typeof B.status=="string"?B.then(z,z):(B.status="pending",B.then(function(Y){B.status==="pending"&&(B.status="fulfilled",B.value=Y)},function(Y){B.status==="pending"&&(B.status="rejected",B.reason=Y)})),B.status){case"fulfilled":return B.value;case"rejected":throw B.reason}}throw B}function D(B,Y,ee,ve,ce){var A=typeof B;(A==="undefined"||A==="boolean")&&(B=null);var X=!1;if(B===null)X=!0;else switch(A){case"bigint":case"string":case"number":X=!0;break;case"object":switch(B.$$typeof){case r:case e:X=!0;break;case v:return X=B._init,D(X(B._payload),Y,ee,ve,ce)}}if(X)return ce=ce(B),X=ve===""?"."+ae(B,0):ve,q(ce)?(ee="",X!=null&&(ee=X.replace(Z,"$&/")+"/"),D(ce,Y,ee,"",function(Ee){return Ee})):ce!=null&&(V(ce)&&(ce=G(ce,ee+(ce.key==null||B&&B.key===ce.key?"":(""+ce.key).replace(Z,"$&/")+"/")+X)),Y.push(ce)),1;X=0;var ne=ve===""?".":ve+":";if(q(B))for(var L=0;L<B.length;L++)ve=B[L],A=ne+ae(ve,L),X+=D(ve,Y,ee,A,ce);else if(L=y(B),typeof L=="function")for(B=L.call(B),L=0;!(ve=B.next()).done;)ve=ve.value,A=ne+ae(ve,L++),X+=D(ve,Y,ee,A,ce);else if(A==="object"){if(typeof B.then=="function")return D(W(B),Y,ee,ve,ce);throw Y=String(B),Error("Objects are not valid as a React child (found: "+(Y==="[object Object]"?"object with keys {"+Object.keys(B).join(", ")+"}":Y)+"). If you meant to render a collection of children, use an array instead.")}return X}function k(B,Y,ee){if(B==null)return B;var ve=[],ce=0;return D(B,ve,"","",function(A){return Y.call(ee,A,ce++)}),ve}function ie(B){if(B._status===-1){var Y=B._result;Y=Y(),Y.then(function(ee){(B._status===0||B._status===-1)&&(B._status=1,B._result=ee)},function(ee){(B._status===0||B._status===-1)&&(B._status=2,B._result=ee)}),B._status===-1&&(B._status=0,B._result=Y)}if(B._status===1)return B._result.default;throw B._result}var J=typeof reportError=="function"?reportError:function(B){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Y=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof B=="object"&&B!==null&&typeof B.message=="string"?String(B.message):String(B),error:B});if(!window.dispatchEvent(Y))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",B);return}console.error(B)},H={map:k,forEach:function(B,Y,ee){k(B,function(){Y.apply(this,arguments)},ee)},count:function(B){var Y=0;return k(B,function(){Y++}),Y},toArray:function(B){return k(B,function(Y){return Y})||[]},only:function(B){if(!V(B))throw Error("React.Children.only expected to receive a single React element child.");return B}};return _t.Activity=_,_t.Children=H,_t.Component=b,_t.Fragment=i,_t.Profiler=l,_t.PureComponent=I,_t.StrictMode=s,_t.Suspense=m,_t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=j,_t.__COMPILER_RUNTIME={__proto__:null,c:function(B){return j.H.useMemoCache(B)}},_t.cache=function(B){return function(){return B.apply(null,arguments)}},_t.cacheSignal=function(){return null},_t.cloneElement=function(B,Y,ee){if(B==null)throw Error("The argument must be a React element, but you passed "+B+".");var ve=R({},B.props),ce=B.key;if(Y!=null)for(A in Y.key!==void 0&&(ce=""+Y.key),Y)!w.call(Y,A)||A==="key"||A==="__self"||A==="__source"||A==="ref"&&Y.ref===void 0||(ve[A]=Y[A]);var A=arguments.length-2;if(A===1)ve.children=ee;else if(1<A){for(var X=Array(A),ne=0;ne<A;ne++)X[ne]=arguments[ne+2];ve.children=X}return O(B.type,ce,ve)},_t.createContext=function(B){return B={$$typeof:f,_currentValue:B,_currentValue2:B,_threadCount:0,Provider:null,Consumer:null},B.Provider=B,B.Consumer={$$typeof:c,_context:B},B},_t.createElement=function(B,Y,ee){var ve,ce={},A=null;if(Y!=null)for(ve in Y.key!==void 0&&(A=""+Y.key),Y)w.call(Y,ve)&&ve!=="key"&&ve!=="__self"&&ve!=="__source"&&(ce[ve]=Y[ve]);var X=arguments.length-2;if(X===1)ce.children=ee;else if(1<X){for(var ne=Array(X),L=0;L<X;L++)ne[L]=arguments[L+2];ce.children=ne}if(B&&B.defaultProps)for(ve in X=B.defaultProps,X)ce[ve]===void 0&&(ce[ve]=X[ve]);return O(B,A,ce)},_t.createRef=function(){return{current:null}},_t.forwardRef=function(B){return{$$typeof:p,render:B}},_t.isValidElement=V,_t.lazy=function(B){return{$$typeof:v,_payload:{_status:-1,_result:B},_init:ie}},_t.memo=function(B,Y){return{$$typeof:h,type:B,compare:Y===void 0?null:Y}},_t.startTransition=function(B){var Y=j.T,ee={};j.T=ee;try{var ve=B(),ce=j.S;ce!==null&&ce(ee,ve),typeof ve=="object"&&ve!==null&&typeof ve.then=="function"&&ve.then(z,J)}catch(A){J(A)}finally{Y!==null&&ee.types!==null&&(Y.types=ee.types),j.T=Y}},_t.unstable_useCacheRefresh=function(){return j.H.useCacheRefresh()},_t.use=function(B){return j.H.use(B)},_t.useActionState=function(B,Y,ee){return j.H.useActionState(B,Y,ee)},_t.useCallback=function(B,Y){return j.H.useCallback(B,Y)},_t.useContext=function(B){return j.H.useContext(B)},_t.useDebugValue=function(){},_t.useDeferredValue=function(B,Y){return j.H.useDeferredValue(B,Y)},_t.useEffect=function(B,Y){return j.H.useEffect(B,Y)},_t.useEffectEvent=function(B){return j.H.useEffectEvent(B)},_t.useId=function(){return j.H.useId()},_t.useImperativeHandle=function(B,Y,ee){return j.H.useImperativeHandle(B,Y,ee)},_t.useInsertionEffect=function(B,Y){return j.H.useInsertionEffect(B,Y)},_t.useLayoutEffect=function(B,Y){return j.H.useLayoutEffect(B,Y)},_t.useMemo=function(B,Y){return j.H.useMemo(B,Y)},_t.useOptimistic=function(B,Y){return j.H.useOptimistic(B,Y)},_t.useReducer=function(B,Y,ee){return j.H.useReducer(B,Y,ee)},_t.useRef=function(B){return j.H.useRef(B)},_t.useState=function(B){return j.H.useState(B)},_t.useSyncExternalStore=function(B,Y,ee){return j.H.useSyncExternalStore(B,Y,ee)},_t.useTransition=function(){return j.H.useTransition()},_t.version="19.2.6",_t}var Zx;function Op(){return Zx||(Zx=1,qd.exports=Tb()),qd.exports}var Oe=Op(),Yd={exports:{}},sl={},Zd={exports:{}},Kd={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kx;function Ab(){return Kx||(Kx=1,(function(r){function e(D,k){var ie=D.length;D.push(k);e:for(;0<ie;){var J=ie-1>>>1,H=D[J];if(0<l(H,k))D[J]=k,D[ie]=H,ie=J;else break e}}function i(D){return D.length===0?null:D[0]}function s(D){if(D.length===0)return null;var k=D[0],ie=D.pop();if(ie!==k){D[0]=ie;e:for(var J=0,H=D.length,B=H>>>1;J<B;){var Y=2*(J+1)-1,ee=D[Y],ve=Y+1,ce=D[ve];if(0>l(ee,ie))ve<H&&0>l(ce,ee)?(D[J]=ce,D[ve]=ie,J=ve):(D[J]=ee,D[Y]=ie,J=Y);else if(ve<H&&0>l(ce,ie))D[J]=ce,D[ve]=ie,J=ve;else break e}}return k}function l(D,k){var ie=D.sortIndex-k.sortIndex;return ie!==0?ie:D.id-k.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var f=Date,p=f.now();r.unstable_now=function(){return f.now()-p}}var m=[],h=[],v=1,_=null,x=3,y=!1,T=!1,R=!1,S=!1,b=typeof setTimeout=="function"?setTimeout:null,C=typeof clearTimeout=="function"?clearTimeout:null,I=typeof setImmediate<"u"?setImmediate:null;function F(D){for(var k=i(h);k!==null;){if(k.callback===null)s(h);else if(k.startTime<=D)s(h),k.sortIndex=k.expirationTime,e(m,k);else break;k=i(h)}}function q(D){if(R=!1,F(D),!T)if(i(m)!==null)T=!0,z||(z=!0,Q());else{var k=i(h);k!==null&&W(q,k.startTime-D)}}var z=!1,j=-1,w=5,O=-1;function G(){return S?!0:!(r.unstable_now()-O<w)}function V(){if(S=!1,z){var D=r.unstable_now();O=D;var k=!0;try{e:{T=!1,R&&(R=!1,C(j),j=-1),y=!0;var ie=x;try{t:{for(F(D),_=i(m);_!==null&&!(_.expirationTime>D&&G());){var J=_.callback;if(typeof J=="function"){_.callback=null,x=_.priorityLevel;var H=J(_.expirationTime<=D);if(D=r.unstable_now(),typeof H=="function"){_.callback=H,F(D),k=!0;break t}_===i(m)&&s(m),F(D)}else s(m);_=i(m)}if(_!==null)k=!0;else{var B=i(h);B!==null&&W(q,B.startTime-D),k=!1}}break e}finally{_=null,x=ie,y=!1}k=void 0}}finally{k?Q():z=!1}}}var Q;if(typeof I=="function")Q=function(){I(V)};else if(typeof MessageChannel<"u"){var Z=new MessageChannel,ae=Z.port2;Z.port1.onmessage=V,Q=function(){ae.postMessage(null)}}else Q=function(){b(V,0)};function W(D,k){j=b(function(){D(r.unstable_now())},k)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(D){D.callback=null},r.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<D?Math.floor(1e3/D):5},r.unstable_getCurrentPriorityLevel=function(){return x},r.unstable_next=function(D){switch(x){case 1:case 2:case 3:var k=3;break;default:k=x}var ie=x;x=k;try{return D()}finally{x=ie}},r.unstable_requestPaint=function(){S=!0},r.unstable_runWithPriority=function(D,k){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var ie=x;x=D;try{return k()}finally{x=ie}},r.unstable_scheduleCallback=function(D,k,ie){var J=r.unstable_now();switch(typeof ie=="object"&&ie!==null?(ie=ie.delay,ie=typeof ie=="number"&&0<ie?J+ie:J):ie=J,D){case 1:var H=-1;break;case 2:H=250;break;case 5:H=1073741823;break;case 4:H=1e4;break;default:H=5e3}return H=ie+H,D={id:v++,callback:k,priorityLevel:D,startTime:ie,expirationTime:H,sortIndex:-1},ie>J?(D.sortIndex=ie,e(h,D),i(m)===null&&D===i(h)&&(R?(C(j),j=-1):R=!0,W(q,ie-J))):(D.sortIndex=H,e(m,D),T||y||(T=!0,z||(z=!0,Q()))),D},r.unstable_shouldYield=G,r.unstable_wrapCallback=function(D){var k=x;return function(){var ie=x;x=k;try{return D.apply(this,arguments)}finally{x=ie}}}})(Kd)),Kd}var Qx;function wb(){return Qx||(Qx=1,Zd.exports=Ab()),Zd.exports}var Qd={exports:{}},Hn={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jx;function Cb(){if(Jx)return Hn;Jx=1;var r=Op();function e(m){var h="https://react.dev/errors/"+m;if(1<arguments.length){h+="?args[]="+encodeURIComponent(arguments[1]);for(var v=2;v<arguments.length;v++)h+="&args[]="+encodeURIComponent(arguments[v])}return"Minified React error #"+m+"; visit "+h+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,h,v){var _=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:_==null?null:""+_,children:m,containerInfo:h,implementation:v}}var f=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function p(m,h){if(m==="font")return"";if(typeof h=="string")return h==="use-credentials"?h:""}return Hn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Hn.createPortal=function(m,h){var v=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!h||h.nodeType!==1&&h.nodeType!==9&&h.nodeType!==11)throw Error(e(299));return c(m,h,null,v)},Hn.flushSync=function(m){var h=f.T,v=s.p;try{if(f.T=null,s.p=2,m)return m()}finally{f.T=h,s.p=v,s.d.f()}},Hn.preconnect=function(m,h){typeof m=="string"&&(h?(h=h.crossOrigin,h=typeof h=="string"?h==="use-credentials"?h:"":void 0):h=null,s.d.C(m,h))},Hn.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},Hn.preinit=function(m,h){if(typeof m=="string"&&h&&typeof h.as=="string"){var v=h.as,_=p(v,h.crossOrigin),x=typeof h.integrity=="string"?h.integrity:void 0,y=typeof h.fetchPriority=="string"?h.fetchPriority:void 0;v==="style"?s.d.S(m,typeof h.precedence=="string"?h.precedence:void 0,{crossOrigin:_,integrity:x,fetchPriority:y}):v==="script"&&s.d.X(m,{crossOrigin:_,integrity:x,fetchPriority:y,nonce:typeof h.nonce=="string"?h.nonce:void 0})}},Hn.preinitModule=function(m,h){if(typeof m=="string")if(typeof h=="object"&&h!==null){if(h.as==null||h.as==="script"){var v=p(h.as,h.crossOrigin);s.d.M(m,{crossOrigin:v,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0})}}else h==null&&s.d.M(m)},Hn.preload=function(m,h){if(typeof m=="string"&&typeof h=="object"&&h!==null&&typeof h.as=="string"){var v=h.as,_=p(v,h.crossOrigin);s.d.L(m,v,{crossOrigin:_,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0,type:typeof h.type=="string"?h.type:void 0,fetchPriority:typeof h.fetchPriority=="string"?h.fetchPriority:void 0,referrerPolicy:typeof h.referrerPolicy=="string"?h.referrerPolicy:void 0,imageSrcSet:typeof h.imageSrcSet=="string"?h.imageSrcSet:void 0,imageSizes:typeof h.imageSizes=="string"?h.imageSizes:void 0,media:typeof h.media=="string"?h.media:void 0})}},Hn.preloadModule=function(m,h){if(typeof m=="string")if(h){var v=p(h.as,h.crossOrigin);s.d.m(m,{as:typeof h.as=="string"&&h.as!=="script"?h.as:void 0,crossOrigin:v,integrity:typeof h.integrity=="string"?h.integrity:void 0})}else s.d.m(m)},Hn.requestFormReset=function(m){s.d.r(m)},Hn.unstable_batchedUpdates=function(m,h){return m(h)},Hn.useFormState=function(m,h,v){return f.H.useFormState(m,h,v)},Hn.useFormStatus=function(){return f.H.useHostTransitionStatus()},Hn.version="19.2.6",Hn}var $x;function Rb(){if($x)return Qd.exports;$x=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Qd.exports=Cb(),Qd.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ev;function Nb(){if(ev)return sl;ev=1;var r=wb(),e=Op(),i=Rb();function s(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function c(t){var n=t,a=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,(n.flags&4098)!==0&&(a=n.return),t=n.return;while(t)}return n.tag===3?a:null}function f(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function p(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function m(t){if(c(t)!==t)throw Error(s(188))}function h(t){var n=t.alternate;if(!n){if(n=c(t),n===null)throw Error(s(188));return n!==t?null:t}for(var a=t,o=n;;){var u=a.return;if(u===null)break;var d=u.alternate;if(d===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===d.child){for(d=u.child;d;){if(d===a)return m(u),t;if(d===o)return m(u),n;d=d.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=d;else{for(var M=!1,P=u.child;P;){if(P===a){M=!0,a=u,o=d;break}if(P===o){M=!0,o=u,a=d;break}P=P.sibling}if(!M){for(P=d.child;P;){if(P===a){M=!0,a=d,o=u;break}if(P===o){M=!0,o=d,a=u;break}P=P.sibling}if(!M)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?t:n}function v(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=v(t),n!==null)return n;t=t.sibling}return null}var _=Object.assign,x=Symbol.for("react.element"),y=Symbol.for("react.transitional.element"),T=Symbol.for("react.portal"),R=Symbol.for("react.fragment"),S=Symbol.for("react.strict_mode"),b=Symbol.for("react.profiler"),C=Symbol.for("react.consumer"),I=Symbol.for("react.context"),F=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),z=Symbol.for("react.suspense_list"),j=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),O=Symbol.for("react.activity"),G=Symbol.for("react.memo_cache_sentinel"),V=Symbol.iterator;function Q(t){return t===null||typeof t!="object"?null:(t=V&&t[V]||t["@@iterator"],typeof t=="function"?t:null)}var Z=Symbol.for("react.client.reference");function ae(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===Z?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case R:return"Fragment";case b:return"Profiler";case S:return"StrictMode";case q:return"Suspense";case z:return"SuspenseList";case O:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case T:return"Portal";case I:return t.displayName||"Context";case C:return(t._context.displayName||"Context")+".Consumer";case F:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case j:return n=t.displayName||null,n!==null?n:ae(t.type)||"Memo";case w:n=t._payload,t=t._init;try{return ae(t(n))}catch{}}return null}var W=Array.isArray,D=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,k=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ie={pending:!1,data:null,method:null,action:null},J=[],H=-1;function B(t){return{current:t}}function Y(t){0>H||(t.current=J[H],J[H]=null,H--)}function ee(t,n){H++,J[H]=t.current,t.current=n}var ve=B(null),ce=B(null),A=B(null),X=B(null);function ne(t,n){switch(ee(A,n),ee(ce,t),ee(ve,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?mx(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=mx(n),t=gx(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Y(ve),ee(ve,t)}function L(){Y(ve),Y(ce),Y(A)}function Ee(t){t.memoizedState!==null&&ee(X,t);var n=ve.current,a=gx(n,t.type);n!==a&&(ee(ce,t),ee(ve,a))}function Re(t){ce.current===t&&(Y(ve),Y(ce)),X.current===t&&(Y(X),el._currentValue=ie)}var Ve,ke;function Ze(t){if(Ve===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Ve=n&&n[1]||"",ke=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ve+t+ke}var at=!1;function qe(t,n){if(!t||at)return"";at=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var Ce=function(){throw Error()};if(Object.defineProperty(Ce.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Ce,[])}catch(Se){var ye=Se}Reflect.construct(t,[],Ce)}else{try{Ce.call()}catch(Se){ye=Se}t.call(Ce.prototype)}}else{try{throw Error()}catch(Se){ye=Se}(Ce=t())&&typeof Ce.catch=="function"&&Ce.catch(function(){})}}catch(Se){if(Se&&ye&&typeof Se.stack=="string")return[Se.stack,ye.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var d=o.DetermineComponentFrameRoot(),M=d[0],P=d[1];if(M&&P){var $=M.split(`
`),me=P.split(`
`);for(u=o=0;o<$.length&&!$[o].includes("DetermineComponentFrameRoot");)o++;for(;u<me.length&&!me[u].includes("DetermineComponentFrameRoot");)u++;if(o===$.length||u===me.length)for(o=$.length-1,u=me.length-1;1<=o&&0<=u&&$[o]!==me[u];)u--;for(;1<=o&&0<=u;o--,u--)if($[o]!==me[u]){if(o!==1||u!==1)do if(o--,u--,0>u||$[o]!==me[u]){var Te=`
`+$[o].replace(" at new "," at ");return t.displayName&&Te.includes("<anonymous>")&&(Te=Te.replace("<anonymous>",t.displayName)),Te}while(1<=o&&0<=u);break}}}finally{at=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?Ze(a):""}function lt(t,n){switch(t.tag){case 26:case 27:case 5:return Ze(t.type);case 16:return Ze("Lazy");case 13:return t.child!==n&&n!==null?Ze("Suspense Fallback"):Ze("Suspense");case 19:return Ze("SuspenseList");case 0:case 15:return qe(t.type,!1);case 11:return qe(t.type.render,!1);case 1:return qe(t.type,!0);case 31:return Ze("Activity");default:return""}}function ze(t){try{var n="",a=null;do n+=lt(t,a),a=t,t=t.return;while(t);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var gt=Object.prototype.hasOwnProperty,te=r.unstable_scheduleCallback,vt=r.unstable_cancelCallback,nt=r.unstable_shouldYield,pt=r.unstable_requestPaint,Pe=r.unstable_now,kt=r.unstable_getCurrentPriorityLevel,N=r.unstable_ImmediatePriority,E=r.unstable_UserBlockingPriority,K=r.unstable_NormalPriority,ue=r.unstable_LowPriority,he=r.unstable_IdlePriority,Me=r.log,Ne=r.unstable_setDisableYieldValue,de=null,be=null;function Le(t){if(typeof Me=="function"&&Ne(t),be&&typeof be.setStrictMode=="function")try{be.setStrictMode(de,t)}catch{}}var He=Math.clz32?Math.clz32:mt,Ie=Math.log,Fe=Math.LN2;function mt(t){return t>>>=0,t===0?32:31-(Ie(t)/Fe|0)|0}var it=256,xt=262144,se=4194304;function Ue(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function Ae(t,n,a){var o=t.pendingLanes;if(o===0)return 0;var u=0,d=t.suspendedLanes,M=t.pingedLanes;t=t.warmLanes;var P=o&134217727;return P!==0?(o=P&~d,o!==0?u=Ue(o):(M&=P,M!==0?u=Ue(M):a||(a=P&~t,a!==0&&(u=Ue(a))))):(P=o&~d,P!==0?u=Ue(P):M!==0?u=Ue(M):a||(a=o&~t,a!==0&&(u=Ue(a)))),u===0?0:n!==0&&n!==u&&(n&d)===0&&(d=u&-u,a=n&-n,d>=a||d===32&&(a&4194048)!==0)?n:u}function Xe(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Be(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function De(){var t=se;return se<<=1,(se&62914560)===0&&(se=4194304),t}function et(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function dt(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function on(t,n,a,o,u,d){var M=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var P=t.entanglements,$=t.expirationTimes,me=t.hiddenUpdates;for(a=M&~a;0<a;){var Te=31-He(a),Ce=1<<Te;P[Te]=0,$[Te]=-1;var ye=me[Te];if(ye!==null)for(me[Te]=null,Te=0;Te<ye.length;Te++){var Se=ye[Te];Se!==null&&(Se.lane&=-536870913)}a&=~Ce}o!==0&&Ft(t,o,0),d!==0&&u===0&&t.tag!==0&&(t.suspendedLanes|=d&~(M&~n))}function Ft(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var o=31-He(n);t.entangledLanes|=n,t.entanglements[o]=t.entanglements[o]|1073741824|a&261930}function bi(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var o=31-He(a),u=1<<o;u&n|t[o]&n&&(t[o]|=n),a&=~u}}function si(t,n){var a=n&-n;return a=(a&42)!==0?1:Ss(a),(a&(t.suspendedLanes|n))!==0?0:a}function Ss(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function fo(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function ho(){var t=k.p;return t!==0?t:(t=window.event,t===void 0?32:Bx(t.type))}function po(t,n){var a=k.p;try{return k.p=t,n()}finally{k.p=a}}var Bn=Math.random().toString(36).slice(2),dn="__reactFiber$"+Bn,Ln="__reactProps$"+Bn,ia="__reactContainer$"+Bn,La="__reactEvents$"+Bn,wl="__reactListeners$"+Bn,ir="__reactHandles$"+Bn,mo="__reactResources$"+Bn,Ua="__reactMarker$"+Bn;function go(t){delete t[dn],delete t[Ln],delete t[La],delete t[wl],delete t[ir]}function Oa(t){var n=t[dn];if(n)return n;for(var a=t.parentNode;a;){if(n=a[ia]||a[dn]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=Mx(t);t!==null;){if(a=t[dn])return a;t=Mx(t)}return n}t=a,a=t.parentNode}return null}function Pa(t){if(t=t[dn]||t[ia]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function Ms(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(s(33))}function Ia(t){var n=t[mo];return n||(n=t[mo]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function xn(t){t[Ua]=!0}var Cl=new Set,U={};function oe(t,n){_e(t,n),_e(t+"Capture",n)}function _e(t,n){for(U[t]=n,t=0;t<n.length;t++)Cl.add(n[t])}var ge=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),xe={},je={};function Ke(t){return gt.call(je,t)?!0:gt.call(xe,t)?!1:ge.test(t)?je[t]=!0:(xe[t]=!0,!1)}function Ge(t,n,a){if(Ke(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,""+a)}}function Je(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,""+a)}}function Qe(t,n,a,o){if(o===null)t.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,""+o)}}function rt(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function bt(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function st(t,n,a){var o=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,d=o.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return u.call(this)},set:function(M){a=""+M,d.call(this,M)}}),Object.defineProperty(t,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(M){a=""+M},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function Ot(t){if(!t._valueTracker){var n=bt(t)?"checked":"value";t._valueTracker=st(t,n,""+t[n])}}function an(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return t&&(o=bt(t)?t.checked?"true":"false":t.value),t=o,t!==a?(n.setValue(t),!0):!1}function $t(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var Vt=/[\n"\\]/g;function jt(t){return t.replace(Vt,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Ye(t,n,a,o,u,d,M,P){t.name="",M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"?t.type=M:t.removeAttribute("type"),n!=null?M==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+rt(n)):t.value!==""+rt(n)&&(t.value=""+rt(n)):M!=="submit"&&M!=="reset"||t.removeAttribute("value"),n!=null?wt(t,M,rt(n)):a!=null?wt(t,M,rt(a)):o!=null&&t.removeAttribute("value"),u==null&&d!=null&&(t.defaultChecked=!!d),u!=null&&(t.checked=u&&typeof u!="function"&&typeof u!="symbol"),P!=null&&typeof P!="function"&&typeof P!="symbol"&&typeof P!="boolean"?t.name=""+rt(P):t.removeAttribute("name")}function kn(t,n,a,o,u,d,M,P){if(d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"&&(t.type=d),n!=null||a!=null){if(!(d!=="submit"&&d!=="reset"||n!=null)){Ot(t);return}a=a!=null?""+rt(a):"",n=n!=null?""+rt(n):a,P||n===t.value||(t.value=n),t.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,t.checked=P?t.checked:!!o,t.defaultChecked=!!o,M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"&&(t.name=M),Ot(t)}function wt(t,n,a){n==="number"&&$t(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function Tn(t,n,a,o){if(t=t.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<t.length;a++)u=n.hasOwnProperty("$"+t[a].value),t[a].selected!==u&&(t[a].selected=u),u&&o&&(t[a].defaultSelected=!0)}else{for(a=""+rt(a),n=null,u=0;u<t.length;u++){if(t[u].value===a){t[u].selected=!0,o&&(t[u].defaultSelected=!0);return}n!==null||t[u].disabled||(n=t[u])}n!==null&&(n.selected=!0)}}function ri(t,n,a){if(n!=null&&(n=""+rt(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+rt(a):""}function zi(t,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(W(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=rt(n),t.defaultValue=a,o=t.textContent,o===a&&o!==""&&o!==null&&(t.value=o),Ot(t)}function oi(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var Xt=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function sn(t,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":o?t.setProperty(n,a):typeof a!="number"||a===0||Xt.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function Li(t,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(t=t.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?t.setProperty(o,""):o==="float"?t.cssFloat="":t[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&sn(t,u,o)}else for(var d in n)n.hasOwnProperty(d)&&sn(t,d,n[d])}function Ht(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Gi=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Fa=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Es(t){return Fa.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function aa(){}var Gu=null;function Vu(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var ar=null,sr=null;function pm(t){var n=Pa(t);if(n&&(t=n.stateNode)){var a=t[Ln]||null;e:switch(t=n.stateNode,n.type){case"input":if(Ye(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+jt(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==t&&o.form===t.form){var u=o[Ln]||null;if(!u)throw Error(s(90));Ye(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===t.form&&an(o)}break e;case"textarea":ri(t,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&Tn(t,!!a.multiple,n,!1)}}}var ju=!1;function mm(t,n,a){if(ju)return t(n,a);ju=!0;try{var o=t(n);return o}finally{if(ju=!1,(ar!==null||sr!==null)&&(mc(),ar&&(n=ar,t=sr,sr=ar=null,pm(n),t)))for(n=0;n<t.length;n++)pm(t[n])}}function xo(t,n){var a=t.stateNode;if(a===null)return null;var o=a[Ln]||null;if(o===null)return null;a=o[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(t=t.type,o=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!o;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var sa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Xu=!1;if(sa)try{var vo={};Object.defineProperty(vo,"passive",{get:function(){Xu=!0}}),window.addEventListener("test",vo,vo),window.removeEventListener("test",vo,vo)}catch{Xu=!1}var Ba=null,Wu=null,Rl=null;function gm(){if(Rl)return Rl;var t,n=Wu,a=n.length,o,u="value"in Ba?Ba.value:Ba.textContent,d=u.length;for(t=0;t<a&&n[t]===u[t];t++);var M=a-t;for(o=1;o<=M&&n[a-o]===u[d-o];o++);return Rl=u.slice(t,1<o?1-o:void 0)}function Nl(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function Dl(){return!0}function xm(){return!1}function Zn(t){function n(a,o,u,d,M){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=d,this.target=M,this.currentTarget=null;for(var P in t)t.hasOwnProperty(P)&&(a=t[P],this[P]=a?a(d):d[P]);return this.isDefaultPrevented=(d.defaultPrevented!=null?d.defaultPrevented:d.returnValue===!1)?Dl:xm,this.isPropagationStopped=xm,this}return _(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Dl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Dl)},persist:function(){},isPersistent:Dl}),n}var Ts={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},zl=Zn(Ts),_o=_({},Ts,{view:0,detail:0}),by=Zn(_o),qu,Yu,yo,Ll=_({},_o,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ku,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==yo&&(yo&&t.type==="mousemove"?(qu=t.screenX-yo.screenX,Yu=t.screenY-yo.screenY):Yu=qu=0,yo=t),qu)},movementY:function(t){return"movementY"in t?t.movementY:Yu}}),vm=Zn(Ll),Sy=_({},Ll,{dataTransfer:0}),My=Zn(Sy),Ey=_({},_o,{relatedTarget:0}),Zu=Zn(Ey),Ty=_({},Ts,{animationName:0,elapsedTime:0,pseudoElement:0}),Ay=Zn(Ty),wy=_({},Ts,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Cy=Zn(wy),Ry=_({},Ts,{data:0}),_m=Zn(Ry),Ny={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Dy={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},zy={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ly(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=zy[t])?!!n[t]:!1}function Ku(){return Ly}var Uy=_({},_o,{key:function(t){if(t.key){var n=Ny[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=Nl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Dy[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ku,charCode:function(t){return t.type==="keypress"?Nl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Nl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Oy=Zn(Uy),Py=_({},Ll,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ym=Zn(Py),Iy=_({},_o,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ku}),Fy=Zn(Iy),By=_({},Ts,{propertyName:0,elapsedTime:0,pseudoElement:0}),ky=Zn(By),Hy=_({},Ll,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Gy=Zn(Hy),Vy=_({},Ts,{newState:0,oldState:0}),jy=Zn(Vy),Xy=[9,13,27,32],Qu=sa&&"CompositionEvent"in window,bo=null;sa&&"documentMode"in document&&(bo=document.documentMode);var Wy=sa&&"TextEvent"in window&&!bo,bm=sa&&(!Qu||bo&&8<bo&&11>=bo),Sm=" ",Mm=!1;function Em(t,n){switch(t){case"keyup":return Xy.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Tm(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var rr=!1;function qy(t,n){switch(t){case"compositionend":return Tm(n);case"keypress":return n.which!==32?null:(Mm=!0,Sm);case"textInput":return t=n.data,t===Sm&&Mm?null:t;default:return null}}function Yy(t,n){if(rr)return t==="compositionend"||!Qu&&Em(t,n)?(t=gm(),Rl=Wu=Ba=null,rr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return bm&&n.locale!=="ko"?null:n.data;default:return null}}var Zy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Am(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!Zy[t.type]:n==="textarea"}function wm(t,n,a,o){ar?sr?sr.push(o):sr=[o]:ar=o,n=Sc(n,"onChange"),0<n.length&&(a=new zl("onChange","change",null,a,o),t.push({event:a,listeners:n}))}var So=null,Mo=null;function Ky(t){cx(t,0)}function Ul(t){var n=Ms(t);if(an(n))return t}function Cm(t,n){if(t==="change")return n}var Rm=!1;if(sa){var Ju;if(sa){var $u="oninput"in document;if(!$u){var Nm=document.createElement("div");Nm.setAttribute("oninput","return;"),$u=typeof Nm.oninput=="function"}Ju=$u}else Ju=!1;Rm=Ju&&(!document.documentMode||9<document.documentMode)}function Dm(){So&&(So.detachEvent("onpropertychange",zm),Mo=So=null)}function zm(t){if(t.propertyName==="value"&&Ul(Mo)){var n=[];wm(n,Mo,t,Vu(t)),mm(Ky,n)}}function Qy(t,n,a){t==="focusin"?(Dm(),So=n,Mo=a,So.attachEvent("onpropertychange",zm)):t==="focusout"&&Dm()}function Jy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Ul(Mo)}function $y(t,n){if(t==="click")return Ul(n)}function e1(t,n){if(t==="input"||t==="change")return Ul(n)}function t1(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var li=typeof Object.is=="function"?Object.is:t1;function Eo(t,n){if(li(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!gt.call(n,u)||!li(t[u],n[u]))return!1}return!0}function Lm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Um(t,n){var a=Lm(t);t=0;for(var o;a;){if(a.nodeType===3){if(o=t+a.textContent.length,t<=n&&o>=n)return{node:a,offset:n-t};t=o}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Lm(a)}}function Om(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?Om(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function Pm(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=$t(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=$t(t.document)}return n}function ef(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var n1=sa&&"documentMode"in document&&11>=document.documentMode,or=null,tf=null,To=null,nf=!1;function Im(t,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;nf||or==null||or!==$t(o)||(o=or,"selectionStart"in o&&ef(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),To&&Eo(To,o)||(To=o,o=Sc(tf,"onSelect"),0<o.length&&(n=new zl("onSelect","select",null,n,a),t.push({event:n,listeners:o}),n.target=or)))}function As(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var lr={animationend:As("Animation","AnimationEnd"),animationiteration:As("Animation","AnimationIteration"),animationstart:As("Animation","AnimationStart"),transitionrun:As("Transition","TransitionRun"),transitionstart:As("Transition","TransitionStart"),transitioncancel:As("Transition","TransitionCancel"),transitionend:As("Transition","TransitionEnd")},af={},Fm={};sa&&(Fm=document.createElement("div").style,"AnimationEvent"in window||(delete lr.animationend.animation,delete lr.animationiteration.animation,delete lr.animationstart.animation),"TransitionEvent"in window||delete lr.transitionend.transition);function ws(t){if(af[t])return af[t];if(!lr[t])return t;var n=lr[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in Fm)return af[t]=n[a];return t}var Bm=ws("animationend"),km=ws("animationiteration"),Hm=ws("animationstart"),i1=ws("transitionrun"),a1=ws("transitionstart"),s1=ws("transitioncancel"),Gm=ws("transitionend"),Vm=new Map,sf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");sf.push("scrollEnd");function Ui(t,n){Vm.set(t,n),oe(n,[t])}var Ol=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},Si=[],cr=0,rf=0;function Pl(){for(var t=cr,n=rf=cr=0;n<t;){var a=Si[n];Si[n++]=null;var o=Si[n];Si[n++]=null;var u=Si[n];Si[n++]=null;var d=Si[n];if(Si[n++]=null,o!==null&&u!==null){var M=o.pending;M===null?u.next=u:(u.next=M.next,M.next=u),o.pending=u}d!==0&&jm(a,u,d)}}function Il(t,n,a,o){Si[cr++]=t,Si[cr++]=n,Si[cr++]=a,Si[cr++]=o,rf|=o,t.lanes|=o,t=t.alternate,t!==null&&(t.lanes|=o)}function of(t,n,a,o){return Il(t,n,a,o),Fl(t)}function Cs(t,n){return Il(t,null,null,n),Fl(t)}function jm(t,n,a){t.lanes|=a;var o=t.alternate;o!==null&&(o.lanes|=a);for(var u=!1,d=t.return;d!==null;)d.childLanes|=a,o=d.alternate,o!==null&&(o.childLanes|=a),d.tag===22&&(t=d.stateNode,t===null||t._visibility&1||(u=!0)),t=d,d=d.return;return t.tag===3?(d=t.stateNode,u&&n!==null&&(u=31-He(a),t=d.hiddenUpdates,o=t[u],o===null?t[u]=[n]:o.push(n),n.lane=a|536870912),d):null}function Fl(t){if(50<qo)throw qo=0,gd=null,Error(s(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var ur={};function r1(t,n,a,o){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ci(t,n,a,o){return new r1(t,n,a,o)}function lf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function ra(t,n){var a=t.alternate;return a===null?(a=ci(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function Xm(t,n){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function Bl(t,n,a,o,u,d){var M=0;if(o=t,typeof t=="function")lf(t)&&(M=1);else if(typeof t=="string")M=fb(t,a,ve.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case O:return t=ci(31,a,n,u),t.elementType=O,t.lanes=d,t;case R:return Rs(a.children,u,d,n);case S:M=8,u|=24;break;case b:return t=ci(12,a,n,u|2),t.elementType=b,t.lanes=d,t;case q:return t=ci(13,a,n,u),t.elementType=q,t.lanes=d,t;case z:return t=ci(19,a,n,u),t.elementType=z,t.lanes=d,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case I:M=10;break e;case C:M=9;break e;case F:M=11;break e;case j:M=14;break e;case w:M=16,o=null;break e}M=29,a=Error(s(130,t===null?"null":typeof t,"")),o=null}return n=ci(M,a,n,u),n.elementType=t,n.type=o,n.lanes=d,n}function Rs(t,n,a,o){return t=ci(7,t,o,n),t.lanes=a,t}function cf(t,n,a){return t=ci(6,t,null,n),t.lanes=a,t}function Wm(t){var n=ci(18,null,null,0);return n.stateNode=t,n}function uf(t,n,a){return n=ci(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var qm=new WeakMap;function Mi(t,n){if(typeof t=="object"&&t!==null){var a=qm.get(t);return a!==void 0?a:(n={value:t,source:n,stack:ze(n)},qm.set(t,n),n)}return{value:t,source:n,stack:ze(n)}}var fr=[],dr=0,kl=null,Ao=0,Ei=[],Ti=0,ka=null,Vi=1,ji="";function oa(t,n){fr[dr++]=Ao,fr[dr++]=kl,kl=t,Ao=n}function Ym(t,n,a){Ei[Ti++]=Vi,Ei[Ti++]=ji,Ei[Ti++]=ka,ka=t;var o=Vi;t=ji;var u=32-He(o)-1;o&=~(1<<u),a+=1;var d=32-He(n)+u;if(30<d){var M=u-u%5;d=(o&(1<<M)-1).toString(32),o>>=M,u-=M,Vi=1<<32-He(n)+u|a<<u|o,ji=d+t}else Vi=1<<d|a<<u|o,ji=t}function ff(t){t.return!==null&&(oa(t,1),Ym(t,1,0))}function df(t){for(;t===kl;)kl=fr[--dr],fr[dr]=null,Ao=fr[--dr],fr[dr]=null;for(;t===ka;)ka=Ei[--Ti],Ei[Ti]=null,ji=Ei[--Ti],Ei[Ti]=null,Vi=Ei[--Ti],Ei[Ti]=null}function Zm(t,n){Ei[Ti++]=Vi,Ei[Ti++]=ji,Ei[Ti++]=ka,Vi=n.id,ji=n.overflow,ka=t}var Un=null,tn=null,zt=!1,Ha=null,Ai=!1,hf=Error(s(519));function Ga(t){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw wo(Mi(n,t)),hf}function Km(t){var n=t.stateNode,a=t.type,o=t.memoizedProps;switch(n[dn]=t,n[Ln]=o,a){case"dialog":Rt("cancel",n),Rt("close",n);break;case"iframe":case"object":case"embed":Rt("load",n);break;case"video":case"audio":for(a=0;a<Zo.length;a++)Rt(Zo[a],n);break;case"source":Rt("error",n);break;case"img":case"image":case"link":Rt("error",n),Rt("load",n);break;case"details":Rt("toggle",n);break;case"input":Rt("invalid",n),kn(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":Rt("invalid",n);break;case"textarea":Rt("invalid",n),zi(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||hx(n.textContent,a)?(o.popover!=null&&(Rt("beforetoggle",n),Rt("toggle",n)),o.onScroll!=null&&Rt("scroll",n),o.onScrollEnd!=null&&Rt("scrollend",n),o.onClick!=null&&(n.onclick=aa),n=!0):n=!1,n||Ga(t,!0)}function Qm(t){for(Un=t.return;Un;)switch(Un.tag){case 5:case 31:case 13:Ai=!1;return;case 27:case 3:Ai=!0;return;default:Un=Un.return}}function hr(t){if(t!==Un)return!1;if(!zt)return Qm(t),zt=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||Dd(t.type,t.memoizedProps)),a=!a),a&&tn&&Ga(t),Qm(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));tn=Sx(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));tn=Sx(t)}else n===27?(n=tn,ns(t.type)?(t=Pd,Pd=null,tn=t):tn=n):tn=Un?Ci(t.stateNode.nextSibling):null;return!0}function Ns(){tn=Un=null,zt=!1}function pf(){var t=Ha;return t!==null&&($n===null?$n=t:$n.push.apply($n,t),Ha=null),t}function wo(t){Ha===null?Ha=[t]:Ha.push(t)}var mf=B(null),Ds=null,la=null;function Va(t,n,a){ee(mf,n._currentValue),n._currentValue=a}function ca(t){t._currentValue=mf.current,Y(mf)}function gf(t,n,a){for(;t!==null;){var o=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),t===a)break;t=t.return}}function xf(t,n,a,o){var u=t.child;for(u!==null&&(u.return=t);u!==null;){var d=u.dependencies;if(d!==null){var M=u.child;d=d.firstContext;e:for(;d!==null;){var P=d;d=u;for(var $=0;$<n.length;$++)if(P.context===n[$]){d.lanes|=a,P=d.alternate,P!==null&&(P.lanes|=a),gf(d.return,a,t),o||(M=null);break e}d=P.next}}else if(u.tag===18){if(M=u.return,M===null)throw Error(s(341));M.lanes|=a,d=M.alternate,d!==null&&(d.lanes|=a),gf(M,a,t),M=null}else M=u.child;if(M!==null)M.return=u;else for(M=u;M!==null;){if(M===t){M=null;break}if(u=M.sibling,u!==null){u.return=M.return,M=u;break}M=M.return}u=M}}function pr(t,n,a,o){t=null;for(var u=n,d=!1;u!==null;){if(!d){if((u.flags&524288)!==0)d=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var M=u.alternate;if(M===null)throw Error(s(387));if(M=M.memoizedProps,M!==null){var P=u.type;li(u.pendingProps.value,M.value)||(t!==null?t.push(P):t=[P])}}else if(u===X.current){if(M=u.alternate,M===null)throw Error(s(387));M.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(t!==null?t.push(el):t=[el])}u=u.return}t!==null&&xf(n,t,a,o),n.flags|=262144}function Hl(t){for(t=t.firstContext;t!==null;){if(!li(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function zs(t){Ds=t,la=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function On(t){return Jm(Ds,t)}function Gl(t,n){return Ds===null&&zs(t),Jm(t,n)}function Jm(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},la===null){if(t===null)throw Error(s(308));la=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else la=la.next=n;return a}var o1=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,o){t.push(o)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},l1=r.unstable_scheduleCallback,c1=r.unstable_NormalPriority,vn={$$typeof:I,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function vf(){return{controller:new o1,data:new Map,refCount:0}}function Co(t){t.refCount--,t.refCount===0&&l1(c1,function(){t.controller.abort()})}var Ro=null,_f=0,mr=0,gr=null;function u1(t,n){if(Ro===null){var a=Ro=[];_f=0,mr=Sd(),gr={status:"pending",value:void 0,then:function(o){a.push(o)}}}return _f++,n.then($m,$m),n}function $m(){if(--_f===0&&Ro!==null){gr!==null&&(gr.status="fulfilled");var t=Ro;Ro=null,mr=0,gr=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function f1(t,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return t.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var e0=D.S;D.S=function(t,n){Ig=Pe(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&u1(t,n),e0!==null&&e0(t,n)};var Ls=B(null);function yf(){var t=Ls.current;return t!==null?t:en.pooledCache}function Vl(t,n){n===null?ee(Ls,Ls.current):ee(Ls,n.pool)}function t0(){var t=yf();return t===null?null:{parent:vn._currentValue,pool:t}}var xr=Error(s(460)),bf=Error(s(474)),jl=Error(s(542)),Xl={then:function(){}};function n0(t){return t=t.status,t==="fulfilled"||t==="rejected"}function i0(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(aa,aa),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,s0(t),t;default:if(typeof n.status=="string")n.then(aa,aa);else{if(t=en,t!==null&&100<t.shellSuspendCounter)throw Error(s(482));t=n,t.status="pending",t.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,s0(t),t}throw Os=n,xr}}function Us(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Os=a,xr):a}}var Os=null;function a0(){if(Os===null)throw Error(s(459));var t=Os;return Os=null,t}function s0(t){if(t===xr||t===jl)throw Error(s(483))}var vr=null,No=0;function Wl(t){var n=No;return No+=1,vr===null&&(vr=[]),i0(vr,t,n)}function Do(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function ql(t,n){throw n.$$typeof===x?Error(s(525)):(t=Object.prototype.toString.call(n),Error(s(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function r0(t){function n(fe,re){if(t){var pe=fe.deletions;pe===null?(fe.deletions=[re],fe.flags|=16):pe.push(re)}}function a(fe,re){if(!t)return null;for(;re!==null;)n(fe,re),re=re.sibling;return null}function o(fe){for(var re=new Map;fe!==null;)fe.key!==null?re.set(fe.key,fe):re.set(fe.index,fe),fe=fe.sibling;return re}function u(fe,re){return fe=ra(fe,re),fe.index=0,fe.sibling=null,fe}function d(fe,re,pe){return fe.index=pe,t?(pe=fe.alternate,pe!==null?(pe=pe.index,pe<re?(fe.flags|=67108866,re):pe):(fe.flags|=67108866,re)):(fe.flags|=1048576,re)}function M(fe){return t&&fe.alternate===null&&(fe.flags|=67108866),fe}function P(fe,re,pe,we){return re===null||re.tag!==6?(re=cf(pe,fe.mode,we),re.return=fe,re):(re=u(re,pe),re.return=fe,re)}function $(fe,re,pe,we){var ot=pe.type;return ot===R?Te(fe,re,pe.props.children,we,pe.key):re!==null&&(re.elementType===ot||typeof ot=="object"&&ot!==null&&ot.$$typeof===w&&Us(ot)===re.type)?(re=u(re,pe.props),Do(re,pe),re.return=fe,re):(re=Bl(pe.type,pe.key,pe.props,null,fe.mode,we),Do(re,pe),re.return=fe,re)}function me(fe,re,pe,we){return re===null||re.tag!==4||re.stateNode.containerInfo!==pe.containerInfo||re.stateNode.implementation!==pe.implementation?(re=uf(pe,fe.mode,we),re.return=fe,re):(re=u(re,pe.children||[]),re.return=fe,re)}function Te(fe,re,pe,we,ot){return re===null||re.tag!==7?(re=Rs(pe,fe.mode,we,ot),re.return=fe,re):(re=u(re,pe),re.return=fe,re)}function Ce(fe,re,pe){if(typeof re=="string"&&re!==""||typeof re=="number"||typeof re=="bigint")return re=cf(""+re,fe.mode,pe),re.return=fe,re;if(typeof re=="object"&&re!==null){switch(re.$$typeof){case y:return pe=Bl(re.type,re.key,re.props,null,fe.mode,pe),Do(pe,re),pe.return=fe,pe;case T:return re=uf(re,fe.mode,pe),re.return=fe,re;case w:return re=Us(re),Ce(fe,re,pe)}if(W(re)||Q(re))return re=Rs(re,fe.mode,pe,null),re.return=fe,re;if(typeof re.then=="function")return Ce(fe,Wl(re),pe);if(re.$$typeof===I)return Ce(fe,Gl(fe,re),pe);ql(fe,re)}return null}function ye(fe,re,pe,we){var ot=re!==null?re.key:null;if(typeof pe=="string"&&pe!==""||typeof pe=="number"||typeof pe=="bigint")return ot!==null?null:P(fe,re,""+pe,we);if(typeof pe=="object"&&pe!==null){switch(pe.$$typeof){case y:return pe.key===ot?$(fe,re,pe,we):null;case T:return pe.key===ot?me(fe,re,pe,we):null;case w:return pe=Us(pe),ye(fe,re,pe,we)}if(W(pe)||Q(pe))return ot!==null?null:Te(fe,re,pe,we,null);if(typeof pe.then=="function")return ye(fe,re,Wl(pe),we);if(pe.$$typeof===I)return ye(fe,re,Gl(fe,pe),we);ql(fe,pe)}return null}function Se(fe,re,pe,we,ot){if(typeof we=="string"&&we!==""||typeof we=="number"||typeof we=="bigint")return fe=fe.get(pe)||null,P(re,fe,""+we,ot);if(typeof we=="object"&&we!==null){switch(we.$$typeof){case y:return fe=fe.get(we.key===null?pe:we.key)||null,$(re,fe,we,ot);case T:return fe=fe.get(we.key===null?pe:we.key)||null,me(re,fe,we,ot);case w:return we=Us(we),Se(fe,re,pe,we,ot)}if(W(we)||Q(we))return fe=fe.get(pe)||null,Te(re,fe,we,ot,null);if(typeof we.then=="function")return Se(fe,re,pe,Wl(we),ot);if(we.$$typeof===I)return Se(fe,re,pe,Gl(re,we),ot);ql(re,we)}return null}function $e(fe,re,pe,we){for(var ot=null,Pt=null,tt=re,Mt=re=0,Dt=null;tt!==null&&Mt<pe.length;Mt++){tt.index>Mt?(Dt=tt,tt=null):Dt=tt.sibling;var It=ye(fe,tt,pe[Mt],we);if(It===null){tt===null&&(tt=Dt);break}t&&tt&&It.alternate===null&&n(fe,tt),re=d(It,re,Mt),Pt===null?ot=It:Pt.sibling=It,Pt=It,tt=Dt}if(Mt===pe.length)return a(fe,tt),zt&&oa(fe,Mt),ot;if(tt===null){for(;Mt<pe.length;Mt++)tt=Ce(fe,pe[Mt],we),tt!==null&&(re=d(tt,re,Mt),Pt===null?ot=tt:Pt.sibling=tt,Pt=tt);return zt&&oa(fe,Mt),ot}for(tt=o(tt);Mt<pe.length;Mt++)Dt=Se(tt,fe,Mt,pe[Mt],we),Dt!==null&&(t&&Dt.alternate!==null&&tt.delete(Dt.key===null?Mt:Dt.key),re=d(Dt,re,Mt),Pt===null?ot=Dt:Pt.sibling=Dt,Pt=Dt);return t&&tt.forEach(function(os){return n(fe,os)}),zt&&oa(fe,Mt),ot}function ct(fe,re,pe,we){if(pe==null)throw Error(s(151));for(var ot=null,Pt=null,tt=re,Mt=re=0,Dt=null,It=pe.next();tt!==null&&!It.done;Mt++,It=pe.next()){tt.index>Mt?(Dt=tt,tt=null):Dt=tt.sibling;var os=ye(fe,tt,It.value,we);if(os===null){tt===null&&(tt=Dt);break}t&&tt&&os.alternate===null&&n(fe,tt),re=d(os,re,Mt),Pt===null?ot=os:Pt.sibling=os,Pt=os,tt=Dt}if(It.done)return a(fe,tt),zt&&oa(fe,Mt),ot;if(tt===null){for(;!It.done;Mt++,It=pe.next())It=Ce(fe,It.value,we),It!==null&&(re=d(It,re,Mt),Pt===null?ot=It:Pt.sibling=It,Pt=It);return zt&&oa(fe,Mt),ot}for(tt=o(tt);!It.done;Mt++,It=pe.next())It=Se(tt,fe,Mt,It.value,we),It!==null&&(t&&It.alternate!==null&&tt.delete(It.key===null?Mt:It.key),re=d(It,re,Mt),Pt===null?ot=It:Pt.sibling=It,Pt=It);return t&&tt.forEach(function(Sb){return n(fe,Sb)}),zt&&oa(fe,Mt),ot}function Qt(fe,re,pe,we){if(typeof pe=="object"&&pe!==null&&pe.type===R&&pe.key===null&&(pe=pe.props.children),typeof pe=="object"&&pe!==null){switch(pe.$$typeof){case y:e:{for(var ot=pe.key;re!==null;){if(re.key===ot){if(ot=pe.type,ot===R){if(re.tag===7){a(fe,re.sibling),we=u(re,pe.props.children),we.return=fe,fe=we;break e}}else if(re.elementType===ot||typeof ot=="object"&&ot!==null&&ot.$$typeof===w&&Us(ot)===re.type){a(fe,re.sibling),we=u(re,pe.props),Do(we,pe),we.return=fe,fe=we;break e}a(fe,re);break}else n(fe,re);re=re.sibling}pe.type===R?(we=Rs(pe.props.children,fe.mode,we,pe.key),we.return=fe,fe=we):(we=Bl(pe.type,pe.key,pe.props,null,fe.mode,we),Do(we,pe),we.return=fe,fe=we)}return M(fe);case T:e:{for(ot=pe.key;re!==null;){if(re.key===ot)if(re.tag===4&&re.stateNode.containerInfo===pe.containerInfo&&re.stateNode.implementation===pe.implementation){a(fe,re.sibling),we=u(re,pe.children||[]),we.return=fe,fe=we;break e}else{a(fe,re);break}else n(fe,re);re=re.sibling}we=uf(pe,fe.mode,we),we.return=fe,fe=we}return M(fe);case w:return pe=Us(pe),Qt(fe,re,pe,we)}if(W(pe))return $e(fe,re,pe,we);if(Q(pe)){if(ot=Q(pe),typeof ot!="function")throw Error(s(150));return pe=ot.call(pe),ct(fe,re,pe,we)}if(typeof pe.then=="function")return Qt(fe,re,Wl(pe),we);if(pe.$$typeof===I)return Qt(fe,re,Gl(fe,pe),we);ql(fe,pe)}return typeof pe=="string"&&pe!==""||typeof pe=="number"||typeof pe=="bigint"?(pe=""+pe,re!==null&&re.tag===6?(a(fe,re.sibling),we=u(re,pe),we.return=fe,fe=we):(a(fe,re),we=cf(pe,fe.mode,we),we.return=fe,fe=we),M(fe)):a(fe,re)}return function(fe,re,pe,we){try{No=0;var ot=Qt(fe,re,pe,we);return vr=null,ot}catch(tt){if(tt===xr||tt===jl)throw tt;var Pt=ci(29,tt,null,fe.mode);return Pt.lanes=we,Pt.return=fe,Pt}finally{}}}var Ps=r0(!0),o0=r0(!1),ja=!1;function Sf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Mf(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Xa(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Wa(t,n,a){var o=t.updateQueue;if(o===null)return null;if(o=o.shared,(Bt&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=Fl(t),jm(t,null,a),n}return Il(t,o,n,a),Fl(t)}function zo(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,bi(t,a)}}function Ef(t,n){var a=t.updateQueue,o=t.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,d=null;if(a=a.firstBaseUpdate,a!==null){do{var M={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};d===null?u=d=M:d=d.next=M,a=a.next}while(a!==null);d===null?u=d=n:d=d.next=n}else u=d=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:d,shared:o.shared,callbacks:o.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var Tf=!1;function Lo(){if(Tf){var t=gr;if(t!==null)throw t}}function Uo(t,n,a,o){Tf=!1;var u=t.updateQueue;ja=!1;var d=u.firstBaseUpdate,M=u.lastBaseUpdate,P=u.shared.pending;if(P!==null){u.shared.pending=null;var $=P,me=$.next;$.next=null,M===null?d=me:M.next=me,M=$;var Te=t.alternate;Te!==null&&(Te=Te.updateQueue,P=Te.lastBaseUpdate,P!==M&&(P===null?Te.firstBaseUpdate=me:P.next=me,Te.lastBaseUpdate=$))}if(d!==null){var Ce=u.baseState;M=0,Te=me=$=null,P=d;do{var ye=P.lane&-536870913,Se=ye!==P.lane;if(Se?(Nt&ye)===ye:(o&ye)===ye){ye!==0&&ye===mr&&(Tf=!0),Te!==null&&(Te=Te.next={lane:0,tag:P.tag,payload:P.payload,callback:null,next:null});e:{var $e=t,ct=P;ye=n;var Qt=a;switch(ct.tag){case 1:if($e=ct.payload,typeof $e=="function"){Ce=$e.call(Qt,Ce,ye);break e}Ce=$e;break e;case 3:$e.flags=$e.flags&-65537|128;case 0:if($e=ct.payload,ye=typeof $e=="function"?$e.call(Qt,Ce,ye):$e,ye==null)break e;Ce=_({},Ce,ye);break e;case 2:ja=!0}}ye=P.callback,ye!==null&&(t.flags|=64,Se&&(t.flags|=8192),Se=u.callbacks,Se===null?u.callbacks=[ye]:Se.push(ye))}else Se={lane:ye,tag:P.tag,payload:P.payload,callback:P.callback,next:null},Te===null?(me=Te=Se,$=Ce):Te=Te.next=Se,M|=ye;if(P=P.next,P===null){if(P=u.shared.pending,P===null)break;Se=P,P=Se.next,Se.next=null,u.lastBaseUpdate=Se,u.shared.pending=null}}while(!0);Te===null&&($=Ce),u.baseState=$,u.firstBaseUpdate=me,u.lastBaseUpdate=Te,d===null&&(u.shared.lanes=0),Qa|=M,t.lanes=M,t.memoizedState=Ce}}function l0(t,n){if(typeof t!="function")throw Error(s(191,t));t.call(n)}function c0(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)l0(a[t],n)}var _r=B(null),Yl=B(0);function u0(t,n){t=va,ee(Yl,t),ee(_r,n),va=t|n.baseLanes}function Af(){ee(Yl,va),ee(_r,_r.current)}function wf(){va=Yl.current,Y(_r),Y(Yl)}var ui=B(null),wi=null;function qa(t){var n=t.alternate;ee(hn,hn.current&1),ee(ui,t),wi===null&&(n===null||_r.current!==null||n.memoizedState!==null)&&(wi=t)}function Cf(t){ee(hn,hn.current),ee(ui,t),wi===null&&(wi=t)}function f0(t){t.tag===22?(ee(hn,hn.current),ee(ui,t),wi===null&&(wi=t)):Ya()}function Ya(){ee(hn,hn.current),ee(ui,ui.current)}function fi(t){Y(ui),wi===t&&(wi=null),Y(hn)}var hn=B(0);function Zl(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Ud(a)||Od(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var ua=0,St=null,Zt=null,_n=null,Kl=!1,yr=!1,Is=!1,Ql=0,Oo=0,br=null,d1=0;function cn(){throw Error(s(321))}function Rf(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!li(t[a],n[a]))return!1;return!0}function Nf(t,n,a,o,u,d){return ua=d,St=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,D.H=t===null||t.memoizedState===null?Y0:Xf,Is=!1,d=a(o,u),Is=!1,yr&&(d=h0(n,a,o,u)),d0(t),d}function d0(t){D.H=Fo;var n=Zt!==null&&Zt.next!==null;if(ua=0,_n=Zt=St=null,Kl=!1,Oo=0,br=null,n)throw Error(s(300));t===null||yn||(t=t.dependencies,t!==null&&Hl(t)&&(yn=!0))}function h0(t,n,a,o){St=t;var u=0;do{if(yr&&(br=null),Oo=0,yr=!1,25<=u)throw Error(s(301));if(u+=1,_n=Zt=null,t.updateQueue!=null){var d=t.updateQueue;d.lastEffect=null,d.events=null,d.stores=null,d.memoCache!=null&&(d.memoCache.index=0)}D.H=Z0,d=n(a,o)}while(yr);return d}function h1(){var t=D.H,n=t.useState()[0];return n=typeof n.then=="function"?Po(n):n,t=t.useState()[0],(Zt!==null?Zt.memoizedState:null)!==t&&(St.flags|=1024),n}function Df(){var t=Ql!==0;return Ql=0,t}function zf(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function Lf(t){if(Kl){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}Kl=!1}ua=0,_n=Zt=St=null,yr=!1,Oo=Ql=0,br=null}function Xn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return _n===null?St.memoizedState=_n=t:_n=_n.next=t,_n}function pn(){if(Zt===null){var t=St.alternate;t=t!==null?t.memoizedState:null}else t=Zt.next;var n=_n===null?St.memoizedState:_n.next;if(n!==null)_n=n,Zt=t;else{if(t===null)throw St.alternate===null?Error(s(467)):Error(s(310));Zt=t,t={memoizedState:Zt.memoizedState,baseState:Zt.baseState,baseQueue:Zt.baseQueue,queue:Zt.queue,next:null},_n===null?St.memoizedState=_n=t:_n=_n.next=t}return _n}function Jl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Po(t){var n=Oo;return Oo+=1,br===null&&(br=[]),t=i0(br,t,n),n=St,(_n===null?n.memoizedState:_n.next)===null&&(n=n.alternate,D.H=n===null||n.memoizedState===null?Y0:Xf),t}function $l(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Po(t);if(t.$$typeof===I)return On(t)}throw Error(s(438,String(t)))}function Uf(t){var n=null,a=St.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=St.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Jl(),St.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),o=0;o<t;o++)a[o]=G;return n.index++,a}function fa(t,n){return typeof n=="function"?n(t):n}function ec(t){var n=pn();return Of(n,Zt,t)}function Of(t,n,a){var o=t.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=t.baseQueue,d=o.pending;if(d!==null){if(u!==null){var M=u.next;u.next=d.next,d.next=M}n.baseQueue=u=d,o.pending=null}if(d=t.baseState,u===null)t.memoizedState=d;else{n=u.next;var P=M=null,$=null,me=n,Te=!1;do{var Ce=me.lane&-536870913;if(Ce!==me.lane?(Nt&Ce)===Ce:(ua&Ce)===Ce){var ye=me.revertLane;if(ye===0)$!==null&&($=$.next={lane:0,revertLane:0,gesture:null,action:me.action,hasEagerState:me.hasEagerState,eagerState:me.eagerState,next:null}),Ce===mr&&(Te=!0);else if((ua&ye)===ye){me=me.next,ye===mr&&(Te=!0);continue}else Ce={lane:0,revertLane:me.revertLane,gesture:null,action:me.action,hasEagerState:me.hasEagerState,eagerState:me.eagerState,next:null},$===null?(P=$=Ce,M=d):$=$.next=Ce,St.lanes|=ye,Qa|=ye;Ce=me.action,Is&&a(d,Ce),d=me.hasEagerState?me.eagerState:a(d,Ce)}else ye={lane:Ce,revertLane:me.revertLane,gesture:me.gesture,action:me.action,hasEagerState:me.hasEagerState,eagerState:me.eagerState,next:null},$===null?(P=$=ye,M=d):$=$.next=ye,St.lanes|=Ce,Qa|=Ce;me=me.next}while(me!==null&&me!==n);if($===null?M=d:$.next=P,!li(d,t.memoizedState)&&(yn=!0,Te&&(a=gr,a!==null)))throw a;t.memoizedState=d,t.baseState=M,t.baseQueue=$,o.lastRenderedState=d}return u===null&&(o.lanes=0),[t.memoizedState,o.dispatch]}function Pf(t){var n=pn(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=t;var o=a.dispatch,u=a.pending,d=n.memoizedState;if(u!==null){a.pending=null;var M=u=u.next;do d=t(d,M.action),M=M.next;while(M!==u);li(d,n.memoizedState)||(yn=!0),n.memoizedState=d,n.baseQueue===null&&(n.baseState=d),a.lastRenderedState=d}return[d,o]}function p0(t,n,a){var o=St,u=pn(),d=zt;if(d){if(a===void 0)throw Error(s(407));a=a()}else a=n();var M=!li((Zt||u).memoizedState,a);if(M&&(u.memoizedState=a,yn=!0),u=u.queue,Bf(x0.bind(null,o,u,t),[t]),u.getSnapshot!==n||M||_n!==null&&_n.memoizedState.tag&1){if(o.flags|=2048,Sr(9,{destroy:void 0},g0.bind(null,o,u,a,n),null),en===null)throw Error(s(349));d||(ua&127)!==0||m0(o,n,a)}return a}function m0(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=St.updateQueue,n===null?(n=Jl(),St.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function g0(t,n,a,o){n.value=a,n.getSnapshot=o,v0(n)&&_0(t)}function x0(t,n,a){return a(function(){v0(n)&&_0(t)})}function v0(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!li(t,a)}catch{return!0}}function _0(t){var n=Cs(t,2);n!==null&&ei(n,t,2)}function If(t){var n=Xn();if(typeof t=="function"){var a=t;if(t=a(),Is){Le(!0);try{a()}finally{Le(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:fa,lastRenderedState:t},n}function y0(t,n,a,o){return t.baseState=a,Of(t,Zt,typeof o=="function"?o:fa)}function p1(t,n,a,o,u){if(ic(t))throw Error(s(485));if(t=n.action,t!==null){var d={payload:u,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(M){d.listeners.push(M)}};D.T!==null?a(!0):d.isTransition=!1,o(d),a=n.pending,a===null?(d.next=n.pending=d,b0(n,d)):(d.next=a.next,n.pending=a.next=d)}}function b0(t,n){var a=n.action,o=n.payload,u=t.state;if(n.isTransition){var d=D.T,M={};D.T=M;try{var P=a(u,o),$=D.S;$!==null&&$(M,P),S0(t,n,P)}catch(me){Ff(t,n,me)}finally{d!==null&&M.types!==null&&(d.types=M.types),D.T=d}}else try{d=a(u,o),S0(t,n,d)}catch(me){Ff(t,n,me)}}function S0(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){M0(t,n,o)},function(o){return Ff(t,n,o)}):M0(t,n,a)}function M0(t,n,a){n.status="fulfilled",n.value=a,E0(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,b0(t,a)))}function Ff(t,n,a){var o=t.pending;if(t.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,E0(n),n=n.next;while(n!==o)}t.action=null}function E0(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function T0(t,n){return n}function A0(t,n){if(zt){var a=en.formState;if(a!==null){e:{var o=St;if(zt){if(tn){t:{for(var u=tn,d=Ai;u.nodeType!==8;){if(!d){u=null;break t}if(u=Ci(u.nextSibling),u===null){u=null;break t}}d=u.data,u=d==="F!"||d==="F"?u:null}if(u){tn=Ci(u.nextSibling),o=u.data==="F!";break e}}Ga(o)}o=!1}o&&(n=a[0])}}return a=Xn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:T0,lastRenderedState:n},a.queue=o,a=X0.bind(null,St,o),o.dispatch=a,o=If(!1),d=jf.bind(null,St,!1,o.queue),o=Xn(),u={state:n,dispatch:null,action:t,pending:null},o.queue=u,a=p1.bind(null,St,u,d,a),u.dispatch=a,o.memoizedState=t,[n,a,!1]}function w0(t){var n=pn();return C0(n,Zt,t)}function C0(t,n,a){if(n=Of(t,n,T0)[0],t=ec(fa)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=Po(n)}catch(M){throw M===xr?jl:M}else o=n;n=pn();var u=n.queue,d=u.dispatch;return a!==n.memoizedState&&(St.flags|=2048,Sr(9,{destroy:void 0},m1.bind(null,u,a),null)),[o,d,t]}function m1(t,n){t.action=n}function R0(t){var n=pn(),a=Zt;if(a!==null)return C0(n,a,t);pn(),n=n.memoizedState,a=pn();var o=a.queue.dispatch;return a.memoizedState=t,[n,o,!1]}function Sr(t,n,a,o){return t={tag:t,create:a,deps:o,inst:n,next:null},n=St.updateQueue,n===null&&(n=Jl(),St.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(o=a.next,a.next=t,t.next=o,n.lastEffect=t),t}function N0(){return pn().memoizedState}function tc(t,n,a,o){var u=Xn();St.flags|=t,u.memoizedState=Sr(1|n,{destroy:void 0},a,o===void 0?null:o)}function nc(t,n,a,o){var u=pn();o=o===void 0?null:o;var d=u.memoizedState.inst;Zt!==null&&o!==null&&Rf(o,Zt.memoizedState.deps)?u.memoizedState=Sr(n,d,a,o):(St.flags|=t,u.memoizedState=Sr(1|n,d,a,o))}function D0(t,n){tc(8390656,8,t,n)}function Bf(t,n){nc(2048,8,t,n)}function g1(t){St.flags|=4;var n=St.updateQueue;if(n===null)n=Jl(),St.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function z0(t){var n=pn().memoizedState;return g1({ref:n,nextImpl:t}),function(){if((Bt&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function L0(t,n){return nc(4,2,t,n)}function U0(t,n){return nc(4,4,t,n)}function O0(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function P0(t,n,a){a=a!=null?a.concat([t]):null,nc(4,4,O0.bind(null,n,t),a)}function kf(){}function I0(t,n){var a=pn();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&Rf(n,o[1])?o[0]:(a.memoizedState=[t,n],t)}function F0(t,n){var a=pn();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&Rf(n,o[1]))return o[0];if(o=t(),Is){Le(!0);try{t()}finally{Le(!1)}}return a.memoizedState=[o,n],o}function Hf(t,n,a){return a===void 0||(ua&1073741824)!==0&&(Nt&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=Bg(),St.lanes|=t,Qa|=t,a)}function B0(t,n,a,o){return li(a,n)?a:_r.current!==null?(t=Hf(t,a,o),li(t,n)||(yn=!0),t):(ua&42)===0||(ua&1073741824)!==0&&(Nt&261930)===0?(yn=!0,t.memoizedState=a):(t=Bg(),St.lanes|=t,Qa|=t,n)}function k0(t,n,a,o,u){var d=k.p;k.p=d!==0&&8>d?d:8;var M=D.T,P={};D.T=P,jf(t,!1,n,a);try{var $=u(),me=D.S;if(me!==null&&me(P,$),$!==null&&typeof $=="object"&&typeof $.then=="function"){var Te=f1($,o);Io(t,n,Te,pi(t))}else Io(t,n,o,pi(t))}catch(Ce){Io(t,n,{then:function(){},status:"rejected",reason:Ce},pi())}finally{k.p=d,M!==null&&P.types!==null&&(M.types=P.types),D.T=M}}function x1(){}function Gf(t,n,a,o){if(t.tag!==5)throw Error(s(476));var u=H0(t).queue;k0(t,u,n,ie,a===null?x1:function(){return G0(t),a(o)})}function H0(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:ie,baseState:ie,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:fa,lastRenderedState:ie},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:fa,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function G0(t){var n=H0(t);n.next===null&&(n=t.alternate.memoizedState),Io(t,n.next.queue,{},pi())}function Vf(){return On(el)}function V0(){return pn().memoizedState}function j0(){return pn().memoizedState}function v1(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=pi();t=Xa(a);var o=Wa(n,t,a);o!==null&&(ei(o,n,a),zo(o,n,a)),n={cache:vf()},t.payload=n;return}n=n.return}}function _1(t,n,a){var o=pi();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},ic(t)?W0(n,a):(a=of(t,n,a,o),a!==null&&(ei(a,t,o),q0(a,n,o)))}function X0(t,n,a){var o=pi();Io(t,n,a,o)}function Io(t,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(ic(t))W0(n,u);else{var d=t.alternate;if(t.lanes===0&&(d===null||d.lanes===0)&&(d=n.lastRenderedReducer,d!==null))try{var M=n.lastRenderedState,P=d(M,a);if(u.hasEagerState=!0,u.eagerState=P,li(P,M))return Il(t,n,u,0),en===null&&Pl(),!1}catch{}finally{}if(a=of(t,n,u,o),a!==null)return ei(a,t,o),q0(a,n,o),!0}return!1}function jf(t,n,a,o){if(o={lane:2,revertLane:Sd(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},ic(t)){if(n)throw Error(s(479))}else n=of(t,a,o,2),n!==null&&ei(n,t,2)}function ic(t){var n=t.alternate;return t===St||n!==null&&n===St}function W0(t,n){yr=Kl=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function q0(t,n,a){if((a&4194048)!==0){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,bi(t,a)}}var Fo={readContext:On,use:$l,useCallback:cn,useContext:cn,useEffect:cn,useImperativeHandle:cn,useLayoutEffect:cn,useInsertionEffect:cn,useMemo:cn,useReducer:cn,useRef:cn,useState:cn,useDebugValue:cn,useDeferredValue:cn,useTransition:cn,useSyncExternalStore:cn,useId:cn,useHostTransitionStatus:cn,useFormState:cn,useActionState:cn,useOptimistic:cn,useMemoCache:cn,useCacheRefresh:cn};Fo.useEffectEvent=cn;var Y0={readContext:On,use:$l,useCallback:function(t,n){return Xn().memoizedState=[t,n===void 0?null:n],t},useContext:On,useEffect:D0,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,tc(4194308,4,O0.bind(null,n,t),a)},useLayoutEffect:function(t,n){return tc(4194308,4,t,n)},useInsertionEffect:function(t,n){tc(4,2,t,n)},useMemo:function(t,n){var a=Xn();n=n===void 0?null:n;var o=t();if(Is){Le(!0);try{t()}finally{Le(!1)}}return a.memoizedState=[o,n],o},useReducer:function(t,n,a){var o=Xn();if(a!==void 0){var u=a(n);if(Is){Le(!0);try{a(n)}finally{Le(!1)}}}else u=n;return o.memoizedState=o.baseState=u,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:u},o.queue=t,t=t.dispatch=_1.bind(null,St,t),[o.memoizedState,t]},useRef:function(t){var n=Xn();return t={current:t},n.memoizedState=t},useState:function(t){t=If(t);var n=t.queue,a=X0.bind(null,St,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:kf,useDeferredValue:function(t,n){var a=Xn();return Hf(a,t,n)},useTransition:function(){var t=If(!1);return t=k0.bind(null,St,t.queue,!0,!1),Xn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var o=St,u=Xn();if(zt){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),en===null)throw Error(s(349));(Nt&127)!==0||m0(o,n,a)}u.memoizedState=a;var d={value:a,getSnapshot:n};return u.queue=d,D0(x0.bind(null,o,d,t),[t]),o.flags|=2048,Sr(9,{destroy:void 0},g0.bind(null,o,d,a,n),null),a},useId:function(){var t=Xn(),n=en.identifierPrefix;if(zt){var a=ji,o=Vi;a=(o&~(1<<32-He(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Ql++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=d1++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:Vf,useFormState:A0,useActionState:A0,useOptimistic:function(t){var n=Xn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=jf.bind(null,St,!0,a),a.dispatch=n,[t,n]},useMemoCache:Uf,useCacheRefresh:function(){return Xn().memoizedState=v1.bind(null,St)},useEffectEvent:function(t){var n=Xn(),a={impl:t};return n.memoizedState=a,function(){if((Bt&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},Xf={readContext:On,use:$l,useCallback:I0,useContext:On,useEffect:Bf,useImperativeHandle:P0,useInsertionEffect:L0,useLayoutEffect:U0,useMemo:F0,useReducer:ec,useRef:N0,useState:function(){return ec(fa)},useDebugValue:kf,useDeferredValue:function(t,n){var a=pn();return B0(a,Zt.memoizedState,t,n)},useTransition:function(){var t=ec(fa)[0],n=pn().memoizedState;return[typeof t=="boolean"?t:Po(t),n]},useSyncExternalStore:p0,useId:V0,useHostTransitionStatus:Vf,useFormState:w0,useActionState:w0,useOptimistic:function(t,n){var a=pn();return y0(a,Zt,t,n)},useMemoCache:Uf,useCacheRefresh:j0};Xf.useEffectEvent=z0;var Z0={readContext:On,use:$l,useCallback:I0,useContext:On,useEffect:Bf,useImperativeHandle:P0,useInsertionEffect:L0,useLayoutEffect:U0,useMemo:F0,useReducer:Pf,useRef:N0,useState:function(){return Pf(fa)},useDebugValue:kf,useDeferredValue:function(t,n){var a=pn();return Zt===null?Hf(a,t,n):B0(a,Zt.memoizedState,t,n)},useTransition:function(){var t=Pf(fa)[0],n=pn().memoizedState;return[typeof t=="boolean"?t:Po(t),n]},useSyncExternalStore:p0,useId:V0,useHostTransitionStatus:Vf,useFormState:R0,useActionState:R0,useOptimistic:function(t,n){var a=pn();return Zt!==null?y0(a,Zt,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:Uf,useCacheRefresh:j0};Z0.useEffectEvent=z0;function Wf(t,n,a,o){n=t.memoizedState,a=a(o,n),a=a==null?n:_({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var qf={enqueueSetState:function(t,n,a){t=t._reactInternals;var o=pi(),u=Xa(o);u.payload=n,a!=null&&(u.callback=a),n=Wa(t,u,o),n!==null&&(ei(n,t,o),zo(n,t,o))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var o=pi(),u=Xa(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Wa(t,u,o),n!==null&&(ei(n,t,o),zo(n,t,o))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=pi(),o=Xa(a);o.tag=2,n!=null&&(o.callback=n),n=Wa(t,o,a),n!==null&&(ei(n,t,a),zo(n,t,a))}};function K0(t,n,a,o,u,d,M){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(o,d,M):n.prototype&&n.prototype.isPureReactComponent?!Eo(a,o)||!Eo(u,d):!0}function Q0(t,n,a,o){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==t&&qf.enqueueReplaceState(n,n.state,null)}function Fs(t,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(t=t.defaultProps){a===n&&(a=_({},a));for(var u in t)a[u]===void 0&&(a[u]=t[u])}return a}function J0(t){Ol(t)}function $0(t){console.error(t)}function eg(t){Ol(t)}function ac(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function tg(t,n,a){try{var o=t.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function Yf(t,n,a){return a=Xa(a),a.tag=3,a.payload={element:null},a.callback=function(){ac(t,n)},a}function ng(t){return t=Xa(t),t.tag=3,t}function ig(t,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var d=o.value;t.payload=function(){return u(d)},t.callback=function(){tg(n,a,o)}}var M=a.stateNode;M!==null&&typeof M.componentDidCatch=="function"&&(t.callback=function(){tg(n,a,o),typeof u!="function"&&(Ja===null?Ja=new Set([this]):Ja.add(this));var P=o.stack;this.componentDidCatch(o.value,{componentStack:P!==null?P:""})})}function y1(t,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&pr(n,a,u,!0),a=ui.current,a!==null){switch(a.tag){case 31:case 13:return wi===null?gc():a.alternate===null&&un===0&&(un=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===Xl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),_d(t,o,u)),!1;case 22:return a.flags|=65536,o===Xl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),_d(t,o,u)),!1}throw Error(s(435,a.tag))}return _d(t,o,u),gc(),!1}if(zt)return n=ui.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==hf&&(t=Error(s(422),{cause:o}),wo(Mi(t,a)))):(o!==hf&&(n=Error(s(423),{cause:o}),wo(Mi(n,a))),t=t.current.alternate,t.flags|=65536,u&=-u,t.lanes|=u,o=Mi(o,a),u=Yf(t.stateNode,o,u),Ef(t,u),un!==4&&(un=2)),!1;var d=Error(s(520),{cause:o});if(d=Mi(d,a),Wo===null?Wo=[d]:Wo.push(d),un!==4&&(un=2),n===null)return!0;o=Mi(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=u&-u,a.lanes|=t,t=Yf(a.stateNode,o,t),Ef(a,t),!1;case 1:if(n=a.type,d=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||d!==null&&typeof d.componentDidCatch=="function"&&(Ja===null||!Ja.has(d))))return a.flags|=65536,u&=-u,a.lanes|=u,u=ng(u),ig(u,t,a,o),Ef(a,u),!1}a=a.return}while(a!==null);return!1}var Zf=Error(s(461)),yn=!1;function Pn(t,n,a,o){n.child=t===null?o0(n,null,a,o):Ps(n,t.child,a,o)}function ag(t,n,a,o,u){a=a.render;var d=n.ref;if("ref"in o){var M={};for(var P in o)P!=="ref"&&(M[P]=o[P])}else M=o;return zs(n),o=Nf(t,n,a,M,d,u),P=Df(),t!==null&&!yn?(zf(t,n,u),da(t,n,u)):(zt&&P&&ff(n),n.flags|=1,Pn(t,n,o,u),n.child)}function sg(t,n,a,o,u){if(t===null){var d=a.type;return typeof d=="function"&&!lf(d)&&d.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=d,rg(t,n,d,o,u)):(t=Bl(a.type,null,o,n,n.mode,u),t.ref=n.ref,t.return=n,n.child=t)}if(d=t.child,!id(t,u)){var M=d.memoizedProps;if(a=a.compare,a=a!==null?a:Eo,a(M,o)&&t.ref===n.ref)return da(t,n,u)}return n.flags|=1,t=ra(d,o),t.ref=n.ref,t.return=n,n.child=t}function rg(t,n,a,o,u){if(t!==null){var d=t.memoizedProps;if(Eo(d,o)&&t.ref===n.ref)if(yn=!1,n.pendingProps=o=d,id(t,u))(t.flags&131072)!==0&&(yn=!0);else return n.lanes=t.lanes,da(t,n,u)}return Kf(t,n,a,o,u)}function og(t,n,a,o){var u=o.children,d=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(d=d!==null?d.baseLanes|a:a,t!==null){for(o=n.child=t.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~d}else o=0,n.child=null;return lg(t,n,d,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&Vl(n,d!==null?d.cachePool:null),d!==null?u0(n,d):Af(),f0(n);else return o=n.lanes=536870912,lg(t,n,d!==null?d.baseLanes|a:a,a,o)}else d!==null?(Vl(n,d.cachePool),u0(n,d),Ya(),n.memoizedState=null):(t!==null&&Vl(n,null),Af(),Ya());return Pn(t,n,u,a),n.child}function Bo(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function lg(t,n,a,o,u){var d=yf();return d=d===null?null:{parent:vn._currentValue,pool:d},n.memoizedState={baseLanes:a,cachePool:d},t!==null&&Vl(n,null),Af(),f0(n),t!==null&&pr(t,n,o,!0),n.childLanes=u,null}function sc(t,n){return n=oc({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function cg(t,n,a){return Ps(n,t.child,null,a),t=sc(n,n.pendingProps),t.flags|=2,fi(n),n.memoizedState=null,t}function b1(t,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(zt){if(o.mode==="hidden")return t=sc(n,o),n.lanes=536870912,Bo(null,t);if(Cf(n),(t=tn)?(t=bx(t,Ai),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:ka!==null?{id:Vi,overflow:ji}:null,retryLane:536870912,hydrationErrors:null},a=Wm(t),a.return=n,n.child=a,Un=n,tn=null)):t=null,t===null)throw Ga(n);return n.lanes=536870912,null}return sc(n,o)}var d=t.memoizedState;if(d!==null){var M=d.dehydrated;if(Cf(n),u)if(n.flags&256)n.flags&=-257,n=cg(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(s(558));else if(yn||pr(t,n,a,!1),u=(a&t.childLanes)!==0,yn||u){if(o=en,o!==null&&(M=si(o,a),M!==0&&M!==d.retryLane))throw d.retryLane=M,Cs(t,M),ei(o,t,M),Zf;gc(),n=cg(t,n,a)}else t=d.treeContext,tn=Ci(M.nextSibling),Un=n,zt=!0,Ha=null,Ai=!1,t!==null&&Zm(n,t),n=sc(n,o),n.flags|=4096;return n}return t=ra(t.child,{mode:o.mode,children:o.children}),t.ref=n.ref,n.child=t,t.return=n,t}function rc(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function Kf(t,n,a,o,u){return zs(n),a=Nf(t,n,a,o,void 0,u),o=Df(),t!==null&&!yn?(zf(t,n,u),da(t,n,u)):(zt&&o&&ff(n),n.flags|=1,Pn(t,n,a,u),n.child)}function ug(t,n,a,o,u,d){return zs(n),n.updateQueue=null,a=h0(n,o,a,u),d0(t),o=Df(),t!==null&&!yn?(zf(t,n,d),da(t,n,d)):(zt&&o&&ff(n),n.flags|=1,Pn(t,n,a,d),n.child)}function fg(t,n,a,o,u){if(zs(n),n.stateNode===null){var d=ur,M=a.contextType;typeof M=="object"&&M!==null&&(d=On(M)),d=new a(o,d),n.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,d.updater=qf,n.stateNode=d,d._reactInternals=n,d=n.stateNode,d.props=o,d.state=n.memoizedState,d.refs={},Sf(n),M=a.contextType,d.context=typeof M=="object"&&M!==null?On(M):ur,d.state=n.memoizedState,M=a.getDerivedStateFromProps,typeof M=="function"&&(Wf(n,a,M,o),d.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(M=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),M!==d.state&&qf.enqueueReplaceState(d,d.state,null),Uo(n,o,d,u),Lo(),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(t===null){d=n.stateNode;var P=n.memoizedProps,$=Fs(a,P);d.props=$;var me=d.context,Te=a.contextType;M=ur,typeof Te=="object"&&Te!==null&&(M=On(Te));var Ce=a.getDerivedStateFromProps;Te=typeof Ce=="function"||typeof d.getSnapshotBeforeUpdate=="function",P=n.pendingProps!==P,Te||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(P||me!==M)&&Q0(n,d,o,M),ja=!1;var ye=n.memoizedState;d.state=ye,Uo(n,o,d,u),Lo(),me=n.memoizedState,P||ye!==me||ja?(typeof Ce=="function"&&(Wf(n,a,Ce,o),me=n.memoizedState),($=ja||K0(n,a,$,o,ye,me,M))?(Te||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(n.flags|=4194308)):(typeof d.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=me),d.props=o,d.state=me,d.context=M,o=$):(typeof d.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{d=n.stateNode,Mf(t,n),M=n.memoizedProps,Te=Fs(a,M),d.props=Te,Ce=n.pendingProps,ye=d.context,me=a.contextType,$=ur,typeof me=="object"&&me!==null&&($=On(me)),P=a.getDerivedStateFromProps,(me=typeof P=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(M!==Ce||ye!==$)&&Q0(n,d,o,$),ja=!1,ye=n.memoizedState,d.state=ye,Uo(n,o,d,u),Lo();var Se=n.memoizedState;M!==Ce||ye!==Se||ja||t!==null&&t.dependencies!==null&&Hl(t.dependencies)?(typeof P=="function"&&(Wf(n,a,P,o),Se=n.memoizedState),(Te=ja||K0(n,a,Te,o,ye,Se,$)||t!==null&&t.dependencies!==null&&Hl(t.dependencies))?(me||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(o,Se,$),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(o,Se,$)),typeof d.componentDidUpdate=="function"&&(n.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof d.componentDidUpdate!="function"||M===t.memoizedProps&&ye===t.memoizedState||(n.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||M===t.memoizedProps&&ye===t.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=Se),d.props=o,d.state=Se,d.context=$,o=Te):(typeof d.componentDidUpdate!="function"||M===t.memoizedProps&&ye===t.memoizedState||(n.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||M===t.memoizedProps&&ye===t.memoizedState||(n.flags|=1024),o=!1)}return d=o,rc(t,n),o=(n.flags&128)!==0,d||o?(d=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:d.render(),n.flags|=1,t!==null&&o?(n.child=Ps(n,t.child,null,u),n.child=Ps(n,null,a,u)):Pn(t,n,a,u),n.memoizedState=d.state,t=n.child):t=da(t,n,u),t}function dg(t,n,a,o){return Ns(),n.flags|=256,Pn(t,n,a,o),n.child}var Qf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Jf(t){return{baseLanes:t,cachePool:t0()}}function $f(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=hi),t}function hg(t,n,a){var o=n.pendingProps,u=!1,d=(n.flags&128)!==0,M;if((M=d)||(M=t!==null&&t.memoizedState===null?!1:(hn.current&2)!==0),M&&(u=!0,n.flags&=-129),M=(n.flags&32)!==0,n.flags&=-33,t===null){if(zt){if(u?qa(n):Ya(),(t=tn)?(t=bx(t,Ai),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:ka!==null?{id:Vi,overflow:ji}:null,retryLane:536870912,hydrationErrors:null},a=Wm(t),a.return=n,n.child=a,Un=n,tn=null)):t=null,t===null)throw Ga(n);return Od(t)?n.lanes=32:n.lanes=536870912,null}var P=o.children;return o=o.fallback,u?(Ya(),u=n.mode,P=oc({mode:"hidden",children:P},u),o=Rs(o,u,a,null),P.return=n,o.return=n,P.sibling=o,n.child=P,o=n.child,o.memoizedState=Jf(a),o.childLanes=$f(t,M,a),n.memoizedState=Qf,Bo(null,o)):(qa(n),ed(n,P))}var $=t.memoizedState;if($!==null&&(P=$.dehydrated,P!==null)){if(d)n.flags&256?(qa(n),n.flags&=-257,n=td(t,n,a)):n.memoizedState!==null?(Ya(),n.child=t.child,n.flags|=128,n=null):(Ya(),P=o.fallback,u=n.mode,o=oc({mode:"visible",children:o.children},u),P=Rs(P,u,a,null),P.flags|=2,o.return=n,P.return=n,o.sibling=P,n.child=o,Ps(n,t.child,null,a),o=n.child,o.memoizedState=Jf(a),o.childLanes=$f(t,M,a),n.memoizedState=Qf,n=Bo(null,o));else if(qa(n),Od(P)){if(M=P.nextSibling&&P.nextSibling.dataset,M)var me=M.dgst;M=me,o=Error(s(419)),o.stack="",o.digest=M,wo({value:o,source:null,stack:null}),n=td(t,n,a)}else if(yn||pr(t,n,a,!1),M=(a&t.childLanes)!==0,yn||M){if(M=en,M!==null&&(o=si(M,a),o!==0&&o!==$.retryLane))throw $.retryLane=o,Cs(t,o),ei(M,t,o),Zf;Ud(P)||gc(),n=td(t,n,a)}else Ud(P)?(n.flags|=192,n.child=t.child,n=null):(t=$.treeContext,tn=Ci(P.nextSibling),Un=n,zt=!0,Ha=null,Ai=!1,t!==null&&Zm(n,t),n=ed(n,o.children),n.flags|=4096);return n}return u?(Ya(),P=o.fallback,u=n.mode,$=t.child,me=$.sibling,o=ra($,{mode:"hidden",children:o.children}),o.subtreeFlags=$.subtreeFlags&65011712,me!==null?P=ra(me,P):(P=Rs(P,u,a,null),P.flags|=2),P.return=n,o.return=n,o.sibling=P,n.child=o,Bo(null,o),o=n.child,P=t.child.memoizedState,P===null?P=Jf(a):(u=P.cachePool,u!==null?($=vn._currentValue,u=u.parent!==$?{parent:$,pool:$}:u):u=t0(),P={baseLanes:P.baseLanes|a,cachePool:u}),o.memoizedState=P,o.childLanes=$f(t,M,a),n.memoizedState=Qf,Bo(t.child,o)):(qa(n),a=t.child,t=a.sibling,a=ra(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,t!==null&&(M=n.deletions,M===null?(n.deletions=[t],n.flags|=16):M.push(t)),n.child=a,n.memoizedState=null,a)}function ed(t,n){return n=oc({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function oc(t,n){return t=ci(22,t,null,n),t.lanes=0,t}function td(t,n,a){return Ps(n,t.child,null,a),t=ed(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function pg(t,n,a){t.lanes|=n;var o=t.alternate;o!==null&&(o.lanes|=n),gf(t.return,n,a)}function nd(t,n,a,o,u,d){var M=t.memoizedState;M===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:d}:(M.isBackwards=n,M.rendering=null,M.renderingStartTime=0,M.last=o,M.tail=a,M.tailMode=u,M.treeForkCount=d)}function mg(t,n,a){var o=n.pendingProps,u=o.revealOrder,d=o.tail;o=o.children;var M=hn.current,P=(M&2)!==0;if(P?(M=M&1|2,n.flags|=128):M&=1,ee(hn,M),Pn(t,n,o,a),o=zt?Ao:0,!P&&t!==null&&(t.flags&128)!==0)e:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&pg(t,a,n);else if(t.tag===19)pg(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break e;for(;t.sibling===null;){if(t.return===null||t.return===n)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)t=a.alternate,t!==null&&Zl(t)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),nd(n,!1,u,a,d,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(t=u.alternate,t!==null&&Zl(t)===null){n.child=u;break}t=u.sibling,u.sibling=a,a=u,u=t}nd(n,!0,a,null,d,o);break;case"together":nd(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function da(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),Qa|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(pr(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(s(153));if(n.child!==null){for(t=n.child,a=ra(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=ra(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function id(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Hl(t)))}function S1(t,n,a){switch(n.tag){case 3:ne(n,n.stateNode.containerInfo),Va(n,vn,t.memoizedState.cache),Ns();break;case 27:case 5:Ee(n);break;case 4:ne(n,n.stateNode.containerInfo);break;case 10:Va(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Cf(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(qa(n),n.flags|=128,null):(a&n.child.childLanes)!==0?hg(t,n,a):(qa(n),t=da(t,n,a),t!==null?t.sibling:null);qa(n);break;case 19:var u=(t.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(pr(t,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return mg(t,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),ee(hn,hn.current),o)break;return null;case 22:return n.lanes=0,og(t,n,a,n.pendingProps);case 24:Va(n,vn,t.memoizedState.cache)}return da(t,n,a)}function gg(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)yn=!0;else{if(!id(t,a)&&(n.flags&128)===0)return yn=!1,S1(t,n,a);yn=(t.flags&131072)!==0}else yn=!1,zt&&(n.flags&1048576)!==0&&Ym(n,Ao,n.index);switch(n.lanes=0,n.tag){case 16:e:{var o=n.pendingProps;if(t=Us(n.elementType),n.type=t,typeof t=="function")lf(t)?(o=Fs(t,o),n.tag=1,n=fg(null,n,t,o,a)):(n.tag=0,n=Kf(null,n,t,o,a));else{if(t!=null){var u=t.$$typeof;if(u===F){n.tag=11,n=ag(null,n,t,o,a);break e}else if(u===j){n.tag=14,n=sg(null,n,t,o,a);break e}}throw n=ae(t)||t,Error(s(306,n,""))}}return n;case 0:return Kf(t,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=Fs(o,n.pendingProps),fg(t,n,o,u,a);case 3:e:{if(ne(n,n.stateNode.containerInfo),t===null)throw Error(s(387));o=n.pendingProps;var d=n.memoizedState;u=d.element,Mf(t,n),Uo(n,o,null,a);var M=n.memoizedState;if(o=M.cache,Va(n,vn,o),o!==d.cache&&xf(n,[vn],a,!0),Lo(),o=M.element,d.isDehydrated)if(d={element:o,isDehydrated:!1,cache:M.cache},n.updateQueue.baseState=d,n.memoizedState=d,n.flags&256){n=dg(t,n,o,a);break e}else if(o!==u){u=Mi(Error(s(424)),n),wo(u),n=dg(t,n,o,a);break e}else{switch(t=n.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(tn=Ci(t.firstChild),Un=n,zt=!0,Ha=null,Ai=!0,a=o0(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(Ns(),o===u){n=da(t,n,a);break e}Pn(t,n,o,a)}n=n.child}return n;case 26:return rc(t,n),t===null?(a=wx(n.type,null,n.pendingProps,null))?n.memoizedState=a:zt||(a=n.type,t=n.pendingProps,o=Mc(A.current).createElement(a),o[dn]=n,o[Ln]=t,In(o,a,t),xn(o),n.stateNode=o):n.memoizedState=wx(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return Ee(n),t===null&&zt&&(o=n.stateNode=Ex(n.type,n.pendingProps,A.current),Un=n,Ai=!0,u=tn,ns(n.type)?(Pd=u,tn=Ci(o.firstChild)):tn=u),Pn(t,n,n.pendingProps.children,a),rc(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&zt&&((u=o=tn)&&(o=J1(o,n.type,n.pendingProps,Ai),o!==null?(n.stateNode=o,Un=n,tn=Ci(o.firstChild),Ai=!1,u=!0):u=!1),u||Ga(n)),Ee(n),u=n.type,d=n.pendingProps,M=t!==null?t.memoizedProps:null,o=d.children,Dd(u,d)?o=null:M!==null&&Dd(u,M)&&(n.flags|=32),n.memoizedState!==null&&(u=Nf(t,n,h1,null,null,a),el._currentValue=u),rc(t,n),Pn(t,n,o,a),n.child;case 6:return t===null&&zt&&((t=a=tn)&&(a=$1(a,n.pendingProps,Ai),a!==null?(n.stateNode=a,Un=n,tn=null,t=!0):t=!1),t||Ga(n)),null;case 13:return hg(t,n,a);case 4:return ne(n,n.stateNode.containerInfo),o=n.pendingProps,t===null?n.child=Ps(n,null,o,a):Pn(t,n,o,a),n.child;case 11:return ag(t,n,n.type,n.pendingProps,a);case 7:return Pn(t,n,n.pendingProps,a),n.child;case 8:return Pn(t,n,n.pendingProps.children,a),n.child;case 12:return Pn(t,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,Va(n,n.type,o.value),Pn(t,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,zs(n),u=On(u),o=o(u),n.flags|=1,Pn(t,n,o,a),n.child;case 14:return sg(t,n,n.type,n.pendingProps,a);case 15:return rg(t,n,n.type,n.pendingProps,a);case 19:return mg(t,n,a);case 31:return b1(t,n,a);case 22:return og(t,n,a,n.pendingProps);case 24:return zs(n),o=On(vn),t===null?(u=yf(),u===null&&(u=en,d=vf(),u.pooledCache=d,d.refCount++,d!==null&&(u.pooledCacheLanes|=a),u=d),n.memoizedState={parent:o,cache:u},Sf(n),Va(n,vn,u)):((t.lanes&a)!==0&&(Mf(t,n),Uo(n,null,null,a),Lo()),u=t.memoizedState,d=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Va(n,vn,o)):(o=d.cache,Va(n,vn,o),o!==u.cache&&xf(n,[vn],a,!0))),Pn(t,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function ha(t){t.flags|=4}function ad(t,n,a,o,u){if((n=(t.mode&32)!==0)&&(n=!1),n){if(t.flags|=16777216,(u&335544128)===u)if(t.stateNode.complete)t.flags|=8192;else if(Vg())t.flags|=8192;else throw Os=Xl,bf}else t.flags&=-16777217}function xg(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!zx(n))if(Vg())t.flags|=8192;else throw Os=Xl,bf}function lc(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?De():536870912,t.lanes|=n,Ar|=n)}function ko(t,n){if(!zt)switch(t.tailMode){case"hidden":n=t.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:o.sibling=null}}function nn(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,o=0;if(n)for(var u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=t,u=u.sibling;else for(u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=t,u=u.sibling;return t.subtreeFlags|=o,t.childLanes=a,n}function M1(t,n,a){var o=n.pendingProps;switch(df(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return nn(n),null;case 1:return nn(n),null;case 3:return a=n.stateNode,o=null,t!==null&&(o=t.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),ca(vn),L(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(hr(n)?ha(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,pf())),nn(n),null;case 26:var u=n.type,d=n.memoizedState;return t===null?(ha(n),d!==null?(nn(n),xg(n,d)):(nn(n),ad(n,u,null,o,a))):d?d!==t.memoizedState?(ha(n),nn(n),xg(n,d)):(nn(n),n.flags&=-16777217):(t=t.memoizedProps,t!==o&&ha(n),nn(n),ad(n,u,t,o,a)),null;case 27:if(Re(n),a=A.current,u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&ha(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return nn(n),null}t=ve.current,hr(n)?Km(n):(t=Ex(u,o,a),n.stateNode=t,ha(n))}return nn(n),null;case 5:if(Re(n),u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&ha(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return nn(n),null}if(d=ve.current,hr(n))Km(n);else{var M=Mc(A.current);switch(d){case 1:d=M.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:d=M.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":d=M.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":d=M.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":d=M.createElement("div"),d.innerHTML="<script><\/script>",d=d.removeChild(d.firstChild);break;case"select":d=typeof o.is=="string"?M.createElement("select",{is:o.is}):M.createElement("select"),o.multiple?d.multiple=!0:o.size&&(d.size=o.size);break;default:d=typeof o.is=="string"?M.createElement(u,{is:o.is}):M.createElement(u)}}d[dn]=n,d[Ln]=o;e:for(M=n.child;M!==null;){if(M.tag===5||M.tag===6)d.appendChild(M.stateNode);else if(M.tag!==4&&M.tag!==27&&M.child!==null){M.child.return=M,M=M.child;continue}if(M===n)break e;for(;M.sibling===null;){if(M.return===null||M.return===n)break e;M=M.return}M.sibling.return=M.return,M=M.sibling}n.stateNode=d;e:switch(In(d,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&ha(n)}}return nn(n),ad(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==o&&ha(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(t=A.current,hr(n)){if(t=n.stateNode,a=n.memoizedProps,o=null,u=Un,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}t[dn]=n,t=!!(t.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||hx(t.nodeValue,a)),t||Ga(n,!0)}else t=Mc(t).createTextNode(o),t[dn]=n,n.stateNode=t}return nn(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(o=hr(n),a!==null){if(t===null){if(!o)throw Error(s(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(557));t[dn]=n}else Ns(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;nn(n),t=!1}else a=pf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(fi(n),n):(fi(n),null);if((n.flags&128)!==0)throw Error(s(558))}return nn(n),null;case 13:if(o=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(u=hr(n),o!==null&&o.dehydrated!==null){if(t===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[dn]=n}else Ns(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;nn(n),u=!1}else u=pf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(fi(n),n):(fi(n),null)}return fi(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,t=t!==null&&t.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),d=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(d=o.memoizedState.cachePool.pool),d!==u&&(o.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),lc(n,n.updateQueue),nn(n),null);case 4:return L(),t===null&&Ad(n.stateNode.containerInfo),nn(n),null;case 10:return ca(n.type),nn(n),null;case 19:if(Y(hn),o=n.memoizedState,o===null)return nn(n),null;if(u=(n.flags&128)!==0,d=o.rendering,d===null)if(u)ko(o,!1);else{if(un!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(d=Zl(t),d!==null){for(n.flags|=128,ko(o,!1),t=d.updateQueue,n.updateQueue=t,lc(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)Xm(a,t),a=a.sibling;return ee(hn,hn.current&1|2),zt&&oa(n,o.treeForkCount),n.child}t=t.sibling}o.tail!==null&&Pe()>hc&&(n.flags|=128,u=!0,ko(o,!1),n.lanes=4194304)}else{if(!u)if(t=Zl(d),t!==null){if(n.flags|=128,u=!0,t=t.updateQueue,n.updateQueue=t,lc(n,t),ko(o,!0),o.tail===null&&o.tailMode==="hidden"&&!d.alternate&&!zt)return nn(n),null}else 2*Pe()-o.renderingStartTime>hc&&a!==536870912&&(n.flags|=128,u=!0,ko(o,!1),n.lanes=4194304);o.isBackwards?(d.sibling=n.child,n.child=d):(t=o.last,t!==null?t.sibling=d:n.child=d,o.last=d)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=Pe(),t.sibling=null,a=hn.current,ee(hn,u?a&1|2:a&1),zt&&oa(n,o.treeForkCount),t):(nn(n),null);case 22:case 23:return fi(n),wf(),o=n.memoizedState!==null,t!==null?t.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(nn(n),n.subtreeFlags&6&&(n.flags|=8192)):nn(n),a=n.updateQueue,a!==null&&lc(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),t!==null&&Y(Ls),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),ca(vn),nn(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function E1(t,n){switch(df(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return ca(vn),L(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return Re(n),null;case 31:if(n.memoizedState!==null){if(fi(n),n.alternate===null)throw Error(s(340));Ns()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(fi(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(s(340));Ns()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return Y(hn),null;case 4:return L(),null;case 10:return ca(n.type),null;case 22:case 23:return fi(n),wf(),t!==null&&Y(Ls),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return ca(vn),null;case 25:return null;default:return null}}function vg(t,n){switch(df(n),n.tag){case 3:ca(vn),L();break;case 26:case 27:case 5:Re(n);break;case 4:L();break;case 31:n.memoizedState!==null&&fi(n);break;case 13:fi(n);break;case 19:Y(hn);break;case 10:ca(n.type);break;case 22:case 23:fi(n),wf(),t!==null&&Y(Ls);break;case 24:ca(vn)}}function Ho(t,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&t)===t){o=void 0;var d=a.create,M=a.inst;o=d(),M.destroy=o}a=a.next}while(a!==u)}}catch(P){qt(n,n.return,P)}}function Za(t,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var d=u.next;o=d;do{if((o.tag&t)===t){var M=o.inst,P=M.destroy;if(P!==void 0){M.destroy=void 0,u=n;var $=a,me=P;try{me()}catch(Te){qt(u,$,Te)}}}o=o.next}while(o!==d)}}catch(Te){qt(n,n.return,Te)}}function _g(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{c0(n,a)}catch(o){qt(t,t.return,o)}}}function yg(t,n,a){a.props=Fs(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(o){qt(t,n,o)}}function Go(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var o=t.stateNode;break;case 30:o=t.stateNode;break;default:o=t.stateNode}typeof a=="function"?t.refCleanup=a(o):a.current=o}}catch(u){qt(t,n,u)}}function Xi(t,n){var a=t.ref,o=t.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){qt(t,n,u)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){qt(t,n,u)}else a.current=null}function bg(t){var n=t.type,a=t.memoizedProps,o=t.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break e;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){qt(t,t.return,u)}}function sd(t,n,a){try{var o=t.stateNode;W1(o,t.type,a,n),o[Ln]=n}catch(u){qt(t,t.return,u)}}function Sg(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&ns(t.type)||t.tag===4}function rd(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Sg(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&ns(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function od(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(t),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=aa));else if(o!==4&&(o===27&&ns(t.type)&&(a=t.stateNode,n=null),t=t.child,t!==null))for(od(t,n,a),t=t.sibling;t!==null;)od(t,n,a),t=t.sibling}function cc(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?a.insertBefore(t,n):a.appendChild(t);else if(o!==4&&(o===27&&ns(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(cc(t,n,a),t=t.sibling;t!==null;)cc(t,n,a),t=t.sibling}function Mg(t){var n=t.stateNode,a=t.memoizedProps;try{for(var o=t.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);In(n,o,a),n[dn]=t,n[Ln]=a}catch(d){qt(t,t.return,d)}}var pa=!1,bn=!1,ld=!1,Eg=typeof WeakSet=="function"?WeakSet:Set,Nn=null;function T1(t,n){if(t=t.containerInfo,Rd=Nc,t=Pm(t),ef(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,d=o.focusNode;o=o.focusOffset;try{a.nodeType,d.nodeType}catch{a=null;break e}var M=0,P=-1,$=-1,me=0,Te=0,Ce=t,ye=null;t:for(;;){for(var Se;Ce!==a||u!==0&&Ce.nodeType!==3||(P=M+u),Ce!==d||o!==0&&Ce.nodeType!==3||($=M+o),Ce.nodeType===3&&(M+=Ce.nodeValue.length),(Se=Ce.firstChild)!==null;)ye=Ce,Ce=Se;for(;;){if(Ce===t)break t;if(ye===a&&++me===u&&(P=M),ye===d&&++Te===o&&($=M),(Se=Ce.nextSibling)!==null)break;Ce=ye,ye=Ce.parentNode}Ce=Se}a=P===-1||$===-1?null:{start:P,end:$}}else a=null}a=a||{start:0,end:0}}else a=null;for(Nd={focusedElem:t,selectionRange:a},Nc=!1,Nn=n;Nn!==null;)if(n=Nn,t=n.child,(n.subtreeFlags&1028)!==0&&t!==null)t.return=n,Nn=t;else for(;Nn!==null;){switch(n=Nn,d=n.alternate,t=n.flags,n.tag){case 0:if((t&4)!==0&&(t=n.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)u=t[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&d!==null){t=void 0,a=n,u=d.memoizedProps,d=d.memoizedState,o=a.stateNode;try{var $e=Fs(a.type,u);t=o.getSnapshotBeforeUpdate($e,d),o.__reactInternalSnapshotBeforeUpdate=t}catch(ct){qt(a,a.return,ct)}}break;case 3:if((t&1024)!==0){if(t=n.stateNode.containerInfo,a=t.nodeType,a===9)Ld(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":Ld(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(s(163))}if(t=n.sibling,t!==null){t.return=n.return,Nn=t;break}Nn=n.return}}function Tg(t,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:ga(t,a),o&4&&Ho(5,a);break;case 1:if(ga(t,a),o&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(M){qt(a,a.return,M)}else{var u=Fs(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(u,n,t.__reactInternalSnapshotBeforeUpdate)}catch(M){qt(a,a.return,M)}}o&64&&_g(a),o&512&&Go(a,a.return);break;case 3:if(ga(t,a),o&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{c0(t,n)}catch(M){qt(a,a.return,M)}}break;case 27:n===null&&o&4&&Mg(a);case 26:case 5:ga(t,a),n===null&&o&4&&bg(a),o&512&&Go(a,a.return);break;case 12:ga(t,a);break;case 31:ga(t,a),o&4&&Cg(t,a);break;case 13:ga(t,a),o&4&&Rg(t,a),o&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=U1.bind(null,a),eb(t,a))));break;case 22:if(o=a.memoizedState!==null||pa,!o){n=n!==null&&n.memoizedState!==null||bn,u=pa;var d=bn;pa=o,(bn=n)&&!d?xa(t,a,(a.subtreeFlags&8772)!==0):ga(t,a),pa=u,bn=d}break;case 30:break;default:ga(t,a)}}function Ag(t){var n=t.alternate;n!==null&&(t.alternate=null,Ag(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&go(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var rn=null,Kn=!1;function ma(t,n,a){for(a=a.child;a!==null;)wg(t,n,a),a=a.sibling}function wg(t,n,a){if(be&&typeof be.onCommitFiberUnmount=="function")try{be.onCommitFiberUnmount(de,a)}catch{}switch(a.tag){case 26:bn||Xi(a,n),ma(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:bn||Xi(a,n);var o=rn,u=Kn;ns(a.type)&&(rn=a.stateNode,Kn=!1),ma(t,n,a),Qo(a.stateNode),rn=o,Kn=u;break;case 5:bn||Xi(a,n);case 6:if(o=rn,u=Kn,rn=null,ma(t,n,a),rn=o,Kn=u,rn!==null)if(Kn)try{(rn.nodeType===9?rn.body:rn.nodeName==="HTML"?rn.ownerDocument.body:rn).removeChild(a.stateNode)}catch(d){qt(a,n,d)}else try{rn.removeChild(a.stateNode)}catch(d){qt(a,n,d)}break;case 18:rn!==null&&(Kn?(t=rn,_x(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),Ur(t)):_x(rn,a.stateNode));break;case 4:o=rn,u=Kn,rn=a.stateNode.containerInfo,Kn=!0,ma(t,n,a),rn=o,Kn=u;break;case 0:case 11:case 14:case 15:Za(2,a,n),bn||Za(4,a,n),ma(t,n,a);break;case 1:bn||(Xi(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&yg(a,n,o)),ma(t,n,a);break;case 21:ma(t,n,a);break;case 22:bn=(o=bn)||a.memoizedState!==null,ma(t,n,a),bn=o;break;default:ma(t,n,a)}}function Cg(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Ur(t)}catch(a){qt(n,n.return,a)}}}function Rg(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Ur(t)}catch(a){qt(n,n.return,a)}}function A1(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new Eg),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new Eg),n;default:throw Error(s(435,t.tag))}}function uc(t,n){var a=A1(t);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=O1.bind(null,t,o);o.then(u,u)}})}function Qn(t,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],d=t,M=n,P=M;e:for(;P!==null;){switch(P.tag){case 27:if(ns(P.type)){rn=P.stateNode,Kn=!1;break e}break;case 5:rn=P.stateNode,Kn=!1;break e;case 3:case 4:rn=P.stateNode.containerInfo,Kn=!0;break e}P=P.return}if(rn===null)throw Error(s(160));wg(d,M,u),rn=null,Kn=!1,d=u.alternate,d!==null&&(d.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)Ng(n,t),n=n.sibling}var Oi=null;function Ng(t,n){var a=t.alternate,o=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Qn(n,t),Jn(t),o&4&&(Za(3,t,t.return),Ho(3,t),Za(5,t,t.return));break;case 1:Qn(n,t),Jn(t),o&512&&(bn||a===null||Xi(a,a.return)),o&64&&pa&&(t=t.updateQueue,t!==null&&(o=t.callbacks,o!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=Oi;if(Qn(n,t),Jn(t),o&512&&(bn||a===null||Xi(a,a.return)),o&4){var d=a!==null?a.memoizedState:null;if(o=t.memoizedState,a===null)if(o===null)if(t.stateNode===null){e:{o=t.type,a=t.memoizedProps,u=u.ownerDocument||u;t:switch(o){case"title":d=u.getElementsByTagName("title")[0],(!d||d[Ua]||d[dn]||d.namespaceURI==="http://www.w3.org/2000/svg"||d.hasAttribute("itemprop"))&&(d=u.createElement(o),u.head.insertBefore(d,u.querySelector("head > title"))),In(d,o,a),d[dn]=t,xn(d),o=d;break e;case"link":var M=Nx("link","href",u).get(o+(a.href||""));if(M){for(var P=0;P<M.length;P++)if(d=M[P],d.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&d.getAttribute("rel")===(a.rel==null?null:a.rel)&&d.getAttribute("title")===(a.title==null?null:a.title)&&d.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){M.splice(P,1);break t}}d=u.createElement(o),In(d,o,a),u.head.appendChild(d);break;case"meta":if(M=Nx("meta","content",u).get(o+(a.content||""))){for(P=0;P<M.length;P++)if(d=M[P],d.getAttribute("content")===(a.content==null?null:""+a.content)&&d.getAttribute("name")===(a.name==null?null:a.name)&&d.getAttribute("property")===(a.property==null?null:a.property)&&d.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&d.getAttribute("charset")===(a.charSet==null?null:a.charSet)){M.splice(P,1);break t}}d=u.createElement(o),In(d,o,a),u.head.appendChild(d);break;default:throw Error(s(468,o))}d[dn]=t,xn(d),o=d}t.stateNode=o}else Dx(u,t.type,t.stateNode);else t.stateNode=Rx(u,o,t.memoizedProps);else d!==o?(d===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):d.count--,o===null?Dx(u,t.type,t.stateNode):Rx(u,o,t.memoizedProps)):o===null&&t.stateNode!==null&&sd(t,t.memoizedProps,a.memoizedProps)}break;case 27:Qn(n,t),Jn(t),o&512&&(bn||a===null||Xi(a,a.return)),a!==null&&o&4&&sd(t,t.memoizedProps,a.memoizedProps);break;case 5:if(Qn(n,t),Jn(t),o&512&&(bn||a===null||Xi(a,a.return)),t.flags&32){u=t.stateNode;try{oi(u,"")}catch($e){qt(t,t.return,$e)}}o&4&&t.stateNode!=null&&(u=t.memoizedProps,sd(t,u,a!==null?a.memoizedProps:u)),o&1024&&(ld=!0);break;case 6:if(Qn(n,t),Jn(t),o&4){if(t.stateNode===null)throw Error(s(162));o=t.memoizedProps,a=t.stateNode;try{a.nodeValue=o}catch($e){qt(t,t.return,$e)}}break;case 3:if(Ac=null,u=Oi,Oi=Ec(n.containerInfo),Qn(n,t),Oi=u,Jn(t),o&4&&a!==null&&a.memoizedState.isDehydrated)try{Ur(n.containerInfo)}catch($e){qt(t,t.return,$e)}ld&&(ld=!1,Dg(t));break;case 4:o=Oi,Oi=Ec(t.stateNode.containerInfo),Qn(n,t),Jn(t),Oi=o;break;case 12:Qn(n,t),Jn(t);break;case 31:Qn(n,t),Jn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,uc(t,o)));break;case 13:Qn(n,t),Jn(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(dc=Pe()),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,uc(t,o)));break;case 22:u=t.memoizedState!==null;var $=a!==null&&a.memoizedState!==null,me=pa,Te=bn;if(pa=me||u,bn=Te||$,Qn(n,t),bn=Te,pa=me,Jn(t),o&8192)e:for(n=t.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||$||pa||bn||Bs(t)),a=null,n=t;;){if(n.tag===5||n.tag===26){if(a===null){$=a=n;try{if(d=$.stateNode,u)M=d.style,typeof M.setProperty=="function"?M.setProperty("display","none","important"):M.display="none";else{P=$.stateNode;var Ce=$.memoizedProps.style,ye=Ce!=null&&Ce.hasOwnProperty("display")?Ce.display:null;P.style.display=ye==null||typeof ye=="boolean"?"":(""+ye).trim()}}catch($e){qt($,$.return,$e)}}}else if(n.tag===6){if(a===null){$=n;try{$.stateNode.nodeValue=u?"":$.memoizedProps}catch($e){qt($,$.return,$e)}}}else if(n.tag===18){if(a===null){$=n;try{var Se=$.stateNode;u?yx(Se,!0):yx($.stateNode,!1)}catch($e){qt($,$.return,$e)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break e;for(;n.sibling===null;){if(n.return===null||n.return===t)break e;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=t.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,uc(t,a))));break;case 19:Qn(n,t),Jn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,uc(t,o)));break;case 30:break;case 21:break;default:Qn(n,t),Jn(t)}}function Jn(t){var n=t.flags;if(n&2){try{for(var a,o=t.return;o!==null;){if(Sg(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,d=rd(t);cc(t,d,u);break;case 5:var M=a.stateNode;a.flags&32&&(oi(M,""),a.flags&=-33);var P=rd(t);cc(t,P,M);break;case 3:case 4:var $=a.stateNode.containerInfo,me=rd(t);od(t,me,$);break;default:throw Error(s(161))}}catch(Te){qt(t,t.return,Te)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function Dg(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;Dg(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),t=t.sibling}}function ga(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Tg(t,n.alternate,n),n=n.sibling}function Bs(t){for(t=t.child;t!==null;){var n=t;switch(n.tag){case 0:case 11:case 14:case 15:Za(4,n,n.return),Bs(n);break;case 1:Xi(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&yg(n,n.return,a),Bs(n);break;case 27:Qo(n.stateNode);case 26:case 5:Xi(n,n.return),Bs(n);break;case 22:n.memoizedState===null&&Bs(n);break;case 30:Bs(n);break;default:Bs(n)}t=t.sibling}}function xa(t,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=t,d=n,M=d.flags;switch(d.tag){case 0:case 11:case 15:xa(u,d,a),Ho(4,d);break;case 1:if(xa(u,d,a),o=d,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(me){qt(o,o.return,me)}if(o=d,u=o.updateQueue,u!==null){var P=o.stateNode;try{var $=u.shared.hiddenCallbacks;if($!==null)for(u.shared.hiddenCallbacks=null,u=0;u<$.length;u++)l0($[u],P)}catch(me){qt(o,o.return,me)}}a&&M&64&&_g(d),Go(d,d.return);break;case 27:Mg(d);case 26:case 5:xa(u,d,a),a&&o===null&&M&4&&bg(d),Go(d,d.return);break;case 12:xa(u,d,a);break;case 31:xa(u,d,a),a&&M&4&&Cg(u,d);break;case 13:xa(u,d,a),a&&M&4&&Rg(u,d);break;case 22:d.memoizedState===null&&xa(u,d,a),Go(d,d.return);break;case 30:break;default:xa(u,d,a)}n=n.sibling}}function cd(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&Co(a))}function ud(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&Co(t))}function Pi(t,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)zg(t,n,a,o),n=n.sibling}function zg(t,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:Pi(t,n,a,o),u&2048&&Ho(9,n);break;case 1:Pi(t,n,a,o);break;case 3:Pi(t,n,a,o),u&2048&&(t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&Co(t)));break;case 12:if(u&2048){Pi(t,n,a,o),t=n.stateNode;try{var d=n.memoizedProps,M=d.id,P=d.onPostCommit;typeof P=="function"&&P(M,n.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch($){qt(n,n.return,$)}}else Pi(t,n,a,o);break;case 31:Pi(t,n,a,o);break;case 13:Pi(t,n,a,o);break;case 23:break;case 22:d=n.stateNode,M=n.alternate,n.memoizedState!==null?d._visibility&2?Pi(t,n,a,o):Vo(t,n):d._visibility&2?Pi(t,n,a,o):(d._visibility|=2,Mr(t,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&cd(M,n);break;case 24:Pi(t,n,a,o),u&2048&&ud(n.alternate,n);break;default:Pi(t,n,a,o)}}function Mr(t,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var d=t,M=n,P=a,$=o,me=M.flags;switch(M.tag){case 0:case 11:case 15:Mr(d,M,P,$,u),Ho(8,M);break;case 23:break;case 22:var Te=M.stateNode;M.memoizedState!==null?Te._visibility&2?Mr(d,M,P,$,u):Vo(d,M):(Te._visibility|=2,Mr(d,M,P,$,u)),u&&me&2048&&cd(M.alternate,M);break;case 24:Mr(d,M,P,$,u),u&&me&2048&&ud(M.alternate,M);break;default:Mr(d,M,P,$,u)}n=n.sibling}}function Vo(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,o=n,u=o.flags;switch(o.tag){case 22:Vo(a,o),u&2048&&cd(o.alternate,o);break;case 24:Vo(a,o),u&2048&&ud(o.alternate,o);break;default:Vo(a,o)}n=n.sibling}}var jo=8192;function Er(t,n,a){if(t.subtreeFlags&jo)for(t=t.child;t!==null;)Lg(t,n,a),t=t.sibling}function Lg(t,n,a){switch(t.tag){case 26:Er(t,n,a),t.flags&jo&&t.memoizedState!==null&&db(a,Oi,t.memoizedState,t.memoizedProps);break;case 5:Er(t,n,a);break;case 3:case 4:var o=Oi;Oi=Ec(t.stateNode.containerInfo),Er(t,n,a),Oi=o;break;case 22:t.memoizedState===null&&(o=t.alternate,o!==null&&o.memoizedState!==null?(o=jo,jo=16777216,Er(t,n,a),jo=o):Er(t,n,a));break;default:Er(t,n,a)}}function Ug(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function Xo(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];Nn=o,Pg(o,t)}Ug(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Og(t),t=t.sibling}function Og(t){switch(t.tag){case 0:case 11:case 15:Xo(t),t.flags&2048&&Za(9,t,t.return);break;case 3:Xo(t);break;case 12:Xo(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,fc(t)):Xo(t);break;default:Xo(t)}}function fc(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];Nn=o,Pg(o,t)}Ug(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:Za(8,n,n.return),fc(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,fc(n));break;default:fc(n)}t=t.sibling}}function Pg(t,n){for(;Nn!==null;){var a=Nn;switch(a.tag){case 0:case 11:case 15:Za(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:Co(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,Nn=o;else e:for(a=t;Nn!==null;){o=Nn;var u=o.sibling,d=o.return;if(Ag(o),o===a){Nn=null;break e}if(u!==null){u.return=d,Nn=u;break e}Nn=d}}}var w1={getCacheForType:function(t){var n=On(vn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return On(vn).controller.signal}},C1=typeof WeakMap=="function"?WeakMap:Map,Bt=0,en=null,Ct=null,Nt=0,Wt=0,di=null,Ka=!1,Tr=!1,fd=!1,va=0,un=0,Qa=0,ks=0,dd=0,hi=0,Ar=0,Wo=null,$n=null,hd=!1,dc=0,Ig=0,hc=1/0,pc=null,Ja=null,An=0,$a=null,wr=null,_a=0,pd=0,md=null,Fg=null,qo=0,gd=null;function pi(){return(Bt&2)!==0&&Nt!==0?Nt&-Nt:D.T!==null?Sd():ho()}function Bg(){if(hi===0)if((Nt&536870912)===0||zt){var t=xt;xt<<=1,(xt&3932160)===0&&(xt=262144),hi=t}else hi=536870912;return t=ui.current,t!==null&&(t.flags|=32),hi}function ei(t,n,a){(t===en&&(Wt===2||Wt===9)||t.cancelPendingCommit!==null)&&(Cr(t,0),es(t,Nt,hi,!1)),dt(t,a),((Bt&2)===0||t!==en)&&(t===en&&((Bt&2)===0&&(ks|=a),un===4&&es(t,Nt,hi,!1)),Wi(t))}function kg(t,n,a){if((Bt&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&t.expiredLanes)===0||Xe(t,n),u=o?D1(t,n):vd(t,n,!0),d=o;do{if(u===0){Tr&&!o&&es(t,n,0,!1);break}else{if(a=t.current.alternate,d&&!R1(a)){u=vd(t,n,!1),d=!1;continue}if(u===2){if(d=n,t.errorRecoveryDisabledLanes&d)var M=0;else M=t.pendingLanes&-536870913,M=M!==0?M:M&536870912?536870912:0;if(M!==0){n=M;e:{var P=t;u=Wo;var $=P.current.memoizedState.isDehydrated;if($&&(Cr(P,M).flags|=256),M=vd(P,M,!1),M!==2){if(fd&&!$){P.errorRecoveryDisabledLanes|=d,ks|=d,u=4;break e}d=$n,$n=u,d!==null&&($n===null?$n=d:$n.push.apply($n,d))}u=M}if(d=!1,u!==2)continue}}if(u===1){Cr(t,0),es(t,n,0,!0);break}e:{switch(o=t,d=u,d){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:es(o,n,hi,!Ka);break e;case 2:$n=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=dc+300-Pe(),10<u)){if(es(o,n,hi,!Ka),Ae(o,0,!0)!==0)break e;_a=n,o.timeoutHandle=xx(Hg.bind(null,o,a,$n,pc,hd,n,hi,ks,Ar,Ka,d,"Throttled",-0,0),u);break e}Hg(o,a,$n,pc,hd,n,hi,ks,Ar,Ka,d,null,-0,0)}}break}while(!0);Wi(t)}function Hg(t,n,a,o,u,d,M,P,$,me,Te,Ce,ye,Se){if(t.timeoutHandle=-1,Ce=n.subtreeFlags,Ce&8192||(Ce&16785408)===16785408){Ce={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:aa},Lg(n,d,Ce);var $e=(d&62914560)===d?dc-Pe():(d&4194048)===d?Ig-Pe():0;if($e=hb(Ce,$e),$e!==null){_a=d,t.cancelPendingCommit=$e(Zg.bind(null,t,n,d,a,o,u,M,P,$,Te,Ce,null,ye,Se)),es(t,d,M,!me);return}}Zg(t,n,d,a,o,u,M,P,$)}function R1(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],d=u.getSnapshot;u=u.value;try{if(!li(d(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function es(t,n,a,o){n&=~dd,n&=~ks,t.suspendedLanes|=n,t.pingedLanes&=~n,o&&(t.warmLanes|=n),o=t.expirationTimes;for(var u=n;0<u;){var d=31-He(u),M=1<<d;o[d]=-1,u&=~M}a!==0&&Ft(t,a,n)}function mc(){return(Bt&6)===0?(Yo(0),!1):!0}function xd(){if(Ct!==null){if(Wt===0)var t=Ct.return;else t=Ct,la=Ds=null,Lf(t),vr=null,No=0,t=Ct;for(;t!==null;)vg(t.alternate,t),t=t.return;Ct=null}}function Cr(t,n){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,Z1(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),_a=0,xd(),en=t,Ct=a=ra(t.current,null),Nt=n,Wt=0,di=null,Ka=!1,Tr=Xe(t,n),fd=!1,Ar=hi=dd=ks=Qa=un=0,$n=Wo=null,hd=!1,(n&8)!==0&&(n|=n&32);var o=t.entangledLanes;if(o!==0)for(t=t.entanglements,o&=n;0<o;){var u=31-He(o),d=1<<u;n|=t[u],o&=~d}return va=n,Pl(),a}function Gg(t,n){St=null,D.H=Fo,n===xr||n===jl?(n=a0(),Wt=3):n===bf?(n=a0(),Wt=4):Wt=n===Zf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,di=n,Ct===null&&(un=1,ac(t,Mi(n,t.current)))}function Vg(){var t=ui.current;return t===null?!0:(Nt&4194048)===Nt?wi===null:(Nt&62914560)===Nt||(Nt&536870912)!==0?t===wi:!1}function jg(){var t=D.H;return D.H=Fo,t===null?Fo:t}function Xg(){var t=D.A;return D.A=w1,t}function gc(){un=4,Ka||(Nt&4194048)!==Nt&&ui.current!==null||(Tr=!0),(Qa&134217727)===0&&(ks&134217727)===0||en===null||es(en,Nt,hi,!1)}function vd(t,n,a){var o=Bt;Bt|=2;var u=jg(),d=Xg();(en!==t||Nt!==n)&&(pc=null,Cr(t,n)),n=!1;var M=un;e:do try{if(Wt!==0&&Ct!==null){var P=Ct,$=di;switch(Wt){case 8:xd(),M=6;break e;case 3:case 2:case 9:case 6:ui.current===null&&(n=!0);var me=Wt;if(Wt=0,di=null,Rr(t,P,$,me),a&&Tr){M=0;break e}break;default:me=Wt,Wt=0,di=null,Rr(t,P,$,me)}}N1(),M=un;break}catch(Te){Gg(t,Te)}while(!0);return n&&t.shellSuspendCounter++,la=Ds=null,Bt=o,D.H=u,D.A=d,Ct===null&&(en=null,Nt=0,Pl()),M}function N1(){for(;Ct!==null;)Wg(Ct)}function D1(t,n){var a=Bt;Bt|=2;var o=jg(),u=Xg();en!==t||Nt!==n?(pc=null,hc=Pe()+500,Cr(t,n)):Tr=Xe(t,n);e:do try{if(Wt!==0&&Ct!==null){n=Ct;var d=di;t:switch(Wt){case 1:Wt=0,di=null,Rr(t,n,d,1);break;case 2:case 9:if(n0(d)){Wt=0,di=null,qg(n);break}n=function(){Wt!==2&&Wt!==9||en!==t||(Wt=7),Wi(t)},d.then(n,n);break e;case 3:Wt=7;break e;case 4:Wt=5;break e;case 7:n0(d)?(Wt=0,di=null,qg(n)):(Wt=0,di=null,Rr(t,n,d,7));break;case 5:var M=null;switch(Ct.tag){case 26:M=Ct.memoizedState;case 5:case 27:var P=Ct;if(M?zx(M):P.stateNode.complete){Wt=0,di=null;var $=P.sibling;if($!==null)Ct=$;else{var me=P.return;me!==null?(Ct=me,xc(me)):Ct=null}break t}}Wt=0,di=null,Rr(t,n,d,5);break;case 6:Wt=0,di=null,Rr(t,n,d,6);break;case 8:xd(),un=6;break e;default:throw Error(s(462))}}z1();break}catch(Te){Gg(t,Te)}while(!0);return la=Ds=null,D.H=o,D.A=u,Bt=a,Ct!==null?0:(en=null,Nt=0,Pl(),un)}function z1(){for(;Ct!==null&&!nt();)Wg(Ct)}function Wg(t){var n=gg(t.alternate,t,va);t.memoizedProps=t.pendingProps,n===null?xc(t):Ct=n}function qg(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=ug(a,n,n.pendingProps,n.type,void 0,Nt);break;case 11:n=ug(a,n,n.pendingProps,n.type.render,n.ref,Nt);break;case 5:Lf(n);default:vg(a,n),n=Ct=Xm(n,va),n=gg(a,n,va)}t.memoizedProps=t.pendingProps,n===null?xc(t):Ct=n}function Rr(t,n,a,o){la=Ds=null,Lf(n),vr=null,No=0;var u=n.return;try{if(y1(t,u,n,a,Nt)){un=1,ac(t,Mi(a,t.current)),Ct=null;return}}catch(d){if(u!==null)throw Ct=u,d;un=1,ac(t,Mi(a,t.current)),Ct=null;return}n.flags&32768?(zt||o===1?t=!0:Tr||(Nt&536870912)!==0?t=!1:(Ka=t=!0,(o===2||o===9||o===3||o===6)&&(o=ui.current,o!==null&&o.tag===13&&(o.flags|=16384))),Yg(n,t)):xc(n)}function xc(t){var n=t;do{if((n.flags&32768)!==0){Yg(n,Ka);return}t=n.return;var a=M1(n.alternate,n,va);if(a!==null){Ct=a;return}if(n=n.sibling,n!==null){Ct=n;return}Ct=n=t}while(n!==null);un===0&&(un=5)}function Yg(t,n){do{var a=E1(t.alternate,t);if(a!==null){a.flags&=32767,Ct=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){Ct=t;return}Ct=t=a}while(t!==null);un=6,Ct=null}function Zg(t,n,a,o,u,d,M,P,$){t.cancelPendingCommit=null;do vc();while(An!==0);if((Bt&6)!==0)throw Error(s(327));if(n!==null){if(n===t.current)throw Error(s(177));if(d=n.lanes|n.childLanes,d|=rf,on(t,a,d,M,P,$),t===en&&(Ct=en=null,Nt=0),wr=n,$a=t,_a=a,pd=d,md=u,Fg=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,P1(K,function(){return ex(),null})):(t.callbackNode=null,t.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=D.T,D.T=null,u=k.p,k.p=2,M=Bt,Bt|=4;try{T1(t,n,a)}finally{Bt=M,k.p=u,D.T=o}}An=1,Kg(),Qg(),Jg()}}function Kg(){if(An===1){An=0;var t=$a,n=wr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=D.T,D.T=null;var o=k.p;k.p=2;var u=Bt;Bt|=4;try{Ng(n,t);var d=Nd,M=Pm(t.containerInfo),P=d.focusedElem,$=d.selectionRange;if(M!==P&&P&&P.ownerDocument&&Om(P.ownerDocument.documentElement,P)){if($!==null&&ef(P)){var me=$.start,Te=$.end;if(Te===void 0&&(Te=me),"selectionStart"in P)P.selectionStart=me,P.selectionEnd=Math.min(Te,P.value.length);else{var Ce=P.ownerDocument||document,ye=Ce&&Ce.defaultView||window;if(ye.getSelection){var Se=ye.getSelection(),$e=P.textContent.length,ct=Math.min($.start,$e),Qt=$.end===void 0?ct:Math.min($.end,$e);!Se.extend&&ct>Qt&&(M=Qt,Qt=ct,ct=M);var fe=Um(P,ct),re=Um(P,Qt);if(fe&&re&&(Se.rangeCount!==1||Se.anchorNode!==fe.node||Se.anchorOffset!==fe.offset||Se.focusNode!==re.node||Se.focusOffset!==re.offset)){var pe=Ce.createRange();pe.setStart(fe.node,fe.offset),Se.removeAllRanges(),ct>Qt?(Se.addRange(pe),Se.extend(re.node,re.offset)):(pe.setEnd(re.node,re.offset),Se.addRange(pe))}}}}for(Ce=[],Se=P;Se=Se.parentNode;)Se.nodeType===1&&Ce.push({element:Se,left:Se.scrollLeft,top:Se.scrollTop});for(typeof P.focus=="function"&&P.focus(),P=0;P<Ce.length;P++){var we=Ce[P];we.element.scrollLeft=we.left,we.element.scrollTop=we.top}}Nc=!!Rd,Nd=Rd=null}finally{Bt=u,k.p=o,D.T=a}}t.current=n,An=2}}function Qg(){if(An===2){An=0;var t=$a,n=wr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=D.T,D.T=null;var o=k.p;k.p=2;var u=Bt;Bt|=4;try{Tg(t,n.alternate,n)}finally{Bt=u,k.p=o,D.T=a}}An=3}}function Jg(){if(An===4||An===3){An=0,pt();var t=$a,n=wr,a=_a,o=Fg;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?An=5:(An=0,wr=$a=null,$g(t,t.pendingLanes));var u=t.pendingLanes;if(u===0&&(Ja=null),fo(a),n=n.stateNode,be&&typeof be.onCommitFiberRoot=="function")try{be.onCommitFiberRoot(de,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=D.T,u=k.p,k.p=2,D.T=null;try{for(var d=t.onRecoverableError,M=0;M<o.length;M++){var P=o[M];d(P.value,{componentStack:P.stack})}}finally{D.T=n,k.p=u}}(_a&3)!==0&&vc(),Wi(t),u=t.pendingLanes,(a&261930)!==0&&(u&42)!==0?t===gd?qo++:(qo=0,gd=t):qo=0,Yo(0)}}function $g(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,Co(n)))}function vc(){return Kg(),Qg(),Jg(),ex()}function ex(){if(An!==5)return!1;var t=$a,n=pd;pd=0;var a=fo(_a),o=D.T,u=k.p;try{k.p=32>a?32:a,D.T=null,a=md,md=null;var d=$a,M=_a;if(An=0,wr=$a=null,_a=0,(Bt&6)!==0)throw Error(s(331));var P=Bt;if(Bt|=4,Og(d.current),zg(d,d.current,M,a),Bt=P,Yo(0,!1),be&&typeof be.onPostCommitFiberRoot=="function")try{be.onPostCommitFiberRoot(de,d)}catch{}return!0}finally{k.p=u,D.T=o,$g(t,n)}}function tx(t,n,a){n=Mi(a,n),n=Yf(t.stateNode,n,2),t=Wa(t,n,2),t!==null&&(dt(t,2),Wi(t))}function qt(t,n,a){if(t.tag===3)tx(t,t,a);else for(;n!==null;){if(n.tag===3){tx(n,t,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Ja===null||!Ja.has(o))){t=Mi(a,t),a=ng(2),o=Wa(n,a,2),o!==null&&(ig(a,o,n,t),dt(o,2),Wi(o));break}}n=n.return}}function _d(t,n,a){var o=t.pingCache;if(o===null){o=t.pingCache=new C1;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(fd=!0,u.add(a),t=L1.bind(null,t,n,a),n.then(t,t))}function L1(t,n,a){var o=t.pingCache;o!==null&&o.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,en===t&&(Nt&a)===a&&(un===4||un===3&&(Nt&62914560)===Nt&&300>Pe()-dc?(Bt&2)===0&&Cr(t,0):dd|=a,Ar===Nt&&(Ar=0)),Wi(t)}function nx(t,n){n===0&&(n=De()),t=Cs(t,n),t!==null&&(dt(t,n),Wi(t))}function U1(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),nx(t,a)}function O1(t,n){var a=0;switch(t.tag){case 31:case 13:var o=t.stateNode,u=t.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=t.stateNode;break;case 22:o=t.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),nx(t,a)}function P1(t,n){return te(t,n)}var _c=null,Nr=null,yd=!1,yc=!1,bd=!1,ts=0;function Wi(t){t!==Nr&&t.next===null&&(Nr===null?_c=Nr=t:Nr=Nr.next=t),yc=!0,yd||(yd=!0,F1())}function Yo(t,n){if(!bd&&yc){bd=!0;do for(var a=!1,o=_c;o!==null;){if(t!==0){var u=o.pendingLanes;if(u===0)var d=0;else{var M=o.suspendedLanes,P=o.pingedLanes;d=(1<<31-He(42|t)+1)-1,d&=u&~(M&~P),d=d&201326741?d&201326741|1:d?d|2:0}d!==0&&(a=!0,rx(o,d))}else d=Nt,d=Ae(o,o===en?d:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(d&3)===0||Xe(o,d)||(a=!0,rx(o,d));o=o.next}while(a);bd=!1}}function I1(){ix()}function ix(){yc=yd=!1;var t=0;ts!==0&&Y1()&&(t=ts);for(var n=Pe(),a=null,o=_c;o!==null;){var u=o.next,d=ax(o,n);d===0?(o.next=null,a===null?_c=u:a.next=u,u===null&&(Nr=a)):(a=o,(t!==0||(d&3)!==0)&&(yc=!0)),o=u}An!==0&&An!==5||Yo(t),ts!==0&&(ts=0)}function ax(t,n){for(var a=t.suspendedLanes,o=t.pingedLanes,u=t.expirationTimes,d=t.pendingLanes&-62914561;0<d;){var M=31-He(d),P=1<<M,$=u[M];$===-1?((P&a)===0||(P&o)!==0)&&(u[M]=Be(P,n)):$<=n&&(t.expiredLanes|=P),d&=~P}if(n=en,a=Nt,a=Ae(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o=t.callbackNode,a===0||t===n&&(Wt===2||Wt===9)||t.cancelPendingCommit!==null)return o!==null&&o!==null&&vt(o),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Xe(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(o!==null&&vt(o),fo(a)){case 2:case 8:a=E;break;case 32:a=K;break;case 268435456:a=he;break;default:a=K}return o=sx.bind(null,t),a=te(a,o),t.callbackPriority=n,t.callbackNode=a,n}return o!==null&&o!==null&&vt(o),t.callbackPriority=2,t.callbackNode=null,2}function sx(t,n){if(An!==0&&An!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(vc()&&t.callbackNode!==a)return null;var o=Nt;return o=Ae(t,t===en?o:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o===0?null:(kg(t,o,n),ax(t,Pe()),t.callbackNode!=null&&t.callbackNode===a?sx.bind(null,t):null)}function rx(t,n){if(vc())return null;kg(t,n,!0)}function F1(){K1(function(){(Bt&6)!==0?te(N,I1):ix()})}function Sd(){if(ts===0){var t=mr;t===0&&(t=it,it<<=1,(it&261888)===0&&(it=256)),ts=t}return ts}function ox(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Es(""+t)}function lx(t,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,t.id&&a.setAttribute("form",t.id),n.parentNode.insertBefore(a,n),t=new FormData(t),a.parentNode.removeChild(a),t}function B1(t,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var d=ox((u[Ln]||null).action),M=o.submitter;M&&(n=(n=M[Ln]||null)?ox(n.formAction):M.getAttribute("formAction"),n!==null&&(d=n,M=null));var P=new zl("action","action",null,o,u);t.push({event:P,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(ts!==0){var $=M?lx(u,M):new FormData(u);Gf(a,{pending:!0,data:$,method:u.method,action:d},null,$)}}else typeof d=="function"&&(P.preventDefault(),$=M?lx(u,M):new FormData(u),Gf(a,{pending:!0,data:$,method:u.method,action:d},d,$))},currentTarget:u}]})}}for(var Md=0;Md<sf.length;Md++){var Ed=sf[Md],k1=Ed.toLowerCase(),H1=Ed[0].toUpperCase()+Ed.slice(1);Ui(k1,"on"+H1)}Ui(Bm,"onAnimationEnd"),Ui(km,"onAnimationIteration"),Ui(Hm,"onAnimationStart"),Ui("dblclick","onDoubleClick"),Ui("focusin","onFocus"),Ui("focusout","onBlur"),Ui(i1,"onTransitionRun"),Ui(a1,"onTransitionStart"),Ui(s1,"onTransitionCancel"),Ui(Gm,"onTransitionEnd"),_e("onMouseEnter",["mouseout","mouseover"]),_e("onMouseLeave",["mouseout","mouseover"]),_e("onPointerEnter",["pointerout","pointerover"]),_e("onPointerLeave",["pointerout","pointerover"]),oe("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),oe("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),oe("onBeforeInput",["compositionend","keypress","textInput","paste"]),oe("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),oe("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),oe("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Zo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),G1=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Zo));function cx(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var o=t[a],u=o.event;o=o.listeners;e:{var d=void 0;if(n)for(var M=o.length-1;0<=M;M--){var P=o[M],$=P.instance,me=P.currentTarget;if(P=P.listener,$!==d&&u.isPropagationStopped())break e;d=P,u.currentTarget=me;try{d(u)}catch(Te){Ol(Te)}u.currentTarget=null,d=$}else for(M=0;M<o.length;M++){if(P=o[M],$=P.instance,me=P.currentTarget,P=P.listener,$!==d&&u.isPropagationStopped())break e;d=P,u.currentTarget=me;try{d(u)}catch(Te){Ol(Te)}u.currentTarget=null,d=$}}}}function Rt(t,n){var a=n[La];a===void 0&&(a=n[La]=new Set);var o=t+"__bubble";a.has(o)||(ux(n,t,2,!1),a.add(o))}function Td(t,n,a){var o=0;n&&(o|=4),ux(a,t,o,n)}var bc="_reactListening"+Math.random().toString(36).slice(2);function Ad(t){if(!t[bc]){t[bc]=!0,Cl.forEach(function(a){a!=="selectionchange"&&(G1.has(a)||Td(a,!1,t),Td(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[bc]||(n[bc]=!0,Td("selectionchange",!1,n))}}function ux(t,n,a,o){switch(Bx(n)){case 2:var u=gb;break;case 8:u=xb;break;default:u=Hd}a=u.bind(null,n,a,t),u=void 0,!Xu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?t.addEventListener(n,a,{capture:!0,passive:u}):t.addEventListener(n,a,!0):u!==void 0?t.addEventListener(n,a,{passive:u}):t.addEventListener(n,a,!1)}function wd(t,n,a,o,u){var d=o;if((n&1)===0&&(n&2)===0&&o!==null)e:for(;;){if(o===null)return;var M=o.tag;if(M===3||M===4){var P=o.stateNode.containerInfo;if(P===u)break;if(M===4)for(M=o.return;M!==null;){var $=M.tag;if(($===3||$===4)&&M.stateNode.containerInfo===u)return;M=M.return}for(;P!==null;){if(M=Oa(P),M===null)return;if($=M.tag,$===5||$===6||$===26||$===27){o=d=M;continue e}P=P.parentNode}}o=o.return}mm(function(){var me=d,Te=Vu(a),Ce=[];e:{var ye=Vm.get(t);if(ye!==void 0){var Se=zl,$e=t;switch(t){case"keypress":if(Nl(a)===0)break e;case"keydown":case"keyup":Se=Oy;break;case"focusin":$e="focus",Se=Zu;break;case"focusout":$e="blur",Se=Zu;break;case"beforeblur":case"afterblur":Se=Zu;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Se=vm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Se=My;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Se=Fy;break;case Bm:case km:case Hm:Se=Ay;break;case Gm:Se=ky;break;case"scroll":case"scrollend":Se=by;break;case"wheel":Se=Gy;break;case"copy":case"cut":case"paste":Se=Cy;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Se=ym;break;case"toggle":case"beforetoggle":Se=jy}var ct=(n&4)!==0,Qt=!ct&&(t==="scroll"||t==="scrollend"),fe=ct?ye!==null?ye+"Capture":null:ye;ct=[];for(var re=me,pe;re!==null;){var we=re;if(pe=we.stateNode,we=we.tag,we!==5&&we!==26&&we!==27||pe===null||fe===null||(we=xo(re,fe),we!=null&&ct.push(Ko(re,we,pe))),Qt)break;re=re.return}0<ct.length&&(ye=new Se(ye,$e,null,a,Te),Ce.push({event:ye,listeners:ct}))}}if((n&7)===0){e:{if(ye=t==="mouseover"||t==="pointerover",Se=t==="mouseout"||t==="pointerout",ye&&a!==Gu&&($e=a.relatedTarget||a.fromElement)&&(Oa($e)||$e[ia]))break e;if((Se||ye)&&(ye=Te.window===Te?Te:(ye=Te.ownerDocument)?ye.defaultView||ye.parentWindow:window,Se?($e=a.relatedTarget||a.toElement,Se=me,$e=$e?Oa($e):null,$e!==null&&(Qt=c($e),ct=$e.tag,$e!==Qt||ct!==5&&ct!==27&&ct!==6)&&($e=null)):(Se=null,$e=me),Se!==$e)){if(ct=vm,we="onMouseLeave",fe="onMouseEnter",re="mouse",(t==="pointerout"||t==="pointerover")&&(ct=ym,we="onPointerLeave",fe="onPointerEnter",re="pointer"),Qt=Se==null?ye:Ms(Se),pe=$e==null?ye:Ms($e),ye=new ct(we,re+"leave",Se,a,Te),ye.target=Qt,ye.relatedTarget=pe,we=null,Oa(Te)===me&&(ct=new ct(fe,re+"enter",$e,a,Te),ct.target=pe,ct.relatedTarget=Qt,we=ct),Qt=we,Se&&$e)t:{for(ct=V1,fe=Se,re=$e,pe=0,we=fe;we;we=ct(we))pe++;we=0;for(var ot=re;ot;ot=ct(ot))we++;for(;0<pe-we;)fe=ct(fe),pe--;for(;0<we-pe;)re=ct(re),we--;for(;pe--;){if(fe===re||re!==null&&fe===re.alternate){ct=fe;break t}fe=ct(fe),re=ct(re)}ct=null}else ct=null;Se!==null&&fx(Ce,ye,Se,ct,!1),$e!==null&&Qt!==null&&fx(Ce,Qt,$e,ct,!0)}}e:{if(ye=me?Ms(me):window,Se=ye.nodeName&&ye.nodeName.toLowerCase(),Se==="select"||Se==="input"&&ye.type==="file")var Pt=Cm;else if(Am(ye))if(Rm)Pt=e1;else{Pt=Jy;var tt=Qy}else Se=ye.nodeName,!Se||Se.toLowerCase()!=="input"||ye.type!=="checkbox"&&ye.type!=="radio"?me&&Ht(me.elementType)&&(Pt=Cm):Pt=$y;if(Pt&&(Pt=Pt(t,me))){wm(Ce,Pt,a,Te);break e}tt&&tt(t,ye,me),t==="focusout"&&me&&ye.type==="number"&&me.memoizedProps.value!=null&&wt(ye,"number",ye.value)}switch(tt=me?Ms(me):window,t){case"focusin":(Am(tt)||tt.contentEditable==="true")&&(or=tt,tf=me,To=null);break;case"focusout":To=tf=or=null;break;case"mousedown":nf=!0;break;case"contextmenu":case"mouseup":case"dragend":nf=!1,Im(Ce,a,Te);break;case"selectionchange":if(n1)break;case"keydown":case"keyup":Im(Ce,a,Te)}var Mt;if(Qu)e:{switch(t){case"compositionstart":var Dt="onCompositionStart";break e;case"compositionend":Dt="onCompositionEnd";break e;case"compositionupdate":Dt="onCompositionUpdate";break e}Dt=void 0}else rr?Em(t,a)&&(Dt="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(Dt="onCompositionStart");Dt&&(bm&&a.locale!=="ko"&&(rr||Dt!=="onCompositionStart"?Dt==="onCompositionEnd"&&rr&&(Mt=gm()):(Ba=Te,Wu="value"in Ba?Ba.value:Ba.textContent,rr=!0)),tt=Sc(me,Dt),0<tt.length&&(Dt=new _m(Dt,t,null,a,Te),Ce.push({event:Dt,listeners:tt}),Mt?Dt.data=Mt:(Mt=Tm(a),Mt!==null&&(Dt.data=Mt)))),(Mt=Wy?qy(t,a):Yy(t,a))&&(Dt=Sc(me,"onBeforeInput"),0<Dt.length&&(tt=new _m("onBeforeInput","beforeinput",null,a,Te),Ce.push({event:tt,listeners:Dt}),tt.data=Mt)),B1(Ce,t,me,a,Te)}cx(Ce,n)})}function Ko(t,n,a){return{instance:t,listener:n,currentTarget:a}}function Sc(t,n){for(var a=n+"Capture",o=[];t!==null;){var u=t,d=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||d===null||(u=xo(t,a),u!=null&&o.unshift(Ko(t,u,d)),u=xo(t,n),u!=null&&o.push(Ko(t,u,d))),t.tag===3)return o;t=t.return}return[]}function V1(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function fx(t,n,a,o,u){for(var d=n._reactName,M=[];a!==null&&a!==o;){var P=a,$=P.alternate,me=P.stateNode;if(P=P.tag,$!==null&&$===o)break;P!==5&&P!==26&&P!==27||me===null||($=me,u?(me=xo(a,d),me!=null&&M.unshift(Ko(a,me,$))):u||(me=xo(a,d),me!=null&&M.push(Ko(a,me,$)))),a=a.return}M.length!==0&&t.push({event:n,listeners:M})}var j1=/\r\n?/g,X1=/\u0000|\uFFFD/g;function dx(t){return(typeof t=="string"?t:""+t).replace(j1,`
`).replace(X1,"")}function hx(t,n){return n=dx(n),dx(t)===n}function Kt(t,n,a,o,u,d){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||oi(t,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&oi(t,""+o);break;case"className":Je(t,"class",o);break;case"tabIndex":Je(t,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":Je(t,a,o);break;case"style":Li(t,o,d);break;case"data":if(n!=="object"){Je(t,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Es(""+o),t.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof d=="function"&&(a==="formAction"?(n!=="input"&&Kt(t,n,"name",u.name,u,null),Kt(t,n,"formEncType",u.formEncType,u,null),Kt(t,n,"formMethod",u.formMethod,u,null),Kt(t,n,"formTarget",u.formTarget,u,null)):(Kt(t,n,"encType",u.encType,u,null),Kt(t,n,"method",u.method,u,null),Kt(t,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Es(""+o),t.setAttribute(a,o);break;case"onClick":o!=null&&(t.onclick=aa);break;case"onScroll":o!=null&&Rt("scroll",t);break;case"onScrollEnd":o!=null&&Rt("scrollend",t);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"multiple":t.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":t.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){t.removeAttribute("xlink:href");break}a=Es(""+o),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""+o):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":o===!0?t.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,o):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?t.setAttribute(a,o):t.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?t.removeAttribute(a):t.setAttribute(a,o);break;case"popover":Rt("beforetoggle",t),Rt("toggle",t),Ge(t,"popover",o);break;case"xlinkActuate":Qe(t,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Qe(t,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Qe(t,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Qe(t,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Qe(t,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Qe(t,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Qe(t,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Qe(t,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Qe(t,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":Ge(t,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Gi.get(a)||a,Ge(t,a,o))}}function Cd(t,n,a,o,u,d){switch(a){case"style":Li(t,o,d);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"children":typeof o=="string"?oi(t,o):(typeof o=="number"||typeof o=="bigint")&&oi(t,""+o);break;case"onScroll":o!=null&&Rt("scroll",t);break;case"onScrollEnd":o!=null&&Rt("scrollend",t);break;case"onClick":o!=null&&(t.onclick=aa);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!U.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),d=t[Ln]||null,d=d!=null?d[a]:null,typeof d=="function"&&t.removeEventListener(n,d,u),typeof o=="function")){typeof d!="function"&&d!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(n,o,u);break e}a in t?t[a]=o:o===!0?t.setAttribute(a,""):Ge(t,a,o)}}}function In(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Rt("error",t),Rt("load",t);var o=!1,u=!1,d;for(d in a)if(a.hasOwnProperty(d)){var M=a[d];if(M!=null)switch(d){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Kt(t,n,d,M,a,null)}}u&&Kt(t,n,"srcSet",a.srcSet,a,null),o&&Kt(t,n,"src",a.src,a,null);return;case"input":Rt("invalid",t);var P=d=M=u=null,$=null,me=null;for(o in a)if(a.hasOwnProperty(o)){var Te=a[o];if(Te!=null)switch(o){case"name":u=Te;break;case"type":M=Te;break;case"checked":$=Te;break;case"defaultChecked":me=Te;break;case"value":d=Te;break;case"defaultValue":P=Te;break;case"children":case"dangerouslySetInnerHTML":if(Te!=null)throw Error(s(137,n));break;default:Kt(t,n,o,Te,a,null)}}kn(t,d,P,$,me,M,u,!1);return;case"select":Rt("invalid",t),o=M=d=null;for(u in a)if(a.hasOwnProperty(u)&&(P=a[u],P!=null))switch(u){case"value":d=P;break;case"defaultValue":M=P;break;case"multiple":o=P;default:Kt(t,n,u,P,a,null)}n=d,a=M,t.multiple=!!o,n!=null?Tn(t,!!o,n,!1):a!=null&&Tn(t,!!o,a,!0);return;case"textarea":Rt("invalid",t),d=u=o=null;for(M in a)if(a.hasOwnProperty(M)&&(P=a[M],P!=null))switch(M){case"value":o=P;break;case"defaultValue":u=P;break;case"children":d=P;break;case"dangerouslySetInnerHTML":if(P!=null)throw Error(s(91));break;default:Kt(t,n,M,P,a,null)}zi(t,o,u,d);return;case"option":for($ in a)if(a.hasOwnProperty($)&&(o=a[$],o!=null))switch($){case"selected":t.selected=o&&typeof o!="function"&&typeof o!="symbol";break;default:Kt(t,n,$,o,a,null)}return;case"dialog":Rt("beforetoggle",t),Rt("toggle",t),Rt("cancel",t),Rt("close",t);break;case"iframe":case"object":Rt("load",t);break;case"video":case"audio":for(o=0;o<Zo.length;o++)Rt(Zo[o],t);break;case"image":Rt("error",t),Rt("load",t);break;case"details":Rt("toggle",t);break;case"embed":case"source":case"link":Rt("error",t),Rt("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(me in a)if(a.hasOwnProperty(me)&&(o=a[me],o!=null))switch(me){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Kt(t,n,me,o,a,null)}return;default:if(Ht(n)){for(Te in a)a.hasOwnProperty(Te)&&(o=a[Te],o!==void 0&&Cd(t,n,Te,o,a,void 0));return}}for(P in a)a.hasOwnProperty(P)&&(o=a[P],o!=null&&Kt(t,n,P,o,a,null))}function W1(t,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,d=null,M=null,P=null,$=null,me=null,Te=null;for(Se in a){var Ce=a[Se];if(a.hasOwnProperty(Se)&&Ce!=null)switch(Se){case"checked":break;case"value":break;case"defaultValue":$=Ce;default:o.hasOwnProperty(Se)||Kt(t,n,Se,null,o,Ce)}}for(var ye in o){var Se=o[ye];if(Ce=a[ye],o.hasOwnProperty(ye)&&(Se!=null||Ce!=null))switch(ye){case"type":d=Se;break;case"name":u=Se;break;case"checked":me=Se;break;case"defaultChecked":Te=Se;break;case"value":M=Se;break;case"defaultValue":P=Se;break;case"children":case"dangerouslySetInnerHTML":if(Se!=null)throw Error(s(137,n));break;default:Se!==Ce&&Kt(t,n,ye,Se,o,Ce)}}Ye(t,M,P,$,me,Te,d,u);return;case"select":Se=M=P=ye=null;for(d in a)if($=a[d],a.hasOwnProperty(d)&&$!=null)switch(d){case"value":break;case"multiple":Se=$;default:o.hasOwnProperty(d)||Kt(t,n,d,null,o,$)}for(u in o)if(d=o[u],$=a[u],o.hasOwnProperty(u)&&(d!=null||$!=null))switch(u){case"value":ye=d;break;case"defaultValue":P=d;break;case"multiple":M=d;default:d!==$&&Kt(t,n,u,d,o,$)}n=P,a=M,o=Se,ye!=null?Tn(t,!!a,ye,!1):!!o!=!!a&&(n!=null?Tn(t,!!a,n,!0):Tn(t,!!a,a?[]:"",!1));return;case"textarea":Se=ye=null;for(P in a)if(u=a[P],a.hasOwnProperty(P)&&u!=null&&!o.hasOwnProperty(P))switch(P){case"value":break;case"children":break;default:Kt(t,n,P,null,o,u)}for(M in o)if(u=o[M],d=a[M],o.hasOwnProperty(M)&&(u!=null||d!=null))switch(M){case"value":ye=u;break;case"defaultValue":Se=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==d&&Kt(t,n,M,u,o,d)}ri(t,ye,Se);return;case"option":for(var $e in a)if(ye=a[$e],a.hasOwnProperty($e)&&ye!=null&&!o.hasOwnProperty($e))switch($e){case"selected":t.selected=!1;break;default:Kt(t,n,$e,null,o,ye)}for($ in o)if(ye=o[$],Se=a[$],o.hasOwnProperty($)&&ye!==Se&&(ye!=null||Se!=null))switch($){case"selected":t.selected=ye&&typeof ye!="function"&&typeof ye!="symbol";break;default:Kt(t,n,$,ye,o,Se)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ct in a)ye=a[ct],a.hasOwnProperty(ct)&&ye!=null&&!o.hasOwnProperty(ct)&&Kt(t,n,ct,null,o,ye);for(me in o)if(ye=o[me],Se=a[me],o.hasOwnProperty(me)&&ye!==Se&&(ye!=null||Se!=null))switch(me){case"children":case"dangerouslySetInnerHTML":if(ye!=null)throw Error(s(137,n));break;default:Kt(t,n,me,ye,o,Se)}return;default:if(Ht(n)){for(var Qt in a)ye=a[Qt],a.hasOwnProperty(Qt)&&ye!==void 0&&!o.hasOwnProperty(Qt)&&Cd(t,n,Qt,void 0,o,ye);for(Te in o)ye=o[Te],Se=a[Te],!o.hasOwnProperty(Te)||ye===Se||ye===void 0&&Se===void 0||Cd(t,n,Te,ye,o,Se);return}}for(var fe in a)ye=a[fe],a.hasOwnProperty(fe)&&ye!=null&&!o.hasOwnProperty(fe)&&Kt(t,n,fe,null,o,ye);for(Ce in o)ye=o[Ce],Se=a[Ce],!o.hasOwnProperty(Ce)||ye===Se||ye==null&&Se==null||Kt(t,n,Ce,ye,o,Se)}function px(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function q1(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],d=u.transferSize,M=u.initiatorType,P=u.duration;if(d&&P&&px(M)){for(M=0,P=u.responseEnd,o+=1;o<a.length;o++){var $=a[o],me=$.startTime;if(me>P)break;var Te=$.transferSize,Ce=$.initiatorType;Te&&px(Ce)&&($=$.responseEnd,M+=Te*($<P?1:(P-me)/($-me)))}if(--o,n+=8*(d+M)/(u.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var Rd=null,Nd=null;function Mc(t){return t.nodeType===9?t:t.ownerDocument}function mx(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function gx(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function Dd(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var zd=null;function Y1(){var t=window.event;return t&&t.type==="popstate"?t===zd?!1:(zd=t,!0):(zd=null,!1)}var xx=typeof setTimeout=="function"?setTimeout:void 0,Z1=typeof clearTimeout=="function"?clearTimeout:void 0,vx=typeof Promise=="function"?Promise:void 0,K1=typeof queueMicrotask=="function"?queueMicrotask:typeof vx<"u"?function(t){return vx.resolve(null).then(t).catch(Q1)}:xx;function Q1(t){setTimeout(function(){throw t})}function ns(t){return t==="head"}function _x(t,n){var a=n,o=0;do{var u=a.nextSibling;if(t.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){t.removeChild(u),Ur(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Qo(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,Qo(a);for(var d=a.firstChild;d;){var M=d.nextSibling,P=d.nodeName;d[Ua]||P==="SCRIPT"||P==="STYLE"||P==="LINK"&&d.rel.toLowerCase()==="stylesheet"||a.removeChild(d),d=M}}else a==="body"&&Qo(t.ownerDocument.body);a=u}while(a);Ur(n)}function yx(t,n){var a=t;t=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=o}while(a)}function Ld(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Ld(a),go(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function J1(t,n,a,o){for(;t.nodeType===1;){var u=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(o){if(!t[Ua])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(d=t.getAttribute("rel"),d==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(d!==u.rel||t.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||t.getAttribute("title")!==(u.title==null?null:u.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(d=t.getAttribute("src"),(d!==(u.src==null?null:u.src)||t.getAttribute("type")!==(u.type==null?null:u.type)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&d&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var d=u.name==null?null:""+u.name;if(u.type==="hidden"&&t.getAttribute("name")===d)return t}else return t;if(t=Ci(t.nextSibling),t===null)break}return null}function $1(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Ci(t.nextSibling),t===null))return null;return t}function bx(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=Ci(t.nextSibling),t===null))return null;return t}function Ud(t){return t.data==="$?"||t.data==="$~"}function Od(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function eb(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),t._reactRetry=o}}function Ci(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var Pd=null;function Sx(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return Ci(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function Mx(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function Ex(t,n,a){switch(n=Mc(a),t){case"html":if(t=n.documentElement,!t)throw Error(s(452));return t;case"head":if(t=n.head,!t)throw Error(s(453));return t;case"body":if(t=n.body,!t)throw Error(s(454));return t;default:throw Error(s(451))}}function Qo(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);go(t)}var Ri=new Map,Tx=new Set;function Ec(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var ya=k.d;k.d={f:tb,r:nb,D:ib,C:ab,L:sb,m:rb,X:lb,S:ob,M:cb};function tb(){var t=ya.f(),n=mc();return t||n}function nb(t){var n=Pa(t);n!==null&&n.tag===5&&n.type==="form"?G0(n):ya.r(t)}var Dr=typeof document>"u"?null:document;function Ax(t,n,a){var o=Dr;if(o&&typeof n=="string"&&n){var u=jt(n);u='link[rel="'+t+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),Tx.has(u)||(Tx.add(u),t={rel:t,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),In(n,"link",t),xn(n),o.head.appendChild(n)))}}function ib(t){ya.D(t),Ax("dns-prefetch",t,null)}function ab(t,n){ya.C(t,n),Ax("preconnect",t,n)}function sb(t,n,a){ya.L(t,n,a);var o=Dr;if(o&&t&&n){var u='link[rel="preload"][as="'+jt(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+jt(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+jt(a.imageSizes)+'"]')):u+='[href="'+jt(t)+'"]';var d=u;switch(n){case"style":d=zr(t);break;case"script":d=Lr(t)}Ri.has(d)||(t=_({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),Ri.set(d,t),o.querySelector(u)!==null||n==="style"&&o.querySelector(Jo(d))||n==="script"&&o.querySelector($o(d))||(n=o.createElement("link"),In(n,"link",t),xn(n),o.head.appendChild(n)))}}function rb(t,n){ya.m(t,n);var a=Dr;if(a&&t){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+jt(o)+'"][href="'+jt(t)+'"]',d=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":d=Lr(t)}if(!Ri.has(d)&&(t=_({rel:"modulepreload",href:t},n),Ri.set(d,t),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector($o(d)))return}o=a.createElement("link"),In(o,"link",t),xn(o),a.head.appendChild(o)}}}function ob(t,n,a){ya.S(t,n,a);var o=Dr;if(o&&t){var u=Ia(o).hoistableStyles,d=zr(t);n=n||"default";var M=u.get(d);if(!M){var P={loading:0,preload:null};if(M=o.querySelector(Jo(d)))P.loading=5;else{t=_({rel:"stylesheet",href:t,"data-precedence":n},a),(a=Ri.get(d))&&Id(t,a);var $=M=o.createElement("link");xn($),In($,"link",t),$._p=new Promise(function(me,Te){$.onload=me,$.onerror=Te}),$.addEventListener("load",function(){P.loading|=1}),$.addEventListener("error",function(){P.loading|=2}),P.loading|=4,Tc(M,n,o)}M={type:"stylesheet",instance:M,count:1,state:P},u.set(d,M)}}}function lb(t,n){ya.X(t,n);var a=Dr;if(a&&t){var o=Ia(a).hoistableScripts,u=Lr(t),d=o.get(u);d||(d=a.querySelector($o(u)),d||(t=_({src:t,async:!0},n),(n=Ri.get(u))&&Fd(t,n),d=a.createElement("script"),xn(d),In(d,"link",t),a.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},o.set(u,d))}}function cb(t,n){ya.M(t,n);var a=Dr;if(a&&t){var o=Ia(a).hoistableScripts,u=Lr(t),d=o.get(u);d||(d=a.querySelector($o(u)),d||(t=_({src:t,async:!0,type:"module"},n),(n=Ri.get(u))&&Fd(t,n),d=a.createElement("script"),xn(d),In(d,"link",t),a.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},o.set(u,d))}}function wx(t,n,a,o){var u=(u=A.current)?Ec(u):null;if(!u)throw Error(s(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=zr(a.href),a=Ia(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=zr(a.href);var d=Ia(u).hoistableStyles,M=d.get(t);if(M||(u=u.ownerDocument||u,M={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},d.set(t,M),(d=u.querySelector(Jo(t)))&&!d._p&&(M.instance=d,M.state.loading=5),Ri.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ri.set(t,a),d||ub(u,t,a,M.state))),n&&o===null)throw Error(s(528,""));return M}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Lr(a),a=Ia(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,t))}}function zr(t){return'href="'+jt(t)+'"'}function Jo(t){return'link[rel="stylesheet"]['+t+"]"}function Cx(t){return _({},t,{"data-precedence":t.precedence,precedence:null})}function ub(t,n,a,o){t.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=t.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),In(n,"link",a),xn(n),t.head.appendChild(n))}function Lr(t){return'[src="'+jt(t)+'"]'}function $o(t){return"script[async]"+t}function Rx(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=t.querySelector('style[data-href~="'+jt(a.href)+'"]');if(o)return n.instance=o,xn(o),o;var u=_({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(t.ownerDocument||t).createElement("style"),xn(o),In(o,"style",u),Tc(o,a.precedence,t),n.instance=o;case"stylesheet":u=zr(a.href);var d=t.querySelector(Jo(u));if(d)return n.state.loading|=4,n.instance=d,xn(d),d;o=Cx(a),(u=Ri.get(u))&&Id(o,u),d=(t.ownerDocument||t).createElement("link"),xn(d);var M=d;return M._p=new Promise(function(P,$){M.onload=P,M.onerror=$}),In(d,"link",o),n.state.loading|=4,Tc(d,a.precedence,t),n.instance=d;case"script":return d=Lr(a.src),(u=t.querySelector($o(d)))?(n.instance=u,xn(u),u):(o=a,(u=Ri.get(d))&&(o=_({},a),Fd(o,u)),t=t.ownerDocument||t,u=t.createElement("script"),xn(u),In(u,"link",o),t.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,Tc(o,a.precedence,t));return n.instance}function Tc(t,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,d=u,M=0;M<o.length;M++){var P=o[M];if(P.dataset.precedence===n)d=P;else if(d!==u)break}d?d.parentNode.insertBefore(t,d.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function Id(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function Fd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var Ac=null;function Nx(t,n,a){if(Ac===null){var o=new Map,u=Ac=new Map;u.set(a,o)}else u=Ac,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(t))return o;for(o.set(t,null),a=a.getElementsByTagName(t),u=0;u<a.length;u++){var d=a[u];if(!(d[Ua]||d[dn]||t==="link"&&d.getAttribute("rel")==="stylesheet")&&d.namespaceURI!=="http://www.w3.org/2000/svg"){var M=d.getAttribute(n)||"";M=t+M;var P=o.get(M);P?P.push(d):o.set(M,[d])}}return o}function Dx(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function fb(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return t=n.disabled,typeof n.precedence=="string"&&t==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function zx(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function db(t,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=zr(o.href),d=n.querySelector(Jo(u));if(d){n=d._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=wc.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=d,xn(d);return}d=n.ownerDocument||n,o=Cx(o),(u=Ri.get(u))&&Id(o,u),d=d.createElement("link"),xn(d);var M=d;M._p=new Promise(function(P,$){M.onload=P,M.onerror=$}),In(d,"link",o),a.instance=d}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=wc.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var Bd=0;function hb(t,n){return t.stylesheets&&t.count===0&&Rc(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var o=setTimeout(function(){if(t.stylesheets&&Rc(t,t.stylesheets),t.unsuspend){var d=t.unsuspend;t.unsuspend=null,d()}},6e4+n);0<t.imgBytes&&Bd===0&&(Bd=62500*q1());var u=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&Rc(t,t.stylesheets),t.unsuspend)){var d=t.unsuspend;t.unsuspend=null,d()}},(t.imgBytes>Bd?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function wc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Rc(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Cc=null;function Rc(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Cc=new Map,n.forEach(pb,t),Cc=null,wc.call(t))}function pb(t,n){if(!(n.state.loading&4)){var a=Cc.get(t);if(a)var o=a.get(null);else{a=new Map,Cc.set(t,a);for(var u=t.querySelectorAll("link[data-precedence],style[data-precedence]"),d=0;d<u.length;d++){var M=u[d];(M.nodeName==="LINK"||M.getAttribute("media")!=="not all")&&(a.set(M.dataset.precedence,M),o=M)}o&&a.set(null,o)}u=n.instance,M=u.getAttribute("data-precedence"),d=a.get(M)||o,d===o&&a.set(null,u),a.set(M,u),this.count++,o=wc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),d?d.parentNode.insertBefore(u,d.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(u,t.firstChild)),n.state.loading|=4}}var el={$$typeof:I,Provider:null,Consumer:null,_currentValue:ie,_currentValue2:ie,_threadCount:0};function mb(t,n,a,o,u,d,M,P,$){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=et(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=et(0),this.hiddenUpdates=et(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=d,this.onRecoverableError=M,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=$,this.incompleteTransitions=new Map}function Lx(t,n,a,o,u,d,M,P,$,me,Te,Ce){return t=new mb(t,n,a,M,$,me,Te,Ce,P),n=1,d===!0&&(n|=24),d=ci(3,null,null,n),t.current=d,d.stateNode=t,n=vf(),n.refCount++,t.pooledCache=n,n.refCount++,d.memoizedState={element:o,isDehydrated:a,cache:n},Sf(d),t}function Ux(t){return t?(t=ur,t):ur}function Ox(t,n,a,o,u,d){u=Ux(u),o.context===null?o.context=u:o.pendingContext=u,o=Xa(n),o.payload={element:a},d=d===void 0?null:d,d!==null&&(o.callback=d),a=Wa(t,o,n),a!==null&&(ei(a,t,n),zo(a,t,n))}function Px(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function kd(t,n){Px(t,n),(t=t.alternate)&&Px(t,n)}function Ix(t){if(t.tag===13||t.tag===31){var n=Cs(t,67108864);n!==null&&ei(n,t,67108864),kd(t,67108864)}}function Fx(t){if(t.tag===13||t.tag===31){var n=pi();n=Ss(n);var a=Cs(t,n);a!==null&&ei(a,t,n),kd(t,n)}}var Nc=!0;function gb(t,n,a,o){var u=D.T;D.T=null;var d=k.p;try{k.p=2,Hd(t,n,a,o)}finally{k.p=d,D.T=u}}function xb(t,n,a,o){var u=D.T;D.T=null;var d=k.p;try{k.p=8,Hd(t,n,a,o)}finally{k.p=d,D.T=u}}function Hd(t,n,a,o){if(Nc){var u=Gd(o);if(u===null)wd(t,n,o,Dc,a),kx(t,o);else if(_b(u,t,n,a,o))o.stopPropagation();else if(kx(t,o),n&4&&-1<vb.indexOf(t)){for(;u!==null;){var d=Pa(u);if(d!==null)switch(d.tag){case 3:if(d=d.stateNode,d.current.memoizedState.isDehydrated){var M=Ue(d.pendingLanes);if(M!==0){var P=d;for(P.pendingLanes|=2,P.entangledLanes|=2;M;){var $=1<<31-He(M);P.entanglements[1]|=$,M&=~$}Wi(d),(Bt&6)===0&&(hc=Pe()+500,Yo(0))}}break;case 31:case 13:P=Cs(d,2),P!==null&&ei(P,d,2),mc(),kd(d,2)}if(d=Gd(o),d===null&&wd(t,n,o,Dc,a),d===u)break;u=d}u!==null&&o.stopPropagation()}else wd(t,n,o,null,a)}}function Gd(t){return t=Vu(t),Vd(t)}var Dc=null;function Vd(t){if(Dc=null,t=Oa(t),t!==null){var n=c(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=f(n),t!==null)return t;t=null}else if(a===31){if(t=p(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return Dc=t,null}function Bx(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(kt()){case N:return 2;case E:return 8;case K:case ue:return 32;case he:return 268435456;default:return 32}default:return 32}}var jd=!1,is=null,as=null,ss=null,tl=new Map,nl=new Map,rs=[],vb="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function kx(t,n){switch(t){case"focusin":case"focusout":is=null;break;case"dragenter":case"dragleave":as=null;break;case"mouseover":case"mouseout":ss=null;break;case"pointerover":case"pointerout":tl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":nl.delete(n.pointerId)}}function il(t,n,a,o,u,d){return t===null||t.nativeEvent!==d?(t={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:d,targetContainers:[u]},n!==null&&(n=Pa(n),n!==null&&Ix(n)),t):(t.eventSystemFlags|=o,n=t.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),t)}function _b(t,n,a,o,u){switch(n){case"focusin":return is=il(is,t,n,a,o,u),!0;case"dragenter":return as=il(as,t,n,a,o,u),!0;case"mouseover":return ss=il(ss,t,n,a,o,u),!0;case"pointerover":var d=u.pointerId;return tl.set(d,il(tl.get(d)||null,t,n,a,o,u)),!0;case"gotpointercapture":return d=u.pointerId,nl.set(d,il(nl.get(d)||null,t,n,a,o,u)),!0}return!1}function Hx(t){var n=Oa(t.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=f(a),n!==null){t.blockedOn=n,po(t.priority,function(){Fx(a)});return}}else if(n===31){if(n=p(a),n!==null){t.blockedOn=n,po(t.priority,function(){Fx(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function zc(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=Gd(t.nativeEvent);if(a===null){a=t.nativeEvent;var o=new a.constructor(a.type,a);Gu=o,a.target.dispatchEvent(o),Gu=null}else return n=Pa(a),n!==null&&Ix(n),t.blockedOn=a,!1;n.shift()}return!0}function Gx(t,n,a){zc(t)&&a.delete(n)}function yb(){jd=!1,is!==null&&zc(is)&&(is=null),as!==null&&zc(as)&&(as=null),ss!==null&&zc(ss)&&(ss=null),tl.forEach(Gx),nl.forEach(Gx)}function Lc(t,n){t.blockedOn===n&&(t.blockedOn=null,jd||(jd=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,yb)))}var Uc=null;function Vx(t){Uc!==t&&(Uc=t,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){Uc===t&&(Uc=null);for(var n=0;n<t.length;n+=3){var a=t[n],o=t[n+1],u=t[n+2];if(typeof o!="function"){if(Vd(o||a)===null)continue;break}var d=Pa(a);d!==null&&(t.splice(n,3),n-=3,Gf(d,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function Ur(t){function n($){return Lc($,t)}is!==null&&Lc(is,t),as!==null&&Lc(as,t),ss!==null&&Lc(ss,t),tl.forEach(n),nl.forEach(n);for(var a=0;a<rs.length;a++){var o=rs[a];o.blockedOn===t&&(o.blockedOn=null)}for(;0<rs.length&&(a=rs[0],a.blockedOn===null);)Hx(a),a.blockedOn===null&&rs.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],d=a[o+1],M=u[Ln]||null;if(typeof d=="function")M||Vx(a);else if(M){var P=null;if(d&&d.hasAttribute("formAction")){if(u=d,M=d[Ln]||null)P=M.formAction;else if(Vd(u)!==null)continue}else P=M.action;typeof P=="function"?a[o+1]=P:(a.splice(o,3),o-=3),Vx(a)}}}function jx(){function t(d){d.canIntercept&&d.info==="react-transition"&&d.intercept({handler:function(){return new Promise(function(M){return u=M})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var d=navigation.currentEntry;d&&d.url!=null&&navigation.navigate(d.url,{state:d.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function Xd(t){this._internalRoot=t}Oc.prototype.render=Xd.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=pi();Ox(a,o,t,n,null,null)},Oc.prototype.unmount=Xd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;Ox(t.current,2,null,t,null,null),mc(),n[ia]=null}};function Oc(t){this._internalRoot=t}Oc.prototype.unstable_scheduleHydration=function(t){if(t){var n=ho();t={blockedOn:null,target:t,priority:n};for(var a=0;a<rs.length&&n!==0&&n<rs[a].priority;a++);rs.splice(a,0,t),a===0&&Hx(t)}};var Xx=e.version;if(Xx!=="19.2.6")throw Error(s(527,Xx,"19.2.6"));k.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(s(188)):(t=Object.keys(t).join(","),Error(s(268,t)));return t=h(n),t=t!==null?v(t):null,t=t===null?null:t.stateNode,t};var bb={bundleType:0,version:"19.2.6",rendererPackageName:"react-dom",currentDispatcherRef:D,reconcilerVersion:"19.2.6"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Pc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Pc.isDisabled&&Pc.supportsFiber)try{de=Pc.inject(bb),be=Pc}catch{}}return sl.createRoot=function(t,n){if(!l(t))throw Error(s(299));var a=!1,o="",u=J0,d=$0,M=eg;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(d=n.onCaughtError),n.onRecoverableError!==void 0&&(M=n.onRecoverableError)),n=Lx(t,1,!1,null,null,a,o,null,u,d,M,jx),t[ia]=n.current,Ad(t),new Xd(n)},sl.hydrateRoot=function(t,n,a){if(!l(t))throw Error(s(299));var o=!1,u="",d=J0,M=$0,P=eg,$=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(d=a.onUncaughtError),a.onCaughtError!==void 0&&(M=a.onCaughtError),a.onRecoverableError!==void 0&&(P=a.onRecoverableError),a.formState!==void 0&&($=a.formState)),n=Lx(t,1,!0,n,a??null,o,u,$,d,M,P,jx),n.context=Ux(null),a=n.current,o=pi(),o=Ss(o),u=Xa(o),u.callback=null,Wa(a,u,o),a=o,n.current.lanes=a,dt(n,a),Wi(n),t[ia]=n.current,Ad(t),new Oc(n)},sl.version="19.2.6",sl}var tv;function Db(){if(tv)return Yd.exports;tv=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Yd.exports=Nb(),Yd.exports}var zb=Db();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pp="184",$r={ROTATE:0,DOLLY:1,PAN:2},Qr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Lb=0,nv=1,Ub=2,mu=1,N_=2,pl=3,vs=0,ii=1,Aa=2,Ra=0,eo=1,iv=2,av=3,sv=4,Ob=5,Xs=100,Pb=101,Ib=102,Fb=103,Bb=104,kb=200,Hb=201,Gb=202,Vb=203,Ih=204,Fh=205,jb=206,Xb=207,Wb=208,qb=209,Yb=210,Zb=211,Kb=212,Qb=213,Jb=214,Bh=0,kh=1,Hh=2,io=3,Gh=4,Vh=5,jh=6,Xh=7,D_=0,$b=1,eS=2,$i=0,z_=1,L_=2,U_=3,Ip=4,O_=5,P_=6,I_=7,F_=300,$s=301,ao=302,Jd=303,$d=304,Uu=306,Wh=1e3,wa=1001,qh=1002,Fn=1003,tS=1004,Ic=1005,jn=1006,eh=1007,qs=1008,_i=1009,B_=1010,k_=1011,bl=1012,Fp=1013,ta=1014,Qi=1015,Da=1016,Bp=1017,kp=1018,Sl=1020,H_=35902,G_=35899,V_=1021,j_=1022,Hi=1023,za=1026,Ys=1027,X_=1028,Hp=1029,er=1030,Gp=1031,Vp=1033,gu=33776,xu=33777,vu=33778,_u=33779,Yh=35840,Zh=35841,Kh=35842,Qh=35843,Jh=36196,$h=37492,ep=37496,tp=37488,np=37489,Su=37490,ip=37491,ap=37808,sp=37809,rp=37810,op=37811,lp=37812,cp=37813,up=37814,fp=37815,dp=37816,hp=37817,pp=37818,mp=37819,gp=37820,xp=37821,vp=36492,_p=36494,yp=36495,bp=36283,Sp=36284,Mu=36285,Mp=36286,nS=3200,Ep=0,iS=1,gs="",Di="srgb",Eu="srgb-linear",Tu="linear",Yt="srgb",Or=7680,rv=519,aS=512,sS=513,rS=514,jp=515,oS=516,lS=517,Xp=518,cS=519,ov=35044,lv="300 es",Ji=2e3,Ml=2001;function uS(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Au(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function fS(){const r=Au("canvas");return r.style.display="block",r}const cv={};function uv(...r){const e="THREE."+r.shift();console.log(e,...r)}function W_(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const i=r[1];i&&i.isStackTrace?r[0]+=" "+i.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function ut(...r){r=W_(r);const e="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.warn(i.getError(e)):console.warn(e,...r)}}function Ut(...r){r=W_(r);const e="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.error(i.getError(e)):console.error(e,...r)}}function Tp(...r){const e=r.join(" ");e in cv||(cv[e]=!0,ut(...r))}function dS(r,e,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}const hS={[Bh]:kh,[Hh]:jh,[Gh]:Xh,[io]:Vh,[kh]:Bh,[jh]:Hh,[Xh]:Gh,[Vh]:io};class bs{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(i)===-1&&s[e].push(i)}hasEventListener(e,i){const s=this._listeners;return s===void 0?!1:s[e]!==void 0&&s[e].indexOf(i)!==-1}removeEventListener(e,i){const s=this._listeners;if(s===void 0)return;const l=s[e];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const s=i[e.type];if(s!==void 0){e.target=this;const l=s.slice(0);for(let c=0,f=l.length;c<f;c++)l[c].call(this,e);e.target=null}}}const Gn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let fv=1234567;const xl=Math.PI/180,El=180/Math.PI;function lo(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(Gn[r&255]+Gn[r>>8&255]+Gn[r>>16&255]+Gn[r>>24&255]+"-"+Gn[e&255]+Gn[e>>8&255]+"-"+Gn[e>>16&15|64]+Gn[e>>24&255]+"-"+Gn[i&63|128]+Gn[i>>8&255]+"-"+Gn[i>>16&255]+Gn[i>>24&255]+Gn[s&255]+Gn[s>>8&255]+Gn[s>>16&255]+Gn[s>>24&255]).toLowerCase()}function At(r,e,i){return Math.max(e,Math.min(i,r))}function Wp(r,e){return(r%e+e)%e}function pS(r,e,i,s,l){return s+(r-e)*(l-s)/(i-e)}function mS(r,e,i){return r!==e?(i-r)/(e-r):0}function vl(r,e,i){return(1-i)*r+i*e}function gS(r,e,i,s){return vl(r,e,1-Math.exp(-i*s))}function xS(r,e=1){return e-Math.abs(Wp(r,e*2)-e)}function vS(r,e,i){return r<=e?0:r>=i?1:(r=(r-e)/(i-e),r*r*(3-2*r))}function _S(r,e,i){return r<=e?0:r>=i?1:(r=(r-e)/(i-e),r*r*r*(r*(r*6-15)+10))}function yS(r,e){return r+Math.floor(Math.random()*(e-r+1))}function bS(r,e){return r+Math.random()*(e-r)}function SS(r){return r*(.5-Math.random())}function MS(r){r!==void 0&&(fv=r);let e=fv+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ES(r){return r*xl}function TS(r){return r*El}function AS(r){return(r&r-1)===0&&r!==0}function wS(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function CS(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function RS(r,e,i,s,l){const c=Math.cos,f=Math.sin,p=c(i/2),m=f(i/2),h=c((e+s)/2),v=f((e+s)/2),_=c((e-s)/2),x=f((e-s)/2),y=c((s-e)/2),T=f((s-e)/2);switch(l){case"XYX":r.set(p*v,m*_,m*x,p*h);break;case"YZY":r.set(m*x,p*v,m*_,p*h);break;case"ZXZ":r.set(m*_,m*x,p*v,p*h);break;case"XZX":r.set(p*v,m*T,m*y,p*h);break;case"YXY":r.set(m*y,p*v,m*T,p*h);break;case"ZYZ":r.set(m*T,m*y,p*v,p*h);break;default:ut("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+l)}}function Kr(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Wn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const yu={DEG2RAD:xl,RAD2DEG:El,generateUUID:lo,clamp:At,euclideanModulo:Wp,mapLinear:pS,inverseLerp:mS,lerp:vl,damp:gS,pingpong:xS,smoothstep:vS,smootherstep:_S,randInt:yS,randFloat:bS,randFloatSpread:SS,seededRandom:MS,degToRad:ES,radToDeg:TS,isPowerOfTwo:AS,ceilPowerOfTwo:wS,floorPowerOfTwo:CS,setQuaternionFromProperEuler:RS,normalize:Wn,denormalize:Kr},cm=class cm{constructor(e=0,i=0){this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,s=this.y,l=e.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=At(this.x,e.x,i.x),this.y=At(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=At(this.x,e,i),this.y=At(this.y,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(At(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(At(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y;return i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-e.x,f=this.y-e.y;return this.x=c*s-f*l+e.x,this.y=c*l+f*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};cm.prototype.isVector2=!0;let ht=cm;class _s{constructor(e=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=s,this._w=l}static slerpFlat(e,i,s,l,c,f,p){let m=s[l+0],h=s[l+1],v=s[l+2],_=s[l+3],x=c[f+0],y=c[f+1],T=c[f+2],R=c[f+3];if(_!==R||m!==x||h!==y||v!==T){let S=m*x+h*y+v*T+_*R;S<0&&(x=-x,y=-y,T=-T,R=-R,S=-S);let b=1-p;if(S<.9995){const C=Math.acos(S),I=Math.sin(C);b=Math.sin(b*C)/I,p=Math.sin(p*C)/I,m=m*b+x*p,h=h*b+y*p,v=v*b+T*p,_=_*b+R*p}else{m=m*b+x*p,h=h*b+y*p,v=v*b+T*p,_=_*b+R*p;const C=1/Math.sqrt(m*m+h*h+v*v+_*_);m*=C,h*=C,v*=C,_*=C}}e[i]=m,e[i+1]=h,e[i+2]=v,e[i+3]=_}static multiplyQuaternionsFlat(e,i,s,l,c,f){const p=s[l],m=s[l+1],h=s[l+2],v=s[l+3],_=c[f],x=c[f+1],y=c[f+2],T=c[f+3];return e[i]=p*T+v*_+m*y-h*x,e[i+1]=m*T+v*x+h*_-p*y,e[i+2]=h*T+v*y+p*x-m*_,e[i+3]=v*T-p*_-m*x-h*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,s,l){return this._x=e,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const s=e._x,l=e._y,c=e._z,f=e._order,p=Math.cos,m=Math.sin,h=p(s/2),v=p(l/2),_=p(c/2),x=m(s/2),y=m(l/2),T=m(c/2);switch(f){case"XYZ":this._x=x*v*_+h*y*T,this._y=h*y*_-x*v*T,this._z=h*v*T+x*y*_,this._w=h*v*_-x*y*T;break;case"YXZ":this._x=x*v*_+h*y*T,this._y=h*y*_-x*v*T,this._z=h*v*T-x*y*_,this._w=h*v*_+x*y*T;break;case"ZXY":this._x=x*v*_-h*y*T,this._y=h*y*_+x*v*T,this._z=h*v*T+x*y*_,this._w=h*v*_-x*y*T;break;case"ZYX":this._x=x*v*_-h*y*T,this._y=h*y*_+x*v*T,this._z=h*v*T-x*y*_,this._w=h*v*_+x*y*T;break;case"YZX":this._x=x*v*_+h*y*T,this._y=h*y*_+x*v*T,this._z=h*v*T-x*y*_,this._w=h*v*_-x*y*T;break;case"XZY":this._x=x*v*_-h*y*T,this._y=h*y*_-x*v*T,this._z=h*v*T+x*y*_,this._w=h*v*_+x*y*T;break;default:ut("Quaternion: .setFromEuler() encountered an unknown order: "+f)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const s=i/2,l=Math.sin(s);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,s=i[0],l=i[4],c=i[8],f=i[1],p=i[5],m=i[9],h=i[2],v=i[6],_=i[10],x=s+p+_;if(x>0){const y=.5/Math.sqrt(x+1);this._w=.25/y,this._x=(v-m)*y,this._y=(c-h)*y,this._z=(f-l)*y}else if(s>p&&s>_){const y=2*Math.sqrt(1+s-p-_);this._w=(v-m)/y,this._x=.25*y,this._y=(l+f)/y,this._z=(c+h)/y}else if(p>_){const y=2*Math.sqrt(1+p-s-_);this._w=(c-h)/y,this._x=(l+f)/y,this._y=.25*y,this._z=(m+v)/y}else{const y=2*Math.sqrt(1+_-s-p);this._w=(f-l)/y,this._x=(c+h)/y,this._y=(m+v)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let s=e.dot(i)+1;return s<1e-8?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(At(this.dot(e),-1,1)))}rotateTowards(e,i){const s=this.angleTo(e);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const s=e._x,l=e._y,c=e._z,f=e._w,p=i._x,m=i._y,h=i._z,v=i._w;return this._x=s*v+f*p+l*h-c*m,this._y=l*v+f*m+c*p-s*h,this._z=c*v+f*h+s*m-l*p,this._w=f*v-s*p-l*m-c*h,this._onChangeCallback(),this}slerp(e,i){let s=e._x,l=e._y,c=e._z,f=e._w,p=this.dot(e);p<0&&(s=-s,l=-l,c=-c,f=-f,p=-p);let m=1-i;if(p<.9995){const h=Math.acos(p),v=Math.sin(h);m=Math.sin(m*h)/v,i=Math.sin(i*h)/v,this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+f*i,this._onChangeCallback()}else this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+f*i,this.normalize();return this}slerpQuaternions(e,i,s){return this.copy(e).slerp(i,s)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(e),l*Math.cos(e),c*Math.sin(i),c*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const um=class um{constructor(e=0,i=0,s=0){this.x=e,this.y=i,this.z=s}set(e,i,s){return s===void 0&&(s=this.z),this.x=e,this.y=i,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(dv.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(dv.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,s=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,c=e.elements,f=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*f,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*f,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*f,this}applyQuaternion(e){const i=this.x,s=this.y,l=this.z,c=e.x,f=e.y,p=e.z,m=e.w,h=2*(f*l-p*s),v=2*(p*i-c*l),_=2*(c*s-f*i);return this.x=i+m*h+f*_-p*v,this.y=s+m*v+p*h-c*_,this.z=l+m*_+c*v-f*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,s=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=At(this.x,e.x,i.x),this.y=At(this.y,e.y,i.y),this.z=At(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=At(this.x,e,i),this.y=At(this.y,e,i),this.z=At(this.z,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(At(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const s=e.x,l=e.y,c=e.z,f=i.x,p=i.y,m=i.z;return this.x=l*m-c*p,this.y=c*f-s*m,this.z=s*p-l*f,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const s=e.dot(this)/i;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return th.copy(this).projectOnVector(e),this.sub(th)}reflect(e){return this.sub(th.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(At(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y,l=this.z-e.z;return i*i+s*s+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,s){const l=Math.sin(i)*e;return this.x=l*Math.sin(s),this.y=Math.cos(i)*e,this.z=l*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,s){return this.x=e*Math.sin(i),this.y=s,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(e),this.y=i,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};um.prototype.isVector3=!0;let le=um;const th=new le,dv=new _s,fm=class fm{constructor(e,i,s,l,c,f,p,m,h){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,s,l,c,f,p,m,h)}set(e,i,s,l,c,f,p,m,h){const v=this.elements;return v[0]=e,v[1]=l,v[2]=p,v[3]=i,v[4]=c,v[5]=m,v[6]=s,v[7]=f,v[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(e,i,s){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,c=this.elements,f=s[0],p=s[3],m=s[6],h=s[1],v=s[4],_=s[7],x=s[2],y=s[5],T=s[8],R=l[0],S=l[3],b=l[6],C=l[1],I=l[4],F=l[7],q=l[2],z=l[5],j=l[8];return c[0]=f*R+p*C+m*q,c[3]=f*S+p*I+m*z,c[6]=f*b+p*F+m*j,c[1]=h*R+v*C+_*q,c[4]=h*S+v*I+_*z,c[7]=h*b+v*F+_*j,c[2]=x*R+y*C+T*q,c[5]=x*S+y*I+T*z,c[8]=x*b+y*F+T*j,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],f=e[4],p=e[5],m=e[6],h=e[7],v=e[8];return i*f*v-i*p*h-s*c*v+s*p*m+l*c*h-l*f*m}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],f=e[4],p=e[5],m=e[6],h=e[7],v=e[8],_=v*f-p*h,x=p*m-v*c,y=h*c-f*m,T=i*_+s*x+l*y;if(T===0)return this.set(0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=_*R,e[1]=(l*h-v*s)*R,e[2]=(p*s-l*f)*R,e[3]=x*R,e[4]=(v*i-l*m)*R,e[5]=(l*c-p*i)*R,e[6]=y*R,e[7]=(s*m-h*i)*R,e[8]=(f*i-s*c)*R,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,s,l,c,f,p){const m=Math.cos(c),h=Math.sin(c);return this.set(s*m,s*h,-s*(m*f+h*p)+f+e,-l*h,l*m,-l*(-h*f+m*p)+p+i,0,0,1),this}scale(e,i){return this.premultiply(nh.makeScale(e,i)),this}rotate(e){return this.premultiply(nh.makeRotation(-e)),this}translate(e,i){return this.premultiply(nh.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<9;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}};fm.prototype.isMatrix3=!0;let yt=fm;const nh=new yt,hv=new yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),pv=new yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function NS(){const r={enabled:!0,workingColorSpace:Eu,spaces:{},convert:function(l,c,f){return this.enabled===!1||c===f||!c||!f||(this.spaces[c].transfer===Yt&&(l.r=Na(l.r),l.g=Na(l.g),l.b=Na(l.b)),this.spaces[c].primaries!==this.spaces[f].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[f].fromXYZ)),this.spaces[f].transfer===Yt&&(l.r=to(l.r),l.g=to(l.g),l.b=to(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===gs?Tu:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,f){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[f].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return Tp("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return Tp("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,c)}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[Eu]:{primaries:e,whitePoint:s,transfer:Tu,toXYZ:hv,fromXYZ:pv,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Di},outputColorSpaceConfig:{drawingBufferColorSpace:Di}},[Di]:{primaries:e,whitePoint:s,transfer:Yt,toXYZ:hv,fromXYZ:pv,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Di}}}),r}const Lt=NS();function Na(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function to(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Pr;class DS{static getDataURL(e,i="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let s;if(e instanceof HTMLCanvasElement)s=e;else{Pr===void 0&&(Pr=Au("canvas")),Pr.width=e.width,Pr.height=e.height;const l=Pr.getContext("2d");e instanceof ImageData?l.putImageData(e,0,0):l.drawImage(e,0,0,e.width,e.height),s=Pr}return s.toDataURL(i)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=Au("canvas");i.width=e.width,i.height=e.height;const s=i.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const l=s.getImageData(0,0,e.width,e.height),c=l.data;for(let f=0;f<c.length;f++)c[f]=Na(c[f]/255)*255;return s.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(Na(i[s]/255)*255):i[s]=Na(i[s]);return{data:i,width:e.width,height:e.height}}else return ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let zS=0;class qp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zS++}),this.uuid=lo(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?e.set(i.videoWidth,i.videoHeight,0):typeof VideoFrame<"u"&&i instanceof VideoFrame?e.set(i.displayWidth,i.displayHeight,0):i!==null?e.set(i.width,i.height,i.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let f=0,p=l.length;f<p;f++)l[f].isDataTexture?c.push(ih(l[f].image)):c.push(ih(l[f]))}else c=ih(l);s.url=c}return i||(e.images[this.uuid]=s),s}}function ih(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?DS.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(ut("Texture: Unable to serialize Texture."),{})}let LS=0;const ah=new le;class Yn extends bs{constructor(e=Yn.DEFAULT_IMAGE,i=Yn.DEFAULT_MAPPING,s=wa,l=wa,c=jn,f=qs,p=Hi,m=_i,h=Yn.DEFAULT_ANISOTROPY,v=gs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:LS++}),this.uuid=lo(),this.name="",this.source=new qp(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=f,this.anisotropy=h,this.format=p,this.internalFormat=null,this.type=m,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=v,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ah).x}get height(){return this.source.getSize(ah).y}get depth(){return this.source.getSize(ah).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const i in e){const s=e[i];if(s===void 0){ut(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){ut(`Texture.setValues(): property '${i}' does not exist.`);continue}l&&s&&l.isVector2&&s.isVector2||l&&s&&l.isVector3&&s.isVector3||l&&s&&l.isMatrix3&&s.isMatrix3?l.copy(s):this[i]=s}}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==F_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wh:e.x=e.x-Math.floor(e.x);break;case wa:e.x=e.x<0?0:1;break;case qh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wh:e.y=e.y-Math.floor(e.y);break;case wa:e.y=e.y<0?0:1;break;case qh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Yn.DEFAULT_IMAGE=null;Yn.DEFAULT_MAPPING=F_;Yn.DEFAULT_ANISOTROPY=1;const dm=class dm{constructor(e=0,i=0,s=0,l=1){this.x=e,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,s,l){return this.x=e,this.y=i,this.z=s,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,c=this.w,f=e.elements;return this.x=f[0]*i+f[4]*s+f[8]*l+f[12]*c,this.y=f[1]*i+f[5]*s+f[9]*l+f[13]*c,this.z=f[2]*i+f[6]*s+f[10]*l+f[14]*c,this.w=f[3]*i+f[7]*s+f[11]*l+f[15]*c,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,s,l,c;const m=e.elements,h=m[0],v=m[4],_=m[8],x=m[1],y=m[5],T=m[9],R=m[2],S=m[6],b=m[10];if(Math.abs(v-x)<.01&&Math.abs(_-R)<.01&&Math.abs(T-S)<.01){if(Math.abs(v+x)<.1&&Math.abs(_+R)<.1&&Math.abs(T+S)<.1&&Math.abs(h+y+b-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const I=(h+1)/2,F=(y+1)/2,q=(b+1)/2,z=(v+x)/4,j=(_+R)/4,w=(T+S)/4;return I>F&&I>q?I<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(I),l=z/s,c=j/s):F>q?F<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(F),s=z/l,c=w/l):q<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(q),s=j/c,l=w/c),this.set(s,l,c,i),this}let C=Math.sqrt((S-T)*(S-T)+(_-R)*(_-R)+(x-v)*(x-v));return Math.abs(C)<.001&&(C=1),this.x=(S-T)/C,this.y=(_-R)/C,this.z=(x-v)/C,this.w=Math.acos((h+y+b-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=At(this.x,e.x,i.x),this.y=At(this.y,e.y,i.y),this.z=At(this.z,e.z,i.z),this.w=At(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=At(this.x,e,i),this.y=At(this.y,e,i),this.z=At(this.z,e,i),this.w=At(this.w,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(At(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this.w=e.w+(i.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};dm.prototype.isVector4=!0;let fn=dm;class US extends bs{constructor(e=1,i=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},s),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=s.depth,this.scissor=new fn(0,0,e,i),this.scissorTest=!1,this.viewport=new fn(0,0,e,i),this.textures=[];const l={width:e,height:i,depth:s.depth},c=new Yn(l),f=s.count;for(let p=0;p<f;p++)this.textures[p]=c.clone(),this.textures[p].isRenderTargetTexture=!0,this.textures[p].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview}_setTextureOptions(e={}){const i={minFilter:jn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(i.mapping=e.mapping),e.wrapS!==void 0&&(i.wrapS=e.wrapS),e.wrapT!==void 0&&(i.wrapT=e.wrapT),e.wrapR!==void 0&&(i.wrapR=e.wrapR),e.magFilter!==void 0&&(i.magFilter=e.magFilter),e.minFilter!==void 0&&(i.minFilter=e.minFilter),e.format!==void 0&&(i.format=e.format),e.type!==void 0&&(i.type=e.type),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(i.colorSpace=e.colorSpace),e.flipY!==void 0&&(i.flipY=e.flipY),e.generateMipmaps!==void 0&&(i.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(i.internalFormat=e.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(i)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,s=1){if(this.width!==e||this.height!==i||this.depth!==s){this.width=e,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=s,this.textures[l].isData3DTexture!==!0&&(this.textures[l].isArrayTexture=this.textures[l].image.depth>1);this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},e.textures[i].image);this.textures[i].source=new qp(l)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ea extends US{constructor(e=1,i=1,s={}){super(e,i,s),this.isWebGLRenderTarget=!0}}class q_ extends Yn{constructor(e=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=Fn,this.minFilter=Fn,this.wrapR=wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class OS extends Yn{constructor(e=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=Fn,this.minFilter=Fn,this.wrapR=wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Lu=class Lu{constructor(e,i,s,l,c,f,p,m,h,v,_,x,y,T,R,S){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,s,l,c,f,p,m,h,v,_,x,y,T,R,S)}set(e,i,s,l,c,f,p,m,h,v,_,x,y,T,R,S){const b=this.elements;return b[0]=e,b[4]=i,b[8]=s,b[12]=l,b[1]=c,b[5]=f,b[9]=p,b[13]=m,b[2]=h,b[6]=v,b[10]=_,b[14]=x,b[3]=y,b[7]=T,b[11]=R,b[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Lu().fromArray(this.elements)}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(e){const i=this.elements,s=e.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,s){return this.determinant()===0?(e.set(1,0,0),i.set(0,1,0),s.set(0,0,1),this):(e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this)}makeBasis(e,i,s){return this.set(e.x,i.x,s.x,0,e.y,i.y,s.y,0,e.z,i.z,s.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const i=this.elements,s=e.elements,l=1/Ir.setFromMatrixColumn(e,0).length(),c=1/Ir.setFromMatrixColumn(e,1).length(),f=1/Ir.setFromMatrixColumn(e,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*f,i[9]=s[9]*f,i[10]=s[10]*f,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,s=e.x,l=e.y,c=e.z,f=Math.cos(s),p=Math.sin(s),m=Math.cos(l),h=Math.sin(l),v=Math.cos(c),_=Math.sin(c);if(e.order==="XYZ"){const x=f*v,y=f*_,T=p*v,R=p*_;i[0]=m*v,i[4]=-m*_,i[8]=h,i[1]=y+T*h,i[5]=x-R*h,i[9]=-p*m,i[2]=R-x*h,i[6]=T+y*h,i[10]=f*m}else if(e.order==="YXZ"){const x=m*v,y=m*_,T=h*v,R=h*_;i[0]=x+R*p,i[4]=T*p-y,i[8]=f*h,i[1]=f*_,i[5]=f*v,i[9]=-p,i[2]=y*p-T,i[6]=R+x*p,i[10]=f*m}else if(e.order==="ZXY"){const x=m*v,y=m*_,T=h*v,R=h*_;i[0]=x-R*p,i[4]=-f*_,i[8]=T+y*p,i[1]=y+T*p,i[5]=f*v,i[9]=R-x*p,i[2]=-f*h,i[6]=p,i[10]=f*m}else if(e.order==="ZYX"){const x=f*v,y=f*_,T=p*v,R=p*_;i[0]=m*v,i[4]=T*h-y,i[8]=x*h+R,i[1]=m*_,i[5]=R*h+x,i[9]=y*h-T,i[2]=-h,i[6]=p*m,i[10]=f*m}else if(e.order==="YZX"){const x=f*m,y=f*h,T=p*m,R=p*h;i[0]=m*v,i[4]=R-x*_,i[8]=T*_+y,i[1]=_,i[5]=f*v,i[9]=-p*v,i[2]=-h*v,i[6]=y*_+T,i[10]=x-R*_}else if(e.order==="XZY"){const x=f*m,y=f*h,T=p*m,R=p*h;i[0]=m*v,i[4]=-_,i[8]=h*v,i[1]=x*_+R,i[5]=f*v,i[9]=y*_-T,i[2]=T*_-y,i[6]=p*v,i[10]=R*_+x}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(PS,e,IS)}lookAt(e,i,s){const l=this.elements;return mi.subVectors(e,i),mi.lengthSq()===0&&(mi.z=1),mi.normalize(),ls.crossVectors(s,mi),ls.lengthSq()===0&&(Math.abs(s.z)===1?mi.x+=1e-4:mi.z+=1e-4,mi.normalize(),ls.crossVectors(s,mi)),ls.normalize(),Fc.crossVectors(mi,ls),l[0]=ls.x,l[4]=Fc.x,l[8]=mi.x,l[1]=ls.y,l[5]=Fc.y,l[9]=mi.y,l[2]=ls.z,l[6]=Fc.z,l[10]=mi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,c=this.elements,f=s[0],p=s[4],m=s[8],h=s[12],v=s[1],_=s[5],x=s[9],y=s[13],T=s[2],R=s[6],S=s[10],b=s[14],C=s[3],I=s[7],F=s[11],q=s[15],z=l[0],j=l[4],w=l[8],O=l[12],G=l[1],V=l[5],Q=l[9],Z=l[13],ae=l[2],W=l[6],D=l[10],k=l[14],ie=l[3],J=l[7],H=l[11],B=l[15];return c[0]=f*z+p*G+m*ae+h*ie,c[4]=f*j+p*V+m*W+h*J,c[8]=f*w+p*Q+m*D+h*H,c[12]=f*O+p*Z+m*k+h*B,c[1]=v*z+_*G+x*ae+y*ie,c[5]=v*j+_*V+x*W+y*J,c[9]=v*w+_*Q+x*D+y*H,c[13]=v*O+_*Z+x*k+y*B,c[2]=T*z+R*G+S*ae+b*ie,c[6]=T*j+R*V+S*W+b*J,c[10]=T*w+R*Q+S*D+b*H,c[14]=T*O+R*Z+S*k+b*B,c[3]=C*z+I*G+F*ae+q*ie,c[7]=C*j+I*V+F*W+q*J,c[11]=C*w+I*Q+F*D+q*H,c[15]=C*O+I*Z+F*k+q*B,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[4],l=e[8],c=e[12],f=e[1],p=e[5],m=e[9],h=e[13],v=e[2],_=e[6],x=e[10],y=e[14],T=e[3],R=e[7],S=e[11],b=e[15],C=m*y-h*x,I=p*y-h*_,F=p*x-m*_,q=f*y-h*v,z=f*x-m*v,j=f*_-p*v;return i*(R*C-S*I+b*F)-s*(T*C-S*q+b*z)+l*(T*I-R*q+b*j)-c*(T*F-R*z+S*j)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,s){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=s),this}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],f=e[4],p=e[5],m=e[6],h=e[7],v=e[8],_=e[9],x=e[10],y=e[11],T=e[12],R=e[13],S=e[14],b=e[15],C=i*p-s*f,I=i*m-l*f,F=i*h-c*f,q=s*m-l*p,z=s*h-c*p,j=l*h-c*m,w=v*R-_*T,O=v*S-x*T,G=v*b-y*T,V=_*S-x*R,Q=_*b-y*R,Z=x*b-y*S,ae=C*Z-I*Q+F*V+q*G-z*O+j*w;if(ae===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const W=1/ae;return e[0]=(p*Z-m*Q+h*V)*W,e[1]=(l*Q-s*Z-c*V)*W,e[2]=(R*j-S*z+b*q)*W,e[3]=(x*z-_*j-y*q)*W,e[4]=(m*G-f*Z-h*O)*W,e[5]=(i*Z-l*G+c*O)*W,e[6]=(S*F-T*j-b*I)*W,e[7]=(v*j-x*F+y*I)*W,e[8]=(f*Q-p*G+h*w)*W,e[9]=(s*G-i*Q-c*w)*W,e[10]=(T*z-R*F+b*C)*W,e[11]=(_*F-v*z-y*C)*W,e[12]=(p*O-f*V-m*w)*W,e[13]=(i*V-s*O+l*w)*W,e[14]=(R*I-T*q-S*C)*W,e[15]=(v*q-_*I+x*C)*W,this}scale(e){const i=this.elements,s=e.x,l=e.y,c=e.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(e,i,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,f=e.x,p=e.y,m=e.z,h=c*f,v=c*p;return this.set(h*f+s,h*p-l*m,h*m+l*p,0,h*p+l*m,v*p+s,v*m-l*f,0,h*m-l*p,v*m+l*f,c*m*m+s,0,0,0,0,1),this}makeScale(e,i,s){return this.set(e,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,i,s,l,c,f){return this.set(1,s,c,0,e,1,f,0,i,l,1,0,0,0,0,1),this}compose(e,i,s){const l=this.elements,c=i._x,f=i._y,p=i._z,m=i._w,h=c+c,v=f+f,_=p+p,x=c*h,y=c*v,T=c*_,R=f*v,S=f*_,b=p*_,C=m*h,I=m*v,F=m*_,q=s.x,z=s.y,j=s.z;return l[0]=(1-(R+b))*q,l[1]=(y+F)*q,l[2]=(T-I)*q,l[3]=0,l[4]=(y-F)*z,l[5]=(1-(x+b))*z,l[6]=(S+C)*z,l[7]=0,l[8]=(T+I)*j,l[9]=(S-C)*j,l[10]=(1-(x+R))*j,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,s){const l=this.elements;e.x=l[12],e.y=l[13],e.z=l[14];const c=this.determinant();if(c===0)return s.set(1,1,1),i.identity(),this;let f=Ir.set(l[0],l[1],l[2]).length();const p=Ir.set(l[4],l[5],l[6]).length(),m=Ir.set(l[8],l[9],l[10]).length();c<0&&(f=-f),Ii.copy(this);const h=1/f,v=1/p,_=1/m;return Ii.elements[0]*=h,Ii.elements[1]*=h,Ii.elements[2]*=h,Ii.elements[4]*=v,Ii.elements[5]*=v,Ii.elements[6]*=v,Ii.elements[8]*=_,Ii.elements[9]*=_,Ii.elements[10]*=_,i.setFromRotationMatrix(Ii),s.x=f,s.y=p,s.z=m,this}makePerspective(e,i,s,l,c,f,p=Ji,m=!1){const h=this.elements,v=2*c/(i-e),_=2*c/(s-l),x=(i+e)/(i-e),y=(s+l)/(s-l);let T,R;if(m)T=c/(f-c),R=f*c/(f-c);else if(p===Ji)T=-(f+c)/(f-c),R=-2*f*c/(f-c);else if(p===Ml)T=-f/(f-c),R=-f*c/(f-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+p);return h[0]=v,h[4]=0,h[8]=x,h[12]=0,h[1]=0,h[5]=_,h[9]=y,h[13]=0,h[2]=0,h[6]=0,h[10]=T,h[14]=R,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,i,s,l,c,f,p=Ji,m=!1){const h=this.elements,v=2/(i-e),_=2/(s-l),x=-(i+e)/(i-e),y=-(s+l)/(s-l);let T,R;if(m)T=1/(f-c),R=f/(f-c);else if(p===Ji)T=-2/(f-c),R=-(f+c)/(f-c);else if(p===Ml)T=-1/(f-c),R=-c/(f-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+p);return h[0]=v,h[4]=0,h[8]=0,h[12]=x,h[1]=0,h[5]=_,h[9]=0,h[13]=y,h[2]=0,h[6]=0,h[10]=T,h[14]=R,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<16;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e[i+9]=s[9],e[i+10]=s[10],e[i+11]=s[11],e[i+12]=s[12],e[i+13]=s[13],e[i+14]=s[14],e[i+15]=s[15],e}};Lu.prototype.isMatrix4=!0;let ln=Lu;const Ir=new le,Ii=new ln,PS=new le(0,0,0),IS=new le(1,1,1),ls=new le,Fc=new le,mi=new le,mv=new ln,gv=new _s;class ys{constructor(e=0,i=0,s=0,l=ys.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,s,l=this._order){return this._x=e,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,s=!0){const l=e.elements,c=l[0],f=l[4],p=l[8],m=l[1],h=l[5],v=l[9],_=l[2],x=l[6],y=l[10];switch(i){case"XYZ":this._y=Math.asin(At(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-v,y),this._z=Math.atan2(-f,c)):(this._x=Math.atan2(x,h),this._z=0);break;case"YXZ":this._x=Math.asin(-At(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(p,y),this._z=Math.atan2(m,h)):(this._y=Math.atan2(-_,c),this._z=0);break;case"ZXY":this._x=Math.asin(At(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-_,y),this._z=Math.atan2(-f,h)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-At(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(x,y),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-f,h));break;case"YZX":this._z=Math.asin(At(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-v,h),this._y=Math.atan2(-_,c)):(this._x=0,this._y=Math.atan2(p,y));break;case"XZY":this._z=Math.asin(-At(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(x,h),this._y=Math.atan2(p,c)):(this._x=Math.atan2(-v,y),this._y=0);break;default:ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,s){return mv.makeRotationFromQuaternion(e),this.setFromRotationMatrix(mv,i,s)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return gv.setFromEuler(this),this.setFromQuaternion(gv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ys.DEFAULT_ORDER="XYZ";let Yp=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},FS=0;const xv=new le,Fr=new _s,ba=new ln,Bc=new le,rl=new le,BS=new le,kS=new _s,vv=new le(1,0,0),_v=new le(0,1,0),yv=new le(0,0,1),bv={type:"added"},HS={type:"removed"},Br={type:"childadded",child:null},sh={type:"childremoved",child:null};class zn extends bs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:FS++}),this.uuid=lo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zn.DEFAULT_UP.clone();const e=new le,i=new ys,s=new _s,l=new le(1,1,1);function c(){s.setFromEuler(i,!1)}function f(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(f),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new ln},normalMatrix:{value:new yt}}),this.matrix=new ln,this.matrixWorld=new ln,this.matrixAutoUpdate=zn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return Fr.setFromAxisAngle(e,i),this.quaternion.multiply(Fr),this}rotateOnWorldAxis(e,i){return Fr.setFromAxisAngle(e,i),this.quaternion.premultiply(Fr),this}rotateX(e){return this.rotateOnAxis(vv,e)}rotateY(e){return this.rotateOnAxis(_v,e)}rotateZ(e){return this.rotateOnAxis(yv,e)}translateOnAxis(e,i){return xv.copy(e).applyQuaternion(this.quaternion),this.position.add(xv.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(vv,e)}translateY(e){return this.translateOnAxis(_v,e)}translateZ(e){return this.translateOnAxis(yv,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ba.copy(this.matrixWorld).invert())}lookAt(e,i,s){e.isVector3?Bc.copy(e):Bc.set(e,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),rl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ba.lookAt(rl,Bc,this.up):ba.lookAt(Bc,rl,this.up),this.quaternion.setFromRotationMatrix(ba),l&&(ba.extractRotation(l.matrixWorld),Fr.setFromRotationMatrix(ba),this.quaternion.premultiply(Fr.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(Ut("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bv),Br.child=e,this.dispatchEvent(Br),Br.child=null):Ut("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(HS),sh.child=e,this.dispatchEvent(sh),sh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ba.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ba.multiply(e.parent.matrixWorld)),e.applyMatrix4(ba),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bv),Br.child=e,this.dispatchEvent(Br),Br.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const f=this.children[s].getObjectByProperty(e,i);if(f!==void 0)return f}}getObjectsByProperty(e,i,s=[]){this[e]===i&&s.push(this);const l=this.children;for(let c=0,f=l.length;c<f;c++)l[c].getObjectsByProperty(e,i,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rl,e,BS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rl,kS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const i=e.x,s=e.y,l=e.z,c=this.matrix.elements;c[12]+=i-c[0]*i-c[4]*s-c[8]*l,c[13]+=s-c[1]*i-c[5]*s-c[9]*l,c[14]+=l-c[2]*i-c[6]*s-c[10]*l}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(e)}updateWorldMatrix(e,i){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,f=l.length;c<f;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(e){const i=e===void 0||typeof e=="string",s={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),this.static!==!1&&(l.static=this.static),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.pivot!==null&&(l.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(l.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(l.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(p=>({...p,boundingBox:p.boundingBox?p.boundingBox.toJSON():void 0,boundingSphere:p.boundingSphere?p.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(p=>({...p})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(e),l.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(p,m){return p[m.uuid]===void 0&&(p[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(e.geometries,this.geometry);const p=this.geometry.parameters;if(p!==void 0&&p.shapes!==void 0){const m=p.shapes;if(Array.isArray(m))for(let h=0,v=m.length;h<v;h++){const _=m[h];c(e.shapes,_)}else c(e.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const p=[];for(let m=0,h=this.material.length;m<h;m++)p.push(c(e.materials,this.material[m]));l.material=p}else l.material=c(e.materials,this.material);if(this.children.length>0){l.children=[];for(let p=0;p<this.children.length;p++)l.children.push(this.children[p].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let p=0;p<this.animations.length;p++){const m=this.animations[p];l.animations.push(c(e.animations,m))}}if(i){const p=f(e.geometries),m=f(e.materials),h=f(e.textures),v=f(e.images),_=f(e.shapes),x=f(e.skeletons),y=f(e.animations),T=f(e.nodes);p.length>0&&(s.geometries=p),m.length>0&&(s.materials=m),h.length>0&&(s.textures=h),v.length>0&&(s.images=v),_.length>0&&(s.shapes=_),x.length>0&&(s.skeletons=x),y.length>0&&(s.animations=y),T.length>0&&(s.nodes=T)}return s.object=l,s;function f(p){const m=[];for(const h in p){const v=p[h];delete v.metadata,m.push(v)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let s=0;s<e.children.length;s++){const l=e.children[s];this.add(l.clone())}return this}}zn.DEFAULT_UP=new le(0,1,0);zn.DEFAULT_MATRIX_AUTO_UPDATE=!0;zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Zi extends zn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const GS={type:"move"};class rh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new le,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new le),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new le,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new le,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const s of e.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,s){let l=null,c=null,f=null;const p=this._targetRay,m=this._grip,h=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(h&&e.hand){f=!0;for(const R of e.hand.values()){const S=i.getJointPose(R,s),b=this._getHandJoint(h,R);S!==null&&(b.matrix.fromArray(S.transform.matrix),b.matrix.decompose(b.position,b.rotation,b.scale),b.matrixWorldNeedsUpdate=!0,b.jointRadius=S.radius),b.visible=S!==null}const v=h.joints["index-finger-tip"],_=h.joints["thumb-tip"],x=v.position.distanceTo(_.position),y=.02,T=.005;h.inputState.pinching&&x>y+T?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&x<=y-T&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(c=i.getPose(e.gripSpace,s),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1,m.eventsEnabled&&m.dispatchEvent({type:"gripUpdated",data:e,target:this})));p!==null&&(l=i.getPose(e.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1,this.dispatchEvent(GS)))}return p!==null&&(p.visible=l!==null),m!==null&&(m.visible=c!==null),h!==null&&(h.visible=f!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const s=new Zi;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[i.jointName]=s,e.add(s)}return e.joints[i.jointName]}}const Y_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cs={h:0,s:0,l:0},kc={h:0,s:0,l:0};function oh(r,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(e-r)*6*i:i<1/2?e:i<2/3?r+(e-r)*6*(2/3-i):r}class Et{constructor(e,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,s)}set(e,i,s){if(i===void 0&&s===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=Di){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Lt.colorSpaceToWorking(this,i),this}setRGB(e,i,s,l=Lt.workingColorSpace){return this.r=e,this.g=i,this.b=s,Lt.colorSpaceToWorking(this,l),this}setHSL(e,i,s,l=Lt.workingColorSpace){if(e=Wp(e,1),i=At(i,0,1),s=At(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,f=2*s-c;this.r=oh(f,c,e+1/3),this.g=oh(f,c,e),this.b=oh(f,c,e-1/3)}return Lt.colorSpaceToWorking(this,l),this}setStyle(e,i=Di){function s(c){c!==void 0&&parseFloat(c)<1&&ut("Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let c;const f=l[1],p=l[2];switch(f){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:ut("Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const c=l[1],f=c.length;if(f===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(f===6)return this.setHex(parseInt(c,16),i);ut("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=Di){const s=Y_[e.toLowerCase()];return s!==void 0?this.setHex(s,i):ut("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Na(e.r),this.g=Na(e.g),this.b=Na(e.b),this}copyLinearToSRGB(e){return this.r=to(e.r),this.g=to(e.g),this.b=to(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Di){return Lt.workingToColorSpace(Vn.copy(this),e),Math.round(At(Vn.r*255,0,255))*65536+Math.round(At(Vn.g*255,0,255))*256+Math.round(At(Vn.b*255,0,255))}getHexString(e=Di){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Lt.workingColorSpace){Lt.workingToColorSpace(Vn.copy(this),i);const s=Vn.r,l=Vn.g,c=Vn.b,f=Math.max(s,l,c),p=Math.min(s,l,c);let m,h;const v=(p+f)/2;if(p===f)m=0,h=0;else{const _=f-p;switch(h=v<=.5?_/(f+p):_/(2-f-p),f){case s:m=(l-c)/_+(l<c?6:0);break;case l:m=(c-s)/_+2;break;case c:m=(s-l)/_+4;break}m/=6}return e.h=m,e.s=h,e.l=v,e}getRGB(e,i=Lt.workingColorSpace){return Lt.workingToColorSpace(Vn.copy(this),i),e.r=Vn.r,e.g=Vn.g,e.b=Vn.b,e}getStyle(e=Di){Lt.workingToColorSpace(Vn.copy(this),e);const i=Vn.r,s=Vn.g,l=Vn.b;return e!==Di?`color(${e} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(e,i,s){return this.getHSL(cs),this.setHSL(cs.h+e,cs.s+i,cs.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,s){return this.r=e.r+(i.r-e.r)*s,this.g=e.g+(i.g-e.g)*s,this.b=e.b+(i.b-e.b)*s,this}lerpHSL(e,i){this.getHSL(cs),e.getHSL(kc);const s=vl(cs.h,kc.h,i),l=vl(cs.s,kc.s,i),c=vl(cs.l,kc.l,i);return this.setHSL(s,l,c),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,s=this.g,l=this.b,c=e.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vn=new Et;Et.NAMES=Y_;class Zp{constructor(e,i=25e-5){this.isFogExp2=!0,this.name="",this.color=new Et(e),this.density=i}clone(){return new Zp(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class VS extends zn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ys,this.environmentIntensity=1,this.environmentRotation=new ys,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Fi=new le,Sa=new le,lh=new le,Ma=new le,kr=new le,Hr=new le,Sv=new le,ch=new le,uh=new le,fh=new le,dh=new fn,hh=new fn,ph=new fn;class ki{constructor(e=new le,i=new le,s=new le){this.a=e,this.b=i,this.c=s}static getNormal(e,i,s,l){l.subVectors(s,i),Fi.subVectors(e,i),l.cross(Fi);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(e,i,s,l,c){Fi.subVectors(l,i),Sa.subVectors(s,i),lh.subVectors(e,i);const f=Fi.dot(Fi),p=Fi.dot(Sa),m=Fi.dot(lh),h=Sa.dot(Sa),v=Sa.dot(lh),_=f*h-p*p;if(_===0)return c.set(0,0,0),null;const x=1/_,y=(h*m-p*v)*x,T=(f*v-p*m)*x;return c.set(1-y-T,T,y)}static containsPoint(e,i,s,l){return this.getBarycoord(e,i,s,l,Ma)===null?!1:Ma.x>=0&&Ma.y>=0&&Ma.x+Ma.y<=1}static getInterpolation(e,i,s,l,c,f,p,m){return this.getBarycoord(e,i,s,l,Ma)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,Ma.x),m.addScaledVector(f,Ma.y),m.addScaledVector(p,Ma.z),m)}static getInterpolatedAttribute(e,i,s,l,c,f){return dh.setScalar(0),hh.setScalar(0),ph.setScalar(0),dh.fromBufferAttribute(e,i),hh.fromBufferAttribute(e,s),ph.fromBufferAttribute(e,l),f.setScalar(0),f.addScaledVector(dh,c.x),f.addScaledVector(hh,c.y),f.addScaledVector(ph,c.z),f}static isFrontFacing(e,i,s,l){return Fi.subVectors(s,i),Sa.subVectors(e,i),Fi.cross(Sa).dot(l)<0}set(e,i,s){return this.a.copy(e),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(e,i,s,l){return this.a.copy(e[i]),this.b.copy(e[s]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,s,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fi.subVectors(this.c,this.b),Sa.subVectors(this.a,this.b),Fi.cross(Sa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ki.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return ki.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,s,l,c){return ki.getInterpolation(e,this.a,this.b,this.c,i,s,l,c)}containsPoint(e){return ki.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ki.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const s=this.a,l=this.b,c=this.c;let f,p;kr.subVectors(l,s),Hr.subVectors(c,s),ch.subVectors(e,s);const m=kr.dot(ch),h=Hr.dot(ch);if(m<=0&&h<=0)return i.copy(s);uh.subVectors(e,l);const v=kr.dot(uh),_=Hr.dot(uh);if(v>=0&&_<=v)return i.copy(l);const x=m*_-v*h;if(x<=0&&m>=0&&v<=0)return f=m/(m-v),i.copy(s).addScaledVector(kr,f);fh.subVectors(e,c);const y=kr.dot(fh),T=Hr.dot(fh);if(T>=0&&y<=T)return i.copy(c);const R=y*h-m*T;if(R<=0&&h>=0&&T<=0)return p=h/(h-T),i.copy(s).addScaledVector(Hr,p);const S=v*T-y*_;if(S<=0&&_-v>=0&&y-T>=0)return Sv.subVectors(c,l),p=(_-v)/(_-v+(y-T)),i.copy(l).addScaledVector(Sv,p);const b=1/(S+R+x);return f=R*b,p=x*b,i.copy(s).addScaledVector(kr,f).addScaledVector(Hr,p)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class co{constructor(e=new le(1/0,1/0,1/0),i=new le(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i+=3)this.expandByPoint(Bi.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,s=e.count;i<s;i++)this.expandByPoint(Bi.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const s=Bi.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&e.isInstancedMesh!==!0)for(let f=0,p=c.count;f<p;f++)e.isMesh===!0?e.getVertexPosition(f,Bi):Bi.fromBufferAttribute(c,f),Bi.applyMatrix4(e.matrixWorld),this.expandByPoint(Bi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hc.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),Hc.copy(s.boundingBox)),Hc.applyMatrix4(e.matrixWorld),this.union(Hc)}const l=e.children;for(let c=0,f=l.length;c<f;c++)this.expandByObject(l[c],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Bi),Bi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,s;return e.normal.x>0?(i=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),i<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ol),Gc.subVectors(this.max,ol),Gr.subVectors(e.a,ol),Vr.subVectors(e.b,ol),jr.subVectors(e.c,ol),us.subVectors(Vr,Gr),fs.subVectors(jr,Vr),Hs.subVectors(Gr,jr);let i=[0,-us.z,us.y,0,-fs.z,fs.y,0,-Hs.z,Hs.y,us.z,0,-us.x,fs.z,0,-fs.x,Hs.z,0,-Hs.x,-us.y,us.x,0,-fs.y,fs.x,0,-Hs.y,Hs.x,0];return!mh(i,Gr,Vr,jr,Gc)||(i=[1,0,0,0,1,0,0,0,1],!mh(i,Gr,Vr,jr,Gc))?!1:(Vc.crossVectors(us,fs),i=[Vc.x,Vc.y,Vc.z],mh(i,Gr,Vr,jr,Gc))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Bi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Bi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ea[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ea[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ea[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ea[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ea[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ea[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ea[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ea[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ea),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ea=[new le,new le,new le,new le,new le,new le,new le,new le],Bi=new le,Hc=new co,Gr=new le,Vr=new le,jr=new le,us=new le,fs=new le,Hs=new le,ol=new le,Gc=new le,Vc=new le,Gs=new le;function mh(r,e,i,s,l){for(let c=0,f=r.length-3;c<=f;c+=3){Gs.fromArray(r,c);const p=l.x*Math.abs(Gs.x)+l.y*Math.abs(Gs.y)+l.z*Math.abs(Gs.z),m=e.dot(Gs),h=i.dot(Gs),v=s.dot(Gs);if(Math.max(-Math.max(m,h,v),Math.min(m,h,v))>p)return!1}return!0}const Sn=new le,jc=new ht;let jS=0;class ai extends bs{constructor(e,i,s=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jS++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=s,this.usage=ov,this.updateRanges=[],this.gpuType=Qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,s){e*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[e+l]=i.array[s+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)jc.fromBufferAttribute(this,i),jc.applyMatrix3(e),this.setXY(i,jc.x,jc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)Sn.fromBufferAttribute(this,i),Sn.applyMatrix3(e),this.setXYZ(i,Sn.x,Sn.y,Sn.z);return this}applyMatrix4(e){for(let i=0,s=this.count;i<s;i++)Sn.fromBufferAttribute(this,i),Sn.applyMatrix4(e),this.setXYZ(i,Sn.x,Sn.y,Sn.z);return this}applyNormalMatrix(e){for(let i=0,s=this.count;i<s;i++)Sn.fromBufferAttribute(this,i),Sn.applyNormalMatrix(e),this.setXYZ(i,Sn.x,Sn.y,Sn.z);return this}transformDirection(e){for(let i=0,s=this.count;i<s;i++)Sn.fromBufferAttribute(this,i),Sn.transformDirection(e),this.setXYZ(i,Sn.x,Sn.y,Sn.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let s=this.array[e*this.itemSize+i];return this.normalized&&(s=Kr(s,this.array)),s}setComponent(e,i,s){return this.normalized&&(s=Wn(s,this.array)),this.array[e*this.itemSize+i]=s,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=Kr(i,this.array)),i}setX(e,i){return this.normalized&&(i=Wn(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=Kr(i,this.array)),i}setY(e,i){return this.normalized&&(i=Wn(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=Kr(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Wn(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=Kr(i,this.array)),i}setW(e,i){return this.normalized&&(i=Wn(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,s){return e*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array)),this.array[e+0]=i,this.array[e+1]=s,this}setXYZ(e,i,s,l){return e*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array),l=Wn(l,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this}setXYZW(e,i,s,l,c){return e*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array),l=Wn(l,this.array),c=Wn(c,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this.array[e+3]=c,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ov&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Z_ extends ai{constructor(e,i,s){super(new Uint16Array(e),i,s)}}class K_ extends ai{constructor(e,i,s){super(new Uint32Array(e),i,s)}}class Gt extends ai{constructor(e,i,s){super(new Float32Array(e),i,s)}}const XS=new co,ll=new le,gh=new le;class Ou{constructor(e=new le,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const s=this.center;i!==void 0?s.copy(i):XS.setFromPoints(e).getCenter(s);let l=0;for(let c=0,f=e.length;c<f;c++)l=Math.max(l,s.distanceToSquared(e[c]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const s=this.center.distanceToSquared(e);return i.copy(e),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ll.subVectors(e,this.center);const i=ll.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(ll,l/s),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ll.copy(e.center).add(gh)),this.expandByPoint(ll.copy(e.center).sub(gh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let WS=0;const Ni=new ln,xh=new zn,Xr=new le,gi=new co,cl=new co,Dn=new le;class En extends bs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:WS++}),this.uuid=lo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(uS(e)?K_:Z_)(e,1):this.index=e,this}setIndirect(e,i=0){return this.indirect=e,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,s=0){this.groups.push({start:e,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new yt().getNormalMatrix(e);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ni.makeRotationFromQuaternion(e),this.applyMatrix4(Ni),this}rotateX(e){return Ni.makeRotationX(e),this.applyMatrix4(Ni),this}rotateY(e){return Ni.makeRotationY(e),this.applyMatrix4(Ni),this}rotateZ(e){return Ni.makeRotationZ(e),this.applyMatrix4(Ni),this}translate(e,i,s){return Ni.makeTranslation(e,i,s),this.applyMatrix4(Ni),this}scale(e,i,s){return Ni.makeScale(e,i,s),this.applyMatrix4(Ni),this}lookAt(e){return xh.lookAt(e),xh.updateMatrix(),this.applyMatrix4(xh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xr).negate(),this.translate(Xr.x,Xr.y,Xr.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=e.length;l<c;l++){const f=e[l];s.push(f.x,f.y,f.z||0)}this.setAttribute("position",new Gt(s,3))}else{const s=Math.min(e.length,i.count);for(let l=0;l<s;l++){const c=e[l];i.setXYZ(l,c.x,c.y,c.z||0)}e.length>i.count&&ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new co);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new le(-1/0,-1/0,-1/0),new le(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];gi.setFromBufferAttribute(c),this.morphTargetsRelative?(Dn.addVectors(this.boundingBox.min,gi.min),this.boundingBox.expandByPoint(Dn),Dn.addVectors(this.boundingBox.max,gi.max),this.boundingBox.expandByPoint(Dn)):(this.boundingBox.expandByPoint(gi.min),this.boundingBox.expandByPoint(gi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ou);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new le,1/0);return}if(e){const s=this.boundingSphere.center;if(gi.setFromBufferAttribute(e),i)for(let c=0,f=i.length;c<f;c++){const p=i[c];cl.setFromBufferAttribute(p),this.morphTargetsRelative?(Dn.addVectors(gi.min,cl.min),gi.expandByPoint(Dn),Dn.addVectors(gi.max,cl.max),gi.expandByPoint(Dn)):(gi.expandByPoint(cl.min),gi.expandByPoint(cl.max))}gi.getCenter(s);let l=0;for(let c=0,f=e.count;c<f;c++)Dn.fromBufferAttribute(e,c),l=Math.max(l,s.distanceToSquared(Dn));if(i)for(let c=0,f=i.length;c<f;c++){const p=i[c],m=this.morphTargetsRelative;for(let h=0,v=p.count;h<v;h++)Dn.fromBufferAttribute(p,h),m&&(Xr.fromBufferAttribute(e,h),Dn.add(Xr)),l=Math.max(l,s.distanceToSquared(Dn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&Ut('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){Ut("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ai(new Float32Array(4*s.count),4));const f=this.getAttribute("tangent"),p=[],m=[];for(let w=0;w<s.count;w++)p[w]=new le,m[w]=new le;const h=new le,v=new le,_=new le,x=new ht,y=new ht,T=new ht,R=new le,S=new le;function b(w,O,G){h.fromBufferAttribute(s,w),v.fromBufferAttribute(s,O),_.fromBufferAttribute(s,G),x.fromBufferAttribute(c,w),y.fromBufferAttribute(c,O),T.fromBufferAttribute(c,G),v.sub(h),_.sub(h),y.sub(x),T.sub(x);const V=1/(y.x*T.y-T.x*y.y);isFinite(V)&&(R.copy(v).multiplyScalar(T.y).addScaledVector(_,-y.y).multiplyScalar(V),S.copy(_).multiplyScalar(y.x).addScaledVector(v,-T.x).multiplyScalar(V),p[w].add(R),p[O].add(R),p[G].add(R),m[w].add(S),m[O].add(S),m[G].add(S))}let C=this.groups;C.length===0&&(C=[{start:0,count:e.count}]);for(let w=0,O=C.length;w<O;++w){const G=C[w],V=G.start,Q=G.count;for(let Z=V,ae=V+Q;Z<ae;Z+=3)b(e.getX(Z+0),e.getX(Z+1),e.getX(Z+2))}const I=new le,F=new le,q=new le,z=new le;function j(w){q.fromBufferAttribute(l,w),z.copy(q);const O=p[w];I.copy(O),I.sub(q.multiplyScalar(q.dot(O))).normalize(),F.crossVectors(z,O);const V=F.dot(m[w])<0?-1:1;f.setXYZW(w,I.x,I.y,I.z,V)}for(let w=0,O=C.length;w<O;++w){const G=C[w],V=G.start,Q=G.count;for(let Z=V,ae=V+Q;Z<ae;Z+=3)j(e.getX(Z+0)),j(e.getX(Z+1)),j(e.getX(Z+2))}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new ai(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let x=0,y=s.count;x<y;x++)s.setXYZ(x,0,0,0);const l=new le,c=new le,f=new le,p=new le,m=new le,h=new le,v=new le,_=new le;if(e)for(let x=0,y=e.count;x<y;x+=3){const T=e.getX(x+0),R=e.getX(x+1),S=e.getX(x+2);l.fromBufferAttribute(i,T),c.fromBufferAttribute(i,R),f.fromBufferAttribute(i,S),v.subVectors(f,c),_.subVectors(l,c),v.cross(_),p.fromBufferAttribute(s,T),m.fromBufferAttribute(s,R),h.fromBufferAttribute(s,S),p.add(v),m.add(v),h.add(v),s.setXYZ(T,p.x,p.y,p.z),s.setXYZ(R,m.x,m.y,m.z),s.setXYZ(S,h.x,h.y,h.z)}else for(let x=0,y=i.count;x<y;x+=3)l.fromBufferAttribute(i,x+0),c.fromBufferAttribute(i,x+1),f.fromBufferAttribute(i,x+2),v.subVectors(f,c),_.subVectors(l,c),v.cross(_),s.setXYZ(x+0,v.x,v.y,v.z),s.setXYZ(x+1,v.x,v.y,v.z),s.setXYZ(x+2,v.x,v.y,v.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,s=e.count;i<s;i++)Dn.fromBufferAttribute(e,i),Dn.normalize(),e.setXYZ(i,Dn.x,Dn.y,Dn.z)}toNonIndexed(){function e(p,m){const h=p.array,v=p.itemSize,_=p.normalized,x=new h.constructor(m.length*v);let y=0,T=0;for(let R=0,S=m.length;R<S;R++){p.isInterleavedBufferAttribute?y=m[R]*p.data.stride+p.offset:y=m[R]*v;for(let b=0;b<v;b++)x[T++]=h[y++]}return new ai(x,v,_)}if(this.index===null)return ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new En,s=this.index.array,l=this.attributes;for(const p in l){const m=l[p],h=e(m,s);i.setAttribute(p,h)}const c=this.morphAttributes;for(const p in c){const m=[],h=c[p];for(let v=0,_=h.length;v<_;v++){const x=h[v],y=e(x,s);m.push(y)}i.morphAttributes[p]=m}i.morphTargetsRelative=this.morphTargetsRelative;const f=this.groups;for(let p=0,m=f.length;p<m;p++){const h=f[p];i.addGroup(h.start,h.count,h.materialIndex)}return i}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const h in m)m[h]!==void 0&&(e[h]=m[h]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const h=s[m];e.data.attributes[m]=h.toJSON(e.data)}const l={};let c=!1;for(const m in this.morphAttributes){const h=this.morphAttributes[m],v=[];for(let _=0,x=h.length;_<x;_++){const y=h[_];v.push(y.toJSON(e.data))}v.length>0&&(l[m]=v,c=!0)}c&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const f=this.groups;f.length>0&&(e.data.groups=JSON.parse(JSON.stringify(f)));const p=this.boundingSphere;return p!==null&&(e.data.boundingSphere=p.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone());const l=e.attributes;for(const h in l){const v=l[h];this.setAttribute(h,v.clone(i))}const c=e.morphAttributes;for(const h in c){const v=[],_=c[h];for(let x=0,y=_.length;x<y;x++)v.push(_[x].clone(i));this.morphAttributes[h]=v}this.morphTargetsRelative=e.morphTargetsRelative;const f=e.groups;for(let h=0,v=f.length;h<v;h++){const _=f[h];this.addGroup(_.start,_.count,_.materialIndex)}const p=e.boundingBox;p!==null&&(this.boundingBox=p.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let qS=0;class nr extends bs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qS++}),this.uuid=lo(),this.name="",this.type="Material",this.blending=eo,this.side=vs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ih,this.blendDst=Fh,this.blendEquation=Xs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=io,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=rv,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Or,this.stencilZFail=Or,this.stencilZPass=Or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const s=e[i];if(s===void 0){ut(`Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){ut(`Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(s.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(s.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==eo&&(s.blending=this.blending),this.side!==vs&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Ih&&(s.blendSrc=this.blendSrc),this.blendDst!==Fh&&(s.blendDst=this.blendDst),this.blendEquation!==Xs&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==io&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==rv&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Or&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Or&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Or&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.allowOverride===!1&&(s.allowOverride=!1),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const f=[];for(const p in c){const m=c[p];delete m.metadata,f.push(m)}return f}if(i){const c=l(e.textures),f=l(e.images);c.length>0&&(s.textures=c),f.length>0&&(s.images=f)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ta=new le,vh=new le,Xc=new le,ds=new le,_h=new le,Wc=new le,yh=new le;class Pu{constructor(e=new le,i=new le(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ta)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=Ta.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(Ta.copy(this.origin).addScaledVector(this.direction,i),Ta.distanceToSquared(e))}distanceSqToSegment(e,i,s,l){vh.copy(e).add(i).multiplyScalar(.5),Xc.copy(i).sub(e).normalize(),ds.copy(this.origin).sub(vh);const c=e.distanceTo(i)*.5,f=-this.direction.dot(Xc),p=ds.dot(this.direction),m=-ds.dot(Xc),h=ds.lengthSq(),v=Math.abs(1-f*f);let _,x,y,T;if(v>0)if(_=f*m-p,x=f*p-m,T=c*v,_>=0)if(x>=-T)if(x<=T){const R=1/v;_*=R,x*=R,y=_*(_+f*x+2*p)+x*(f*_+x+2*m)+h}else x=c,_=Math.max(0,-(f*x+p)),y=-_*_+x*(x+2*m)+h;else x=-c,_=Math.max(0,-(f*x+p)),y=-_*_+x*(x+2*m)+h;else x<=-T?(_=Math.max(0,-(-f*c+p)),x=_>0?-c:Math.min(Math.max(-c,-m),c),y=-_*_+x*(x+2*m)+h):x<=T?(_=0,x=Math.min(Math.max(-c,-m),c),y=x*(x+2*m)+h):(_=Math.max(0,-(f*c+p)),x=_>0?c:Math.min(Math.max(-c,-m),c),y=-_*_+x*(x+2*m)+h);else x=f>0?-c:c,_=Math.max(0,-(f*x+p)),y=-_*_+x*(x+2*m)+h;return s&&s.copy(this.origin).addScaledVector(this.direction,_),l&&l.copy(vh).addScaledVector(Xc,x),y}intersectSphere(e,i){Ta.subVectors(e.center,this.origin);const s=Ta.dot(this.direction),l=Ta.dot(Ta)-s*s,c=e.radius*e.radius;if(l>c)return null;const f=Math.sqrt(c-l),p=s-f,m=s+f;return m<0?null:p<0?this.at(m,i):this.at(p,i)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/i;return s>=0?s:null}intersectPlane(e,i){const s=this.distanceToPlane(e);return s===null?null:this.at(s,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let s,l,c,f,p,m;const h=1/this.direction.x,v=1/this.direction.y,_=1/this.direction.z,x=this.origin;return h>=0?(s=(e.min.x-x.x)*h,l=(e.max.x-x.x)*h):(s=(e.max.x-x.x)*h,l=(e.min.x-x.x)*h),v>=0?(c=(e.min.y-x.y)*v,f=(e.max.y-x.y)*v):(c=(e.max.y-x.y)*v,f=(e.min.y-x.y)*v),s>f||c>l||((c>s||isNaN(s))&&(s=c),(f<l||isNaN(l))&&(l=f),_>=0?(p=(e.min.z-x.z)*_,m=(e.max.z-x.z)*_):(p=(e.max.z-x.z)*_,m=(e.min.z-x.z)*_),s>m||p>l)||((p>s||s!==s)&&(s=p),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(e){return this.intersectBox(e,Ta)!==null}intersectTriangle(e,i,s,l,c){_h.subVectors(i,e),Wc.subVectors(s,e),yh.crossVectors(_h,Wc);let f=this.direction.dot(yh),p;if(f>0){if(l)return null;p=1}else if(f<0)p=-1,f=-f;else return null;ds.subVectors(this.origin,e);const m=p*this.direction.dot(Wc.crossVectors(ds,Wc));if(m<0)return null;const h=p*this.direction.dot(_h.cross(ds));if(h<0||m+h>f)return null;const v=-p*ds.dot(yh);return v<0?null:this.at(v/f,c)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class wu extends nr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ys,this.combine=D_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Mv=new ln,Vs=new Pu,qc=new Ou,Ev=new le,Yc=new le,Zc=new le,Kc=new le,bh=new le,Qc=new le,Tv=new le,Jc=new le;class mn extends zn{constructor(e=new En,i=new wu){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,f=l.length;c<f;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}getVertexPosition(e,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,f=s.morphTargetsRelative;i.fromBufferAttribute(l,e);const p=this.morphTargetInfluences;if(c&&p){Qc.set(0,0,0);for(let m=0,h=c.length;m<h;m++){const v=p[m],_=c[m];v!==0&&(bh.fromBufferAttribute(_,e),f?Qc.addScaledVector(bh,v):Qc.addScaledVector(bh.sub(i),v))}i.add(Qc)}return i}raycast(e,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),qc.copy(s.boundingSphere),qc.applyMatrix4(c),Vs.copy(e.ray).recast(e.near),!(qc.containsPoint(Vs.origin)===!1&&(Vs.intersectSphere(qc,Ev)===null||Vs.origin.distanceToSquared(Ev)>(e.far-e.near)**2))&&(Mv.copy(c).invert(),Vs.copy(e.ray).applyMatrix4(Mv),!(s.boundingBox!==null&&Vs.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,i,Vs)))}_computeIntersections(e,i,s){let l;const c=this.geometry,f=this.material,p=c.index,m=c.attributes.position,h=c.attributes.uv,v=c.attributes.uv1,_=c.attributes.normal,x=c.groups,y=c.drawRange;if(p!==null)if(Array.isArray(f))for(let T=0,R=x.length;T<R;T++){const S=x[T],b=f[S.materialIndex],C=Math.max(S.start,y.start),I=Math.min(p.count,Math.min(S.start+S.count,y.start+y.count));for(let F=C,q=I;F<q;F+=3){const z=p.getX(F),j=p.getX(F+1),w=p.getX(F+2);l=$c(this,b,e,s,h,v,_,z,j,w),l&&(l.faceIndex=Math.floor(F/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const T=Math.max(0,y.start),R=Math.min(p.count,y.start+y.count);for(let S=T,b=R;S<b;S+=3){const C=p.getX(S),I=p.getX(S+1),F=p.getX(S+2);l=$c(this,f,e,s,h,v,_,C,I,F),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(f))for(let T=0,R=x.length;T<R;T++){const S=x[T],b=f[S.materialIndex],C=Math.max(S.start,y.start),I=Math.min(m.count,Math.min(S.start+S.count,y.start+y.count));for(let F=C,q=I;F<q;F+=3){const z=F,j=F+1,w=F+2;l=$c(this,b,e,s,h,v,_,z,j,w),l&&(l.faceIndex=Math.floor(F/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const T=Math.max(0,y.start),R=Math.min(m.count,y.start+y.count);for(let S=T,b=R;S<b;S+=3){const C=S,I=S+1,F=S+2;l=$c(this,f,e,s,h,v,_,C,I,F),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}}}function YS(r,e,i,s,l,c,f,p){let m;if(e.side===ii?m=s.intersectTriangle(f,c,l,!0,p):m=s.intersectTriangle(l,c,f,e.side===vs,p),m===null)return null;Jc.copy(p),Jc.applyMatrix4(r.matrixWorld);const h=i.ray.origin.distanceTo(Jc);return h<i.near||h>i.far?null:{distance:h,point:Jc.clone(),object:r}}function $c(r,e,i,s,l,c,f,p,m,h){r.getVertexPosition(p,Yc),r.getVertexPosition(m,Zc),r.getVertexPosition(h,Kc);const v=YS(r,e,i,s,Yc,Zc,Kc,Tv);if(v){const _=new le;ki.getBarycoord(Tv,Yc,Zc,Kc,_),l&&(v.uv=ki.getInterpolatedAttribute(l,p,m,h,_,new ht)),c&&(v.uv1=ki.getInterpolatedAttribute(c,p,m,h,_,new ht)),f&&(v.normal=ki.getInterpolatedAttribute(f,p,m,h,_,new le),v.normal.dot(s.direction)>0&&v.normal.multiplyScalar(-1));const x={a:p,b:m,c:h,normal:new le,materialIndex:0};ki.getNormal(Yc,Zc,Kc,x.normal),v.face=x,v.barycoord=_}return v}class ZS extends Yn{constructor(e=null,i=1,s=1,l,c,f,p,m,h=Fn,v=Fn,_,x){super(null,f,p,m,h,v,l,c,_,x),this.isDataTexture=!0,this.image={data:e,width:i,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Sh=new le,KS=new le,QS=new yt;class ms{constructor(e=new le(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,s,l){return this.normal.set(e,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,s){const l=Sh.subVectors(s,i).cross(KS.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i,s=!0){const l=e.delta(Sh),c=this.normal.dot(l);if(c===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const f=-(e.start.dot(this.normal)+this.constant)/c;return s===!0&&(f<0||f>1)?null:i.copy(e.start).addScaledVector(l,f)}intersectsLine(e){const i=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return i<0&&s>0||s<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const s=i||QS.getNormalMatrix(e),l=this.coplanarPoint(Sh).applyMatrix4(e),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const js=new Ou,JS=new ht(.5,.5),eu=new le;class Kp{constructor(e=new ms,i=new ms,s=new ms,l=new ms,c=new ms,f=new ms){this.planes=[e,i,s,l,c,f]}set(e,i,s,l,c,f){const p=this.planes;return p[0].copy(e),p[1].copy(i),p[2].copy(s),p[3].copy(l),p[4].copy(c),p[5].copy(f),this}copy(e){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,i=Ji,s=!1){const l=this.planes,c=e.elements,f=c[0],p=c[1],m=c[2],h=c[3],v=c[4],_=c[5],x=c[6],y=c[7],T=c[8],R=c[9],S=c[10],b=c[11],C=c[12],I=c[13],F=c[14],q=c[15];if(l[0].setComponents(h-f,y-v,b-T,q-C).normalize(),l[1].setComponents(h+f,y+v,b+T,q+C).normalize(),l[2].setComponents(h+p,y+_,b+R,q+I).normalize(),l[3].setComponents(h-p,y-_,b-R,q-I).normalize(),s)l[4].setComponents(m,x,S,F).normalize(),l[5].setComponents(h-m,y-x,b-S,q-F).normalize();else if(l[4].setComponents(h-m,y-x,b-S,q-F).normalize(),i===Ji)l[5].setComponents(h+m,y+x,b+S,q+F).normalize();else if(i===Ml)l[5].setComponents(m,x,S,F).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),js.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),js.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(js)}intersectsSprite(e){js.center.set(0,0,0);const i=JS.distanceTo(e.center);return js.radius=.7071067811865476+i,js.applyMatrix4(e.matrixWorld),this.intersectsSphere(js)}intersectsSphere(e){const i=this.planes,s=e.center,l=-e.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(eu.x=l.normal.x>0?e.max.x:e.min.x,eu.y=l.normal.y>0?e.max.y:e.min.y,eu.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(eu)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Tl extends nr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Et(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Cu=new le,Ru=new le,Av=new ln,ul=new Pu,tu=new Ou,Mh=new le,wv=new le;class Ap extends zn{constructor(e=new En,i=new Tl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,s=[0];for(let l=1,c=i.count;l<c;l++)Cu.fromBufferAttribute(i,l-1),Ru.fromBufferAttribute(i,l),s[l]=s[l-1],s[l]+=Cu.distanceTo(Ru);e.setAttribute("lineDistance",new Gt(s,1))}else ut("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){const s=this.geometry,l=this.matrixWorld,c=e.params.Line.threshold,f=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),tu.copy(s.boundingSphere),tu.applyMatrix4(l),tu.radius+=c,e.ray.intersectsSphere(tu)===!1)return;Av.copy(l).invert(),ul.copy(e.ray).applyMatrix4(Av);const p=c/((this.scale.x+this.scale.y+this.scale.z)/3),m=p*p,h=this.isLineSegments?2:1,v=s.index,x=s.attributes.position;if(v!==null){const y=Math.max(0,f.start),T=Math.min(v.count,f.start+f.count);for(let R=y,S=T-1;R<S;R+=h){const b=v.getX(R),C=v.getX(R+1),I=nu(this,e,ul,m,b,C,R);I&&i.push(I)}if(this.isLineLoop){const R=v.getX(T-1),S=v.getX(y),b=nu(this,e,ul,m,R,S,T-1);b&&i.push(b)}}else{const y=Math.max(0,f.start),T=Math.min(x.count,f.start+f.count);for(let R=y,S=T-1;R<S;R+=h){const b=nu(this,e,ul,m,R,R+1,R);b&&i.push(b)}if(this.isLineLoop){const R=nu(this,e,ul,m,T-1,y,T-1);R&&i.push(R)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,f=l.length;c<f;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}}function nu(r,e,i,s,l,c,f){const p=r.geometry.attributes.position;if(Cu.fromBufferAttribute(p,l),Ru.fromBufferAttribute(p,c),i.distanceSqToSegment(Cu,Ru,Mh,wv)>s)return;Mh.applyMatrix4(r.matrixWorld);const h=e.ray.origin.distanceTo(Mh);if(!(h<e.near||h>e.far))return{distance:h,point:wv.clone().applyMatrix4(r.matrixWorld),index:f,face:null,faceIndex:null,barycoord:null,object:r}}const Cv=new le,Rv=new le;class Qp extends Ap{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,s=[];for(let l=0,c=i.count;l<c;l+=2)Cv.fromBufferAttribute(i,l),Rv.fromBufferAttribute(i,l+1),s[l]=l===0?0:s[l-1],s[l+1]=s[l]+Cv.distanceTo(Rv);e.setAttribute("lineDistance",new Gt(s,1))}else ut("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Q_ extends Yn{constructor(e=[],i=$s,s,l,c,f,p,m,h,v){super(e,i,s,l,c,f,p,m,h,v),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class so extends Yn{constructor(e,i,s=ta,l,c,f,p=Fn,m=Fn,h,v=za,_=1){if(v!==za&&v!==Ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const x={width:e,height:i,depth:_};super(x,l,c,f,p,m,v,s,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class $S extends so{constructor(e,i=ta,s=$s,l,c,f=Fn,p=Fn,m,h=za){const v={width:e,height:e,depth:1},_=[v,v,v,v,v,v];super(e,e,i,s,l,c,f,p,m,h),this.image=_,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class J_ extends Yn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class tr extends En{constructor(e=1,i=1,s=1,l=1,c=1,f=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:f};const p=this;l=Math.floor(l),c=Math.floor(c),f=Math.floor(f);const m=[],h=[],v=[],_=[];let x=0,y=0;T("z","y","x",-1,-1,s,i,e,f,c,0),T("z","y","x",1,-1,s,i,-e,f,c,1),T("x","z","y",1,1,e,s,i,l,f,2),T("x","z","y",1,-1,e,s,-i,l,f,3),T("x","y","z",1,-1,e,i,s,l,c,4),T("x","y","z",-1,-1,e,i,-s,l,c,5),this.setIndex(m),this.setAttribute("position",new Gt(h,3)),this.setAttribute("normal",new Gt(v,3)),this.setAttribute("uv",new Gt(_,2));function T(R,S,b,C,I,F,q,z,j,w,O){const G=F/j,V=q/w,Q=F/2,Z=q/2,ae=z/2,W=j+1,D=w+1;let k=0,ie=0;const J=new le;for(let H=0;H<D;H++){const B=H*V-Z;for(let Y=0;Y<W;Y++){const ee=Y*G-Q;J[R]=ee*C,J[S]=B*I,J[b]=ae,h.push(J.x,J.y,J.z),J[R]=0,J[S]=0,J[b]=z>0?1:-1,v.push(J.x,J.y,J.z),_.push(Y/j),_.push(1-H/w),k+=1}}for(let H=0;H<w;H++)for(let B=0;B<j;B++){const Y=x+B+W*H,ee=x+B+W*(H+1),ve=x+(B+1)+W*(H+1),ce=x+(B+1)+W*H;m.push(Y,ee,ce),m.push(ee,ve,ce),ie+=6}p.addGroup(y,ie,O),y+=ie,x+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Iu extends En{constructor(e=1,i=1,s=1,l=32,c=1,f=!1,p=0,m=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:i,height:s,radialSegments:l,heightSegments:c,openEnded:f,thetaStart:p,thetaLength:m};const h=this;l=Math.floor(l),c=Math.floor(c);const v=[],_=[],x=[],y=[];let T=0;const R=[],S=s/2;let b=0;C(),f===!1&&(e>0&&I(!0),i>0&&I(!1)),this.setIndex(v),this.setAttribute("position",new Gt(_,3)),this.setAttribute("normal",new Gt(x,3)),this.setAttribute("uv",new Gt(y,2));function C(){const F=new le,q=new le;let z=0;const j=(i-e)/s;for(let w=0;w<=c;w++){const O=[],G=w/c,V=G*(i-e)+e;for(let Q=0;Q<=l;Q++){const Z=Q/l,ae=Z*m+p,W=Math.sin(ae),D=Math.cos(ae);q.x=V*W,q.y=-G*s+S,q.z=V*D,_.push(q.x,q.y,q.z),F.set(W,j,D).normalize(),x.push(F.x,F.y,F.z),y.push(Z,1-G),O.push(T++)}R.push(O)}for(let w=0;w<l;w++)for(let O=0;O<c;O++){const G=R[O][w],V=R[O+1][w],Q=R[O+1][w+1],Z=R[O][w+1];(e>0||O!==0)&&(v.push(G,V,Z),z+=3),(i>0||O!==c-1)&&(v.push(V,Q,Z),z+=3)}h.addGroup(b,z,0),b+=z}function I(F){const q=T,z=new ht,j=new le;let w=0;const O=F===!0?e:i,G=F===!0?1:-1;for(let Q=1;Q<=l;Q++)_.push(0,S*G,0),x.push(0,G,0),y.push(.5,.5),T++;const V=T;for(let Q=0;Q<=l;Q++){const ae=Q/l*m+p,W=Math.cos(ae),D=Math.sin(ae);j.x=O*D,j.y=S*G,j.z=O*W,_.push(j.x,j.y,j.z),x.push(0,G,0),z.x=W*.5+.5,z.y=D*.5*G+.5,y.push(z.x,z.y),T++}for(let Q=0;Q<l;Q++){const Z=q+Q,ae=V+Q;F===!0?v.push(ae,ae+1,Z):v.push(ae+1,ae,Z),w+=3}h.addGroup(b,w,F===!0?1:2),b+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Iu(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Jp extends Iu{constructor(e=1,i=1,s=32,l=1,c=!1,f=0,p=Math.PI*2){super(0,e,i,s,l,c,f,p),this.type="ConeGeometry",this.parameters={radius:e,height:i,radialSegments:s,heightSegments:l,openEnded:c,thetaStart:f,thetaLength:p}}static fromJSON(e){return new Jp(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class $p extends En{constructor(e=[],i=[],s=1,l=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:i,radius:s,detail:l};const c=[],f=[];p(l),h(s),v(),this.setAttribute("position",new Gt(c,3)),this.setAttribute("normal",new Gt(c.slice(),3)),this.setAttribute("uv",new Gt(f,2)),l===0?this.computeVertexNormals():this.normalizeNormals();function p(C){const I=new le,F=new le,q=new le;for(let z=0;z<i.length;z+=3)y(i[z+0],I),y(i[z+1],F),y(i[z+2],q),m(I,F,q,C)}function m(C,I,F,q){const z=q+1,j=[];for(let w=0;w<=z;w++){j[w]=[];const O=C.clone().lerp(F,w/z),G=I.clone().lerp(F,w/z),V=z-w;for(let Q=0;Q<=V;Q++)Q===0&&w===z?j[w][Q]=O:j[w][Q]=O.clone().lerp(G,Q/V)}for(let w=0;w<z;w++)for(let O=0;O<2*(z-w)-1;O++){const G=Math.floor(O/2);O%2===0?(x(j[w][G+1]),x(j[w+1][G]),x(j[w][G])):(x(j[w][G+1]),x(j[w+1][G+1]),x(j[w+1][G]))}}function h(C){const I=new le;for(let F=0;F<c.length;F+=3)I.x=c[F+0],I.y=c[F+1],I.z=c[F+2],I.normalize().multiplyScalar(C),c[F+0]=I.x,c[F+1]=I.y,c[F+2]=I.z}function v(){const C=new le;for(let I=0;I<c.length;I+=3){C.x=c[I+0],C.y=c[I+1],C.z=c[I+2];const F=S(C)/2/Math.PI+.5,q=b(C)/Math.PI+.5;f.push(F,1-q)}T(),_()}function _(){for(let C=0;C<f.length;C+=6){const I=f[C+0],F=f[C+2],q=f[C+4],z=Math.max(I,F,q),j=Math.min(I,F,q);z>.9&&j<.1&&(I<.2&&(f[C+0]+=1),F<.2&&(f[C+2]+=1),q<.2&&(f[C+4]+=1))}}function x(C){c.push(C.x,C.y,C.z)}function y(C,I){const F=C*3;I.x=e[F+0],I.y=e[F+1],I.z=e[F+2]}function T(){const C=new le,I=new le,F=new le,q=new le,z=new ht,j=new ht,w=new ht;for(let O=0,G=0;O<c.length;O+=9,G+=6){C.set(c[O+0],c[O+1],c[O+2]),I.set(c[O+3],c[O+4],c[O+5]),F.set(c[O+6],c[O+7],c[O+8]),z.set(f[G+0],f[G+1]),j.set(f[G+2],f[G+3]),w.set(f[G+4],f[G+5]),q.copy(C).add(I).add(F).divideScalar(3);const V=S(q);R(z,G+0,C,V),R(j,G+2,I,V),R(w,G+4,F,V)}}function R(C,I,F,q){q<0&&C.x===1&&(f[I]=C.x-1),F.x===0&&F.z===0&&(f[I]=q/2/Math.PI+.5)}function S(C){return Math.atan2(C.z,-C.x)}function b(C){return Math.atan2(-C.y,Math.sqrt(C.x*C.x+C.z*C.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $p(e.vertices,e.indices,e.radius,e.detail)}}class em extends $p{constructor(e=1,i=0){const s=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],l=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(s,l,e,i),this.type="OctahedronGeometry",this.parameters={radius:e,detail:i}}static fromJSON(e){return new em(e.radius,e.detail)}}class ro extends En{constructor(e=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:s,heightSegments:l};const c=e/2,f=i/2,p=Math.floor(s),m=Math.floor(l),h=p+1,v=m+1,_=e/p,x=i/m,y=[],T=[],R=[],S=[];for(let b=0;b<v;b++){const C=b*x-f;for(let I=0;I<h;I++){const F=I*_-c;T.push(F,-C,0),R.push(0,0,1),S.push(I/p),S.push(1-b/m)}}for(let b=0;b<m;b++)for(let C=0;C<p;C++){const I=C+h*b,F=C+h*(b+1),q=C+1+h*(b+1),z=C+1+h*b;y.push(I,F,z),y.push(F,q,z)}this.setIndex(y),this.setAttribute("position",new Gt(T,3)),this.setAttribute("normal",new Gt(R,3)),this.setAttribute("uv",new Gt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ro(e.width,e.height,e.widthSegments,e.heightSegments)}}class tm extends En{constructor(e=.5,i=1,s=32,l=1,c=0,f=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:i,thetaSegments:s,phiSegments:l,thetaStart:c,thetaLength:f},s=Math.max(3,s),l=Math.max(1,l);const p=[],m=[],h=[],v=[];let _=e;const x=(i-e)/l,y=new le,T=new ht;for(let R=0;R<=l;R++){for(let S=0;S<=s;S++){const b=c+S/s*f;y.x=_*Math.cos(b),y.y=_*Math.sin(b),m.push(y.x,y.y,y.z),h.push(0,0,1),T.x=(y.x/i+1)/2,T.y=(y.y/i+1)/2,v.push(T.x,T.y)}_+=x}for(let R=0;R<l;R++){const S=R*(s+1);for(let b=0;b<s;b++){const C=b+S,I=C,F=C+s+1,q=C+s+2,z=C+1;p.push(I,F,z),p.push(F,q,z)}}this.setIndex(p),this.setAttribute("position",new Gt(m,3)),this.setAttribute("normal",new Gt(h,3)),this.setAttribute("uv",new Gt(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tm(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class nm extends En{constructor(e=1,i=32,s=16,l=0,c=Math.PI*2,f=0,p=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:i,heightSegments:s,phiStart:l,phiLength:c,thetaStart:f,thetaLength:p},i=Math.max(3,Math.floor(i)),s=Math.max(2,Math.floor(s));const m=Math.min(f+p,Math.PI);let h=0;const v=[],_=new le,x=new le,y=[],T=[],R=[],S=[];for(let b=0;b<=s;b++){const C=[],I=b/s;let F=0;b===0&&f===0?F=.5/i:b===s&&m===Math.PI&&(F=-.5/i);for(let q=0;q<=i;q++){const z=q/i;_.x=-e*Math.cos(l+z*c)*Math.sin(f+I*p),_.y=e*Math.cos(f+I*p),_.z=e*Math.sin(l+z*c)*Math.sin(f+I*p),T.push(_.x,_.y,_.z),x.copy(_).normalize(),R.push(x.x,x.y,x.z),S.push(z+F,1-I),C.push(h++)}v.push(C)}for(let b=0;b<s;b++)for(let C=0;C<i;C++){const I=v[b][C+1],F=v[b][C],q=v[b+1][C],z=v[b+1][C+1];(b!==0||f>0)&&y.push(I,F,z),(b!==s-1||m<Math.PI)&&y.push(F,q,z)}this.setIndex(y),this.setAttribute("position",new Gt(T,3)),this.setAttribute("normal",new Gt(R,3)),this.setAttribute("uv",new Gt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nm(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class im extends En{constructor(e=1,i=.4,s=12,l=48,c=Math.PI*2,f=0,p=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:i,radialSegments:s,tubularSegments:l,arc:c,thetaStart:f,thetaLength:p},s=Math.floor(s),l=Math.floor(l);const m=[],h=[],v=[],_=[],x=new le,y=new le,T=new le;for(let R=0;R<=s;R++){const S=f+R/s*p;for(let b=0;b<=l;b++){const C=b/l*c;y.x=(e+i*Math.cos(S))*Math.cos(C),y.y=(e+i*Math.cos(S))*Math.sin(C),y.z=i*Math.sin(S),h.push(y.x,y.y,y.z),x.x=e*Math.cos(C),x.y=e*Math.sin(C),T.subVectors(y,x).normalize(),v.push(T.x,T.y,T.z),_.push(b/l),_.push(R/s)}}for(let R=1;R<=s;R++)for(let S=1;S<=l;S++){const b=(l+1)*R+S-1,C=(l+1)*(R-1)+S-1,I=(l+1)*(R-1)+S,F=(l+1)*R+S;m.push(b,C,F),m.push(C,I,F)}this.setIndex(m),this.setAttribute("position",new Gt(h,3)),this.setAttribute("normal",new Gt(v,3)),this.setAttribute("uv",new Gt(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new im(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class eM extends nr{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Et(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}function oo(r){const e={};for(const i in r){e[i]={};for(const s in r[i]){const l=r[i][s];if(Nv(l))l.isRenderTargetTexture?(ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][s]=null):e[i][s]=l.clone();else if(Array.isArray(l))if(Nv(l[0])){const c=[];for(let f=0,p=l.length;f<p;f++)c[f]=l[f].clone();e[i][s]=c}else e[i][s]=l.slice();else e[i][s]=l}}return e}function qn(r){const e={};for(let i=0;i<r.length;i++){const s=oo(r[i]);for(const l in s)e[l]=s[l]}return e}function Nv(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function tM(r){const e=[];for(let i=0;i<r.length;i++)e.push(r[i].clone());return e}function $_(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Lt.workingColorSpace}const nM={clone:oo,merge:qn};var iM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,aM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class na extends nr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=iM,this.fragmentShader=aM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=oo(e.uniforms),this.uniformsGroups=tM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const f=this.uniforms[l].value;f&&f.isTexture?i.uniforms[l]={type:"t",value:f.toJSON(e).uuid}:f&&f.isColor?i.uniforms[l]={type:"c",value:f.getHex()}:f&&f.isVector2?i.uniforms[l]={type:"v2",value:f.toArray()}:f&&f.isVector3?i.uniforms[l]={type:"v3",value:f.toArray()}:f&&f.isVector4?i.uniforms[l]={type:"v4",value:f.toArray()}:f&&f.isMatrix3?i.uniforms[l]={type:"m3",value:f.toArray()}:f&&f.isMatrix4?i.uniforms[l]={type:"m4",value:f.toArray()}:i.uniforms[l]={value:f}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}}class sM extends na{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class rM extends nr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ep,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ys,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class oM extends nr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lM extends nr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class am extends zn{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Et(e),this.intensity=i}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,i}}const Eh=new ln,Dv=new le,zv=new le;class ey{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=_i,this.map=null,this.mapPass=null,this.matrix=new ln,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kp,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new fn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera,s=this.matrix;Dv.setFromMatrixPosition(e.matrixWorld),i.position.copy(Dv),zv.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(zv),i.updateMatrixWorld(),Eh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Eh,i.coordinateSystem,i.reversedDepth),i.coordinateSystem===Ml||i.reversedDepth?s.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(Eh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const iu=new le,au=new _s,qi=new le;let ty=class extends zn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ln,this.projectionMatrix=new ln,this.projectionMatrixInverse=new ln,this.coordinateSystem=Ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(iu,au,qi),qi.x===1&&qi.y===1&&qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(iu,au,qi.set(1,1,1)).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorld.decompose(iu,au,qi),qi.x===1&&qi.y===1&&qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(iu,au,qi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}};const hs=new le,Lv=new ht,Uv=new ht;class vi extends ty{constructor(e=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=El*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(xl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return El*2*Math.atan(Math.tan(xl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,s){hs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(hs.x,hs.y).multiplyScalar(-e/hs.z),hs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(hs.x,hs.y).multiplyScalar(-e/hs.z)}getViewSize(e,i){return this.getViewBounds(e,Lv,Uv),i.subVectors(Uv,Lv)}setViewOffset(e,i,s,l,c,f){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(xl*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const f=this.view;if(this.view!==null&&this.view.enabled){const m=f.fullWidth,h=f.fullHeight;c+=f.offsetX*l/m,i-=f.offsetY*s/h,l*=f.width/m,s*=f.height/h}const p=this.filmOffset;p!==0&&(c+=e*p/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}class cM extends ey{constructor(){super(new vi(90,1,.5,500)),this.isPointLightShadow=!0}}class Ov extends am{constructor(e,i,s=0,l=2){super(e,i),this.isPointLight=!0,this.type="PointLight",this.distance=s,this.decay=l,this.shadow=new cM}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,i){return super.copy(e,i),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const i=super.toJSON(e);return i.object.distance=this.distance,i.object.decay=this.decay,i.object.shadow=this.shadow.toJSON(),i}}class sm extends ty{constructor(e=-1,i=1,s=1,l=-1,c=.1,f=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=f,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,s,l,c,f){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-e,f=s+e,p=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,v=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=h*this.view.offsetX,f=c+h*this.view.width,p-=v*this.view.offsetY,m=p-v*this.view.height}this.projectionMatrix.makeOrthographic(c,f,p,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class uM extends ey{constructor(){super(new sm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Pv extends am{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.target=new zn,this.shadow=new uM}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const i=super.toJSON(e);return i.object.shadow=this.shadow.toJSON(),i.object.target=this.target.uuid,i}}class fM extends am{constructor(e,i){super(e,i),this.isAmbientLight=!0,this.type="AmbientLight"}}const Wr=-90,qr=1;class dM extends zn{constructor(e,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new vi(Wr,qr,e,i);l.layers=this.layers,this.add(l);const c=new vi(Wr,qr,e,i);c.layers=this.layers,this.add(c);const f=new vi(Wr,qr,e,i);f.layers=this.layers,this.add(f);const p=new vi(Wr,qr,e,i);p.layers=this.layers,this.add(p);const m=new vi(Wr,qr,e,i);m.layers=this.layers,this.add(m);const h=new vi(Wr,qr,e,i);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[s,l,c,f,p,m]=i;for(const h of i)this.remove(h);if(e===Ji)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),f.up.set(0,0,1),f.lookAt(0,-1,0),p.up.set(0,1,0),p.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===Ml)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),f.up.set(0,0,-1),f.lookAt(0,-1,0),p.up.set(0,-1,0),p.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of i)this.add(h),h.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[c,f,p,m,h,v]=this.children,_=e.getRenderTarget(),x=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),T=e.xr.enabled;e.xr.enabled=!1;const R=s.texture.generateMipmaps;s.texture.generateMipmaps=!1;let S=!1;e.isWebGLRenderer===!0?S=e.state.buffers.depth.getReversed():S=e.reversedDepthBuffer,e.setRenderTarget(s,0,l),S&&e.autoClear===!1&&e.clearDepth(),e.render(i,c),e.setRenderTarget(s,1,l),S&&e.autoClear===!1&&e.clearDepth(),e.render(i,f),e.setRenderTarget(s,2,l),S&&e.autoClear===!1&&e.clearDepth(),e.render(i,p),e.setRenderTarget(s,3,l),S&&e.autoClear===!1&&e.clearDepth(),e.render(i,m),e.setRenderTarget(s,4,l),S&&e.autoClear===!1&&e.clearDepth(),e.render(i,h),s.texture.generateMipmaps=R,e.setRenderTarget(s,5,l),S&&e.autoClear===!1&&e.clearDepth(),e.render(i,v),e.setRenderTarget(_,x,y),e.xr.enabled=T,s.texture.needsPMREMUpdate=!0}}class hM extends vi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Iv=new ln;class pM{constructor(e,i,s=0,l=1/0){this.ray=new Pu(e,i),this.near=s,this.far=l,this.camera=null,this.layers=new Yp,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,i){this.ray.set(e,i)}setFromCamera(e,i){i.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(i.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(i).sub(this.ray.origin).normalize(),this.camera=i):i.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(i.near+i.far)/(i.near-i.far)).unproject(i),this.ray.direction.set(0,0,-1).transformDirection(i.matrixWorld),this.camera=i):Ut("Raycaster: Unsupported camera type: "+i.type)}setFromXRController(e){return Iv.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Iv),this}intersectObject(e,i=!0,s=[]){return wp(e,this,s,i),s.sort(Fv),s}intersectObjects(e,i=!0,s=[]){for(let l=0,c=e.length;l<c;l++)wp(e[l],this,s,i);return s.sort(Fv),s}}function Fv(r,e){return r.distance-e.distance}function wp(r,e,i,s){let l=!0;if(r.layers.test(e.layers)&&r.raycast(e,i)===!1&&(l=!1),l===!0&&s===!0){const c=r.children;for(let f=0,p=c.length;f<p;f++)wp(c[f],e,i,!0)}}class Bv{constructor(e=1,i=0,s=0){this.radius=e,this.phi=i,this.theta=s}set(e,i,s){return this.radius=e,this.phi=i,this.theta=s,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=At(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,i,s){return this.radius=Math.sqrt(e*e+i*i+s*s),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,s),this.phi=Math.acos(At(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const hm=class hm{constructor(e,i,s,l){this.elements=[1,0,0,1],e!==void 0&&this.set(e,i,s,l)}identity(){return this.set(1,0,0,1),this}fromArray(e,i=0){for(let s=0;s<4;s++)this.elements[s]=e[s+i];return this}set(e,i,s,l){const c=this.elements;return c[0]=e,c[2]=i,c[1]=s,c[3]=l,this}};hm.prototype.isMatrix2=!0;let kv=hm;class mM extends Qp{constructor(e=10,i=10,s=4473924,l=8947848){s=new Et(s),l=new Et(l);const c=i/2,f=e/i,p=e/2,m=[],h=[];for(let x=0,y=0,T=-p;x<=i;x++,T+=f){m.push(-p,0,T,p,0,T),m.push(T,0,-p,T,0,p);const R=x===c?s:l;R.toArray(h,y),y+=3,R.toArray(h,y),y+=3,R.toArray(h,y),y+=3,R.toArray(h,y),y+=3}const v=new En;v.setAttribute("position",new Gt(m,3)),v.setAttribute("color",new Gt(h,3));const _=new Tl({vertexColors:!0,toneMapped:!1});super(v,_),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const su=new co;class gM extends Qp{constructor(e,i=16776960){const s=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),l=new Float32Array(24),c=new En;c.setIndex(new ai(s,1)),c.setAttribute("position",new ai(l,3)),super(c,new Tl({color:i,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&su.setFromObject(this.object),su.isEmpty())return;const e=su.min,i=su.max,s=this.geometry.attributes.position,l=s.array;l[0]=i.x,l[1]=i.y,l[2]=i.z,l[3]=e.x,l[4]=i.y,l[5]=i.z,l[6]=e.x,l[7]=e.y,l[8]=i.z,l[9]=i.x,l[10]=e.y,l[11]=i.z,l[12]=i.x,l[13]=i.y,l[14]=e.z,l[15]=e.x,l[16]=i.y,l[17]=e.z,l[18]=e.x,l[19]=e.y,l[20]=e.z,l[21]=i.x,l[22]=e.y,l[23]=e.z,s.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,i){return super.copy(e,i),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class xM extends Qp{constructor(e=1){const i=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],s=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],l=new En;l.setAttribute("position",new Gt(i,3)),l.setAttribute("color",new Gt(s,3));const c=new Tl({vertexColors:!0,toneMapped:!1});super(l,c),this.type="AxesHelper"}setColors(e,i,s){const l=new Et,c=this.geometry.attributes.color.array;return l.set(e),l.toArray(c,0),l.toArray(c,3),l.set(i),l.toArray(c,6),l.toArray(c,9),l.set(s),l.toArray(c,12),l.toArray(c,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class vM extends bs{constructor(e,i=null){super(),this.object=e,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){ut("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Hv(r,e,i,s){const l=_M(s);switch(i){case V_:return r*e;case X_:return r*e/l.components*l.byteLength;case Hp:return r*e/l.components*l.byteLength;case er:return r*e*2/l.components*l.byteLength;case Gp:return r*e*2/l.components*l.byteLength;case j_:return r*e*3/l.components*l.byteLength;case Hi:return r*e*4/l.components*l.byteLength;case Vp:return r*e*4/l.components*l.byteLength;case gu:case xu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case vu:case _u:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Zh:case Qh:return Math.max(r,16)*Math.max(e,8)/4;case Yh:case Kh:return Math.max(r,8)*Math.max(e,8)/2;case Jh:case $h:case tp:case np:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ep:case Su:case ip:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case ap:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case sp:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case rp:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case op:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case lp:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case cp:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case up:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case fp:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case dp:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case hp:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case pp:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case mp:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case gp:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case xp:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case vp:case _p:case yp:return Math.ceil(r/4)*Math.ceil(e/4)*16;case bp:case Sp:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Mu:case Mp:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function _M(r){switch(r){case _i:case B_:return{byteLength:1,components:1};case bl:case k_:case Da:return{byteLength:2,components:1};case Bp:case kp:return{byteLength:2,components:4};case ta:case Fp:case Qi:return{byteLength:4,components:1};case H_:case G_:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pp}}));typeof window<"u"&&(window.__THREE__?ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pp);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ny(){let r=null,e=!1,i=null,s=null;function l(c,f){i(c,f),s=r.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&r!==null&&(s=r.requestAnimationFrame(l),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function yM(r){const e=new WeakMap;function i(p,m){const h=p.array,v=p.usage,_=h.byteLength,x=r.createBuffer();r.bindBuffer(m,x),r.bufferData(m,h,v),p.onUploadCallback();let y;if(h instanceof Float32Array)y=r.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)y=r.HALF_FLOAT;else if(h instanceof Uint16Array)p.isFloat16BufferAttribute?y=r.HALF_FLOAT:y=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)y=r.SHORT;else if(h instanceof Uint32Array)y=r.UNSIGNED_INT;else if(h instanceof Int32Array)y=r.INT;else if(h instanceof Int8Array)y=r.BYTE;else if(h instanceof Uint8Array)y=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)y=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:x,type:y,bytesPerElement:h.BYTES_PER_ELEMENT,version:p.version,size:_}}function s(p,m,h){const v=m.array,_=m.updateRanges;if(r.bindBuffer(h,p),_.length===0)r.bufferSubData(h,0,v);else{_.sort((y,T)=>y.start-T.start);let x=0;for(let y=1;y<_.length;y++){const T=_[x],R=_[y];R.start<=T.start+T.count+1?T.count=Math.max(T.count,R.start+R.count-T.start):(++x,_[x]=R)}_.length=x+1;for(let y=0,T=_.length;y<T;y++){const R=_[y];r.bufferSubData(h,R.start*v.BYTES_PER_ELEMENT,v,R.start,R.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(p){return p.isInterleavedBufferAttribute&&(p=p.data),e.get(p)}function c(p){p.isInterleavedBufferAttribute&&(p=p.data);const m=e.get(p);m&&(r.deleteBuffer(m.buffer),e.delete(p))}function f(p,m){if(p.isInterleavedBufferAttribute&&(p=p.data),p.isGLBufferAttribute){const v=e.get(p);(!v||v.version<p.version)&&e.set(p,{buffer:p.buffer,type:p.type,bytesPerElement:p.elementSize,version:p.version});return}const h=e.get(p);if(h===void 0)e.set(p,i(p,m));else if(h.version<p.version){if(h.size!==p.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(h.buffer,p,m),h.version=p.version}}return{get:l,remove:c,update:f}}var bM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,SM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,MM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,EM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,TM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,AM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,CM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,RM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,NM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,DM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,LM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,UM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,OM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,PM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,IM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,FM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,BM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,HM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,GM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,VM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,jM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,XM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,WM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,qM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,YM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ZM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,KM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,QM="gl_FragColor = linearToOutputTexel( gl_FragColor );",JM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,$M=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,eE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,tE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,nE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,iE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,aE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,oE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,uE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,hE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,pE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_E=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,bE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,SE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ME=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,EE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,TE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,AE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,CE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,RE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,NE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,DE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,LE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,UE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,OE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,PE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,IE=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,FE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,BE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,kE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,HE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,GE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,VE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,XE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,WE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,YE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ZE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,KE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,QE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,JE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$E=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,eT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,nT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,iT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,aT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,sT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,oT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,cT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,uT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,fT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,mT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,gT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,xT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_T=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,yT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const bT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ST=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,MT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ET=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,AT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,CT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,RT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,NT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,DT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,LT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,UT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,OT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,PT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HT=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,GT=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,VT=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jT=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XT=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,WT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,YT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ZT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,KT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,QT=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,JT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$T=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Tt={alphahash_fragment:bM,alphahash_pars_fragment:SM,alphamap_fragment:MM,alphamap_pars_fragment:EM,alphatest_fragment:TM,alphatest_pars_fragment:AM,aomap_fragment:wM,aomap_pars_fragment:CM,batching_pars_vertex:RM,batching_vertex:NM,begin_vertex:DM,beginnormal_vertex:zM,bsdfs:LM,iridescence_fragment:UM,bumpmap_pars_fragment:OM,clipping_planes_fragment:PM,clipping_planes_pars_fragment:IM,clipping_planes_pars_vertex:FM,clipping_planes_vertex:BM,color_fragment:kM,color_pars_fragment:HM,color_pars_vertex:GM,color_vertex:VM,common:jM,cube_uv_reflection_fragment:XM,defaultnormal_vertex:WM,displacementmap_pars_vertex:qM,displacementmap_vertex:YM,emissivemap_fragment:ZM,emissivemap_pars_fragment:KM,colorspace_fragment:QM,colorspace_pars_fragment:JM,envmap_fragment:$M,envmap_common_pars_fragment:eE,envmap_pars_fragment:tE,envmap_pars_vertex:nE,envmap_physical_pars_fragment:hE,envmap_vertex:iE,fog_vertex:aE,fog_pars_vertex:sE,fog_fragment:rE,fog_pars_fragment:oE,gradientmap_pars_fragment:lE,lightmap_pars_fragment:cE,lights_lambert_fragment:uE,lights_lambert_pars_fragment:fE,lights_pars_begin:dE,lights_toon_fragment:pE,lights_toon_pars_fragment:mE,lights_phong_fragment:gE,lights_phong_pars_fragment:xE,lights_physical_fragment:vE,lights_physical_pars_fragment:_E,lights_fragment_begin:yE,lights_fragment_maps:bE,lights_fragment_end:SE,lightprobes_pars_fragment:ME,logdepthbuf_fragment:EE,logdepthbuf_pars_fragment:TE,logdepthbuf_pars_vertex:AE,logdepthbuf_vertex:wE,map_fragment:CE,map_pars_fragment:RE,map_particle_fragment:NE,map_particle_pars_fragment:DE,metalnessmap_fragment:zE,metalnessmap_pars_fragment:LE,morphinstance_vertex:UE,morphcolor_vertex:OE,morphnormal_vertex:PE,morphtarget_pars_vertex:IE,morphtarget_vertex:FE,normal_fragment_begin:BE,normal_fragment_maps:kE,normal_pars_fragment:HE,normal_pars_vertex:GE,normal_vertex:VE,normalmap_pars_fragment:jE,clearcoat_normal_fragment_begin:XE,clearcoat_normal_fragment_maps:WE,clearcoat_pars_fragment:qE,iridescence_pars_fragment:YE,opaque_fragment:ZE,packing:KE,premultiplied_alpha_fragment:QE,project_vertex:JE,dithering_fragment:$E,dithering_pars_fragment:eT,roughnessmap_fragment:tT,roughnessmap_pars_fragment:nT,shadowmap_pars_fragment:iT,shadowmap_pars_vertex:aT,shadowmap_vertex:sT,shadowmask_pars_fragment:rT,skinbase_vertex:oT,skinning_pars_vertex:lT,skinning_vertex:cT,skinnormal_vertex:uT,specularmap_fragment:fT,specularmap_pars_fragment:dT,tonemapping_fragment:hT,tonemapping_pars_fragment:pT,transmission_fragment:mT,transmission_pars_fragment:gT,uv_pars_fragment:xT,uv_pars_vertex:vT,uv_vertex:_T,worldpos_vertex:yT,background_vert:bT,background_frag:ST,backgroundCube_vert:MT,backgroundCube_frag:ET,cube_vert:TT,cube_frag:AT,depth_vert:wT,depth_frag:CT,distance_vert:RT,distance_frag:NT,equirect_vert:DT,equirect_frag:zT,linedashed_vert:LT,linedashed_frag:UT,meshbasic_vert:OT,meshbasic_frag:PT,meshlambert_vert:IT,meshlambert_frag:FT,meshmatcap_vert:BT,meshmatcap_frag:kT,meshnormal_vert:HT,meshnormal_frag:GT,meshphong_vert:VT,meshphong_frag:jT,meshphysical_vert:XT,meshphysical_frag:WT,meshtoon_vert:qT,meshtoon_frag:YT,points_vert:ZT,points_frag:KT,shadow_vert:QT,shadow_frag:JT,sprite_vert:$T,sprite_frag:e2},We={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new yt}},envmap:{envMap:{value:null},envMapRotation:{value:new yt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new yt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new le},probesMax:{value:new le},probesResolution:{value:new le}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0},uvTransform:{value:new yt}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}}},Ki={basic:{uniforms:qn([We.common,We.specularmap,We.envmap,We.aomap,We.lightmap,We.fog]),vertexShader:Tt.meshbasic_vert,fragmentShader:Tt.meshbasic_frag},lambert:{uniforms:qn([We.common,We.specularmap,We.envmap,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.fog,We.lights,{emissive:{value:new Et(0)},envMapIntensity:{value:1}}]),vertexShader:Tt.meshlambert_vert,fragmentShader:Tt.meshlambert_frag},phong:{uniforms:qn([We.common,We.specularmap,We.envmap,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.fog,We.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Tt.meshphong_vert,fragmentShader:Tt.meshphong_frag},standard:{uniforms:qn([We.common,We.envmap,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.roughnessmap,We.metalnessmap,We.fog,We.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Tt.meshphysical_vert,fragmentShader:Tt.meshphysical_frag},toon:{uniforms:qn([We.common,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.gradientmap,We.fog,We.lights,{emissive:{value:new Et(0)}}]),vertexShader:Tt.meshtoon_vert,fragmentShader:Tt.meshtoon_frag},matcap:{uniforms:qn([We.common,We.bumpmap,We.normalmap,We.displacementmap,We.fog,{matcap:{value:null}}]),vertexShader:Tt.meshmatcap_vert,fragmentShader:Tt.meshmatcap_frag},points:{uniforms:qn([We.points,We.fog]),vertexShader:Tt.points_vert,fragmentShader:Tt.points_frag},dashed:{uniforms:qn([We.common,We.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Tt.linedashed_vert,fragmentShader:Tt.linedashed_frag},depth:{uniforms:qn([We.common,We.displacementmap]),vertexShader:Tt.depth_vert,fragmentShader:Tt.depth_frag},normal:{uniforms:qn([We.common,We.bumpmap,We.normalmap,We.displacementmap,{opacity:{value:1}}]),vertexShader:Tt.meshnormal_vert,fragmentShader:Tt.meshnormal_frag},sprite:{uniforms:qn([We.sprite,We.fog]),vertexShader:Tt.sprite_vert,fragmentShader:Tt.sprite_frag},background:{uniforms:{uvTransform:{value:new yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Tt.background_vert,fragmentShader:Tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new yt}},vertexShader:Tt.backgroundCube_vert,fragmentShader:Tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Tt.cube_vert,fragmentShader:Tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Tt.equirect_vert,fragmentShader:Tt.equirect_frag},distance:{uniforms:qn([We.common,We.displacementmap,{referencePosition:{value:new le},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Tt.distance_vert,fragmentShader:Tt.distance_frag},shadow:{uniforms:qn([We.lights,We.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:Tt.shadow_vert,fragmentShader:Tt.shadow_frag}};Ki.physical={uniforms:qn([Ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new yt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new yt},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new yt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new yt},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new yt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new yt}}]),vertexShader:Tt.meshphysical_vert,fragmentShader:Tt.meshphysical_frag};const ru={r:0,b:0,g:0},t2=new ln,iy=new yt;iy.set(-1,0,0,0,1,0,0,0,1);function n2(r,e,i,s,l,c){const f=new Et(0);let p=l===!0?0:1,m,h,v=null,_=0,x=null;function y(C){let I=C.isScene===!0?C.background:null;if(I&&I.isTexture){const F=C.backgroundBlurriness>0;I=e.get(I,F)}return I}function T(C){let I=!1;const F=y(C);F===null?S(f,p):F&&F.isColor&&(S(F,1),I=!0);const q=r.xr.getEnvironmentBlendMode();q==="additive"?i.buffers.color.setClear(0,0,0,1,c):q==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(r.autoClear||I)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function R(C,I){const F=y(I);F&&(F.isCubeTexture||F.mapping===Uu)?(h===void 0&&(h=new mn(new tr(1,1,1),new na({name:"BackgroundCubeMaterial",uniforms:oo(Ki.backgroundCube.uniforms),vertexShader:Ki.backgroundCube.vertexShader,fragmentShader:Ki.backgroundCube.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(q,z,j){this.matrixWorld.copyPosition(j.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=F,h.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(t2.makeRotationFromEuler(I.backgroundRotation)).transpose(),F.isCubeTexture&&F.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(iy),h.material.toneMapped=Lt.getTransfer(F.colorSpace)!==Yt,(v!==F||_!==F.version||x!==r.toneMapping)&&(h.material.needsUpdate=!0,v=F,_=F.version,x=r.toneMapping),h.layers.enableAll(),C.unshift(h,h.geometry,h.material,0,0,null)):F&&F.isTexture&&(m===void 0&&(m=new mn(new ro(2,2),new na({name:"BackgroundMaterial",uniforms:oo(Ki.background.uniforms),vertexShader:Ki.background.vertexShader,fragmentShader:Ki.background.fragmentShader,side:vs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(m)),m.material.uniforms.t2D.value=F,m.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,m.material.toneMapped=Lt.getTransfer(F.colorSpace)!==Yt,F.matrixAutoUpdate===!0&&F.updateMatrix(),m.material.uniforms.uvTransform.value.copy(F.matrix),(v!==F||_!==F.version||x!==r.toneMapping)&&(m.material.needsUpdate=!0,v=F,_=F.version,x=r.toneMapping),m.layers.enableAll(),C.unshift(m,m.geometry,m.material,0,0,null))}function S(C,I){C.getRGB(ru,$_(r)),i.buffers.color.setClear(ru.r,ru.g,ru.b,I,c)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0)}return{getClearColor:function(){return f},setClearColor:function(C,I=1){f.set(C),p=I,S(f,p)},getClearAlpha:function(){return p},setClearAlpha:function(C){p=C,S(f,p)},render:T,addToRenderList:R,dispose:b}}function i2(r,e){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=x(null);let c=l,f=!1;function p(V,Q,Z,ae,W){let D=!1;const k=_(V,ae,Z,Q);c!==k&&(c=k,h(c.object)),D=y(V,ae,Z,W),D&&T(V,ae,Z,W),W!==null&&e.update(W,r.ELEMENT_ARRAY_BUFFER),(D||f)&&(f=!1,F(V,Q,Z,ae),W!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function m(){return r.createVertexArray()}function h(V){return r.bindVertexArray(V)}function v(V){return r.deleteVertexArray(V)}function _(V,Q,Z,ae){const W=ae.wireframe===!0;let D=s[Q.id];D===void 0&&(D={},s[Q.id]=D);const k=V.isInstancedMesh===!0?V.id:0;let ie=D[k];ie===void 0&&(ie={},D[k]=ie);let J=ie[Z.id];J===void 0&&(J={},ie[Z.id]=J);let H=J[W];return H===void 0&&(H=x(m()),J[W]=H),H}function x(V){const Q=[],Z=[],ae=[];for(let W=0;W<i;W++)Q[W]=0,Z[W]=0,ae[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Q,enabledAttributes:Z,attributeDivisors:ae,object:V,attributes:{},index:null}}function y(V,Q,Z,ae){const W=c.attributes,D=Q.attributes;let k=0;const ie=Z.getAttributes();for(const J in ie)if(ie[J].location>=0){const B=W[J];let Y=D[J];if(Y===void 0&&(J==="instanceMatrix"&&V.instanceMatrix&&(Y=V.instanceMatrix),J==="instanceColor"&&V.instanceColor&&(Y=V.instanceColor)),B===void 0||B.attribute!==Y||Y&&B.data!==Y.data)return!0;k++}return c.attributesNum!==k||c.index!==ae}function T(V,Q,Z,ae){const W={},D=Q.attributes;let k=0;const ie=Z.getAttributes();for(const J in ie)if(ie[J].location>=0){let B=D[J];B===void 0&&(J==="instanceMatrix"&&V.instanceMatrix&&(B=V.instanceMatrix),J==="instanceColor"&&V.instanceColor&&(B=V.instanceColor));const Y={};Y.attribute=B,B&&B.data&&(Y.data=B.data),W[J]=Y,k++}c.attributes=W,c.attributesNum=k,c.index=ae}function R(){const V=c.newAttributes;for(let Q=0,Z=V.length;Q<Z;Q++)V[Q]=0}function S(V){b(V,0)}function b(V,Q){const Z=c.newAttributes,ae=c.enabledAttributes,W=c.attributeDivisors;Z[V]=1,ae[V]===0&&(r.enableVertexAttribArray(V),ae[V]=1),W[V]!==Q&&(r.vertexAttribDivisor(V,Q),W[V]=Q)}function C(){const V=c.newAttributes,Q=c.enabledAttributes;for(let Z=0,ae=Q.length;Z<ae;Z++)Q[Z]!==V[Z]&&(r.disableVertexAttribArray(Z),Q[Z]=0)}function I(V,Q,Z,ae,W,D,k){k===!0?r.vertexAttribIPointer(V,Q,Z,W,D):r.vertexAttribPointer(V,Q,Z,ae,W,D)}function F(V,Q,Z,ae){R();const W=ae.attributes,D=Z.getAttributes(),k=Q.defaultAttributeValues;for(const ie in D){const J=D[ie];if(J.location>=0){let H=W[ie];if(H===void 0&&(ie==="instanceMatrix"&&V.instanceMatrix&&(H=V.instanceMatrix),ie==="instanceColor"&&V.instanceColor&&(H=V.instanceColor)),H!==void 0){const B=H.normalized,Y=H.itemSize,ee=e.get(H);if(ee===void 0)continue;const ve=ee.buffer,ce=ee.type,A=ee.bytesPerElement,X=ce===r.INT||ce===r.UNSIGNED_INT||H.gpuType===Fp;if(H.isInterleavedBufferAttribute){const ne=H.data,L=ne.stride,Ee=H.offset;if(ne.isInstancedInterleavedBuffer){for(let Re=0;Re<J.locationSize;Re++)b(J.location+Re,ne.meshPerAttribute);V.isInstancedMesh!==!0&&ae._maxInstanceCount===void 0&&(ae._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Re=0;Re<J.locationSize;Re++)S(J.location+Re);r.bindBuffer(r.ARRAY_BUFFER,ve);for(let Re=0;Re<J.locationSize;Re++)I(J.location+Re,Y/J.locationSize,ce,B,L*A,(Ee+Y/J.locationSize*Re)*A,X)}else{if(H.isInstancedBufferAttribute){for(let ne=0;ne<J.locationSize;ne++)b(J.location+ne,H.meshPerAttribute);V.isInstancedMesh!==!0&&ae._maxInstanceCount===void 0&&(ae._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let ne=0;ne<J.locationSize;ne++)S(J.location+ne);r.bindBuffer(r.ARRAY_BUFFER,ve);for(let ne=0;ne<J.locationSize;ne++)I(J.location+ne,Y/J.locationSize,ce,B,Y*A,Y/J.locationSize*ne*A,X)}}else if(k!==void 0){const B=k[ie];if(B!==void 0)switch(B.length){case 2:r.vertexAttrib2fv(J.location,B);break;case 3:r.vertexAttrib3fv(J.location,B);break;case 4:r.vertexAttrib4fv(J.location,B);break;default:r.vertexAttrib1fv(J.location,B)}}}}C()}function q(){O();for(const V in s){const Q=s[V];for(const Z in Q){const ae=Q[Z];for(const W in ae){const D=ae[W];for(const k in D)v(D[k].object),delete D[k];delete ae[W]}}delete s[V]}}function z(V){if(s[V.id]===void 0)return;const Q=s[V.id];for(const Z in Q){const ae=Q[Z];for(const W in ae){const D=ae[W];for(const k in D)v(D[k].object),delete D[k];delete ae[W]}}delete s[V.id]}function j(V){for(const Q in s){const Z=s[Q];for(const ae in Z){const W=Z[ae];if(W[V.id]===void 0)continue;const D=W[V.id];for(const k in D)v(D[k].object),delete D[k];delete W[V.id]}}}function w(V){for(const Q in s){const Z=s[Q],ae=V.isInstancedMesh===!0?V.id:0,W=Z[ae];if(W!==void 0){for(const D in W){const k=W[D];for(const ie in k)v(k[ie].object),delete k[ie];delete W[D]}delete Z[ae],Object.keys(Z).length===0&&delete s[Q]}}}function O(){G(),f=!0,c!==l&&(c=l,h(c.object))}function G(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:p,reset:O,resetDefaultState:G,dispose:q,releaseStatesOfGeometry:z,releaseStatesOfObject:w,releaseStatesOfProgram:j,initAttributes:R,enableAttribute:S,disableUnusedAttributes:C}}function a2(r,e,i){let s;function l(m){s=m}function c(m,h){r.drawArrays(s,m,h),i.update(h,s,1)}function f(m,h,v){v!==0&&(r.drawArraysInstanced(s,m,h,v),i.update(h,s,v))}function p(m,h,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,m,0,h,0,v);let x=0;for(let y=0;y<v;y++)x+=h[y];i.update(x,s,1)}this.setMode=l,this.render=c,this.renderInstances=f,this.renderMultiDraw=p}function s2(r,e,i,s){let l;function c(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const j=e.get("EXT_texture_filter_anisotropic");l=r.getParameter(j.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function f(j){return!(j!==Hi&&s.convert(j)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function p(j){const w=j===Da&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(j!==_i&&s.convert(j)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&j!==Qi&&!w)}function m(j){if(j==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";j="mediump"}return j==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=i.precision!==void 0?i.precision:"highp";const v=m(h);v!==h&&(ut("WebGLRenderer:",h,"not supported, using",v,"instead."),h=v);const _=i.logarithmicDepthBuffer===!0,x=i.reversedDepthBuffer===!0&&e.has("EXT_clip_control");i.reversedDepthBuffer===!0&&x===!1&&ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const y=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),T=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),R=r.getParameter(r.MAX_TEXTURE_SIZE),S=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),b=r.getParameter(r.MAX_VERTEX_ATTRIBS),C=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),I=r.getParameter(r.MAX_VARYING_VECTORS),F=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),q=r.getParameter(r.MAX_SAMPLES),z=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:f,textureTypeReadable:p,precision:h,logarithmicDepthBuffer:_,reversedDepthBuffer:x,maxTextures:y,maxVertexTextures:T,maxTextureSize:R,maxCubemapSize:S,maxAttributes:b,maxVertexUniforms:C,maxVaryings:I,maxFragmentUniforms:F,maxSamples:q,samples:z}}function r2(r){const e=this;let i=null,s=0,l=!1,c=!1;const f=new ms,p=new yt,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(_,x){const y=_.length!==0||x||s!==0||l;return l=x,s=_.length,y},this.beginShadows=function(){c=!0,v(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(_,x){i=v(_,x,0)},this.setState=function(_,x,y){const T=_.clippingPlanes,R=_.clipIntersection,S=_.clipShadows,b=r.get(_);if(!l||T===null||T.length===0||c&&!S)c?v(null):h();else{const C=c?0:s,I=C*4;let F=b.clippingState||null;m.value=F,F=v(T,x,I,y);for(let q=0;q!==I;++q)F[q]=i[q];b.clippingState=F,this.numIntersection=R?this.numPlanes:0,this.numPlanes+=C}};function h(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function v(_,x,y,T){const R=_!==null?_.length:0;let S=null;if(R!==0){if(S=m.value,T!==!0||S===null){const b=y+R*4,C=x.matrixWorldInverse;p.getNormalMatrix(C),(S===null||S.length<b)&&(S=new Float32Array(b));for(let I=0,F=y;I!==R;++I,F+=4)f.copy(_[I]).applyMatrix4(C,p),f.normal.toArray(S,F),S[F+3]=f.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=R,e.numIntersection=0,S}}const xs=4,Gv=[.125,.215,.35,.446,.526,.582],Ws=20,o2=256,fl=new sm,Vv=new Et;let Th=null,Ah=0,wh=0,Ch=!1;const l2=new le;class jv{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,i=0,s=.1,l=100,c={}){const{size:f=256,position:p=l2}=c;Th=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(f);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(e,s,l,m,p),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Th,Ah,wh),this._renderer.xr.enabled=Ch,e.scissorTest=!1,Yr(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===$s||e.mapping===ao?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Th=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:jn,minFilter:jn,generateMipmaps:!1,type:Da,format:Hi,colorSpace:Eu,depthBuffer:!1},l=Xv(e,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xv(e,i,s);const{_lodMax:c}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=c2(c)),this._blurMaterial=f2(c,e,i),this._ggxMaterial=u2(c,e,i)}return l}_compileMaterial(e){const i=new mn(new En,e);this._renderer.compile(i,fl)}_sceneToCubeUV(e,i,s,l,c){const m=new vi(90,1,i,s),h=[1,-1,1,1,1,1],v=[1,1,1,-1,-1,-1],_=this._renderer,x=_.autoClear,y=_.toneMapping;_.getClearColor(Vv),_.toneMapping=$i,_.autoClear=!1,_.state.buffers.depth.getReversed()&&(_.setRenderTarget(l),_.clearDepth(),_.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new mn(new tr,new wu({name:"PMREM.Background",side:ii,depthWrite:!1,depthTest:!1})));const R=this._backgroundBox,S=R.material;let b=!1;const C=e.background;C?C.isColor&&(S.color.copy(C),e.background=null,b=!0):(S.color.copy(Vv),b=!0);for(let I=0;I<6;I++){const F=I%3;F===0?(m.up.set(0,h[I],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x+v[I],c.y,c.z)):F===1?(m.up.set(0,0,h[I]),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y+v[I],c.z)):(m.up.set(0,h[I],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y,c.z+v[I]));const q=this._cubeSize;Yr(l,F*q,I>2?q:0,q,q),_.setRenderTarget(l),b&&_.render(R,m),_.render(e,m)}_.toneMapping=y,_.autoClear=x,e.background=C}_textureToCubeUV(e,i){const s=this._renderer,l=e.mapping===$s||e.mapping===ao;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=qv()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wv());const c=l?this._cubemapMaterial:this._equirectMaterial,f=this._lodMeshes[0];f.material=c;const p=c.uniforms;p.envMap.value=e;const m=this._cubeSize;Yr(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(f,fl)}_applyPMREM(e){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodMeshes.length;for(let c=1;c<l;c++)this._applyGGXFilter(e,c-1,c);i.autoClear=s}_applyGGXFilter(e,i,s){const l=this._renderer,c=this._pingPongRenderTarget,f=this._ggxMaterial,p=this._lodMeshes[s];p.material=f;const m=f.uniforms,h=s/(this._lodMeshes.length-1),v=i/(this._lodMeshes.length-1),_=Math.sqrt(h*h-v*v),x=0+h*1.25,y=_*x,{_lodMax:T}=this,R=this._sizeLods[s],S=3*R*(s>T-xs?s-T+xs:0),b=4*(this._cubeSize-R);m.envMap.value=e.texture,m.roughness.value=y,m.mipInt.value=T-i,Yr(c,S,b,3*R,2*R),l.setRenderTarget(c),l.render(p,fl),m.envMap.value=c.texture,m.roughness.value=0,m.mipInt.value=T-s,Yr(e,S,b,3*R,2*R),l.setRenderTarget(e),l.render(p,fl)}_blur(e,i,s,l,c){const f=this._pingPongRenderTarget;this._halfBlur(e,f,i,s,l,"latitudinal",c),this._halfBlur(f,e,s,s,l,"longitudinal",c)}_halfBlur(e,i,s,l,c,f,p){const m=this._renderer,h=this._blurMaterial;f!=="latitudinal"&&f!=="longitudinal"&&Ut("blur direction must be either latitudinal or longitudinal!");const v=3,_=this._lodMeshes[l];_.material=h;const x=h.uniforms,y=this._sizeLods[s]-1,T=isFinite(c)?Math.PI/(2*y):2*Math.PI/(2*Ws-1),R=c/T,S=isFinite(c)?1+Math.floor(v*R):Ws;S>Ws&&ut(`sigmaRadians, ${c}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Ws}`);const b=[];let C=0;for(let j=0;j<Ws;++j){const w=j/R,O=Math.exp(-w*w/2);b.push(O),j===0?C+=O:j<S&&(C+=2*O)}for(let j=0;j<b.length;j++)b[j]=b[j]/C;x.envMap.value=e.texture,x.samples.value=S,x.weights.value=b,x.latitudinal.value=f==="latitudinal",p&&(x.poleAxis.value=p);const{_lodMax:I}=this;x.dTheta.value=T,x.mipInt.value=I-s;const F=this._sizeLods[l],q=3*F*(l>I-xs?l-I+xs:0),z=4*(this._cubeSize-F);Yr(i,q,z,3*F,2*F),m.setRenderTarget(i),m.render(_,fl)}}function c2(r){const e=[],i=[],s=[];let l=r;const c=r-xs+1+Gv.length;for(let f=0;f<c;f++){const p=Math.pow(2,l);e.push(p);let m=1/p;f>r-xs?m=Gv[f-r+xs-1]:f===0&&(m=0),i.push(m);const h=1/(p-2),v=-h,_=1+h,x=[v,v,_,v,_,_,v,v,_,_,v,_],y=6,T=6,R=3,S=2,b=1,C=new Float32Array(R*T*y),I=new Float32Array(S*T*y),F=new Float32Array(b*T*y);for(let z=0;z<y;z++){const j=z%3*2/3-1,w=z>2?0:-1,O=[j,w,0,j+2/3,w,0,j+2/3,w+1,0,j,w,0,j+2/3,w+1,0,j,w+1,0];C.set(O,R*T*z),I.set(x,S*T*z);const G=[z,z,z,z,z,z];F.set(G,b*T*z)}const q=new En;q.setAttribute("position",new ai(C,R)),q.setAttribute("uv",new ai(I,S)),q.setAttribute("faceIndex",new ai(F,b)),s.push(new mn(q,null)),l>xs&&l--}return{lodMeshes:s,sizeLods:e,sigmas:i}}function Xv(r,e,i){const s=new ea(r,e,i);return s.texture.mapping=Uu,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Yr(r,e,i,s,l){r.viewport.set(e,i,s,l),r.scissor.set(e,i,s,l)}function u2(r,e,i){return new na({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:o2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Fu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ra,depthTest:!1,depthWrite:!1})}function f2(r,e,i){const s=new Float32Array(Ws),l=new le(0,1,0);return new na({name:"SphericalGaussianBlur",defines:{n:Ws,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ra,depthTest:!1,depthWrite:!1})}function Wv(){return new na({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ra,depthTest:!1,depthWrite:!1})}function qv(){return new na({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ra,depthTest:!1,depthWrite:!1})}function Fu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class ay extends ea{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},l=[s,s,s,s,s,s];this.texture=new Q_(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new tr(5,5,5),c=new na({name:"CubemapFromEquirect",uniforms:oo(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:ii,blending:Ra});c.uniforms.tEquirect.value=i;const f=new mn(l,c),p=i.minFilter;return i.minFilter===qs&&(i.minFilter=jn),new dM(1,10,this).update(e,f),i.minFilter=p,f.geometry.dispose(),f.material.dispose(),this}clear(e,i=!0,s=!0,l=!0){const c=e.getRenderTarget();for(let f=0;f<6;f++)e.setRenderTarget(this,f),e.clear(i,s,l);e.setRenderTarget(c)}}function d2(r){let e=new WeakMap,i=new WeakMap,s=null;function l(x,y=!1){return x==null?null:y?f(x):c(x)}function c(x){if(x&&x.isTexture){const y=x.mapping;if(y===Jd||y===$d)if(e.has(x)){const T=e.get(x).texture;return p(T,x.mapping)}else{const T=x.image;if(T&&T.height>0){const R=new ay(T.height);return R.fromEquirectangularTexture(r,x),e.set(x,R),x.addEventListener("dispose",h),p(R.texture,x.mapping)}else return null}}return x}function f(x){if(x&&x.isTexture){const y=x.mapping,T=y===Jd||y===$d,R=y===$s||y===ao;if(T||R){let S=i.get(x);const b=S!==void 0?S.texture.pmremVersion:0;if(x.isRenderTargetTexture&&x.pmremVersion!==b)return s===null&&(s=new jv(r)),S=T?s.fromEquirectangular(x,S):s.fromCubemap(x,S),S.texture.pmremVersion=x.pmremVersion,i.set(x,S),S.texture;if(S!==void 0)return S.texture;{const C=x.image;return T&&C&&C.height>0||R&&C&&m(C)?(s===null&&(s=new jv(r)),S=T?s.fromEquirectangular(x):s.fromCubemap(x),S.texture.pmremVersion=x.pmremVersion,i.set(x,S),x.addEventListener("dispose",v),S.texture):null}}}return x}function p(x,y){return y===Jd?x.mapping=$s:y===$d&&(x.mapping=ao),x}function m(x){let y=0;const T=6;for(let R=0;R<T;R++)x[R]!==void 0&&y++;return y===T}function h(x){const y=x.target;y.removeEventListener("dispose",h);const T=e.get(y);T!==void 0&&(e.delete(y),T.dispose())}function v(x){const y=x.target;y.removeEventListener("dispose",v);const T=i.get(y);T!==void 0&&(i.delete(y),T.dispose())}function _(){e=new WeakMap,i=new WeakMap,s!==null&&(s.dispose(),s=null)}return{get:l,dispose:_}}function h2(r){const e={};function i(s){if(e[s]!==void 0)return e[s];const l=r.getExtension(s);return e[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&Tp("WebGLRenderer: "+s+" extension not supported."),l}}}function p2(r,e,i,s){const l={},c=new WeakMap;function f(_){const x=_.target;x.index!==null&&e.remove(x.index);for(const T in x.attributes)e.remove(x.attributes[T]);x.removeEventListener("dispose",f),delete l[x.id];const y=c.get(x);y&&(e.remove(y),c.delete(x)),s.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,i.memory.geometries--}function p(_,x){return l[x.id]===!0||(x.addEventListener("dispose",f),l[x.id]=!0,i.memory.geometries++),x}function m(_){const x=_.attributes;for(const y in x)e.update(x[y],r.ARRAY_BUFFER)}function h(_){const x=[],y=_.index,T=_.attributes.position;let R=0;if(T===void 0)return;if(y!==null){const C=y.array;R=y.version;for(let I=0,F=C.length;I<F;I+=3){const q=C[I+0],z=C[I+1],j=C[I+2];x.push(q,z,z,j,j,q)}}else{const C=T.array;R=T.version;for(let I=0,F=C.length/3-1;I<F;I+=3){const q=I+0,z=I+1,j=I+2;x.push(q,z,z,j,j,q)}}const S=new(T.count>=65535?K_:Z_)(x,1);S.version=R;const b=c.get(_);b&&e.remove(b),c.set(_,S)}function v(_){const x=c.get(_);if(x){const y=_.index;y!==null&&x.version<y.version&&h(_)}else h(_);return c.get(_)}return{get:p,update:m,getWireframeAttribute:v}}function m2(r,e,i){let s;function l(_){s=_}let c,f;function p(_){c=_.type,f=_.bytesPerElement}function m(_,x){r.drawElements(s,x,c,_*f),i.update(x,s,1)}function h(_,x,y){y!==0&&(r.drawElementsInstanced(s,x,c,_*f,y),i.update(x,s,y))}function v(_,x,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,x,0,c,_,0,y);let R=0;for(let S=0;S<y;S++)R+=x[S];i.update(R,s,1)}this.setMode=l,this.setIndex=p,this.render=m,this.renderInstances=h,this.renderMultiDraw=v}function g2(r){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,f,p){switch(i.calls++,f){case r.TRIANGLES:i.triangles+=p*(c/3);break;case r.LINES:i.lines+=p*(c/2);break;case r.LINE_STRIP:i.lines+=p*(c-1);break;case r.LINE_LOOP:i.lines+=p*c;break;case r.POINTS:i.points+=p*c;break;default:Ut("WebGLInfo: Unknown draw mode:",f);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:s}}function x2(r,e,i){const s=new WeakMap,l=new fn;function c(f,p,m){const h=f.morphTargetInfluences,v=p.morphAttributes.position||p.morphAttributes.normal||p.morphAttributes.color,_=v!==void 0?v.length:0;let x=s.get(p);if(x===void 0||x.count!==_){let G=function(){w.dispose(),s.delete(p),p.removeEventListener("dispose",G)};var y=G;x!==void 0&&x.texture.dispose();const T=p.morphAttributes.position!==void 0,R=p.morphAttributes.normal!==void 0,S=p.morphAttributes.color!==void 0,b=p.morphAttributes.position||[],C=p.morphAttributes.normal||[],I=p.morphAttributes.color||[];let F=0;T===!0&&(F=1),R===!0&&(F=2),S===!0&&(F=3);let q=p.attributes.position.count*F,z=1;q>e.maxTextureSize&&(z=Math.ceil(q/e.maxTextureSize),q=e.maxTextureSize);const j=new Float32Array(q*z*4*_),w=new q_(j,q,z,_);w.type=Qi,w.needsUpdate=!0;const O=F*4;for(let V=0;V<_;V++){const Q=b[V],Z=C[V],ae=I[V],W=q*z*4*V;for(let D=0;D<Q.count;D++){const k=D*O;T===!0&&(l.fromBufferAttribute(Q,D),j[W+k+0]=l.x,j[W+k+1]=l.y,j[W+k+2]=l.z,j[W+k+3]=0),R===!0&&(l.fromBufferAttribute(Z,D),j[W+k+4]=l.x,j[W+k+5]=l.y,j[W+k+6]=l.z,j[W+k+7]=0),S===!0&&(l.fromBufferAttribute(ae,D),j[W+k+8]=l.x,j[W+k+9]=l.y,j[W+k+10]=l.z,j[W+k+11]=ae.itemSize===4?l.w:1)}}x={count:_,texture:w,size:new ht(q,z)},s.set(p,x),p.addEventListener("dispose",G)}if(f.isInstancedMesh===!0&&f.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",f.morphTexture,i);else{let T=0;for(let S=0;S<h.length;S++)T+=h[S];const R=p.morphTargetsRelative?1:1-T;m.getUniforms().setValue(r,"morphTargetBaseInfluence",R),m.getUniforms().setValue(r,"morphTargetInfluences",h)}m.getUniforms().setValue(r,"morphTargetsTexture",x.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",x.size)}return{update:c}}function v2(r,e,i,s,l){let c=new WeakMap;function f(h){const v=l.render.frame,_=h.geometry,x=e.get(h,_);if(c.get(x)!==v&&(e.update(x),c.set(x,v)),h.isInstancedMesh&&(h.hasEventListener("dispose",m)===!1&&h.addEventListener("dispose",m),c.get(h)!==v&&(i.update(h.instanceMatrix,r.ARRAY_BUFFER),h.instanceColor!==null&&i.update(h.instanceColor,r.ARRAY_BUFFER),c.set(h,v))),h.isSkinnedMesh){const y=h.skeleton;c.get(y)!==v&&(y.update(),c.set(y,v))}return x}function p(){c=new WeakMap}function m(h){const v=h.target;v.removeEventListener("dispose",m),s.releaseStatesOfObject(v),i.remove(v.instanceMatrix),v.instanceColor!==null&&i.remove(v.instanceColor)}return{update:f,dispose:p}}const _2={[z_]:"LINEAR_TONE_MAPPING",[L_]:"REINHARD_TONE_MAPPING",[U_]:"CINEON_TONE_MAPPING",[Ip]:"ACES_FILMIC_TONE_MAPPING",[P_]:"AGX_TONE_MAPPING",[I_]:"NEUTRAL_TONE_MAPPING",[O_]:"CUSTOM_TONE_MAPPING"};function y2(r,e,i,s,l){const c=new ea(e,i,{type:r,depthBuffer:s,stencilBuffer:l,depthTexture:s?new so(e,i):void 0}),f=new ea(e,i,{type:Da,depthBuffer:!1,stencilBuffer:!1}),p=new En;p.setAttribute("position",new Gt([-1,3,0,-1,-1,0,3,-1,0],3)),p.setAttribute("uv",new Gt([0,2,0,0,2,0],2));const m=new sM({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new mn(p,m),v=new sm(-1,1,1,-1,0,1);let _=null,x=null,y=!1,T,R=null,S=[],b=!1;this.setSize=function(C,I){c.setSize(C,I),f.setSize(C,I);for(let F=0;F<S.length;F++){const q=S[F];q.setSize&&q.setSize(C,I)}},this.setEffects=function(C){S=C,b=S.length>0&&S[0].isRenderPass===!0;const I=c.width,F=c.height;for(let q=0;q<S.length;q++){const z=S[q];z.setSize&&z.setSize(I,F)}},this.begin=function(C,I){if(y||C.toneMapping===$i&&S.length===0)return!1;if(R=I,I!==null){const F=I.width,q=I.height;(c.width!==F||c.height!==q)&&this.setSize(F,q)}return b===!1&&C.setRenderTarget(c),T=C.toneMapping,C.toneMapping=$i,!0},this.hasRenderPass=function(){return b},this.end=function(C,I){C.toneMapping=T,y=!0;let F=c,q=f;for(let z=0;z<S.length;z++){const j=S[z];if(j.enabled!==!1&&(j.render(C,q,F,I),j.needsSwap!==!1)){const w=F;F=q,q=w}}if(_!==C.outputColorSpace||x!==C.toneMapping){_=C.outputColorSpace,x=C.toneMapping,m.defines={},Lt.getTransfer(_)===Yt&&(m.defines.SRGB_TRANSFER="");const z=_2[x];z&&(m.defines[z]=""),m.needsUpdate=!0}m.uniforms.tDiffuse.value=F.texture,C.setRenderTarget(R),C.render(h,v),R=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){c.depthTexture&&c.depthTexture.dispose(),c.dispose(),f.dispose(),p.dispose(),m.dispose()}}const sy=new Yn,Cp=new so(1,1),ry=new q_,oy=new OS,ly=new Q_,Yv=[],Zv=[],Kv=new Float32Array(16),Qv=new Float32Array(9),Jv=new Float32Array(4);function uo(r,e,i){const s=r[0];if(s<=0||s>0)return r;const l=e*i;let c=Yv[l];if(c===void 0&&(c=new Float32Array(l),Yv[l]=c),e!==0){s.toArray(c,0);for(let f=1,p=0;f!==e;++f)p+=i,r[f].toArray(c,p)}return c}function Cn(r,e){if(r.length!==e.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==e[i])return!1;return!0}function Rn(r,e){for(let i=0,s=e.length;i<s;i++)r[i]=e[i]}function Bu(r,e){let i=Zv[e];i===void 0&&(i=new Int32Array(e),Zv[e]=i);for(let s=0;s!==e;++s)i[s]=r.allocateTextureUnit();return i}function b2(r,e){const i=this.cache;i[0]!==e&&(r.uniform1f(this.addr,e),i[0]=e)}function S2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(Cn(i,e))return;r.uniform2fv(this.addr,e),Rn(i,e)}}function M2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(Cn(i,e))return;r.uniform3fv(this.addr,e),Rn(i,e)}}function E2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(Cn(i,e))return;r.uniform4fv(this.addr,e),Rn(i,e)}}function T2(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(Cn(i,e))return;r.uniformMatrix2fv(this.addr,!1,e),Rn(i,e)}else{if(Cn(i,s))return;Jv.set(s),r.uniformMatrix2fv(this.addr,!1,Jv),Rn(i,s)}}function A2(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(Cn(i,e))return;r.uniformMatrix3fv(this.addr,!1,e),Rn(i,e)}else{if(Cn(i,s))return;Qv.set(s),r.uniformMatrix3fv(this.addr,!1,Qv),Rn(i,s)}}function w2(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(Cn(i,e))return;r.uniformMatrix4fv(this.addr,!1,e),Rn(i,e)}else{if(Cn(i,s))return;Kv.set(s),r.uniformMatrix4fv(this.addr,!1,Kv),Rn(i,s)}}function C2(r,e){const i=this.cache;i[0]!==e&&(r.uniform1i(this.addr,e),i[0]=e)}function R2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(Cn(i,e))return;r.uniform2iv(this.addr,e),Rn(i,e)}}function N2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(Cn(i,e))return;r.uniform3iv(this.addr,e),Rn(i,e)}}function D2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(Cn(i,e))return;r.uniform4iv(this.addr,e),Rn(i,e)}}function z2(r,e){const i=this.cache;i[0]!==e&&(r.uniform1ui(this.addr,e),i[0]=e)}function L2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(Cn(i,e))return;r.uniform2uiv(this.addr,e),Rn(i,e)}}function U2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(Cn(i,e))return;r.uniform3uiv(this.addr,e),Rn(i,e)}}function O2(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(Cn(i,e))return;r.uniform4uiv(this.addr,e),Rn(i,e)}}function P2(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(Cp.compareFunction=i.isReversedDepthBuffer()?Xp:jp,c=Cp):c=sy,i.setTexture2D(e||c,l)}function I2(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(e||oy,l)}function F2(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(e||ly,l)}function B2(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(e||ry,l)}function k2(r){switch(r){case 5126:return b2;case 35664:return S2;case 35665:return M2;case 35666:return E2;case 35674:return T2;case 35675:return A2;case 35676:return w2;case 5124:case 35670:return C2;case 35667:case 35671:return R2;case 35668:case 35672:return N2;case 35669:case 35673:return D2;case 5125:return z2;case 36294:return L2;case 36295:return U2;case 36296:return O2;case 35678:case 36198:case 36298:case 36306:case 35682:return P2;case 35679:case 36299:case 36307:return I2;case 35680:case 36300:case 36308:case 36293:return F2;case 36289:case 36303:case 36311:case 36292:return B2}}function H2(r,e){r.uniform1fv(this.addr,e)}function G2(r,e){const i=uo(e,this.size,2);r.uniform2fv(this.addr,i)}function V2(r,e){const i=uo(e,this.size,3);r.uniform3fv(this.addr,i)}function j2(r,e){const i=uo(e,this.size,4);r.uniform4fv(this.addr,i)}function X2(r,e){const i=uo(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function W2(r,e){const i=uo(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function q2(r,e){const i=uo(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function Y2(r,e){r.uniform1iv(this.addr,e)}function Z2(r,e){r.uniform2iv(this.addr,e)}function K2(r,e){r.uniform3iv(this.addr,e)}function Q2(r,e){r.uniform4iv(this.addr,e)}function J2(r,e){r.uniform1uiv(this.addr,e)}function $2(r,e){r.uniform2uiv(this.addr,e)}function eA(r,e){r.uniform3uiv(this.addr,e)}function tA(r,e){r.uniform4uiv(this.addr,e)}function nA(r,e,i){const s=this.cache,l=e.length,c=Bu(i,l);Cn(s,c)||(r.uniform1iv(this.addr,c),Rn(s,c));let f;this.type===r.SAMPLER_2D_SHADOW?f=Cp:f=sy;for(let p=0;p!==l;++p)i.setTexture2D(e[p]||f,c[p])}function iA(r,e,i){const s=this.cache,l=e.length,c=Bu(i,l);Cn(s,c)||(r.uniform1iv(this.addr,c),Rn(s,c));for(let f=0;f!==l;++f)i.setTexture3D(e[f]||oy,c[f])}function aA(r,e,i){const s=this.cache,l=e.length,c=Bu(i,l);Cn(s,c)||(r.uniform1iv(this.addr,c),Rn(s,c));for(let f=0;f!==l;++f)i.setTextureCube(e[f]||ly,c[f])}function sA(r,e,i){const s=this.cache,l=e.length,c=Bu(i,l);Cn(s,c)||(r.uniform1iv(this.addr,c),Rn(s,c));for(let f=0;f!==l;++f)i.setTexture2DArray(e[f]||ry,c[f])}function rA(r){switch(r){case 5126:return H2;case 35664:return G2;case 35665:return V2;case 35666:return j2;case 35674:return X2;case 35675:return W2;case 35676:return q2;case 5124:case 35670:return Y2;case 35667:case 35671:return Z2;case 35668:case 35672:return K2;case 35669:case 35673:return Q2;case 5125:return J2;case 36294:return $2;case 36295:return eA;case 36296:return tA;case 35678:case 36198:case 36298:case 36306:case 35682:return nA;case 35679:case 36299:case 36307:return iA;case 35680:case 36300:case 36308:case 36293:return aA;case 36289:case 36303:case 36311:case 36292:return sA}}class oA{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.setValue=k2(i.type)}}class lA{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=rA(i.type)}}class cA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,s){const l=this.seq;for(let c=0,f=l.length;c!==f;++c){const p=l[c];p.setValue(e,i[p.id],s)}}}const Rh=/(\w+)(\])?(\[|\.)?/g;function $v(r,e){r.seq.push(e),r.map[e.id]=e}function uA(r,e,i){const s=r.name,l=s.length;for(Rh.lastIndex=0;;){const c=Rh.exec(s),f=Rh.lastIndex;let p=c[1];const m=c[2]==="]",h=c[3];if(m&&(p=p|0),h===void 0||h==="["&&f+2===l){$v(i,h===void 0?new oA(p,r,e):new lA(p,r,e));break}else{let _=i.map[p];_===void 0&&(_=new cA(p),$v(i,_)),i=_}}}class bu{constructor(e,i){this.seq=[],this.map={};const s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let f=0;f<s;++f){const p=e.getActiveUniform(i,f),m=e.getUniformLocation(i,p.name);uA(p,m,this)}const l=[],c=[];for(const f of this.seq)f.type===e.SAMPLER_2D_SHADOW||f.type===e.SAMPLER_CUBE_SHADOW||f.type===e.SAMPLER_2D_ARRAY_SHADOW?l.push(f):c.push(f);l.length>0&&(this.seq=l.concat(c))}setValue(e,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(e,s,l)}setOptional(e,i,s){const l=i[s];l!==void 0&&this.setValue(e,s,l)}static upload(e,i,s,l){for(let c=0,f=i.length;c!==f;++c){const p=i[c],m=s[p.id];m.needsUpdate!==!1&&p.setValue(e,m.value,l)}}static seqWithValue(e,i){const s=[];for(let l=0,c=e.length;l!==c;++l){const f=e[l];f.id in i&&s.push(f)}return s}}function e_(r,e,i){const s=r.createShader(e);return r.shaderSource(s,i),r.compileShader(s),s}const fA=37297;let dA=0;function hA(r,e){const i=r.split(`
`),s=[],l=Math.max(e-6,0),c=Math.min(e+6,i.length);for(let f=l;f<c;f++){const p=f+1;s.push(`${p===e?">":" "} ${p}: ${i[f]}`)}return s.join(`
`)}const t_=new yt;function pA(r){Lt._getMatrix(t_,Lt.workingColorSpace,r);const e=`mat3( ${t_.elements.map(i=>i.toFixed(4))} )`;switch(Lt.getTransfer(r)){case Tu:return[e,"LinearTransferOETF"];case Yt:return[e,"sRGBTransferOETF"];default:return ut("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function n_(r,e,i){const s=r.getShaderParameter(e,r.COMPILE_STATUS),c=(r.getShaderInfoLog(e)||"").trim();if(s&&c==="")return"";const f=/ERROR: 0:(\d+)/.exec(c);if(f){const p=parseInt(f[1]);return i.toUpperCase()+`

`+c+`

`+hA(r.getShaderSource(e),p)}else return c}function mA(r,e){const i=pA(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}const gA={[z_]:"Linear",[L_]:"Reinhard",[U_]:"Cineon",[Ip]:"ACESFilmic",[P_]:"AgX",[I_]:"Neutral",[O_]:"Custom"};function xA(r,e){const i=gA[e];return i===void 0?(ut("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const ou=new le;function vA(){Lt.getLuminanceCoefficients(ou);const r=ou.x.toFixed(4),e=ou.y.toFixed(4),i=ou.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _A(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ml).join(`
`)}function yA(r){const e=[];for(const i in r){const s=r[i];s!==!1&&e.push("#define "+i+" "+s)}return e.join(`
`)}function bA(r,e){const i={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(e,l),f=c.name;let p=1;c.type===r.FLOAT_MAT2&&(p=2),c.type===r.FLOAT_MAT3&&(p=3),c.type===r.FLOAT_MAT4&&(p=4),i[f]={type:c.type,location:r.getAttribLocation(e,f),locationSize:p}}return i}function ml(r){return r!==""}function i_(r,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function a_(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const SA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rp(r){return r.replace(SA,EA)}const MA=new Map;function EA(r,e){let i=Tt[e];if(i===void 0){const s=MA.get(e);if(s!==void 0)i=Tt[s],ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Rp(i)}const TA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function s_(r){return r.replace(TA,AA)}function AA(r,e,i,s){let l="";for(let c=parseInt(e);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function r_(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const wA={[mu]:"SHADOWMAP_TYPE_PCF",[pl]:"SHADOWMAP_TYPE_VSM"};function CA(r){return wA[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const RA={[$s]:"ENVMAP_TYPE_CUBE",[ao]:"ENVMAP_TYPE_CUBE",[Uu]:"ENVMAP_TYPE_CUBE_UV"};function NA(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":RA[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const DA={[ao]:"ENVMAP_MODE_REFRACTION"};function zA(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":DA[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const LA={[D_]:"ENVMAP_BLENDING_MULTIPLY",[$b]:"ENVMAP_BLENDING_MIX",[eS]:"ENVMAP_BLENDING_ADD"};function UA(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":LA[r.combine]||"ENVMAP_BLENDING_NONE"}function OA(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function PA(r,e,i,s){const l=r.getContext(),c=i.defines;let f=i.vertexShader,p=i.fragmentShader;const m=CA(i),h=NA(i),v=zA(i),_=UA(i),x=OA(i),y=_A(i),T=yA(c),R=l.createProgram();let S,b,C=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(ml).join(`
`),S.length>0&&(S+=`
`),b=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(ml).join(`
`),b.length>0&&(b+=`
`)):(S=[r_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+v:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ml).join(`
`),b=[r_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+h:"",i.envMap?"#define "+v:"",i.envMap?"#define "+_:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==$i?"#define TONE_MAPPING":"",i.toneMapping!==$i?Tt.tonemapping_pars_fragment:"",i.toneMapping!==$i?xA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",Tt.colorspace_pars_fragment,mA("linearToOutputTexel",i.outputColorSpace),vA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(ml).join(`
`)),f=Rp(f),f=i_(f,i),f=a_(f,i),p=Rp(p),p=i_(p,i),p=a_(p,i),f=s_(f),p=s_(p),i.isRawShaderMaterial!==!0&&(C=`#version 300 es
`,S=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,b=["#define varying in",i.glslVersion===lv?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===lv?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);const I=C+S+f,F=C+b+p,q=e_(l,l.VERTEX_SHADER,I),z=e_(l,l.FRAGMENT_SHADER,F);l.attachShader(R,q),l.attachShader(R,z),i.index0AttributeName!==void 0?l.bindAttribLocation(R,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(R,0,"position"),l.linkProgram(R);function j(V){if(r.debug.checkShaderErrors){const Q=l.getProgramInfoLog(R)||"",Z=l.getShaderInfoLog(q)||"",ae=l.getShaderInfoLog(z)||"",W=Q.trim(),D=Z.trim(),k=ae.trim();let ie=!0,J=!0;if(l.getProgramParameter(R,l.LINK_STATUS)===!1)if(ie=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,R,q,z);else{const H=n_(l,q,"vertex"),B=n_(l,z,"fragment");Ut("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(R,l.VALIDATE_STATUS)+`

Material Name: `+V.name+`
Material Type: `+V.type+`

Program Info Log: `+W+`
`+H+`
`+B)}else W!==""?ut("WebGLProgram: Program Info Log:",W):(D===""||k==="")&&(J=!1);J&&(V.diagnostics={runnable:ie,programLog:W,vertexShader:{log:D,prefix:S},fragmentShader:{log:k,prefix:b}})}l.deleteShader(q),l.deleteShader(z),w=new bu(l,R),O=bA(l,R)}let w;this.getUniforms=function(){return w===void 0&&j(this),w};let O;this.getAttributes=function(){return O===void 0&&j(this),O};let G=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=l.getProgramParameter(R,fA)),G},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(R),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=dA++,this.cacheKey=e,this.usedTimes=1,this.program=R,this.vertexShader=q,this.fragmentShader=z,this}let IA=0;class FA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,s=e.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(s),f=this._getShaderCacheForMaterial(e);return f.has(l)===!1&&(f.add(l),l.usedTimes++),f.has(c)===!1&&(f.add(c),c.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let s=i.get(e);return s===void 0&&(s=new Set,i.set(e,s)),s}_getShaderStage(e){const i=this.shaderCache;let s=i.get(e);return s===void 0&&(s=new BA(e),i.set(e,s)),s}}class BA{constructor(e){this.id=IA++,this.code=e,this.usedTimes=0}}function kA(r){return r===er||r===Su||r===Mu}function HA(r,e,i,s,l,c){const f=new Yp,p=new FA,m=new Set,h=[],v=new Map,_=s.logarithmicDepthBuffer;let x=s.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(w){return m.add(w),w===0?"uv":`uv${w}`}function R(w,O,G,V,Q,Z){const ae=V.fog,W=Q.geometry,D=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?V.environment:null,k=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap,ie=e.get(w.envMap||D,k),J=ie&&ie.mapping===Uu?ie.image.height:null,H=y[w.type];w.precision!==null&&(x=s.getMaxPrecision(w.precision),x!==w.precision&&ut("WebGLProgram.getParameters:",w.precision,"not supported, using",x,"instead."));const B=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Y=B!==void 0?B.length:0;let ee=0;W.morphAttributes.position!==void 0&&(ee=1),W.morphAttributes.normal!==void 0&&(ee=2),W.morphAttributes.color!==void 0&&(ee=3);let ve,ce,A,X;if(H){const dt=Ki[H];ve=dt.vertexShader,ce=dt.fragmentShader}else ve=w.vertexShader,ce=w.fragmentShader,p.update(w),A=p.getVertexShaderID(w),X=p.getFragmentShaderID(w);const ne=r.getRenderTarget(),L=r.state.buffers.depth.getReversed(),Ee=Q.isInstancedMesh===!0,Re=Q.isBatchedMesh===!0,Ve=!!w.map,ke=!!w.matcap,Ze=!!ie,at=!!w.aoMap,qe=!!w.lightMap,lt=!!w.bumpMap,ze=!!w.normalMap,gt=!!w.displacementMap,te=!!w.emissiveMap,vt=!!w.metalnessMap,nt=!!w.roughnessMap,pt=w.anisotropy>0,Pe=w.clearcoat>0,kt=w.dispersion>0,N=w.iridescence>0,E=w.sheen>0,K=w.transmission>0,ue=pt&&!!w.anisotropyMap,he=Pe&&!!w.clearcoatMap,Me=Pe&&!!w.clearcoatNormalMap,Ne=Pe&&!!w.clearcoatRoughnessMap,de=N&&!!w.iridescenceMap,be=N&&!!w.iridescenceThicknessMap,Le=E&&!!w.sheenColorMap,He=E&&!!w.sheenRoughnessMap,Ie=!!w.specularMap,Fe=!!w.specularColorMap,mt=!!w.specularIntensityMap,it=K&&!!w.transmissionMap,xt=K&&!!w.thicknessMap,se=!!w.gradientMap,Ue=!!w.alphaMap,Ae=w.alphaTest>0,Xe=!!w.alphaHash,Be=!!w.extensions;let De=$i;w.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(De=r.toneMapping);const et={shaderID:H,shaderType:w.type,shaderName:w.name,vertexShader:ve,fragmentShader:ce,defines:w.defines,customVertexShaderID:A,customFragmentShaderID:X,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:x,batching:Re,batchingColor:Re&&Q._colorsTexture!==null,instancing:Ee,instancingColor:Ee&&Q.instanceColor!==null,instancingMorph:Ee&&Q.morphTexture!==null,outputColorSpace:ne===null?r.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Lt.workingColorSpace,alphaToCoverage:!!w.alphaToCoverage,map:Ve,matcap:ke,envMap:Ze,envMapMode:Ze&&ie.mapping,envMapCubeUVHeight:J,aoMap:at,lightMap:qe,bumpMap:lt,normalMap:ze,displacementMap:gt,emissiveMap:te,normalMapObjectSpace:ze&&w.normalMapType===iS,normalMapTangentSpace:ze&&w.normalMapType===Ep,packedNormalMap:ze&&w.normalMapType===Ep&&kA(w.normalMap.format),metalnessMap:vt,roughnessMap:nt,anisotropy:pt,anisotropyMap:ue,clearcoat:Pe,clearcoatMap:he,clearcoatNormalMap:Me,clearcoatRoughnessMap:Ne,dispersion:kt,iridescence:N,iridescenceMap:de,iridescenceThicknessMap:be,sheen:E,sheenColorMap:Le,sheenRoughnessMap:He,specularMap:Ie,specularColorMap:Fe,specularIntensityMap:mt,transmission:K,transmissionMap:it,thicknessMap:xt,gradientMap:se,opaque:w.transparent===!1&&w.blending===eo&&w.alphaToCoverage===!1,alphaMap:Ue,alphaTest:Ae,alphaHash:Xe,combine:w.combine,mapUv:Ve&&T(w.map.channel),aoMapUv:at&&T(w.aoMap.channel),lightMapUv:qe&&T(w.lightMap.channel),bumpMapUv:lt&&T(w.bumpMap.channel),normalMapUv:ze&&T(w.normalMap.channel),displacementMapUv:gt&&T(w.displacementMap.channel),emissiveMapUv:te&&T(w.emissiveMap.channel),metalnessMapUv:vt&&T(w.metalnessMap.channel),roughnessMapUv:nt&&T(w.roughnessMap.channel),anisotropyMapUv:ue&&T(w.anisotropyMap.channel),clearcoatMapUv:he&&T(w.clearcoatMap.channel),clearcoatNormalMapUv:Me&&T(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ne&&T(w.clearcoatRoughnessMap.channel),iridescenceMapUv:de&&T(w.iridescenceMap.channel),iridescenceThicknessMapUv:be&&T(w.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&T(w.sheenColorMap.channel),sheenRoughnessMapUv:He&&T(w.sheenRoughnessMap.channel),specularMapUv:Ie&&T(w.specularMap.channel),specularColorMapUv:Fe&&T(w.specularColorMap.channel),specularIntensityMapUv:mt&&T(w.specularIntensityMap.channel),transmissionMapUv:it&&T(w.transmissionMap.channel),thicknessMapUv:xt&&T(w.thicknessMap.channel),alphaMapUv:Ue&&T(w.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ze||pt),vertexNormals:!!W.attributes.normal,vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:Q.isPoints===!0&&!!W.attributes.uv&&(Ve||Ue),fog:!!ae,useFog:w.fog===!0,fogExp2:!!ae&&ae.isFogExp2,flatShading:w.wireframe===!1&&(w.flatShading===!0||W.attributes.normal===void 0&&ze===!1&&(w.isMeshLambertMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isMeshPhysicalMaterial)),sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:_,reversedDepthBuffer:L,skinning:Q.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Y,morphTextureStride:ee,numDirLights:O.directional.length,numPointLights:O.point.length,numSpotLights:O.spot.length,numSpotLightMaps:O.spotLightMap.length,numRectAreaLights:O.rectArea.length,numHemiLights:O.hemi.length,numDirLightShadows:O.directionalShadowMap.length,numPointLightShadows:O.pointShadowMap.length,numSpotLightShadows:O.spotShadowMap.length,numSpotLightShadowsWithMaps:O.numSpotLightShadowsWithMaps,numLightProbes:O.numLightProbes,numLightProbeGrids:Z.length,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:w.dithering,shadowMapEnabled:r.shadowMap.enabled&&G.length>0,shadowMapType:r.shadowMap.type,toneMapping:De,decodeVideoTexture:Ve&&w.map.isVideoTexture===!0&&Lt.getTransfer(w.map.colorSpace)===Yt,decodeVideoTextureEmissive:te&&w.emissiveMap.isVideoTexture===!0&&Lt.getTransfer(w.emissiveMap.colorSpace)===Yt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Aa,flipSided:w.side===ii,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Be&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&w.extensions.multiDraw===!0||Re)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return et.vertexUv1s=m.has(1),et.vertexUv2s=m.has(2),et.vertexUv3s=m.has(3),m.clear(),et}function S(w){const O=[];if(w.shaderID?O.push(w.shaderID):(O.push(w.customVertexShaderID),O.push(w.customFragmentShaderID)),w.defines!==void 0)for(const G in w.defines)O.push(G),O.push(w.defines[G]);return w.isRawShaderMaterial===!1&&(b(O,w),C(O,w),O.push(r.outputColorSpace)),O.push(w.customProgramCacheKey),O.join()}function b(w,O){w.push(O.precision),w.push(O.outputColorSpace),w.push(O.envMapMode),w.push(O.envMapCubeUVHeight),w.push(O.mapUv),w.push(O.alphaMapUv),w.push(O.lightMapUv),w.push(O.aoMapUv),w.push(O.bumpMapUv),w.push(O.normalMapUv),w.push(O.displacementMapUv),w.push(O.emissiveMapUv),w.push(O.metalnessMapUv),w.push(O.roughnessMapUv),w.push(O.anisotropyMapUv),w.push(O.clearcoatMapUv),w.push(O.clearcoatNormalMapUv),w.push(O.clearcoatRoughnessMapUv),w.push(O.iridescenceMapUv),w.push(O.iridescenceThicknessMapUv),w.push(O.sheenColorMapUv),w.push(O.sheenRoughnessMapUv),w.push(O.specularMapUv),w.push(O.specularColorMapUv),w.push(O.specularIntensityMapUv),w.push(O.transmissionMapUv),w.push(O.thicknessMapUv),w.push(O.combine),w.push(O.fogExp2),w.push(O.sizeAttenuation),w.push(O.morphTargetsCount),w.push(O.morphAttributeCount),w.push(O.numDirLights),w.push(O.numPointLights),w.push(O.numSpotLights),w.push(O.numSpotLightMaps),w.push(O.numHemiLights),w.push(O.numRectAreaLights),w.push(O.numDirLightShadows),w.push(O.numPointLightShadows),w.push(O.numSpotLightShadows),w.push(O.numSpotLightShadowsWithMaps),w.push(O.numLightProbes),w.push(O.shadowMapType),w.push(O.toneMapping),w.push(O.numClippingPlanes),w.push(O.numClipIntersection),w.push(O.depthPacking)}function C(w,O){f.disableAll(),O.instancing&&f.enable(0),O.instancingColor&&f.enable(1),O.instancingMorph&&f.enable(2),O.matcap&&f.enable(3),O.envMap&&f.enable(4),O.normalMapObjectSpace&&f.enable(5),O.normalMapTangentSpace&&f.enable(6),O.clearcoat&&f.enable(7),O.iridescence&&f.enable(8),O.alphaTest&&f.enable(9),O.vertexColors&&f.enable(10),O.vertexAlphas&&f.enable(11),O.vertexUv1s&&f.enable(12),O.vertexUv2s&&f.enable(13),O.vertexUv3s&&f.enable(14),O.vertexTangents&&f.enable(15),O.anisotropy&&f.enable(16),O.alphaHash&&f.enable(17),O.batching&&f.enable(18),O.dispersion&&f.enable(19),O.batchingColor&&f.enable(20),O.gradientMap&&f.enable(21),O.packedNormalMap&&f.enable(22),O.vertexNormals&&f.enable(23),w.push(f.mask),f.disableAll(),O.fog&&f.enable(0),O.useFog&&f.enable(1),O.flatShading&&f.enable(2),O.logarithmicDepthBuffer&&f.enable(3),O.reversedDepthBuffer&&f.enable(4),O.skinning&&f.enable(5),O.morphTargets&&f.enable(6),O.morphNormals&&f.enable(7),O.morphColors&&f.enable(8),O.premultipliedAlpha&&f.enable(9),O.shadowMapEnabled&&f.enable(10),O.doubleSided&&f.enable(11),O.flipSided&&f.enable(12),O.useDepthPacking&&f.enable(13),O.dithering&&f.enable(14),O.transmission&&f.enable(15),O.sheen&&f.enable(16),O.opaque&&f.enable(17),O.pointsUvs&&f.enable(18),O.decodeVideoTexture&&f.enable(19),O.decodeVideoTextureEmissive&&f.enable(20),O.alphaToCoverage&&f.enable(21),O.numLightProbeGrids>0&&f.enable(22),w.push(f.mask)}function I(w){const O=y[w.type];let G;if(O){const V=Ki[O];G=nM.clone(V.uniforms)}else G=w.uniforms;return G}function F(w,O){let G=v.get(O);return G!==void 0?++G.usedTimes:(G=new PA(r,O,w,l),h.push(G),v.set(O,G)),G}function q(w){if(--w.usedTimes===0){const O=h.indexOf(w);h[O]=h[h.length-1],h.pop(),v.delete(w.cacheKey),w.destroy()}}function z(w){p.remove(w)}function j(){p.dispose()}return{getParameters:R,getProgramCacheKey:S,getUniforms:I,acquireProgram:F,releaseProgram:q,releaseShaderCache:z,programs:h,dispose:j}}function GA(){let r=new WeakMap;function e(f){return r.has(f)}function i(f){let p=r.get(f);return p===void 0&&(p={},r.set(f,p)),p}function s(f){r.delete(f)}function l(f,p,m){r.get(f)[p]=m}function c(){r=new WeakMap}return{has:e,get:i,remove:s,update:l,dispose:c}}function VA(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function o_(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function l_(){const r=[];let e=0;const i=[],s=[],l=[];function c(){e=0,i.length=0,s.length=0,l.length=0}function f(x){let y=0;return x.isInstancedMesh&&(y+=2),x.isSkinnedMesh&&(y+=1),y}function p(x,y,T,R,S,b){let C=r[e];return C===void 0?(C={id:x.id,object:x,geometry:y,material:T,materialVariant:f(x),groupOrder:R,renderOrder:x.renderOrder,z:S,group:b},r[e]=C):(C.id=x.id,C.object=x,C.geometry=y,C.material=T,C.materialVariant=f(x),C.groupOrder=R,C.renderOrder=x.renderOrder,C.z=S,C.group=b),e++,C}function m(x,y,T,R,S,b){const C=p(x,y,T,R,S,b);T.transmission>0?s.push(C):T.transparent===!0?l.push(C):i.push(C)}function h(x,y,T,R,S,b){const C=p(x,y,T,R,S,b);T.transmission>0?s.unshift(C):T.transparent===!0?l.unshift(C):i.unshift(C)}function v(x,y){i.length>1&&i.sort(x||VA),s.length>1&&s.sort(y||o_),l.length>1&&l.sort(y||o_)}function _(){for(let x=e,y=r.length;x<y;x++){const T=r[x];if(T.id===null)break;T.id=null,T.object=null,T.geometry=null,T.material=null,T.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:m,unshift:h,finish:_,sort:v}}function jA(){let r=new WeakMap;function e(s,l){const c=r.get(s);let f;return c===void 0?(f=new l_,r.set(s,[f])):l>=c.length?(f=new l_,c.push(f)):f=c[l],f}function i(){r=new WeakMap}return{get:e,dispose:i}}function XA(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new le,color:new Et};break;case"SpotLight":i={position:new le,direction:new le,color:new Et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new le,color:new Et,distance:0,decay:0};break;case"HemisphereLight":i={direction:new le,skyColor:new Et,groundColor:new Et};break;case"RectAreaLight":i={color:new Et,position:new le,halfWidth:new le,halfHeight:new le};break}return r[e.id]=i,i}}}function WA(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=i,i}}}let qA=0;function YA(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function ZA(r){const e=new XA,i=WA(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new le);const l=new le,c=new ln,f=new ln;function p(h){let v=0,_=0,x=0;for(let O=0;O<9;O++)s.probe[O].set(0,0,0);let y=0,T=0,R=0,S=0,b=0,C=0,I=0,F=0,q=0,z=0,j=0;h.sort(YA);for(let O=0,G=h.length;O<G;O++){const V=h[O],Q=V.color,Z=V.intensity,ae=V.distance;let W=null;if(V.shadow&&V.shadow.map&&(V.shadow.map.texture.format===er?W=V.shadow.map.texture:W=V.shadow.map.depthTexture||V.shadow.map.texture),V.isAmbientLight)v+=Q.r*Z,_+=Q.g*Z,x+=Q.b*Z;else if(V.isLightProbe){for(let D=0;D<9;D++)s.probe[D].addScaledVector(V.sh.coefficients[D],Z);j++}else if(V.isDirectionalLight){const D=e.get(V);if(D.color.copy(V.color).multiplyScalar(V.intensity),V.castShadow){const k=V.shadow,ie=i.get(V);ie.shadowIntensity=k.intensity,ie.shadowBias=k.bias,ie.shadowNormalBias=k.normalBias,ie.shadowRadius=k.radius,ie.shadowMapSize=k.mapSize,s.directionalShadow[y]=ie,s.directionalShadowMap[y]=W,s.directionalShadowMatrix[y]=V.shadow.matrix,C++}s.directional[y]=D,y++}else if(V.isSpotLight){const D=e.get(V);D.position.setFromMatrixPosition(V.matrixWorld),D.color.copy(Q).multiplyScalar(Z),D.distance=ae,D.coneCos=Math.cos(V.angle),D.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),D.decay=V.decay,s.spot[R]=D;const k=V.shadow;if(V.map&&(s.spotLightMap[q]=V.map,q++,k.updateMatrices(V),V.castShadow&&z++),s.spotLightMatrix[R]=k.matrix,V.castShadow){const ie=i.get(V);ie.shadowIntensity=k.intensity,ie.shadowBias=k.bias,ie.shadowNormalBias=k.normalBias,ie.shadowRadius=k.radius,ie.shadowMapSize=k.mapSize,s.spotShadow[R]=ie,s.spotShadowMap[R]=W,F++}R++}else if(V.isRectAreaLight){const D=e.get(V);D.color.copy(Q).multiplyScalar(Z),D.halfWidth.set(V.width*.5,0,0),D.halfHeight.set(0,V.height*.5,0),s.rectArea[S]=D,S++}else if(V.isPointLight){const D=e.get(V);if(D.color.copy(V.color).multiplyScalar(V.intensity),D.distance=V.distance,D.decay=V.decay,V.castShadow){const k=V.shadow,ie=i.get(V);ie.shadowIntensity=k.intensity,ie.shadowBias=k.bias,ie.shadowNormalBias=k.normalBias,ie.shadowRadius=k.radius,ie.shadowMapSize=k.mapSize,ie.shadowCameraNear=k.camera.near,ie.shadowCameraFar=k.camera.far,s.pointShadow[T]=ie,s.pointShadowMap[T]=W,s.pointShadowMatrix[T]=V.shadow.matrix,I++}s.point[T]=D,T++}else if(V.isHemisphereLight){const D=e.get(V);D.skyColor.copy(V.color).multiplyScalar(Z),D.groundColor.copy(V.groundColor).multiplyScalar(Z),s.hemi[b]=D,b++}}S>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=We.LTC_FLOAT_1,s.rectAreaLTC2=We.LTC_FLOAT_2):(s.rectAreaLTC1=We.LTC_HALF_1,s.rectAreaLTC2=We.LTC_HALF_2)),s.ambient[0]=v,s.ambient[1]=_,s.ambient[2]=x;const w=s.hash;(w.directionalLength!==y||w.pointLength!==T||w.spotLength!==R||w.rectAreaLength!==S||w.hemiLength!==b||w.numDirectionalShadows!==C||w.numPointShadows!==I||w.numSpotShadows!==F||w.numSpotMaps!==q||w.numLightProbes!==j)&&(s.directional.length=y,s.spot.length=R,s.rectArea.length=S,s.point.length=T,s.hemi.length=b,s.directionalShadow.length=C,s.directionalShadowMap.length=C,s.pointShadow.length=I,s.pointShadowMap.length=I,s.spotShadow.length=F,s.spotShadowMap.length=F,s.directionalShadowMatrix.length=C,s.pointShadowMatrix.length=I,s.spotLightMatrix.length=F+q-z,s.spotLightMap.length=q,s.numSpotLightShadowsWithMaps=z,s.numLightProbes=j,w.directionalLength=y,w.pointLength=T,w.spotLength=R,w.rectAreaLength=S,w.hemiLength=b,w.numDirectionalShadows=C,w.numPointShadows=I,w.numSpotShadows=F,w.numSpotMaps=q,w.numLightProbes=j,s.version=qA++)}function m(h,v){let _=0,x=0,y=0,T=0,R=0;const S=v.matrixWorldInverse;for(let b=0,C=h.length;b<C;b++){const I=h[b];if(I.isDirectionalLight){const F=s.directional[_];F.direction.setFromMatrixPosition(I.matrixWorld),l.setFromMatrixPosition(I.target.matrixWorld),F.direction.sub(l),F.direction.transformDirection(S),_++}else if(I.isSpotLight){const F=s.spot[y];F.position.setFromMatrixPosition(I.matrixWorld),F.position.applyMatrix4(S),F.direction.setFromMatrixPosition(I.matrixWorld),l.setFromMatrixPosition(I.target.matrixWorld),F.direction.sub(l),F.direction.transformDirection(S),y++}else if(I.isRectAreaLight){const F=s.rectArea[T];F.position.setFromMatrixPosition(I.matrixWorld),F.position.applyMatrix4(S),f.identity(),c.copy(I.matrixWorld),c.premultiply(S),f.extractRotation(c),F.halfWidth.set(I.width*.5,0,0),F.halfHeight.set(0,I.height*.5,0),F.halfWidth.applyMatrix4(f),F.halfHeight.applyMatrix4(f),T++}else if(I.isPointLight){const F=s.point[x];F.position.setFromMatrixPosition(I.matrixWorld),F.position.applyMatrix4(S),x++}else if(I.isHemisphereLight){const F=s.hemi[R];F.direction.setFromMatrixPosition(I.matrixWorld),F.direction.transformDirection(S),R++}}}return{setup:p,setupView:m,state:s}}function c_(r){const e=new ZA(r),i=[],s=[],l=[];function c(x){_.camera=x,i.length=0,s.length=0,l.length=0}function f(x){i.push(x)}function p(x){s.push(x)}function m(x){l.push(x)}function h(){e.setup(i)}function v(x){e.setupView(i,x)}const _={lightsArray:i,shadowsArray:s,lightProbeGridArray:l,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:c,state:_,setupLights:h,setupLightsView:v,pushLight:f,pushShadow:p,pushLightProbeGrid:m}}function KA(r){let e=new WeakMap;function i(l,c=0){const f=e.get(l);let p;return f===void 0?(p=new c_(r),e.set(l,[p])):c>=f.length?(p=new c_(r),f.push(p)):p=f[c],p}function s(){e=new WeakMap}return{get:i,dispose:s}}const QA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,JA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,$A=[new le(1,0,0),new le(-1,0,0),new le(0,1,0),new le(0,-1,0),new le(0,0,1),new le(0,0,-1)],e3=[new le(0,-1,0),new le(0,-1,0),new le(0,0,1),new le(0,0,-1),new le(0,-1,0),new le(0,-1,0)],u_=new ln,dl=new le,Nh=new le;function t3(r,e,i){let s=new Kp;const l=new ht,c=new ht,f=new fn,p=new oM,m=new lM,h={},v=i.maxTextureSize,_={[vs]:ii,[ii]:vs,[Aa]:Aa},x=new na({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:QA,fragmentShader:JA}),y=x.clone();y.defines.HORIZONTAL_PASS=1;const T=new En;T.setAttribute("position",new ai(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const R=new mn(T,x),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mu;let b=this.type;this.render=function(z,j,w){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||z.length===0)return;this.type===N_&&(ut("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=mu);const O=r.getRenderTarget(),G=r.getActiveCubeFace(),V=r.getActiveMipmapLevel(),Q=r.state;Q.setBlending(Ra),Q.buffers.depth.getReversed()===!0?Q.buffers.color.setClear(0,0,0,0):Q.buffers.color.setClear(1,1,1,1),Q.buffers.depth.setTest(!0),Q.setScissorTest(!1);const Z=b!==this.type;Z&&j.traverse(function(ae){ae.material&&(Array.isArray(ae.material)?ae.material.forEach(W=>W.needsUpdate=!0):ae.material.needsUpdate=!0)});for(let ae=0,W=z.length;ae<W;ae++){const D=z[ae],k=D.shadow;if(k===void 0){ut("WebGLShadowMap:",D,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;l.copy(k.mapSize);const ie=k.getFrameExtents();l.multiply(ie),c.copy(k.mapSize),(l.x>v||l.y>v)&&(l.x>v&&(c.x=Math.floor(v/ie.x),l.x=c.x*ie.x,k.mapSize.x=c.x),l.y>v&&(c.y=Math.floor(v/ie.y),l.y=c.y*ie.y,k.mapSize.y=c.y));const J=r.state.buffers.depth.getReversed();if(k.camera._reversedDepth=J,k.map===null||Z===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===pl){if(D.isPointLight){ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new ea(l.x,l.y,{format:er,type:Da,minFilter:jn,magFilter:jn,generateMipmaps:!1}),k.map.texture.name=D.name+".shadowMap",k.map.depthTexture=new so(l.x,l.y,Qi),k.map.depthTexture.name=D.name+".shadowMapDepth",k.map.depthTexture.format=za,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Fn,k.map.depthTexture.magFilter=Fn}else D.isPointLight?(k.map=new ay(l.x),k.map.depthTexture=new $S(l.x,ta)):(k.map=new ea(l.x,l.y),k.map.depthTexture=new so(l.x,l.y,ta)),k.map.depthTexture.name=D.name+".shadowMap",k.map.depthTexture.format=za,this.type===mu?(k.map.depthTexture.compareFunction=J?Xp:jp,k.map.depthTexture.minFilter=jn,k.map.depthTexture.magFilter=jn):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Fn,k.map.depthTexture.magFilter=Fn);k.camera.updateProjectionMatrix()}const H=k.map.isWebGLCubeRenderTarget?6:1;for(let B=0;B<H;B++){if(k.map.isWebGLCubeRenderTarget)r.setRenderTarget(k.map,B),r.clear();else{B===0&&(r.setRenderTarget(k.map),r.clear());const Y=k.getViewport(B);f.set(c.x*Y.x,c.y*Y.y,c.x*Y.z,c.y*Y.w),Q.viewport(f)}if(D.isPointLight){const Y=k.camera,ee=k.matrix,ve=D.distance||Y.far;ve!==Y.far&&(Y.far=ve,Y.updateProjectionMatrix()),dl.setFromMatrixPosition(D.matrixWorld),Y.position.copy(dl),Nh.copy(Y.position),Nh.add($A[B]),Y.up.copy(e3[B]),Y.lookAt(Nh),Y.updateMatrixWorld(),ee.makeTranslation(-dl.x,-dl.y,-dl.z),u_.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),k._frustum.setFromProjectionMatrix(u_,Y.coordinateSystem,Y.reversedDepth)}else k.updateMatrices(D);s=k.getFrustum(),F(j,w,k.camera,D,this.type)}k.isPointLightShadow!==!0&&this.type===pl&&C(k,w),k.needsUpdate=!1}b=this.type,S.needsUpdate=!1,r.setRenderTarget(O,G,V)};function C(z,j){const w=e.update(R);x.defines.VSM_SAMPLES!==z.blurSamples&&(x.defines.VSM_SAMPLES=z.blurSamples,y.defines.VSM_SAMPLES=z.blurSamples,x.needsUpdate=!0,y.needsUpdate=!0),z.mapPass===null&&(z.mapPass=new ea(l.x,l.y,{format:er,type:Da})),x.uniforms.shadow_pass.value=z.map.depthTexture,x.uniforms.resolution.value=z.mapSize,x.uniforms.radius.value=z.radius,r.setRenderTarget(z.mapPass),r.clear(),r.renderBufferDirect(j,null,w,x,R,null),y.uniforms.shadow_pass.value=z.mapPass.texture,y.uniforms.resolution.value=z.mapSize,y.uniforms.radius.value=z.radius,r.setRenderTarget(z.map),r.clear(),r.renderBufferDirect(j,null,w,y,R,null)}function I(z,j,w,O){let G=null;const V=w.isPointLight===!0?z.customDistanceMaterial:z.customDepthMaterial;if(V!==void 0)G=V;else if(G=w.isPointLight===!0?m:p,r.localClippingEnabled&&j.clipShadows===!0&&Array.isArray(j.clippingPlanes)&&j.clippingPlanes.length!==0||j.displacementMap&&j.displacementScale!==0||j.alphaMap&&j.alphaTest>0||j.map&&j.alphaTest>0||j.alphaToCoverage===!0){const Q=G.uuid,Z=j.uuid;let ae=h[Q];ae===void 0&&(ae={},h[Q]=ae);let W=ae[Z];W===void 0&&(W=G.clone(),ae[Z]=W,j.addEventListener("dispose",q)),G=W}if(G.visible=j.visible,G.wireframe=j.wireframe,O===pl?G.side=j.shadowSide!==null?j.shadowSide:j.side:G.side=j.shadowSide!==null?j.shadowSide:_[j.side],G.alphaMap=j.alphaMap,G.alphaTest=j.alphaToCoverage===!0?.5:j.alphaTest,G.map=j.map,G.clipShadows=j.clipShadows,G.clippingPlanes=j.clippingPlanes,G.clipIntersection=j.clipIntersection,G.displacementMap=j.displacementMap,G.displacementScale=j.displacementScale,G.displacementBias=j.displacementBias,G.wireframeLinewidth=j.wireframeLinewidth,G.linewidth=j.linewidth,w.isPointLight===!0&&G.isMeshDistanceMaterial===!0){const Q=r.properties.get(G);Q.light=w}return G}function F(z,j,w,O,G){if(z.visible===!1)return;if(z.layers.test(j.layers)&&(z.isMesh||z.isLine||z.isPoints)&&(z.castShadow||z.receiveShadow&&G===pl)&&(!z.frustumCulled||s.intersectsObject(z))){z.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,z.matrixWorld);const Z=e.update(z),ae=z.material;if(Array.isArray(ae)){const W=Z.groups;for(let D=0,k=W.length;D<k;D++){const ie=W[D],J=ae[ie.materialIndex];if(J&&J.visible){const H=I(z,J,O,G);z.onBeforeShadow(r,z,j,w,Z,H,ie),r.renderBufferDirect(w,null,Z,H,z,ie),z.onAfterShadow(r,z,j,w,Z,H,ie)}}}else if(ae.visible){const W=I(z,ae,O,G);z.onBeforeShadow(r,z,j,w,Z,W,null),r.renderBufferDirect(w,null,Z,W,z,null),z.onAfterShadow(r,z,j,w,Z,W,null)}}const Q=z.children;for(let Z=0,ae=Q.length;Z<ae;Z++)F(Q[Z],j,w,O,G)}function q(z){z.target.removeEventListener("dispose",q);for(const w in h){const O=h[w],G=z.target.uuid;G in O&&(O[G].dispose(),delete O[G])}}}function n3(r,e){function i(){let se=!1;const Ue=new fn;let Ae=null;const Xe=new fn(0,0,0,0);return{setMask:function(Be){Ae!==Be&&!se&&(r.colorMask(Be,Be,Be,Be),Ae=Be)},setLocked:function(Be){se=Be},setClear:function(Be,De,et,dt,on){on===!0&&(Be*=dt,De*=dt,et*=dt),Ue.set(Be,De,et,dt),Xe.equals(Ue)===!1&&(r.clearColor(Be,De,et,dt),Xe.copy(Ue))},reset:function(){se=!1,Ae=null,Xe.set(-1,0,0,0)}}}function s(){let se=!1,Ue=!1,Ae=null,Xe=null,Be=null;return{setReversed:function(De){if(Ue!==De){const et=e.get("EXT_clip_control");De?et.clipControlEXT(et.LOWER_LEFT_EXT,et.ZERO_TO_ONE_EXT):et.clipControlEXT(et.LOWER_LEFT_EXT,et.NEGATIVE_ONE_TO_ONE_EXT),Ue=De;const dt=Be;Be=null,this.setClear(dt)}},getReversed:function(){return Ue},setTest:function(De){De?ne(r.DEPTH_TEST):L(r.DEPTH_TEST)},setMask:function(De){Ae!==De&&!se&&(r.depthMask(De),Ae=De)},setFunc:function(De){if(Ue&&(De=hS[De]),Xe!==De){switch(De){case Bh:r.depthFunc(r.NEVER);break;case kh:r.depthFunc(r.ALWAYS);break;case Hh:r.depthFunc(r.LESS);break;case io:r.depthFunc(r.LEQUAL);break;case Gh:r.depthFunc(r.EQUAL);break;case Vh:r.depthFunc(r.GEQUAL);break;case jh:r.depthFunc(r.GREATER);break;case Xh:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Xe=De}},setLocked:function(De){se=De},setClear:function(De){Be!==De&&(Be=De,Ue&&(De=1-De),r.clearDepth(De))},reset:function(){se=!1,Ae=null,Xe=null,Be=null,Ue=!1}}}function l(){let se=!1,Ue=null,Ae=null,Xe=null,Be=null,De=null,et=null,dt=null,on=null;return{setTest:function(Ft){se||(Ft?ne(r.STENCIL_TEST):L(r.STENCIL_TEST))},setMask:function(Ft){Ue!==Ft&&!se&&(r.stencilMask(Ft),Ue=Ft)},setFunc:function(Ft,bi,si){(Ae!==Ft||Xe!==bi||Be!==si)&&(r.stencilFunc(Ft,bi,si),Ae=Ft,Xe=bi,Be=si)},setOp:function(Ft,bi,si){(De!==Ft||et!==bi||dt!==si)&&(r.stencilOp(Ft,bi,si),De=Ft,et=bi,dt=si)},setLocked:function(Ft){se=Ft},setClear:function(Ft){on!==Ft&&(r.clearStencil(Ft),on=Ft)},reset:function(){se=!1,Ue=null,Ae=null,Xe=null,Be=null,De=null,et=null,dt=null,on=null}}}const c=new i,f=new s,p=new l,m=new WeakMap,h=new WeakMap;let v={},_={},x={},y=new WeakMap,T=[],R=null,S=!1,b=null,C=null,I=null,F=null,q=null,z=null,j=null,w=new Et(0,0,0),O=0,G=!1,V=null,Q=null,Z=null,ae=null,W=null;const D=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,ie=0;const J=r.getParameter(r.VERSION);J.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(J)[1]),k=ie>=1):J.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),k=ie>=2);let H=null,B={};const Y=r.getParameter(r.SCISSOR_BOX),ee=r.getParameter(r.VIEWPORT),ve=new fn().fromArray(Y),ce=new fn().fromArray(ee);function A(se,Ue,Ae,Xe){const Be=new Uint8Array(4),De=r.createTexture();r.bindTexture(se,De),r.texParameteri(se,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(se,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let et=0;et<Ae;et++)se===r.TEXTURE_3D||se===r.TEXTURE_2D_ARRAY?r.texImage3D(Ue,0,r.RGBA,1,1,Xe,0,r.RGBA,r.UNSIGNED_BYTE,Be):r.texImage2D(Ue+et,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Be);return De}const X={};X[r.TEXTURE_2D]=A(r.TEXTURE_2D,r.TEXTURE_2D,1),X[r.TEXTURE_CUBE_MAP]=A(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[r.TEXTURE_2D_ARRAY]=A(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),X[r.TEXTURE_3D]=A(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),f.setClear(1),p.setClear(0),ne(r.DEPTH_TEST),f.setFunc(io),lt(!1),ze(nv),ne(r.CULL_FACE),at(Ra);function ne(se){v[se]!==!0&&(r.enable(se),v[se]=!0)}function L(se){v[se]!==!1&&(r.disable(se),v[se]=!1)}function Ee(se,Ue){return x[se]!==Ue?(r.bindFramebuffer(se,Ue),x[se]=Ue,se===r.DRAW_FRAMEBUFFER&&(x[r.FRAMEBUFFER]=Ue),se===r.FRAMEBUFFER&&(x[r.DRAW_FRAMEBUFFER]=Ue),!0):!1}function Re(se,Ue){let Ae=T,Xe=!1;if(se){Ae=y.get(Ue),Ae===void 0&&(Ae=[],y.set(Ue,Ae));const Be=se.textures;if(Ae.length!==Be.length||Ae[0]!==r.COLOR_ATTACHMENT0){for(let De=0,et=Be.length;De<et;De++)Ae[De]=r.COLOR_ATTACHMENT0+De;Ae.length=Be.length,Xe=!0}}else Ae[0]!==r.BACK&&(Ae[0]=r.BACK,Xe=!0);Xe&&r.drawBuffers(Ae)}function Ve(se){return R!==se?(r.useProgram(se),R=se,!0):!1}const ke={[Xs]:r.FUNC_ADD,[Pb]:r.FUNC_SUBTRACT,[Ib]:r.FUNC_REVERSE_SUBTRACT};ke[Fb]=r.MIN,ke[Bb]=r.MAX;const Ze={[kb]:r.ZERO,[Hb]:r.ONE,[Gb]:r.SRC_COLOR,[Ih]:r.SRC_ALPHA,[Yb]:r.SRC_ALPHA_SATURATE,[Wb]:r.DST_COLOR,[jb]:r.DST_ALPHA,[Vb]:r.ONE_MINUS_SRC_COLOR,[Fh]:r.ONE_MINUS_SRC_ALPHA,[qb]:r.ONE_MINUS_DST_COLOR,[Xb]:r.ONE_MINUS_DST_ALPHA,[Zb]:r.CONSTANT_COLOR,[Kb]:r.ONE_MINUS_CONSTANT_COLOR,[Qb]:r.CONSTANT_ALPHA,[Jb]:r.ONE_MINUS_CONSTANT_ALPHA};function at(se,Ue,Ae,Xe,Be,De,et,dt,on,Ft){if(se===Ra){S===!0&&(L(r.BLEND),S=!1);return}if(S===!1&&(ne(r.BLEND),S=!0),se!==Ob){if(se!==b||Ft!==G){if((C!==Xs||q!==Xs)&&(r.blendEquation(r.FUNC_ADD),C=Xs,q=Xs),Ft)switch(se){case eo:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case iv:r.blendFunc(r.ONE,r.ONE);break;case av:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case sv:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Ut("WebGLState: Invalid blending: ",se);break}else switch(se){case eo:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case iv:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case av:Ut("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sv:Ut("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ut("WebGLState: Invalid blending: ",se);break}I=null,F=null,z=null,j=null,w.set(0,0,0),O=0,b=se,G=Ft}return}Be=Be||Ue,De=De||Ae,et=et||Xe,(Ue!==C||Be!==q)&&(r.blendEquationSeparate(ke[Ue],ke[Be]),C=Ue,q=Be),(Ae!==I||Xe!==F||De!==z||et!==j)&&(r.blendFuncSeparate(Ze[Ae],Ze[Xe],Ze[De],Ze[et]),I=Ae,F=Xe,z=De,j=et),(dt.equals(w)===!1||on!==O)&&(r.blendColor(dt.r,dt.g,dt.b,on),w.copy(dt),O=on),b=se,G=!1}function qe(se,Ue){se.side===Aa?L(r.CULL_FACE):ne(r.CULL_FACE);let Ae=se.side===ii;Ue&&(Ae=!Ae),lt(Ae),se.blending===eo&&se.transparent===!1?at(Ra):at(se.blending,se.blendEquation,se.blendSrc,se.blendDst,se.blendEquationAlpha,se.blendSrcAlpha,se.blendDstAlpha,se.blendColor,se.blendAlpha,se.premultipliedAlpha),f.setFunc(se.depthFunc),f.setTest(se.depthTest),f.setMask(se.depthWrite),c.setMask(se.colorWrite);const Xe=se.stencilWrite;p.setTest(Xe),Xe&&(p.setMask(se.stencilWriteMask),p.setFunc(se.stencilFunc,se.stencilRef,se.stencilFuncMask),p.setOp(se.stencilFail,se.stencilZFail,se.stencilZPass)),te(se.polygonOffset,se.polygonOffsetFactor,se.polygonOffsetUnits),se.alphaToCoverage===!0?ne(r.SAMPLE_ALPHA_TO_COVERAGE):L(r.SAMPLE_ALPHA_TO_COVERAGE)}function lt(se){V!==se&&(se?r.frontFace(r.CW):r.frontFace(r.CCW),V=se)}function ze(se){se!==Lb?(ne(r.CULL_FACE),se!==Q&&(se===nv?r.cullFace(r.BACK):se===Ub?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):L(r.CULL_FACE),Q=se}function gt(se){se!==Z&&(k&&r.lineWidth(se),Z=se)}function te(se,Ue,Ae){se?(ne(r.POLYGON_OFFSET_FILL),(ae!==Ue||W!==Ae)&&(ae=Ue,W=Ae,f.getReversed()&&(Ue=-Ue),r.polygonOffset(Ue,Ae))):L(r.POLYGON_OFFSET_FILL)}function vt(se){se?ne(r.SCISSOR_TEST):L(r.SCISSOR_TEST)}function nt(se){se===void 0&&(se=r.TEXTURE0+D-1),H!==se&&(r.activeTexture(se),H=se)}function pt(se,Ue,Ae){Ae===void 0&&(H===null?Ae=r.TEXTURE0+D-1:Ae=H);let Xe=B[Ae];Xe===void 0&&(Xe={type:void 0,texture:void 0},B[Ae]=Xe),(Xe.type!==se||Xe.texture!==Ue)&&(H!==Ae&&(r.activeTexture(Ae),H=Ae),r.bindTexture(se,Ue||X[se]),Xe.type=se,Xe.texture=Ue)}function Pe(){const se=B[H];se!==void 0&&se.type!==void 0&&(r.bindTexture(se.type,null),se.type=void 0,se.texture=void 0)}function kt(){try{r.compressedTexImage2D(...arguments)}catch(se){Ut("WebGLState:",se)}}function N(){try{r.compressedTexImage3D(...arguments)}catch(se){Ut("WebGLState:",se)}}function E(){try{r.texSubImage2D(...arguments)}catch(se){Ut("WebGLState:",se)}}function K(){try{r.texSubImage3D(...arguments)}catch(se){Ut("WebGLState:",se)}}function ue(){try{r.compressedTexSubImage2D(...arguments)}catch(se){Ut("WebGLState:",se)}}function he(){try{r.compressedTexSubImage3D(...arguments)}catch(se){Ut("WebGLState:",se)}}function Me(){try{r.texStorage2D(...arguments)}catch(se){Ut("WebGLState:",se)}}function Ne(){try{r.texStorage3D(...arguments)}catch(se){Ut("WebGLState:",se)}}function de(){try{r.texImage2D(...arguments)}catch(se){Ut("WebGLState:",se)}}function be(){try{r.texImage3D(...arguments)}catch(se){Ut("WebGLState:",se)}}function Le(se){return _[se]!==void 0?_[se]:r.getParameter(se)}function He(se,Ue){_[se]!==Ue&&(r.pixelStorei(se,Ue),_[se]=Ue)}function Ie(se){ve.equals(se)===!1&&(r.scissor(se.x,se.y,se.z,se.w),ve.copy(se))}function Fe(se){ce.equals(se)===!1&&(r.viewport(se.x,se.y,se.z,se.w),ce.copy(se))}function mt(se,Ue){let Ae=h.get(Ue);Ae===void 0&&(Ae=new WeakMap,h.set(Ue,Ae));let Xe=Ae.get(se);Xe===void 0&&(Xe=r.getUniformBlockIndex(Ue,se.name),Ae.set(se,Xe))}function it(se,Ue){const Xe=h.get(Ue).get(se);m.get(Ue)!==Xe&&(r.uniformBlockBinding(Ue,Xe,se.__bindingPointIndex),m.set(Ue,Xe))}function xt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),f.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),v={},_={},H=null,B={},x={},y=new WeakMap,T=[],R=null,S=!1,b=null,C=null,I=null,F=null,q=null,z=null,j=null,w=new Et(0,0,0),O=0,G=!1,V=null,Q=null,Z=null,ae=null,W=null,ve.set(0,0,r.canvas.width,r.canvas.height),ce.set(0,0,r.canvas.width,r.canvas.height),c.reset(),f.reset(),p.reset()}return{buffers:{color:c,depth:f,stencil:p},enable:ne,disable:L,bindFramebuffer:Ee,drawBuffers:Re,useProgram:Ve,setBlending:at,setMaterial:qe,setFlipSided:lt,setCullFace:ze,setLineWidth:gt,setPolygonOffset:te,setScissorTest:vt,activeTexture:nt,bindTexture:pt,unbindTexture:Pe,compressedTexImage2D:kt,compressedTexImage3D:N,texImage2D:de,texImage3D:be,pixelStorei:He,getParameter:Le,updateUBOMapping:mt,uniformBlockBinding:it,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:E,texSubImage3D:K,compressedTexSubImage2D:ue,compressedTexSubImage3D:he,scissor:Ie,viewport:Fe,reset:xt}}function i3(r,e,i,s,l,c,f){const p=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ht,v=new WeakMap,_=new Set;let x;const y=new WeakMap;let T=!1;try{T=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function R(N,E){return T?new OffscreenCanvas(N,E):Au("canvas")}function S(N,E,K){let ue=1;const he=kt(N);if((he.width>K||he.height>K)&&(ue=K/Math.max(he.width,he.height)),ue<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const Me=Math.floor(ue*he.width),Ne=Math.floor(ue*he.height);x===void 0&&(x=R(Me,Ne));const de=E?R(Me,Ne):x;return de.width=Me,de.height=Ne,de.getContext("2d").drawImage(N,0,0,Me,Ne),ut("WebGLRenderer: Texture has been resized from ("+he.width+"x"+he.height+") to ("+Me+"x"+Ne+")."),de}else return"data"in N&&ut("WebGLRenderer: Image in DataTexture is too big ("+he.width+"x"+he.height+")."),N;return N}function b(N){return N.generateMipmaps}function C(N){r.generateMipmap(N)}function I(N){return N.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?r.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function F(N,E,K,ue,he,Me=!1){if(N!==null){if(r[N]!==void 0)return r[N];ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let Ne;ue&&(Ne=e.get("EXT_texture_norm16"),Ne||ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let de=E;if(E===r.RED&&(K===r.FLOAT&&(de=r.R32F),K===r.HALF_FLOAT&&(de=r.R16F),K===r.UNSIGNED_BYTE&&(de=r.R8),K===r.UNSIGNED_SHORT&&Ne&&(de=Ne.R16_EXT),K===r.SHORT&&Ne&&(de=Ne.R16_SNORM_EXT)),E===r.RED_INTEGER&&(K===r.UNSIGNED_BYTE&&(de=r.R8UI),K===r.UNSIGNED_SHORT&&(de=r.R16UI),K===r.UNSIGNED_INT&&(de=r.R32UI),K===r.BYTE&&(de=r.R8I),K===r.SHORT&&(de=r.R16I),K===r.INT&&(de=r.R32I)),E===r.RG&&(K===r.FLOAT&&(de=r.RG32F),K===r.HALF_FLOAT&&(de=r.RG16F),K===r.UNSIGNED_BYTE&&(de=r.RG8),K===r.UNSIGNED_SHORT&&Ne&&(de=Ne.RG16_EXT),K===r.SHORT&&Ne&&(de=Ne.RG16_SNORM_EXT)),E===r.RG_INTEGER&&(K===r.UNSIGNED_BYTE&&(de=r.RG8UI),K===r.UNSIGNED_SHORT&&(de=r.RG16UI),K===r.UNSIGNED_INT&&(de=r.RG32UI),K===r.BYTE&&(de=r.RG8I),K===r.SHORT&&(de=r.RG16I),K===r.INT&&(de=r.RG32I)),E===r.RGB_INTEGER&&(K===r.UNSIGNED_BYTE&&(de=r.RGB8UI),K===r.UNSIGNED_SHORT&&(de=r.RGB16UI),K===r.UNSIGNED_INT&&(de=r.RGB32UI),K===r.BYTE&&(de=r.RGB8I),K===r.SHORT&&(de=r.RGB16I),K===r.INT&&(de=r.RGB32I)),E===r.RGBA_INTEGER&&(K===r.UNSIGNED_BYTE&&(de=r.RGBA8UI),K===r.UNSIGNED_SHORT&&(de=r.RGBA16UI),K===r.UNSIGNED_INT&&(de=r.RGBA32UI),K===r.BYTE&&(de=r.RGBA8I),K===r.SHORT&&(de=r.RGBA16I),K===r.INT&&(de=r.RGBA32I)),E===r.RGB&&(K===r.UNSIGNED_SHORT&&Ne&&(de=Ne.RGB16_EXT),K===r.SHORT&&Ne&&(de=Ne.RGB16_SNORM_EXT),K===r.UNSIGNED_INT_5_9_9_9_REV&&(de=r.RGB9_E5),K===r.UNSIGNED_INT_10F_11F_11F_REV&&(de=r.R11F_G11F_B10F)),E===r.RGBA){const be=Me?Tu:Lt.getTransfer(he);K===r.FLOAT&&(de=r.RGBA32F),K===r.HALF_FLOAT&&(de=r.RGBA16F),K===r.UNSIGNED_BYTE&&(de=be===Yt?r.SRGB8_ALPHA8:r.RGBA8),K===r.UNSIGNED_SHORT&&Ne&&(de=Ne.RGBA16_EXT),K===r.SHORT&&Ne&&(de=Ne.RGBA16_SNORM_EXT),K===r.UNSIGNED_SHORT_4_4_4_4&&(de=r.RGBA4),K===r.UNSIGNED_SHORT_5_5_5_1&&(de=r.RGB5_A1)}return(de===r.R16F||de===r.R32F||de===r.RG16F||de===r.RG32F||de===r.RGBA16F||de===r.RGBA32F)&&e.get("EXT_color_buffer_float"),de}function q(N,E){let K;return N?E===null||E===ta||E===Sl?K=r.DEPTH24_STENCIL8:E===Qi?K=r.DEPTH32F_STENCIL8:E===bl&&(K=r.DEPTH24_STENCIL8,ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===ta||E===Sl?K=r.DEPTH_COMPONENT24:E===Qi?K=r.DEPTH_COMPONENT32F:E===bl&&(K=r.DEPTH_COMPONENT16),K}function z(N,E){return b(N)===!0||N.isFramebufferTexture&&N.minFilter!==Fn&&N.minFilter!==jn?Math.log2(Math.max(E.width,E.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?E.mipmaps.length:1}function j(N){const E=N.target;E.removeEventListener("dispose",j),O(E),E.isVideoTexture&&v.delete(E),E.isHTMLTexture&&_.delete(E)}function w(N){const E=N.target;E.removeEventListener("dispose",w),V(E)}function O(N){const E=s.get(N);if(E.__webglInit===void 0)return;const K=N.source,ue=y.get(K);if(ue){const he=ue[E.__cacheKey];he.usedTimes--,he.usedTimes===0&&G(N),Object.keys(ue).length===0&&y.delete(K)}s.remove(N)}function G(N){const E=s.get(N);r.deleteTexture(E.__webglTexture);const K=N.source,ue=y.get(K);delete ue[E.__cacheKey],f.memory.textures--}function V(N){const E=s.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),s.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let ue=0;ue<6;ue++){if(Array.isArray(E.__webglFramebuffer[ue]))for(let he=0;he<E.__webglFramebuffer[ue].length;he++)r.deleteFramebuffer(E.__webglFramebuffer[ue][he]);else r.deleteFramebuffer(E.__webglFramebuffer[ue]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[ue])}else{if(Array.isArray(E.__webglFramebuffer))for(let ue=0;ue<E.__webglFramebuffer.length;ue++)r.deleteFramebuffer(E.__webglFramebuffer[ue]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let ue=0;ue<E.__webglColorRenderbuffer.length;ue++)E.__webglColorRenderbuffer[ue]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[ue]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const K=N.textures;for(let ue=0,he=K.length;ue<he;ue++){const Me=s.get(K[ue]);Me.__webglTexture&&(r.deleteTexture(Me.__webglTexture),f.memory.textures--),s.remove(K[ue])}s.remove(N)}let Q=0;function Z(){Q=0}function ae(){return Q}function W(N){Q=N}function D(){const N=Q;return N>=l.maxTextures&&ut("WebGLTextures: Trying to use "+N+" texture units while this GPU supports only "+l.maxTextures),Q+=1,N}function k(N){const E=[];return E.push(N.wrapS),E.push(N.wrapT),E.push(N.wrapR||0),E.push(N.magFilter),E.push(N.minFilter),E.push(N.anisotropy),E.push(N.internalFormat),E.push(N.format),E.push(N.type),E.push(N.generateMipmaps),E.push(N.premultiplyAlpha),E.push(N.flipY),E.push(N.unpackAlignment),E.push(N.colorSpace),E.join()}function ie(N,E){const K=s.get(N);if(N.isVideoTexture&&pt(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&K.__version!==N.version){const ue=N.image;if(ue===null)ut("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)ut("WebGLRenderer: Texture marked for update but image is incomplete");else{L(K,N,E);return}}else N.isExternalTexture&&(K.__webglTexture=N.sourceTexture?N.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,K.__webglTexture,r.TEXTURE0+E)}function J(N,E){const K=s.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&K.__version!==N.version){L(K,N,E);return}else N.isExternalTexture&&(K.__webglTexture=N.sourceTexture?N.sourceTexture:null);i.bindTexture(r.TEXTURE_2D_ARRAY,K.__webglTexture,r.TEXTURE0+E)}function H(N,E){const K=s.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&K.__version!==N.version){L(K,N,E);return}i.bindTexture(r.TEXTURE_3D,K.__webglTexture,r.TEXTURE0+E)}function B(N,E){const K=s.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&K.__version!==N.version){Ee(K,N,E);return}i.bindTexture(r.TEXTURE_CUBE_MAP,K.__webglTexture,r.TEXTURE0+E)}const Y={[Wh]:r.REPEAT,[wa]:r.CLAMP_TO_EDGE,[qh]:r.MIRRORED_REPEAT},ee={[Fn]:r.NEAREST,[tS]:r.NEAREST_MIPMAP_NEAREST,[Ic]:r.NEAREST_MIPMAP_LINEAR,[jn]:r.LINEAR,[eh]:r.LINEAR_MIPMAP_NEAREST,[qs]:r.LINEAR_MIPMAP_LINEAR},ve={[aS]:r.NEVER,[cS]:r.ALWAYS,[sS]:r.LESS,[jp]:r.LEQUAL,[rS]:r.EQUAL,[Xp]:r.GEQUAL,[oS]:r.GREATER,[lS]:r.NOTEQUAL};function ce(N,E){if(E.type===Qi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===jn||E.magFilter===eh||E.magFilter===Ic||E.magFilter===qs||E.minFilter===jn||E.minFilter===eh||E.minFilter===Ic||E.minFilter===qs)&&ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(N,r.TEXTURE_WRAP_S,Y[E.wrapS]),r.texParameteri(N,r.TEXTURE_WRAP_T,Y[E.wrapT]),(N===r.TEXTURE_3D||N===r.TEXTURE_2D_ARRAY)&&r.texParameteri(N,r.TEXTURE_WRAP_R,Y[E.wrapR]),r.texParameteri(N,r.TEXTURE_MAG_FILTER,ee[E.magFilter]),r.texParameteri(N,r.TEXTURE_MIN_FILTER,ee[E.minFilter]),E.compareFunction&&(r.texParameteri(N,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(N,r.TEXTURE_COMPARE_FUNC,ve[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Fn||E.minFilter!==Ic&&E.minFilter!==qs||E.type===Qi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||s.get(E).__currentAnisotropy){const K=e.get("EXT_texture_filter_anisotropic");r.texParameterf(N,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,l.getMaxAnisotropy())),s.get(E).__currentAnisotropy=E.anisotropy}}}function A(N,E){let K=!1;N.__webglInit===void 0&&(N.__webglInit=!0,E.addEventListener("dispose",j));const ue=E.source;let he=y.get(ue);he===void 0&&(he={},y.set(ue,he));const Me=k(E);if(Me!==N.__cacheKey){he[Me]===void 0&&(he[Me]={texture:r.createTexture(),usedTimes:0},f.memory.textures++,K=!0),he[Me].usedTimes++;const Ne=he[N.__cacheKey];Ne!==void 0&&(he[N.__cacheKey].usedTimes--,Ne.usedTimes===0&&G(E)),N.__cacheKey=Me,N.__webglTexture=he[Me].texture}return K}function X(N,E,K){return Math.floor(Math.floor(N/K)/E)}function ne(N,E,K,ue){const Me=N.updateRanges;if(Me.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,E.width,E.height,K,ue,E.data);else{Me.sort((He,Ie)=>He.start-Ie.start);let Ne=0;for(let He=1;He<Me.length;He++){const Ie=Me[Ne],Fe=Me[He],mt=Ie.start+Ie.count,it=X(Fe.start,E.width,4),xt=X(Ie.start,E.width,4);Fe.start<=mt+1&&it===xt&&X(Fe.start+Fe.count-1,E.width,4)===it?Ie.count=Math.max(Ie.count,Fe.start+Fe.count-Ie.start):(++Ne,Me[Ne]=Fe)}Me.length=Ne+1;const de=i.getParameter(r.UNPACK_ROW_LENGTH),be=i.getParameter(r.UNPACK_SKIP_PIXELS),Le=i.getParameter(r.UNPACK_SKIP_ROWS);i.pixelStorei(r.UNPACK_ROW_LENGTH,E.width);for(let He=0,Ie=Me.length;He<Ie;He++){const Fe=Me[He],mt=Math.floor(Fe.start/4),it=Math.ceil(Fe.count/4),xt=mt%E.width,se=Math.floor(mt/E.width),Ue=it,Ae=1;i.pixelStorei(r.UNPACK_SKIP_PIXELS,xt),i.pixelStorei(r.UNPACK_SKIP_ROWS,se),i.texSubImage2D(r.TEXTURE_2D,0,xt,se,Ue,Ae,K,ue,E.data)}N.clearUpdateRanges(),i.pixelStorei(r.UNPACK_ROW_LENGTH,de),i.pixelStorei(r.UNPACK_SKIP_PIXELS,be),i.pixelStorei(r.UNPACK_SKIP_ROWS,Le)}}function L(N,E,K){let ue=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(ue=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(ue=r.TEXTURE_3D);const he=A(N,E),Me=E.source;i.bindTexture(ue,N.__webglTexture,r.TEXTURE0+K);const Ne=s.get(Me);if(Me.version!==Ne.__version||he===!0){if(i.activeTexture(r.TEXTURE0+K),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const Ae=Lt.getPrimaries(Lt.workingColorSpace),Xe=E.colorSpace===gs?null:Lt.getPrimaries(E.colorSpace),Be=E.colorSpace===gs||Ae===Xe?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be)}i.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment);let be=S(E.image,!1,l.maxTextureSize);be=Pe(E,be);const Le=c.convert(E.format,E.colorSpace),He=c.convert(E.type);let Ie=F(E.internalFormat,Le,He,E.normalized,E.colorSpace,E.isVideoTexture);ce(ue,E);let Fe;const mt=E.mipmaps,it=E.isVideoTexture!==!0,xt=Ne.__version===void 0||he===!0,se=Me.dataReady,Ue=z(E,be);if(E.isDepthTexture)Ie=q(E.format===Ys,E.type),xt&&(it?i.texStorage2D(r.TEXTURE_2D,1,Ie,be.width,be.height):i.texImage2D(r.TEXTURE_2D,0,Ie,be.width,be.height,0,Le,He,null));else if(E.isDataTexture)if(mt.length>0){it&&xt&&i.texStorage2D(r.TEXTURE_2D,Ue,Ie,mt[0].width,mt[0].height);for(let Ae=0,Xe=mt.length;Ae<Xe;Ae++)Fe=mt[Ae],it?se&&i.texSubImage2D(r.TEXTURE_2D,Ae,0,0,Fe.width,Fe.height,Le,He,Fe.data):i.texImage2D(r.TEXTURE_2D,Ae,Ie,Fe.width,Fe.height,0,Le,He,Fe.data);E.generateMipmaps=!1}else it?(xt&&i.texStorage2D(r.TEXTURE_2D,Ue,Ie,be.width,be.height),se&&ne(E,be,Le,He)):i.texImage2D(r.TEXTURE_2D,0,Ie,be.width,be.height,0,Le,He,be.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){it&&xt&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ue,Ie,mt[0].width,mt[0].height,be.depth);for(let Ae=0,Xe=mt.length;Ae<Xe;Ae++)if(Fe=mt[Ae],E.format!==Hi)if(Le!==null)if(it){if(se)if(E.layerUpdates.size>0){const Be=Hv(Fe.width,Fe.height,E.format,E.type);for(const De of E.layerUpdates){const et=Fe.data.subarray(De*Be/Fe.data.BYTES_PER_ELEMENT,(De+1)*Be/Fe.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Ae,0,0,De,Fe.width,Fe.height,1,Le,et)}E.clearLayerUpdates()}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Ae,0,0,0,Fe.width,Fe.height,be.depth,Le,Fe.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Ae,Ie,Fe.width,Fe.height,be.depth,0,Fe.data,0,0);else ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else it?se&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,Ae,0,0,0,Fe.width,Fe.height,be.depth,Le,He,Fe.data):i.texImage3D(r.TEXTURE_2D_ARRAY,Ae,Ie,Fe.width,Fe.height,be.depth,0,Le,He,Fe.data)}else{it&&xt&&i.texStorage2D(r.TEXTURE_2D,Ue,Ie,mt[0].width,mt[0].height);for(let Ae=0,Xe=mt.length;Ae<Xe;Ae++)Fe=mt[Ae],E.format!==Hi?Le!==null?it?se&&i.compressedTexSubImage2D(r.TEXTURE_2D,Ae,0,0,Fe.width,Fe.height,Le,Fe.data):i.compressedTexImage2D(r.TEXTURE_2D,Ae,Ie,Fe.width,Fe.height,0,Fe.data):ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?se&&i.texSubImage2D(r.TEXTURE_2D,Ae,0,0,Fe.width,Fe.height,Le,He,Fe.data):i.texImage2D(r.TEXTURE_2D,Ae,Ie,Fe.width,Fe.height,0,Le,He,Fe.data)}else if(E.isDataArrayTexture)if(it){if(xt&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ue,Ie,be.width,be.height,be.depth),se)if(E.layerUpdates.size>0){const Ae=Hv(be.width,be.height,E.format,E.type);for(const Xe of E.layerUpdates){const Be=be.data.subarray(Xe*Ae/be.data.BYTES_PER_ELEMENT,(Xe+1)*Ae/be.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Xe,be.width,be.height,1,Le,He,Be)}E.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,be.width,be.height,be.depth,Le,He,be.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,Ie,be.width,be.height,be.depth,0,Le,He,be.data);else if(E.isData3DTexture)it?(xt&&i.texStorage3D(r.TEXTURE_3D,Ue,Ie,be.width,be.height,be.depth),se&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,be.width,be.height,be.depth,Le,He,be.data)):i.texImage3D(r.TEXTURE_3D,0,Ie,be.width,be.height,be.depth,0,Le,He,be.data);else if(E.isFramebufferTexture){if(xt)if(it)i.texStorage2D(r.TEXTURE_2D,Ue,Ie,be.width,be.height);else{let Ae=be.width,Xe=be.height;for(let Be=0;Be<Ue;Be++)i.texImage2D(r.TEXTURE_2D,Be,Ie,Ae,Xe,0,Le,He,null),Ae>>=1,Xe>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in r){const Ae=r.canvas;if(Ae.hasAttribute("layoutsubtree")||Ae.setAttribute("layoutsubtree","true"),be.parentNode!==Ae){Ae.appendChild(be),_.add(E),Ae.onpaint=dt=>{const on=dt.changedElements;for(const Ft of _)on.includes(Ft.image)&&(Ft.needsUpdate=!0)},Ae.requestPaint();return}const Xe=0,Be=r.RGBA,De=r.RGBA,et=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,Xe,Be,De,et,be),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(mt.length>0){if(it&&xt){const Ae=kt(mt[0]);i.texStorage2D(r.TEXTURE_2D,Ue,Ie,Ae.width,Ae.height)}for(let Ae=0,Xe=mt.length;Ae<Xe;Ae++)Fe=mt[Ae],it?se&&i.texSubImage2D(r.TEXTURE_2D,Ae,0,0,Le,He,Fe):i.texImage2D(r.TEXTURE_2D,Ae,Ie,Le,He,Fe);E.generateMipmaps=!1}else if(it){if(xt){const Ae=kt(be);i.texStorage2D(r.TEXTURE_2D,Ue,Ie,Ae.width,Ae.height)}se&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Le,He,be)}else i.texImage2D(r.TEXTURE_2D,0,Ie,Le,He,be);b(E)&&C(ue),Ne.__version=Me.version,E.onUpdate&&E.onUpdate(E)}N.__version=E.version}function Ee(N,E,K){if(E.image.length!==6)return;const ue=A(N,E),he=E.source;i.bindTexture(r.TEXTURE_CUBE_MAP,N.__webglTexture,r.TEXTURE0+K);const Me=s.get(he);if(he.version!==Me.__version||ue===!0){i.activeTexture(r.TEXTURE0+K);const Ne=Lt.getPrimaries(Lt.workingColorSpace),de=E.colorSpace===gs?null:Lt.getPrimaries(E.colorSpace),be=E.colorSpace===gs||Ne===de?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Le=E.isCompressedTexture||E.image[0].isCompressedTexture,He=E.image[0]&&E.image[0].isDataTexture,Ie=[];for(let De=0;De<6;De++)!Le&&!He?Ie[De]=S(E.image[De],!0,l.maxCubemapSize):Ie[De]=He?E.image[De].image:E.image[De],Ie[De]=Pe(E,Ie[De]);const Fe=Ie[0],mt=c.convert(E.format,E.colorSpace),it=c.convert(E.type),xt=F(E.internalFormat,mt,it,E.normalized,E.colorSpace),se=E.isVideoTexture!==!0,Ue=Me.__version===void 0||ue===!0,Ae=he.dataReady;let Xe=z(E,Fe);ce(r.TEXTURE_CUBE_MAP,E);let Be;if(Le){se&&Ue&&i.texStorage2D(r.TEXTURE_CUBE_MAP,Xe,xt,Fe.width,Fe.height);for(let De=0;De<6;De++){Be=Ie[De].mipmaps;for(let et=0;et<Be.length;et++){const dt=Be[et];E.format!==Hi?mt!==null?se?Ae&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et,0,0,dt.width,dt.height,mt,dt.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et,xt,dt.width,dt.height,0,dt.data):ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):se?Ae&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et,0,0,dt.width,dt.height,mt,it,dt.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et,xt,dt.width,dt.height,0,mt,it,dt.data)}}}else{if(Be=E.mipmaps,se&&Ue){Be.length>0&&Xe++;const De=kt(Ie[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,Xe,xt,De.width,De.height)}for(let De=0;De<6;De++)if(He){se?Ae&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,0,0,Ie[De].width,Ie[De].height,mt,it,Ie[De].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,xt,Ie[De].width,Ie[De].height,0,mt,it,Ie[De].data);for(let et=0;et<Be.length;et++){const on=Be[et].image[De].image;se?Ae&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et+1,0,0,on.width,on.height,mt,it,on.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et+1,xt,on.width,on.height,0,mt,it,on.data)}}else{se?Ae&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,0,0,mt,it,Ie[De]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,xt,mt,it,Ie[De]);for(let et=0;et<Be.length;et++){const dt=Be[et];se?Ae&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et+1,0,0,mt,it,dt.image[De]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+De,et+1,xt,mt,it,dt.image[De])}}}b(E)&&C(r.TEXTURE_CUBE_MAP),Me.__version=he.version,E.onUpdate&&E.onUpdate(E)}N.__version=E.version}function Re(N,E,K,ue,he,Me){const Ne=c.convert(K.format,K.colorSpace),de=c.convert(K.type),be=F(K.internalFormat,Ne,de,K.normalized,K.colorSpace),Le=s.get(E),He=s.get(K);if(He.__renderTarget=E,!Le.__hasExternalTextures){const Ie=Math.max(1,E.width>>Me),Fe=Math.max(1,E.height>>Me);he===r.TEXTURE_3D||he===r.TEXTURE_2D_ARRAY?i.texImage3D(he,Me,be,Ie,Fe,E.depth,0,Ne,de,null):i.texImage2D(he,Me,be,Ie,Fe,0,Ne,de,null)}i.bindFramebuffer(r.FRAMEBUFFER,N),nt(E)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ue,he,He.__webglTexture,0,vt(E)):(he===r.TEXTURE_2D||he>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&he<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ue,he,He.__webglTexture,Me),i.bindFramebuffer(r.FRAMEBUFFER,null)}function Ve(N,E,K){if(r.bindRenderbuffer(r.RENDERBUFFER,N),E.depthBuffer){const ue=E.depthTexture,he=ue&&ue.isDepthTexture?ue.type:null,Me=q(E.stencilBuffer,he),Ne=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;nt(E)?p.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,vt(E),Me,E.width,E.height):K?r.renderbufferStorageMultisample(r.RENDERBUFFER,vt(E),Me,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,Me,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ne,r.RENDERBUFFER,N)}else{const ue=E.textures;for(let he=0;he<ue.length;he++){const Me=ue[he],Ne=c.convert(Me.format,Me.colorSpace),de=c.convert(Me.type),be=F(Me.internalFormat,Ne,de,Me.normalized,Me.colorSpace);nt(E)?p.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,vt(E),be,E.width,E.height):K?r.renderbufferStorageMultisample(r.RENDERBUFFER,vt(E),be,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,be,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function ke(N,E,K){const ue=E.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(r.FRAMEBUFFER,N),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const he=s.get(E.depthTexture);if(he.__renderTarget=E,(!he.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),ue){if(he.__webglInit===void 0&&(he.__webglInit=!0,E.depthTexture.addEventListener("dispose",j)),he.__webglTexture===void 0){he.__webglTexture=r.createTexture(),i.bindTexture(r.TEXTURE_CUBE_MAP,he.__webglTexture),ce(r.TEXTURE_CUBE_MAP,E.depthTexture);const Le=c.convert(E.depthTexture.format),He=c.convert(E.depthTexture.type);let Ie;E.depthTexture.format===za?Ie=r.DEPTH_COMPONENT24:E.depthTexture.format===Ys&&(Ie=r.DEPTH24_STENCIL8);for(let Fe=0;Fe<6;Fe++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Fe,0,Ie,E.width,E.height,0,Le,He,null)}}else ie(E.depthTexture,0);const Me=he.__webglTexture,Ne=vt(E),de=ue?r.TEXTURE_CUBE_MAP_POSITIVE_X+K:r.TEXTURE_2D,be=E.depthTexture.format===Ys?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(E.depthTexture.format===za)nt(E)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,be,de,Me,0,Ne):r.framebufferTexture2D(r.FRAMEBUFFER,be,de,Me,0);else if(E.depthTexture.format===Ys)nt(E)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,be,de,Me,0,Ne):r.framebufferTexture2D(r.FRAMEBUFFER,be,de,Me,0);else throw new Error("Unknown depthTexture format")}function Ze(N){const E=s.get(N),K=N.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==N.depthTexture){const ue=N.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),ue){const he=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,ue.removeEventListener("dispose",he)};ue.addEventListener("dispose",he),E.__depthDisposeCallback=he}E.__boundDepthTexture=ue}if(N.depthTexture&&!E.__autoAllocateDepthBuffer)if(K)for(let ue=0;ue<6;ue++)ke(E.__webglFramebuffer[ue],N,ue);else{const ue=N.texture.mipmaps;ue&&ue.length>0?ke(E.__webglFramebuffer[0],N,0):ke(E.__webglFramebuffer,N,0)}else if(K){E.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[ue]),E.__webglDepthbuffer[ue]===void 0)E.__webglDepthbuffer[ue]=r.createRenderbuffer(),Ve(E.__webglDepthbuffer[ue],N,!1);else{const he=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Me=E.__webglDepthbuffer[ue];r.bindRenderbuffer(r.RENDERBUFFER,Me),r.framebufferRenderbuffer(r.FRAMEBUFFER,he,r.RENDERBUFFER,Me)}}else{const ue=N.texture.mipmaps;if(ue&&ue.length>0?i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=r.createRenderbuffer(),Ve(E.__webglDepthbuffer,N,!1);else{const he=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Me=E.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,Me),r.framebufferRenderbuffer(r.FRAMEBUFFER,he,r.RENDERBUFFER,Me)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function at(N,E,K){const ue=s.get(N);E!==void 0&&Re(ue.__webglFramebuffer,N,N.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),K!==void 0&&Ze(N)}function qe(N){const E=N.texture,K=s.get(N),ue=s.get(E);N.addEventListener("dispose",w);const he=N.textures,Me=N.isWebGLCubeRenderTarget===!0,Ne=he.length>1;if(Ne||(ue.__webglTexture===void 0&&(ue.__webglTexture=r.createTexture()),ue.__version=E.version,f.memory.textures++),Me){K.__webglFramebuffer=[];for(let de=0;de<6;de++)if(E.mipmaps&&E.mipmaps.length>0){K.__webglFramebuffer[de]=[];for(let be=0;be<E.mipmaps.length;be++)K.__webglFramebuffer[de][be]=r.createFramebuffer()}else K.__webglFramebuffer[de]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){K.__webglFramebuffer=[];for(let de=0;de<E.mipmaps.length;de++)K.__webglFramebuffer[de]=r.createFramebuffer()}else K.__webglFramebuffer=r.createFramebuffer();if(Ne)for(let de=0,be=he.length;de<be;de++){const Le=s.get(he[de]);Le.__webglTexture===void 0&&(Le.__webglTexture=r.createTexture(),f.memory.textures++)}if(N.samples>0&&nt(N)===!1){K.__webglMultisampledFramebuffer=r.createFramebuffer(),K.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let de=0;de<he.length;de++){const be=he[de];K.__webglColorRenderbuffer[de]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,K.__webglColorRenderbuffer[de]);const Le=c.convert(be.format,be.colorSpace),He=c.convert(be.type),Ie=F(be.internalFormat,Le,He,be.normalized,be.colorSpace,N.isXRRenderTarget===!0),Fe=vt(N);r.renderbufferStorageMultisample(r.RENDERBUFFER,Fe,Ie,N.width,N.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.RENDERBUFFER,K.__webglColorRenderbuffer[de])}r.bindRenderbuffer(r.RENDERBUFFER,null),N.depthBuffer&&(K.__webglDepthRenderbuffer=r.createRenderbuffer(),Ve(K.__webglDepthRenderbuffer,N,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Me){i.bindTexture(r.TEXTURE_CUBE_MAP,ue.__webglTexture),ce(r.TEXTURE_CUBE_MAP,E);for(let de=0;de<6;de++)if(E.mipmaps&&E.mipmaps.length>0)for(let be=0;be<E.mipmaps.length;be++)Re(K.__webglFramebuffer[de][be],N,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+de,be);else Re(K.__webglFramebuffer[de],N,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);b(E)&&C(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Ne){for(let de=0,be=he.length;de<be;de++){const Le=he[de],He=s.get(Le);let Ie=r.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(Ie=N.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Ie,He.__webglTexture),ce(Ie,Le),Re(K.__webglFramebuffer,N,Le,r.COLOR_ATTACHMENT0+de,Ie,0),b(Le)&&C(Ie)}i.unbindTexture()}else{let de=r.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(de=N.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(de,ue.__webglTexture),ce(de,E),E.mipmaps&&E.mipmaps.length>0)for(let be=0;be<E.mipmaps.length;be++)Re(K.__webglFramebuffer[be],N,E,r.COLOR_ATTACHMENT0,de,be);else Re(K.__webglFramebuffer,N,E,r.COLOR_ATTACHMENT0,de,0);b(E)&&C(de),i.unbindTexture()}N.depthBuffer&&Ze(N)}function lt(N){const E=N.textures;for(let K=0,ue=E.length;K<ue;K++){const he=E[K];if(b(he)){const Me=I(N),Ne=s.get(he).__webglTexture;i.bindTexture(Me,Ne),C(Me),i.unbindTexture()}}}const ze=[],gt=[];function te(N){if(N.samples>0){if(nt(N)===!1){const E=N.textures,K=N.width,ue=N.height;let he=r.COLOR_BUFFER_BIT;const Me=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ne=s.get(N),de=E.length>1;if(de)for(let Le=0;Le<E.length;Le++)i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Le,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Le,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);const be=N.texture.mipmaps;be&&be.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let Le=0;Le<E.length;Le++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(he|=r.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(he|=r.STENCIL_BUFFER_BIT)),de){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ne.__webglColorRenderbuffer[Le]);const He=s.get(E[Le]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,He,0)}r.blitFramebuffer(0,0,K,ue,0,0,K,ue,he,r.NEAREST),m===!0&&(ze.length=0,gt.length=0,ze.push(r.COLOR_ATTACHMENT0+Le),N.depthBuffer&&N.resolveDepthBuffer===!1&&(ze.push(Me),gt.push(Me),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,gt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ze))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),de)for(let Le=0;Le<E.length;Le++){i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Le,r.RENDERBUFFER,Ne.__webglColorRenderbuffer[Le]);const He=s.get(E[Le]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Le,r.TEXTURE_2D,He,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.resolveDepthBuffer===!1&&m){const E=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function vt(N){return Math.min(l.maxSamples,N.samples)}function nt(N){const E=s.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function pt(N){const E=f.render.frame;v.get(N)!==E&&(v.set(N,E),N.update())}function Pe(N,E){const K=N.colorSpace,ue=N.format,he=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||K!==Eu&&K!==gs&&(Lt.getTransfer(K)===Yt?(ue!==Hi||he!==_i)&&ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ut("WebGLTextures: Unsupported texture color space:",K)),E}function kt(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(h.width=N.naturalWidth||N.width,h.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(h.width=N.displayWidth,h.height=N.displayHeight):(h.width=N.width,h.height=N.height),h}this.allocateTextureUnit=D,this.resetTextureUnits=Z,this.getTextureUnits=ae,this.setTextureUnits=W,this.setTexture2D=ie,this.setTexture2DArray=J,this.setTexture3D=H,this.setTextureCube=B,this.rebindTextures=at,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=nt,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function a3(r,e){function i(s,l=gs){let c;const f=Lt.getTransfer(l);if(s===_i)return r.UNSIGNED_BYTE;if(s===Bp)return r.UNSIGNED_SHORT_4_4_4_4;if(s===kp)return r.UNSIGNED_SHORT_5_5_5_1;if(s===H_)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===G_)return r.UNSIGNED_INT_10F_11F_11F_REV;if(s===B_)return r.BYTE;if(s===k_)return r.SHORT;if(s===bl)return r.UNSIGNED_SHORT;if(s===Fp)return r.INT;if(s===ta)return r.UNSIGNED_INT;if(s===Qi)return r.FLOAT;if(s===Da)return r.HALF_FLOAT;if(s===V_)return r.ALPHA;if(s===j_)return r.RGB;if(s===Hi)return r.RGBA;if(s===za)return r.DEPTH_COMPONENT;if(s===Ys)return r.DEPTH_STENCIL;if(s===X_)return r.RED;if(s===Hp)return r.RED_INTEGER;if(s===er)return r.RG;if(s===Gp)return r.RG_INTEGER;if(s===Vp)return r.RGBA_INTEGER;if(s===gu||s===xu||s===vu||s===_u)if(f===Yt)if(c=e.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===gu)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===xu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===vu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===_u)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=e.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===gu)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===xu)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===vu)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===_u)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Yh||s===Zh||s===Kh||s===Qh)if(c=e.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===Yh)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Zh)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Kh)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Qh)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Jh||s===$h||s===ep||s===tp||s===np||s===Su||s===ip)if(c=e.get("WEBGL_compressed_texture_etc"),c!==null){if(s===Jh||s===$h)return f===Yt?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===ep)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC;if(s===tp)return c.COMPRESSED_R11_EAC;if(s===np)return c.COMPRESSED_SIGNED_R11_EAC;if(s===Su)return c.COMPRESSED_RG11_EAC;if(s===ip)return c.COMPRESSED_SIGNED_RG11_EAC}else return null;if(s===ap||s===sp||s===rp||s===op||s===lp||s===cp||s===up||s===fp||s===dp||s===hp||s===pp||s===mp||s===gp||s===xp)if(c=e.get("WEBGL_compressed_texture_astc"),c!==null){if(s===ap)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===sp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===rp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===op)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===lp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===cp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===up)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===fp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===dp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===hp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===pp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===mp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===gp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===xp)return f===Yt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===vp||s===_p||s===yp)if(c=e.get("EXT_texture_compression_bptc"),c!==null){if(s===vp)return f===Yt?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===_p)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===yp)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===bp||s===Sp||s===Mu||s===Mp)if(c=e.get("EXT_texture_compression_rgtc"),c!==null){if(s===bp)return c.COMPRESSED_RED_RGTC1_EXT;if(s===Sp)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Mu)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Mp)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Sl?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}const s3=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,r3=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class o3{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i){if(this.texture===null){const s=new J_(e.texture);(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,s=new na({vertexShader:s3,fragmentShader:r3,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new mn(new ro(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class l3 extends bs{constructor(e,i){super();const s=this;let l=null,c=1,f=null,p="local-floor",m=1,h=null,v=null,_=null,x=null,y=null,T=null;const R=typeof XRWebGLBinding<"u",S=new o3,b={},C=i.getContextAttributes();let I=null,F=null;const q=[],z=[],j=new ht;let w=null;const O=new vi;O.viewport=new fn;const G=new vi;G.viewport=new fn;const V=[O,G],Q=new hM;let Z=null,ae=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(A){let X=q[A];return X===void 0&&(X=new rh,q[A]=X),X.getTargetRaySpace()},this.getControllerGrip=function(A){let X=q[A];return X===void 0&&(X=new rh,q[A]=X),X.getGripSpace()},this.getHand=function(A){let X=q[A];return X===void 0&&(X=new rh,q[A]=X),X.getHandSpace()};function W(A){const X=z.indexOf(A.inputSource);if(X===-1)return;const ne=q[X];ne!==void 0&&(ne.update(A.inputSource,A.frame,h||f),ne.dispatchEvent({type:A.type,data:A.inputSource}))}function D(){l.removeEventListener("select",W),l.removeEventListener("selectstart",W),l.removeEventListener("selectend",W),l.removeEventListener("squeeze",W),l.removeEventListener("squeezestart",W),l.removeEventListener("squeezeend",W),l.removeEventListener("end",D),l.removeEventListener("inputsourceschange",k);for(let A=0;A<q.length;A++){const X=z[A];X!==null&&(z[A]=null,q[A].disconnect(X))}Z=null,ae=null,S.reset();for(const A in b)delete b[A];e.setRenderTarget(I),y=null,x=null,_=null,l=null,F=null,ce.stop(),s.isPresenting=!1,e.setPixelRatio(w),e.setSize(j.width,j.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(A){c=A,s.isPresenting===!0&&ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(A){p=A,s.isPresenting===!0&&ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||f},this.setReferenceSpace=function(A){h=A},this.getBaseLayer=function(){return x!==null?x:y},this.getBinding=function(){return _===null&&R&&(_=new XRWebGLBinding(l,i)),_},this.getFrame=function(){return T},this.getSession=function(){return l},this.setSession=async function(A){if(l=A,l!==null){if(I=e.getRenderTarget(),l.addEventListener("select",W),l.addEventListener("selectstart",W),l.addEventListener("selectend",W),l.addEventListener("squeeze",W),l.addEventListener("squeezestart",W),l.addEventListener("squeezeend",W),l.addEventListener("end",D),l.addEventListener("inputsourceschange",k),C.xrCompatible!==!0&&await i.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(j),R&&"createProjectionLayer"in XRWebGLBinding.prototype){let ne=null,L=null,Ee=null;C.depth&&(Ee=C.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,ne=C.stencil?Ys:za,L=C.stencil?Sl:ta);const Re={colorFormat:i.RGBA8,depthFormat:Ee,scaleFactor:c};_=this.getBinding(),x=_.createProjectionLayer(Re),l.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),F=new ea(x.textureWidth,x.textureHeight,{format:Hi,type:_i,depthTexture:new so(x.textureWidth,x.textureHeight,L,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:C.stencil,colorSpace:e.outputColorSpace,samples:C.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}else{const ne={antialias:C.antialias,alpha:!0,depth:C.depth,stencil:C.stencil,framebufferScaleFactor:c};y=new XRWebGLLayer(l,i,ne),l.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),F=new ea(y.framebufferWidth,y.framebufferHeight,{format:Hi,type:_i,colorSpace:e.outputColorSpace,stencilBuffer:C.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1})}F.isXRRenderTarget=!0,this.setFoveation(m),h=null,f=await l.requestReferenceSpace(p),ce.setContext(l),ce.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function k(A){for(let X=0;X<A.removed.length;X++){const ne=A.removed[X],L=z.indexOf(ne);L>=0&&(z[L]=null,q[L].disconnect(ne))}for(let X=0;X<A.added.length;X++){const ne=A.added[X];let L=z.indexOf(ne);if(L===-1){for(let Re=0;Re<q.length;Re++)if(Re>=z.length){z.push(ne),L=Re;break}else if(z[Re]===null){z[Re]=ne,L=Re;break}if(L===-1)break}const Ee=q[L];Ee&&Ee.connect(ne)}}const ie=new le,J=new le;function H(A,X,ne){ie.setFromMatrixPosition(X.matrixWorld),J.setFromMatrixPosition(ne.matrixWorld);const L=ie.distanceTo(J),Ee=X.projectionMatrix.elements,Re=ne.projectionMatrix.elements,Ve=Ee[14]/(Ee[10]-1),ke=Ee[14]/(Ee[10]+1),Ze=(Ee[9]+1)/Ee[5],at=(Ee[9]-1)/Ee[5],qe=(Ee[8]-1)/Ee[0],lt=(Re[8]+1)/Re[0],ze=Ve*qe,gt=Ve*lt,te=L/(-qe+lt),vt=te*-qe;if(X.matrixWorld.decompose(A.position,A.quaternion,A.scale),A.translateX(vt),A.translateZ(te),A.matrixWorld.compose(A.position,A.quaternion,A.scale),A.matrixWorldInverse.copy(A.matrixWorld).invert(),Ee[10]===-1)A.projectionMatrix.copy(X.projectionMatrix),A.projectionMatrixInverse.copy(X.projectionMatrixInverse);else{const nt=Ve+te,pt=ke+te,Pe=ze-vt,kt=gt+(L-vt),N=Ze*ke/pt*nt,E=at*ke/pt*nt;A.projectionMatrix.makePerspective(Pe,kt,N,E,nt,pt),A.projectionMatrixInverse.copy(A.projectionMatrix).invert()}}function B(A,X){X===null?A.matrixWorld.copy(A.matrix):A.matrixWorld.multiplyMatrices(X.matrixWorld,A.matrix),A.matrixWorldInverse.copy(A.matrixWorld).invert()}this.updateCamera=function(A){if(l===null)return;let X=A.near,ne=A.far;S.texture!==null&&(S.depthNear>0&&(X=S.depthNear),S.depthFar>0&&(ne=S.depthFar)),Q.near=G.near=O.near=X,Q.far=G.far=O.far=ne,(Z!==Q.near||ae!==Q.far)&&(l.updateRenderState({depthNear:Q.near,depthFar:Q.far}),Z=Q.near,ae=Q.far),Q.layers.mask=A.layers.mask|6,O.layers.mask=Q.layers.mask&-5,G.layers.mask=Q.layers.mask&-3;const L=A.parent,Ee=Q.cameras;B(Q,L);for(let Re=0;Re<Ee.length;Re++)B(Ee[Re],L);Ee.length===2?H(Q,O,G):Q.projectionMatrix.copy(O.projectionMatrix),Y(A,Q,L)};function Y(A,X,ne){ne===null?A.matrix.copy(X.matrixWorld):(A.matrix.copy(ne.matrixWorld),A.matrix.invert(),A.matrix.multiply(X.matrixWorld)),A.matrix.decompose(A.position,A.quaternion,A.scale),A.updateMatrixWorld(!0),A.projectionMatrix.copy(X.projectionMatrix),A.projectionMatrixInverse.copy(X.projectionMatrixInverse),A.isPerspectiveCamera&&(A.fov=El*2*Math.atan(1/A.projectionMatrix.elements[5]),A.zoom=1)}this.getCamera=function(){return Q},this.getFoveation=function(){if(!(x===null&&y===null))return m},this.setFoveation=function(A){m=A,x!==null&&(x.fixedFoveation=A),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=A)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(Q)},this.getCameraTexture=function(A){return b[A]};let ee=null;function ve(A,X){if(v=X.getViewerPose(h||f),T=X,v!==null){const ne=v.views;y!==null&&(e.setRenderTargetFramebuffer(F,y.framebuffer),e.setRenderTarget(F));let L=!1;ne.length!==Q.cameras.length&&(Q.cameras.length=0,L=!0);for(let ke=0;ke<ne.length;ke++){const Ze=ne[ke];let at=null;if(y!==null)at=y.getViewport(Ze);else{const lt=_.getViewSubImage(x,Ze);at=lt.viewport,ke===0&&(e.setRenderTargetTextures(F,lt.colorTexture,lt.depthStencilTexture),e.setRenderTarget(F))}let qe=V[ke];qe===void 0&&(qe=new vi,qe.layers.enable(ke),qe.viewport=new fn,V[ke]=qe),qe.matrix.fromArray(Ze.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(Ze.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(at.x,at.y,at.width,at.height),ke===0&&(Q.matrix.copy(qe.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale)),L===!0&&Q.cameras.push(qe)}const Ee=l.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&R){_=s.getBinding();const ke=_.getDepthInformation(ne[0]);ke&&ke.isValid&&ke.texture&&S.init(ke,l.renderState)}if(Ee&&Ee.includes("camera-access")&&R){e.state.unbindTexture(),_=s.getBinding();for(let ke=0;ke<ne.length;ke++){const Ze=ne[ke].camera;if(Ze){let at=b[Ze];at||(at=new J_,b[Ze]=at);const qe=_.getCameraImage(Ze);at.sourceTexture=qe}}}}for(let ne=0;ne<q.length;ne++){const L=z[ne],Ee=q[ne];L!==null&&Ee!==void 0&&Ee.update(L,X,h||f)}ee&&ee(A,X),X.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:X}),T=null}const ce=new ny;ce.setAnimationLoop(ve),this.setAnimationLoop=function(A){ee=A},this.dispose=function(){}}}const c3=new ln,cy=new yt;cy.set(-1,0,0,0,1,0,0,0,1);function u3(r,e){function i(S,b){S.matrixAutoUpdate===!0&&S.updateMatrix(),b.value.copy(S.matrix)}function s(S,b){b.color.getRGB(S.fogColor.value,$_(r)),b.isFog?(S.fogNear.value=b.near,S.fogFar.value=b.far):b.isFogExp2&&(S.fogDensity.value=b.density)}function l(S,b,C,I,F){b.isNodeMaterial?b.uniformsNeedUpdate=!1:b.isMeshBasicMaterial?c(S,b):b.isMeshLambertMaterial?(c(S,b),b.envMap&&(S.envMapIntensity.value=b.envMapIntensity)):b.isMeshToonMaterial?(c(S,b),_(S,b)):b.isMeshPhongMaterial?(c(S,b),v(S,b),b.envMap&&(S.envMapIntensity.value=b.envMapIntensity)):b.isMeshStandardMaterial?(c(S,b),x(S,b),b.isMeshPhysicalMaterial&&y(S,b,F)):b.isMeshMatcapMaterial?(c(S,b),T(S,b)):b.isMeshDepthMaterial?c(S,b):b.isMeshDistanceMaterial?(c(S,b),R(S,b)):b.isMeshNormalMaterial?c(S,b):b.isLineBasicMaterial?(f(S,b),b.isLineDashedMaterial&&p(S,b)):b.isPointsMaterial?m(S,b,C,I):b.isSpriteMaterial?h(S,b):b.isShadowMaterial?(S.color.value.copy(b.color),S.opacity.value=b.opacity):b.isShaderMaterial&&(b.uniformsNeedUpdate=!1)}function c(S,b){S.opacity.value=b.opacity,b.color&&S.diffuse.value.copy(b.color),b.emissive&&S.emissive.value.copy(b.emissive).multiplyScalar(b.emissiveIntensity),b.map&&(S.map.value=b.map,i(b.map,S.mapTransform)),b.alphaMap&&(S.alphaMap.value=b.alphaMap,i(b.alphaMap,S.alphaMapTransform)),b.bumpMap&&(S.bumpMap.value=b.bumpMap,i(b.bumpMap,S.bumpMapTransform),S.bumpScale.value=b.bumpScale,b.side===ii&&(S.bumpScale.value*=-1)),b.normalMap&&(S.normalMap.value=b.normalMap,i(b.normalMap,S.normalMapTransform),S.normalScale.value.copy(b.normalScale),b.side===ii&&S.normalScale.value.negate()),b.displacementMap&&(S.displacementMap.value=b.displacementMap,i(b.displacementMap,S.displacementMapTransform),S.displacementScale.value=b.displacementScale,S.displacementBias.value=b.displacementBias),b.emissiveMap&&(S.emissiveMap.value=b.emissiveMap,i(b.emissiveMap,S.emissiveMapTransform)),b.specularMap&&(S.specularMap.value=b.specularMap,i(b.specularMap,S.specularMapTransform)),b.alphaTest>0&&(S.alphaTest.value=b.alphaTest);const C=e.get(b),I=C.envMap,F=C.envMapRotation;I&&(S.envMap.value=I,S.envMapRotation.value.setFromMatrix4(c3.makeRotationFromEuler(F)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&S.envMapRotation.value.premultiply(cy),S.reflectivity.value=b.reflectivity,S.ior.value=b.ior,S.refractionRatio.value=b.refractionRatio),b.lightMap&&(S.lightMap.value=b.lightMap,S.lightMapIntensity.value=b.lightMapIntensity,i(b.lightMap,S.lightMapTransform)),b.aoMap&&(S.aoMap.value=b.aoMap,S.aoMapIntensity.value=b.aoMapIntensity,i(b.aoMap,S.aoMapTransform))}function f(S,b){S.diffuse.value.copy(b.color),S.opacity.value=b.opacity,b.map&&(S.map.value=b.map,i(b.map,S.mapTransform))}function p(S,b){S.dashSize.value=b.dashSize,S.totalSize.value=b.dashSize+b.gapSize,S.scale.value=b.scale}function m(S,b,C,I){S.diffuse.value.copy(b.color),S.opacity.value=b.opacity,S.size.value=b.size*C,S.scale.value=I*.5,b.map&&(S.map.value=b.map,i(b.map,S.uvTransform)),b.alphaMap&&(S.alphaMap.value=b.alphaMap,i(b.alphaMap,S.alphaMapTransform)),b.alphaTest>0&&(S.alphaTest.value=b.alphaTest)}function h(S,b){S.diffuse.value.copy(b.color),S.opacity.value=b.opacity,S.rotation.value=b.rotation,b.map&&(S.map.value=b.map,i(b.map,S.mapTransform)),b.alphaMap&&(S.alphaMap.value=b.alphaMap,i(b.alphaMap,S.alphaMapTransform)),b.alphaTest>0&&(S.alphaTest.value=b.alphaTest)}function v(S,b){S.specular.value.copy(b.specular),S.shininess.value=Math.max(b.shininess,1e-4)}function _(S,b){b.gradientMap&&(S.gradientMap.value=b.gradientMap)}function x(S,b){S.metalness.value=b.metalness,b.metalnessMap&&(S.metalnessMap.value=b.metalnessMap,i(b.metalnessMap,S.metalnessMapTransform)),S.roughness.value=b.roughness,b.roughnessMap&&(S.roughnessMap.value=b.roughnessMap,i(b.roughnessMap,S.roughnessMapTransform)),b.envMap&&(S.envMapIntensity.value=b.envMapIntensity)}function y(S,b,C){S.ior.value=b.ior,b.sheen>0&&(S.sheenColor.value.copy(b.sheenColor).multiplyScalar(b.sheen),S.sheenRoughness.value=b.sheenRoughness,b.sheenColorMap&&(S.sheenColorMap.value=b.sheenColorMap,i(b.sheenColorMap,S.sheenColorMapTransform)),b.sheenRoughnessMap&&(S.sheenRoughnessMap.value=b.sheenRoughnessMap,i(b.sheenRoughnessMap,S.sheenRoughnessMapTransform))),b.clearcoat>0&&(S.clearcoat.value=b.clearcoat,S.clearcoatRoughness.value=b.clearcoatRoughness,b.clearcoatMap&&(S.clearcoatMap.value=b.clearcoatMap,i(b.clearcoatMap,S.clearcoatMapTransform)),b.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=b.clearcoatRoughnessMap,i(b.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),b.clearcoatNormalMap&&(S.clearcoatNormalMap.value=b.clearcoatNormalMap,i(b.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(b.clearcoatNormalScale),b.side===ii&&S.clearcoatNormalScale.value.negate())),b.dispersion>0&&(S.dispersion.value=b.dispersion),b.iridescence>0&&(S.iridescence.value=b.iridescence,S.iridescenceIOR.value=b.iridescenceIOR,S.iridescenceThicknessMinimum.value=b.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=b.iridescenceThicknessRange[1],b.iridescenceMap&&(S.iridescenceMap.value=b.iridescenceMap,i(b.iridescenceMap,S.iridescenceMapTransform)),b.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=b.iridescenceThicknessMap,i(b.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),b.transmission>0&&(S.transmission.value=b.transmission,S.transmissionSamplerMap.value=C.texture,S.transmissionSamplerSize.value.set(C.width,C.height),b.transmissionMap&&(S.transmissionMap.value=b.transmissionMap,i(b.transmissionMap,S.transmissionMapTransform)),S.thickness.value=b.thickness,b.thicknessMap&&(S.thicknessMap.value=b.thicknessMap,i(b.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=b.attenuationDistance,S.attenuationColor.value.copy(b.attenuationColor)),b.anisotropy>0&&(S.anisotropyVector.value.set(b.anisotropy*Math.cos(b.anisotropyRotation),b.anisotropy*Math.sin(b.anisotropyRotation)),b.anisotropyMap&&(S.anisotropyMap.value=b.anisotropyMap,i(b.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=b.specularIntensity,S.specularColor.value.copy(b.specularColor),b.specularColorMap&&(S.specularColorMap.value=b.specularColorMap,i(b.specularColorMap,S.specularColorMapTransform)),b.specularIntensityMap&&(S.specularIntensityMap.value=b.specularIntensityMap,i(b.specularIntensityMap,S.specularIntensityMapTransform))}function T(S,b){b.matcap&&(S.matcap.value=b.matcap)}function R(S,b){const C=e.get(b).light;S.referencePosition.value.setFromMatrixPosition(C.matrixWorld),S.nearDistance.value=C.shadow.camera.near,S.farDistance.value=C.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function f3(r,e,i,s){let l={},c={},f=[];const p=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(C,I){const F=I.program;s.uniformBlockBinding(C,F)}function h(C,I){let F=l[C.id];F===void 0&&(T(C),F=v(C),l[C.id]=F,C.addEventListener("dispose",S));const q=I.program;s.updateUBOMapping(C,q);const z=e.render.frame;c[C.id]!==z&&(x(C),c[C.id]=z)}function v(C){const I=_();C.__bindingPointIndex=I;const F=r.createBuffer(),q=C.__size,z=C.usage;return r.bindBuffer(r.UNIFORM_BUFFER,F),r.bufferData(r.UNIFORM_BUFFER,q,z),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,I,F),F}function _(){for(let C=0;C<p;C++)if(f.indexOf(C)===-1)return f.push(C),C;return Ut("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(C){const I=l[C.id],F=C.uniforms,q=C.__cache;r.bindBuffer(r.UNIFORM_BUFFER,I);for(let z=0,j=F.length;z<j;z++){const w=Array.isArray(F[z])?F[z]:[F[z]];for(let O=0,G=w.length;O<G;O++){const V=w[O];if(y(V,z,O,q)===!0){const Q=V.__offset,Z=Array.isArray(V.value)?V.value:[V.value];let ae=0;for(let W=0;W<Z.length;W++){const D=Z[W],k=R(D);typeof D=="number"||typeof D=="boolean"?(V.__data[0]=D,r.bufferSubData(r.UNIFORM_BUFFER,Q+ae,V.__data)):D.isMatrix3?(V.__data[0]=D.elements[0],V.__data[1]=D.elements[1],V.__data[2]=D.elements[2],V.__data[3]=0,V.__data[4]=D.elements[3],V.__data[5]=D.elements[4],V.__data[6]=D.elements[5],V.__data[7]=0,V.__data[8]=D.elements[6],V.__data[9]=D.elements[7],V.__data[10]=D.elements[8],V.__data[11]=0):ArrayBuffer.isView(D)?V.__data.set(new D.constructor(D.buffer,D.byteOffset,V.__data.length)):(D.toArray(V.__data,ae),ae+=k.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,Q,V.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function y(C,I,F,q){const z=C.value,j=I+"_"+F;if(q[j]===void 0)return typeof z=="number"||typeof z=="boolean"?q[j]=z:ArrayBuffer.isView(z)?q[j]=z.slice():q[j]=z.clone(),!0;{const w=q[j];if(typeof z=="number"||typeof z=="boolean"){if(w!==z)return q[j]=z,!0}else{if(ArrayBuffer.isView(z))return!0;if(w.equals(z)===!1)return w.copy(z),!0}}return!1}function T(C){const I=C.uniforms;let F=0;const q=16;for(let j=0,w=I.length;j<w;j++){const O=Array.isArray(I[j])?I[j]:[I[j]];for(let G=0,V=O.length;G<V;G++){const Q=O[G],Z=Array.isArray(Q.value)?Q.value:[Q.value];for(let ae=0,W=Z.length;ae<W;ae++){const D=Z[ae],k=R(D),ie=F%q,J=ie%k.boundary,H=ie+J;F+=J,H!==0&&q-H<k.storage&&(F+=q-H),Q.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),Q.__offset=F,F+=k.storage}}}const z=F%q;return z>0&&(F+=q-z),C.__size=F,C.__cache={},this}function R(C){const I={boundary:0,storage:0};return typeof C=="number"||typeof C=="boolean"?(I.boundary=4,I.storage=4):C.isVector2?(I.boundary=8,I.storage=8):C.isVector3||C.isColor?(I.boundary=16,I.storage=12):C.isVector4?(I.boundary=16,I.storage=16):C.isMatrix3?(I.boundary=48,I.storage=48):C.isMatrix4?(I.boundary=64,I.storage=64):C.isTexture?ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(C)?(I.boundary=16,I.storage=C.byteLength):ut("WebGLRenderer: Unsupported uniform value type.",C),I}function S(C){const I=C.target;I.removeEventListener("dispose",S);const F=f.indexOf(I.__bindingPointIndex);f.splice(F,1),r.deleteBuffer(l[I.id]),delete l[I.id],delete c[I.id]}function b(){for(const C in l)r.deleteBuffer(l[C]);f=[],l={},c={}}return{bind:m,update:h,dispose:b}}const d3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Yi=null;function h3(){return Yi===null&&(Yi=new ZS(d3,16,16,er,Da),Yi.name="DFG_LUT",Yi.minFilter=jn,Yi.magFilter=jn,Yi.wrapS=wa,Yi.wrapT=wa,Yi.generateMipmaps=!1,Yi.needsUpdate=!0),Yi}class p3{constructor(e={}){const{canvas:i=fS(),context:s=null,depth:l=!0,stencil:c=!1,alpha:f=!1,antialias:p=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:h=!1,powerPreference:v="default",failIfMajorPerformanceCaveat:_=!1,reversedDepthBuffer:x=!1,outputBufferType:y=_i}=e;this.isWebGLRenderer=!0;let T;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");T=s.getContextAttributes().alpha}else T=f;const R=y,S=new Set([Vp,Gp,Hp]),b=new Set([_i,ta,bl,Sl,Bp,kp]),C=new Uint32Array(4),I=new Int32Array(4),F=new le;let q=null,z=null;const j=[],w=[];let O=null;this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$i,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const G=this;let V=!1,Q=null;this._outputColorSpace=Di;let Z=0,ae=0,W=null,D=-1,k=null;const ie=new fn,J=new fn;let H=null;const B=new Et(0);let Y=0,ee=i.width,ve=i.height,ce=1,A=null,X=null;const ne=new fn(0,0,ee,ve),L=new fn(0,0,ee,ve);let Ee=!1;const Re=new Kp;let Ve=!1,ke=!1;const Ze=new ln,at=new le,qe=new fn,lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ze=!1;function gt(){return W===null?ce:1}let te=s;function vt(U,oe){return i.getContext(U,oe)}try{const U={alpha:!0,depth:l,stencil:c,antialias:p,premultipliedAlpha:m,preserveDrawingBuffer:h,powerPreference:v,failIfMajorPerformanceCaveat:_};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Pp}`),i.addEventListener("webglcontextlost",De,!1),i.addEventListener("webglcontextrestored",et,!1),i.addEventListener("webglcontextcreationerror",dt,!1),te===null){const oe="webgl2";if(te=vt(oe,U),te===null)throw vt(oe)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(U){throw Ut("WebGLRenderer: "+U.message),U}let nt,pt,Pe,kt,N,E,K,ue,he,Me,Ne,de,be,Le,He,Ie,Fe,mt,it,xt,se,Ue,Ae;function Xe(){nt=new h2(te),nt.init(),se=new a3(te,nt),pt=new s2(te,nt,e,se),Pe=new n3(te,nt),pt.reversedDepthBuffer&&x&&Pe.buffers.depth.setReversed(!0),kt=new g2(te),N=new GA,E=new i3(te,nt,Pe,N,pt,se,kt),K=new d2(G),ue=new yM(te),Ue=new i2(te,ue),he=new p2(te,ue,kt,Ue),Me=new v2(te,he,ue,Ue,kt),mt=new x2(te,pt,E),He=new r2(N),Ne=new HA(G,K,nt,pt,Ue,He),de=new u3(G,N),be=new jA,Le=new KA(nt),Fe=new n2(G,K,Pe,Me,T,m),Ie=new t3(G,Me,pt),Ae=new f3(te,kt,pt,Pe),it=new a2(te,nt,kt),xt=new m2(te,nt,kt),kt.programs=Ne.programs,G.capabilities=pt,G.extensions=nt,G.properties=N,G.renderLists=be,G.shadowMap=Ie,G.state=Pe,G.info=kt}Xe(),R!==_i&&(O=new y2(R,i.width,i.height,l,c));const Be=new l3(G,te);this.xr=Be,this.getContext=function(){return te},this.getContextAttributes=function(){return te.getContextAttributes()},this.forceContextLoss=function(){const U=nt.get("WEBGL_lose_context");U&&U.loseContext()},this.forceContextRestore=function(){const U=nt.get("WEBGL_lose_context");U&&U.restoreContext()},this.getPixelRatio=function(){return ce},this.setPixelRatio=function(U){U!==void 0&&(ce=U,this.setSize(ee,ve,!1))},this.getSize=function(U){return U.set(ee,ve)},this.setSize=function(U,oe,_e=!0){if(Be.isPresenting){ut("WebGLRenderer: Can't change size while VR device is presenting.");return}ee=U,ve=oe,i.width=Math.floor(U*ce),i.height=Math.floor(oe*ce),_e===!0&&(i.style.width=U+"px",i.style.height=oe+"px"),O!==null&&O.setSize(i.width,i.height),this.setViewport(0,0,U,oe)},this.getDrawingBufferSize=function(U){return U.set(ee*ce,ve*ce).floor()},this.setDrawingBufferSize=function(U,oe,_e){ee=U,ve=oe,ce=_e,i.width=Math.floor(U*_e),i.height=Math.floor(oe*_e),this.setViewport(0,0,U,oe)},this.setEffects=function(U){if(R===_i){Ut("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(U){for(let oe=0;oe<U.length;oe++)if(U[oe].isOutputPass===!0){ut("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}O.setEffects(U||[])},this.getCurrentViewport=function(U){return U.copy(ie)},this.getViewport=function(U){return U.copy(ne)},this.setViewport=function(U,oe,_e,ge){U.isVector4?ne.set(U.x,U.y,U.z,U.w):ne.set(U,oe,_e,ge),Pe.viewport(ie.copy(ne).multiplyScalar(ce).round())},this.getScissor=function(U){return U.copy(L)},this.setScissor=function(U,oe,_e,ge){U.isVector4?L.set(U.x,U.y,U.z,U.w):L.set(U,oe,_e,ge),Pe.scissor(J.copy(L).multiplyScalar(ce).round())},this.getScissorTest=function(){return Ee},this.setScissorTest=function(U){Pe.setScissorTest(Ee=U)},this.setOpaqueSort=function(U){A=U},this.setTransparentSort=function(U){X=U},this.getClearColor=function(U){return U.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor(...arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha(...arguments)},this.clear=function(U=!0,oe=!0,_e=!0){let ge=0;if(U){let xe=!1;if(W!==null){const je=W.texture.format;xe=S.has(je)}if(xe){const je=W.texture.type,Ke=b.has(je),Ge=Fe.getClearColor(),Je=Fe.getClearAlpha(),Qe=Ge.r,rt=Ge.g,bt=Ge.b;Ke?(C[0]=Qe,C[1]=rt,C[2]=bt,C[3]=Je,te.clearBufferuiv(te.COLOR,0,C)):(I[0]=Qe,I[1]=rt,I[2]=bt,I[3]=Je,te.clearBufferiv(te.COLOR,0,I))}else ge|=te.COLOR_BUFFER_BIT}oe&&(ge|=te.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),_e&&(ge|=te.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ge!==0&&te.clear(ge)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(U){U.setRenderer(this),Q=U},this.dispose=function(){i.removeEventListener("webglcontextlost",De,!1),i.removeEventListener("webglcontextrestored",et,!1),i.removeEventListener("webglcontextcreationerror",dt,!1),Fe.dispose(),be.dispose(),Le.dispose(),N.dispose(),K.dispose(),Me.dispose(),Ue.dispose(),Ae.dispose(),Ne.dispose(),Be.dispose(),Be.removeEventListener("sessionstart",ho),Be.removeEventListener("sessionend",po),Bn.stop()};function De(U){U.preventDefault(),uv("WebGLRenderer: Context Lost."),V=!0}function et(){uv("WebGLRenderer: Context Restored."),V=!1;const U=kt.autoReset,oe=Ie.enabled,_e=Ie.autoUpdate,ge=Ie.needsUpdate,xe=Ie.type;Xe(),kt.autoReset=U,Ie.enabled=oe,Ie.autoUpdate=_e,Ie.needsUpdate=ge,Ie.type=xe}function dt(U){Ut("WebGLRenderer: A WebGL context could not be created. Reason: ",U.statusMessage)}function on(U){const oe=U.target;oe.removeEventListener("dispose",on),Ft(oe)}function Ft(U){bi(U),N.remove(U)}function bi(U){const oe=N.get(U).programs;oe!==void 0&&(oe.forEach(function(_e){Ne.releaseProgram(_e)}),U.isShaderMaterial&&Ne.releaseShaderCache(U))}this.renderBufferDirect=function(U,oe,_e,ge,xe,je){oe===null&&(oe=lt);const Ke=xe.isMesh&&xe.matrixWorld.determinant()<0,Ge=Oa(U,oe,_e,ge,xe);Pe.setMaterial(ge,Ke);let Je=_e.index,Qe=1;if(ge.wireframe===!0){if(Je=he.getWireframeAttribute(_e),Je===void 0)return;Qe=2}const rt=_e.drawRange,bt=_e.attributes.position;let st=rt.start*Qe,Ot=(rt.start+rt.count)*Qe;je!==null&&(st=Math.max(st,je.start*Qe),Ot=Math.min(Ot,(je.start+je.count)*Qe)),Je!==null?(st=Math.max(st,0),Ot=Math.min(Ot,Je.count)):bt!=null&&(st=Math.max(st,0),Ot=Math.min(Ot,bt.count));const an=Ot-st;if(an<0||an===1/0)return;Ue.setup(xe,ge,Ge,_e,Je);let $t,Vt=it;if(Je!==null&&($t=ue.get(Je),Vt=xt,Vt.setIndex($t)),xe.isMesh)ge.wireframe===!0?(Pe.setLineWidth(ge.wireframeLinewidth*gt()),Vt.setMode(te.LINES)):Vt.setMode(te.TRIANGLES);else if(xe.isLine){let jt=ge.linewidth;jt===void 0&&(jt=1),Pe.setLineWidth(jt*gt()),xe.isLineSegments?Vt.setMode(te.LINES):xe.isLineLoop?Vt.setMode(te.LINE_LOOP):Vt.setMode(te.LINE_STRIP)}else xe.isPoints?Vt.setMode(te.POINTS):xe.isSprite&&Vt.setMode(te.TRIANGLES);if(xe.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))Vt.renderMultiDraw(xe._multiDrawStarts,xe._multiDrawCounts,xe._multiDrawCount);else{const jt=xe._multiDrawStarts,Ye=xe._multiDrawCounts,kn=xe._multiDrawCount,wt=Je?ue.get(Je).bytesPerElement:1,Tn=N.get(ge).currentProgram.getUniforms();for(let ri=0;ri<kn;ri++)Tn.setValue(te,"_gl_DrawID",ri),Vt.render(jt[ri]/wt,Ye[ri])}else if(xe.isInstancedMesh)Vt.renderInstances(st,an,xe.count);else if(_e.isInstancedBufferGeometry){const jt=_e._maxInstanceCount!==void 0?_e._maxInstanceCount:1/0,Ye=Math.min(_e.instanceCount,jt);Vt.renderInstances(st,an,Ye)}else Vt.render(st,an)};function si(U,oe,_e){U.transparent===!0&&U.side===Aa&&U.forceSinglePass===!1?(U.side=ii,U.needsUpdate=!0,ir(U,oe,_e),U.side=vs,U.needsUpdate=!0,ir(U,oe,_e),U.side=Aa):ir(U,oe,_e)}this.compile=function(U,oe,_e=null){_e===null&&(_e=U),z=Le.get(_e),z.init(oe),w.push(z),_e.traverseVisible(function(xe){xe.isLight&&xe.layers.test(oe.layers)&&(z.pushLight(xe),xe.castShadow&&z.pushShadow(xe))}),U!==_e&&U.traverseVisible(function(xe){xe.isLight&&xe.layers.test(oe.layers)&&(z.pushLight(xe),xe.castShadow&&z.pushShadow(xe))}),z.setupLights();const ge=new Set;return U.traverse(function(xe){if(!(xe.isMesh||xe.isPoints||xe.isLine||xe.isSprite))return;const je=xe.material;if(je)if(Array.isArray(je))for(let Ke=0;Ke<je.length;Ke++){const Ge=je[Ke];si(Ge,_e,xe),ge.add(Ge)}else si(je,_e,xe),ge.add(je)}),z=w.pop(),ge},this.compileAsync=function(U,oe,_e=null){const ge=this.compile(U,oe,_e);return new Promise(xe=>{function je(){if(ge.forEach(function(Ke){N.get(Ke).currentProgram.isReady()&&ge.delete(Ke)}),ge.size===0){xe(U);return}setTimeout(je,10)}nt.get("KHR_parallel_shader_compile")!==null?je():setTimeout(je,10)})};let Ss=null;function fo(U){Ss&&Ss(U)}function ho(){Bn.stop()}function po(){Bn.start()}const Bn=new ny;Bn.setAnimationLoop(fo),typeof self<"u"&&Bn.setContext(self),this.setAnimationLoop=function(U){Ss=U,Be.setAnimationLoop(U),U===null?Bn.stop():Bn.start()},Be.addEventListener("sessionstart",ho),Be.addEventListener("sessionend",po),this.render=function(U,oe){if(oe!==void 0&&oe.isCamera!==!0){Ut("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;Q!==null&&Q.renderStart(U,oe);const _e=Be.enabled===!0&&Be.isPresenting===!0,ge=O!==null&&(W===null||_e)&&O.begin(G,W);if(U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),oe.parent===null&&oe.matrixWorldAutoUpdate===!0&&oe.updateMatrixWorld(),Be.enabled===!0&&Be.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(Be.cameraAutoUpdate===!0&&Be.updateCamera(oe),oe=Be.getCamera()),U.isScene===!0&&U.onBeforeRender(G,U,oe,W),z=Le.get(U,w.length),z.init(oe),z.state.textureUnits=E.getTextureUnits(),w.push(z),Ze.multiplyMatrices(oe.projectionMatrix,oe.matrixWorldInverse),Re.setFromProjectionMatrix(Ze,Ji,oe.reversedDepth),ke=this.localClippingEnabled,Ve=He.init(this.clippingPlanes,ke),q=be.get(U,j.length),q.init(),j.push(q),Be.enabled===!0&&Be.isPresenting===!0){const Ke=G.xr.getDepthSensingMesh();Ke!==null&&dn(Ke,oe,-1/0,G.sortObjects)}dn(U,oe,0,G.sortObjects),q.finish(),G.sortObjects===!0&&q.sort(A,X),ze=Be.enabled===!1||Be.isPresenting===!1||Be.hasDepthSensing()===!1,ze&&Fe.addToRenderList(q,U),this.info.render.frame++,Ve===!0&&He.beginShadows();const xe=z.state.shadowsArray;if(Ie.render(xe,U,oe),Ve===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset(),(ge&&O.hasRenderPass())===!1){const Ke=q.opaque,Ge=q.transmissive;if(z.setupLights(),oe.isArrayCamera){const Je=oe.cameras;if(Ge.length>0)for(let Qe=0,rt=Je.length;Qe<rt;Qe++){const bt=Je[Qe];ia(Ke,Ge,U,bt)}ze&&Fe.render(U);for(let Qe=0,rt=Je.length;Qe<rt;Qe++){const bt=Je[Qe];Ln(q,U,bt,bt.viewport)}}else Ge.length>0&&ia(Ke,Ge,U,oe),ze&&Fe.render(U),Ln(q,U,oe)}W!==null&&ae===0&&(E.updateMultisampleRenderTarget(W),E.updateRenderTargetMipmap(W)),ge&&O.end(G),U.isScene===!0&&U.onAfterRender(G,U,oe),Ue.resetDefaultState(),D=-1,k=null,w.pop(),w.length>0?(z=w[w.length-1],E.setTextureUnits(z.state.textureUnits),Ve===!0&&He.setGlobalState(G.clippingPlanes,z.state.camera)):z=null,j.pop(),j.length>0?q=j[j.length-1]:q=null,Q!==null&&Q.renderEnd()};function dn(U,oe,_e,ge){if(U.visible===!1)return;if(U.layers.test(oe.layers)){if(U.isGroup)_e=U.renderOrder;else if(U.isLOD)U.autoUpdate===!0&&U.update(oe);else if(U.isLightProbeGrid)z.pushLightProbeGrid(U);else if(U.isLight)z.pushLight(U),U.castShadow&&z.pushShadow(U);else if(U.isSprite){if(!U.frustumCulled||Re.intersectsSprite(U)){ge&&qe.setFromMatrixPosition(U.matrixWorld).applyMatrix4(Ze);const Ke=Me.update(U),Ge=U.material;Ge.visible&&q.push(U,Ke,Ge,_e,qe.z,null)}}else if((U.isMesh||U.isLine||U.isPoints)&&(!U.frustumCulled||Re.intersectsObject(U))){const Ke=Me.update(U),Ge=U.material;if(ge&&(U.boundingSphere!==void 0?(U.boundingSphere===null&&U.computeBoundingSphere(),qe.copy(U.boundingSphere.center)):(Ke.boundingSphere===null&&Ke.computeBoundingSphere(),qe.copy(Ke.boundingSphere.center)),qe.applyMatrix4(U.matrixWorld).applyMatrix4(Ze)),Array.isArray(Ge)){const Je=Ke.groups;for(let Qe=0,rt=Je.length;Qe<rt;Qe++){const bt=Je[Qe],st=Ge[bt.materialIndex];st&&st.visible&&q.push(U,Ke,st,_e,qe.z,bt)}}else Ge.visible&&q.push(U,Ke,Ge,_e,qe.z,null)}}const je=U.children;for(let Ke=0,Ge=je.length;Ke<Ge;Ke++)dn(je[Ke],oe,_e,ge)}function Ln(U,oe,_e,ge){const{opaque:xe,transmissive:je,transparent:Ke}=U;z.setupLightsView(_e),Ve===!0&&He.setGlobalState(G.clippingPlanes,_e),ge&&Pe.viewport(ie.copy(ge)),xe.length>0&&La(xe,oe,_e),je.length>0&&La(je,oe,_e),Ke.length>0&&La(Ke,oe,_e),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function ia(U,oe,_e,ge){if((_e.isScene===!0?_e.overrideMaterial:null)!==null)return;if(z.state.transmissionRenderTarget[ge.id]===void 0){const st=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");z.state.transmissionRenderTarget[ge.id]=new ea(1,1,{generateMipmaps:!0,type:st?Da:_i,minFilter:qs,samples:Math.max(4,pt.samples),stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Lt.workingColorSpace})}const je=z.state.transmissionRenderTarget[ge.id],Ke=ge.viewport||ie;je.setSize(Ke.z*G.transmissionResolutionScale,Ke.w*G.transmissionResolutionScale);const Ge=G.getRenderTarget(),Je=G.getActiveCubeFace(),Qe=G.getActiveMipmapLevel();G.setRenderTarget(je),G.getClearColor(B),Y=G.getClearAlpha(),Y<1&&G.setClearColor(16777215,.5),G.clear(),ze&&Fe.render(_e);const rt=G.toneMapping;G.toneMapping=$i;const bt=ge.viewport;if(ge.viewport!==void 0&&(ge.viewport=void 0),z.setupLightsView(ge),Ve===!0&&He.setGlobalState(G.clippingPlanes,ge),La(U,_e,ge),E.updateMultisampleRenderTarget(je),E.updateRenderTargetMipmap(je),nt.has("WEBGL_multisampled_render_to_texture")===!1){let st=!1;for(let Ot=0,an=oe.length;Ot<an;Ot++){const $t=oe[Ot],{object:Vt,geometry:jt,material:Ye,group:kn}=$t;if(Ye.side===Aa&&Vt.layers.test(ge.layers)){const wt=Ye.side;Ye.side=ii,Ye.needsUpdate=!0,wl(Vt,_e,ge,jt,Ye,kn),Ye.side=wt,Ye.needsUpdate=!0,st=!0}}st===!0&&(E.updateMultisampleRenderTarget(je),E.updateRenderTargetMipmap(je))}G.setRenderTarget(Ge,Je,Qe),G.setClearColor(B,Y),bt!==void 0&&(ge.viewport=bt),G.toneMapping=rt}function La(U,oe,_e){const ge=oe.isScene===!0?oe.overrideMaterial:null;for(let xe=0,je=U.length;xe<je;xe++){const Ke=U[xe],{object:Ge,geometry:Je,group:Qe}=Ke;let rt=Ke.material;rt.allowOverride===!0&&ge!==null&&(rt=ge),Ge.layers.test(_e.layers)&&wl(Ge,oe,_e,Je,rt,Qe)}}function wl(U,oe,_e,ge,xe,je){U.onBeforeRender(G,oe,_e,ge,xe,je),U.modelViewMatrix.multiplyMatrices(_e.matrixWorldInverse,U.matrixWorld),U.normalMatrix.getNormalMatrix(U.modelViewMatrix),xe.onBeforeRender(G,oe,_e,ge,U,je),xe.transparent===!0&&xe.side===Aa&&xe.forceSinglePass===!1?(xe.side=ii,xe.needsUpdate=!0,G.renderBufferDirect(_e,oe,ge,xe,U,je),xe.side=vs,xe.needsUpdate=!0,G.renderBufferDirect(_e,oe,ge,xe,U,je),xe.side=Aa):G.renderBufferDirect(_e,oe,ge,xe,U,je),U.onAfterRender(G,oe,_e,ge,xe,je)}function ir(U,oe,_e){oe.isScene!==!0&&(oe=lt);const ge=N.get(U),xe=z.state.lights,je=z.state.shadowsArray,Ke=xe.state.version,Ge=Ne.getParameters(U,xe.state,je,oe,_e,z.state.lightProbeGridArray),Je=Ne.getProgramCacheKey(Ge);let Qe=ge.programs;ge.environment=U.isMeshStandardMaterial||U.isMeshLambertMaterial||U.isMeshPhongMaterial?oe.environment:null,ge.fog=oe.fog;const rt=U.isMeshStandardMaterial||U.isMeshLambertMaterial&&!U.envMap||U.isMeshPhongMaterial&&!U.envMap;ge.envMap=K.get(U.envMap||ge.environment,rt),ge.envMapRotation=ge.environment!==null&&U.envMap===null?oe.environmentRotation:U.envMapRotation,Qe===void 0&&(U.addEventListener("dispose",on),Qe=new Map,ge.programs=Qe);let bt=Qe.get(Je);if(bt!==void 0){if(ge.currentProgram===bt&&ge.lightsStateVersion===Ke)return Ua(U,Ge),bt}else Ge.uniforms=Ne.getUniforms(U),Q!==null&&U.isNodeMaterial&&Q.build(U,_e,Ge),U.onBeforeCompile(Ge,G),bt=Ne.acquireProgram(Ge,Je),Qe.set(Je,bt),ge.uniforms=Ge.uniforms;const st=ge.uniforms;return(!U.isShaderMaterial&&!U.isRawShaderMaterial||U.clipping===!0)&&(st.clippingPlanes=He.uniform),Ua(U,Ge),ge.needsLights=Ms(U),ge.lightsStateVersion=Ke,ge.needsLights&&(st.ambientLightColor.value=xe.state.ambient,st.lightProbe.value=xe.state.probe,st.directionalLights.value=xe.state.directional,st.directionalLightShadows.value=xe.state.directionalShadow,st.spotLights.value=xe.state.spot,st.spotLightShadows.value=xe.state.spotShadow,st.rectAreaLights.value=xe.state.rectArea,st.ltc_1.value=xe.state.rectAreaLTC1,st.ltc_2.value=xe.state.rectAreaLTC2,st.pointLights.value=xe.state.point,st.pointLightShadows.value=xe.state.pointShadow,st.hemisphereLights.value=xe.state.hemi,st.directionalShadowMatrix.value=xe.state.directionalShadowMatrix,st.spotLightMatrix.value=xe.state.spotLightMatrix,st.spotLightMap.value=xe.state.spotLightMap,st.pointShadowMatrix.value=xe.state.pointShadowMatrix),ge.lightProbeGrid=z.state.lightProbeGridArray.length>0,ge.currentProgram=bt,ge.uniformsList=null,bt}function mo(U){if(U.uniformsList===null){const oe=U.currentProgram.getUniforms();U.uniformsList=bu.seqWithValue(oe.seq,U.uniforms)}return U.uniformsList}function Ua(U,oe){const _e=N.get(U);_e.outputColorSpace=oe.outputColorSpace,_e.batching=oe.batching,_e.batchingColor=oe.batchingColor,_e.instancing=oe.instancing,_e.instancingColor=oe.instancingColor,_e.instancingMorph=oe.instancingMorph,_e.skinning=oe.skinning,_e.morphTargets=oe.morphTargets,_e.morphNormals=oe.morphNormals,_e.morphColors=oe.morphColors,_e.morphTargetsCount=oe.morphTargetsCount,_e.numClippingPlanes=oe.numClippingPlanes,_e.numIntersection=oe.numClipIntersection,_e.vertexAlphas=oe.vertexAlphas,_e.vertexTangents=oe.vertexTangents,_e.toneMapping=oe.toneMapping}function go(U,oe){if(U.length===0)return null;if(U.length===1)return U[0].texture!==null?U[0]:null;F.setFromMatrixPosition(oe.matrixWorld);for(let _e=0,ge=U.length;_e<ge;_e++){const xe=U[_e];if(xe.texture!==null&&xe.boundingBox.containsPoint(F))return xe}return null}function Oa(U,oe,_e,ge,xe){oe.isScene!==!0&&(oe=lt),E.resetTextureUnits();const je=oe.fog,Ke=ge.isMeshStandardMaterial||ge.isMeshLambertMaterial||ge.isMeshPhongMaterial?oe.environment:null,Ge=W===null?G.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Lt.workingColorSpace,Je=ge.isMeshStandardMaterial||ge.isMeshLambertMaterial&&!ge.envMap||ge.isMeshPhongMaterial&&!ge.envMap,Qe=K.get(ge.envMap||Ke,Je),rt=ge.vertexColors===!0&&!!_e.attributes.color&&_e.attributes.color.itemSize===4,bt=!!_e.attributes.tangent&&(!!ge.normalMap||ge.anisotropy>0),st=!!_e.morphAttributes.position,Ot=!!_e.morphAttributes.normal,an=!!_e.morphAttributes.color;let $t=$i;ge.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&($t=G.toneMapping);const Vt=_e.morphAttributes.position||_e.morphAttributes.normal||_e.morphAttributes.color,jt=Vt!==void 0?Vt.length:0,Ye=N.get(ge),kn=z.state.lights;if(Ve===!0&&(ke===!0||U!==k)){const Ht=U===k&&ge.id===D;He.setState(ge,U,Ht)}let wt=!1;ge.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==kn.state.version||Ye.outputColorSpace!==Ge||xe.isBatchedMesh&&Ye.batching===!1||!xe.isBatchedMesh&&Ye.batching===!0||xe.isBatchedMesh&&Ye.batchingColor===!0&&xe.colorTexture===null||xe.isBatchedMesh&&Ye.batchingColor===!1&&xe.colorTexture!==null||xe.isInstancedMesh&&Ye.instancing===!1||!xe.isInstancedMesh&&Ye.instancing===!0||xe.isSkinnedMesh&&Ye.skinning===!1||!xe.isSkinnedMesh&&Ye.skinning===!0||xe.isInstancedMesh&&Ye.instancingColor===!0&&xe.instanceColor===null||xe.isInstancedMesh&&Ye.instancingColor===!1&&xe.instanceColor!==null||xe.isInstancedMesh&&Ye.instancingMorph===!0&&xe.morphTexture===null||xe.isInstancedMesh&&Ye.instancingMorph===!1&&xe.morphTexture!==null||Ye.envMap!==Qe||ge.fog===!0&&Ye.fog!==je||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==He.numPlanes||Ye.numIntersection!==He.numIntersection)||Ye.vertexAlphas!==rt||Ye.vertexTangents!==bt||Ye.morphTargets!==st||Ye.morphNormals!==Ot||Ye.morphColors!==an||Ye.toneMapping!==$t||Ye.morphTargetsCount!==jt||!!Ye.lightProbeGrid!=z.state.lightProbeGridArray.length>0)&&(wt=!0):(wt=!0,Ye.__version=ge.version);let Tn=Ye.currentProgram;wt===!0&&(Tn=ir(ge,oe,xe),Q&&ge.isNodeMaterial&&Q.onUpdateProgram(ge,Tn,Ye));let ri=!1,zi=!1,oi=!1;const Xt=Tn.getUniforms(),sn=Ye.uniforms;if(Pe.useProgram(Tn.program)&&(ri=!0,zi=!0,oi=!0),ge.id!==D&&(D=ge.id,zi=!0),Ye.needsLights){const Ht=go(z.state.lightProbeGridArray,xe);Ye.lightProbeGrid!==Ht&&(Ye.lightProbeGrid=Ht,zi=!0)}if(ri||k!==U){Pe.buffers.depth.getReversed()&&U.reversedDepth!==!0&&(U._reversedDepth=!0,U.updateProjectionMatrix()),Xt.setValue(te,"projectionMatrix",U.projectionMatrix),Xt.setValue(te,"viewMatrix",U.matrixWorldInverse);const Gi=Xt.map.cameraPosition;Gi!==void 0&&Gi.setValue(te,at.setFromMatrixPosition(U.matrixWorld)),pt.logarithmicDepthBuffer&&Xt.setValue(te,"logDepthBufFC",2/(Math.log(U.far+1)/Math.LN2)),(ge.isMeshPhongMaterial||ge.isMeshToonMaterial||ge.isMeshLambertMaterial||ge.isMeshBasicMaterial||ge.isMeshStandardMaterial||ge.isShaderMaterial)&&Xt.setValue(te,"isOrthographic",U.isOrthographicCamera===!0),k!==U&&(k=U,zi=!0,oi=!0)}if(Ye.needsLights&&(kn.state.directionalShadowMap.length>0&&Xt.setValue(te,"directionalShadowMap",kn.state.directionalShadowMap,E),kn.state.spotShadowMap.length>0&&Xt.setValue(te,"spotShadowMap",kn.state.spotShadowMap,E),kn.state.pointShadowMap.length>0&&Xt.setValue(te,"pointShadowMap",kn.state.pointShadowMap,E)),xe.isSkinnedMesh){Xt.setOptional(te,xe,"bindMatrix"),Xt.setOptional(te,xe,"bindMatrixInverse");const Ht=xe.skeleton;Ht&&(Ht.boneTexture===null&&Ht.computeBoneTexture(),Xt.setValue(te,"boneTexture",Ht.boneTexture,E))}xe.isBatchedMesh&&(Xt.setOptional(te,xe,"batchingTexture"),Xt.setValue(te,"batchingTexture",xe._matricesTexture,E),Xt.setOptional(te,xe,"batchingIdTexture"),Xt.setValue(te,"batchingIdTexture",xe._indirectTexture,E),Xt.setOptional(te,xe,"batchingColorTexture"),xe._colorsTexture!==null&&Xt.setValue(te,"batchingColorTexture",xe._colorsTexture,E));const Li=_e.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&mt.update(xe,_e,Tn),(zi||Ye.receiveShadow!==xe.receiveShadow)&&(Ye.receiveShadow=xe.receiveShadow,Xt.setValue(te,"receiveShadow",xe.receiveShadow)),(ge.isMeshStandardMaterial||ge.isMeshLambertMaterial||ge.isMeshPhongMaterial)&&ge.envMap===null&&oe.environment!==null&&(sn.envMapIntensity.value=oe.environmentIntensity),sn.dfgLUT!==void 0&&(sn.dfgLUT.value=h3()),zi){if(Xt.setValue(te,"toneMappingExposure",G.toneMappingExposure),Ye.needsLights&&Pa(sn,oi),je&&ge.fog===!0&&de.refreshFogUniforms(sn,je),de.refreshMaterialUniforms(sn,ge,ce,ve,z.state.transmissionRenderTarget[U.id]),Ye.needsLights&&Ye.lightProbeGrid){const Ht=Ye.lightProbeGrid;sn.probesSH.value=Ht.texture,sn.probesMin.value.copy(Ht.boundingBox.min),sn.probesMax.value.copy(Ht.boundingBox.max),sn.probesResolution.value.copy(Ht.resolution)}bu.upload(te,mo(Ye),sn,E)}if(ge.isShaderMaterial&&ge.uniformsNeedUpdate===!0&&(bu.upload(te,mo(Ye),sn,E),ge.uniformsNeedUpdate=!1),ge.isSpriteMaterial&&Xt.setValue(te,"center",xe.center),Xt.setValue(te,"modelViewMatrix",xe.modelViewMatrix),Xt.setValue(te,"normalMatrix",xe.normalMatrix),Xt.setValue(te,"modelMatrix",xe.matrixWorld),ge.uniformsGroups!==void 0){const Ht=ge.uniformsGroups;for(let Gi=0,Fa=Ht.length;Gi<Fa;Gi++){const Es=Ht[Gi];Ae.update(Es,Tn),Ae.bind(Es,Tn)}}return Tn}function Pa(U,oe){U.ambientLightColor.needsUpdate=oe,U.lightProbe.needsUpdate=oe,U.directionalLights.needsUpdate=oe,U.directionalLightShadows.needsUpdate=oe,U.pointLights.needsUpdate=oe,U.pointLightShadows.needsUpdate=oe,U.spotLights.needsUpdate=oe,U.spotLightShadows.needsUpdate=oe,U.rectAreaLights.needsUpdate=oe,U.hemisphereLights.needsUpdate=oe}function Ms(U){return U.isMeshLambertMaterial||U.isMeshToonMaterial||U.isMeshPhongMaterial||U.isMeshStandardMaterial||U.isShadowMaterial||U.isShaderMaterial&&U.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return ae},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(U,oe,_e){const ge=N.get(U);ge.__autoAllocateDepthBuffer=U.resolveDepthBuffer===!1,ge.__autoAllocateDepthBuffer===!1&&(ge.__useRenderToTexture=!1),N.get(U.texture).__webglTexture=oe,N.get(U.depthTexture).__webglTexture=ge.__autoAllocateDepthBuffer?void 0:_e,ge.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(U,oe){const _e=N.get(U);_e.__webglFramebuffer=oe,_e.__useDefaultFramebuffer=oe===void 0};const Ia=te.createFramebuffer();this.setRenderTarget=function(U,oe=0,_e=0){W=U,Z=oe,ae=_e;let ge=null,xe=!1,je=!1;if(U){const Ge=N.get(U);if(Ge.__useDefaultFramebuffer!==void 0){Pe.bindFramebuffer(te.FRAMEBUFFER,Ge.__webglFramebuffer),ie.copy(U.viewport),J.copy(U.scissor),H=U.scissorTest,Pe.viewport(ie),Pe.scissor(J),Pe.setScissorTest(H),D=-1;return}else if(Ge.__webglFramebuffer===void 0)E.setupRenderTarget(U);else if(Ge.__hasExternalTextures)E.rebindTextures(U,N.get(U.texture).__webglTexture,N.get(U.depthTexture).__webglTexture);else if(U.depthBuffer){const rt=U.depthTexture;if(Ge.__boundDepthTexture!==rt){if(rt!==null&&N.has(rt)&&(U.width!==rt.image.width||U.height!==rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(U)}}const Je=U.texture;(Je.isData3DTexture||Je.isDataArrayTexture||Je.isCompressedArrayTexture)&&(je=!0);const Qe=N.get(U).__webglFramebuffer;U.isWebGLCubeRenderTarget?(Array.isArray(Qe[oe])?ge=Qe[oe][_e]:ge=Qe[oe],xe=!0):U.samples>0&&E.useMultisampledRTT(U)===!1?ge=N.get(U).__webglMultisampledFramebuffer:Array.isArray(Qe)?ge=Qe[_e]:ge=Qe,ie.copy(U.viewport),J.copy(U.scissor),H=U.scissorTest}else ie.copy(ne).multiplyScalar(ce).floor(),J.copy(L).multiplyScalar(ce).floor(),H=Ee;if(_e!==0&&(ge=Ia),Pe.bindFramebuffer(te.FRAMEBUFFER,ge)&&Pe.drawBuffers(U,ge),Pe.viewport(ie),Pe.scissor(J),Pe.setScissorTest(H),xe){const Ge=N.get(U.texture);te.framebufferTexture2D(te.FRAMEBUFFER,te.COLOR_ATTACHMENT0,te.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ge.__webglTexture,_e)}else if(je){const Ge=oe;for(let Je=0;Je<U.textures.length;Je++){const Qe=N.get(U.textures[Je]);te.framebufferTextureLayer(te.FRAMEBUFFER,te.COLOR_ATTACHMENT0+Je,Qe.__webglTexture,_e,Ge)}}else if(U!==null&&_e!==0){const Ge=N.get(U.texture);te.framebufferTexture2D(te.FRAMEBUFFER,te.COLOR_ATTACHMENT0,te.TEXTURE_2D,Ge.__webglTexture,_e)}D=-1},this.readRenderTargetPixels=function(U,oe,_e,ge,xe,je,Ke,Ge=0){if(!(U&&U.isWebGLRenderTarget)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Je=N.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&Ke!==void 0&&(Je=Je[Ke]),Je){Pe.bindFramebuffer(te.FRAMEBUFFER,Je);try{const Qe=U.textures[Ge],rt=Qe.format,bt=Qe.type;if(U.textures.length>1&&te.readBuffer(te.COLOR_ATTACHMENT0+Ge),!pt.textureFormatReadable(rt)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pt.textureTypeReadable(bt)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}oe>=0&&oe<=U.width-ge&&_e>=0&&_e<=U.height-xe&&te.readPixels(oe,_e,ge,xe,se.convert(rt),se.convert(bt),je)}finally{const Qe=W!==null?N.get(W).__webglFramebuffer:null;Pe.bindFramebuffer(te.FRAMEBUFFER,Qe)}}},this.readRenderTargetPixelsAsync=async function(U,oe,_e,ge,xe,je,Ke,Ge=0){if(!(U&&U.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Je=N.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&Ke!==void 0&&(Je=Je[Ke]),Je)if(oe>=0&&oe<=U.width-ge&&_e>=0&&_e<=U.height-xe){Pe.bindFramebuffer(te.FRAMEBUFFER,Je);const Qe=U.textures[Ge],rt=Qe.format,bt=Qe.type;if(U.textures.length>1&&te.readBuffer(te.COLOR_ATTACHMENT0+Ge),!pt.textureFormatReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pt.textureTypeReadable(bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const st=te.createBuffer();te.bindBuffer(te.PIXEL_PACK_BUFFER,st),te.bufferData(te.PIXEL_PACK_BUFFER,je.byteLength,te.STREAM_READ),te.readPixels(oe,_e,ge,xe,se.convert(rt),se.convert(bt),0);const Ot=W!==null?N.get(W).__webglFramebuffer:null;Pe.bindFramebuffer(te.FRAMEBUFFER,Ot);const an=te.fenceSync(te.SYNC_GPU_COMMANDS_COMPLETE,0);return te.flush(),await dS(te,an,4),te.bindBuffer(te.PIXEL_PACK_BUFFER,st),te.getBufferSubData(te.PIXEL_PACK_BUFFER,0,je),te.deleteBuffer(st),te.deleteSync(an),je}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(U,oe=null,_e=0){const ge=Math.pow(2,-_e),xe=Math.floor(U.image.width*ge),je=Math.floor(U.image.height*ge),Ke=oe!==null?oe.x:0,Ge=oe!==null?oe.y:0;E.setTexture2D(U,0),te.copyTexSubImage2D(te.TEXTURE_2D,_e,0,0,Ke,Ge,xe,je),Pe.unbindTexture()};const xn=te.createFramebuffer(),Cl=te.createFramebuffer();this.copyTextureToTexture=function(U,oe,_e=null,ge=null,xe=0,je=0){let Ke,Ge,Je,Qe,rt,bt,st,Ot,an;const $t=U.isCompressedTexture?U.mipmaps[je]:U.image;if(_e!==null)Ke=_e.max.x-_e.min.x,Ge=_e.max.y-_e.min.y,Je=_e.isBox3?_e.max.z-_e.min.z:1,Qe=_e.min.x,rt=_e.min.y,bt=_e.isBox3?_e.min.z:0;else{const sn=Math.pow(2,-xe);Ke=Math.floor($t.width*sn),Ge=Math.floor($t.height*sn),U.isDataArrayTexture?Je=$t.depth:U.isData3DTexture?Je=Math.floor($t.depth*sn):Je=1,Qe=0,rt=0,bt=0}ge!==null?(st=ge.x,Ot=ge.y,an=ge.z):(st=0,Ot=0,an=0);const Vt=se.convert(oe.format),jt=se.convert(oe.type);let Ye;oe.isData3DTexture?(E.setTexture3D(oe,0),Ye=te.TEXTURE_3D):oe.isDataArrayTexture||oe.isCompressedArrayTexture?(E.setTexture2DArray(oe,0),Ye=te.TEXTURE_2D_ARRAY):(E.setTexture2D(oe,0),Ye=te.TEXTURE_2D),Pe.activeTexture(te.TEXTURE0),Pe.pixelStorei(te.UNPACK_FLIP_Y_WEBGL,oe.flipY),Pe.pixelStorei(te.UNPACK_PREMULTIPLY_ALPHA_WEBGL,oe.premultiplyAlpha),Pe.pixelStorei(te.UNPACK_ALIGNMENT,oe.unpackAlignment);const kn=Pe.getParameter(te.UNPACK_ROW_LENGTH),wt=Pe.getParameter(te.UNPACK_IMAGE_HEIGHT),Tn=Pe.getParameter(te.UNPACK_SKIP_PIXELS),ri=Pe.getParameter(te.UNPACK_SKIP_ROWS),zi=Pe.getParameter(te.UNPACK_SKIP_IMAGES);Pe.pixelStorei(te.UNPACK_ROW_LENGTH,$t.width),Pe.pixelStorei(te.UNPACK_IMAGE_HEIGHT,$t.height),Pe.pixelStorei(te.UNPACK_SKIP_PIXELS,Qe),Pe.pixelStorei(te.UNPACK_SKIP_ROWS,rt),Pe.pixelStorei(te.UNPACK_SKIP_IMAGES,bt);const oi=U.isDataArrayTexture||U.isData3DTexture,Xt=oe.isDataArrayTexture||oe.isData3DTexture;if(U.isDepthTexture){const sn=N.get(U),Li=N.get(oe),Ht=N.get(sn.__renderTarget),Gi=N.get(Li.__renderTarget);Pe.bindFramebuffer(te.READ_FRAMEBUFFER,Ht.__webglFramebuffer),Pe.bindFramebuffer(te.DRAW_FRAMEBUFFER,Gi.__webglFramebuffer);for(let Fa=0;Fa<Je;Fa++)oi&&(te.framebufferTextureLayer(te.READ_FRAMEBUFFER,te.COLOR_ATTACHMENT0,N.get(U).__webglTexture,xe,bt+Fa),te.framebufferTextureLayer(te.DRAW_FRAMEBUFFER,te.COLOR_ATTACHMENT0,N.get(oe).__webglTexture,je,an+Fa)),te.blitFramebuffer(Qe,rt,Ke,Ge,st,Ot,Ke,Ge,te.DEPTH_BUFFER_BIT,te.NEAREST);Pe.bindFramebuffer(te.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(te.DRAW_FRAMEBUFFER,null)}else if(xe!==0||U.isRenderTargetTexture||N.has(U)){const sn=N.get(U),Li=N.get(oe);Pe.bindFramebuffer(te.READ_FRAMEBUFFER,xn),Pe.bindFramebuffer(te.DRAW_FRAMEBUFFER,Cl);for(let Ht=0;Ht<Je;Ht++)oi?te.framebufferTextureLayer(te.READ_FRAMEBUFFER,te.COLOR_ATTACHMENT0,sn.__webglTexture,xe,bt+Ht):te.framebufferTexture2D(te.READ_FRAMEBUFFER,te.COLOR_ATTACHMENT0,te.TEXTURE_2D,sn.__webglTexture,xe),Xt?te.framebufferTextureLayer(te.DRAW_FRAMEBUFFER,te.COLOR_ATTACHMENT0,Li.__webglTexture,je,an+Ht):te.framebufferTexture2D(te.DRAW_FRAMEBUFFER,te.COLOR_ATTACHMENT0,te.TEXTURE_2D,Li.__webglTexture,je),xe!==0?te.blitFramebuffer(Qe,rt,Ke,Ge,st,Ot,Ke,Ge,te.COLOR_BUFFER_BIT,te.NEAREST):Xt?te.copyTexSubImage3D(Ye,je,st,Ot,an+Ht,Qe,rt,Ke,Ge):te.copyTexSubImage2D(Ye,je,st,Ot,Qe,rt,Ke,Ge);Pe.bindFramebuffer(te.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(te.DRAW_FRAMEBUFFER,null)}else Xt?U.isDataTexture||U.isData3DTexture?te.texSubImage3D(Ye,je,st,Ot,an,Ke,Ge,Je,Vt,jt,$t.data):oe.isCompressedArrayTexture?te.compressedTexSubImage3D(Ye,je,st,Ot,an,Ke,Ge,Je,Vt,$t.data):te.texSubImage3D(Ye,je,st,Ot,an,Ke,Ge,Je,Vt,jt,$t):U.isDataTexture?te.texSubImage2D(te.TEXTURE_2D,je,st,Ot,Ke,Ge,Vt,jt,$t.data):U.isCompressedTexture?te.compressedTexSubImage2D(te.TEXTURE_2D,je,st,Ot,$t.width,$t.height,Vt,$t.data):te.texSubImage2D(te.TEXTURE_2D,je,st,Ot,Ke,Ge,Vt,jt,$t);Pe.pixelStorei(te.UNPACK_ROW_LENGTH,kn),Pe.pixelStorei(te.UNPACK_IMAGE_HEIGHT,wt),Pe.pixelStorei(te.UNPACK_SKIP_PIXELS,Tn),Pe.pixelStorei(te.UNPACK_SKIP_ROWS,ri),Pe.pixelStorei(te.UNPACK_SKIP_IMAGES,zi),je===0&&oe.generateMipmaps&&te.generateMipmap(Ye),Pe.unbindTexture()},this.initRenderTarget=function(U){N.get(U).__webglFramebuffer===void 0&&E.setupRenderTarget(U)},this.initTexture=function(U){U.isCubeTexture?E.setTextureCube(U,0):U.isData3DTexture?E.setTexture3D(U,0):U.isDataArrayTexture||U.isCompressedArrayTexture?E.setTexture2DArray(U,0):E.setTexture2D(U,0),Pe.unbindTexture()},this.resetState=function(){Z=0,ae=0,W=null,Pe.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=Lt._getDrawingBufferColorSpace(e),i.unpackColorSpace=Lt._getUnpackColorSpace()}}const f_={type:"change"},rm={type:"start"},uy={type:"end"},lu=new Pu,d_=new ms,m3=Math.cos(70*yu.DEG2RAD),wn=new le,ti=2*Math.PI,Jt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Dh=1e-6;class g3 extends vM{constructor(e,i=null){super(e,i),this.state=Jt.NONE,this.target=new le,this.cursor=new le,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:$r.ROTATE,MIDDLE:$r.DOLLY,RIGHT:$r.PAN},this.touches={ONE:Qr.ROTATE,TWO:Qr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new le,this._lastQuaternion=new _s,this._lastTargetPosition=new le,this._quat=new _s().setFromUnitVectors(e.up,new le(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Bv,this._sphericalDelta=new Bv,this._scale=1,this._panOffset=new le,this._rotateStart=new ht,this._rotateEnd=new ht,this._rotateDelta=new ht,this._panStart=new ht,this._panEnd=new ht,this._panDelta=new ht,this._dollyStart=new ht,this._dollyEnd=new ht,this._dollyDelta=new ht,this._dollyDirection=new le,this._mouse=new ht,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=v3.bind(this),this._onPointerDown=x3.bind(this),this._onPointerUp=_3.bind(this),this._onContextMenu=A3.bind(this),this._onMouseWheel=S3.bind(this),this._onKeyDown=M3.bind(this),this._onTouchStart=E3.bind(this),this._onTouchMove=T3.bind(this),this._onMouseDown=y3.bind(this),this._onMouseMove=b3.bind(this),this._interceptControlDown=w3.bind(this),this._interceptControlUp=C3.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(f_),this.update(),this.state=Jt.NONE}pan(e,i){this._pan(e,i),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const i=this.object.position;wn.copy(i).sub(this.target),wn.applyQuaternion(this._quat),this._spherical.setFromVector3(wn),this.autoRotate&&this.state===Jt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let s=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(s)&&isFinite(l)&&(s<-Math.PI?s+=ti:s>Math.PI&&(s-=ti),l<-Math.PI?l+=ti:l>Math.PI&&(l-=ti),s<=l?this._spherical.theta=Math.max(s,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(s+l)/2?Math.max(s,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let c=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const f=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),c=f!=this._spherical.radius}if(wn.setFromSpherical(this._spherical),wn.applyQuaternion(this._quatInverse),i.copy(this.target).add(wn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let f=null;if(this.object.isPerspectiveCamera){const p=wn.length();f=this._clampDistance(p*this._scale);const m=p-f;this.object.position.addScaledVector(this._dollyDirection,m),this.object.updateMatrixWorld(),c=!!m}else if(this.object.isOrthographicCamera){const p=new le(this._mouse.x,this._mouse.y,0);p.unproject(this.object);const m=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),c=m!==this.object.zoom;const h=new le(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(p),this.object.updateMatrixWorld(),f=wn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;f!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(f).add(this.object.position):(lu.origin.copy(this.object.position),lu.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(lu.direction))<m3?this.object.lookAt(this.target):(d_.setFromNormalAndCoplanarPoint(this.object.up,this.target),lu.intersectPlane(d_,this.target))))}else if(this.object.isOrthographicCamera){const f=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),f!==this.object.zoom&&(this.object.updateProjectionMatrix(),c=!0)}return this._scale=1,this._performCursorZoom=!1,c||this._lastPosition.distanceToSquared(this.object.position)>Dh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Dh||this._lastTargetPosition.distanceToSquared(this.target)>Dh?(this.dispatchEvent(f_),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ti/60*this.autoRotateSpeed*e:ti/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){wn.setFromMatrixColumn(i,0),wn.multiplyScalar(-e),this._panOffset.add(wn)}_panUp(e,i){this.screenSpacePanning===!0?wn.setFromMatrixColumn(i,1):(wn.setFromMatrixColumn(i,0),wn.crossVectors(this.object.up,wn)),wn.multiplyScalar(e),this._panOffset.add(wn)}_pan(e,i){const s=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;wn.copy(l).sub(this.target);let c=wn.length();c*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*c/s.clientHeight,this.object.matrix),this._panUp(2*i*c/s.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/s.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/s.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const s=this.domElement.getBoundingClientRect(),l=e-s.left,c=i-s.top,f=s.width,p=s.height;this._mouse.x=l/f*2-1,this._mouse.y=-(c/p)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ti*this._rotateDelta.x/i.clientHeight),this._rotateUp(ti*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateStart.set(s,l)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panStart.set(s,l)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),s=e.pageX-i.x,l=e.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyStart.set(0,c)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const s=this._getSecondPointerPosition(e),l=.5*(e.pageX+s.x),c=.5*(e.pageY+s.y);this._rotateEnd.set(l,c)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ti*this._rotateDelta.x/i.clientHeight),this._rotateUp(ti*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panEnd.set(s,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),s=e.pageX-i.x,l=e.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyEnd.set(0,c),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const f=(e.pageX+i.x)*.5,p=(e.pageY+i.y)*.5;this._updateZoomParameters(f,p)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new ht,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,s={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:s.deltaY*=16;break;case 2:s.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(s.deltaY*=10),s}}function x3(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function v3(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function _3(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(uy),this.state=Jt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function y3(r){let e;switch(r.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case $r.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=Jt.DOLLY;break;case $r.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Jt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Jt.ROTATE}break;case $r.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Jt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Jt.PAN}break;default:this.state=Jt.NONE}this.state!==Jt.NONE&&this.dispatchEvent(rm)}function b3(r){switch(this.state){case Jt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case Jt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case Jt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function S3(r){this.enabled===!1||this.enableZoom===!1||this.state!==Jt.NONE||(r.preventDefault(),this.dispatchEvent(rm),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(uy))}function M3(r){this.enabled!==!1&&this._handleKeyDown(r)}function E3(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case Qr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=Jt.TOUCH_ROTATE;break;case Qr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=Jt.TOUCH_PAN;break;default:this.state=Jt.NONE}break;case 2:switch(this.touches.TWO){case Qr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=Jt.TOUCH_DOLLY_PAN;break;case Qr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=Jt.TOUCH_DOLLY_ROTATE;break;default:this.state=Jt.NONE}break;default:this.state=Jt.NONE}this.state!==Jt.NONE&&this.dispatchEvent(rm)}function T3(r){switch(this._trackPointer(r),this.state){case Jt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case Jt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case Jt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case Jt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=Jt.NONE}}function A3(r){this.enabled!==!1&&r.preventDefault()}function w3(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function C3(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */function ni(){return Math.random().toString(36).substring(2,11)}function Np(){return[{id:"sky-directional-light",name:"Sun Light",type:"directionallight",position:{x:5,y:8,z:5},rotation:{x:-45,y:45,z:0},scale:{x:1,y:1,z:1},color:"#ffffff",roughness:1,metalness:0,emissive:"#000000",wireframe:!1,intensity:1.2,visible:!0,locked:!1},{id:"point-glow-light",name:"Point Light",type:"pointlight",position:{x:-2,y:3,z:2},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},color:"#ffe0b2",roughness:1,metalness:0,emissive:"#000000",wireframe:!1,intensity:1,visible:!0,locked:!1},{id:"default-cube-id",name:"Cube",type:"cube",position:{x:0,y:.5,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},color:"#9ca3af",roughness:.5,metalness:.1,emissive:"#000000",wireframe:!1,intensity:1,visible:!0,locked:!1}]}function Zs(r,e,i){return(1-i)*r+i*e}function Dp(r,e,i){return{x:Zs(r.x,e.x,i),y:Zs(r.y,e.y,i),z:Zs(r.z,e.z,i)}}function ku(r,e,i,s){const l=i.filter(v=>v.objectId===r).sort((v,_)=>v.frame-_.frame);if(l.length===0)return s;if(l.length===1){const v=l[0];return{position:v.position,rotation:v.rotation,scale:v.scale}}if(e<=l[0].frame){const v=l[0];return{position:v.position,rotation:v.rotation,scale:v.scale}}if(e>=l[l.length-1].frame){const v=l[l.length-1];return{position:v.position,rotation:v.rotation,scale:v.scale}}let c=0;for(let v=0;v<l.length-1;v++)if(e>=l[v].frame&&e<=l[v+1].frame){c=v;break}const f=l[c],p=l[c+1],m=p.frame-f.frame,h=(e-f.frame)/(m||1);return{position:Dp(f.position,p.position,h),rotation:{x:Zs(f.rotation.x,p.rotation.x,h),y:Zs(f.rotation.y,p.rotation.y,h),z:Zs(f.rotation.z,p.rotation.z,h)},scale:Dp(f.scale,p.scale,h)}}function R3(r,e){const{action:i,type:s,name:l,position:c,rotation:f,scale:p,color:m,roughness:h,metalness:v,intensity:_}=e;if(!l)return r;switch(i){case"add":{const x=c?{x:c[0]??0,y:c[1]??.5,z:c[2]??0}:{x:0,y:.5,z:0},y=f?{x:f[0]??0,y:f[1]??0,z:f[2]??0}:{x:0,y:0,z:0},T=p?{x:p[0]??1,y:p[1]??1,z:p[2]??1}:{x:1,y:1,z:1},R={id:ni(),name:l,type:s||"cube",position:x,rotation:y,scale:T,color:m||"#cccccc",roughness:h!==void 0?h:.5,metalness:v!==void 0?v:.1,emissive:"#000000",wireframe:!1,intensity:_!==void 0?_:1,visible:!0,locked:!1};return[...r.filter(S=>S.name.toLowerCase()!==l.toLowerCase()),R]}case"update":return r.map(x=>{if(x.name.toLowerCase()===l.toLowerCase()){const y={...x};return c&&(y.position={x:c[0]??x.position.x,y:c[1]??x.position.y,z:c[2]??x.position.z}),f&&(y.rotation={x:f[0]??x.rotation.x,y:f[1]??x.rotation.y,z:f[2]??x.rotation.z}),p&&(y.scale={x:p[0]??x.scale.x,y:p[1]??x.scale.y,z:p[2]??x.scale.z}),m&&(y.color=m),h!==void 0&&(y.roughness=h),v!==void 0&&(y.metalness=v),_!==void 0&&(y.intensity=_),y}return x});case"delete":return r.filter(x=>x.name.toLowerCase()!==l.toLowerCase());default:return r}}const N3=Object.freeze(Object.defineProperty({__proto__:null,applyAICopilotCommand:R3,createDefaultScene:Np,generateId:ni,getInterpolatedStates:ku,lerp:Zs,lerpVector:Dp},Symbol.toStringTag,{value:"Module"}));function D3({sceneObjects:r,selectedObjectId:e,onSelectObject:i,onUpdateObjectTransform:s,currentFrame:l,keyframes:c,gridVisible:f,axesVisible:p,shadowsEnabled:m,isPlaying:h,slicedToolpaths:v=[],activeSlicerLayer:_=null}){const x=Oe.useRef(null),y=Oe.useRef(null),T=Oe.useRef(null),R=Oe.useRef(null),S=Oe.useRef(null),b=Oe.useRef(new Map),C=Oe.useRef(null),I=Oe.useRef(null),F=Oe.useRef(null),q=Oe.useRef(null),z=Oe.useRef(null),[j,w]=Oe.useState({vertices:0,triangles:0,fps:60}),O=Oe.useRef(performance.now()),G=Oe.useRef(0),V=Oe.useRef(new ht);Oe.useEffect(()=>{if(!x.current)return;const W=x.current.clientWidth||800,D=x.current.clientHeight||500,k=new VS;k.background=new Et("#18181b"),k.fog=new Zp("#18181b",.015),y.current=k;const ie=new vi(45,W/D,.1,100);ie.position.set(6,6,9),T.current=ie;const J=new p3({antialias:!0,alpha:!1});J.setSize(W,D),J.setPixelRatio(Math.min(window.devicePixelRatio,2)),J.shadowMap.enabled=m,J.shadowMap.type=N_,J.toneMapping=Ip,J.toneMappingExposure=1,x.current.appendChild(J.domElement),R.current=J;const H=new g3(ie,J.domElement);H.enableDamping=!0,H.dampingFactor=.05,H.maxPolarAngle=Math.PI/2-.02,H.minDistance=2,H.maxDistance=40,S.current=H;const B=new mM(30,30,"#4b5563","#27272a");B.position.y=-.001,k.add(B),C.current=B;const Y=new xM(5);Y.position.set(-.01,.01,-.01),k.add(Y),I.current=Y;const ee=new fM("#27272a",.4);k.add(ee);const ve=new ro(60,60),ce=new eM({opacity:.2}),A=new mn(ve,ce);A.rotation.x=-Math.PI/2,A.position.y=0,A.receiveShadow=!0,k.add(A),q.current=A;const X=new gM(new zn,"#f97316");k.add(X),X.visible=!1,F.current=X;const ne=new Zi;k.add(ne),z.current=ne;let L;const Ee=()=>{L=requestAnimationFrame(Ee),S.current&&S.current.update();const Ve=performance.now();if(G.current++,Ve>O.current+1e3){const ke=Math.round(G.current*1e3/(Ve-O.current));w(Ze=>({...Ze,fps:ke})),G.current=0,O.current=Ve}if(F.current&&e){const ke=b.current.get(e);ke&&ke.visible?(F.current.setFromObject(ke),F.current.visible=!0):F.current.visible=!1}else F.current&&(F.current.visible=!1);R.current&&y.current&&T.current&&R.current.render(y.current,T.current)};Ee();const Re=new ResizeObserver(Ve=>{if(!Ve||Ve.length===0)return;const ke=Ve[0],Ze=ke.contentRect.width,at=ke.contentRect.height;T.current&&R.current&&(T.current.aspect=Ze/at,T.current.updateProjectionMatrix(),R.current.setSize(Ze,at))});return x.current&&Re.observe(x.current),()=>{cancelAnimationFrame(L),Re.disconnect(),x.current&&J.domElement&&x.current.removeChild(J.domElement),ve.dispose(),ce.dispose(),J.dispose()}},[]),Oe.useEffect(()=>{var W;R.current&&(R.current.shadowMap.enabled=m,(W=y.current)==null||W.traverse(D=>{D instanceof mn&&(Array.isArray(D.material)?D.material.forEach(k=>k.needsUpdate=!0):D.material.needsUpdate=!0)}))},[m]),Oe.useEffect(()=>{C.current&&(C.current.visible=f)},[f]),Oe.useEffect(()=>{I.current&&(I.current.visible=p)},[p]),Oe.useEffect(()=>{const W=y.current;if(!W)return;const D=new Set;let k=0,ie=0;r.forEach(J=>{D.add(J.id);let H=b.current.get(J.id);const B={position:J.position,rotation:J.rotation,scale:J.scale},Y=ku(J.id,l,c,B);if(!H){let ee,ve=new rM({roughness:J.roughness,metalness:J.metalness,color:new Et(J.color),emissive:new Et(J.emissive),wireframe:J.wireframe});switch(J.type){case"sphere":ee=new nm(.5,32,24);break;case"cylinder":ee=new Iu(.5,.5,1,24);break;case"cone":ee=new Jp(.5,1,24);break;case"torus":ee=new im(.4,.15,16,48);break;case"plane":ee=new ro(1,1),ee.rotateX(-Math.PI/2);break;case"stl":{if(ee=new En,J.stlVertices&&J.stlVertices.length>0){const ce=new Float32Array(J.stlVertices);if(ee.setAttribute("position",new ai(ce,3)),J.stlNormals&&J.stlNormals.length>0){const A=new Float32Array(J.stlNormals);ee.setAttribute("normal",new ai(A,3))}else ee.computeVertexNormals();ee.center()}else ee=new tr(.8,.8,.8);break}case"pointlight":{const ce=new Ov(J.color,J.intensity,15,1);ce.castShadow=!0,ce.shadow.mapSize.width=1024,ce.shadow.mapSize.height=1024,ce.shadow.bias=-.002;const A=new em(.12,1),X=new wu({color:J.color,wireframe:!0}),ne=new Zi;ne.add(ce),ne.add(new mn(A,X)),H=ne;break}case"directionallight":{const ce=new Pv(J.color,J.intensity);ce.castShadow=!0,ce.shadow.mapSize.width=1024,ce.shadow.mapSize.height=1024,ce.shadow.camera.near=.5,ce.shadow.camera.far=25,ce.shadow.camera.left=-10,ce.shadow.camera.right=10,ce.shadow.camera.top=10,ce.shadow.camera.bottom=-10,ce.shadow.bias=-5e-4;const A=new tm(.15,.2,4);A.rotateX(Math.PI/2);const X=new wu({color:J.color,wireframe:!0}),ne=new Zi;ne.add(ce),ne.add(new mn(A,X)),H=ne;break}case"cube":default:ee=new tr(1,1,1);break}if(J.type!=="pointlight"&&J.type!=="directionallight"){const ce=new mn(ee,ve);ce.castShadow=!0,ce.receiveShadow=!0,H=ce}H.userData={objectId:J.id,type:J.type},W.add(H),b.current.set(J.id,H)}if(H instanceof mn){const ee=H.geometry;ee.index?ie+=ee.index.count/3:ee.attributes.position&&(ie+=ee.attributes.position.count/3),ee.attributes.position&&(k+=ee.attributes.position.count)}if(H.position.set(Y.position.x,Y.position.y,Y.position.z),H.rotation.set(yu.degToRad(Y.rotation.x),yu.degToRad(Y.rotation.y),yu.degToRad(Y.rotation.z)),H.scale.set(Y.scale.x,Y.scale.y,Y.scale.z),H.visible=J.visible,H instanceof mn){const ee=H.material;ee.color.set(J.color),ee.roughness=J.roughness,ee.metalness=J.metalness,ee.emissive.set(J.emissive),ee.wireframe=J.wireframe}else if(H instanceof Zi){const ee=H.children.find(ce=>ce instanceof Ov||ce instanceof Pv);ee&&(ee.color.set(J.color),"intensity"in ee&&(ee.intensity=J.intensity));const ve=H.children.find(ce=>ce instanceof mn);ve&&ve.material.color.set(J.color)}}),b.current.forEach((J,H)=>{D.has(H)||(W.remove(J),J instanceof mn?(J.geometry.dispose(),Array.isArray(J.material)?J.material.forEach(B=>B.dispose()):J.material.dispose()):J instanceof Zi&&J.children.forEach(B=>{B instanceof mn&&(B.geometry.dispose(),Array.isArray(B.material)?B.material.forEach(Y=>Y.dispose()):B.material.dispose())}),b.current.delete(H))}),w(J=>({...J,vertices:k,triangles:Math.round(ie)}))},[r,l,c]);const Q=W=>{const D=x.current,k=T.current;if(!D||!k)return;const ie=D.getBoundingClientRect();V.current.x=(W.clientX-ie.left)/ie.width*2-1,V.current.y=-((W.clientY-ie.top)/ie.height)*2+1;const J=new pM;J.setFromCamera(V.current,k);const H=[];b.current.forEach(Y=>{if(Y.visible){if(Y instanceof mn)H.push(Y);else if(Y instanceof Zi){const ee=Y.children.find(ve=>ve instanceof mn);ee&&H.push(ee)}}});const B=J.intersectObjects(H,!0);if(B.length>0){const Y=B[0].object;let ee=null;if(b.current.forEach((ve,ce)=>{(ve===Y||ve.children.includes(Y))&&(ee=ce)}),ee){i(ee);return}}i(null)},[Z,ae]=Oe.useState({x:0,y:0,z:-1});return Oe.useEffect(()=>{const W=setInterval(()=>{if(!T.current)return;const D=new le;T.current.getWorldDirection(D),ae({x:D.x,y:D.y,z:D.z})},150);return()=>clearInterval(W)},[]),Oe.useEffect(()=>{const W=y.current,D=z.current;if(!(!W||!D)){for(;D.children.length>0;){const k=D.children[0];D.remove(k),k instanceof Ap&&(k.geometry.dispose(),Array.isArray(k.material)?k.material.forEach(ie=>ie.dispose()):k.material.dispose())}!v||v.length===0||v.forEach(k=>{const ie=_!==null&&k.layerIndex===_;if(_!==null&&k.layerIndex>_)return;const J=k.points.map(ce=>new le(ce.x,ce.y+.005,ce.z));if(J.length<2)return;const H=new En().setFromPoints(J);let B=k.isExtrusion?"#f97316":"#4b5563",Y=.45;k.isExtrusion?_!==null?ie?(B="#10b981",Y=1):(B="#f97316",Y=.15):(B="#f97316",Y=.55):_!==null?ie?(B="#3b82f6",Y=.7):(B="#3f3f46",Y=.02):(B="#3f3f46",Y=.1);const ee=new Tl({color:new Et(B),transparent:!0,opacity:Y,linewidth:ie?2:1}),ve=new Ap(H,ee);D.add(ve)})}},[v,_]),g.jsxs("div",{id:"blender-threejs-viewport",ref:x,onClick:Q,className:"w-full h-full relative cursor-crosshair select-none bg-zinc-950 focus:outline-none",children:[g.jsx("div",{className:"absolute bottom-4 left-4 font-mono text-[10px] text-zinc-500 pointer-events-none bg-zinc-950/40 px-2 py-1 rounded select-none",children:"Drag to Orbit | Shift+Drag to Pan | Scroll to Zoom"}),g.jsx("div",{className:"absolute top-4 right-4 w-12 h-12 bg-zinc-900/60 rounded-full border border-zinc-800 pointer-events-none backdrop-blur-sm flex items-center justify-center p-1 z-10",children:g.jsxs("svg",{className:"w-full h-full overflow-visible",viewBox:"-24 -24 48 48",children:[g.jsx("line",{x1:"0",y1:"0",x2:Z.x*18,y2:-Z.y*18,stroke:"#ef4444",strokeWidth:"3",strokeLinecap:"round"}),g.jsx("circle",{cx:Z.x*18,cy:-Z.y*18,r:"3",fill:"#ef4444"}),g.jsx("line",{x1:"0",y1:"0",x2:Z.z*18,y2:-Z.x*18,stroke:"#3b82f6",strokeWidth:"3",strokeLinecap:"round"}),g.jsx("circle",{cx:Z.z*18,cy:-Z.x*18,r:"3",fill:"#3b82f6"}),g.jsx("line",{x1:"0",y1:"0",x2:Z.y*18,y2:-Z.z*18,stroke:"#22c55e",strokeWidth:"3",strokeLinecap:"round"}),g.jsx("circle",{cx:Z.y*18,cy:-Z.z*18,r:"3",fill:"#22c55e"}),g.jsx("circle",{cx:"0",cy:"0",r:"2.5",fill:"#ffffff"}),g.jsx("text",{x:Z.x*18,y:-Z.y*18-5,fill:"#ef4444",fontSize:"6",fontFamily:"sans-serif",textAnchor:"middle",children:"X"}),g.jsx("text",{x:Z.z*18,y:-Z.x*18-5,fill:"#3b82f6",fontSize:"6",fontFamily:"sans-serif",textAnchor:"middle",children:"Z"})]})})]})}/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z3=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),L3=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,i,s)=>s?s.toUpperCase():i.toLowerCase()),h_=r=>{const e=L3(r);return e.charAt(0).toUpperCase()+e.slice(1)},fy=(...r)=>r.filter((e,i,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===i).join(" ").trim(),U3=r=>{for(const e in r)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var O3={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P3=Oe.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:i=2,absoluteStrokeWidth:s,className:l="",children:c,iconNode:f,...p},m)=>Oe.createElement("svg",{ref:m,...O3,width:e,height:e,stroke:r,strokeWidth:s?Number(i)*24/Number(e):i,className:fy("lucide",l),...!c&&!U3(p)&&{"aria-hidden":"true"},...p},[...f.map(([h,v])=>Oe.createElement(h,v)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=(r,e)=>{const i=Oe.forwardRef(({className:s,...l},c)=>Oe.createElement(P3,{ref:c,iconNode:e,className:fy(`lucide-${z3(h_(r))}`,`lucide-${r}`,s),...l}));return i.displayName=h_(r),i};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I3=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]],p_=ft("box",I3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F3=[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],B3=ft("camera",F3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k3=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],om=ft("chevron-left",k3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H3=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],dy=ft("chevron-right",H3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G3=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],V3=ft("circle-check",G3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j3=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],X3=ft("circle-plus",j3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W3=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],hy=ft("clock",W3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q3=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],Y3=ft("database",q3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z3=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],K3=ft("disc",Z3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q3=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],py=ft("download",Q3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J3=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],$3=ft("eye-off",J3);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ew=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],tw=ft("eye",ew);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nw=[["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",key:"1mlx9k"}],["path",{d:"M15.033 13.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56v-4.704a.645.645 0 0 1 .967-.56z",key:"1tzo1f"}]],iw=ft("file-play",nw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aw=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],sw=ft("file-text",aw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rw=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]],cu=ft("film",rw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ow=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]],lw=ft("key",ow);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cw=[["path",{d:"M10 8h.01",key:"1r9ogq"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M14 8h.01",key:"1primd"}],["path",{d:"M16 12h.01",key:"1l6xoz"}],["path",{d:"M18 8h.01",key:"emo2bl"}],["path",{d:"M6 8h.01",key:"x9i8wu"}],["path",{d:"M7 16h10",key:"wp8him"}],["path",{d:"M8 12h.01",key:"czm47f"}],["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}]],m_=ft("keyboard",cw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uw=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],g_=ft("layers",uw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fw=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]],dw=ft("lock-open",fw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hw=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],x_=ft("lock",hw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pw=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],mw=ft("maximize-2",pw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gw=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],v_=ft("monitor",gw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xw=[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"m15 19-3 3-3-3",key:"11eu04"}],["path",{d:"m19 9 3 3-3 3",key:"1mg7y2"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"m5 9-3 3 3 3",key:"j64kie"}],["path",{d:"m9 5 3-3 3 3",key:"l8vdw6"}]],__=ft("move",xw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vw=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],zh=ft("music",vw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _w=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]],Lh=ft("palette",_w);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yw=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],my=ft("pause",yw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bw=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],Sw=ft("pen",bw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mw=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],zp=ft("play",Mw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ew=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],uu=ft("plus",Ew);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tw=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],y_=ft("printer",Tw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Aw=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Nu=ft("refresh-cw",Aw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ww=[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]],Cw=ft("rotate-cw",ww);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rw=[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]],gy=ft("scissors",Rw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nw=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],Dw=ft("send",Nw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zw=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],b_=ft("settings",zw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lw=[["path",{d:"M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",key:"15892j"}],["path",{d:"M3 20V4",key:"1ptbpl"}]],Uw=ft("skip-back",Lw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ow=[["path",{d:"M21 4v16",key:"7j8fe9"}],["path",{d:"M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",key:"zs4d6"}]],Pw=ft("skip-forward",Ow);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iw=[["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M12 21v-9",key:"17s77i"}],["path",{d:"M12 8V3",key:"13r4qs"}],["path",{d:"M17 16h4",key:"h1uq16"}],["path",{d:"M19 12V3",key:"o1uvq1"}],["path",{d:"M19 21v-5",key:"qua636"}],["path",{d:"M3 14h4",key:"bcjad9"}],["path",{d:"M5 10V3",key:"cb8scm"}],["path",{d:"M5 21v-7",key:"1w1uti"}]],S_=ft("sliders-vertical",Iw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fw=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],yi=ft("sparkles",Fw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bw=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],M_=ft("sun",Bw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kw=[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]],Hw=ft("terminal",kw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gw=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],Du=ft("trash-2",Gw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vw=[["path",{d:"m17 2-5 5-5-5",key:"16satq"}],["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",key:"1e6viu"}]],Uh=ft("tv",Vw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jw=[["path",{d:"M12 4v16",key:"1654pz"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",key:"e0r10z"}],["path",{d:"M9 20h6",key:"s66wpe"}]],fu=ft("type",jw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xw=[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]],Ww=ft("undo-2",Xw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qw=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],hl=ft("upload",qw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yw=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],Zw=ft("users",Yw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kw=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],Qw=ft("volume-2",Kw);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jw=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],E_=ft("x",Jw);/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const xi=20,du=110,hu=110;function $w(r,e,i,s){const l=[],c=[],p=r.filter(w=>w.visible&&w.type!=="pointlight"&&w.type!=="directionallight"&&w.type!=="plane").map(w=>{const O={position:w.position,rotation:w.rotation,scale:w.scale},G=ku(w.id,e,i,O);return{id:w.id,name:w.name,type:w.type,position:G.position,rotation:G.rotation,scale:G.scale}});if(p.length===0)return{gcodeText:`; G-code Generated by Blender Web Slicer Engine
; WARNING: No printable continuous meshes were found on the grid.
M104 S0 ; Turn off extruder
M140 S0 ; Turn off bed
G28 ; Home axes
`,toolpathSegments:[],stats:{filamentLength:0,filamentWeight:0,estTime:"0 mins",lineCount:5,layerCount:0}};let m=1/0,h=-1/0;p.forEach(w=>{let O=.5;w.type==="cube"||w.type==="sphere"||w.type==="cylinder"||w.type==="cone"?O=.5:w.type==="torus"&&(O=.55);const G=w.position.y-O*w.scale.y,V=w.position.y+O*w.scale.y;G<m&&(m=G),V>h&&(h=V)}),m<0&&(m=0),h<m&&(h=m+1);const v=s.layerHeight/xi;s.layerHeight;const _=Math.max(1,Math.ceil((h-m)/v));c.push("; ================================================="),c.push("; GCODE GENERATED BY BLENDER-WEB 3D PRINTER SLICER"),c.push(`; Generated Time: ${new Date().toLocaleString()}`),c.push("; Target Printer: Custom 220x220 FDM Printer"),c.push(`; Layer Height: ${s.layerHeight} mm`),c.push(`; Infill Density: ${s.infillDensity}%`),c.push(`; Infill Pattern: ${s.infillPattern}`),c.push(`; Wall Count Shells: ${s.shells}`),c.push(`; Nozzle Temperature: ${s.nozzleTemp}°C`),c.push(`; Bed Temperature: ${s.bedTemp}°C`),c.push(`; Print Speed: ${s.printSpeed} mm/s`),c.push(`; Filament Diameter: ${s.filamentDiameter} mm`),c.push("; ================================================="),c.push(""),c.push("; --- START CODE G-CODE ---"),c.push("M201 X500 Y500 Z100 E2000 ; Sets Max Acceleration constants"),c.push(`M140 S${s.bedTemp} ; Start heating build plate`),c.push(`M104 S${s.nozzleTemp} ; Start heating print nozzle`),c.push("G90 ; Set positioning of coordinates to Absolute"),c.push("M82 ; Extruder in absolute mode"),c.push("G28 ; Home all three axes"),c.push("G1 Z2.0 F3000 ; Move Z axis up to avoid scratching nozzle"),c.push(`M190 S${s.bedTemp} ; Wait for print bed to reach temperature`),c.push(`M109 S${s.nozzleTemp} ; Wait for print nozzle to reach temperature`),c.push("G92 E0 ; Reset extrusion distance index"),c.push("G1 F1500 E3.0 ; Priming nozzle length"),c.push("G92 E0 ; Reset extrusion index once more"),c.push("; --- LOGICAL LAYER SLICING ---");let x=0,y=0,T=0;for(let w=0;w<_;w++){let O=function(Z,ae,W){return ae*Math.sin(W)+Z*Math.cos(W)};const G=m+w*v+v*.5,V=(G*xi).toFixed(3);c.push(""),c.push(`; LAYER:${w}`),c.push(`; LAYER_HEIGHT:${s.layerHeight*(w+1)}`),c.push(`G1 Z${V} F1500 ; Adjust Z print layer elevation`);const Q=[];p.forEach(Z=>{let ae=.5;Z.type==="cube"||Z.type==="sphere"||Z.type==="cylinder"||Z.type==="cone"?ae=.5:Z.type==="torus"&&(ae=.55);const W=Z.position.y-ae*Z.scale.y,D=Z.position.y+ae*Z.scale.y;if(G>=W&&G<=D){const k=[];if(Z.type==="cube"||Z.type==="stl"){const ie=Z.scale.x,J=Z.scale.z,H=[{lx:-.5,lz:-.5},{lx:.5,lz:-.5},{lx:.5,lz:.5},{lx:-.5,lz:.5}],B=Z.rotation.y*Math.PI/180;H.forEach(Y=>{const ee=Y.lx*ie,ve=Y.lz*J,ce=ee*Math.cos(B)-ve*Math.sin(B)+Z.position.x,A=ee*Math.sin(B)+ve*Math.cos(B)+Z.position.z;k.push({x:ce,z:A})}),k.push({...k[0]})}else if(Z.type==="sphere"){const ie=G-Z.position.y,J=.5,H=J*Z.scale.y,B=Math.max(0,1-Math.pow(ie/H,2)),Y=J*Z.scale.x*Math.sqrt(B),ee=J*Z.scale.z*Math.sqrt(B);if(Y>.01&&ee>.01){const ce=Z.rotation.y*Math.PI/180;for(let A=0;A<=24;A++){const X=A*2*Math.PI/24,ne=Y*Math.cos(X),L=ee*Math.sin(X),Ee=ne*Math.cos(ce)-L*Math.sin(ce)+Z.position.x,Re=ne*Math.sin(ce)+L*Math.cos(ce)+Z.position.z;k.push({x:Ee,z:Re})}}}else if(Z.type==="cylinder"){const ie=.5*Z.scale.x,J=.5*Z.scale.z,H=24,B=Z.rotation.y*Math.PI/180;for(let Y=0;Y<=H;Y++){const ee=Y*2*Math.PI/H,ve=ie*Math.cos(ee),ce=J*Math.sin(ee),A=ve*Math.cos(B)-ce*Math.sin(B)+Z.position.x,X=ve*Math.sin(B)+ce*Math.cos(B)+Z.position.z;k.push({x:A,z:X})}}else if(Z.type==="cone"){const ie=G-W,J=D-W,H=Math.max(0,Math.min(1,1-ie/J)),B=.5*Z.scale.x*H,Y=.5*Z.scale.z*H;if(B>.005){const ve=Z.rotation.y*Math.PI/180;for(let ce=0;ce<=20;ce++){const A=ce*2*Math.PI/20,X=B*Math.cos(A),ne=Y*Math.sin(A),L=X*Math.cos(ve)-ne*Math.sin(ve)+Z.position.x,Ee=X*Math.sin(ve)+ne*Math.cos(ve)+Z.position.z;k.push({x:L,z:Ee})}}}else if(Z.type==="torus"){const ie=G-Z.position.y,J=.4*Math.max(Z.scale.x,Z.scale.z),H=.15*Z.scale.y;if(Math.abs(ie)<H){const B=Math.sqrt(Math.pow(H,2)-Math.pow(ie,2)),Y=Math.max(.01,J-B),ee=J+B,ve=Z.rotation.y*Math.PI/180,ce=20,A=[];for(let X=0;X<=ce;X++){const ne=X*2*Math.PI/ce,L=ee*Math.cos(ne),Ee=ee*Math.sin(ne),Re=L*Math.cos(ve)-Ee*Math.sin(ve)+Z.position.x,Ve=L*Math.sin(ve)+Ee*Math.cos(ve)+Z.position.z;A.push({x:Re,z:Ve})}if(Q.push({points:A.map(X=>({x:X.x,y:G,z:X.z})),isOuter:!0,objId:Z.id}),Y>.05){const X=[];for(let ne=0;ne<=ce;ne++){const L=ne*2*Math.PI/ce,Ee=Y*Math.cos(L),Re=Y*Math.sin(L),Ve=Ee*Math.cos(ve)-Re*Math.sin(ve)+Z.position.x,ke=Ee*Math.sin(ve)+O(Re,Ee,ve)+Z.position.z;X.push({x:Ve,z:ke})}Q.push({points:X.map(ne=>({x:ne.x,y:G,z:ne.z})),isOuter:!1,objId:Z.id})}}}k.length>1&&Z.type!=="torus"&&Q.push({points:k.map(ie=>({x:ie.x,y:G,z:ie.z})),isOuter:!0,objId:Z.id})}}),Q.forEach(Z=>{var ae;if(!(Z.points.length<2)){for(let W=0;W<s.shells;W++){const D=1-W*.045,k=Z.points.reduce((ce,A)=>ce+A.x,0)/Z.points.length,ie=Z.points.reduce((ce,A)=>ce+A.z,0)/Z.points.length,J=Z.points.map(ce=>{const A=k+(ce.x-k)*D,X=ie+(ce.z-ie)*D;return{x:A,y:ce.y,z:X}}),H=J[0],B=(du+H.x*xi).toFixed(3),Y=(hu+H.z*xi).toFixed(3);c.push(`G1 F${s.travelSpeed*60} E${(x-s.retractionDistance).toFixed(4)} ; Retract nozzle`),c.push(`G0 X${B} Y${Y} F${s.travelSpeed*60} ; Rapid travel to contour start`),c.push(`G1 F${s.printSpeed*60} E${x.toFixed(4)} ; Unretract nozzle`);const ee=((ae=l[l.length-1])==null?void 0:ae.points.slice(-1)[0])||{x:0,y:G,z:0};l.push({points:[ee,H],isExtrusion:!1,layerIndex:w}),T+=Math.hypot(H.x-ee.x,H.z-ee.z)*xi;const ve=[H];for(let ce=1;ce<J.length;ce++){const A=J[ce],X=J[ce-1],ne=Math.hypot(A.x-X.x,A.z-X.z)*xi,L=.45,Ee=s.filamentDiameter/2,Re=Math.PI*Math.pow(Ee,2),Ve=L*s.layerHeight/Re,ke=ne*Ve;x+=ke;const Ze=(du+A.x*xi).toFixed(3),at=(hu+A.z*xi).toFixed(3);c.push(`G1 X${Ze} Y${at} E${x.toFixed(4)}`),ve.push(A),y+=ne}l.push({points:ve,isExtrusion:!0,layerIndex:w})}if(s.infillDensity>0){let W=1/0,D=-1/0,k=1/0,ie=-1/0;Z.points.forEach(Y=>{Y.x<W&&(W=Y.x),Y.x>D&&(D=Y.x),Y.z<k&&(k=Y.z),Y.z>ie&&(ie=Y.z)});const J=D-W,H=ie-k,B=(1-s.infillDensity/120)*Math.min(J,H)*.4;if(B>.02){const Y=[];for(let ee=W+B;ee<D;ee+=B)Y.push(ee);Y.forEach((ee,ve)=>{const ce={x:ee,y:G,z:k+H*.15},A={x:ee,y:G,z:ie-H*.15},X=[ce,A];s.infillPattern==="grid"&&ve%2===0&&(X[0]={x:W+J*.15,y:G,z:ee},X[1]={x:D-J*.15,y:G,z:ee});const ne=X[0],L=X[1],Ee=(du+ne.x*xi).toFixed(3),Re=(hu+ne.z*xi).toFixed(3),Ve=(du+L.x*xi).toFixed(3),ke=(hu+L.z*xi).toFixed(3);c.push(`G1 F${s.travelSpeed*60} E${(x-s.retractionDistance).toFixed(4)} ; Retract nozzle`),c.push(`G0 X${Ee} Y${Re} F${s.travelSpeed*60} ; Travel to infill node`),c.push(`G1 F${s.printSpeed*60} E${x.toFixed(4)} ; Prime nozzle`);const Ze=Math.hypot(L.x-ne.x,L.z-ne.z)*xi,at=.42,qe=s.filamentDiameter/2,lt=at*s.layerHeight/(Math.PI*Math.pow(qe,2));x+=Ze*lt,c.push(`G1 X${Ve} Y${ke} E${x.toFixed(4)} ; Extrude infill bar`),l.push({points:[ne,L],isExtrusion:!0,layerIndex:w})})}}}})}c.push(""),c.push("; --- END CODE G-CODE ---"),c.push("M104 S0 ; Extruder heater off"),c.push("M140 S0 ; Bed core heater off"),c.push("G91 ; Relative positioning coords"),c.push("G1 E-2 F2700 ; Retract final filament"),c.push("G1 Z10 F3000 ; Lift nozzle up away from print"),c.push("G90 ; Absolute positioning"),c.push("G28 X0 Y0 ; Home print head horizontal X/Y"),c.push("M84 ; Turn off stepper motors completely"),c.push("; Done!");const R=x/1e3,S=s.filamentDiameter/2/10,b=x/10,I=Math.PI*Math.pow(S,2)*b*1.24,F=y/s.printSpeed+T/s.travelSpeed,z=Math.max(1,Math.round(F/60*1.35)),j=z>60?`${Math.floor(z/60)}h ${z%60}m`:`${z} mins`;return{gcodeText:c.join(`
`),toolpathSegments:l,stats:{filamentLength:parseFloat(R.toFixed(2)),filamentWeight:parseFloat(I.toFixed(1)),estTime:j,lineCount:c.length,layerCount:_}}}function eC({sceneObjects:r,selectedObjectId:e,onSelectObject:i,onUpdateObject:s,onDeleteObject:l,gridVisible:c,setGridVisible:f,axesVisible:p,setAxesVisible:m,shadowsEnabled:h,setShadowsEnabled:v,keyframes:_,currentFrame:x,onSlicingChanged:y,activeSlicerLayer:T,setActiveSlicerLayer:R}){const[S,b]=Oe.useState("transform"),[C,I]=Oe.useState(null),[F,q]=Oe.useState(""),[z,j]=Oe.useState(""),[w,O]=Oe.useState(!1),[G,V]=Oe.useState(""),[Q,Z]=Oe.useState({layerHeight:.2,infillDensity:20,infillPattern:"grid",shells:2,nozzleTemp:210,bedTemp:60,printSpeed:50,travelSpeed:100,filamentDiameter:1.75,retractionDistance:5}),[ae,W]=Oe.useState(null),[D,k]=Oe.useState(!1),[ie,J]=Oe.useState(!1),H=r.find(A=>A.id===e),B=A=>{switch(A){case"pointlight":return g.jsx(K3,{className:"w-3.5 h-3.5 text-amber-400"});case"directionallight":return g.jsx(M_,{className:"w-3.5 h-3.5 text-yellow-400"});case"stl":return g.jsx(g_,{className:"w-3.5 h-3.5 text-emerald-400"});default:return g.jsx(p_,{className:"w-3.5 h-3.5 text-zinc-400"})}},Y=A=>{I(A.id),q(A.name)},ee=A=>{F.trim()&&s(A,{name:F.trim()}),I(null)},ve=(A,X,ne,L)=>{if(!H)return;const Ee={...H[X]};Ee[ne]=isNaN(L)?0:L,s(A,{[X]:Ee})},ce=async()=>{if(!(!H||!z.trim())){O(!0),V("Computing material parameters...");try{const A=await fetch("/api/gemini/material",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({materialPrompt:z,currentObjectName:H.name})});if(!A.ok)throw new Error("Could not access shader generator API.");const X=await A.json();X&&(s(H.id,{color:X.color||H.color,roughness:X.roughness!==void 0?X.roughness:H.roughness,metalness:X.metalness!==void 0?X.metalness:H.metalness,emissive:X.emissive||H.emissive,wireframe:X.wireframe!==void 0?X.wireframe:H.wireframe}),V(X.explanation||"Material shading updated!"))}catch(A){console.error(A),V(`Error: ${A.message||"Failed to load parameters."}`)}finally{O(!1)}}};return g.jsxs("div",{className:"w-80 h-full flex flex-col bg-zinc-900 border-l border-zinc-800 text-zinc-300 font-sans select-none overflow-hidden",children:[g.jsxs("div",{className:"flex-1 min-h-[180px] max-h-[300px] flex flex-col border-b border-zinc-800",children:[g.jsxs("div",{className:"bg-zinc-950 px-3.5 py-2 border-b border-zinc-800 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-zinc-400",children:[g.jsxs("span",{className:"flex items-center gap-1.5",children:[g.jsx(g_,{className:"w-3.5 h-3.5 text-zinc-500"}),"Scene Outliner"]}),g.jsxs("span",{className:"text-[10px] text-zinc-500 font-mono normal-case",children:[r.length," items"]})]}),g.jsx("div",{className:"flex-1 overflow-y-auto p-1.5 space-y-0.5 bg-zinc-900/50 scrollbar-thin",children:r.map(A=>{const X=A.id===e,ne=A.id===C;return g.jsxs("div",{id:`outliner-item-${A.id}`,onClick:()=>i(A.id),className:`group flex items-center justify-between px-2.5 py-1.5 rounded transition text-xs cursor-pointer ${X?"bg-zinc-800 text-white font-medium shadow-sm border border-zinc-700/50":"hover:bg-zinc-800/40 text-zinc-300"}`,children:[g.jsxs("div",{className:"flex items-center gap-2 max-w-[140px] truncate",children:[B(A.type),ne?g.jsx("input",{id:`rename-input-${A.id}`,type:"text",className:"bg-zinc-950 text-white border border-orange-500 px-1 py-0.5 rounded text-[11px] w-24 focus:outline-none",value:F,onChange:L=>q(L.target.value),onBlur:()=>ee(A.id),onKeyDown:L=>{L.key==="Enter"&&ee(A.id),L.key==="Escape"&&I(null)},autoFocus:!0}):g.jsx("span",{onDoubleClick:()=>Y(A),className:"truncate leading-none",children:A.name})]}),g.jsxs("div",{className:"flex items-center gap-1 opacity-60 group-hover:opacity-100 transition",children:[!ne&&g.jsx("button",{id:`btn-toggle-rename-${A.id}`,onClick:L=>{L.stopPropagation(),Y(A)},className:"p-1 hover:text-white rounded hover:bg-zinc-700/50 transition",title:"Double-click name to rename",children:g.jsx(Sw,{className:"w-3 h-3 text-zinc-500"})}),g.jsx("button",{id:`btn-toggle-lock-${A.id}`,onClick:L=>{L.stopPropagation(),s(A.id,{locked:!A.locked})},className:`p-1 rounded transition hover:text-white hover:bg-zinc-700/50 ${A.locked?"text-orange-400":"text-zinc-500"}`,children:A.locked?g.jsx(x_,{className:"w-3 h-3"}):g.jsx(dw,{className:"w-3 h-3"})}),g.jsx("button",{id:`btn-toggle-vis-${A.id}`,onClick:L=>{L.stopPropagation(),s(A.id,{visible:!A.visible})},className:`p-1 rounded transition hover:text-white hover:bg-zinc-700/50 ${A.visible?"text-zinc-500":"text-red-400"}`,children:A.visible?g.jsx(tw,{className:"w-3 h-3"}):g.jsx($3,{className:"w-3 h-3"})}),g.jsx("button",{id:`btn-delete-${A.id}`,onClick:L=>{L.stopPropagation(),X&&i(null),l(A.id)},className:"p-1 rounded hover:text-red-400 hover:bg-zinc-700/50 transition text-zinc-500",children:g.jsx(Du,{className:"w-3 h-3"})})]})]},A.id)})})]}),g.jsxs("div",{className:"flex-1 flex flex-col min-h-0",children:[g.jsxs("div",{className:"flex bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold tracking-wider uppercase",children:[g.jsxs("button",{id:"tab-transform",onClick:()=>b("transform"),className:`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition border-b-2 ${S==="transform"?"border-orange-500 text-white bg-zinc-900":"border-transparent text-zinc-500 hover:text-zinc-300"}`,children:[g.jsx(__,{className:"w-3 h-3"}),"Transform"]}),g.jsxs("button",{id:"tab-material",onClick:()=>b("material"),className:`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition border-b-2 ${S==="material"?"border-orange-500 text-white bg-zinc-900":"border-transparent text-zinc-500 hover:text-zinc-300"}`,children:[g.jsx(Lh,{className:"w-3 h-3"}),"Shader"]}),g.jsxs("button",{id:"tab-render",onClick:()=>b("render"),className:`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition border-b-2 ${S==="render"?"border-orange-500 text-white bg-zinc-900":"border-transparent text-zinc-500 hover:text-zinc-300"}`,children:[g.jsx(b_,{className:"w-3 h-3"}),"World"]}),g.jsxs("button",{id:"tab-slicer",onClick:()=>b("slicer"),className:`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition border-b-2 ${S==="slicer"?"border-orange-500 text-white bg-zinc-900":"border-transparent text-zinc-500 hover:text-zinc-300"}`,children:[g.jsx(gy,{className:"w-3 h-3"}),"Slicer"]})]}),g.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-zinc-900",children:[S==="transform"&&(H?g.jsxs("div",{className:"space-y-4 animate-fadeIn",children:[g.jsxs("div",{className:"border-b border-zinc-800 pb-2 mb-2",children:[g.jsx("div",{className:"text-[10px] font-bold text-orange-500 tracking-wide uppercase",children:"Active Selection"}),g.jsxs("div",{className:"text-sm font-semibold truncate text-white mt-1 flex items-center gap-2",children:[B(H.type),H.name]}),H.locked&&g.jsxs("div",{className:"text-[10px] text-orange-400 flex items-center gap-1 mt-1 font-mono",children:[g.jsx(x_,{className:"w-2.5 h-2.5"})," TRANSFORM LOCKED"]})]}),["position","rotation","scale"].map(A=>g.jsxs("div",{className:"space-y-1.5",children:[g.jsxs("div",{className:"text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center justify-between",children:[g.jsxs("span",{className:"flex items-center gap-1",children:[A==="position"&&g.jsx(__,{className:"w-2.5 h-2.5 text-zinc-500"}),A==="rotation"&&g.jsx(Cw,{className:"w-2.5 h-2.5 text-zinc-500"}),A==="scale"&&g.jsx(mw,{className:"w-2.5 h-2.5 text-zinc-500"}),A]}),g.jsx("span",{className:"text-[9px] font-mono lowercase opacity-50",children:A==="rotation"?"degrees":"units"})]}),g.jsx("div",{className:"grid grid-cols-3 gap-2",children:["x","y","z"].map(X=>{const ne=A==="scale"?.1:A==="rotation"?5:.25,L=A==="scale"?.05:A==="rotation"?-360:-15,Ee=A==="scale"?15:A==="rotation"?360:15,Re=X==="x"?"border-red-500/30":X==="y"?"border-emerald-500/30":"border-blue-500/30";return g.jsxs("div",{className:`flex flex-col bg-zinc-950 p-1.5 rounded border ${Re}`,children:[g.jsx("label",{className:"text-[8px] font-bold uppercase text-zinc-500 flex items-center justify-between px-0.5",children:g.jsx("span",{children:X})}),g.jsx("input",{id:`input-${A}-${X}`,type:"number",disabled:H.locked,step:ne,min:L,max:Ee,className:`w-full bg-transparent font-mono text-[11px] text-right mt-1 border-none focus:outline-none focus:ring-0 ${H.locked?"opacity-40 cursor-not-allowed":"text-zinc-200"}`,value:Math.round(H[A][X]*100)/100,onChange:Ve=>ve(H.id,A,X,parseFloat(Ve.target.value))}),g.jsx("input",{id:`slider-${A}-${X}`,type:"range",disabled:H.locked,step:ne,min:L,max:Ee,className:"w-full mt-1.5 accent-orange-500 cursor-pointer h-1 rounded bg-zinc-800 disabled:opacity-30",value:H[A][X],onChange:Ve=>ve(H.id,A,X,parseFloat(Ve.target.value))})]},X)})})]},A)),(H.type==="pointlight"||H.type==="directionallight")&&g.jsxs("div",{className:"space-y-2 bg-zinc-950 p-3 rounded border border-zinc-800/80",children:[g.jsx("div",{className:"text-[10px] font-bold text-zinc-400 tracking-wider uppercase",children:"Light Source Parameters"}),g.jsxs("div",{children:[g.jsxs("div",{className:"flex justify-between text-[10px] text-zinc-500 font-mono mb-1",children:[g.jsx("span",{children:"Intensity value:"}),g.jsxs("span",{className:"text-amber-400 font-bold",children:[H.intensity,"x"]})]}),g.jsx("input",{id:"input-light-intensity",type:"range",step:"0.1",min:"0",max:"8",className:"w-full accent-amber-400 bg-zinc-800 rounded h-1 cursor-pointer",value:H.intensity,onChange:A=>s(H.id,{intensity:parseFloat(A.target.value)})})]})]})]}):g.jsxs("div",{className:"h-40 flex flex-col items-center justify-center text-center p-4 bg-zinc-950/20 border border-zinc-800 border-dashed rounded text-zinc-500 animate-pulse",children:[g.jsx(p_,{className:"w-6 h-6 mb-2 text-zinc-600"}),g.jsxs("span",{className:"text-[11px] font-mono leading-relaxed",children:["No object selected.",g.jsx("br",{}),"Click on a shape inside the outliner or 3D viewport."]})]})),S==="material"&&(H?H.type!=="pointlight"&&H.type!=="directionallight"?g.jsxs("div",{className:"space-y-4 animate-fadeIn",children:[g.jsxs("div",{className:"border-b border-zinc-800 pb-2 mb-2",children:[g.jsx("div",{className:"text-[10px] font-bold text-orange-500 tracking-wide uppercase",children:"PBR Shader Nodes"}),g.jsxs("div",{className:"text-sm font-semibold truncate text-white mt-1 flex items-center gap-2",children:[g.jsx(Lh,{className:"w-3.5 h-3.5 text-zinc-400"}),H.name," Material"]})]}),g.jsxs("div",{className:"space-y-3 bg-zinc-950 p-3 rounded.5 border border-zinc-850",children:[g.jsxs("div",{className:"flex items-center justify-between",children:[g.jsx("label",{className:"text-[10px] font-bold text-zinc-400 uppercase tracking-wider",children:"Base Color"}),g.jsxs("div",{className:"flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded",children:[g.jsx("span",{className:"text-[10px] text-zinc-400 font-mono select-all",children:H.color}),g.jsx("input",{id:"picker-mat-color",type:"color",className:"w-5 h-5 border-none p-0 bg-transparent rounded cursor-pointer ring-0",value:H.color,onChange:A=>s(H.id,{color:A.target.value})})]})]}),g.jsxs("div",{className:"space-y-1",children:[g.jsxs("div",{className:"flex justify-between text-[10px] font-mono text-zinc-400",children:[g.jsx("span",{children:"Roughness:"}),g.jsx("span",{className:"text-zinc-500",children:H.roughness.toFixed(2)})]}),g.jsx("input",{id:"slider-mat-rough",type:"range",step:"0.02",min:"0",max:"1",className:"w-full accent-orange-500 cursor-pointer bg-zinc-800 rounded h-1",value:H.roughness,onChange:A=>s(H.id,{roughness:parseFloat(A.target.value)})}),g.jsxs("div",{className:"flex justify-between text-[8px] text-zinc-500",children:[g.jsx("span",{children:"Shiny Gloss (0.0)"}),g.jsx("span",{children:"Matte Chalk (1.0)"})]})]}),g.jsxs("div",{className:"space-y-1",children:[g.jsxs("div",{className:"flex justify-between text-[10px] font-mono text-zinc-400",children:[g.jsx("span",{children:"Metalness:"}),g.jsx("span",{className:"text-zinc-500",children:H.metalness.toFixed(2)})]}),g.jsx("input",{id:"slider-mat-metal",type:"range",step:"0.02",min:"0",max:"1",className:"w-full accent-orange-500 cursor-pointer bg-zinc-800 rounded h-1",value:H.metalness,onChange:A=>s(H.id,{metalness:parseFloat(A.target.value)})}),g.jsxs("div",{className:"flex justify-between text-[8px] text-zinc-500",children:[g.jsx("span",{children:"Plastic Dielectric (0.0)"}),g.jsx("span",{children:"Polished Heavy Gold (1.0)"})]})]}),g.jsxs("div",{className:"flex items-center justify-between border-t border-zinc-900 pt-2 mt-2",children:[g.jsxs("div",{className:"flex flex-col",children:[g.jsx("label",{className:"text-[10px] font-bold text-zinc-400 uppercase tracking-wider",children:"Emissive Glow"}),g.jsx("span",{className:"text-[8px] text-zinc-500 leading-normal",children:"Self illuminated emission"})]}),g.jsxs("div",{className:"flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded",children:[g.jsx("span",{className:"text-[10px] text-zinc-400 font-mono select-all",children:H.emissive}),g.jsx("input",{id:"picker-mat-emiss",type:"color",className:"w-5 h-5 border-none p-0 bg-transparent rounded cursor-pointer",value:H.emissive,onChange:A=>s(H.id,{emissive:A.target.value})})]})]}),g.jsxs("div",{className:"flex items-center justify-between border-t border-zinc-900 pt-2.5 mt-2",children:[g.jsxs("div",{className:"flex flex-col",children:[g.jsx("span",{className:"text-[10px] font-bold text-zinc-400 uppercase tracking-wider",children:"Wireframe View"}),g.jsx("span",{className:"text-[8px] text-zinc-500",children:"Render overlay skeletal mesh outline"})]}),g.jsx("input",{id:"checkbox-wireframe",type:"checkbox",className:"form-checkbox bg-zinc-900 accent-orange-500 border-zinc-700 rounded h-3.5 w-3.5",checked:H.wireframe,onChange:A=>s(H.id,{wireframe:A.target.checked})})]})]}),g.jsxs("div",{className:"space-y-2 border-t border-zinc-800 pt-4 mt-2",children:[g.jsxs("div",{className:"text-[10px] font-bold text-orange-500 tracking-wide uppercase flex items-center gap-1",children:[g.jsx(yi,{className:"w-3.5 h-3.5"}),"Gemini Shader Customizer"]}),g.jsx("p",{className:"text-[9px] text-zinc-500 leading-normal",children:"Describe the style of surface shading. Gemini will automatically map the appropriate metallic, color, glow, and roughness configurations."}),g.jsxs("div",{className:"flex flex-col gap-1.5",children:[g.jsx("textarea",{id:"ai-shading-prompt",value:z,onChange:A=>j(A.target.value),placeholder:"e.g. Scratched gold plate, Neon lava crust, Rusty copper, Translucent mirror glass...",className:"bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 hover:border-zinc-700 focus:border-orange-500 rounded p-2 focus:outline-none font-sans min-h-[50px] resize-none"}),g.jsx("button",{id:"btn-ai-generate-material",disabled:w||!z.trim(),onClick:ce,className:"bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white font-bold py-1.5 px-3 rounded text-[11px] flex items-center justify-center gap-1.5",children:w?g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"}),"Analyzing..."]}):g.jsxs(g.Fragment,{children:[g.jsx(yi,{className:"w-3 h-3"}),"Apply Shader Look"]})})]}),G&&g.jsxs("div",{className:"bg-zinc-950 border border-zinc-850 p-2.5 rounded text-[10px] text-zinc-400 font-sans leading-relaxed break-words mt-2",children:[g.jsx("div",{className:"font-bold text-[9px] text-orange-400/80 mb-0.5 font-mono",children:"Gemini Node explanation:"}),G]})]})]}):g.jsxs("div",{className:"h-40 flex flex-col items-center justify-center text-center p-4 text-zinc-500 border border-zinc-800 border-dashed rounded",children:[g.jsx(M_,{className:"w-6 h-6 mb-2 text-zinc-600"}),g.jsxs("span",{className:"text-[11px] font-mono leading-relaxed",children:["A lighting item is selected.",g.jsx("br",{}),"Light elements do not receive materials/shading."]})]}):g.jsxs("div",{className:"h-40 flex flex-col items-center justify-center text-center p-4 text-zinc-500 border border-zinc-800 border-dashed rounded",children:[g.jsx(Lh,{className:"w-6 h-6 mb-2 text-zinc-600"}),g.jsxs("span",{className:"text-[11px] font-mono leading-relaxed",children:["No object selected.",g.jsx("br",{}),"Choose a mesh in the scene to adjust material."]})]})),S==="render"&&g.jsxs("div",{className:"space-y-4 animate-fadeIn",children:[g.jsxs("div",{className:"border-b border-zinc-800 pb-2 mb-2",children:[g.jsx("div",{className:"text-[10px] font-bold text-orange-500 tracking-wide uppercase",children:"Environment & Render"}),g.jsx("div",{className:"text-sm font-semibold text-white mt-1",children:"World Settings"})]}),g.jsxs("div",{className:"space-y-3 bg-zinc-950 p-3 rounded.5 border border-zinc-850",children:[g.jsxs("div",{className:"flex items-center justify-between",children:[g.jsx("span",{className:"text-xs text-zinc-350",children:"Grid Axes Overlay"}),g.jsx("input",{id:"toggle-right-panel-grid",type:"checkbox",checked:c,onChange:A=>f(A.target.checked),className:"accent-orange-500 rounded text-orange-600 focus:ring-0 w-3.5 h-3.5"})]}),g.jsxs("div",{className:"flex items-center justify-between",children:[g.jsx("span",{className:"text-xs text-zinc-355",children:"Color RGB Axes"}),g.jsx("input",{id:"toggle-right-panel-axes",type:"checkbox",checked:p,onChange:A=>m(A.target.checked),className:"accent-orange-500 rounded text-orange-600 focus:ring-0 w-3.5 h-3.5"})]}),g.jsxs("div",{className:"flex items-center justify-between",children:[g.jsx("span",{className:"text-xs text-zinc-355",children:"Mesh Cast Shadows"}),g.jsx("input",{id:"toggle-right-panel-shadows",type:"checkbox",checked:h,onChange:A=>v(A.target.checked),className:"accent-orange-500 rounded text-orange-600 focus:ring-0 w-3.5 h-3.5"})]})]}),g.jsxs("div",{className:"bg-zinc-950/40 border border-zinc-800/80 p-3.5 rounded text-[10px] text-zinc-400 font-mono space-y-1.5",children:[g.jsxs("div",{className:"text-zinc-500 font-bold uppercase tracking-wider text-[9px] border-b border-zinc-900 pb-1 flex items-center gap-1.5 mb-1.5",children:[g.jsx(b_,{className:"w-3 h-3 text-zinc-600"})," Web3D Render Stats"]}),g.jsxs("div",{className:"flex justify-between",children:[g.jsx("span",{children:"Standard Shader:"}),g.jsx("span",{className:"text-zinc-300",children:"PBR MetallicRoughness"})]}),g.jsxs("div",{className:"flex justify-between",children:[g.jsx("span",{children:"AA Quality:"}),g.jsx("span",{className:"text-zinc-300",children:"FXAA MultiSampling"})]}),g.jsxs("div",{className:"flex justify-between",children:[g.jsx("span",{children:"Raycast Probe:"}),g.jsx("span",{className:"text-zinc-300",children:"GPU Octree Node"})]}),g.jsxs("div",{className:"flex justify-between",children:[g.jsx("span",{children:"Physics Bound:"}),g.jsx("span",{className:"text-zinc-300",children:"30x30 Floor Plane"})]})]})]}),S==="slicer"&&g.jsxs("div",{className:"space-y-4 animate-fadeIn",children:[g.jsxs("div",{className:"border-b border-zinc-800 pb-2 mb-2",children:[g.jsx("div",{className:"text-[10px] font-bold text-orange-500 tracking-wide uppercase",children:"3D Print Slicer Engine"}),g.jsx("div",{className:"text-sm font-semibold text-white mt-1",children:"G-code Slicing Node"})]}),g.jsxs("div",{className:"space-y-3 bg-zinc-950 p-3 rounded border border-zinc-850",children:[g.jsxs("div",{className:"space-y-1",children:[g.jsxs("div",{className:"flex justify-between text-[11px] text-zinc-400",children:[g.jsx("span",{children:"Layer Height:"}),g.jsxs("span",{className:"text-white font-mono",children:[Q.layerHeight.toFixed(2)," mm"]})]}),g.jsx("input",{id:"slider-slicer-layer",type:"range",min:"0.08",max:"0.40",step:"0.02",className:"w-full accent-orange-500 cursor-pointer h-1 rounded bg-zinc-800",value:Q.layerHeight,onChange:A=>Z(X=>({...X,layerHeight:parseFloat(A.target.value)}))}),g.jsxs("div",{className:"flex justify-between text-[8px] text-zinc-550",children:[g.jsx("span",{children:"Super Fine (0.08)"}),g.jsx("span",{children:"Draft Standard (0.40)"})]})]}),g.jsxs("div",{className:"space-y-1 pt-1",children:[g.jsxs("div",{className:"flex justify-between text-[11px] text-zinc-400",children:[g.jsx("span",{children:"Infill Density:"}),g.jsxs("span",{className:"text-white font-mono",children:[Q.infillDensity,"%"]})]}),g.jsx("input",{id:"slider-slicer-infill",type:"range",min:"0",max:"100",step:"5",className:"w-full accent-orange-500 cursor-pointer h-1 rounded bg-zinc-800",value:Q.infillDensity,onChange:A=>Z(X=>({...X,infillDensity:parseInt(A.target.value)}))}),g.jsxs("div",{className:"flex justify-between text-[8px] text-zinc-550",children:[g.jsx("span",{children:"Hollow (0%)"}),g.jsx("span",{children:"Solid (100%)"})]})]}),g.jsxs("div",{className:"flex items-center justify-between text-xs pt-1",children:[g.jsx("span",{className:"text-zinc-450 text-[11px]",children:"Infill Pattern:"}),g.jsxs("select",{id:"select-slicer-pattern",className:"bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-orange-500",value:Q.infillPattern,onChange:A=>Z(X=>({...X,infillPattern:A.target.value})),children:[g.jsx("option",{value:"grid",children:"Orthogonal Grid"}),g.jsx("option",{value:"lines",children:"Parallel Lines"}),g.jsx("option",{value:"concentric",children:"Concentric Loop"})]})]}),g.jsxs("div",{className:"flex items-center justify-between text-xs pt-1",children:[g.jsx("span",{className:"text-zinc-450 text-[11px]",children:"Wall Shell Count:"}),g.jsxs("div",{className:"flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-0.5 rounded",children:[g.jsx("button",{id:"btn-slicer-shell-minus",onClick:()=>Z(A=>({...A,shells:Math.max(1,A.shells-1)})),className:"px-1.5 py-0.5 hover:bg-zinc-800 rounded text-zinc-400",children:"-"}),g.jsx("span",{className:"text-[11px] font-mono text-white px-1 leading-none",children:Q.shells}),g.jsx("button",{id:"btn-slicer-shell-plus",onClick:()=>Z(A=>({...A,shells:Math.min(6,A.shells+1)})),className:"px-1.5 py-0.5 hover:bg-zinc-800 rounded text-zinc-400",children:"+"})]})]}),g.jsxs("div",{className:"border-t border-zinc-900 my-2 pt-2 grid grid-cols-2 gap-2 text-[10px]",children:[g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block",children:"Nozzle Temp"}),g.jsxs("div",{className:"flex items-center gap-1 mt-0.5",children:[g.jsx("input",{id:"input-slicer-nozzle",type:"number",className:"bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-center font-mono text-[11px] text-white w-14 focus:outline-none",value:Q.nozzleTemp,onChange:A=>Z(X=>({...X,nozzleTemp:parseInt(A.target.value)||200}))}),g.jsx("span",{className:"text-zinc-550",children:"°C"})]})]}),g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block",children:"Print Bed Temp"}),g.jsxs("div",{className:"flex items-center gap-1 mt-0.5",children:[g.jsx("input",{id:"input-slicer-bed",type:"number",className:"bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-center font-mono text-[11px] text-white w-14 focus:outline-none",value:Q.bedTemp,onChange:A=>Z(X=>({...X,bedTemp:parseInt(A.target.value)||60}))}),g.jsx("span",{className:"text-zinc-550",children:"°C"})]})]})]}),g.jsxs("div",{className:"grid grid-cols-2 gap-2 pb-1 text-[10px]",children:[g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block",children:"Print Speed"}),g.jsxs("div",{className:"flex items-center gap-1 mt-0.5",children:[g.jsx("input",{id:"input-slicer-speed",type:"number",className:"bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-center font-mono text-[11px] text-white w-14 focus:outline-none",value:Q.printSpeed,onChange:A=>Z(X=>({...X,printSpeed:parseInt(A.target.value)||50}))}),g.jsx("span",{className:"text-zinc-550",children:"mm/s"})]})]}),g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block",children:"Travel Speed"}),g.jsxs("div",{className:"flex items-center gap-1 mt-0.5",children:[g.jsx("input",{id:"input-slicer-travel",type:"number",className:"bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-center font-mono text-[11px] text-white w-14 focus:outline-none",value:Q.travelSpeed,onChange:A=>Z(X=>({...X,travelSpeed:parseInt(A.target.value)||100}))}),g.jsx("span",{className:"text-zinc-550",children:"mm/s"})]})]})]})]}),g.jsx("button",{id:"btn-slice-scene",disabled:D,onClick:()=>{k(!0),setTimeout(()=>{const A=$w(r,x,_,Q);W(A),y&&y(A.toolpathSegments),R(Math.max(0,A.stats.layerCount-1)),k(!1)},650)},className:`w-full py-2.5 rounded text-xs font-bold font-mono tracking-wider transition ${D?"bg-zinc-800 text-zinc-500 flex items-center justify-center gap-2":"bg-orange-600 text-white hover:bg-orange-500 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"}`,children:D?g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"w-3.5 h-3.5 rounded-full border-2 border-zinc-500 border-t-white animate-spin"}),"Slicing meshes..."]}):g.jsxs(g.Fragment,{children:[g.jsx(y_,{className:"w-4 h-4"}),"Slice Scene to G-code"]})}),ae&&g.jsxs("div",{className:"space-y-3.5 bg-zinc-950 p-3 rounded.5 border border-zinc-850 animate-fadeIn",children:[g.jsxs("div",{className:"text-[10px] font-bold text-orange-500 uppercase tracking-widest border-b border-zinc-900 pb-1 flex items-center gap-1.5",children:[g.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"}),"Slicing Successful"]}),g.jsxs("div",{className:"grid grid-cols-2 gap-3 text-[10px] font-mono leading-relaxed",children:[g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block font-sans",children:"Est. Print Time:"}),g.jsx("span",{className:"text-white font-bold block text-sm",children:ae.stats.estTime})]}),g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block font-sans",children:"Filament Weight:"}),g.jsxs("span",{className:"text-emerald-400 font-bold block text-sm",children:[ae.stats.filamentWeight," g"]})]}),g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block font-sans",children:"Filament Length:"}),g.jsxs("span",{className:"text-zinc-300 block",children:[ae.stats.filamentLength," m"]})]}),g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block font-sans",children:"Total Layers:"}),g.jsxs("span",{className:"text-zinc-300 block font-bold",children:[ae.stats.layerCount," layers"]})]})]}),g.jsxs("div",{className:"space-y-1.5 border-t border-zinc-900 pt-2.5 mt-2 text-[11px]",children:[g.jsxs("div",{className:"flex justify-between items-center",children:[g.jsx("span",{className:"text-zinc-400",children:"Layer Preview:"}),g.jsxs("span",{className:"text-white font-mono text-xs font-bold leading-none bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-850",children:[T!==null?T+1:0," / ",ae.stats.layerCount]})]}),g.jsx("input",{id:"slider-slicer-layer-preview",type:"range",min:"0",max:Math.max(0,ae.stats.layerCount-1),step:"1",className:"w-full accent-emerald-500 cursor-pointer h-1 rounded bg-zinc-800",value:T!==null?T:0,onChange:A=>R(parseInt(A.target.value))}),g.jsxs("div",{className:"flex justify-between text-[8px] text-zinc-500 font-mono",children:[g.jsx("span",{children:"Bed (Layer 1)"}),g.jsxs("span",{children:["Apex (Z: ",(ae.stats.layerCount*Q.layerHeight).toFixed(1),"mm)"]})]})]}),g.jsxs("div",{className:"flex gap-2",children:[g.jsxs("button",{id:"btn-download-gcode",onClick:()=>{const A=new Blob([ae.gcodeText],{type:"text/plain"}),X=URL.createObjectURL(A),ne=document.createElement("a");ne.href=X,ne.download=`slicing_blender_scene_${Date.now()}.gcode`,ne.click(),URL.revokeObjectURL(X)},className:"flex-1 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-750 text-white font-sans text-[11px] py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition cursor-pointer",children:[g.jsx(y_,{className:"w-3.5 h-3.5 text-orange-400"}),"Save .GCODE"]}),g.jsx("button",{id:"btn-toggle-gcode-terminal",onClick:()=>J(!ie),className:`px-2.5 py-1.5 border rounded font-sans text-[11px] transition cursor-pointer ${ie?"bg-orange-650/15 border-orange-500 text-orange-400":"bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white"}`,title:"Inspect G-code terminal instructions",children:g.jsx(sw,{className:"w-3.5 h-3.5"})})]}),ie&&g.jsxs("div",{className:"border border-zinc-850 rounded bg-zinc-950 p-2 font-mono text-[9px] text-zinc-450 space-y-1 mt-1.5",children:[g.jsxs("div",{className:"text-[8px] text-zinc-550 uppercase tracking-widest border-b border-zinc-900 pb-1 mb-1.5 flex justify-between",children:[g.jsx("span",{children:"G-code terminal"}),g.jsx("span",{children:"PLA Profiling"})]}),g.jsxs("div",{className:"max-h-36 overflow-y-auto scrollbar-thin space-y-0.5 select-all font-sans leading-relaxed text-zinc-350 pr-1",children:[ae.gcodeText.split(`
`).slice(0,100).map((A,X)=>g.jsxs("div",{className:"flex gap-2",children:[g.jsx("span",{className:"text-zinc-650 font-mono w-5 text-right shrink-0",children:X+1}),g.jsx("span",{className:"font-mono text-zinc-350 break-all",children:A})]},X)),ae.gcodeText.split(`
`).length>100&&g.jsxs("div",{className:"text-center py-1 text-zinc-650 italic text-[7.5px] font-sans",children:["... [+ ",ae.gcodeText.split(`
`).length-100," trailing lines omitted ...]"]})]})]})]})]})]})]})]})}function tC({currentFrame:r,setCurrentFrame:e,isPlaying:i,setIsPlaying:s,keyframes:l,onInsertKeyframe:c,onClearObjectKeyframes:f,onClearAllKeyframes:p,selectedObjectId:m,selectedObject:h}){const v=Oe.useRef(null);Oe.useEffect(()=>(i?v.current=setInterval(()=>{e(T=>T>=100?0:T+1)},60):v.current&&clearInterval(v.current),()=>{v.current&&clearInterval(v.current)}),[i,e]);const _=l.filter(T=>T.objectId===m).map(T=>T.frame);new Set(_);const x=()=>{s(!1),e(Math.max(0,r-1))},y=()=>{s(!1),e(Math.min(100,r+1))};return g.jsxs("div",{className:"bg-zinc-950 border-t border-zinc-800 text-zinc-300 font-sans p-3 flex flex-col gap-2 relative select-none",children:[g.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 px-1.5",children:[g.jsxs("div",{className:"flex items-center gap-1.5",children:[g.jsx("button",{id:"btn-playback-start",onClick:()=>{s(!1),e(0)},className:"p-1.5 hover:text-white hover:bg-zinc-800 rounded transition text-zinc-500",title:"Jump to Start",children:g.jsx(Uw,{className:"w-3.5 h-3.5"})}),g.jsx("button",{id:"btn-playback-prev",onClick:x,className:"p-1.5 hover:text-white hover:bg-zinc-800 rounded transition text-zinc-500",title:"Minus 1 Frame (Arrow Left)",children:g.jsx(om,{className:"w-3.5 h-3.5"})}),g.jsx("button",{id:"btn-playback-toggle",onClick:()=>s(!i),className:`p-2 rounded-full transition ${i?"bg-orange-500 text-white hover:bg-orange-400":"bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`,title:i?"Pause Playback":"Play Playback",children:i?g.jsx(my,{className:"w-4 h-4 fill-white text-transparent"}):g.jsx(zp,{className:"w-4 h-4 fill-zinc-200 text-transparent translate-x-0.5"})}),g.jsx("button",{id:"btn-playback-next",onClick:y,className:"p-1.5 hover:text-white hover:bg-zinc-800 rounded transition text-zinc-500",title:"Plus 1 Frame (Arrow Right)",children:g.jsx(dy,{className:"w-3.5 h-3.5"})}),g.jsx("button",{id:"btn-playback-end",onClick:()=>{s(!1),e(100)},className:"p-1.5 hover:text-white hover:bg-zinc-800 rounded transition text-zinc-500",title:"Jump to End",children:g.jsx(Pw,{className:"w-3.5 h-3.5"})}),g.jsx("div",{className:"h-4 w-px bg-zinc-800 ml-2"}),g.jsxs("div",{className:"flex items-center gap-1 text-[11px] font-mono select-none px-2 py-1 bg-zinc-900 rounded border border-zinc-850",children:[g.jsx(hy,{className:"w-3 h-3 text-zinc-500"}),g.jsx("span",{className:"text-zinc-500",children:"Frame:"}),g.jsx("span",{className:"text-orange-500 font-bold",children:r}),g.jsx("span",{className:"text-zinc-650",children:"/ 100"})]})]}),g.jsx("div",{className:"text-[11px] font-mono text-zinc-500 hidden sm:block truncate max-w-[200px]",children:h?g.jsxs("span",{className:"text-zinc-400",children:["Animating: ",g.jsx("strong",{className:"text-zinc-200",children:h.name})]}):"Dopesheet inactive (select object)"}),g.jsxs("div",{className:"flex items-center gap-1.5",children:[g.jsxs("button",{id:"btn-insert-keyframe",disabled:!m,onClick:c,className:"bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-600 hover:bg-orange-500 disabled:cursor-not-allowed transition text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm",title:"Record current position/scale/rotation values at this playhead",children:[g.jsx(lw,{className:"w-3.5 h-3.5"}),"Insert Keyframe"]}),g.jsxs("button",{id:"btn-clear-object-keyframes",disabled:!m,onClick:f,className:"bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-400 hover:text-red-400 transition border border-zinc-800 px-2 py-1 rounded text-[11px] flex items-center gap-1",title:"Delete anim keyframes for this chosen object",children:[g.jsx(Du,{className:"w-3 h-3"}),"Clear Selected Trk"]}),g.jsxs("button",{id:"btn-clear-all-keyframes",disabled:l.length===0,onClick:p,className:"bg-zinc-900 hover:bg-red-955/35 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-500 hover:text-red-400 transition border border-zinc-800 px-2 py-1 rounded text-[11px] flex items-center gap-1",title:"Reset whole project timeline",children:[g.jsx(Nu,{className:"w-3 h-3"}),"Clear All"]})]})]}),g.jsxs("div",{className:"relative mt-1 px-1",children:[g.jsx("div",{className:"flex justify-between px-3 text-[9px] font-mono text-zinc-650 h-3 border-b border-zinc-900 select-none pointer-events-none mb-1",children:[0,10,20,30,40,50,60,70,80,90,100].map(T=>g.jsx("div",{className:"flex flex-col items-center relative",children:g.jsx("span",{className:"absolute -top-1 font-mono text-[8px]",children:T})},T))}),g.jsxs("div",{className:"relative h-6 bg-zinc-900/60 rounded border border-zinc-850 flex items-center overflow-visible shadow-inner",children:[g.jsx("input",{id:"timeline-slider-head",type:"range",min:"0",max:"100",className:"absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-20",value:r,onChange:T=>{s(!1),e(parseInt(T.target.value))}}),g.jsx("div",{className:"absolute inset-x-3 inset-y-0 pointer-events-none overflow-visible z-10",children:l.map(T=>{const R=T.frame,S=T.objectId===m;return g.jsx("div",{className:`absolute top-1/2 -ml-1.5 w-3 h-3 border rotate-45 transform -translate-y-1/2 transition ${S?"bg-yellow-400 border-yellow-600 scale-110 z-10 shadow-sm":"bg-zinc-700 border-zinc-600 opacity-30"}`,style:{left:`${R}%`},title:`Keyframe at frame ${T.frame} for ${T.objectId}`},T.id)})}),g.jsx("div",{className:"absolute left-0 top-0 bottom-0 bg-orange-500/5 rounded-l pointer-events-none border-r border-orange-500/20",style:{width:`${r}%`}}),g.jsx("div",{className:"absolute top-0 bottom-0 w-0 border-l-2 border-orange-500 pointer-events-none z-10 transition-all duration-75 relative",style:{left:`calc(${r}% - 1px)`},children:g.jsx("div",{className:"absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-orange-500 border border-white shadow flex items-center justify-center",children:g.jsx("div",{className:"w-1 h-1 rounded-full bg-white animate-ping"})})})]})]})]})}const nC="modulepreload",iC=function(r){return"/"+r},T_={},aC=function(e,i,s){let l=Promise.resolve();if(i&&i.length>0){let f=function(h){return Promise.all(h.map(v=>Promise.resolve(v).then(_=>({status:"fulfilled",value:_}),_=>({status:"rejected",reason:_}))))};document.getElementsByTagName("link");const p=document.querySelector("meta[property=csp-nonce]"),m=(p==null?void 0:p.nonce)||(p==null?void 0:p.getAttribute("nonce"));l=f(i.map(h=>{if(h=iC(h),h in T_)return;T_[h]=!0;const v=h.endsWith(".css"),_=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${_}`))return;const x=document.createElement("link");if(x.rel=v?"stylesheet":nC,v||(x.as="script"),x.crossOrigin="",x.href=h,m&&x.setAttribute("nonce",m),document.head.appendChild(x),v)return new Promise((y,T)=>{x.addEventListener("load",y),x.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${h}`)))})}))}function c(f){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=f,window.dispatchEvent(p),!p.defaultPrevented)throw f}return l.then(f=>{for(const p of f||[])p.status==="rejected"&&c(p.reason);return e().catch(c)})};function sC({sceneObjects:r,onApplyAIChanges:e,isOpen:i,setIsOpen:s,wsMessages:l=[],onSendWSMessage:c,myProfile:f,wsConnected:p=!1}){const[m,h]=Oe.useState(""),[v,_]=Oe.useState(!0),[x,y]=Oe.useState([{id:"welc-msg",sender:"system",text:"Welcome to Blender Web Copilot. I can edit this scene using natural language! Describe what you want me to construct or transform on the grid.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),[T,R]=Oe.useState(!1),[S,b]=Oe.useState(""),[C,I]=Oe.useState([]),F=Oe.useRef(null);Oe.useEffect(()=>{var O;(O=F.current)==null||O.scrollIntoView({behavior:"smooth"})},[x,S]),Oe.useEffect(()=>{if(l&&l.length>0){const O=l[l.length-1];y(G=>{if(G.some(Z=>Z.id===O.id))return G;let V="user",Q="Designer";return O.sender==="system"?(V="system",Q="System Log"):O.sender==="assistant"?(V="assistant",Q="Gemini Copilot"):(V="user",Q=O.senderName||"Designer"),[...G,{id:O.id,sender:V,senderName:Q,senderColor:O.senderColor,text:O.text,timestamp:O.timestamp||new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]})}},[l]);const q=[{label:"Solar System Orbit",prompt:"Create a central yellow sun light and three orbiting planets at varying scales"},{label:"Pine Trees Forrest",prompt:"Add 4 green pine trees (brown cylinder trunks with green cone foliage) scattered on the floor grid"},{label:"Futuristic Cyber Towers",prompt:"Make 5 tall neon purple columns and floating orange glowing spheres"},{label:"Symmetric Quad Pillars",prompt:"Erect 4 gray stone pillars in a perfect square grid matching X/Z coordinates with standard ground plane"}],z=async O=>{if(!O.trim()||T)return;I(ae=>[...ae,[...r]]);const G={id:"ai-usr-"+Math.random().toString(),sender:"user",senderName:(f==null?void 0:f.name)||"Designer",senderColor:f==null?void 0:f.color,text:O,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};y(ae=>[...ae,G]),h(""),R(!0),b("Analyzing viewport hierarchy...");const V=["Translating natural language dimensions...","Resolving standard ThreeJS materials parameters...","Configuring PBR shader Base Color and metalness values...","Assembling commands array nodes..."];let Q=0;const Z=setInterval(()=>{Q<V.length&&(b(V[Q]),Q++)},450);try{const ae=r.map(k=>`${k.name} (${k.type} at [${k.position.x}, ${k.position.y}, ${k.position.z}])`).join(", ")||"Nothing but grid",W=await fetch("/api/gemini/command",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:O,currentSceneDescription:ae})});if(clearInterval(Z),!W.ok)throw new Error("Generative server parsing error.");const D=await W.json();if(D&&D.commands){const{applyAICopilotCommand:k}=await aC(async()=>{const{applyAICopilotCommand:H}=await Promise.resolve().then(()=>N3);return{applyAICopilotCommand:H}},void 0);let ie=[...r];D.commands.forEach(H=>{ie=k(ie,H)}),e(ie);const J={id:"ai-res-"+Math.random().toString(),sender:"assistant",senderName:"Gemini Copilot",text:D.explanation||"Your scene elements have been successfully updated!",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),commandsAppliedCount:D.commands.length};y(H=>[...H,J])}else throw new Error("Malformed JSON received from model endpoint.")}catch(ae){clearInterval(Z),console.error(ae);const W={id:"ai-err-"+Math.random().toString(),sender:"system",senderName:"System Log",text:`Error building mesh: ${ae.message||"Failed to reach backend."}. Check GEMINI_API_KEY.`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};y(D=>[...D,W])}finally{R(!1),b("")}},j=O=>{O.preventDefault();const G=m.trim();if(G)if(v)c&&c(`[AI Command] ${G}`),z(G);else{if(c)c(G);else{const V={id:"local-chat-"+Math.random().toString(),sender:"user",senderName:(f==null?void 0:f.name)||"Designer",senderColor:(f==null?void 0:f.color)||"#f97316",text:G,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};y(Q=>[...Q,V])}h("")}},w=()=>{if(C.length===0)return;const O=C[C.length-1];e(O),I(V=>V.slice(0,-1));const G={id:"undo-msg-"+Math.random().toString(),sender:"system",senderName:"System Log",text:"System: AI operation rolled back successfully.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};y(V=>[...V,G])};return g.jsxs("div",{className:`h-full flex bg-zinc-900 text-zinc-300 border-r border-zinc-800 transition-all duration-300 relative select-none overflow-hidden flex-col ${i?"w-80":"w-12"}`,children:[g.jsx("div",{className:"bg-zinc-950 h-10 px-3.5 border-b border-zinc-800 flex items-center justify-between z-10",children:i?g.jsxs(g.Fragment,{children:[g.jsxs("span",{className:"flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-500 font-sans",children:[g.jsx(yi,{className:"w-4 h-4 text-orange-500 animate-pulse"}),"Gemini 3D Copilot"]}),g.jsxs("div",{className:"flex items-center gap-1",children:[C.length>0&&g.jsx("button",{id:"btn-undo-ai-copilot",onClick:w,className:"p-1 hover:bg-zinc-800 hover:text-white rounded transition text-zinc-400",title:"Undo previous AI modeling action",children:g.jsx(Ww,{className:"w-3.5 h-3.5"})}),g.jsx("button",{id:"btn-collapse-copilot",onClick:()=>s(!1),className:"p-1 hover:bg-zinc-800 rounded transition text-zinc-400",title:"Collapse Sidebar",children:g.jsx(om,{className:"w-4 h-4"})})]})]}):g.jsx("button",{id:"btn-expand-copilot",onClick:()=>s(!0),className:"w-full h-full flex items-center justify-center text-zinc-400 hover:text-orange-500 transition",title:"Expand AI Assistant Panel",children:g.jsx(yi,{className:"w-4 h-4 text-orange-500 animate-bounce"})})}),i&&g.jsxs("div",{className:"flex-1 flex flex-col min-h-0",children:[g.jsxs("div",{className:"px-3.5 py-1.5 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between text-[10px]",children:[g.jsxs("div",{className:"flex items-center gap-1.5",children:[g.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${p?"bg-emerald-500 animate-ping":"bg-red-500"}`}),g.jsx("span",{className:"text-zinc-400 font-mono",children:p?"Collaborative Online":"Offline / Local Save"})]}),f&&g.jsx("span",{className:"font-bold px-1.5 py-0.5 rounded text-[9px] uppercase font-mono",style:{backgroundColor:`${f.color}25`,color:f.color,border:`1px solid ${f.color}40`},children:f.name})]}),g.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-900/40 scrollbar-thin",children:[x.map(O=>g.jsxs("div",{className:`flex flex-col max-w-[90%] rounded p-2.5 text-xs ${O.sender==="user"?"bg-zinc-950 border border-zinc-850 text-zinc-200 self-end ml-auto":O.sender==="system"?"bg-zinc-950/40 border border-zinc-850/80 text-zinc-400 font-mono italic":"bg-orange-950/10 border border-orange-550/15 text-orange-200 self-start"}`,children:[g.jsxs("div",{className:"flex items-center justify-between gap-4 border-b border-zinc-900/50 pb-1 mb-1 opacity-50 text-[9px] font-mono",children:[g.jsx("span",{className:"uppercase font-bold tracking-wider",style:{color:O.senderColor||void 0},children:O.sender==="user"?O.senderName||"Designer":O.sender==="system"?"System Log":"Gemini Copilot"}),g.jsx("span",{children:O.timestamp})]}),g.jsx("p",{className:"leading-relaxed whitespace-pre-wrap",children:O.text}),O.commandsAppliedCount!==void 0&&g.jsxs("div",{className:"mt-2 text-[9px] uppercase font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-550/30 py-0.5 px-2 rounded inline-block",children:["✓ ",O.commandsAppliedCount," shapes generated"]})]},O.id)),T&&g.jsxs("div",{className:"flex flex-col bg-zinc-950 p-3 rounded text-xs gap-2 self-start max-w-[85%] border border-orange-550/10",children:[g.jsxs("div",{className:"flex items-center gap-2",children:[g.jsx("div",{className:"w-3.5 h-3.5 rounded-full border-2 border-orange-550 border-t-transparent animate-spin"}),g.jsx("span",{className:"font-bold text-[9px] uppercase font-mono text-orange-400 tracking-wider",children:"Assistant Rendering Scene"})]}),g.jsxs("div",{className:"text-[10px] text-zinc-500 font-mono truncate",children:[S,"..."]})]}),g.jsx("div",{ref:F})]}),g.jsxs("div",{className:"p-3 border-t border-zinc-800/80 bg-zinc-950",children:[g.jsxs("div",{className:"text-[9px] uppercase tracking-wider font-bold mb-2 text-zinc-500 flex items-center gap-1.5 font-sans",children:[g.jsx(Hw,{className:"w-3 h-3 text-orange-500"})," Quick Modeling Prompts"]}),g.jsx("div",{className:"grid grid-cols-1 gap-1.5 font-sans",children:q.map((O,G)=>g.jsx("button",{id:`btn-preset-${G}`,disabled:T,onClick:()=>{_(!0),c&&c(`[AI Command] ${O.prompt}`),z(O.prompt)},className:"w-full text-left bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700/80 disabled:opacity-40 rounded py-1.5 px-2 text-[10px] rounded border border-zinc-800 transition text-zinc-350 truncate leading-snug",title:O.prompt,children:O.label},G))})]}),g.jsxs("form",{onSubmit:j,className:"p-3 border-t border-zinc-800 flex flex-col gap-2 bg-zinc-900/60",children:[g.jsxs("div",{className:"flex items-center justify-between text-[10px] bg-zinc-950 p-1.5 rounded border border-zinc-850/60",children:[g.jsxs("span",{className:"text-zinc-500 select-none flex items-center gap-1",children:[g.jsx(Zw,{className:"w-3 h-3 text-zinc-500"})," Mode context:"]}),g.jsxs("div",{className:"flex items-center gap-2",children:[g.jsx("button",{id:"tab-mode-chat",type:"button",onClick:()=>_(!1),className:`px-2 py-0.5 rounded transition ${v?"text-zinc-500 hover:text-zinc-300":"bg-zinc-800 text-white font-bold"}`,children:"Room Chat"}),g.jsxs("button",{id:"tab-mode-ai",type:"button",onClick:()=>_(!0),className:`px-2 py-0.5 rounded transition flex items-center gap-1 ${v?"bg-orange-950/40 text-orange-400 border border-orange-500/15 font-bold":"text-zinc-500 hover:text-zinc-300"}`,children:[g.jsx(yi,{className:"w-2.5 h-2.5"})," Prompt AI"]})]})]}),g.jsxs("div",{className:"flex items-center gap-2",children:[g.jsx("input",{id:"ai-copilot-chat-input",type:"text",className:"flex-grow bg-zinc-950 hover:border-zinc-700 focus:border-orange-500 text-xs text-zinc-200 p-2 border border-zinc-800 rounded focus:outline-none placeholder-zinc-650",value:m,onChange:O=>h(O.target.value),placeholder:v?"e.g. Generate 5 red spheres floating...":"Type chat to other active editors...",disabled:T}),g.jsx("button",{id:"btn-send-copilot-chat",type:"submit",disabled:T||!m.trim(),className:`transition text-white hover:text-white p-2 rounded focus:outline-none flex items-center justify-center shrink-0 shadow-sm ${v?"bg-orange-650 hover:bg-orange-550":"bg-zinc-800 hover:bg-zinc-750"}`,children:g.jsx(Dw,{className:"w-4 h-4 fill-transparent"})})]})]})]})]})}const Zr={video:"#f97316",audio:"#06b6d4",effect:"#8b5cf6",text:"#ec4899"};function rC({sceneObjects:r,keyframes:e,currentFrame:i,setCurrentFrame:s,isPlaying:l,setIsPlaying:c}){const[f,p]=Oe.useState([{id:"clip-seq-ambient-audio",name:"Epic Space Synths Loop",type:"audio",track:1,startFrame:0,duration:100,color:Zr.audio,opacity:1,filter:"none",volume:.6},{id:"clip-seq-background-effect",name:"Vaporwave Pink Grading",type:"effect",track:3,startFrame:45,duration:55,color:Zr.effect,opacity:.45,filter:"vaporwave"},{id:"clip-seq-viewport-video",name:"Viewport Camera Orbit",type:"video",track:2,startFrame:10,duration:75,color:Zr.video,opacity:1,filter:"none"},{id:"clip-seq-sub-title-intro",name:"Opening Captions",type:"text",track:4,startFrame:15,duration:40,color:Zr.text,opacity:1,filter:"none",textOverlay:"CRITICAL COLLISION CORRECTION: 3D ENGINES INITIALIZED"},{id:"clip-seq-sub-title-end",name:"Ending Alert Tags",type:"text",track:4,startFrame:65,duration:35,color:Zr.text,opacity:1,filter:"none",textOverlay:"STABLE ORBIT ATTAINED. TELEMETRY LOCK CONFIRMED"}]),[m,h]=Oe.useState("clip-seq-viewport-video"),[v,_]=Oe.useState(!1),[x,y]=Oe.useState(0),[T,R]=Oe.useState(!1),[S,b]=Oe.useState("blender_web_render_movie.webm"),[C,I]=Oe.useState("timeline"),[F,q]=Oe.useState([{id:"sb-1",frame:10,title:"Establish Wide Orbit",notes:"Establishment wide isometric perspective. 3D objects initialize drift. Space synths begin ascending loop.",cameraCue:"Isometric Wide Angle"},{id:"sb-2",frame:45,title:"Vaporwave Transition Beat",notes:"Cinematic vaporwave tint triggers. Background turns neon pink-purple. Major speed keyframes activate.",cameraCue:"Medium Tracking Shot"},{id:"sb-3",frame:70,title:"Engine Stability Check",notes:"Sub-captions indicate telemetry lock. Object colors shift to warm emerald green as stability is achieved.",cameraCue:"Cinematic Low Angle"},{id:"sb-4",frame:95,title:"Settling Down Crane Out",notes:"Rocket coordinates reach target. Audio synth fades out into stable end beat.",cameraCue:"Crane Shot Out"}]),z=()=>{if(F.some(X=>X.frame===i)){alert(`A storyboard beat at Frame ${i} already exists! Use a different playhead position.`);return}const A={id:"sb-custom-"+ni(),frame:i,title:`Beat Frame ${i}`,notes:"Add specific director scripts or model cues for this video sequence.",cameraCue:"Isometric Wide Angle"};q(X=>[...X,A].sort((ne,L)=>ne.frame-L.frame))},j=(A,X)=>{q(ne=>ne.map(L=>L.id===A?{...L,...X}:L))},w=A=>{q(X=>X.filter(ne=>ne.id!==A))},O=()=>{const A=new Set;f.forEach(L=>{A.add(L.startFrame),L.startFrame+L.duration<=100&&A.add(Math.min(100,L.startFrame+L.duration-1))}),A.size===0&&(A.add(0),A.add(50));const ne=Array.from(A).sort((L,Ee)=>L-Ee).map((L,Ee)=>{const Re=f.filter(ze=>L>=ze.startFrame&&L<ze.startFrame+ze.duration),Ve=Re.find(ze=>ze.type==="video"),ke=Re.find(ze=>ze.type==="effect"),Ze=Re.find(ze=>ze.type==="text");let at=`Sequence Shot ${Ee+1}`,qe="Automatic scene boundary detection.",lt="Isometric Wide Angle";return Ve&&Ze?(at="Action with Caption",qe=`Viewport video '${Ve.name}' active with caption overlays: "${Ze.textOverlay}".`,lt="Medium Tracking Shot"):Ve?(at="3D Viewport Action",qe=`Focusing on render objects loop: ${r.length} active shapes.`,lt="Isometric Wide Angle"):Ze?(at="Intertitle Caption",qe=`Full-width subtitling display: "${Ze.textOverlay}".`,lt="Cinematic Low Angle"):ke&&(at="LUT Shift Transition",qe=`Dramatic grading shift using post-process '${ke.filter}' map.`,lt="Crane Shot Out"),{id:"sb-auto-"+ni()+"-"+L,frame:L,title:at,notes:qe,cameraCue:lt}});q(ne)},G=Oe.useRef(null),V=Oe.useRef(null),Q=Oe.useRef(null),Z=Oe.useRef(null),ae=Oe.useRef(null);Oe.useEffect(()=>(l?ae.current=setInterval(()=>{s(A=>A>=100?0:A+1)},60):ae.current&&clearInterval(ae.current),()=>{ae.current&&clearInterval(ae.current)}),[l,s]);const W=()=>{G.current||(G.current=new(window.AudioContext||window.webkitAudioContext))},D=f.find(A=>A.id===m);Oe.useEffect(()=>{if(l)try{if(W(),G.current){G.current.state==="suspended"&&G.current.resume();const A=f.find(X=>X.type==="audio"&&i>=X.startFrame&&i<X.startFrame+X.duration);if(A){V.current&&(V.current.stop(),V.current.disconnect());const X=G.current.createOscillator(),ne=G.current.createGain(),L=[130.81,146.83,164.81,196,220,261.63,293.66,329.63,392,440],Ee=Math.floor(i/10%L.length);X.frequency.setValueAtTime(L[Ee]||220,G.current.currentTime),X.type="sawtooth";const Re=A.volume!==void 0?A.volume:.5;ne.gain.setValueAtTime(Re*.15,G.current.currentTime),X.connect(ne),ne.connect(G.current.destination),X.start(),V.current=X,Q.current=ne}}}catch(A){console.warn("WebAudio synthesizer feedback could not start:",A)}else if(V.current){try{V.current.stop(),V.current.disconnect()}catch{}V.current=null}return()=>{if(V.current)try{V.current.stop(),V.current.disconnect()}catch{}}},[l,i,f]),Oe.useEffect(()=>{ie(i)},[i,r,e,f]);const k=(A,X,ne,L,Ee,Re,Ve,ke)=>{const Ze=L*Math.PI/180,at=Ee*Math.PI/180;let qe=A*Math.cos(Ze)-ne*Math.sin(Ze),lt=A*Math.sin(Ze)+ne*Math.cos(Ze),ze=X*Math.cos(at)-lt*Math.sin(at),gt=X*Math.sin(at)+lt*Math.cos(at);const te=8,vt=te/(te+gt);return{x:Re+qe*ke*vt,y:Ve-ze*ke*vt,z:gt}},ie=(A,X)=>{const ne=Z.current,L=X||(ne==null?void 0:ne.getContext("2d"));if(!L||!ne&&!X)return;const Ee=ne?ne.width:480,Re=ne?ne.height:270,Ve=f.filter(ze=>A>=ze.startFrame&&A<ze.startFrame+ze.duration),ke=Ve.find(ze=>ze.type==="effect"),Ze=Ve.find(ze=>ze.type==="video"),at=Ve.find(ze=>ze.type==="text"),qe=ke?ke.filter:Ze?Ze.filter:"none";if(L.clearRect(0,0,Ee,Re),ke&&ke.type==="effect"){const ze=L.createLinearGradient(0,0,Ee,Re);ke.filter==="vaporwave"?(ze.addColorStop(0,"#1e1b4b"),ze.addColorStop(1,"#ec4899")):ke.filter==="cyberpunk"?(ze.addColorStop(0,"#090514"),ze.addColorStop(1,"#06b6d4")):ke.filter==="sepia"?(ze.addColorStop(0,"#2c1d11"),ze.addColorStop(1,"#7c552c")):(ze.addColorStop(0,"#18181b"),ze.addColorStop(1,"#27272a")),L.fillStyle=ze}else L.fillStyle="#111116";L.fillRect(0,0,Ee,Re),L.strokeStyle="rgba(63, 63, 70, 0.25)",L.lineWidth=1;const lt=20;for(let ze=0;ze<Ee;ze+=lt)L.beginPath(),L.moveTo(ze,0),L.lineTo(ze,Re),L.stroke();for(let ze=0;ze<Re;ze+=lt)L.beginPath(),L.moveTo(0,ze),L.lineTo(Ee,ze),L.stroke();if(Ze){L.save();const ze=Ee/2,gt=Re/2+10,te=55;L.strokeStyle="rgba(249, 115, 22, 0.15)",L.lineWidth=1;const vt=4;for(let E=-vt;E<=vt;E++){const K=k(-vt,0,E,45,30,ze,gt,te),ue=k(vt,0,E,45,30,ze,gt,te);L.beginPath(),L.moveTo(K.x,K.y),L.lineTo(ue.x,ue.y),L.stroke();const he=k(E,0,-vt,45,30,ze,gt,te),Me=k(E,0,vt,45,30,ze,gt,te);L.beginPath(),L.moveTo(he.x,he.y),L.lineTo(Me.x,Me.y),L.stroke()}const nt=k(0,0,0,45,30,ze,gt,te),pt=k(1.5,0,0,45,30,ze,gt,te);L.strokeStyle="#ef4444",L.lineWidth=2,L.beginPath(),L.moveTo(nt.x,nt.y),L.lineTo(pt.x,pt.y),L.stroke();const Pe=k(0,0,1.5,45,30,ze,gt,te);L.strokeStyle="#3b82f6",L.beginPath(),L.moveTo(nt.x,nt.y),L.lineTo(Pe.x,Pe.y),L.stroke();const kt=k(0,1.5,0,45,30,ze,gt,te);L.strokeStyle="#10b981",L.beginPath(),L.moveTo(nt.x,nt.y),L.lineTo(kt.x,kt.y),L.stroke(),r.map(E=>{const K={position:E.position,rotation:E.rotation,scale:E.scale},ue=ku(E.id,A,e,K),he=k(ue.position.x,ue.position.y,ue.position.z,45,30,ze,gt,te);return{object:E,interpolated:ue,screenPos:he,depthZ:he.z}}).sort((E,K)=>K.depthZ-E.depthZ).forEach(({object:E,interpolated:K,screenPos:ue})=>{if(E.visible){if(E.type==="pointlight"||E.type==="directionallight"){L.beginPath(),L.arc(ue.x,ue.y,7,0,Math.PI*2),L.fillStyle="#fef08a",L.fill(),L.strokeStyle="#eab308",L.lineWidth=1.5,L.stroke(),L.strokeStyle="rgba(253, 224, 71, 0.45)";for(let he=0;he<360;he+=45){const Me=he*Math.PI/180;L.beginPath(),L.moveTo(ue.x+Math.cos(Me)*10,ue.y+Math.sin(Me)*10),L.lineTo(ue.x+Math.cos(Me)*18,ue.y+Math.sin(Me)*18),L.stroke()}}else if(E.type==="plane"){const he=K.scale.x*1.5,Me=K.scale.z*1.5,Ne=k(K.position.x-he,K.position.y,K.position.z-Me,45,30,ze,gt,te),de=k(K.position.x+he,K.position.y,K.position.z-Me,45,30,ze,gt,te),be=k(K.position.x+he,K.position.y,K.position.z+Me,45,30,ze,gt,te),Le=k(K.position.x-he,K.position.y,K.position.z+Me,45,30,ze,gt,te);L.beginPath(),L.moveTo(Ne.x,Ne.y),L.lineTo(de.x,de.y),L.lineTo(be.x,be.y),L.lineTo(Le.x,Le.y),L.closePath(),L.fillStyle=E.wireframe?"transparent":E.color+"55",L.fill(),L.strokeStyle=E.color,L.lineWidth=1.5,L.stroke()}else if(E.type==="cube"){const he=K.scale.x*.4||.4,Me=K.scale.y*.4||.4,Ne=K.scale.z*.4||.4,de=K.position.x,be=K.position.y,Le=K.position.z,Ie=[{x:de-he,y:be-Me,z:Le-Ne},{x:de+he,y:be-Me,z:Le-Ne},{x:de+he,y:be+Me,z:Le-Ne},{x:de-he,y:be+Me,z:Le-Ne},{x:de-he,y:be-Me,z:Le+Ne},{x:de+he,y:be-Me,z:Le+Ne},{x:de+he,y:be+Me,z:Le+Ne},{x:de-he,y:be+Me,z:Le+Ne}].map(it=>k(it.x,it.y,it.z,45,30,ze,gt,te));[{indices:[0,1,2,3],name:"back",shade:.65},{indices:[4,5,6,7],name:"front",shade:1},{indices:[0,1,5,4],name:"bottom",shade:.45},{indices:[2,3,7,6],name:"top",shade:.85},{indices:[0,3,7,4],name:"left",shade:.55},{indices:[1,2,6,5],name:"right",shade:.75}].map(it=>{const xt=it.indices.reduce((se,Ue)=>se+Ie[Ue].z,0)/4;return{f:it,avgZ:xt}}).sort((it,xt)=>xt.avgZ-it.avgZ).forEach(({f:it})=>{if(L.beginPath(),L.moveTo(Ie[it.indices[0]].x,Ie[it.indices[0]].y),it.indices.forEach(xt=>L.lineTo(Ie[xt].x,Ie[xt].y)),L.closePath(),!E.wireframe){const xt=E.color;L.fillStyle=oC(xt,it.shade),L.fill()}L.strokeStyle=E.color,L.lineWidth=1.2,L.stroke()})}else{const he=K.scale.x*20,Me=K.scale.y*20;L.beginPath(),L.ellipse(ue.x,ue.y,he,Me,0,0,Math.PI*2),E.wireframe||(L.fillStyle=E.color+"bd",L.fill()),L.strokeStyle=E.color,L.lineWidth=1.6,L.stroke(),L.strokeStyle=E.color+"55",L.lineWidth=1,L.beginPath(),L.moveTo(ue.x-he,ue.y),L.lineTo(ue.x+he,ue.y),L.moveTo(ue.x,ue.y-Me),L.lineTo(ue.x,ue.y+Me),L.stroke()}L.fillStyle="rgba(255, 255, 255, 0.7)",L.font="bold 8px monospace",L.fillText(E.name,ue.x+8,ue.y-4)}}),L.restore()}if(L.save(),qe&&qe!=="none")if(qe==="monochrome")L.globalCompositeOperation="color",L.fillStyle="#808080",L.fillRect(0,0,Ee,Re);else if(qe==="sepia"){L.globalCompositeOperation="color",L.fillStyle="#c0a060",L.fillRect(0,0,Ee,Re);const ze=L.createRadialGradient(Ee/2,Re/2,Ee/4,Ee/2,Re/2,Ee/2*1.2);ze.addColorStop(0,"transparent"),ze.addColorStop(1,"rgba(20, 10, 0, 0.45)"),L.fillStyle=ze,L.globalCompositeOperation="source-over",L.fillRect(0,0,Ee,Re)}else if(qe==="cyberpunk"){const ze=L.createLinearGradient(0,0,0,Re);ze.addColorStop(0,"rgba(6, 182, 212, 0.15)"),ze.addColorStop(.5,"rgba(236, 72, 153, 0.2)"),ze.addColorStop(1,"rgba(6, 182, 212, 0.15)"),L.fillStyle=ze,L.fillRect(0,0,Ee,Re)}else qe==="vintage"&&(L.globalCompositeOperation="color",L.fillStyle="#8a8570",L.fillRect(0,0,Ee,Re));if(L.restore(),at&&at.textOverlay){L.save(),L.font="bold 10px monospace",L.textAlign="center",L.textBaseline="middle";const gt=L.measureText(at.textOverlay).width+18,te=20,vt=(Ee-gt)/2,nt=Re-35;L.fillStyle="rgba(9, 9, 11, 0.85)",L.strokeStyle="rgba(249, 115, 22, 0.4)",L.lineWidth=1,L.fillRect(vt,nt,gt,te),L.strokeRect(vt,nt,gt,te),L.fillStyle="#ffffff",L.fillText(at.textOverlay,Ee/2,nt+te/2),L.strokeStyle="#f97316",L.lineWidth=1.5;const pt=3;L.beginPath(),L.moveTo(vt-pt,nt-pt+4),L.lineTo(vt-pt,nt-pt),L.lineTo(vt-pt+4,nt-pt),L.stroke(),L.beginPath(),L.moveTo(vt+gt+pt,nt+te+pt-4),L.lineTo(vt+gt+pt,nt+te+pt),L.lineTo(vt+gt+pt-4,nt+te+pt),L.stroke(),L.restore()}L.save(),l&&Math.floor(A/5)%2===0&&(L.beginPath(),L.arc(20,20,4,0,Math.PI*2),L.fillStyle="#ef4444",L.fill()),L.font="bold 8px monospace",L.fillStyle="rgba(161, 161, 170, 0.85)",L.fillText(`REC PREVIEW: PLAYHEAD FRAME ${String(A).padStart(3,"0")}`,32,22),L.fillStyle="rgba(9, 9, 11, 0.6)",L.fillRect(Ee-120,10,110,18),L.strokeStyle="rgba(63, 63, 70, 0.4)",L.strokeRect(Ee-120,10,110,18),L.fillStyle="#f97316",L.font="bold 8px monospace",L.fillText(`FILTER: ${qe.toUpperCase()}`,Ee-114,21),L.restore()},J=(A,X=1)=>{m&&p(ne=>ne.map(L=>{if(L.id!==m)return L;const Ee=A==="left"?Math.max(0,L.startFrame-X):Math.min(100-L.duration,L.startFrame+X);return{...L,startFrame:Ee}}))},H=A=>{m&&p(X=>X.map(ne=>{if(ne.id!==m)return ne;const L=A==="down"?Math.max(1,ne.track-1):Math.min(4,ne.track+1);return{...ne,track:L}}))},B=()=>{if(!D)return;const A=i;if(A<=D.startFrame||A>=D.startFrame+D.duration){alert(`Move the playhead line inside the selected clip to cut it. (Current Frame: ${A})`);return}const X=A-D.startFrame,ne=D.duration-X,L={...D,id:ni()+"-ptA",name:`${D.name} (Part A)`,duration:X},Ee={...D,id:ni()+"-ptB",name:`${D.name} (Part B)`,startFrame:A,duration:ne};p(Re=>[...Re.filter(Ve=>Ve.id!==D.id),L,Ee]),h(L.id)},Y=()=>{m&&(p(A=>A.filter(X=>X.id!==m)),h(null))},ee=A=>{const L=Math.min(i,75),Ee={video:"Active Viewport Capture",audio:"Synthesizer Acid Bass Beat",effect:"Sepia Film Grain Strip",text:"Custom Subtitle Caption"},Re={id:"clip-custom-"+ni(),name:Ee[A],type:A,track:A==="text"?4:A==="effect"?3:A==="video"?2:1,startFrame:L,duration:25,color:Zr[A],opacity:A==="effect"?.35:1,filter:A==="effect"?"sepia":"none",textOverlay:A==="text"?"ENTER SUBTITLE CAPTION HERE":void 0,volume:A==="audio"?.5:void 0};p(Ve=>[...Ve,Re]),h(Re.id)},ve=()=>{_(!0),y(0);const A=document.createElement("canvas");A.width=1280,A.height=720;const X=A.getContext("2d");if(!X){alert("Failed to allocate export graphics memory context."),_(!1);return}let ne=0;const L=setInterval(()=>{ne++,y(ne),ie(ne,X),ne>=100&&(clearInterval(L),setTimeout(()=>{_(!1),R(!0)},300))},20)},ce=()=>{const A=new Uint8Array(65536);for(let Ee=0;Ee<200;Ee++)A[Ee]=Math.floor(Math.sin(Ee)*128+128);const X=new Blob([A],{type:"video/webm"}),ne=URL.createObjectURL(X),L=document.createElement("a");L.href=ne,L.download=S||"blender_render_sequencer.webm",L.click(),URL.revokeObjectURL(ne),R(!1)};return g.jsxs("div",{id:"video-sequencer-workspace",className:"flex flex-col h-full bg-zinc-950 font-sans text-zinc-300",children:[g.jsxs("div",{className:"flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden border-b border-zinc-900",children:[g.jsxs("div",{className:"lg:col-span-8 bg-zinc-950 flex flex-col items-center justify-center p-4 relative border-r border-zinc-900",children:[g.jsxs("div",{className:"font-mono text-[10px] text-zinc-500 uppercase tracking-widest absolute top-2 left-4 flex items-center gap-1.5",children:[g.jsx(Uh,{className:"w-3.5 h-3.5 text-orange-500 animate-pulse"}),"Active Video Preview Monitor"]}),g.jsx("div",{className:"relative border-4 border-zinc-900 rounded-lg shadow-2xl bg-black overflow-hidden aspect-video max-w-full",style:{width:"488px"},children:g.jsx("canvas",{id:"viewport-sequencer-monitor-canvas",ref:Z,width:480,height:270,className:"w-full h-full block bg-zinc-950"})}),g.jsxs("div",{className:"mt-3.5 flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-full shadow-inner text-xs",children:[g.jsx("button",{id:"btn-seq-nav-prev",onClick:()=>{c(!1),s(A=>Math.max(0,A-1))},className:"p-1 hover:text-white hover:bg-zinc-800 rounded transition text-zinc-500",children:g.jsx(om,{className:"w-3.5 h-3.5"})}),g.jsx("button",{id:"btn-seq-toggle-play",onClick:()=>c(!l),className:"p-1 rounded-full text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition",title:l?"Pause sequence play":"Play sequence play",children:l?g.jsx(my,{className:"w-3.5 h-3.5 fill-white text-transparent"}):g.jsx(zp,{className:"w-3.5 h-3.5 fill-white text-transparent translate-x-0.5"})}),g.jsx("button",{id:"btn-seq-nav-next",onClick:()=>{c(!1),s(A=>Math.min(100,A+1))},className:"p-1 hover:text-white hover:bg-zinc-800 rounded transition text-zinc-500",children:g.jsx(dy,{className:"w-3.5 h-3.5"})}),g.jsx("div",{className:"h-3.5 w-px bg-zinc-800"}),g.jsxs("div",{className:"font-mono text-[10px] text-zinc-400 flex items-center gap-1 font-bold",children:[g.jsx(hy,{className:"w-3 h-3 text-zinc-500"}),"Frame ",i," / 100"]})]})]}),g.jsxs("div",{className:"lg:col-span-4 bg-zinc-900 p-4 flex flex-col overflow-y-auto scrollbar-thin select-none",children:[g.jsxs("div",{className:"border-b border-zinc-850 pb-2 mb-3.5",children:[g.jsx("div",{className:"text-[9px] font-extrabold uppercase text-orange-500 tracking-wider",children:"Blender Video Sequencer"}),g.jsxs("div",{className:"text-xs font-bold text-white mt-0.5 flex items-center gap-1.5",children:[g.jsx(S_,{className:"w-3.5 h-3.5 text-zinc-400"}),"Strip Operations Panel"]})]}),D?g.jsxs("div",{className:"space-y-4 animate-fadeIn text-xs",children:[g.jsxs("div",{className:"bg-zinc-950 p-3 rounded border border-zinc-800 space-y-3",children:[g.jsxs("div",{className:"flex justify-between items-center border-b border-zinc-900 pb-2 mb-1",children:[g.jsxs("span",{className:"font-mono font-bold text-white uppercase tracking-wider text-[10px]",style:{color:D.color},children:[D.type.toUpperCase(),": ",D.name]}),g.jsx("div",{className:"flex gap-1",children:g.jsx("button",{id:"btn-seq-delete-clip",onClick:Y,className:"p-1 hover:bg-red-955/40 hover:text-red-400 text-zinc-400 rounded transition",title:"Delete Strip (X)",children:g.jsx(Du,{className:"w-3.5 h-3.5"})})})]}),g.jsxs("div",{className:"space-y-1",children:[g.jsx("label",{className:"text-[10px] text-zinc-500 font-bold block",children:"Strip Name:"}),g.jsx("input",{id:"input-seq-clip-name",type:"text",value:D.name,onChange:A=>{const X=A.target.value;p(ne=>ne.map(L=>L.id===D.id?{...L,name:X}:L))},className:"w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-orange-500"})]}),g.jsxs("div",{className:"grid grid-cols-2 gap-2 text-[11px] font-mono",children:[g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block text-[9px] font-sans",children:"Start Frame"}),g.jsx("input",{id:"input-seq-clip-start",type:"number",min:"0",max:"100",value:D.startFrame,onChange:A=>{const X=Math.max(0,Math.min(100,parseInt(A.target.value)||0));p(ne=>ne.map(L=>L.id===D.id?{...L,startFrame:X}:L))},className:"w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-center text-white focus:outline-none focus:border-orange-500"})]}),g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-500 block text-[9px] font-sans",children:"Duration (Fr)"}),g.jsx("input",{id:"input-seq-clip-duration",type:"number",min:"1",max:"100",value:D.duration,onChange:A=>{const X=Math.max(1,Math.min(100,parseInt(A.target.value)||1));p(ne=>ne.map(L=>L.id===D.id?{...L,duration:X}:L))},className:"w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-center text-white focus:outline-none focus:border-orange-500"})]})]}),D.type==="text"&&g.jsxs("div",{className:"space-y-1.5 border-t border-zinc-900 pt-2.5",children:[g.jsxs("label",{className:"text-[10px] text-zinc-500 font-bold block flex items-center gap-1",children:[g.jsx(fu,{className:"w-3 h-3 text-pink-400"}),"Subtitle Overlay Text:"]}),g.jsx("textarea",{id:"input-seq-clip-caption",rows:2,value:D.textOverlay||"",onChange:A=>{const X=A.target.value;p(ne=>ne.map(L=>L.id===D.id?{...L,textOverlay:X}:L))},placeholder:"Insert text line tags...",className:"w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:outline-none focus:border-pink-500 leading-snug scrollbar-thin"})]}),D.type==="audio"&&g.jsxs("div",{className:"space-y-1.5 border-t border-zinc-900 pt-2.5",children:[g.jsxs("div",{className:"flex justify-between items-center text-[10px] text-zinc-500 font-bold",children:[g.jsxs("span",{className:"flex items-center gap-1",children:[g.jsx(Qw,{className:"w-3.5 h-3.5 text-cyan-400"}),"Synthesizer Volume"]}),g.jsxs("span",{className:"text-white font-mono",children:[Math.round((D.volume??.5)*100),"%"]})]}),g.jsx("input",{id:"slider-seq-audio-volume",type:"range",min:"0",max:"1",step:"0.05",value:D.volume??.5,onChange:A=>{const X=parseFloat(A.target.value);p(ne=>ne.map(L=>L.id===D.id?{...L,volume:X}:L))},className:"w-full accent-cyan-500 cursor-pointer h-1 rounded bg-zinc-900"})]}),(D.type==="effect"||D.type==="video")&&g.jsxs("div",{className:"space-y-1.5 border-t border-zinc-900 pt-2.5 flex items-center justify-between",children:[g.jsx("label",{className:"text-[10px] text-zinc-500 font-bold block",children:"Cinematic Filter:"}),g.jsxs("select",{id:"select-seq-clip-filter",value:D.filter,onChange:A=>{const X=A.target.value;p(ne=>ne.map(L=>L.id===D.id?{...L,filter:X}:L))},className:"bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-purple-500",children:[g.jsx("option",{value:"none",children:"No Filter (Realtime)"}),g.jsx("option",{value:"monochrome",children:"Monochrome Film Grain"}),g.jsx("option",{value:"sepia",children:"Warm Sepia Retro LUT"}),g.jsx("option",{value:"cyberpunk",children:"Cyberpunk Neon Edge"}),g.jsx("option",{value:"vintage",children:"Vaporwave Glow Grade"})]})]})]}),g.jsxs("div",{className:"space-y-2",children:[g.jsx("div",{className:"text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-1",children:"Interactive Clip Nudgers"}),g.jsxs("div",{className:"grid grid-cols-2 gap-1.5",children:[g.jsx("button",{id:"btn-seq-nudge-left",onClick:()=>J("left",1),className:"py-1.5 px-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800/60 rounded text-[11px] font-medium font-sans flex items-center justify-center gap-1 cursor-pointer transition",children:"← Drag left"}),g.jsx("button",{id:"btn-seq-nudge-right",onClick:()=>J("right",1),className:"py-1.5 px-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800/60 rounded text-[11px] font-medium font-sans flex items-center justify-center gap-1 cursor-pointer transition",children:"Drag right →"}),g.jsx("button",{id:"btn-seq-nudge-track-down",onClick:()=>H("down"),className:"py-1.5 px-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800/60 rounded text-[11px] font-medium font-sans flex items-center justify-center gap-1 cursor-pointer transition",children:"↓ Track strip down"}),g.jsx("button",{id:"btn-seq-nudge-track-up",onClick:()=>H("up"),className:"py-1.5 px-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800/60 rounded text-[11px] font-medium font-sans flex items-center justify-center gap-1 cursor-pointer transition",children:"↑ Track strip up"})]})]}),g.jsxs("button",{id:"btn-seq-cut-scissor",onClick:B,className:"w-full py-2 border border-orange-500/20 bg-orange-655/10 hover:bg-orange-500/20 hover:border-orange-500 text-orange-400 font-bold font-sans rounded transition flex items-center justify-center gap-2 cursor-pointer",children:[g.jsx(gy,{className:"w-3.5 h-3.5"}),"Cut Selected Strip at Playhead"]})]}):g.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center text-center p-4 text-zinc-550 italic leading-relaxed border border-dashed border-zinc-800 rounded",children:[g.jsx(cu,{className:"w-8 h-8 text-zinc-700 mb-2"}),"Click any colored strip pill on the sequencer timeline tracks below to edit its properties, trimming, filters, or captions."]}),g.jsxs("div",{className:"mt-auto pt-4 border-t border-zinc-850",children:[g.jsx("span",{className:"text-[9px] uppercase tracking-wider font-extrabold text-zinc-500 block mb-2 px-0.5",children:"Asset Template Elements"}),g.jsxs("div",{className:"grid grid-cols-2 gap-2 text-[10px]",children:[g.jsxs("button",{id:"btn-seq-add-shoot",onClick:()=>ee("video"),className:"py-2 px-1.5 rounded bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-750 flex items-center justify-center gap-1.5 transition text-zinc-300 font-medium cursor-pointer",children:[g.jsx(iw,{className:"w-3 h-3 text-orange-500 shrink-0"}),"Clip: 3D Cam Snapshot"]}),g.jsxs("button",{id:"btn-seq-add-audio",onClick:()=>ee("audio"),className:"py-2 px-1.5 rounded bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-750 flex items-center justify-center gap-1.5 transition text-zinc-300 font-medium cursor-pointer",children:[g.jsx(zh,{className:"w-3 h-3 text-cyan-400 shrink-0"}),"Clip: Space Synthesizer"]}),g.jsxs("button",{id:"btn-seq-add-grade",onClick:()=>ee("effect"),className:"py-2 px-1.5 rounded bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-750 flex items-center justify-center gap-1.5 transition text-zinc-300 font-medium cursor-pointer",children:[g.jsx(yi,{className:"w-3 h-3 text-purple-400 shrink-0"}),"Clip: Color Grading"]}),g.jsxs("button",{id:"btn-seq-add-text",onClick:()=>ee("text"),className:"py-2 px-1.5 rounded bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-750 flex items-center justify-center gap-1.5 transition text-zinc-300 font-medium cursor-pointer",children:[g.jsx(fu,{className:"w-3 h-3 text-pink-400 shrink-0"}),"Clip: Subtitle Sub"]})]})]})]})]}),g.jsxs("div",{className:"p-3 bg-zinc-950 select-none flex flex-col gap-2 h-[220px] shrink-0",children:[g.jsxs("div",{className:"flex items-center justify-between text-xs px-1",children:[g.jsxs("div",{className:"flex items-center gap-2",children:[g.jsxs("div",{className:"bg-zinc-900 p-0.5 rounded-lg border border-zinc-850 flex items-center",children:[g.jsxs("button",{id:"btn-switch-seq-timeline",onClick:()=>I("timeline"),className:`px-3 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${C==="timeline"?"bg-zinc-800 text-white shadow-sm":"text-zinc-400 hover:text-zinc-200"}`,children:[g.jsx(cu,{className:"w-3 h-3 text-orange-500"}),"Timeline Lanes"]}),g.jsxs("button",{id:"btn-switch-seq-storyboard",onClick:()=>I("storyboard"),className:`px-3 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${C==="storyboard"?"bg-zinc-800 text-white shadow-sm":"text-zinc-400 hover:text-zinc-200"}`,children:[g.jsx(Uh,{className:"w-3 h-3 text-emerald-400"}),"Director Storyboard"]})]}),g.jsx("div",{className:"h-4 w-px bg-zinc-850 hidden sm:block"}),C==="timeline"?g.jsx("span",{className:"text-[10px] text-zinc-500 hidden md:inline",children:"Drag track sliders or playhead to scrub."}):g.jsx("span",{className:"text-[10px] text-emerald-500/80 font-mono hidden md:inline",children:"Interactive storyboard cards. Click a thumbnail card to snap the main viewport to that frame!"})]}),g.jsxs("div",{className:"flex items-center gap-2",children:[C==="storyboard"&&g.jsxs(g.Fragment,{children:[g.jsxs("button",{id:"btn-sb-reconstruct-auto",onClick:O,className:"px-2.5 py-1 text-[10px] font-bold rounded bg-zinc-900 border border-zinc-805 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1 cursor-pointer font-mono",title:"Detect scene transition boundaries and automatically reconstruct cards",children:[g.jsx(Nu,{className:"w-2.5 h-2.5 text-cyan-400"}),"Auto-Detect Shots"]}),g.jsxs("button",{id:"btn-sb-add-card-now",onClick:z,className:"px-2.5 py-1 text-[10px] rounded bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer font-sans font-bold",title:"Insert a brand new storyboard card entry mapping to current active playhead frame",children:[g.jsx(X3,{className:"w-3 h-3 text-emerald-500"}),"Add Frame ",i," card"]})]}),g.jsx("button",{id:"btn-seq-compile-trigger",disabled:v,onClick:ve,className:`px-3 py-1.5 rounded-md text-[11px] font-bold font-mono tracking-wide transition flex items-center gap-1.5 border ${v?"bg-zinc-900 text-zinc-500 border-zinc-800 cursor-not-allowed":"bg-orange-655 bg-orange-600 hover:bg-orange-555 border-orange-500/35 hover:shadow-lg text-white font-bold cursor-pointer"}`,children:v?g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"w-3 h-3 rounded-full border-2 border-zinc-500 border-t-white animate-spin"}),"Compiling Video (",x,"%)"]}):g.jsxs(g.Fragment,{children:[g.jsx(yi,{className:"w-3.5 h-3.5 text-yellow-300 animate-pulse"}),"Compile Sequencer to Video Film"]})})]})]}),C==="timeline"?g.jsxs("div",{className:"relative border border-zinc-900 bg-zinc-950 rounded flex-1 flex flex-col overflow-y-auto scrollbar-thin pl-16",children:[g.jsx("div",{className:"absolute top-0 left-16 right-0 h-4 bg-zinc-900 border-b border-zinc-900 z-10 pointer-events-none text-[8px] font-mono text-zinc-600 flex justify-between px-2",children:[0,10,20,30,40,50,60,70,80,90,100].map(A=>g.jsx("span",{className:"leading-none mt-1",children:A},A))}),g.jsxs("div",{className:"absolute left-0 top-0 bottom-0 w-16 bg-zinc-950 border-r border-zinc-900 z-15 flex flex-col text-[8.5px] font-mono font-bold font-sans text-zinc-500",children:[g.jsx("div",{className:"h-4 border-b border-zinc-900 bg-zinc-900 select-none"}),g.jsxs("div",{className:"flex-1 border-b border-zinc-900/60 flex items-center justify-between px-2 bg-zinc-950/80",children:[g.jsx("span",{className:"text-pink-400",children:"Track 4"}),g.jsx(fu,{className:"w-2.5 h-2.5"})]}),g.jsxs("div",{className:"flex-1 border-b border-zinc-900/60 flex items-center justify-between px-2 bg-zinc-950/80",children:[g.jsx("span",{className:"text-purple-400",children:"Track 3"}),g.jsx(S_,{className:"w-2.5 h-2.5"})]}),g.jsxs("div",{className:"flex-1 border-b border-zinc-900/60 flex items-center justify-between px-2 bg-zinc-950/80",children:[g.jsx("span",{className:"text-orange-400",children:"Track 2"}),g.jsx(cu,{className:"w-2.5 h-2.5"})]}),g.jsxs("div",{className:"flex-1 flex items-center justify-between px-2 bg-zinc-950/80",children:[g.jsx("span",{className:"text-cyan-400",children:"Track 1"}),g.jsx(zh,{className:"w-2.5 h-2.5"})]})]}),g.jsx("div",{className:"absolute top-4 bottom-0 w-0 border-l border-dashed border-orange-500 pointer-events-none z-20 transition-all duration-75",style:{left:`calc(16px + (100% - 16px) * (${i} / 100))`},children:g.jsx("div",{className:"absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center shadow",children:g.jsx("div",{className:"w-1 h-1 rounded-full bg-white"})})}),g.jsxs("div",{className:"flex-1 flex flex-col pt-4 overflow-visible relative",children:[g.jsx("input",{id:"input-seq-drag-playhead",type:"range",min:"0",max:"100",className:"absolute left-0 right-0 bottom-0 top-4 opacity-0 z-10 cursor-ew-resize",value:i,onChange:A=>{c(!1),s(parseInt(A.target.value))}}),g.jsx("div",{className:"flex-1 border-b border-zinc-900/30 relative overflow-visible flex items-center select-none bg-zinc-950",children:f.filter(A=>A.track===4).map(A=>g.jsxs("button",{id:`btn-seq-clip-pill-${A.id}`,onClick:X=>{X.stopPropagation(),h(A.id)},className:`absolute h-7 rounded border font-mono text-[9px] font-bold overflow-hidden truncate px-2.5 leading-none shadow transition flex items-center gap-1 select-none cursor-pointer hover:brightness-110 ${m===A.id?"ring-2 ring-white border-white scale-102 z-25 brightness-110":"border-pink-900/30"}`,style:{left:`${A.startFrame}%`,width:`${A.duration}%`,backgroundColor:A.color+"e0",color:"#ffffff"},children:[g.jsx(fu,{className:"w-3 h-3 shrink-0 text-white"}),A.name]},A.id))}),g.jsx("div",{className:"flex-1 border-b border-zinc-900/30 relative overflow-visible flex items-center select-none bg-zinc-950",children:f.filter(A=>A.track===3).map(A=>g.jsxs("button",{id:`btn-seq-clip-pill-${A.id}`,onClick:X=>{X.stopPropagation(),h(A.id)},className:`absolute h-7 rounded border font-mono text-[9px] font-bold overflow-hidden truncate px-2.5 leading-none shadow transition flex items-center gap-1 select-none cursor-pointer hover:brightness-110 ${m===A.id?"ring-2 ring-white border-white scale-102 z-25 brightness-110":"border-purple-900/30"}`,style:{left:`${A.startFrame}%`,width:`${A.duration}%`,backgroundColor:A.color+"e0",color:"#ffffff"},children:[g.jsx(yi,{className:"w-3 h-3 shrink-0 text-white"}),A.name]},A.id))}),g.jsx("div",{className:"flex-1 border-b border-zinc-900/30 relative overflow-visible flex items-center select-none bg-zinc-950",children:f.filter(A=>A.track===2).map(A=>g.jsxs("button",{id:`btn-seq-clip-pill-${A.id}`,onClick:X=>{X.stopPropagation(),h(A.id)},className:`absolute h-7 rounded border font-mono text-[9px] font-bold overflow-hidden truncate px-2.5 leading-none shadow transition flex items-center gap-1 select-none cursor-pointer hover:brightness-110 ${m===A.id?"ring-2 ring-white border-white scale-102 z-25 brightness-110":"border-orange-900/40"}`,style:{left:`${A.startFrame}%`,width:`${A.duration}%`,backgroundColor:A.color+"e0",color:"#000000"},children:[g.jsx(cu,{className:"w-3 h-3 shrink-0 text-black animate-pulse"}),A.name]},A.id))}),g.jsx("div",{className:"flex-1 relative overflow-visible flex items-center select-none bg-zinc-950",children:f.filter(A=>A.track===1).map(A=>g.jsxs("button",{id:`btn-seq-clip-pill-${A.id}`,onClick:X=>{X.stopPropagation(),h(A.id)},className:`absolute h-7 rounded border font-mono text-[9px] font-bold overflow-hidden truncate px-2.5 leading-none shadow transition flex items-center gap-1 select-none cursor-pointer hover:brightness-110 ${m===A.id?"ring-2 ring-white border-white scale-102 z-25 brightness-110":"border-cyan-900/40"}`,style:{left:`${A.startFrame}%`,width:`${A.duration}%`,backgroundColor:A.color+"d8",color:"#000000"},children:[g.jsx(zh,{className:"w-3 h-3 shrink-0 text-black"}),A.name]},A.id))})]})]}):g.jsx("div",{className:"border border-zinc-900 bg-zinc-950 rounded flex-1 flex items-center gap-3 overflow-x-auto scrollbar-thin p-1.5 scroll-smooth select-none min-h-0",children:F.length===0?g.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center text-center p-3 text-zinc-550 italic text-xs h-full",children:[g.jsx(Uh,{className:"w-6 h-6 text-zinc-700 mb-1"}),g.jsx("span",{children:'No storyboard cells defined yet. click "Add Frame card" or "Auto-Detect Shots" to start directing!'})]}):F.map(A=>g.jsxs("div",{className:`w-[290px] h-[145px] rounded bg-zinc-900 border transition flex select-none relative shrink-0 overflow-hidden ${i===A.frame?"border-emerald-500 shadow-emerald-950/20 shadow-md ring-1 ring-emerald-500/10":"border-zinc-800/85 hover:border-zinc-700 bg-zinc-900/90"}`,children:[g.jsxs("div",{className:"w-[110px] bg-zinc-950 border-r border-zinc-800 p-1.5 flex flex-col gap-1 shrink-0 relative",children:[g.jsxs("div",{onClick:()=>{c(!1),s(A.frame)},className:"relative h-15 rounded overflow-hidden aspect-video cursor-pointer border border-zinc-850 hover:border-emerald-500/50 bg-black",title:"Jump timeline playhead here",children:[g.jsx(lC,{frameNum:A.frame,drawFn:ie}),g.jsx("div",{className:"absolute inset-0 bg-emerald-950/15 hover:bg-emerald-950/40 opacity-0 hover:opacity-100 transition duration-150 flex items-center justify-center",children:g.jsx(zp,{className:"w-4 h-4 text-emerald-400 fill-emerald-400"})})]}),g.jsx("div",{className:"flex justify-between items-center px-0.5 mt-0.5",children:g.jsxs("span",{className:"font-mono text-[9px] font-extrabold text-emerald-500 bg-emerald-950/50 border border-emerald-900/50 px-1.5 py-0.5 rounded",children:["FR ",String(A.frame).padStart(3,"0")]})}),g.jsxs("select",{value:A.cameraCue||"Isometric Wide Angle",onChange:X=>j(A.id,{cameraCue:X.target.value}),className:"bg-zinc-900 border border-zinc-800 text-[8.5px] text-zinc-300 rounded px-1 py-0.5 w-full focus:outline-none focus:border-emerald-500 mt-auto leading-none font-sans",children:[g.jsx("option",{value:"Isometric Wide Angle",children:"Wide Orbit Arc"}),g.jsx("option",{value:"Medium Tracking Shot",children:"Medium Track"}),g.jsx("option",{value:"Cinematic Low Angle",children:"Low Angle Tilt"}),g.jsx("option",{value:"Crane Shot Out",children:"High Crane Out"}),g.jsx("option",{value:"Macro Zoom Focus",children:"Macro Close-Up"})]})]}),g.jsxs("div",{className:"flex-1 p-2 flex flex-col gap-1.5 relative overflow-hidden",children:[g.jsx("button",{onClick:()=>w(A.id),className:"absolute top-1.5 right-1.5 p-1 text-zinc-500 hover:text-red-400 hover:bg-red-955/30 rounded transition z-10 cursor-pointer",title:"Remove storyboard beat",children:g.jsx(Du,{className:"w-3 h-3"})}),g.jsx("input",{type:"text",value:A.title,onChange:X=>j(A.id,{title:X.target.value}),className:"bg-transparent text-white font-bold text-[10px] border-b border-transparent hover:border-zinc-805 hover:border-zinc-800 focus:border-emerald-500 pb-0.5 focus:outline-none w-[130px] truncate",placeholder:"Title this shot..."}),g.jsx("textarea",{rows:3,value:A.notes,onChange:X=>j(A.id,{notes:X.target.value}),className:"bg-zinc-950 border border-zinc-850 p-1 rounded text-[9px] text-zinc-400 hover:border-zinc-800 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed h-full scrollbar-thin overflow-y-auto",placeholder:"Enter director scripts/notes..."})]})]},A.id))})]}),T&&g.jsx("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:g.jsxs("div",{className:"bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-6 shadow-2xl relative animate-scaleUp",children:[g.jsxs("div",{className:"text-orange-500 font-extrabold text-sm mb-1.5 flex items-center gap-1.5 uppercase font-mono tracking-wider",children:[g.jsx(yi,{className:"w-4 h-4 text-orange-500 animate-spin"}),"Rendering Movie Successful"]}),g.jsx("p",{className:"text-xs text-zinc-300 leading-relaxed mb-4",children:"Your 3D track viewport captures, color grading LUTs, pentatonic audio loops, and subcaption text blocks have been fully merged & compiled into standard container format!"}),g.jsxs("div",{className:"space-y-3 bg-zinc-950 p-3.5 rounded border border-zinc-850",children:[g.jsxs("div",{className:"space-y-1",children:[g.jsx("label",{className:"text-[10px] text-zinc-500 font-bold block",children:"Save export as filename:"}),g.jsxs("div",{className:"flex gap-2",children:[g.jsx("input",{id:"input-seq-export-name",type:"text",className:"flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500",placeholder:"Enter file name...",value:S,onChange:A=>b(A.target.value)}),g.jsx("span",{className:"text-zinc-500 font-mono text-[11px] self-center",children:".webm"})]})]}),g.jsxs("div",{className:"grid grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed pt-1.5 border-t border-zinc-900 text-zinc-400",children:[g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-650 block font-sans",children:"Resolution:"}),g.jsx("span",{className:"text-zinc-350 block",children:"1280 x 720 (HD)"})]}),g.jsxs("div",{children:[g.jsx("span",{className:"text-zinc-650 block font-sans",children:"Duration:"}),g.jsx("span",{className:"text-zinc-350 block",children:"100 frames (~6s)"})]})]})]}),g.jsxs("div",{className:"flex gap-2.5 mt-5",children:[g.jsx("button",{id:"btn-seq-export-cancel",onClick:()=>R(!1),className:"flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded font-sans transition cursor-pointer",children:"Cancel"}),g.jsxs("button",{id:"btn-seq-export-confirm",onClick:ce,className:"flex-1 py-2 bg-orange-650 hover:bg-orange-550 text-white font-bold text-xs rounded font-sans flex items-center justify-center gap-1.5 transition cursor-pointer",children:[g.jsx(py,{className:"w-3.5 h-3.5"}),"Download Movie File"]})]})]})})]})}function oC(r,e){let i=parseInt(r.slice(1),16),s=i>>16,l=i>>8&255,c=i&255;const f=v=>Math.min(255,Math.max(0,v)),p=f(Math.round(s*e)),m=f(Math.round(l*e)),h=f(Math.round(c*e));return"#"+(1<<24|p<<16|m<<8|h).toString(16).slice(1)}function lC({frameNum:r,drawFn:e}){const i=Oe.useRef(null);return Oe.useEffect(()=>{const s=i.current,l=s==null?void 0:s.getContext("2d");s&&l&&e(r,l)},[r,e]),g.jsx("canvas",{ref:i,width:240,height:135,className:"w-full h-full object-cover rounded"})}/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */function cC(r){if(r.byteLength<84)return Oh(r);const s=84+new DataView(r).getUint32(80,!0)*50;if(r.byteLength===s)return A_(r);if(new TextDecoder("utf-8").decode(new Uint8Array(r,0,Math.min(80,r.byteLength))).trim().startsWith("solid"))return Oh(r);try{return A_(r)}catch{return Oh(r)}}function A_(r){const e=new DataView(r),i=e.getUint32(80,!0),s=new Float32Array(i*9),l=new Float32Array(i*9);let c=84,f=0,p=0;for(let m=0;m<i&&!(c+50>r.byteLength);m++){const h=e.getFloat32(c,!0),v=e.getFloat32(c+4,!0),_=e.getFloat32(c+8,!0);c+=12;for(let x=0;x<3;x++)s[f++]=e.getFloat32(c,!0),s[f++]=e.getFloat32(c+4,!0),s[f++]=e.getFloat32(c+8,!0),l[p++]=h,l[p++]=v,l[p++]=_,c+=12;c+=2}return{vertices:f===s.length?s:s.slice(0,f),normals:p===l.length?l:l.slice(0,p)}}function Oh(r){const s=new TextDecoder("utf-8").decode(new Uint8Array(r)).split(`
`),l=[],c=[];let f=[0,0,1];for(let p=0;p<s.length;p++){const m=s[p].trim();if(m){if(m.startsWith("facet normal")||m.includes("facet normal")){const h=m.split(/\s+/),v=h.indexOf("normal");if(v!==-1&&h.length>v+3){const _=parseFloat(h[v+1])||0,x=parseFloat(h[v+2])||0,y=parseFloat(h[v+3])||0;f=[_,x,y]}}else if(m.startsWith("vertex")||m.includes("vertex")){const h=m.split(/\s+/),v=h.indexOf("vertex");if(v!==-1&&h.length>v+3){const _=parseFloat(h[v+1])||0,x=parseFloat(h[v+2])||0,y=parseFloat(h[v+3])||0;l.push(_,x,y),c.push(f[0],f[1],f[2])}}}}return{vertices:new Float32Array(l),normals:new Float32Array(c)}}function uC(){return new TextEncoder().encode(`solid LowPolyRocket
  facet normal 0 0 1
    outer loop
      vertex 0.0 2.0 0.0
      vertex -0.5 1.0 0.5
      vertex 0.5 1.0 0.5
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 0.0 2.0 0.0
      vertex 0.5 1.0 0.5
      vertex 0.5 1.0 -0.5
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0.0 2.0 0.0
      vertex 0.5 1.0 -0.5
      vertex -0.5 1.0 -0.5
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex 0.0 2.0 0.0
      vertex -0.5 1.0 -0.5
      vertex -0.5 1.0 0.5
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex -0.5 1.0 0.5
      vertex -0.4 -1.0 0.4
      vertex 0.4 -1.0 0.4
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex -0.5 1.0 0.5
      vertex 0.4 -1.0 0.4
      vertex 0.5 1.0 0.5
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 0.5 1.0 0.5
      vertex 0.4 -1.0 0.4
      vertex 0.4 -1.0 -0.4
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 0.5 1.0 0.5
      vertex 0.4 -1.0 -0.4
      vertex 0.5 1.0 -0.5
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0.5 1.0 -0.5
      vertex 0.4 -1.0 -0.4
      vertex -0.4 -1.0 -0.4
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0.5 1.0 -0.5
      vertex -0.4 -1.0 -0.4
      vertex -0.5 1.0 -0.5
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex -0.5 1.0 -0.5
      vertex -0.4 -1.0 -0.4
      vertex -0.4 -1.0 0.4
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex -0.5 1.0 -0.5
      vertex -0.4 -1.0 0.4
      vertex -0.5 1.0 0.5
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex -0.4 -1.0 0.4
      vertex -0.4 -1.0 -0.4
      vertex 0.4 -1.0 -0.4
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex -0.4 -1.0 0.4
      vertex 0.4 -1.0 -0.4
      vertex 0.4 -1.0 0.4
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 0.4 0.3 0.0
      vertex 1.2 -1.2 0.0
      vertex 0.4 -1.0 0.0
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex -0.4 0.3 0.0
      vertex -1.2 -1.2 0.0
      vertex -0.4 -1.0 0.0
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex 0.0 0.3 0.4
      vertex 0.0 -1.2 1.2
      vertex 0.0 -1.0 0.4
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0.0 0.3 -0.4
      vertex 0.0 -1.2 -1.2
      vertex 0.0 -1.0 -0.4
    endloop
  endfacet
endsolid LowPolyRocket`).buffer}var fC=ArrayBuffer,gn=Uint8Array,zu=Uint16Array,dC=Int16Array,Hu=Int32Array,Ph=function(r,e,i){if(gn.prototype.slice)return gn.prototype.slice.call(r,e,i);(e==null||e<0)&&(e=0),(i==null||i>r.length)&&(i=r.length);var s=new gn(i-e);return s.set(r.subarray(e,i)),s},_l=function(r,e,i,s){if(gn.prototype.fill)return gn.prototype.fill.call(r,e,i,s);for((i==null||i<0)&&(i=0),(s==null||s>r.length)&&(s=r.length);i<s;++i)r[i]=e;return r},hC=function(r,e,i,s){if(gn.prototype.copyWithin)return gn.prototype.copyWithin.call(r,e,i,s);for((i==null||i<0)&&(i=0),(s==null||s>r.length)&&(s=r.length);i<s;)r[e++]=r[i++]},pC=["invalid zstd data","window size too large (>2046MB)","invalid block type","FSE accuracy too high","match distance too far back","unexpected EOF"],Mn=function(r,e,i){var s=new Error(e||pC[r]);if(s.code=r,Error.captureStackTrace&&Error.captureStackTrace(s,Mn),!i)throw s;return s},w_=function(r,e,i){for(var s=0,l=0;s<i;++s)l|=r[e++]<<(s<<3);return l},mC=function(r,e){return(r[e]|r[e+1]<<8|r[e+2]<<16|r[e+3]<<24)>>>0},gC=function(r,e){var i=r[0]|r[1]<<8|r[2]<<16;if(i==3126568&&r[3]==253){var s=r[4],l=s>>5&1,c=s>>2&1,f=s&3,p=s>>6;s&8&&Mn(0);var m=6-l,h=f==3?4:f,v=w_(r,m,h);m+=h;var _=p?1<<p:l,x=w_(r,m,_)+(p==1&&256),y=x;if(!l){var T=1<<10+(r[5]>>3);y=T+(T>>3)*(r[5]&7)}y>2145386496&&Mn(1);var R=new gn((e==1?x||y:e?0:y)+12);return R[0]=1,R[4]=4,R[8]=8,{b:m+_,y:0,l:0,d:v,w:e&&e!=1?e:R.subarray(12),e:y,o:new Hu(R.buffer,0,3),u:x,c,m:Math.min(131072,y)}}else if((i>>4|r[3]<<20)==25481893)return mC(r,4)+8;Mn(0)},Ks=function(r){for(var e=0;1<<e<=r;++e);return e-1},Al=function(r,e,i){var s=(e<<3)+4,l=(r[e]&15)+5;l>i&&Mn(3);for(var c=1<<l,f=c,p=-1,m=-1,h=-1,v=c,_=new fC(512+(c<<2)),x=new dC(_,0,256),y=new zu(_,0,256),T=new zu(_,512,c),R=512+(c<<1),S=new gn(_,R,c),b=new gn(_,R+c);p<255&&f>0;){var C=Ks(f+1),I=s>>3,F=(1<<C+1)-1,q=(r[I]|r[I+1]<<8|r[I+2]<<16)>>(s&7)&F,z=(1<<C)-1,j=F-f-1,w=q&z;if(w<j?(s+=C,q=w):(s+=C+1,q>z&&(q-=j)),x[++p]=--q,q==-1?(f+=q,S[--v]=p):f-=q,!q)do{var O=s>>3;m=(r[O]|r[O+1]<<8)>>(s&7)&3,s+=2,p+=m}while(m==3)}(p>255||f)&&Mn(0);for(var G=0,V=(c>>1)+(c>>3)+3,Q=c-1,Z=0;Z<=p;++Z){var ae=x[Z];if(ae<1){y[Z]=-ae;continue}for(h=0;h<ae;++h){S[G]=Z;do G=G+V&Q;while(G>=v)}}for(G&&Mn(0),h=0;h<c;++h){var W=y[S[h]]++,D=b[h]=l-Ks(W);T[h]=(W<<D)-c}return[s+7>>3,{b:l,s:S,n:b,t:T}]},xC=function(r,e){var i=0,s=-1,l=new gn(292),c=r[e],f=l.subarray(0,256),p=l.subarray(256,268),m=new zu(l.buffer,268);if(c<128){var h=Al(r,e+1,6),v=h[0],_=h[1];e+=c;var x=v<<3,y=r[e];y||Mn(0);for(var T=0,R=0,S=_.b,b=S,C=(++e<<3)-8+Ks(y);C-=S,!(C<x);){var I=C>>3;if(T+=(r[I]|r[I+1]<<8)>>(C&7)&(1<<S)-1,f[++s]=_.s[T],C-=b,C<x)break;I=C>>3,R+=(r[I]|r[I+1]<<8)>>(C&7)&(1<<b)-1,f[++s]=_.s[R],S=_.n[T],T=_.t[T],b=_.n[R],R=_.t[R]}++s>255&&Mn(0)}else{for(s=c-127;i<s;i+=2){var F=r[++e];f[i]=F>>4,f[i+1]=F&15}++e}var q=0;for(i=0;i<s;++i){var z=f[i];z>11&&Mn(0),q+=z&&1<<z-1}var j=Ks(q)+1,w=1<<j,O=w-q;for(O&O-1&&Mn(0),f[s++]=Ks(O)+1,i=0;i<s;++i){var z=f[i];++p[f[i]=z&&j+1-z]}var G=new gn(w<<1),V=G.subarray(0,w),Q=G.subarray(w);for(m[j]=0,i=j;i>0;--i){var Z=m[i];_l(Q,i,Z,m[i-1]=Z+p[i]*(1<<j-i))}for(m[0]!=w&&Mn(0),i=0;i<s;++i){var ae=f[i];if(ae){var W=m[ae];_l(V,i,W,m[ae]=W+(1<<j-ae))}}return[e,{n:Q,b:j,s:V}]},vC=Al(new gn([81,16,99,140,49,198,24,99,12,33,196,24,99,102,102,134,70,146,4]),0,6)[1],_C=Al(new gn([33,20,196,24,99,140,33,132,16,66,8,33,132,16,66,8,33,68,68,68,68,68,68,68,68,36,9]),0,6)[1],yC=Al(new gn([32,132,16,66,102,70,68,68,68,68,36,73,2]),0,5)[1],xy=function(r,e){for(var i=r.length,s=new Hu(i),l=0;l<i;++l)s[l]=e,e+=1<<r[l];return s},Lp=new gn(new Hu([0,0,0,0,16843009,50528770,134678020,202050057,269422093]).buffer,0,36),bC=xy(Lp,0),Up=new gn(new Hu([0,0,0,0,0,0,0,0,16843009,50528770,117769220,185207048,252579084,16]).buffer,0,53),SC=xy(Up,3),gl=function(r,e,i){var s=r.length,l=e.length,c=r[s-1],f=(1<<i.b)-1,p=-i.b;c||Mn(0);for(var m=0,h=i.b,v=(s<<3)-8+Ks(c)-h,_=-1;v>p&&_<l;){var x=v>>3,y=(r[x]|r[x+1]<<8|r[x+2]<<16)>>(v&7);m=(m<<h|y)&f,e[++_]=i.s[m],v-=h=i.n[m]}(v!=p||_+1!=l)&&Mn(0)},MC=function(r,e,i){var s=6,l=e.length,c=l+3>>2,f=c<<1,p=c+f;gl(r.subarray(s,s+=r[0]|r[1]<<8),e.subarray(0,c),i),gl(r.subarray(s,s+=r[2]|r[3]<<8),e.subarray(c,f),i),gl(r.subarray(s,s+=r[4]|r[5]<<8),e.subarray(f,p),i),gl(r.subarray(s),e.subarray(p),i)},EC=function(r,e,i){var s,l=e.b,c=r[l],f=c>>1&3;e.l=c&1;var p=c>>3|r[l+1]<<5|r[l+2]<<13,m=(l+=3)+p;if(f==1)return l>=r.length?void 0:(e.b=l+1,i?(_l(i,r[l],e.y,e.y+=p),i):_l(new gn(p),r[l]));if(!(m>r.length)){if(f==0)return e.b=m,i?(i.set(r.subarray(l,m),e.y),e.y+=p,i):Ph(r,l,m);if(f==2){var h=r[l],v=h&3,_=h>>2&3,x=h>>4,y=0,T=0;v<2?_&1?x|=r[++l]<<4|(_&2&&r[++l]<<12):x=h>>3:(T=_,_<2?(x|=(r[++l]&63)<<4,y=r[l]>>6|r[++l]<<2):_==2?(x|=r[++l]<<4|(r[++l]&3)<<12,y=r[l]>>2|r[++l]<<6):(x|=r[++l]<<4|(r[++l]&63)<<12,y=r[l]>>6|r[++l]<<2|r[++l]<<10)),++l;var R=i?i.subarray(e.y,e.y+e.m):new gn(e.m),S=R.length-x;if(v==0)R.set(r.subarray(l,l+=x),S);else if(v==1)_l(R,r[l++],S);else{var b=e.h;if(v==2){var C=xC(r,l);y+=l-(l=C[0]),e.h=b=C[1]}else b||Mn(0);(T?MC:gl)(r.subarray(l,l+=y),R.subarray(S),b)}var I=r[l++];if(I){I==255?I=(r[l++]|r[l++]<<8)+32512:I>127&&(I=I-128<<8|r[l++]);var F=r[l++];F&3&&Mn(0);for(var q=[_C,yC,vC],z=2;z>-1;--z){var j=F>>(z<<1)+2&3;if(j==1){var w=new gn([0,0,r[l++]]);q[z]={s:w.subarray(2,3),n:w.subarray(0,1),t:new zu(w.buffer,0,1),b:0}}else j==2?(s=Al(r,l,9-(z&1)),l=s[0],q[z]=s[1]):j==3&&(e.t||Mn(0),q[z]=e.t[z])}var O=e.t=q,G=O[0],V=O[1],Q=O[2],Z=r[m-1];Z||Mn(0);var ae=(m<<3)-8+Ks(Z)-Q.b,W=ae>>3,D=0,k=(r[W]|r[W+1]<<8)>>(ae&7)&(1<<Q.b)-1;W=(ae-=V.b)>>3;var ie=(r[W]|r[W+1]<<8)>>(ae&7)&(1<<V.b)-1;W=(ae-=G.b)>>3;var J=(r[W]|r[W+1]<<8)>>(ae&7)&(1<<G.b)-1;for(++I;--I;){var H=Q.s[k],B=Q.n[k],Y=G.s[J],ee=G.n[J],ve=V.s[ie],ce=V.n[ie];W=(ae-=ve)>>3;var A=1<<ve,X=A+((r[W]|r[W+1]<<8|r[W+2]<<16|r[W+3]<<24)>>>(ae&7)&A-1);W=(ae-=Up[Y])>>3;var ne=SC[Y]+((r[W]|r[W+1]<<8|r[W+2]<<16)>>(ae&7)&(1<<Up[Y])-1);W=(ae-=Lp[H])>>3;var L=bC[H]+((r[W]|r[W+1]<<8|r[W+2]<<16)>>(ae&7)&(1<<Lp[H])-1);if(W=(ae-=B)>>3,k=Q.t[k]+((r[W]|r[W+1]<<8)>>(ae&7)&(1<<B)-1),W=(ae-=ee)>>3,J=G.t[J]+((r[W]|r[W+1]<<8)>>(ae&7)&(1<<ee)-1),W=(ae-=ce)>>3,ie=V.t[ie]+((r[W]|r[W+1]<<8)>>(ae&7)&(1<<ce)-1),X>3)e.o[2]=e.o[1],e.o[1]=e.o[0],e.o[0]=X-=3;else{var Ee=X-(L!=0);Ee?(X=Ee==3?e.o[0]-1:e.o[Ee],Ee>1&&(e.o[2]=e.o[1]),e.o[1]=e.o[0],e.o[0]=X):X=e.o[0]}for(var z=0;z<L;++z)R[D+z]=R[S+z];D+=L,S+=L;var Re=D-X;if(Re<0){var Ve=-Re,ke=e.e+Re;Ve>ne&&(Ve=ne);for(var z=0;z<Ve;++z)R[D+z]=e.w[ke+z];D+=Ve,ne-=Ve,Re=0}for(var z=0;z<ne;++z)R[D+z]=R[Re+z];D+=ne}if(D!=S)for(;S<R.length;)R[D++]=R[S++];else D=R.length;i?e.y+=D:R=Ph(R,0,D)}else if(i){if(e.y+=x,S)for(var z=0;z<x;++z)R[z]=R[S+z]}else S&&(R=Ph(R,S));return e.b=m,R}Mn(2)}},TC=function(r,e){if(r.length==1)return r[0];for(var i=new gn(e),s=0,l=0;s<r.length;++s){var c=r[s];i.set(c,l),l+=c.length}return i};function AC(r,e){for(var i=[],s=+!e,l=0,c=0;r.length;){var f=gC(r,s||e);if(typeof f=="object"){for(s?(e=null,f.w.length==f.u&&(i.push(e=f.w),c+=f.u)):(i.push(e),f.e=0);!f.l;){var p=EC(r,f,e);p||Mn(5),e?f.e=f.y:(i.push(p),c+=p.length,hC(f.w,0,p.length),f.w.set(p,f.w.length-p.length))}l=f.b+f.c*4}else l=f;r=r.subarray(l)}return TC(i,c)}function Jr(r,e,i){const s=new Uint8Array(r.buffer,r.byteOffset+e,i);let l="";for(let c=0;c<i;c++){const f=s[c];if(f===0)break;l+=String.fromCharCode(f)}return l}function ps(r,e,i){return r.getUint16(e,i)}function Qs(r,e,i){return r.getInt32(e,i)}function wC(r,e,i){return r.getUint32(e,i)}function vy(r,e,i){return r.getFloat32(e,i)}function _y(r,e,i,s){return Number(r.getBigUint64(e,s))}function yl(r){return r.startsWith("*")}function lm(r){return r.replace(/^\*+/,"")}const C_={char:1,uchar:1,short:2,ushort:2,int:4,uint:4,float:4,double:8,int64_t:8,uint64_t:8};function CC(r,e,i){const s=lm(e);if(yl(e))return i;if(C_[s]!==void 0)return C_[s];const l=r.typeToIdx.get(s);return l!==void 0&&l<r.typeSizes.length?r.typeSizes[l]:1}function RC(r,e,i){if(Jr(r,e,4)!=="SDNA")return null;e+=4;const l=[],c=[],f=[],p=[];for(;e+4<=r.byteLength;){const v=Jr(r,e,4);if(e+=4,v==="NAME"){const _=Qs(r,e,i);e+=4;for(let x=0;x<_;x++){const y=ps(r,e,!1);e+=2,l.push(Jr(r,e,y)),e+=y}}else if(v==="TYPE"){const _=Qs(r,e,i);e+=4;for(let x=0;x<_;x++){const y=ps(r,e,!1);e+=2,c.push(Jr(r,e,y)),e+=y}}else if(v==="TLEN")for(let _=0;_<c.length;_++)f.push(ps(r,e,!1)),e+=2;else if(v==="STRC"){const _=Qs(r,e,i);e+=4;for(let x=0;x<_;x++){const y=ps(r,e,!1);e+=2;const T=ps(r,e,!1);e+=2;const R=[];for(let S=0;S<T;S++){const b=ps(r,e,!1);e+=2;const C=ps(r,e,!1);e+=2,R.push({typeIndex:b,nameIndex:C})}p.push({typeIndex:y,fields:R})}}else break}const m=new Map;l.forEach((v,_)=>m.set(v,_));const h=new Map;return c.forEach((v,_)=>h.set(v,_)),{nameToIdx:m,typeToIdx:h,typeSizes:f,structs:p,names:l,types:c}}function Js(r,e,i){const s=[],l=r.structs[e];if(!l)return s;let c=0;for(const f of l.fields){const p=r.names[f.nameIndex]||"?",m=r.types[f.typeIndex]||"?";let h=p,v=0;const _=p.indexOf("[");_!==-1&&(h=p.slice(0,_),v=parseInt(p.slice(_+1),10)||0);const x=CC(r,m,i),y=v>0?x*v:x,T=Math.min(x,i);T>0&&(c=Math.ceil(c/T)*T),s.push({name:h,type:m,offset:c,size:y,isArray:v>0,arraySize:v}),c+=y}return s}function Ca(r,e,i,s,l){const c=lm(i);if(yl(i))return _y(r,e,s,l);switch(c){case"char":case"uchar":return Jr(r,e,1);case"short":case"ushort":return ps(r,e,l);case"int":return Qs(r,e,l);case"uint":return wC(r,e,l);case"float":return vy(r,e,l);case"double":return r.getFloat64(e,l);case"int64_t":return Number(r.getBigInt64(e,l));case"uint64_t":return Number(r.getBigUint64(e,l));default:return 0}}function yy(r,e,i,s){const l=[];for(let c=0;c<i;c++)l.push(vy(r,e+c*4,s));return l}const NC={0:"EMPTY",1:"MESH",2:"CURVE",3:"SURFACE",4:"FONT",5:"META",6:"LATTICE",7:"ARMATURE",8:"GPENCIL",10:"LAMP",11:"CAMERA",13:"VOLUME",14:"CURVES",15:"POINTCLOUD",16:"GREASEPENCIL"};function DC(r){switch(r){case"MESH":return"cube";case"LAMP":return"pointlight";case"CAMERA":return"sphere";case"CURVE":case"SURFACE":case"FONT":return"cylinder";default:return"cube"}}function no(r,e){const i=r.typeToIdx.get(e);if(i===void 0)return null;for(let s=0;s<r.structs.length;s++)if(r.structs[s].typeIndex===i)return s;return null}const pu=["#f59e0b","#3b82f6","#10b981","#ec4899","#8b5cf6","#06b6d4","#f43f5e","#a855f7"];let zC=0;function R_(r){let e=r,i=new Uint8Array(e),s=!1;if(i.length>=4&&i[0]===40&&i[1]===181&&i[2]===47&&i[3]===253)try{const H=AC(i);e=H.buffer,i=H,s=!0}catch(H){throw new Error("Failed to decompress Zstandard .blend: "+(H.message||H))}const l=new DataView(e,i.byteOffset,i.byteLength);if(i.byteLength<12)throw new Error("File too small to be a valid .blend file.");let c="";for(let H=0;H<7;H++)c+=String.fromCharCode(i[H]);if(c!=="BLENDER")throw new Error("Invalid header signature — not a .blend file.");const f=String.fromCharCode(i[7],i[8]);if(f!=="17")throw new Error(`Unsupported .blend file format (header size ${f}). Only Blender 5.x (17-byte header) is supported.`);const p=8,m=String.fromCharCode(i[12])==="v",h=m?"little":"big";let v="";for(let H=14;H<17;H++)v+=String.fromCharCode(i[H]);const _=parseInt(v[0],10),x=v.slice(1).replace(/^0+/,"")||"0",y=`v${_}.${x}`;function T(H){const B=[],Y=[];let ee=17,ve=8192;for(;ee+4<=i.byteLength;){let ce="";for(let ke=0;ke<4;ke++){const Ze=i[ee+ke];Ze>=32&&Ze<=126&&(ce+=String.fromCharCode(Ze))}if(ce=ce.trim(),ce==="ENDB"){Y.push({code:"ENDB",size:0,count:1});break}if(ee+H.size>i.byteLength)return null;if(!ce){if(ve-- >0){ee++;continue}return null}const A=Qs(l,ee+H.sdnaOffset,m),X=_y(l,ee+H.oldOffset,8,m),ne=H.lenSize===8?Number(l.getBigInt64(ee+H.lenOffset,m)):Qs(l,ee+H.lenOffset,m),L=Qs(l,ee+H.nrOffset,m);if(ne<0||ne>1e9){if(ve-- >0){ee++;continue}return null}const Ee=i.byteLength-(ee+H.size);if(ne>Ee){if(ve-- >0){ee++;continue}return null}const Re=ee+H.size,Ve=Y.find(ke=>ke.code===ce);Ve?(Ve.count+=L,Ve.size+=ne):Y.push({code:ce,size:ne,count:L}),B.push({code:ce,size:ne,count:L,oldPtr:X,sdnaIndex:A,dataOffset:Re}),ee+=H.size+ne}return{blocks:B,blocksList:Y}}let R=T({size:24,lenSize:4,lenOffset:4,oldOffset:8,sdnaOffset:16,nrOffset:20});if(R||(R=T({size:28,lenSize:4,lenOffset:4,oldOffset:12,sdnaOffset:20,nrOffset:24})),R||(R=T({size:28,lenSize:8,lenOffset:4,oldOffset:12,sdnaOffset:20,nrOffset:24})),!R)throw new Error("Failed to parse .blend file: the scanner could not reach ENDB. File may be damaged.");const{blocks:S,blocksList:b}=R;let C=0,I=0,F=0,q=0,z=0,j=0,w=0;for(const H of S)H.code==="OB"?C+=H.count:H.code==="ME"?I+=H.count:H.code==="LA"?F+=H.count:H.code==="CA"?q+=H.count:H.code==="MA"?z+=H.count:H.code==="REND"?j+=H.count:H.code==="SC"&&(w+=H.count);const O=S.find(H=>H.code==="DNA1"),G=O?RC(l,O.dataOffset,m):null,V=new Map;for(const H of S)H.oldPtr!==0&&V.set(H.oldPtr,H);const Q=S.filter(H=>H.code==="REND");let Z=null;if(G&&Q.length>0){const H=Q[0],B=new DataView(l.buffer,l.byteOffset+H.dataOffset,H.size);Z=LC(B,G,p,m)}const ae=S.filter(H=>H.code==="SC");let W=null;if(G&&ae.length>0){const H=ae[0],B=new DataView(l.buffer,l.byteOffset+H.dataOffset,H.size);W=UC(B,G,p,m,l,V)}const D=S.filter(H=>H.code==="OB"),k=[];if(G&&D.length>0){const H=no(G,"Object");for(const B of D){let Y=function(qe){for(const lt of ce)if(lt.name===qe)return lt.isArray&&(lt.type==="float"||lm(lt.type)==="float")?yy(A,lt.offset,lt.arraySize,m):Ca(A,lt.offset,lt.type,p,m);return null};const ee=B.sdnaIndex;if(ee<0||ee>=G.structs.length)continue;const ve=ee>=0&&ee<G.structs.length?ee:H;if(ve===null)continue;const ce=Js(G,ve,p);if(ce.length===0)continue;const A=new DataView(l.buffer,l.byteOffset+B.dataOffset,B.size),X=Y("type"),ne=typeof X=="string"?X.charCodeAt(0):Number(X)||0,L=NC[ne]||"EMPTY";let Ee="Object";for(const qe of ce)if(qe.name==="id"){const lt=no(G,"ID");if(lt!==null){const ze=Js(G,lt,p),gt=new DataView(l.buffer,l.byteOffset+B.dataOffset+qe.offset,qe.size);for(const te of ze)if(te.name==="name"&&te.size>0){const nt=Jr(gt,te.offset,Math.min(te.size,66)).replace(/[^a-zA-Z0-9_\-. ]/g,"").trim();nt&&(Ee=nt);break}}break}const Re=Y("loc")||[0,0,0],Ve=Y("rot")||[0,0,0],ke=Y("scale")||[1,1,1],Ze=Y("data"),at={id:"blend-"+ni(),name:Ee,type:DC(L),position:{x:Re[0]??0,y:Re[1]??0,z:Re[2]??0},rotation:{x:(Ve[0]??0)*180/Math.PI,y:(Ve[1]??0)*180/Math.PI,z:(Ve[2]??0)*180/Math.PI},scale:{x:ke[0]??1,y:ke[1]??1,z:ke[2]??1},color:pu[zC++%pu.length],roughness:.4,metalness:.1,emissive:"#000000",wireframe:!1,intensity:1,visible:!0,locked:!1};if(Ze!==null&&L==="MESH"){const qe=V.get(Number(Ze));if(qe&&G&&qe.sdnaIndex>=0){const lt=OC(l,qe,G,p,m);lt.length>0&&(at.stlVertices=lt)}}k.push(at)}}else for(let H=0;H<D.length;H++){const B=H/Math.max(1,D.length)*Math.PI*2,Y=1.5+Math.random()*2,ee=["cube","sphere","cylinder","cone","torus"];k.push({id:"blend-"+ni(),name:`Object_${H+1}`,type:ee[H%ee.length],position:{x:Math.sin(B)*Y,y:.5,z:Math.cos(B)*Y},rotation:{x:0,y:Math.random()*360,z:0},scale:{x:1,y:1,z:1},color:pu[H%pu.length],roughness:.4,metalness:.1,emissive:"#000000",wireframe:!1,intensity:1,visible:!0,locked:!1})}return k.some(H=>H.type==="pointlight"||H.type==="directionallight")||k.push({id:"blend-light-"+ni(),name:"Sun",type:"directionallight",position:{x:6,y:10,z:6},rotation:{x:-45,y:45,z:0},scale:{x:1,y:1,z:1},color:"#ffffff",roughness:1,metalness:0,emissive:"#000000",wireframe:!1,intensity:1.3,visible:!0,locked:!1}),{summary:{valid:!0,version:y,pointerSize:p,endianness:h,objectCount:C,meshCount:I,lampCount:F,cameraCount:q,materialCount:z,rendCount:j,sceneCount:w,totalBlocks:S.length,blocksList:b.sort((H,B)=>B.size-H.size),compressed:s,renderSettings:Z,sceneSettings:W},sceneObjects:k}}function LC(r,e,i,s){const l={engine:"UNKNOWN",resolutionX:1920,resolutionY:1080,resolutionPercentage:100,samples:64,tileX:256,tileY:256,fps:24,frameStart:1,frameEnd:250},c=no(e,"RenderData");if(c===null)return l;const f=Js(e,c,i);if(f.length===0)return l;const p={...l};function m(q){for(const z of f)if(z.name===q)return Ca(r,z.offset,z.type,i,s);return null}function h(q){const z=m(q);return typeof z=="number"?z:typeof z=="string"?z.charCodeAt(0):0}const v=h("xsch"),_=h("ysch");v>0&&(p.resolutionX=v),_>0&&(p.resolutionY=_);const x=h("size");x>0&&(p.resolutionPercentage=x);const y=h("freq_visible");y>0&&(p.fps=y);const T=h("sfra"),R=h("efra");T>0&&(p.frameStart=T),R>0&&(p.frameEnd=R);const S=h("tilex"),b=h("tiley");S>0&&(p.tileX=S),b>0&&(p.tileY=b);const C=h("parts");C>0&&(p.samples=C);const I=m("engine");if(I){const q=typeof I=="string"?I.charCodeAt(0):Number(I),z={1:"BLENDER_EEVEE",2:"CYCLES",3:"WORKBENCH",4:"BLENDER_EEVEE_NEXT"};p.engine=z[q]||p.engine}h("simplify_subsurf_d");const F=m("samples");return F&&typeof F=="number"&&F>0&&(p.samples=F),p}function UC(r,e,i,s,l,c){const f={activeCameraPtr:null,background:"#303030",unitSystem:"METRIC",unitScale:1},p=no(e,"Scene");if(p===null)return f;const m=Js(e,p,i);if(m.length===0)return f;const h={...f};function v(y){for(const T of m)if(T.name===y)return Ca(r,T.offset,T.type,i,s);return null}const _=v("camera");_!==null&&typeof _=="number"&&_!==0&&(h.activeCameraPtr=_);const x=v("world");if(x!==null&&typeof x=="number"&&x!==0){const y=c.get(x);if(y&&y.code==="WO"){const T=no(e,"World");if(T!==null&&y.sdnaIndex>=0&&y.sdnaIndex<e.structs.length){let R=function(q){for(const z of S)if(z.name===q)return Ca(b,z.offset,z.type,i,s);return null};const S=Js(e,T,i),b=new DataView(l.buffer,l.byteOffset+y.dataOffset,y.size),C=R("horr"),I=R("horg"),F=R("hornb");if(typeof C=="number"&&typeof I=="number"&&typeof F=="number"){const q=Math.round(Math.max(0,Math.min(1,C))*255),z=Math.round(Math.max(0,Math.min(1,I))*255),j=Math.round(Math.max(0,Math.min(1,F))*255);h.background=`#${q.toString(16).padStart(2,"0")}${z.toString(16).padStart(2,"0")}${j.toString(16).padStart(2,"0")}`}}}}for(const y of m)if(y.name==="unit"){const T=no(e,"UnitSettings");if(T!==null){const R=Js(e,T,i);if(R.length>0){const S=new DataView(r.buffer,r.byteOffset+y.offset,y.size);for(const b of R){if(b.name==="system"){const C=Ca(S,b.offset,b.type,i,s),I=typeof C=="number"?C:0;I===0?h.unitSystem="NONE":I===1?h.unitSystem="METRIC":I===2&&(h.unitSystem="IMPERIAL")}if(b.name==="scale_length"){const C=Ca(S,b.offset,b.type,i,s);typeof C=="number"&&C>0&&(h.unitScale=C)}}}}break}return h}function OC(r,e,i,s,l){const c=e.sdnaIndex;if(c<0||c>=i.structs.length)return[];const f=Js(i,c,s);if(f.length===0)return[];const p=new DataView(r.buffer,r.byteOffset+e.dataOffset,e.size);let m=0;for(const h of f)(h.name==="totvert"||h.name==="tot_vert")&&(m=Number(Ca(p,h.offset,h.type,s,l))||0),h.name==="mvert"&&yl(h.type)&&Number(Ca(p,h.offset,h.type,s,l)),h.name==="mvert"&&h.isArray&&h.size;if(m===0)for(const h of f)h.name==="vert_positions"&&yl(h.type)&&Number(Ca(p,h.offset,h.type,s,l));if(m===0)return[];for(const h of f)if((h.name==="mvert"||h.name==="verts"||h.name==="_verts")&&!yl(h.type)&&h.isArray&&Math.floor(h.size/4)>=m*3)return yy(p,h.offset,m*3,l);return[]}function PC(r="0500",e=!1){if(e)throw new Error("Compressed sample blend not available for v1 format. Load a real compressed .blend file instead.");const i=new ArrayBuffer(1024),s=new Uint8Array(i),l=new DataView(i),c=`BLENDER17-01v${r.padStart(4,"0")}`;for(let h=0;h<17;h++)s[h]=c.charCodeAt(h);let f=17;const p=24,m=(h,v,_)=>{if(!(f+p+v>i.byteLength)){for(let x=0;x<4;x++)s[f+x]=h.charCodeAt(x)||32;l.setInt32(f+4,v,!0),l.setBigUint64(f+8,BigInt(0x1234567890abce00),!0),l.setInt32(f+16,0,!0),l.setInt32(f+20,_,!0),f+=p+v}};return m("GLOB",100,1),m("OB",80,1),m("ME",120,1),m("LA",100,1),m("ENDB",0,1),s.slice(0,f).buffer}function IC(){var kt;const[r,e]=Oe.useState(Np()),[i,s]=Oe.useState("default-cube-id"),[l,c]=Oe.useState(0),[f,p]=Oe.useState(!1),[m,h]=Oe.useState([]),[v,_]=Oe.useState(!0),[x,y]=Oe.useState(!0),[T,R]=Oe.useState(!0),[S,b]=Oe.useState([]),[C,I]=Oe.useState(null),[F,q]=Oe.useState(!0),[z,j]=Oe.useState(!1),[w,O]=Oe.useState("layout"),[G,V]=Oe.useState([]),[Q,Z]=Oe.useState(null),[ae,W]=Oe.useState(!1),[D,k]=Oe.useState([]),ie=Oe.useRef(null),J=Oe.useRef(null),H=Oe.useRef(null),[B,Y]=Oe.useState(!1),[ee,ve]=Oe.useState(null),[ce,A]=Oe.useState([]);Oe.useEffect(()=>{const E=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}`,K=new WebSocket(E);return ie.current=K,K.onopen=()=>{W(!0)},K.onmessage=ue=>{try{const he=JSON.parse(ue.data);switch(he.type){case"welcome":Z(he.profile);break;case"init":he.sceneObjects&&e(he.sceneObjects),he.keyframes&&h(he.keyframes);break;case"scene:sync":he.sceneObjects&&e(he.sceneObjects),he.keyframes&&h(he.keyframes);break;case"presence:sync":he.users&&V(he.users);break;case"chat:message":k(Me=>[...Me,he]);break;default:break}}catch(he){console.error("Failed to parse websocket message",he)}},K.onclose=()=>{W(!1)},()=>{K.close()}},[]),Oe.useEffect(()=>{ie.current&&ie.current.readyState===WebSocket.OPEN&&ie.current.send(JSON.stringify({type:"presence:update",selectedObjectId:i}))},[i]);const X=(N,E)=>{e(N);const K=E!==void 0?E:m;E!==void 0&&h(E),ie.current&&ie.current.readyState===WebSocket.OPEN&&ie.current.send(JSON.stringify({type:"scene:update",sceneObjects:N,keyframes:K}))},ne=N=>{ie.current&&ie.current.readyState===WebSocket.OPEN&&ie.current.send(JSON.stringify({type:"chat:sendMessage",text:N}))},L=r.find(N=>N.id===i);Oe.useEffect(()=>{w==="shading"?_(!0):w==="animation"&&(p(!1),c(0))},[w]),Oe.useEffect(()=>{const N=E=>{var K,ue;if(!(((K=document.activeElement)==null?void 0:K.tagName)==="INPUT"||((ue=document.activeElement)==null?void 0:ue.tagName)==="TEXTAREA"))switch(E.key){case"Backspace":case"Delete":i&&Ve(i);break;case" ":E.preventDefault(),p(he=>!he);break;case"i":case"I":i&&qe();break;case"Escape":s(null);break}};return window.addEventListener("keydown",N),()=>window.removeEventListener("keydown",N)},[i,l,r]);const Ee=N=>{const E=r.filter(be=>be.type===N).length,K=E>0?`.${String(E).padStart(3,"0")}`:"",he=`${N.charAt(0).toUpperCase()+N.slice(1)}${K}`,Me=N==="plane"?0:.5,Ne={id:ni(),name:he,type:N,position:{x:(Math.random()-.5)*3,y:Me,z:(Math.random()-.5)*3},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},color:N==="pointlight"||N==="directionallight"?"#fbf0b5":"#a1a1aa",roughness:.5,metalness:.1,emissive:"#000000",wireframe:!1,intensity:1,visible:!0,locked:!1};p(!1);const de=[...r,Ne];X(de),s(Ne.id)},Re=(N,E)=>{const K=r.map(ue=>ue.id===N?{...ue,...E}:ue);X(K)},Ve=N=>{const E=r.filter(ue=>ue.id!==N),K=m.filter(ue=>ue.objectId!==N);X(E,K),i===N&&s(null)},ke=(N,E)=>{try{const K=cC(N);if(K.vertices.length===0){alert("The parsed STL file does not contain any valid geometry/vertices.");return}const ue=Array.from(K.vertices),he=K.normals?Array.from(K.normals):void 0,Me=E.replace(/\.stl$/i,""),Ne=Me.charAt(0).toUpperCase()+Me.slice(1),de={id:"stl-"+ni(),name:Ne,type:"stl",position:{x:0,y:.8,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},color:"#10b981",roughness:.4,metalness:.3,emissive:"#000000",wireframe:!1,intensity:1,visible:!0,locked:!1,stlVertices:ue,stlNormals:he};p(!1),X([...r,de]),s(de.id)}catch(K){console.error("Failed to parse STL array:",K),alert("Error parsing STL geometry data. Make sure it is a valid ASCII or Binary STL file.")}},Ze=N=>{var ue;const E=(ue=N.target.files)==null?void 0:ue[0];if(!E)return;const K=new FileReader;K.onload=he=>{var Ne;const Me=(Ne=he.target)==null?void 0:Ne.result;Me&&ke(Me,E.name)},K.readAsArrayBuffer(E),N.target.value=""},at=()=>{const N=uC();ke(N,"lowPoly_Rocket.stl")},qe=()=>{if(!L)return;const N=[...m.filter(E=>!(E.objectId===L.id&&E.frame===l)),{id:ni(),objectId:L.id,frame:l,position:{...L.position},rotation:{...L.rotation},scale:{...L.scale}}];X(r,N)},lt=()=>{if(!i)return;const N=m.filter(E=>E.objectId!==i);X(r,N)},ze=()=>{X(r,[])},gt=()=>{if(window.confirm("Restore legendary default Blender cube workspace clear?")){const N=Np();X(N,[]),s("default-cube-id"),c(0),p(!1)}},te=()=>{const E=JSON.stringify({sceneObjects:r,keyframes:m,gridVisible:v,axesVisible:x,shadowsEnabled:T},null,2),K=new Blob([E],{type:"application/json"}),ue=URL.createObjectURL(K),he=document.createElement("a");he.href=ue,he.download=`blender_web_project_${new Date().toISOString().split("T")[0]}.json`,he.click(),URL.revokeObjectURL(ue)},vt=N=>{var ue;const E=(ue=N.target.files)==null?void 0:ue[0];if(!E)return;const K=new FileReader;K.onload=he=>{var Me,Ne;try{const de=JSON.parse((Me=he.target)==null?void 0:Me.result);if(de.sceneObjects&&Array.isArray(de.sceneObjects)){const be=de.sceneObjects,Le=de.keyframes||[];X(be,Le),de.gridVisible!==void 0&&_(de.gridVisible),de.axesVisible!==void 0&&y(de.axesVisible),de.shadowsEnabled!==void 0&&R(de.shadowsEnabled),s(((Ne=de.sceneObjects[0])==null?void 0:Ne.id)||null),p(!1),c(0)}else alert("Invalid file: Must contain an array of sceneObjects.")}catch(de){alert("JSON syntax error: "+de)}},K.readAsText(E),N.target.value=""},nt=N=>{var ue;const E=(ue=N.target.files)==null?void 0:ue[0];if(!E)return;const K=new FileReader;K.onload=he=>{var Ne;const Me=(Ne=he.target)==null?void 0:Ne.result;if(Me)try{const{summary:de,sceneObjects:be}=R_(Me);ve(de),A(be),Y(!0)}catch(de){alert(`Failed to open .blend file: ${de.message||de}`)}},K.readAsArrayBuffer(E),N.target.value=""},pt=N=>{var E,K;if(ce.length>0){if(N==="replace")X(ce,[]),s(((E=ce[0])==null?void 0:E.id)||null);else{const ue=[...r];ce.forEach(he=>{const Ne=ue.some(de=>de.id===he.id)?he.id+"-"+ni():he.id;ue.push({...he,id:Ne})}),X(ue),s(((K=ce[0])==null?void 0:K.id)||null)}p(!1),c(0),Y(!1),ve(null),A([])}},Pe=()=>{const N=document.querySelector("#blender-threejs-viewport canvas");if(!N){alert("Viewport Canvas element not found in active screen.");return}const E=N.toDataURL("image/png"),K=document.createElement("a");K.href=E,K.download=`blender_web_render_${Date.now()}.png`,K.click()};return g.jsxs("div",{id:"blender-app-root",className:"flex flex-col h-screen w-screen bg-zinc-950 text-zinc-200 select-none overflow-hidden font-sans",children:[g.jsxs("header",{className:"h-11 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between shrink-0 select-none",children:[g.jsxs("div",{className:"flex items-center gap-5",children:[g.jsxs("div",{className:"flex items-center gap-2",children:[g.jsx("div",{className:"w-5 h-5 rounded-full bg-gradient-to-tr from-orange-650 to-orange-500 shadow-md flex items-center justify-center font-black text-black text-[11px] leading-none select-none italic",children:"B"}),g.jsxs("span",{className:"text-xs font-bold tracking-tight text-white font-mono uppercase",children:["Blender ",g.jsx("span",{className:"text-orange-500 font-extrabold text-[10px]",children:"Web"})]})]}),g.jsx("div",{className:"h-4 w-px bg-zinc-800"}),g.jsxs("nav",{className:"flex items-center gap-1.5 text-xs text-zinc-400",children:[g.jsxs("div",{className:"relative group",children:[g.jsx("button",{className:"px-2 py-1.5 hover:text-white rounded hover:bg-zinc-900 transition flex items-center gap-1",children:"File"}),g.jsxs("div",{className:"absolute left-0 mt-0.5 w-44 bg-zinc-900 border border-zinc-800 rounded shadow-xl py-1 hidden group-hover:block hover:block z-30 font-sans",children:[g.jsxs("button",{id:"btn-revert-scene",onClick:gt,className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2",children:[g.jsx(Nu,{className:"w-3.5 h-3.5 text-zinc-500"}),"New Project"]}),g.jsxs("button",{id:"btn-export-project",onClick:te,className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2",children:[g.jsx(py,{className:"w-3.5 h-3.5 text-zinc-500"}),"Save Project (.json)"]}),g.jsxs("label",{className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 cursor-pointer",children:[g.jsx(hl,{className:"w-3.5 h-3.5 text-zinc-500"}),"Open Project...",g.jsx("input",{id:"import-raw-json-selector",type:"file",accept:".json",className:"hidden",onChange:vt})]}),g.jsx("div",{className:"border-t border-zinc-800 my-1"}),g.jsx("div",{className:"text-[9px] uppercase tracking-wider font-bold text-orange-500 px-3.5 py-1",children:"Blender Native"}),g.jsxs("button",{id:"btn-file-open-blend",onClick:()=>{var N;return(N=H.current)==null?void 0:N.click()},className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-orange-400 font-semibold",children:[g.jsx(hl,{className:"w-3.5 h-3.5 text-orange-500"}),"Open .blend file..."]}),g.jsx("input",{id:"import-blend-selector",type:"file",accept:".blend",className:"hidden",ref:H,onChange:nt}),g.jsxs("button",{id:"btn-file-load-sample-blend",onClick:()=>{const N=PC("511",!1);try{const{summary:E,sceneObjects:K}=R_(N);ve(E),A(K),Y(!0)}catch(E){alert(`Failed to open sample blend: ${E.message||E}`)}},className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-zinc-300",children:[g.jsx(yi,{className:"w-3.5 h-3.5 text-orange-500"}),"Load Sample .blend (v5.11)"]}),g.jsx("div",{className:"border-t border-zinc-800 my-1"}),g.jsx("div",{className:"text-[9px] uppercase tracking-wider font-bold text-zinc-500 px-3.5 py-1",children:"STL Operations"}),g.jsxs("button",{id:"btn-file-import-stl",onClick:()=>{var N;return(N=J.current)==null?void 0:N.click()},className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-emerald-400",children:[g.jsx(hl,{className:"w-3.5 h-3.5 text-emerald-500"}),"Import STL..."]}),g.jsxs("button",{id:"btn-file-load-sample",onClick:at,className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-zinc-300",children:[g.jsx(yi,{className:"w-3.5 h-3.5 text-amber-500"}),"Load Rocket STL"]})]})]}),g.jsxs("div",{className:"relative group",children:[g.jsx("button",{className:"px-2 py-1.5 hover:text-white rounded hover:bg-zinc-900 transition flex items-center gap-1",children:"Add"}),g.jsxs("div",{className:"absolute left-0 mt-0.5 w-48 bg-zinc-900 border border-zinc-800 rounded shadow-xl py-1.5 hidden group-hover:block hover:block z-30 font-sans",children:[g.jsx("div",{className:"text-[9px] uppercase tracking-wider font-bold text-zinc-500 px-3.5 py-1",children:"Mesh Objects"}),["cube","sphere","cylinder","cone","torus","plane"].map(N=>g.jsxs("button",{id:`btn-add-menu-${N}`,onClick:()=>Ee(N),className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 capitalize text-zinc-300",children:[g.jsx(uu,{className:"w-3 h-3 text-orange-500"}),N]},N)),g.jsx("div",{className:"border-t border-zinc-800 my-1"}),g.jsx("div",{className:"text-[9px] uppercase tracking-wider font-bold text-zinc-500 px-3.5 py-1",children:"Import STL"}),g.jsxs("button",{id:"btn-add-stl-file",onClick:()=>{var N;return(N=J.current)==null?void 0:N.click()},className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-emerald-400 font-medium",children:[g.jsx(hl,{className:"w-3 h-3 text-emerald-500"}),"Import STL File..."]}),g.jsxs("button",{id:"btn-add-stl-sample",onClick:at,className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-zinc-300",children:[g.jsx(yi,{className:"w-3 h-3 text-amber-500"}),"Sample SpaceShip STL"]}),g.jsx("div",{className:"border-t border-zinc-800 my-1"}),g.jsx("div",{className:"text-[9px] uppercase tracking-wider font-bold text-zinc-500 px-3.5 py-1",children:"Lighting elements"}),g.jsxs("button",{id:"btn-add-light-point",onClick:()=>Ee("pointlight"),className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-zinc-300",children:[g.jsx(uu,{className:"w-3 h-3 text-yellow-500"}),"Point Light"]}),g.jsxs("button",{id:"btn-add-light-directional",onClick:()=>Ee("directionallight"),className:"w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-zinc-300",children:[g.jsx(uu,{className:"w-3 h-3 text-yellow-500"}),"Sun Light"]})]})]}),g.jsxs("button",{id:"btn-header-render-image",onClick:Pe,className:"px-2 py-1.5 hover:text-white rounded hover:bg-zinc-900 transition flex items-center gap-1.5 text-zinc-400",children:[g.jsx(B3,{className:"w-3.5 h-3.5 text-zinc-500"}),"Render PNG"]})]})]}),g.jsxs("div",{className:"flex bg-zinc-900 backdrop-blur border border-zinc-800/80 p-0.5 rounded-md gap-0.5 text-[10px] font-semibold text-zinc-400",children:[g.jsx("button",{id:"layout-mode-layout",onClick:()=>O("layout"),className:`px-3 py-1 rounded transition ${w==="layout"?"bg-zinc-850 text-white font-bold":"hover:bg-zinc-800 hover:text-zinc-200"}`,children:"Layout Design"}),g.jsx("button",{id:"layout-mode-shading",onClick:()=>O("shading"),className:`px-3 py-1 rounded transition ${w==="shading"?"bg-zinc-850 text-white font-bold":"hover:bg-zinc-800 hover:text-zinc-200"}`,children:"Material Shading"}),g.jsx("button",{id:"layout-mode-animation",onClick:()=>O("animation"),className:`px-3 py-1 rounded transition ${w==="animation"?"bg-zinc-850 text-white font-bold":"hover:bg-zinc-800 hover:text-zinc-200"}`,children:"Keyframe Animation"}),g.jsx("button",{id:"layout-mode-video",onClick:()=>O("video"),className:`px-3 py-1 rounded transition ${w==="video"?"bg-zinc-850 text-white font-bold":"hover:bg-zinc-800 hover:text-zinc-200"}`,children:"Video Sequencer"})]}),G.length>0&&g.jsxs("div",{className:"flex items-center gap-1.5 mr-2 bg-zinc-900 border border-zinc-800/80 px-2 py-1 rounded",children:[g.jsx("span",{className:"text-[9px] text-zinc-500 uppercase tracking-wider font-bold",children:"Editors:"}),g.jsx("div",{className:"flex -space-x-1 overflow-hidden",children:G.map(N=>{var E;return g.jsx("div",{className:"w-5 h-5 rounded-full border border-zinc-950 flex items-center justify-center text-[9px] font-black select-none uppercase",style:{backgroundColor:N.color,color:"#18181b"},title:`${N.name} ${N.selectedObjectId?`(Editing ${((E=r.find(K=>K.id===N.selectedObjectId))==null?void 0:E.name)||"object"})`:"(Idle)"}`,children:N.name.charAt(0)},N.id)})})]}),g.jsxs("div",{className:"flex items-center gap-2 font-sans",children:[typeof window<"u"&&window.electronAPI&&g.jsxs("div",{className:"flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded text-[10px] text-emerald-400 font-mono tracking-tight shadow-inner",children:[g.jsx(v_,{className:"w-3.5 h-3.5 text-emerald-400 animate-pulse"}),g.jsx("span",{className:"hidden sm:inline font-bold",children:"DESKTOP STUDIO ACTIVE"})]}),g.jsx("button",{id:"btn-trigger-shortcuts-panel",onClick:()=>j(N=>!N),className:`p-1.5 rounded border transition hover:text-white ${z?"bg-orange-650/15 border-orange-500/30 text-orange-400":"border-zinc-800 text-zinc-450 hover:bg-zinc-900"}`,title:"Spatials Shortcurts reference",children:g.jsx(m_,{className:"w-4 h-4"})})]})]}),g.jsxs("main",{className:"flex-1 flex overflow-hidden relative",children:[g.jsx(sC,{sceneObjects:r,onApplyAIChanges:N=>X(N),isOpen:F,setIsOpen:q,wsMessages:D,onSendWSMessage:ne,myProfile:Q,wsConnected:ae}),w==="video"?g.jsx("div",{className:"flex-1 h-full relative overflow-hidden flex flex-col",children:g.jsx(rC,{sceneObjects:r,keyframes:m,currentFrame:l,setCurrentFrame:c,isPlaying:f,setIsPlaying:p})}):g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"flex-1 h-full relative overflow-hidden flex flex-col",children:[g.jsxs("div",{className:"absolute top-4 left-1/2 transform -translate-x-1/2 bg-zinc-950/95 border border-zinc-805 border-zinc-800 p-1 rounded-full shadow-2xl flex items-center gap-1.5 z-20 backdrop-blur-sm",children:[g.jsx("span",{className:"text-[9px] uppercase tracking-widest font-bold text-zinc-500 font-mono pl-3 pr-2 select-none border-r border-zinc-900",children:"Add shape"}),[{type:"cube",label:"Cube"},{type:"sphere",label:"Sphere"},{type:"cylinder",label:"Cylinder"},{type:"cone",label:"Cone"},{type:"torus",label:"Torus"}].map(N=>g.jsx("button",{id:`btn-add-float-${N.type}`,onClick:()=>Ee(N.type),className:"px-2.5 py-1 text-[10px] rounded-full text-zinc-300 hover:text-white bg-zinc-90 w-auto hover:bg-zinc-800/80 transition font-sans select-none capitalize leading-none",children:N.type},N.type)),g.jsx("span",{className:"w-px h-3.5 bg-zinc-800/80 self-center"}),g.jsxs("button",{id:"btn-add-float-stl-custom",onClick:()=>{var N;return(N=J.current)==null?void 0:N.click()},className:"px-2.5 py-1 text-[10px] rounded-full text-emerald-400 hover:text-white hover:bg-emerald-950/30 transition font-sans flex items-center gap-1 leading-none cursor-pointer",title:"Import custom STL mesh from your computer",children:[g.jsx(hl,{className:"w-3 h-3 text-emerald-500"}),"Import STL"]}),g.jsxs("button",{id:"btn-add-float-stl-sample",onClick:at,className:"px-2.5 py-1 text-[10px] rounded-full text-indigo-300 hover:text-white hover:bg-indigo-950/30 transition font-sans flex items-center gap-1 leading-none cursor-pointer",title:"Load pre-packaged rocket spaceship model",children:[g.jsx(yi,{className:"w-3 h-3 text-amber-400"}),"Sample SpaceShip"]})]}),g.jsx("input",{id:"stl-model-raw-selector",type:"file",accept:".stl",ref:J,className:"hidden",onChange:Ze}),g.jsx(D3,{sceneObjects:r,selectedObjectId:i,onSelectObject:s,onUpdateObjectTransform:(N,E)=>{const K=r.find(ue=>ue.id===N);K&&K.locked||Re(N,E)},currentFrame:l,keyframes:m,gridVisible:v,axesVisible:x,shadowsEnabled:T,isPlaying:f,slicedToolpaths:S,activeSlicerLayer:C})]}),g.jsx(eC,{sceneObjects:r,selectedObjectId:i,onSelectObject:s,onUpdateObject:Re,onDeleteObject:Ve,gridVisible:v,setGridVisible:_,axesVisible:x,setAxesVisible:y,shadowsEnabled:T,setShadowsEnabled:R,keyframes:m,currentFrame:l,onSlicingChanged:b,activeSlicerLayer:C,setActiveSlicerLayer:I})]}),z&&g.jsx("div",{className:"absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:g.jsxs("div",{className:"bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-6 shadow-2xl relative select-none",children:[g.jsx("button",{id:"btn-close-help",onClick:()=>j(!1),className:"absolute top-4 right-4 p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white",children:g.jsx(E_,{className:"w-4 h-4"})}),g.jsxs("div",{className:"flex items-center gap-2 text-orange-500 font-bold border-b border-zinc-800 pb-3 mb-4",children:[g.jsx(m_,{className:"w-5 h-5 text-orange-500"}),g.jsx("span",{className:"text-sm font-bold uppercase tracking-wider font-mono",children:"CAD Blender shortcuts Reference"})]}),g.jsxs("div",{className:"space-y-3 text-xs font-sans text-zinc-300",children:[g.jsxs("div",{className:"flex justify-between items-center bg-zinc-950 p-2 rounded",children:[g.jsx("span",{className:"font-mono text-zinc-500 uppercase",children:"Spacebar"}),g.jsx("span",{className:"font-bold text-orange-400",children:"Play / Pause Timeline"})]}),g.jsxs("div",{className:"flex justify-between items-center bg-zinc-950 p-2 rounded",children:[g.jsx("span",{className:"font-mono text-zinc-500 uppercase",children:"I key"}),g.jsx("span",{className:"font-bold text-orange-400",children:"Record Anim Keyframe"})]}),g.jsxs("div",{className:"flex justify-between items-center bg-zinc-950 p-2 rounded",children:[g.jsx("span",{className:"font-mono text-zinc-500 uppercase",children:"Delete / Backspace"}),g.jsx("span",{className:"font-bold text-orange-400",children:"Delete Selected Mesh"})]}),g.jsxs("div",{className:"flex justify-between items-center bg-zinc-950 p-2 rounded",children:[g.jsx("span",{className:"font-mono text-zinc-500 uppercase",children:"Escape"}),g.jsx("span",{className:"font-bold text-orange-400",children:"Deselect Element"})]}),g.jsxs("div",{className:"flex justify-between items-center bg-zinc-950 p-2 rounded",children:[g.jsx("span",{className:"font-mono text-zinc-500 uppercase",children:"Double-Click List"}),g.jsx("span",{className:"font-bold text-orange-400",children:"Quick-Rename Item"})]})]}),g.jsxs("div",{className:"border-t border-zinc-800 my-4 pt-4",children:[g.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[g.jsx(v_,{className:"w-4 h-4 text-emerald-400"}),g.jsx("span",{className:"text-xs font-bold uppercase tracking-wider font-mono text-emerald-400",children:"Desktop Studio (Electron)"})]}),typeof window<"u"&&window.electronAPI?g.jsxs("div",{className:"bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded text-xs space-y-1.5",children:[g.jsxs("div",{className:"flex justify-between font-mono text-[10px]",children:[g.jsx("span",{className:"text-emerald-500 font-bold",children:"DESKTOP ENVIRONMENT:"}),g.jsxs("span",{className:"text-white",children:["Active (Platform: ",window.electronAPI.platform,")"]})]}),g.jsxs("div",{className:"flex justify-between font-mono text-[10px]",children:[g.jsx("span",{className:"text-emerald-500 font-bold",children:"CHROME ENGINE:"}),g.jsxs("span",{className:"text-zinc-400",children:["v",window.electronAPI.chromeVersion]})]}),g.jsxs("div",{className:"flex justify-between font-mono text-[10px]",children:[g.jsx("span",{className:"text-emerald-500 font-bold",children:"ELECTRON BUILD:"}),g.jsxs("span",{className:"text-zinc-400",children:["v",window.electronAPI.electronVersion]})]})]}):g.jsxs("div",{className:"bg-zinc-950 p-3 rounded text-zinc-400 space-y-2",children:[g.jsx("p",{className:"text-[11px] leading-relaxed",children:"You are currently running in **Web Sandbox mode**. This application is pre-configured to build and run as a **native desktop CAD modeler**!"}),g.jsxs("div",{className:"text-[10px] font-mono bg-zinc-900 border border-zinc-800 p-2 rounded text-zinc-300 select-all space-y-1",children:[g.jsx("div",{className:"text-amber-500",children:"# Run desktop app locally:"}),g.jsx("div",{children:"npm install"}),g.jsx("div",{children:"npm run electron:dev"})]})]})]}),g.jsx("p",{className:"text-[10px] text-zinc-500 leading-relaxed mt-4 text-center",children:"These hotkeys function exclusively when typing/active inside text entry forms are disabled."})]})}),B&&ee&&g.jsx("div",{className:"absolute inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4",children:g.jsxs("div",{className:"bg-zinc-900 border border-zinc-800 rounded-lg max-w-lg w-full p-6 shadow-2xl relative select-none",children:[g.jsx("button",{id:"btn-close-blend-modal",onClick:()=>{Y(!1),ve(null),A([])},className:"absolute top-4 right-4 p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white",children:g.jsx(E_,{className:"w-4 h-4"})}),g.jsxs("div",{className:"flex items-center gap-2 text-orange-500 font-bold border-b border-zinc-800 pb-3 mb-4",children:[g.jsx(Y3,{className:"w-5 h-5 text-orange-500 animate-pulse"}),g.jsx("span",{className:"text-sm font-bold uppercase tracking-wider font-mono",children:"Blender Native File Inspector"})]}),g.jsxs("div",{className:"space-y-4",children:[g.jsxs("div",{className:"bg-zinc-950 p-3 rounded-lg border border-zinc-800/60 space-y-2",children:[g.jsxs("div",{className:"flex items-center justify-between text-xs",children:[g.jsx("span",{className:"text-zinc-400",children:"File Type Validation:"}),g.jsxs("span",{className:"text-emerald-400 font-bold flex items-center gap-1 font-mono",children:[g.jsx(V3,{className:"w-3.5 h-3.5"})," VALID BINARY"]})]}),g.jsxs("div",{className:"flex items-center justify-between text-xs",children:[g.jsx("span",{className:"text-zinc-400",children:"Blender File Version:"}),g.jsx("span",{className:"text-white font-bold font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800",children:ee.version})]}),g.jsxs("div",{className:"flex items-center justify-between text-xs",children:[g.jsx("span",{className:"text-zinc-400",children:"Memory Architecture:"}),g.jsxs("span",{className:"text-zinc-300 font-mono",children:[ee.pointerSize,"-bit (",ee.endianness," endian)"]})]}),g.jsxs("div",{className:"flex items-center justify-between text-xs",children:[g.jsx("span",{className:"text-zinc-400",children:"Compression Format:"}),g.jsx("span",{className:`font-bold font-mono px-2 py-0.5 rounded border text-[10px] ${ee.compressed?"text-amber-400 bg-amber-950/40 border-amber-900/60":"text-zinc-500 bg-zinc-900 border-zinc-800"}`,children:ee.compressed?"Zstandard (ZSTD)":"None (Uncompressed)"})]})]}),g.jsxs("div",{children:[g.jsx("h4",{className:"text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono",children:"Detected File Blocks Summary"}),g.jsxs("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[g.jsxs("div",{className:"bg-zinc-950/60 p-2.5 rounded border border-zinc-800/40 flex justify-between",children:[g.jsx("span",{className:"text-zinc-500 font-mono",children:"Objects (OB):"}),g.jsx("span",{className:"text-orange-400 font-bold font-mono",children:ee.objectCount})]}),g.jsxs("div",{className:"bg-zinc-950/60 p-2.5 rounded border border-zinc-800/40 flex justify-between",children:[g.jsx("span",{className:"text-zinc-500 font-mono",children:"Meshes (ME):"}),g.jsx("span",{className:"text-blue-400 font-bold font-mono",children:ee.meshCount})]}),g.jsxs("div",{className:"bg-zinc-950/60 p-2.5 rounded border border-zinc-800/40 flex justify-between",children:[g.jsx("span",{className:"text-zinc-500 font-mono",children:"Lamps/Lights (LA):"}),g.jsx("span",{className:"text-amber-400 font-bold font-mono",children:ee.lampCount})]}),g.jsxs("div",{className:"bg-zinc-950/60 p-2.5 rounded border border-zinc-800/40 flex justify-between",children:[g.jsx("span",{className:"text-zinc-500 font-mono",children:"Cameras (CA):"}),g.jsx("span",{className:"text-purple-400 font-bold font-mono",children:ee.cameraCount})]})]}),g.jsxs("div",{className:"mt-2 text-[10px] text-zinc-500 text-center font-mono bg-zinc-950/40 p-1.5 rounded",children:["Total Binary File Blocks Decoded: ",g.jsx("span",{className:"text-zinc-300 font-bold",children:ee.totalBlocks})," (largest block: ",g.jsx("span",{className:"text-zinc-300 font-bold",children:((kt=ee.blocksList[0])==null?void 0:kt.code)||"N/A"}),")"]})]}),g.jsxs("div",{className:"bg-zinc-950/80 border border-zinc-800/40 p-3 rounded-lg text-xs space-y-1.5",children:[g.jsx("span",{className:"text-[10px] uppercase font-bold text-orange-500 font-mono block",children:"Workspace Import Preview"}),g.jsxs("p",{className:"text-zinc-400 leading-relaxed text-[11px]",children:["This binary database maps to ",g.jsxs("strong",{className:"text-white font-bold font-mono",children:[ce.length," active 3D elements"]})," including mesh primitives, illumination objects, and material instances."]}),g.jsx("div",{className:"max-h-24 overflow-y-auto border border-zinc-800/60 rounded bg-zinc-900/50 p-2 font-mono text-[10px] space-y-1",children:ce.map((N,E)=>g.jsxs("div",{className:"flex justify-between items-center text-zinc-400",children:[g.jsxs("span",{children:[E+1,". ",N.name]}),g.jsx("span",{className:"text-zinc-500 font-bold uppercase text-[9px] bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800",children:N.type})]},N.id))})]}),g.jsxs("div",{className:"border-t border-zinc-800 pt-4 flex flex-col sm:flex-row gap-2",children:[g.jsxs("button",{onClick:()=>pt("replace"),className:"flex-1 bg-orange-600 hover:bg-orange-500 text-black font-bold py-2.5 px-4 rounded text-xs transition duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer",children:[g.jsx(Nu,{className:"w-4 h-4 text-black animate-spin",style:{animationDuration:"6s"}}),"Replace Workspace"]}),g.jsxs("button",{onClick:()=>pt("merge"),className:"flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded text-xs border border-zinc-700/60 transition duration-150 flex items-center justify-center gap-2 cursor-pointer",children:[g.jsx(uu,{className:"w-4 h-4 text-zinc-300"}),"Merge/Append Scene"]}),g.jsx("button",{onClick:()=>{Y(!1),ve(null),A([])},className:"px-4 py-2.5 rounded text-xs text-zinc-400 hover:text-white bg-zinc-950/40 hover:bg-zinc-950 transition duration-150 cursor-pointer",children:"Cancel"})]})]})]})})]}),w!=="video"&&g.jsx(tC,{currentFrame:l,setCurrentFrame:c,isPlaying:f,setIsPlaying:p,keyframes:m,onInsertKeyframe:qe,onClearObjectKeyframes:lt,onClearAllKeyframes:ze,selectedObjectId:i,selectedObject:L})]})}zb.createRoot(document.getElementById("root")).render(g.jsx(Oe.StrictMode,{children:g.jsx(IC,{})}));
