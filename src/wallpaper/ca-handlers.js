define(function () {
  var WallpaperHandlers = function () {
    this.domHandlerExecuted = false;
    this.pageLoadHandlerExecuted = false;
    this.advert = {};
    this.targetWindow = {};
    this.main = {};
  };

  WallpaperHandlers.prototype = {
    domLoadHandler: function (advert, targetWindow, main) {
      this.advert = advert;
      this.targetWindow = targetWindow;
      this.main = main;

      if (this.domHandlerExecuted) {
        return;
      }
      this.domHandlerExecuted = true;
      //LOAD PART 1/2

      //VARIABLES
      var wallpaperSettings = advert.contentProperties.wallpaper;
      var target = targetWindow.parent;
      var targetDoc = target.document;
      var targetMain = targetDoc.getElementById('main');
      
      //placement support
      main.settings.msnPlacement = wallpaperSettings.placement;
      if (main.settings.msnPreviewMode) main.settings.msnPlacement = 'default';

      //allow support for custom height
      if (main.wallpaperSettings.height === undefined) {
        main.wallpaperSettings.height = 980;
      }
      main.settings.msnWPHeight = main.wallpaperSettings.height;

      //logo capping support
      main.settings.msnLogoCap = wallpaperSettings.logo_cap != 'none' ? Number(wallpaperSettings.logo_cap) : 0;

      // Fixed rails
      main.settings.msnRailsFixed = wallpaperSettings.fixed_rails === true ? true : false;
      //TODO NOTE  - auto should be set in the buildLogos based on the center content overlap

      //DETECT PREVIEW
      if (targetMain == null) {
        target = targetWindow;
        targetDoc = targetWindow.document;
        targetMain = targetDoc.body;
        main.settings.msnPreviewMode = true;
        main.settings.msnPlacement = 'default';
      }
      this.target = target;
      this.targetDoc = targetDoc;
      this.targetMain = targetMain;
    },
    pageLoadHandler: function () {
      if (this.pageLoadHandlerExecuted) {
        return;
      }
      this.pageLoadHandlerExecuted = true;
      var wallpaperSettings = this.advert.contentProperties.wallpaper;
      var msnPreviewMode = this.main.settings.msnPreviewMode;
      var target =  msnPreviewMode ? this.main.targetWindow : this.main.targetWindow.parent;
      var targetDoc = target.document;
      var targetMain = msnPreviewMode ? targetDoc.body : targetDoc.getElementById('main');

      //BUILD LOGOS
      // this.main.buildLogos(this.advert.contentProperties.logos);

      //INTERACTIVE
      var flipAction = this.main.flipAction;
      console.log('[handlers] Flip Action : ' + flipAction);
      if (flipAction === 'click') {
        this.main.msnDivHeader.addEventListener('click', this.onHeaderClick.bind(this));
        this.main.msnDivRailL.addEventListener('click', this.onRailClick.bind(this));
        this.main.msnDivRailR.addEventListener('click', this.onRailClick.bind(this));
      } else {
        this.main.msnDivHeader.addEventListener('mouseenter', this.onHeaderClick.bind(this));
        this.main.msnDivRailL.addEventListener('mouseenter', this.onRailClick.bind(this));
        this.main.msnDivRailR.addEventListener('mouseenter', this.onRailClick.bind(this));

      }
      if (this.main.wallpaperSettings.sticky || this.DEBUG) {
        this.main.settings.msnScrollEnabled = main.wallpaperSettings.sticky;
        target.addEventListener('scroll', this.scrollHandler.bind(this));
      }
      target.addEventListener('resize', this.resizeHandler.bind(this));
      target.addEventListener('scroll', this.scrollHandler.bind(this));
      
      this.main.railsStickedToTop = false;


      //INITALISE -- maybe don't need this a second time?
      this.resizeHandler();
      this.main.settings.msnInitalized = true;
      var _this = this;
      this.main.helpers.logMessage('(> page load handler <)');
    },

    resizeHandler: function (main) {

      //SET STEP WIDTH BASED ON SCREEN SIZE
      var main = this.main;
      main.updateMSNStep();

      //PRELOAD AFTER PAGE LOAD
      if (main.settings.msnInitalized && main.settings.msnPreloadCount <= 1) {
        main.preloadNextWallpaper();
      }

      //VARIABLES
      var wallpaperSettings = main.advert.contentProperties.wallpaper;
      var clientW = this.targetWindow.parent.document.body.clientWidth;
      var clientH = this.targetWindow.parent.document.body.clientHeight;
      var scrollW = this.targetWindow.parent.document.body.scrollWidth;
      var stepW = main.getters.getMSNStepWidth();
      var contentW = main.getters.getMSNContentWidth();
      var headerW = main.getters.getMSNHeaderWidth();
      var headerH = main.settings.msnHeadHeight;
      var railW = main.getters.getMSNRailWidth(true);
      var marginW = main.getters.getMSNMarginWidth();


      var railRPos = (stepW - railW) + marginW;
      var actRailW = railW + marginW < 0 ? 0 : (railW + marginW);

      var bgpHeader = '0px 0px',
        bgpRailL = '0px 0px',
        bgpRailR = '0px 0px';
      var xHeader = 0,
        xRailL = 0,
        xRailR = 0;
      var hasHScroll = scrollW > clientW;

      if (hasHScroll) {
        scrollW = scrollW > stepW ? stepW : scrollW;
        headerW = actRailW == 0 && scrollW > headerW ? scrollW : headerW;
      }

      //get the rail positions
      if (main.settings.msnScrollStuck || main.settings.msnPlacement == 'fcom') {
        var ssp = (clientW - stepW) / 2;
        xRailL = (ssp > 0 ? ssp : 0);
        xRailR = (ssp + contentW + railW + (main.settings.msnPadOffset * 2));
      } else {
        xRailR = clientW > stepW ? stepW - actRailW : clientW - actRailW;
      }


      //get the wallpaper background positions
      if (main.wallpaperSettings.alignment == 'center') {
        var offset = stepW != main.settings.msnWPWidth ? -((main.settings.msnWPWidth / 2) - (clientW / 2)) : marginW;
        bgpHeader = offset + 'px 0px';
        if (main.settings.msnRailsFixed) {
          bgpRailL = offset + 'px -' + 0 + 'px';
          bgpRailR = '-' + (railRPos - offset) + 'px -' + 0 + 'px';
        } else {
          bgpRailL = offset + 'px -' + main.settings.msnHeadHeight + 'px';
          bgpRailR = '-' + (railRPos - offset) + 'px -' + main.settings.msnHeadHeight + 'px';
        }
      } else {
        bgpRailL = '0px -' + main.settings.msnHeadHeight + 'px';
        bgpRailR = '-' + railRPos + 'px -' + main.settings.msnHeadHeight + 'px';
      }

      try {
        var innerEl = this.targetWindow.document.getElementById('inner');
        innerEl.style.marginTop = '250px';
      } catch (e) {
        console.log('___ inner not found ' + e.message);
      }

      var topValue = 0;
      var topRails = 250;

      main.msnDivHeader.style.top = topValue + 'px';
      main.msnDivHeader.style.width = main.helpers.getPX(headerW);

      main.msnDivRailL.style.top = topRails + 'px';
      main.msnDivRailL.style.width = main.helpers.getPX(actRailW);
      main.msnDivRailR.style.width = main.helpers.getPX(actRailW);

      main.msnDivRailR.style.top = topRails + 'px';
      //POSITION HEADER AND RAIL LEFT
      var leftOffset = -((main.settings.msnWPWidth / 2) - (clientW / 2));
      if (main.settings.msnWPWidth > clientW) {
        leftOffset = 0;
      }
      if (main.settings.msnPlacement == 'fcom') xHeader = xRailL;
      main.msnDivHeader.style.left = main.helpers.getPX(leftOffset + xHeader);
      main.msnDivRailL.style.left = main.helpers.getPX(leftOffset + xRailL);
      main.msnDivRailR.style.left = main.helpers.getPX(leftOffset + xRailR);

      if (main.settings.msnPlacement == 'fcom') {
        // var topset = stepW != 1600 ? this.msnScrollTop : 0;
        var topset = 0;
        //weird bug fix
        if (main.msnIsIE && stepW > 836 && clientW >= 820 && clientW <= (main.msnIsEdge ? 930 : 925)) {
          //main.msnDivHeader.style.width = this.getPX(targetWindow.innerWidth);
          topset = 0;
        }

        main.msnDivHolder.style.top = main.helpers.getPX(topset);
      }

      //BACKGROUND POSITION
      main.msnDivHeader.style.backgroundPosition = bgpHeader;
      main.msnDivRailL.style.backgroundPosition = bgpRailL;
      main.msnDivRailR.style.backgroundPosition = bgpRailR;
      main.msnDivRailR.style.backgroundRepeat = 'no-repeat';
      main.msnDivRailL.style.backgroundRepeat = 'no-repeat';
      main.msnDivRailR.style.backgroundColor = main.wallpaperBackgroundColor;
      main.msnDivRailL.style.backgroundColor = main.wallpaperBackgroundColor;


      //UPDATE LOGO POSITION
      // main.updateLogos();

      // Fix rails 
      if (main.settings.msnRailsFixed) {

        main.msnDivRailL.style.setProperty('position', 'fixed', 'important');
        main.msnDivRailL.style.setProperty('z-index', '20002', 'important');;
        main.msnDivRailL.style.setProperty('top', topValue + 'px', 'important');

        main.msnDivRailR.style.setProperty('position', 'fixed', 'important');
        main.msnDivRailR.style.setProperty('z-index', '20003', 'important');
        main.msnDivRailR.style.setProperty('top', topValue + 'px', 'important');
      }
    },

    scrollHandler: function () {
      var main = this.main;
      if (main.settings.msnRailsFixed) {
        var st = main.targetWindow.parent.document.body.scrollTop;
        var shouldStick = st >= (main.settings.msnScrollCap - 70);

        if (shouldStick) {
          if (main.settings.railsStickedToTop) {
            main.msnDivRailL.style.setProperty('top', '60px', 'important');
            main.msnDivRailR.style.setProperty('top', '60px', 'important');
            return;
          }
          main.settings.railsStickedToTop = true;
          main.msnDivRailL.style.setProperty('top', '60px', 'important');
          main.msnDivRailR.style.setProperty('top', '60px', 'important');
        } else {
          main.msnDivRailL.style.setProperty('top', (0 - st / 2) + 'px', 'important');
          main.msnDivRailR.style.setProperty('top', (0 - st / 2) + 'px', 'important');
        }
      }
    },

    /* --------------
      Rollover HANDLERS 
      ------------ */
    onWallpaperRollover: function () {
      this.advert.eventBus.dispatchEvent('wallpaper-click');
      // this.loadFlipInterstitialCssFile();
    },
    /* --------------
      CLICK HANDLERS 
      ------------ */

    onWallpaperClick: function (e) {
      this.advert.eventBus.dispatchEvent('wallpaper-click');
			this.trackGateOpen(this);		
      return
      // var ct = this.advert.contentProperties.wallpaper.clickthrough;
      // if (ct != '') {
        // this.advert.dynamicClick('Wallpaper', ct);
        // this.advert.eventBus.dispatchEvent('wallpaper-click');
        // this.loadFlipInterstitialCssFile();
      // }
    },
    onHeaderClick: function (e) {
      this.advert.eventBus.dispatchEvent('wallpaper-click');
		this.trackGateOpen(this);	
      // this.advert.dynamicClick('Wallpaper', ct);         
      // var ct = this.advert.contentProperties.wallpaper.clickthrough;
      // this.loadFlipInterstitialCssFile();
    },
    onRailClick: function (e) {
      this.advert.eventBus.dispatchEvent('wallpaper-click');
			this.trackGateOpen(this);	
      switch (e.target.id) {
        case 'oc-rail-left':
          // this.advert.eventBus.dispatchEvent('rail-left-click');
          break;
        case 'oc-rail-right':
          // this.advert.eventBus.dispatchEvent('rail-right-click');
          break;
        default:
          //this.advert.eventBus.dispatchEvent('rail-click');  
      }
    },
    onStickyTog: function (e) {
      this.msnScrollEnabled = !this.msnScrollEnabled;
      this.msnDivStickyTog.className = this.msnScrollEnabled ? 'enabled' : 'disabled';
      this.msnDivStickyTog.classList = this.msnScrollEnabled ? 'enabled' : 'disabled';
      this.scrollHandler();
    },
		trackGateOpen: function(scope) {
			var self = scope;
			setTimeout(function() {
				self.advert.eventBus.dispatchEvent('gate-open');		
			}, 3000);
		},
    onAlignTog: function (e) {
      var alg = this.advert.contentProperties.wallpaper.alignment;
      alg = alg == 'center' ? 'left' : 'center';
      this.advert.contentProperties.wallpaper.alignment = alg;
      var en = alg == 'center';


      this.msnDivAlignTog.className = en ? 'enabled' : 'disabled';
      this.msnDivAlignTog.classList = en ? 'enabled' : 'disabled';
      this.resizeHandler();
    }

  };

  return function () {
    return new WallpaperHandlers();
  };
});
