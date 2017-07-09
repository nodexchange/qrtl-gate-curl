define(['wallpaper/ca-settings', 'wallpaper/ca-handlers', 'wallpaper/ca-helpers', 'wallpaper/ca-getters'],
  function (caSettings, caHandlers, caHelpers, caGetters) {
    var wallpaper = function () {
      this.settings = new caSettings();
      this.wallpaperSettings = {};
      this.flipAction = 'click'; // this.main.advert.getContent('Flip Action')
      this.handlers = new caHandlers();
      this.helpers = new caHelpers();
      this.getters = new caGetters();
      this.getters.setup(this);
    };

    wallpaper.prototype = {
      init: function (targetWindow, advert, utils) {
        this.msnIsIE = utils.isIE() != false;
        var ua = targetWindow.parent.navigator.userAgent;
        if (!this.msnIsIE) this.msnIsIE = this.msnIsEdge = ua.indexOf('Edge') > 0;

        this.advert = advert;
        this.targetWindow = targetWindow;
        this.wallpaperSettings = this.advert.getContent('wallpaper');
        
      },

      build: function () {
        this.handlers.domLoadHandler(this.advert, this.targetWindow, this);
        //BUILD DIVS
        this.msnDivHeader = this.helpers.createDiv(this.handlers.targetDoc, 'oc-header');
        this.msnDivRailL = this.helpers.createDiv(this.handlers.targetDoc, 'oc-rail-left', 'oc-rail');
        this.msnDivRailR = this.helpers.createDiv(this.handlers.targetDoc, 'oc-rail-right', 'oc-rail');

        //DISPLAY STACK
        if (this.settings.msnPlacement == 'fcom') {

          //fcom/sponsorships go into a different target
          this.handlers.targetMain = this.handlers.targetDoc.getElementById('precontent');
          this.settings.msnHeadHeight = 250;

          
          this.msnDivHolder = this.helpers.createDiv(this.handlers.targetDoc, 'oc-holder');
          this.helpers.addStyleString('#oc-holder{ position: absolute; top:0; left:0}');
          this.msnDivHolder.appendChild(this.msnDivRailL);
          this.msnDivHolder.appendChild(this.msnDivRailR);
          this.msnDivHolder.appendChild(this.msnDivHeader);
          this.handlers.targetMain.insertBefore(this.msnDivHolder, this.handlers.targetMain.childNodes[0]);

        } else {
          //default vertical and onecreative
          if (this.handlers.targetMain != null) {
            this.handlers.targetMain.insertBefore(this.msnDivRailL, this.handlers.targetMain.childNodes[0]);
            this.handlers.targetMain.insertBefore(this.msnDivRailR, this.handlers.targetMain.childNodes[0]);
            this.handlers.targetMain.insertBefore(this.msnDivHeader, this.handlers.targetMain.childNodes[0]);
          }

        }

        //INJECT STYLES
        var strString = this.getters.getMSNStyleSheet(this.advert);
        this.helpers.addStyleString(strString, this.targetWindow, this.settings.msnPreviewMode, this.handlers.target);


        //INITALIZE
        this.handlers.pageLoadHandler();

        this.handlers.resizeHandler(this);
        this.helpers.adjustIndependentSite(this.targetWindow);
      },

      /* --------------
        BUILD STACKS 
        ------------ */

      buildLogos: function (logos) {

        this.msnLogosArray = [];
        if (logos.length <= 1) {
          if (logos[0].img == '') {
            return;
          }
        }

        this.msnDivLogoHolder = this.createDiv(targetWindow.document, 'oc-logo-holder');
        var lc = logos.length;

        for (var i = 0, data, logo; i < lc; i++) {

          //create logo and get data for it
          data = logos[i];
          var td = data['Tracking Id'];
          var id = td.indexOf(' ') == -1 ? td : null;
          logo = this.helpers.createDiv(targetWindow.document, id, 'oc-logo ' + data.pos);

          //add specific styles to logo        
          logo.style.background = 'url(' + this.helpers.getFileUrl(data.img) + ')';
          logo.style.backgroundSize = 'cover';
          logo.style.marginTop = this.helpers.getPX(data.offset_y);
          logo.style.width = this.helpers.getPX(data.width);
          logo.style.height = this.helpers.getPX(data.height);

          if (data.pos == 'right') {
            logo.style.marginRight = this.getPX(data.offset_x);
          } else {
            logo.style.marginLeft = this.getPX(data.offset_x);
          }

          //add the logo to the display and array
          this.msnDivLogoHolder.appendChild(logo);
          this.msnLogosArray.push(logo);
        }

        this.msnDivHeader.appendChild(this.msnDivLogoHolder);
      },



      /* --------------
        UPDATE POINTS
        ------------ */

      updateMSNStep: function () {
        //update the step ID for the page 
        var oldId = this.settings.msnStepId;
        var newId = this.getters.getMSNStepId();

        if (oldId != newId) {
          this.settings.msnStepId = newId;
          this.updateWallpaper();

          var stepW = this.getters.getMSNStepWidth();
          this.msnDivHeader.className = 'step-' + stepW;
          this.msnDivHeader.classList = 'step-' + stepW;
        }
      },

      updateWallpaper: function (override) {

        //get wallpaper for step and main
        var wallpaperSettings = this.advert.contentProperties.wallpaper;
        var stepSettings = this.advert.contentProperties.steps;

        var stepW = this.getters.getMSNStepWidth();
        var urlMain = this.wallpaperSettings.main;

        var urlStep = stepSettings['step_' + stepW];
        var url = urlStep != '' ? urlStep : urlMain;


        //update wallpaper width
        this.msnWPWidth = urlStep != '' ? stepW : 1600;
        this.settings.msnWPWidth = this.msnWPWidth;

        //override 
        if (override != null) {
          stepW = override;
          //redo 
          urlStep = stepSettings['step_' + stepW];
          url = urlStep != '' ? urlStep : urlMain;
        }


        //update wallpaper
        if (url != '') {
          url = 'url(' + this.getters.getFileUrl(url) + ')';
          this.msnDivHeader.style.backgroundImage = url;
          this.msnDivRailL.style.backgroundImage = url;
          this.msnDivRailR.style.backgroundImage = url;
        } else if (this.msnPreviewMode && wallpaperSettings.background == '#ffffff') {
          //no wallpaper in creative preview
          this.addStyleString('#oc-header,.oc-rail{background:#f2f2f2}');
          this.addStyleString('#oc-header:after{color: red;font-family: Arial;content: "• Upload Wallpaper";position: absolute;top: 10px;font-size: 10pt;left: 10px;}');
        }

        //preload
        this.settings.msnPreloadList[this.settings.msnStepId] = 1;
        if (this.settings.msnInitalized && this.settings.msnPreloadCount != this.settings.msnPreloadList.length) {
          this.preloadNextWallpaper();
        }
      },



      preloadNextWallpaper: function () {

        var nextStepId = this.settings.msnStepId + 1;
        var prevStepId = this.settings.msnStepId - 1;

        //prevent repeat or empty load
        if (this.settings.msnPreloadList[nextStepId] == 1 || nextStepId >= this.settings.msnSteps.length) {
          nextStepId = -1;
        }
        if (this.settings.msnPreloadList[prevStepId] == 1 || prevStepId < 0) {
          prevStepId = -1;
        }
        if (nextStepId < 0 && prevStepId < 0) {
          return;
        }

        //from this point can preload

        var stepSettings = this.advert.contentProperties.steps;

        if (nextStepId != -1) {
          stepW = this.settings.msnSteps[nextStepId];
          urlStep = stepSettings['step_' + stepW];
          this.settings.msnPreloadList[nextStepId] = 1;
          if (urlStep != '') {
            this.helpers.preloadImage(this.getters.getFileUrl(urlStep));
          }
        }

        //upload preload count
        this.settings.msnPreloadCount = this.settings.msnPreloadList.reduce(function (t, n) {
          return t + n;
        });
      },

      updateLogos: function () {
        if (this.settings.msnLogosArray.length == 0) {
          return;
        }

        var hw = this.getMSNHeaderWidth();
        var hh = this.settings.msnHeadHeight;
        var capped = this.getMSNStepWidth() <= this.msnLogoCap;
        /* NOTE

        the left/right logos should only move when above a minimum width, 
        otherwise left/right margins are replaced with left right offset

        */

        for (var i = 0, logo, data, cw, ch; i < this.msnLogosArray.length; i++) {
          data = this.advert.contentProperties.logos[i];
          logo = this.msnLogosArray[i];
          cw = data.width; //should check for ""
          ch = data.height;

          if (data.pos == 'center') {
            logo.style.top = this.getPX((hh / 2) - (ch / 2));
            logo.style.left = this.getPX((hw / 2) - (cw / 2));
          } else {

            //deal with overlap
            logo.style.display = capped ? 'none' : 'block';

          }

          if (data.fixed) {
            var stepW = this.getMSNStepWidth();
            var railW = this.getMSNRailWidth(true);
            var marginW = this.getMSNMarginWidth();
            var actRailW = railW + marginW;
            var w = hw < stepW ? hw : stepW;

            if (data.pos == 'left') {
              var cc = -(144 - actRailW); //todo 144 should be fixed like this
              logo.style.left = this.getPX(cc);
            }

            if (data.pos == 'right') {

              logo.style.left = this.getPX(w - data.width - actRailW);
            }
          }
        }

      }
    };

    return function () {
      return new wallpaper();
    };
  });