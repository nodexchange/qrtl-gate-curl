/*!
 * Mobile Flip Interstitial - 0.3.1 Copyright 2012 AOL Advertising.
 */

// _header
var com = com || {};
com.adtech = com.adtech || {};
com.adtech.MobileTemplate = com.adtech.MobileTemplate || {};
com.adtech.MobileTemplate.FlipInterstitial = com.adtech.MobileTemplate.FlipInterstitial || {};

// Copyright 2012 AOL Advertising

// Custom Events classed based on Nicholas C. Zakas (http://www.nczonline.net/) Class under MIT License
/**
 * Utility class.
 * ADTECH UK - 10/2012
 * @class
 *
 * @author martin.wojtala@adtech.com
 */

com.adtech.MobileTemplate.Util = {
  createHtml: function (id, appendTarget, type, className) {
    var element = document.createElement((type) ? type : 'div');
    if (className) {
      element.className = className;
    } else if (id) {
      element.id = id;
    }
    if (appendTarget) {
      appendTarget.appendChild(element);
    }
    return element;
  },

  isValid: function (val) {
    if ((val && val != '' && val !== -1) || val === 0) {
      return true;
    }
    return false;
  },

  extend: function (original, extension) {
    for (var key in extension) {
      if (extension.hasOwnProperty(key)) {
        original[key] = extension[key];
      }
    }
  },

  listeners: {},
  addEventListener: function (type, listener,target) {
    if (typeof this.listeners[type] == 'undefined') {
      this.listeners[type] = [];
    }
    this.listeners[type].push({listener:listener, target:target});
  },

  dispatchEvent: function (event, params) {
    if (typeof event == 'string') {
      event = { type: event };
    }
    if (params) {
      event.params = params;
    }

    if (this.listeners[event.type] instanceof Array) {
      var listenersArray = this.listeners[event.type];
      for (var i = 0; i < listenersArray.length; i++) {
        listenersArray[i].listener.call(listenersArray[i].target, event);
      }
    }
  },

  removeEventListener: function (type, listener) {
    if (this.listeners[type] instanceof Array) {
      var listenersArray = this.listeners[type];
      for (var i = 0; i < listenersArray.length; i++) {
        if (listenersArray[i] === listenersArray) {
          listenersArray.splice(i, 1);
          break;
        }
      }
    }
  },

  //innerHtml extend that executes scripts embedded within html
  insertAndExecute: function (container,responseText){
    var domelement = container;
    domelement.innerHTML = responseText;
    var scripts = [];

    var ret = domelement.childNodes;
    for ( var i = 0; ret[i]; i++ ) {
      if ( scripts && this.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
        scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
      }
    }
    for(var script in scripts)
    {
      this.evalScript(scripts[script]);
    }
  },
  nodeName: function(elem, name){
    return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
  },
  evalScript: function(elem){
    if(elem){
      var data = ( elem.text || elem.textContent || elem.innerHTML);
    } else {
      data = "";
    }

    var head = document.getElementsByTagName("head")[0] || document.documentElement,
      script = document.createElement("script");
    script.type = "text/javascript";
    script.appendChild( document.createTextNode( data ) );
    head.insertBefore( script, head.firstChild );
    head.removeChild( script );
    if(elem){
      if ( elem.parentNode ) {
        elem.parentNode.removeChild( elem );
      }
    }
  },
  isMobile: {
    Android: function () {
      return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function (scope) {
      return (scope.isMobile.Android() || scope.isMobile.BlackBerry() || scope.isMobile.iOS() ||
            scope.isMobile.Windows());
    }
  }
};
com.adtech.MobileTemplate.FlipInterstitial.Advert = function () {
  this.advertSettings = ADTECH.getContent('Gate image or HTML file', "1366x76815.jpg");
  var autoScale = ADTECH.getContent('Auto Scale Advert', "false");
  this.advertAutoScale = (autoScale == 'true' || autoScale === true) ? true : false;
  this.init();
};
com.adtech.MobileTemplate.FlipInterstitial.Advert.prototype = {
  init: function () {
    var flipInterstitialContainer = document.getElementById('flipInterstitialContainer');
    var advertAssetContainer = document.createElement('div');
    advertAssetContainer.setAttribute('id','advertAssetContainer');
    flipInterstitialContainer.appendChild(advertAssetContainer);
    var splitUrl = String(this.advertSettings).toLowerCase().split('.');
    var filenameExt = splitUrl[splitUrl.length-1];
    if(filenameExt != ''){
      if (filenameExt == 'jpg' || filenameExt == 'gif' || filenameExt == 'png') {
        var imgElement = document.createElement('img');
        imgElement.src = ADTECH.getFileUrl(this.advertSettings);
        // advertAssetContainer.appendChild(imgElement);
        var _this = this;
        imgElement.style.cursor = 'pointer';
				imgElement.style.width = 100 +'%';
				imgElement.style.height = 100 + '%';
        if(this.advertAutoScale == true){
          imgElement.style.width = '100%';
          imgElement.style.height = '100%';
          this.adjustAdvertContainer(advertAssetContainer);
        }
        imgElement.onclick = function(){
          _this.clickHandler();
        };
      } else {
        this.loadFile(this.advertSettings);
      }
    } else {
      var errorMsg = document.createElement('div');
      errorMsg.innerHTML =
        'Image Not Found - Error 404 '+filenameExt+'<br/>Please check Content > Panels Settings > Image File';
      advertAssetContainer.appendChild(errorMsg);
    }
    // this.createCloseButton(flipInterstitialContainer);
    this.createVideoPlayer(flipInterstitialContainer);
  },
  loadFile: function (url) {
    var _self = this;
    var _url = url;
    var advertContainer = document.getElementById('advertAssetContainer');
    $('#advertAssetContainer').load(ADTECH.getFileUrl(url), function(responseText, statusText, xhr)
    {
      if(statusText == "success"){
        com.adtech.MobileTemplate.Util.insertAndExecute(advertContainer,responseText);
        if(this.advertAutoScale == true){
          this.adjustAdvertContainer(advertAssetContainer);
        }
      } else if(statusText == "error"){
        var errorMsg = document.createElement('div');
        errorMsg.innerHTML =
          "An error occurred: " + xhr.status + " - " + xhr.statusText +'<br/><br/> url: ' +_url;
        advertContainer.appendChild(errorMsg);
      }
    });
  },
  clickHandler: function () {
    var click = ADTECH.getContent('Clickthrough URL', 'http://www.adtech.com');
    ADTECH.dynamicClick('Clickthrough URL', click);
  },
  adjustAdvertContainer:function(advertAssetContainer){
    advertAssetContainer.style.width = $(document).width();
    advertAssetContainer.style.height = $(document).height();
    advertAssetContainer.style.overflow = 'hidden';
    advertAssetContainer.style.display = 'block'; 
  },
  createCloseButton: function (container) {
    var closeButton = document.createElement('div');
    closeButton.setAttribute('id', 'close-button');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '15px';
    //closeButton.style.left = '280px';
    closeButton.style.right = '135px';
    closeButton.style.cursor = 'pointer';
    var imageCloseButton = document.createElement('img');
    imageCloseButton.src = ADTECH.getFileUrl('close-button.png');
    imageCloseButton.width = 29;
    imageCloseButton.height = 29;
    closeButton.appendChild(imageCloseButton);
    container.appendChild(closeButton);
    closeButton.onclick = closeButton.ontouchstart = function(){
      ADTECH.event('close_advert');
    };
  },
  createImg: function (fileSrc, w, h, holder) {
    var img = document.createElement('img');
    img.src = fileSrc;
    // Forced for retina display
    img.width = w;
    img.height = h;
    holder.appendChild(img);
    return img;
  },
  createVideoPlayer: function(container) {
    var videoSettings = ADTECH.getContent('Video Player', {top:20, left:20, 'video mp4':'stock.mp4', 'video webm': '.webm', 'width': 500, height: 300, 'size settings':'px||%', autoplay:true, poster:'poster.jpg' });
    var svpContainer = document.createElement('div');
    svpContainer.className = 'svpContainer';
    container.appendChild(svpContainer);
    svpContainer.style.top = videoSettings['top'] + 'px';
    svpContainer.style.left = videoSettings['left'] + 'px';
    var videoWidth = videoSettings.width;
    var videoHeight = videoSettings.height;
    if (videoSettings['size settings'] === '%') {
      videoWidth =  videoWidth + '%';
      videoHeight = videoHeight + '%';
      svpContainer.style.top = videoSettings['top'] + '%'
      svpContainer.style.left = videoSettings['left'] + '%'; 
    }
    var smartPlayer;
		ADTECH.addEventListener('pause_video_player', function() {
			smartPlayer.pause();
		});
    console.log('[advert] video mp4 : ' + videoSettings['video mp4']);
    ADTECH.require(['SmartVideoPlayer/1.5.1/SmartVideoPlayer'], function() {
      smartPlayer = ADTECH.modules.SmartVideoPlayer.createPlayer({
        container: svpContainer,
        width: videoWidth,
        height: videoHeight,
        autoplay: videoSettings.autoplay,
        poster: videoSettings.poster,
        src: {
          mp4: videoSettings['video mp4'],
          webm: videoSettings['video webm']
        }
      });
    });
  }
};
var displayed = false;
ADTECH.ready(function(){
  $(function(){
		console.log(' : displayed : ' + displayed);
		if (!displayed) {
			new com.adtech.MobileTemplate.FlipInterstitial.Advert();
		}
		displayed = true;
		
	});
});
/*
setTimeout(function() {
	
	console.log('timer : displayed : ' + displayed);
	if (!displayed) {
		new com.adtech.MobileTemplate.FlipInterstitial.Advert();
	}
	displayed = true;
}, 3000);
*/

