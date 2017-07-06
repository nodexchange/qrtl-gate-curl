define(function () {
  var WallpaperGetters = function () {};
  var targetWindow = {};
  WallpaperGetters.prototype = {
    setup: function(main) {
      this.main = main;
      this.advert = this.main.advert;
      targetWindow = main.targetWindow;
    },
    /* --------------
      GETTERS 
      ------------ */
    getMSNStyleSheet: function (advert) {
      var wallpaperSettings = advert.contentProperties.wallpaper;
      var s = '';
      var msnWPHeight = this.main.settings.msnWPHeight;
      var msnHeadHeight = this.main.settings.msnHeadHeight;
      var msnHeadOffset = this.main.settings.msnHeadOffset;
      
      var rh = msnWPHeight; // 850

      s = s.concat('#main .sectioncontent:first-child .outeradcontainer{width:100%; padding-top: 30px; overflow: hidden;}'); //pushes down adchoice leader logo, hides overflow in 836px
      s = s.concat('#oc-header{background:' + wallpaperSettings.background + ';}');
      s = s.concat('.oc-rail{background:' + wallpaperSettings.background + ';}');
      s = s.concat('#oc-header{position:absolute; top: ' + msnHeadOffset + 'px; left: 0; width: 100%; height: ' + msnHeadHeight + 'px; cursor:pointer;z-index:500}');
      s = s.concat('.oc-rail{background-position:0px -' + msnHeadHeight + 'px; position:absolute; top: ' + (msnHeadOffset + msnHeadHeight) + 'px; width: 164px; height: ' + rh + 'px; cursor:pointer;z-index:1950}');
      s = s.concat('#oc-rail-left{left:0; z-index:1951}');
      s = s.concat('#oc-rail-right{right:0; z-index:1952}');
      s = s.concat('#oc-logo-holder{height: 100%;width: 100%;overflow: hidden;position: absolute;}');
      s = s.concat('.oc-logo{position:absolute;top:0}');
      s = s.concat('.oc-logo.left,.oc-logo.center{left:0;right:auto}');
      s = s.concat('.oc-logo.right{left:auto;right:0;}');
      //s = s.concat('#oc-logo-left{left:0; margin-left:0}');
      //s = s.concat('#oc-logo-right{right:0; margin-right:0}');

      // customCSS
      if (wallpaperSettings.custom_css != '') {
        s = s.concat(wallpaperSettings.custom_css);
      }

      return s;
    },

    getMSNStepId: function () {
      if (!targetWindow) {
        targetWindow = this.main.targetWindow;
      }
      var w = targetWindow.parent.innerWidth;
      var h = targetWindow.parent.innerHeight;

      var sa = this.main.settings.msnSteps;
      var sc = sa.length;
      var s = 0;

      if (w >= sa[sc - 1]) {
        s = sc - 1;
      } else {
        for (var i = 0; i < sc; s = ++i) {
          if (w < sa[i]) break;
        }
      }

      //IE edge case support
      if (this.msnIsIE) {
        var os = s;
        if (s == 1) s = 2;
        if (s == 3) s = 4;
        //if don't update wallpaper logo capping breaks
        //this.updateWallpaper(sa[os]);
      }

      return s;
    },

    getMSNContentWidth: function () {
      var msnConWs = this.main.settings.msnConWs;
      var msnStepId = this.main.settings.msnStepId;
      var selectedStep = msnConWs[msnStepId];
      if (!selectedStep) {
        selectedStep = msnConWs[msnStepId - 1];
      }
      return selectedStep;
    },

    getMSNStepWidth: function () {
      var msnSteps = this.main.settings.msnSteps;
      var msnStepId = this.main.settings.msnStepId;
      var selectedStep = msnSteps[msnStepId];
      if (!selectedStep) {
        selectedStep = msnSteps[msnStepId - 1];
      }
      return selectedStep;
    },

    getMSNHeaderWidth: function () {
      var clientW = targetWindow.parent.document.body.clientWidth;
      var stepW = this.getMSNStepWidth();

      //could support horizontal scroll edge cases
      if (this.msnScrollWidthSupport) {
        var scrollW = targetWindow.parent.document.body.scrollWidth;
        scrollW = scrollW > stepW ? stepW : scrollW;
        clientW = scrollW > clientW ? scrollW : clientW;
      }

      return clientW < stepW ? clientW : stepW;
    },

    getMSNRailWidth: function (padComp) {
      var sw = this.getMSNStepWidth();
      var cw = this.getMSNContentWidth();
      var rw = (sw - cw) / 2;

      return padComp === true ? rw - this.main.settings.msnPadOffset : rw;
    },

    getMSNMarginWidth: function () {
      var clientW = targetWindow.parent.document.body.clientWidth;
      var contentW = this.getMSNContentWidth();
      var stepW = this.getMSNStepWidth();
      var railW = this.getMSNRailWidth();
      var marginW = 0;
      var gutterRem = clientW - contentW;
      var railVis = gutterRem / 2;

      return clientW < stepW ? -(railW - railVis) : 0;;
    },

    getFileUrl: function (str, src) {
      if (!this.advert) {
        this.advert = this.main.advert;
      }
      return this.advert.getFileUrl(str);
    }
  };

  return function () {
    return new WallpaperGetters();
  };
});