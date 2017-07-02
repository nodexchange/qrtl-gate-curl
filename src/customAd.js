adtechAdConfig.assetContainers.main.renderEvent = '';
adtechAdConfig.assetContainers.main.isExpandable = false;

var adHeight = adtechAdConfig.assetContainers.main.contentHeight;
var adWidth = adtechAdConfig.assetContainers.main.height;
adtechAdConfig.assetContainers.main.contentHeight = 250;
adtechAdConfig.assetContainers.main.height = 250;

(function(adConfig) {
  var requiresBreakout = false;
  if (!adConfig.overrides || adConfig.overrides.displayWindowTarget != self) {
    for (var id in adConfig.assetContainers) {
      if (adConfig.assetContainers.hasOwnProperty(id)) {
        var container = adConfig.assetContainers[id];
        if (container.type != 'inlineDiv' || container.isExpandable) {
          requiresBreakout = true;
          break;
        }
      }
    }
  }

  if (adConfig.overrides && adConfig.overrides.displayWindowTarget) {
    var displayWindowTarget = adConfig.overrides.displayWindowTarget;
    displayWindowTarget = (typeof adtechIframeHashArray != 'undefined' && self != top) ?
        displayWindowTarget.parent : displayWindowTarget;
  } else {
    var calculatedTarget = null;
    var currentWindow = parent;
    while (currentWindow != undefined) {
      try {
        var targetDoc = currentWindow.document;
        if (targetDoc) {
          calculatedTarget = currentWindow;
        }
      } catch(e) {}
      currentWindow = (currentWindow == top) ? null : currentWindow.parent;
    }
    var displayWindowTarget = calculatedTarget || top;
  }

  var targetIsFriendly = false;
  try {
    var targetDoc = displayWindowTarget.document;
    if (targetDoc) {
      targetIsFriendly = true;
    }
  } catch(e) {}

  var targetWindow = (requiresBreakout && (self != top && targetIsFriendly)) ?
          displayWindowTarget : self;

  targetWindow.com = targetWindow.com || {};
  targetWindow.com.adtech = targetWindow.com.adtech || {};

  targetWindow.com.adtech.AdtechCustomAd$AD_ID$ = function() {
    // Custom code class constructor.
  };

  targetWindow.com.adtech.AdtechCustomAd$AD_ID$.prototype = {

    /**
     * Entry point methods.
     *
     * Automatically invoked by the rich media library when the library API is
     * available to use, and the Advert instance has been instantiated.
     */
	preInit: function() {
	  window.com = com || {};
	  com.adtech = targetWindow.com.adtech;
    },

    init: function(advert) {
      if (!advert.richView) {
        // The backup client can not render the rich version of the advert.
        return;
      }
			this.pageLoadHandlerExecuted = false;
      this.domHandlerExecuted = false;
      
      // A few useful things to help you get started. Please delete as necessary!
      this.advert = advert;
	  this.utils = com.adtech.Utils_$VERSION$;
      this.globalEventBus = targetWindow.adtechAdManager_$VERSION$.globalEventBus;
      this.richMediaEvent = com.adtech.RichMediaEvent_$VERSION$;
			targetWindow.document.body.style.padding = '0px';
      targetWindow.document.body.style.margin = '0px';

      /*
       * This is how you listen for your custom events.
       * ADTECH.close() is actually just an alias of ADTECH.event('close').
       */
      advert.eventBus.addEventListener('close',
          this.utils.createClosure(this, this.closeHandler));
			
			advert.eventBus.addEventListener('close_advert',
        this.utils.createClosure(this, this.closeHandler));


      //PAGE LOAD
      if (this.globalEventBus.pageLoaded) {
        this.pageLoadHandler();
      } else {
        this.globalEventBus.addEventListener(this.richMediaEvent.PAGE_LOAD,
            this.utils.createClosure(this, this.pageLoadHandler));
      }
    },

    /*********************************************************
     *
     * Create your instance methods below.
     *
     * Please remember not to add a trailing comma to you last
     * method - IE will not like that!
     *
     *********************************************************/

    closeHandler: function() {
      this.gate.closeHandler();
    },
		
		 pageLoadHandler: function() {
			var self = this;
      if (this.pageLoadHandlerExecuted) {
            return;
        }
        this.pageLoadHandlerExecuted = true;
// TODO (martin): check if this works with secured
			curl({
				baseUrl: adConfig.adServerVars.assetBaseURL
			},['wallpaper/ca-wallpaper', 'Gate/ca-gate'], function(Wallpaper, Gate) {
				// Do stuff
				self.wallpaper = new Wallpaper();
				self.wallpaper.init(targetWindow, self.advert, self.utils);
                self.gate = new Gate();
                self.gate.init(targetWindow, self.advert);
				self.addDomListener();
			}
			);
            this.globalEventBus.removeEventListener(this.richMediaEvent.PAGE_LOAD,
        this.utils.createClosure(this, this.pageLoadHandler));
			
    },
		
		addDomListener: function() {
			if (this.globalEventBus.DOMLoaded === true) {
        this.domReadyHandler();
      } else {
        this.globalEventBus.addEventListener(this.richMediaEvent.DOM_LOAD,
            this.utils.createClosure(this, this.domReadyHandler));
      }
		},
		domReadyHandler: function() {
			this.wallpaper.build();
		}
  };

  targetWindow.adtechCallbackInstances = targetWindow.adtechCallbackInstances || [];
  var instanceIndex = targetWindow.adtechCallbackInstances.length;
  targetWindow.adtechCallbackInstances[instanceIndex] =
      new targetWindow.com.adtech.AdtechCustomAd$AD_ID$();

  targetWindow.adtechAdCallbacks = targetWindow.adtechAdCallbacks || {};
  targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid] =
      targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid] || [];
  targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid].push(
      targetWindow.adtechCallbackInstances[instanceIndex]);
})(adtechAdConfig);

