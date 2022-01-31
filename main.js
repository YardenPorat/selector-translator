!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Translator=t():e.Translator=t()}(self,(function(){return(()=>{"use strict";var e={526:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.tokenize=void 0,t.tokenize=function(e,{isDelimiter:t,isStringDelimiter:n,isWhitespace:o,shouldAddToken:s,createToken:r,getCommentStartType:i,isCommentEnd:a,getUnclosedComment:l,offset:u=0}){const c=[];let d="",p="",f="",h="",m=u,v=0;for(const s of e)v+=s.length,h?(p+=s,s===h&&"\\"!==d&&(y("string"),h="")):f?(p+=s,a(f,s,e,v,d)&&(y(f),f="")):(f=i(s,e,v))?(y(),p+=s):n(s,d)?(y(),p+=s,h=s):t(s,d)?(y(),p+=s,y(s)):o(s)&&!o(d)||!o(s)&&o(d)?(y(),p+=s):p+=s,d=s;function y(e){if(0===p.length)return;const t=m+p.length;e=null!=e?e:p.trim().length?"text":"space",s(e,p)&&(c[c.length]=r(p,e,m,t)),m=t,p=""}return p.length&&(f?y(l(f)):h?y("unclosed-string"):y()),c}},713:(e,t)=>{function n(e,t=0,n=-1,o){if(0===e.length)return"";if(-1===n&&(n=e.length),o)return o.slice(e[t].start,e[n-1].end);{let o="";for(let s=t;s<n;s++)o+=e[s].value;return o}}Object.defineProperty(t,"__esModule",{value:!0}),t.last=t.trimTokens=t.groupTokens=t.getText=t.getUnclosedComment=t.isCommentEnd=t.getMultilineCommentStartType=t.getJSCommentStartType=t.createToken=t.isWhitespace=t.isStringDelimiter=t.isString=t.isComment=void 0,t.isComment=function(e){return"line-comment"===e||"multi-comment"===e||"unclosed-comment"===e},t.isString=function(e){return"string"===e||"unclosed-string"===e},t.isStringDelimiter=e=>"'"===e||'"'===e||"`"===e,t.isWhitespace=e=>" "===e||"\t"===e||"\r"===e||"\n"===e,t.createToken=(e,t,n,o)=>({value:e,type:t,start:n,end:o}),t.getJSCommentStartType=function(e,t,n){return"/"===e&&"/"===t[n]?"line-comment":"/"===e&&"*"===t[n]?"multi-comment":""},t.getMultilineCommentStartType=function(e,t,n){return"/"===e&&"*"===t[n]?"multi-comment":""},t.isCommentEnd=function(e,t,n,o,s){return"line-comment"===e&&"\n"===t||"multi-comment"===e&&"/"===t&&"*"===s},t.getUnclosedComment=function(e){return"line-comment"===e?e:"unclosed-comment"},t.getText=n,t.groupTokens=function(e,t="tokens",o){return{type:t,start:e[0].start,end:e[e.length-1].end,value:n(e,void 0,void 0,o),tokens:e}},t.trimTokens=function(e,t){let n=0,o=e.length;for(let o=0;o<e.length&&t(e[o]);o++)n=o+1;for(let s=e.length-1;s>n&&t(e[s]);s--)o=s;return e.slice(n,o)},t.last=function(e){return e[e.length-1]}},461:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,o){void 0===o&&(o=n),e[o]=t[n]}),s=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||o(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),s(n(921),t),s(n(526),t),s(n(713),t),s(n(277),t)},277:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Seeker=void 0,t.Seeker=class{constructor(e){this.tokens=e,this.index=-1}next(){return this.index++,this.tokens[this.index]||{type:""}}back(){this.index--}peekBack(){return this.tokens[this.index-1]||{type:""}}peek(e=1){return this.tokens[this.index+e]||{type:""}}take(e){if(this.peek().type===e)return this.next()}takeMany(e){const t=[];for(;this.peek().type===e;)t.push(this.next());return t}flatBlock(e,t,n){let o=this.next();if(o.type!==e)return[];const s=[];let r;for(;o=this.next();){if(!o.type)return void(void 0!==r&&(this.index=r-1));if(n&&n(o)&&(r=this.index),o.type===t)return s;s.push(o)}return[]}done(){return this.index>=this.tokens.length-1}run(e,t,n){let o;for(;(o=this.next())&&o.type&&!1!==e(o,t,n,this););return t}}},921:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},231:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.splitCompoundSelectors=t.groupCompoundSelectors=void 0;const o=n(439);t.groupCompoundSelectors=function(e,t){const n=function({splitPseudoElements:e=!0}={}){const t=[];let n,o,s;const r=t=>{if("pseudo_element"===t.type&&!0===e&&(o=void 0),"combinator"===t.type)n.nodes.push(t),o=void 0;else if("comment"!==t.type||function(e){return"comment"===e.type&&""===e.before&&""===e.after}(t))if("type"===t.type||"universal"===t.type||"class"===t.type||"id"===t.type||"attribute"===t.type||"nesting"===t.type||"pseudo_class"===t.type||"pseudo_element"===t.type||"invalid"===t.type||"comment"===t.type)o||(s=void 0,o={type:"compound_selector",start:t.start,end:t.end,before:"",after:"",nodes:[],invalid:!1},n.nodes.push(o)),o.invalid||"comment"===t.type||(s&&(o.invalid="universal"===t.type||"type"===t.type),s=t),o.nodes.push(t),o.end=t.end;else if("selector"===t.type||"compound_selector"===t.type)for(const e of t.nodes)r(e);else n.nodes.push(t),o=void 0;else n.nodes.push(t),o=void 0};return{addSelector(e){n={type:"selector",start:e.start,end:e.end,before:"before"in e?e.before:"",after:"after"in e?e.after:"",nodes:[]},t.push(n),o=void 0},handleNode:r,output:t}}(t);return(0,o.walk)(e,((e,t,s,r)=>{if(0!==r.length||"selector"!==e.type)return n.handleNode(e),o.walk.skipNested;n.addSelector(e)})),"length"in e?n.output:n.output[0]},t.splitCompoundSelectors=function(e){const t=Array.isArray(e)?e:[e],n=[];for(const e of t){const t={...e,nodes:[]};for(const n of e.nodes)"compound_selector"===n.type?t.nodes.push(...n.nodes):t.nodes.push(n);n.push(t)}return"length"in e?n:n[0]}},621:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.compareSpecificity=t.calcSpecificity=void 0;const o=n(439);function s(e){const t=[0,0,0,0];return(0,o.walk)(e,(e=>{switch(e.type){case"type":case"pseudo_element":t[3]++;break;case"class":case"attribute":t[2]++;break;case"pseudo_class":if(r[e.value])return r[e.value](e,t),o.walk.skipNested;t[2]++;break;case"id":t[1]++}return"selector"!==e.type&&"compound_selector"!==e.type?o.walk.skipNested:void 0})),t}t.calcSpecificity=s;const r={not:a,is:a,has:a,where:()=>{},"nth-child":i,"nth-last-child":i,"nth-of-type":i,"nth-last-of-type":i};function i(e,t){t[2]++,a(e,t)}function a(e,t){var n;if(null===(n=e.nodes)||void 0===n?void 0:n.length){let n=[0,0,0,0];for(const t of e.nodes){const e=s(t);n&&1!==l(e,n)||(n=e)}!function(e,t){for(let n=0;n<4;++n)e[n]+=t[n]}(t,n)}}function l(e,t){for(let n=0;n<4;++n){const o=e[n]-t[n];if(o>0)return 1;if(o<0)return-1}return 0}t.compareSpecificity=l},439:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.walk=void 0;const n=Symbol("nest-end");function o(e,t,o={}){var s;const r=Array.isArray(e)?[...e]:[e],i=function(e){const t=[],n=[[]],o={parents:[],indexInSelector:0,nodesInSelector:Array.isArray(e)?e:"nodes"in e?e.nodes:[e],up(){o.parents.pop(),o.indexInSelector=t.shift();const n=o.parents,s=n[n.length-1];o.nodesInSelector=s?s.nodes:e},next(){o.indexInSelector++},insertNested(e){o.parents=[...o.parents,e],n.push(o.parents),t.unshift(o.indexInSelector),o.indexInSelector=0,o.nodesInSelector=e.nodes}};return o}(e);for(;r.length;){const e=r.shift();if(e!==n){if(o.ignoreList&&o.ignoreList.includes(e.type)||o.visitList&&!o.visitList.includes(e.type))i.next();else{let o=null!==(s=t(e,i.indexInSelector,i.nodesInSelector,i.parents))&&void 0!==s?s:-1;if(i.next(),o===1/0)return;if(o>=0){for(;o>0&&r.length;)r.shift()===n&&(o--,i.up());continue}}(a=e)&&"nodes"in a&&(i.insertNested(e),r.unshift(...e.nodes,n))}else i.up()}var a}t.walk=o,o.skipNested=0,o.skipCurrentSelector=1,o.stopAll=1/0},946:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},534:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.trimCombinators=t.ensureSelector=t.isNamespacedAst=t.isNamespacedToken=t.isCombinatorToken=t.createCommentAst=t.createCombinatorAst=t.createEmptyNth=t.createEmptySelector=void 0;const o=n(461);t.createEmptySelector=function(){return{type:"selector",start:-1,end:-1,before:"",after:"",nodes:[]}},t.createEmptyNth=function(){return{type:"nth",start:-1,end:-1,before:"",after:"",nodes:[]}},t.createCombinatorAst=function({value:e,type:t,start:n,end:o}){return{type:"combinator",combinator:t,value:"space"===t?" ":e,start:n,end:o,before:"",after:"space"===t?e.slice(1):"",invalid:!1}},t.createCommentAst=function({value:e,start:t,end:n}){return{type:"comment",value:e,start:t,end:n,before:"",after:""}},t.isCombinatorToken=function(e){return"space"===e.type||"+"===e.type||">"===e.type||"~"===e.type},t.isNamespacedToken=function(e){return"*"===e.type||"text"===e.type},t.isNamespacedAst=function(e){return"universal"===e.type||"type"===e.type},t.ensureSelector=function(e,t){let n=(0,o.last)(e);return n||(n={type:"selector",start:-1,end:-1,before:"",after:"",nodes:[]},n.start=t.start,e.push(n)),n},t.trimCombinators=function(e){const t=e.nodes,n=t[0],s=(0,o.last)(t);if("combinator"===(null==n?void 0:n.type)&&"space"===n.combinator&&(e.nodes.shift(),e.before+=n.before+n.value+n.after),s!==n){let n,o=t.length-1,r=s;for(;r&&"comment"===r.type||"combinator"===r.type&&"space"===r.combinator;)"combinator"===r.type?n?(e.nodes.splice(o,1),n.before+=r.before+r.value+r.after,n.start=r.start):(e.nodes.pop(),e.after+=r.before+r.value+r.after):n=r,r=t[--o]}}},774:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,o){void 0===o&&(o=n),e[o]=t[n]}),s=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||o(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),t.compareSpecificity=t.calcSpecificity=t.splitCompoundSelectors=t.groupCompoundSelectors=t.walk=t.stringifySelectorAst=t.parseCssSelector=void 0;var r=n(742);Object.defineProperty(t,"parseCssSelector",{enumerable:!0,get:function(){return r.parseCssSelector}}),s(n(946),t);var i=n(380);Object.defineProperty(t,"stringifySelectorAst",{enumerable:!0,get:function(){return i.stringifySelectorAst}});var a=n(439);Object.defineProperty(t,"walk",{enumerable:!0,get:function(){return a.walk}});var l=n(231);Object.defineProperty(t,"groupCompoundSelectors",{enumerable:!0,get:function(){return l.groupCompoundSelectors}}),Object.defineProperty(t,"splitCompoundSelectors",{enumerable:!0,get:function(){return l.splitCompoundSelectors}});var u=n(621);Object.defineProperty(t,"calcSpecificity",{enumerable:!0,get:function(){return u.calcSpecificity}}),Object.defineProperty(t,"compareSpecificity",{enumerable:!0,get:function(){return u.compareSpecificity}})},780:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.NthParser=void 0;const o=n(534),s=n(461);class r{constructor(e,t){this.selectorNode=e,this.s=t,this.state="step",this.standaloneDash=!1,this.ast=e.nodes}static isNthPseudoClass(e){return"nth-child"===e||"nth-last-child"===e||"nth-of-type"===e||"nth-last-of-type"===e}handleToken(e){const t=e.type;if("text"===t||"+"===t)switch(this.state){case"step":{const n="+"===t&&"text"===this.s.peek().type?this.s.next():void 0;return this.breakFirstChunk({type:"text",value:e.value+((null==n?void 0:n.value)||""),start:e.start,end:(null==n?void 0:n.end)||e.end}),!0}case"dash":{const n="+"===t&&"text"===this.s.peek().type?this.s.next():void 0;return this.pushDash({type:"text",value:e.value+((null==n?void 0:n.value)||""),start:e.start,end:(null==n?void 0:n.end)||e.end}),!0}case"offset":{const n="+"===t&&"text"===this.s.peek().type?this.s.next():void 0;return this.pushOffset({type:"text",value:e.value+((null==n?void 0:n.value)||""),start:e.start,end:(null==n?void 0:n.end)||e.end}),!0}case"of":return this.pushOf(e),!1}else{if("space"===t){const t=(0,s.last)(this.ast);return t?(t.after+=e.value,t.end+=e.value.length):this.selectorNode.before+=e.value,!0}if((0,s.isComment)(t))return this.ast.push((0,o.createCommentAst)(e)),!0}return this.s.back(),!1}breakFirstChunk(e){const t=e.value,n=t.match(r.oddEvenStep);if(n){const t=!!n[1];return void this.pushStep(e,t)}const o=t.match(r.nthStartExp);if(o){const t=o[1],n=o[2];n||t.match(/[nN]+$/)||!t.match(r.validOffset)?"-"===n?(this.pushStep({type:"text",value:t,start:e.start,end:e.start+t.length}),this.pushDash({type:"text",value:"-",start:e.end-1,end:e.end})):n&&!n.match(/-\d+/)?this.pushStep(e):(this.pushStep({type:"text",value:t,start:e.start,end:e.start+t.length}),n&&this.pushOffset({type:"text",value:n,start:e.end-n.length,end:e.end})):this.pushOffset(e)}else this.pushStep(e)}pushStep(e,t){const n=e.value,o={type:"nth_step",value:n,before:"",after:"",start:e.start,end:e.end};(t=void 0!==t?t:!n.match(r.validStep))&&(o.invalid=!0),this.state="dash",this.ast.push(o)}pushDash(e){const t=e.value;"+"===t||"-"===t?(this.ast.push({type:"nth_dash",value:e.value,start:e.start,end:e.end,before:"",after:""}),this.standaloneDash=!0,this.state="offset"):this.pushOffset(e)}pushOffset(e){if("of"===e.value)this.pushOf(e);else{const t=e.value,n={type:"nth_offset",value:t,before:"",after:"",start:e.start,end:e.end};(!t.match(r.validOffset)||this.standaloneDash&&t.match(/^[-+]/))&&(n.invalid=!0),this.state="of",this.ast.push(n)}}pushOf(e){const t={type:"nth_of",value:e.value,before:"",after:"",start:e.start,end:e.end};"of"!==e.value&&(t.invalid=!0),this.ast.push(t),this.state="selector"}}t.NthParser=r,r.oddEvenStep=/([-+]?)(odd|even)/i,r.validStep=/^[-+]?\d*n$/i,r.validOffset=/^[-+]?\d+$/,r.nthStartExp=/([-+]?\d*[nN]?)(.*)/},742:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.parseCssSelector=void 0;const o=n(467),s=n(780),r=n(534),i=n(461);function a(e,t,n,o){var l,u,c,d,p,f,h,m,v,y,b,g,k,x,S,C,$,_,w;let T;const j=(0,r.ensureSelector)(t,e),O=j.nodes;if("."===e.type){const t=o.takeMany("multi-comment").map(r.createCommentAst),n=o.take("text");O.push({type:"class",value:null!==(l=null==n?void 0:n.value)&&void 0!==l?l:"",start:e.start,end:null!==(d=null!==(u=null==n?void 0:n.end)&&void 0!==u?u:null===(c=(0,i.last)(t))||void 0===c?void 0:c.end)&&void 0!==d?d:e.end,dotComments:t})}else if(":"===e.type){const t=o.takeMany("multi-comment").map(r.createCommentAst),n=o.take(":")||e;if(e===n){const s=o.take("text"),r=s||(0,i.last)(t)||n;O.push({type:"pseudo_class",value:null!==(p=null==s?void 0:s.value)&&void 0!==p?p:"",start:e.start,end:null!==(f=null==s?void 0:s.end)&&void 0!==f?f:r.end,colonComments:t})}else{const s=o.takeMany("multi-comment").map(r.createCommentAst),a=o.take("text"),l=a||(0,i.last)(s)||n;O.push({type:"pseudo_element",value:null!==(h=null==a?void 0:a.value)&&void 0!==h?h:"",start:e.start,end:null!==(m=null==a?void 0:a.end)&&void 0!==m?m:l.end,colonComments:{first:t,second:s}})}}else if("["===e.type){const t=o.run(((e,t)=>(t.push(e),"]"!==e.type)),[e],n);"]"===(null===(v=(0,i.last)(t))||void 0===v?void 0:v.type)?O.push({type:"attribute",value:t.length>2?(0,i.getText)(t,1,t.length-1,n):"",start:e.start,end:null!==(b=null===(y=(0,i.last)(t))||void 0===y?void 0:y.end)&&void 0!==b?b:e.end}):O.push({type:"invalid",value:(0,i.getText)(t,void 0,void 0,n),start:e.start,end:null!==(k=null===(g=(0,i.last)(t))||void 0===g?void 0:g.end)&&void 0!==k?k:e.end})}else if((0,r.isCombinatorToken)(e)){let t=(0,r.createCombinatorAst)(e),n=t;O.push(t);let s="space"===t.combinator?O.length-1:-1,a=o.next();for(;a;){if((0,r.isCombinatorToken)(a))if("space"===a.type)n.after+=a.value,n.end=a.end;else if(n===t&&"space"===n.combinator){const e=(0,r.createCombinatorAst)(a);t.combinator=e.combinator,t.before+=t.after+t.value+e.before,t.after=e.after,t.value=e.value,t.end=e.end,s=-1}else if(-1!==s){const e=O[s],o=e.before+e.value+e.after;if(0===s)j.before+=o;else{const t=O[s+1];"comment"===(null==t?void 0:t.type)&&(t.before+=o,t.start=e.start)}O.splice(s,1),s=-1,t=(0,r.createCombinatorAst)(a),n=t,O.push(t)}else t=(0,r.createCombinatorAst)(a),t.invalid=!0,n=t,O.push(t);else{if(!(0,i.isComment)(a.type))break;n=(0,r.createCommentAst)(a),O.push(n)}a=o.next()}a&&!(0,r.isCombinatorToken)(a)&&o.back()}else if("text"===e.type)O.push({type:"type",value:e.value,start:e.start,end:e.end});else if("#"===e.type)T=o.take("text"),O.push({type:"id",value:null!==(x=null==T?void 0:T.value)&&void 0!==x?x:"",start:e.start,end:null!==(S=null==T?void 0:T.end)&&void 0!==S?S:e.end});else if("*"===e.type)O.push({type:"universal",value:"*",start:e.start,end:e.end});else if("|"===e.type){let t,n;const s=[];for(let e=O.length-1;e>=0;--e){const o=O[e];if((0,r.isNamespacedAst)(o)){o.namespace?n=o:t=o;break}if("comment"!==o.type||""!==o.before||""!==o.after){n=o;break}s.unshift(o)}let a,l=1;const u=[];for(;;){const e=o.peek(l);if(!(0,i.isComment)(e.type)){if((0,r.isNamespacedToken)(e)){a=e;break}break}u.push(e),l++}const c=!n,d=!!a,p="*"===(null==a?void 0:a.type)?"universal":"type";let f="";c?O.splice(O.length-s.length,s.length):f="namespace",d?(u.forEach((()=>o.next())),o.next()):f=f?"namespace,target":"target";const h=t||{type:p,value:"",start:e.start,end:(null==a?void 0:a.end)||e.end};h.type=p,h.namespace={value:(null==t?void 0:t.value)||"",beforeComments:c?s:[],afterComments:d?u.map(r.createCommentAst):[]},h.value=(null==a?void 0:a.value)||"",h.end=(null==a?void 0:a.end)||e.end,f&&(h.namespace.invalid=f),t||O.push(h)}else if("("===e.type){const t=(0,i.last)(O),l=[];if(t&&"pseudo_class"===t.type&&s.NthParser.isNthPseudoClass(t.value)&&")"!==o.peek().type){const e=(0,r.createEmptyNth)();e.start=o.peek().start,l.push(e);const t=new s.NthParser(e,o);if(o.run((e=>"selector"===t.state?(o.back(),!1):t.handleToken(e)),e,n),")"!==o.peek().type){e.end=(null===(C=(0,i.last)(e.nodes))||void 0===C?void 0:C.end)||e.start;const t=(0,r.createEmptySelector)();t.start=e.end,l.push(t)}}o.run(((e,t)=>{var s,r;if(")"===e.type){const e=(0,i.last)(t);return e&&(e.end=null!==(r=null===(s=(0,i.last)(e.nodes))||void 0===s?void 0:s.end)&&void 0!==r?r:e.start),!1}return a(e,t,n,o)}),l,n);const u=o.peek(0);if(!t||"nodes"in t||"invalid"===t.type||"combinator"===t.type||"comment"===t.type||"nth_step"===t.type||"nth_dash"===t.type||"nth_offset"===t.type||"nth_of"===t.type||")"!==u.type)O.push({type:"invalid",value:(0,i.getText)([e,u],void 0,void 0,n),start:e.start,end:null!==($=null==u?void 0:u.end)&&void 0!==$?$:o.peekBack().end});else{if(l.length){const e=(0,i.last)(l);(0,r.trimCombinators)(e)}t.nodes=l,t.end=u.end}}else if((0,i.isComment)(e.type))O.push((0,r.createCommentAst)(e));else if(","===e.type){const n=(0,i.last)(t);n.end=e.start,(0,r.trimCombinators)(n);const s=(0,r.createEmptySelector)();o.done()?(s.start=e.end,s.end=e.end):s.start=o.peek().start,t.push(s)}else"&"===e.type?O.push({type:"nesting",value:"&",start:e.start,end:e.end}):O.push({type:"invalid",value:e.value,start:e.start,end:e.end});o.done()&&(j.end=null!==(w=null===(_=(0,i.last)(j.nodes))||void 0===_?void 0:_.end)&&void 0!==w?w:j.start,(0,r.trimCombinators)(j))}t.parseCssSelector=function(e,t={}){return function(e,t){return new i.Seeker(t).run(a,[],e)}(e,(0,o.tokenizeSelector)(e,t))}},380:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.stringifySelectorAst=void 0;const o=n(780);t.stringifySelectorAst=function(e){return"length"in e?i(e):r(e)};const s={id:e=>`#${e.value}${a(e)}`,class:e=>`.${e.dotComments.map(r).join("")}${e.value}${a(e)}`,type:e=>`${l(e)}${e.value}${a(e)}`,combinator:e=>`${e.before}${e.value}${e.after}`,attribute:e=>`[${e.value}]${a(e)}`,pseudo_class:e=>`:${e.colonComments.map(r).join("")}${e.value}${a(e)}`,pseudo_element:e=>`:${e.colonComments.first.map(r).join("")}:${e.colonComments.second.map(r).join("")}${e.value}${a(e)}`,comment:({before:e,value:t,after:n})=>`${e}${t}${n}`,universal:e=>`${l(e)}${e.value}${a(e)}`,nesting:e=>`${e.value}${a(e)}`,selector:e=>`${e.before}${e.nodes.map(r).join("")}${e.after}`,compound_selector:e=>`${e.before}${e.nodes.map(r).join("")}${e.after}`,invalid:e=>e.value,nth:e=>`${e.before}${e.nodes.map(r).join("")}${e.after}`,nth_step:({before:e,value:t,after:n})=>`${e}${t}${n}`,nth_dash:({before:e,value:t,after:n})=>`${e}${t}${n}`,nth_offset:({before:e,value:t,after:n})=>`${e}${t}${n}`,nth_of:({before:e,value:t,after:n})=>`${e}${t}${n}`};function r(e){var t,n;return null!==(n=null===(t=s[e.type])||void 0===t?void 0:t.call(s,e))&&void 0!==n?n:""}function i(e){const t=[];for(const n of e)t.push(r(n));return t.join(",")}function a(e){var t;if("nodes"in e){if(null===(t=e.nodes)||void 0===t?void 0:t.length){if("pseudo_class"===e.type&&o.NthParser.isNthPseudoClass(e.value)){const[t,...n]=e.nodes;return`(${r(t)}${i(n)})`}return`(${i(e.nodes)})`}return"()"}return""}function l({namespace:e}){let t="";if(e){t+=e.value;for(const n of e.beforeComments)t+=s.comment(n);t+="|";for(const n of e.afterComments)t+=s.comment(n)}return t}},467:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.tokenizeSelector=void 0;const o=n(461);t.tokenizeSelector=function(e,t={}){return(0,o.tokenize)(e,{isDelimiter:s,isStringDelimiter:(e,t)=>"\\"!==t&&(0,o.isStringDelimiter)(e),isWhitespace:o.isWhitespace,shouldAddToken:()=>!0,createToken:o.createToken,getCommentStartType:o.getMultilineCommentStartType,isCommentEnd:o.isCommentEnd,getUnclosedComment:o.getUnclosedComment,offset:t.offset})};const s=(e,t)=>"\\"!==t&&("["===e||"]"===e||"("===e||")"===e||","===e||"*"===e||"|"===e||":"===e||"."===e||"#"===e||">"===e||"~"===e||"+"===e||"{"===e||"}"===e||"&"===e)},862:(e,t,n)=>{n.d(t,{Z:()=>a});var o=n(81),s=n.n(o),r=n(645),i=n.n(r)()(s());i.push([e.id,"* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml,\nbody {\n  background: black;\n  color: white;\n  font-family: Roboto, Arial, Helvetica, sans-serif;\n  -webkit-font-smoothing: antialiased;\n}\n\n#background {\n  position: absolute;\n  display: block;\n  top: 0;\n  left: 0;\n  z-index: 0;\n}\n\n.container {\n  display: flex;\n  width: 100vw;\n  height: 100vh;\n  justify-content: center;\n  align-items: center;\n  padding: 0 10px;\n}\n\nlabel,\n#result,\nh1,\nh3 {\n  margin: 10px 0;\n  text-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;\n}\n\nh1,\nh3 {\n  text-align: center;\n}\n\n#form {\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 300px;\n}\n\n.input-group {\n  display: grid;\n  grid-template-columns: 1fr 30px;\n  align-items: center;\n  margin: 10px 0;\n  width: 90%;\n}\n\nlabel {\n  display: block;\n  grid-column: span 2;\n}\n\ninput {\n  width: 100%;\n  padding: 10px;\n  border-radius: 5px;\n  border: 0;\n  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;\n}\n\nbutton {\n  height: 24px;\n  width: 24px;\n  -webkit-filter: invert(100%); /* safari 6.0 - 9.0 */\n  filter: invert(100%);\n  border: 0;\n  margin-left: 10px;\n}\n\n#result {\n  text-align: center;\n  background-color: rgba(0, 0, 0, 0.4);\n  border-radius: 10px;\n  padding: 10px;\n  height: 30px;\n}\n",""]);const a=i},645:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",o=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),o&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),o&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,o,s,r){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(o)for(var a=0;a<this.length;a++){var l=this[a][0];null!=l&&(i[l]=!0)}for(var u=0;u<e.length;u++){var c=[].concat(e[u]);o&&i[c[0]]||(void 0!==r&&(void 0===c[5]||(c[1]="@layer".concat(c[5].length>0?" ".concat(c[5]):""," {").concat(c[1],"}")),c[5]=r),n&&(c[2]?(c[1]="@media ".concat(c[2]," {").concat(c[1],"}"),c[2]=n):c[2]=n),s&&(c[4]?(c[1]="@supports (".concat(c[4],") {").concat(c[1],"}"),c[4]=s):c[4]="".concat(s)),t.push(c))}},t}},81:e=>{e.exports=function(e){return e[1]}},379:e=>{var t=[];function n(e){for(var n=-1,o=0;o<t.length;o++)if(t[o].identifier===e){n=o;break}return n}function o(e,o){for(var r={},i=[],a=0;a<e.length;a++){var l=e[a],u=o.base?l[0]+o.base:l[0],c=r[u]||0,d="".concat(u," ").concat(c);r[u]=c+1;var p=n(d),f={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==p)t[p].references++,t[p].updater(f);else{var h=s(f,o);o.byIndex=a,t.splice(a,0,{identifier:d,updater:h,references:1})}i.push(d)}return i}function s(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,s){var r=o(e=e||[],s=s||{});return function(e){e=e||[];for(var i=0;i<r.length;i++){var a=n(r[i]);t[a].references--}for(var l=o(e,s),u=0;u<r.length;u++){var c=n(r[u]);0===t[c].references&&(t[c].updater(),t.splice(c,1))}r=l}}},569:e=>{var t={};e.exports=function(e,n){var o=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(n)}},216:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},565:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},795:e=>{e.exports=function(e){var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var o="";n.supports&&(o+="@supports (".concat(n.supports,") {")),n.media&&(o+="@media ".concat(n.media," {"));var s=void 0!==n.layer;s&&(o+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),o+=n.css,s&&(o+="}"),n.media&&(o+="}"),n.supports&&(o+="}");var r=n.sourceMap;r&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),t.styleTagTransform(o,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},589:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function n(o){var s=t[o];if(void 0!==s)return s.exports;var r=t[o]={id:o,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};return(()=>{n.r(o),n.d(o,{App:()=>O});var e=n(774);const t={hover:"hovered",active:"active",focus:"focused",visited:"visited",empty:"empty",blank:"blank",target:"targeted",checked:"checked",indeterminate:"indeterminate",disabled:"disabled",optional:"optional",valid:"valid",invalid:"invalid",required:"required","read-only":"read-only","read-write":"read-write","in-range":"in-range","out-of-range":"out-of-range",lang:"language","last-child":"the last child of its parent","first-child":"the first child of its parent","only-child":"the only child of its parent","nth-child":"the nth child (formula) of its parent","nth-last-child":"the nth (formula) child from the end of its parent","last-of-type":"the last of its type in its parent","first-of-type":"the first of its type in its parent","only-of-type":"the only of its type in its parent","nth-of-type":"the nth (formula) of its type in its parent","nth-last-of-type":"the nth (formula) of its type in its parent, from the end"},s="exist",r="error",i="full",a="equal",l="empty";function u(e){const t=e.indexOf("=");if(-1===t)return{type:s,action:s,name:e};const n=e.slice(0,t),o=e.slice(t+1),{value:u,casing:c}=function(e){if(e.startsWith('"')){const[t,n,o]=e.split('"');return{value:n||l,casing:!!o}}const[t,n]=e.split(" ");return{value:t,casing:!!n}}(o);if(0===n.length||!u||o.endsWith(":"))return{type:r,error:`Invalid attribute selector: '[${e}]'`};const d=n.at(-1),{action:p,descriptor:f}=function(e){return"^"===e?{action:"start",descriptor:e=>`whose value starts with '${e}'`}:"$"===e?{action:"end",descriptor:e=>`whose value ends with '${e}'`}:"|"===e?{action:"hyphen-list",descriptor:e=>`whose value '${e}' is included in a hyphen separated list`}:"~"===e?{action:"space-list",descriptor:e=>`whose value '${e}' is included in a space separated list`}:"*"===e?{action:"contain",descriptor:e=>`whose value contains '${e}'`}:{action:a,descriptor:e=>`whose value is ${e===l?l:`'${e}'`}`}}(d),h=p===a?n:n.slice(0,-1);return{type:i,action:p,name:h,value:u,casing:c,descriptor:f}}const c={before:"The 'before' pseudo-element of",after:"The 'after' pseudo-element of","first-line":"The first line of","first-letter":"The first letter of",placeholder:"The placeholder of",marker:"The marker (numbering) of",backdrop:"The backdrop of",selection:"The highlighted selection of"},d=e=>{const n=e.map((e=>e.value?function({name:e,value:n}){return`${t[e]} is '${n}'`}(e):t[e.name]));return n.length>1?f(n):n[0]};function p(e){var t,n;const o=new Set,s=[],r=[],i=[];let a,l,c=!1;for(const d of e.nodes)if("pseudo_element"===d.type&&(l=d.value),"class"===d.type&&o.add(d.value),"type"===d.type&&(a=d.value),"id"===d.type&&s.push(d.value),"attribute"===d.type&&r.push(u(d.value)),"universal"===d.type&&(c=!0),"pseudo_class"===d.type){if("type"==(null===(t=d.nodes)||void 0===t?void 0:t[0].nodes[0].type)){i.push({name:d.value,value:null===(n=d.nodes)||void 0===n?void 0:n[0].nodes[0].value});continue}i.push({name:d.value,value:""})}return{classes:Array.from(o),hasUniversal:c,element:a,id:s,attributes:r,pseudoClasses:i,pseudoElement:l}}function f(e){return 2===e.length?`${e[0]} and ${e[1]}`:e.length>2?`${e.slice(0,-1).join(", ")} and ${e.at(-1)}`:e[0]}function h(e){return!["ul"].includes(e)&&(["li"].includes(e)||["a","e","o","i","u"].includes(e[0]))}var m=n(379),v=n.n(m),y=n(795),b=n.n(y),g=n(569),k=n.n(g),x=n(565),S=n.n(x),C=n(216),$=n.n(C),_=n(589),w=n.n(_),T=n(862),j={};j.styleTagTransform=w(),j.setAttributes=S(),j.insert=k().bind(null,"head"),j.domAPI=b(),j.insertStyleElement=$(),v()(T.Z,j),T.Z&&T.Z.locals&&T.Z.locals;class O{constructor(){this.form=document.querySelector("#form"),this.input=document.querySelector("#selector-input"),this.result=document.querySelector("#result"),this.fillInputFromURL(),this.form.addEventListener("submit",(e=>{e.preventDefault(),this.input.value?this.translate(this.input.value):this.clear()}))}translate(t){this.result.innerText=function(t){const n=[],o=(0,e.parseCssSelector)(t),a=(0,e.groupCompoundSelectors)(o),l=[];for(const e of a){const t=[];for(const o of e.nodes.reverse()){if("compound_selector"===o.type){const{classes:a,hasUniversal:l,element:m,id:v,attributes:y,pseudoClasses:b,pseudoElement:g}=p(o);if(v.length>1&&n.push("An element cannot have two ids"),g&&t.push(c[g]),m?(h(m)?t.push("an"):t.push("a"),t.push(`'<${m}>' element`)):l||!m&&1===e.nodes.length&&v.length+a.length===0?t.push("any element"):g||t.push("an element"),v.length&&t.push(`with the id of '${v[0]}'`),a.length&&t.push("with "+((u=a.map((e=>`'${e}'`))).length>1?`classes ${f(u)}`:`a class of ${u[0]}`)),b.length&&t.push(`when its ${d(b)}`),y.length)for(const e of y){const{type:o}=e;if(o===r)n.push(e.error);else if(o===s)t.push(`with an attribute of '${e.name}'`);else if(o===i){const{value:n,descriptor:o,name:s,casing:r}=e;t.push(`with an attribute of '${s}' ${o(n)}${r?" (case insensitive)":""}`)}}}"combinator"===o.type&&(">"===o.value?t.push("directly within"):"+"===o.value?t.push("directly adjacent to"):"~"===o.value?t.push("after a sibling which is"):t.push("within"))}l.push(t.join(" "))}var u,m;return n.length?`Error: ${n[0]}`:(null==(m=f(l))?void 0:m.length)?m.charAt(0).toUpperCase()+m.slice(1):m}(t),this.updateQueryParam(t)}updateQueryParam(e){const t=new URLSearchParams(window.location.search);e?t.set("s",encodeURIComponent(e)):t.delete("s"),history.pushState(null,"","?"+t.toString())}clear(){this.input.value="",this.result.innerText="",this.updateQueryParam("")}fillInputFromURL(){const e=new URLSearchParams(window.location.search);if(e.has("s")){const t=decodeURIComponent(e.get("s"));this.input.value=t,this.translate(t)}}}window.App=new O})(),o})()}));