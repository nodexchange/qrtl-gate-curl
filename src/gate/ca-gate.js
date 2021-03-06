define(['gate/ca-listeners', 'gate/ca-builders', 'gate/ca-transitions', 'gate/ca-utils'],
  function (Listeners, Builders, Transitions, Utils) {
    var Gate = function () {};

    Gate.prototype = {
      init: function (targetWindow, advert) {
        this.advert = advert;
        this.targetWindow = targetWindow;
        this.container = {};
        this.gateSettings = this.advert.getContent('Gate Background');
        this.filesLoaded = false;
        this.autoOpenDelay = 0;
        this.autoCloseDelay = 133;
        this.listeners = new Listeners(this);
        this.builders = new Builders(this);
        this.transitions = new Transitions(this);
        this.utils = new Utils(this);
      },

      loadFiles: function() {
        this.utils.loadFlipInterstitialCssFile(this.filesReady, this);
      },

      filesReady: function (scope) {
        scope.transitions.initTransition();
      },

      manipulateDom: function (scope) {
        var targetWindow = scope.targetWindow;
        var self = scope;

        self.container = targetWindow.document.createElement("div");
        self.container.className = 'container';

        var viewWidth = (targetWindow.innerWidth > 0) ? targetWindow.innerWidth : screen.width;
        var viewHeight = (targetWindow.innerHeight > 0) ? targetWindow.innerHeight : screen.height;

        if (self.advertAutoScale === true) {
          self.container.style.width = viewWidth + 'px';
          self.container.style.height = viewHeight + 'px';
        }

        var webpageContainer = targetWindow.document.createElement("div");
        webpageContainer.setAttribute('id', 'webpageContainer');
        self.container.appendChild(webpageContainer);

        var frontPage = targetWindow.document.createElement("div");
        frontPage.id = 'front';
        frontPage.setAttribute('class', 'card-page');
        webpageContainer.appendChild(frontPage);
        self.frontPageDiv = frontPage;

        targetWindow.document.body.insertBefore(self.container, targetWindow.document.body.children[0]);
        self.elements = [];
        self.domChildrenTotal = targetWindow.document.body.children.length;
        for (var x = 0; x < self.domChildrenTotal; x++) {
          var nodeInstance = targetWindow.document.body.children[x];
          if (nodeInstance.toString() != '[object HTMLScriptElement]') {
            if (nodeInstance.toString() == '[object HTMLIFrameElement]') {
              if (nodeInstance.id !== '__bs_notify__') {
                var iframeContent = nodeInstance;
                var iFrameBody;
                try {
                  if (iframeContent.contentDocument) { // FF
                    iFrameBody = iframeContent.contentDocument.getElementsByTagName('body')[0];
                  } else if (iframeContent.contentWindow) { // IE
                    iFrameBody = iframeContent.contentWindow.document.getElementsByTagName('body')[0];
                  }
                  nodeInstance = iFrameBody;
                  self.elements.push({
                    content: nodeInstance,
                    index: x,
                    parent: iframeContent.parentNode.toString()
                  });
                } catch (e) {
                  console.log('[ca-gate] manipulate error :' + e.message);
                  // self.logMessage('manipulate error : ' + e.message);
                }
              }
              
            } else {
              if (nodeInstance.className != 'container' && nodeInstance.id != 'debug') {
                self.elements.push({
                  content: nodeInstance,
                  index: x,
                  parent: nodeInstance.parentNode.toString()
                });
              }
            }
          }
        }
        for (var i = 0; i < self.elements.length; i++) {
          frontPage.appendChild(self.elements[i].content);
        }

        var backDiv = targetWindow.document.createElement('div');
        backDiv.setAttribute('id', 'back');
        backDiv.setAttribute('class', 'card-page');
        webpageContainer.appendChild(backDiv);
        self.backDiv = backDiv;

        var mainContainer = self.advert.getAssetContainer('main');
        if (mainContainer.div) {
          backDiv.appendChild(mainContainer.div);
          mainContainer.div.removeAttribute('style');
          mainContainer.div.style.marginTop = ((viewHeight / 2) - 200) + 'px';
        }

        var backgroundPage = targetWindow.document.createElement("div");
        backgroundPage.id = 'background';

        var gateBg = self.gateSettings;
        backgroundPage.style.background = 'url(' + gateBg + ') no-repeat 50% 0';
        backgroundPage.style.backgroundSize = 'contain';
        backgroundPage.setAttribute('class', 'card-page');
        webpageContainer.appendChild(backgroundPage);
        self.backgroundPage = backgroundPage;


        var backgroundPageCover = targetWindow.document.createElement("div");
        backgroundPageCover.id = 'backgroundCover';
        backgroundPageCover.style.background = 'url(' + gateBg + ') no-repeat 50% 0';
        backgroundPageCover.style.backgroundSize = 'cover';
        backgroundPageCover.setAttribute('class', 'card-page');
        webpageContainer.appendChild(backgroundPageCover);
        self.backgroundCoverPage = backgroundPageCover;

        self.transitions.initTransition(); // transition;
        self.listeners.assignClickHandlers();
        self.pageDomUpdated = true;
      },

      restoreDom: function () {
        this.elements.reverse();
        for (var i = 0; i < this.domChildrenTotal; i++) {
          if (this.elements[i]) { // check against for undefined;
            if (this.elements[i].parent == targetWindow.document.body.toString()) {
              targetWindow.document.body.insertBefore(
                this.elements[i].content, targetWindow.document.body.children[0]);
            } else {
              this.elements[i].parent.appendChild(this.elements[i].content);
            }
          }
        }
        this.container.style.display = 'none';
        targetWindow.document.body.removeChild(this.container);
      },

      updateMainDimensions: function (expand) {
        if (expand) {
          this.advert.getAssetContainer('main').div.style.height = adHeight + 'px';
          this.advert.getAssetContainer('main').div.children[0].height = adHeight;
          this.advert.getAssetContainer('main').div.children[0].style.height = adHeight + 'px';
        } else {
          /*
          this.advert.getAssetContainer('main').div.style.height = 92 + 'px';
          this.advert.getAssetContainer('main').div.children[0].height = 92;
          this.advert.getAssetContainer('main').div.children[0].style.height = 92 + 'px';
          */
        }

      },
      shiftWallpaperPostFlip: function(flipped) {
        // Dispatch event to the wallpaper? 
      },

      closeHandler: function() {
        this.transitions.initTransition(); // transition;
      },

      events: function () {
        // ADTECH.getContent('Wallpaper Background Colour', '#fff');
        // ADTECH.getContent('Gate Background', 'background.jpg');
        // ADTECH.getContent('Auto close time - in seconds', '10');
        // ADTECH.getContent('Auto open time - in seconds', '0');
        // ADTECH.getContent('Auto Full Screen Size', "false");
        // ADTECH.getContent('Flip Action', 'click||however');
        // ADTECH.getContent('Background', {'enabled':true, colour:'#fff'});
        // ADTECH.getContent('Flyover Object', {'enabled':true, image:'transparent-car.png', y:0 });
        // ADTECH.event('stateChange');
      }
    };

    return function () {
      return new Gate();
    };
  });