/* version: 0.8.13 */
(function(){/*
 MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function(m){function U(){}function u(a,b){return 0==aa.call(a).indexOf("[object "+b)}function I(a){return a&&"/"==a.charAt(a.length-1)?a.substr(0,a.length-1):a}function V(a,b){var d,c,e,f;d=1;c=a;"."==c.charAt(0)&&(e=!0,c=c.replace(ba,function(a,b,c,e){c&&d++;return e||""}));if(e){e=b.split("/");f=e.length-d;if(0>f)return a;e.splice(f,d);return e.concat(c||[]).join("/")}return c}function J(a){var b=a.indexOf("!");return{h:a.substr(b+1),f:0<=b&&a.substr(0,b)}}function P(){}function v(a,b){P.prototype=
a||Q;var d=new P;P.prototype=Q;for(var c in b)d[c]=b[c];return d}function K(){function a(a,b,d){c.push([a,b,d])}function b(a,b){for(var d,e=0;d=c[e++];)(d=d[a])&&d(b)}var d,c,e;d=this;c=[];e=function(d,g){a=d?function(a){a&&a(g)}:function(a,b){b&&b(g)};e=U;b(d?0:1,g);b=U;c=k};this.then=function(b,c,e){a(b,c,e);return d};this.resolve=function(a){d.va=a;e(!0,a)};this.reject=function(a){d.ua=a;e(!1,a)};this.D=function(a){b(2,a)}}function L(a){return a instanceof K||a instanceof B}function w(a,b,d,c){L(a)?
a.then(b,d,c):b(a)}function C(a,b,d){var c;return function(){0<=--a&&b&&(c=b.apply(k,arguments));0==a&&d&&d(c);return c}}function A(){var a,b;D="";a=[].slice.call(arguments);u(a[0],"Object")&&(b=a.shift(),b=M(b));return new B(a[0],a[1],a[2],b)}function M(a,b,d){var c;D="";if(a&&(h.V(a),x=h.a(a),"preloads"in a&&(c=new B(a.preloads,k,d,E,!0),h.m(function(){E=c})),a=a.main))return new B(a,b,d)}function B(a,b,d,c,e){var f;f=h.j(x,k,[].concat(a),e);this.then=this.then=a=function(a,b){w(f,function(b){a&&
a.apply(k,b)},function(a){if(b)b(a);else throw a;});return this};this.next=function(a,b,c){return new B(a,b,c,f)};this.config=M;(b||d)&&a(b,d);h.m(function(){w(e||E,function(){w(c,function(){h.w(f)},d)})})}function W(a){var b,d;b=a.id;b==k&&(F!==k?F={L:"Multiple anonymous defines encountered"}:(b=h.ha())||(F=a));if(b!=k){d=l[b];b in l||(d=h.i(b,x),d=h.I(d.a,b),l[b]=d);if(!L(d))throw Error("duplicate define: "+b);d.ja=!1;h.J(d,a)}}function R(){var a=h.ea(arguments);W(a)}var D,x,y,G,z=m.document,S=
z&&(z.head||z.getElementsByTagName("head")[0]),ca=S&&S.getElementsByTagName("base")[0]||null,X={},Y={},N={},da="addEventListener"in m?{}:{loaded:1,complete:1},Q={},aa=Q.toString,k,l={},O={},E=!1,F,Z=/^\/|^[^:]+:\/\/|^[A-Za-z]:[\\/]/,ba=/(\.)(\.?)(?:$|\/([^\.\/]+.*)?)/g,ea=/\/\*[\s\S]*?\*\/|\/\/.*?[\n\r]/g,fa=/require\s*\(\s*(["'])(.*?[^\\])\1\s*\)|[^\\]?(["'])/g,ga=/\s*,\s*/,T,h;h={o:function(a,b,d){var c;a=V(a,b);if("."==a.charAt(0))return a;c=J(a);a=(b=c.f)||c.h;a in d.c&&(a=d.c[a].R||a);b&&(0>
b.indexOf("/")&&!(b in d.c)&&(a=I(d.T)+"/"+b),a=a+"!"+c.h);return a},j:function(a,b,d,c){function e(b,c){var d,f;d=h.o(b,g.id,a);if(!c)return d;f=J(d);if(!f.f)return d;d=l[f.f];f.h="normalize"in d?d.normalize(f.h,e,g.a)||"":e(f.h);return f.f+"!"+f.h}function f(b,d,f){var p;p=d&&function(a){d.apply(k,a)};if(u(b,"String")){if(p)throw Error("require(id, callback) not allowed");f=e(b,!0);b=l[f];if(!(f in l))throw Error("Module not resolved: "+f);return(f=L(b)&&b.b)||b}w(h.w(h.j(a,g.id,b,c)),p,f)}var g;
g=new K;g.id=b||"";g.ia=c;g.K=d;g.a=a;g.F=f;f.toUrl=function(b){return h.i(e(b,!0),a).url};g.o=e;return g},I:function(a,b,d){var c,e,f;c=h.j(a,b,k,d);e=c.resolve;f=C(1,function(a){c.v=a;try{return h.Z(c)}catch(b){c.reject(b)}});c.resolve=function(a){w(d||E,function(){e(l[c.id]=O[c.url]=f(a))})};c.M=function(a){w(d||E,function(){c.b&&(f(a),c.D(Y))})};return c},Y:function(a,b,d,c){return h.j(a,d,k,c)},ga:function(a){return a.F},N:function(a){return a.b||(a.b={})},fa:function(a){var b=a.A;b||(b=a.A=
{id:a.id,uri:h.O(a),exports:h.N(a),config:function(){return a.a}},b.b=b.exports);return b},O:function(a){return a.url||(a.url=h.H(a.F.toUrl(a.id),a.a))},V:function(a){var b,d,c,e,f;b="curl";d="define";c=e=m;if(a&&(f=a.overwriteApi||a.sa,b=a.apiName||a.la||b,c=a.apiContext||a.ka||c,d=a.defineName||a.na||d,e=a.defineContext||a.ma||e,y&&u(y,"Function")&&(m.curl=y),y=null,G&&u(G,"Function")&&(m.define=G),G=null,!f)){if(c[b]&&c[b]!=A)throw Error(b+" already exists");if(e[d]&&e[d]!=R)throw Error(d+" already exists");
}c[b]=A;e[d]=R},a:function(a){function b(a,b){var d,c,g,n,q;for(q in a){g=a[q];u(g,"String")&&(g={path:a[q]});g.name=g.name||q;n=e;c=J(I(g.name));d=c.h;if(c=c.f)n=f[c],n||(n=f[c]=v(e),n.c=v(e.c),n.g=[]),delete a[q];c=g;var l=b,H=void 0;c.path=I(c.path||c.location||"");l&&(H=c.main||"./main","."==H.charAt(0)||(H="./"+H),c.R=V(H,c.name+"/"));c.a=c.config;c.a&&(c.a=v(e,c.a));c.W=d.split("/").length;d?(n.c[d]=c,n.g.push(d)):n.s=h.U(g.path,e)}}function d(a){var b=a.c;a.S=new RegExp("^("+a.g.sort(function(a,
c){return b[c].W-b[a].W}).join("|").replace(/\/|\./g,"\\$&")+")(?=\\/|$)");delete a.g}var c,e,f,g;"baseUrl"in a&&(a.s=a.baseUrl);"main"in a&&(a.R=a.main);"preloads"in a&&(a.ta=a.preloads);"pluginPath"in a&&(a.T=a.pluginPath);if("dontAddFileExt"in a||a.l)a.l=new RegExp(a.dontAddFileExt||a.l);c=x;e=v(c,a);e.c=v(c.c);f=a.plugins||{};e.plugins=v(c.plugins);e.C=v(c.C,a.C);e.B=v(c.B,a.B);e.g=[];b(a.packages,!0);b(a.paths,!1);for(g in f)a=h.o(g+"!","",e),e.plugins[a.substr(0,a.length-1)]=f[g];f=e.plugins;
for(g in f)if(f[g]=v(e,f[g]),a=f[g].g)f[g].g=a.concat(e.g),d(f[g]);for(g in c.c)e.c.hasOwnProperty(g)||e.g.push(g);d(e);return e},i:function(a,b){var d,c,e,f;d=b.c;e=Z.test(a)?a:a.replace(b.S,function(a){c=d[a]||{};f=c.a;return c.path||""});return{a:f||x,url:h.U(e,b)}},U:function(a,b){var d=b.s;return d&&!Z.test(a)?I(d)+"/"+a:a},H:function(a,b){return a+((b||x).l.test(a)?"":".js")},P:function(a,b,d){var c=z.createElement("script");c.onload=c.onreadystatechange=function(d){d=d||m.event;if("load"==
d.type||da[c.readyState])delete N[a.id],c.onload=c.onreadystatechange=c.onerror="",b()};c.onerror=function(){d(Error("Syntax or http error: "+a.url))};c.type=a.pa||"text/javascript";c.charset="utf-8";c.async=!a.ra;c.src=a.url;N[a.id]=c;S.insertBefore(c,ca);return c},$:function(a){var b=[],d;("string"==typeof a?a:a.toSource?a.toSource():a.toString()).replace(ea,"").replace(fa,function(a,e,f,g){g?d=d==g?k:d:d||b.push(f);return""});return b},ea:function(a){var b,d,c,e,f,g;f=a.length;c=a[f-1];e=u(c,"Function")?
c.length:-1;2==f?u(a[0],"Array")?d=a[0]:b=a[0]:3==f&&(b=a[0],d=a[1]);!d&&0<e&&(g=!0,d=["require","exports","module"].slice(0,e).concat(h.$(c)));return{id:b,v:d||[],G:0<=e?c:function(){return c},u:g}},Z:function(a){var b;b=a.G.apply(a.u?a.b:k,a.v);b===k&&a.b&&(b=a.A?a.b=a.A.exports:a.b);return b},J:function(a,b){a.G=b.G;a.u=b.u;a.K=b.v;h.w(a)},w:function(a){function b(a,b,c){g[b]=a;c&&r(a,b)}function d(b,c){var d,e,f,g;d=C(1,function(a){e(a);p(a,c)});e=C(1,function(a){r(a,c)});f=h.ba(b,a);(g=L(f)&&
f.b)&&e(g);w(f,d,a.reject,a.b&&function(a){f.b&&(a==X?e(f.b):a==Y&&d(f.b))})}function c(){a.resolve(g)}var e,f,g,l,t,r,p;g=[];f=a.K;l=f.length;0==f.length&&c();r=C(l,b,function(){a.M&&a.M(g)});p=C(l,b,c);for(e=0;e<l;e++)t=f[e],t in T?(p(T[t](a),e,!0),a.b&&a.D(X)):t?d(t,e):p(k,e,!0);return a},ca:function(a){h.O(a);h.P(a,function(){var b=F;F=k;!1!==a.ja&&(!b||b.L?a.reject(Error(b&&b.L||"define() missing or duplicated: "+a.url)):h.J(a,b))},a.reject);return a},ba:function(a,b){var d,c,e,f,g,k,t,r,p,m,
n,q;d=b.o;c=b.ia;e=b.a||x;g=d(a);g in l?k=g:(f=J(g),r=f.h,k=f.f||r,p=h.i(k,e));if(!(g in l))if(q=h.i(r,e).a,f.f)t=k;else if(t=q.moduleLoader||q.qa||q.loader||q.oa)r=k,k=t,p=h.i(t,e);k in l?m=l[k]:p.url in O?m=l[k]=O[p.url]:(m=h.I(q,k,c),m.url=h.H(p.url,p.a),l[k]=O[p.url]=m,h.ca(m));k==t&&(f.f&&e.plugins[f.f]&&(q=e.plugins[f.f]),n=new K,w(m,function(a){var b,e,f;f=a.dynamic;r="normalize"in a?a.normalize(r,d,m.a)||"":d(r);e=t+"!"+r;b=l[e];if(!(e in l)){b=h.Y(q,e,r,c);f||(l[e]=b);var g=function(a){f||
(l[e]=a);b.resolve(a)};g.resolve=g;g.reject=g.error=b.reject;a.load(r,b.F,g,q)}n!=b&&w(b,n.resolve,n.reject,n.D)},n.reject));return n||m},ha:function(){var a;if(!u(m.opera,"Opera"))for(var b in N)if("interactive"==N[b].readyState){a=b;break}return a},da:function(a){var b=0,d,c;for(d=z&&(z.scripts||z.getElementsByTagName("script"));d&&(c=d[b++]);)if(a(c))return c},aa:function(){var a,b="";(a=h.da(function(a){(a=a.getAttribute("data-curl-run"))&&(b=a);return a}))&&a.setAttribute("data-curl-run","");
return b},X:function(){function a(){h.P({url:c.shift()},b,b)}function b(){D&&(c.length?(h.m(d),a()):d("run.js script did not run."))}function d(a){throw Error(a||"Primary run.js failed. Trying fallback.");}var c=D.split(ga);c.length&&a()},m:function(a){setTimeout(a,0)}};T={require:h.ga,exports:h.N,module:h.fa};A.version="0.8.13";A.config=M;R.amd={plugins:!0,jQuery:!0,curl:"0.8.13"};x={s:"",T:"curl/plugin",l:/\?|\.js\b/,C:{},B:{},plugins:{},c:{},S:/$^/};y=m.curl;G=m.define;y&&u(y,"Object")?(m.curl=
k,M(y)):h.V();(D=h.aa())&&h.m(h.X);l.curl=A;l["curl/_privileged"]={core:h,cache:l,config:function(){return x},_define:W,_curl:A,Promise:K}})(this.window||"undefined"!=typeof global&&global||this);
}).call(this);
