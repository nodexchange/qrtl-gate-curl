define(function () {
  var Utils = function (gate) {
    this.gate = gate;
    this.advert = gate.advert;
    this.targetWindow = gate.targetWindow;
  };

  Utils.prototype = {

    loadFlipInterstitialCssFile: function (callback, scope) {
      if (!this.advert.getAssetContainer('main').rendered) {
        this.advert.getAssetContainer('main').render();
        this.gate.builders.buildBackground();
      }
      var styleCssUrl = this.getFileUrl('FlipInterstitialFormat.css');
      var self = this;
      if (!self.gate.pageDomUpdated) {
        self.loadJsCssFile(styleCssUrl, 'css', self.gate.manipulateDom, self.gate);
      } else {
        callback(scope);
      }
    },
    

    loadJsCssFile: function (filename, filetype, callback, parameters) {
      var ready;
      var self = this;
      if (filetype == 'js') { //if filename is a external JavaScript file
        var fileref = this.targetWindow.document.createElement('script');
        fileref.setAttribute('type', 'text/javascript');
        fileref.setAttribute('src', filename);
        fileref.onload = fileref.onreadystatechange = function () {
          if (!ready && (!this.readyState || this.readyState == 'complete')) {
            ready = true;
            if (typeof callback === 'function') {
              callback(parameters);
            }
          }
        };
      } else if (filetype == 'css') { //if filename is an external CSS file
        var fileref = this.targetWindow.document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', filename);
        var numOfStylesheets = this.targetWindow.document.styleSheets.length;
        var completed = false;
        var interval_id = setInterval(function () { // start checking whether the style sheet has successfully loaded - android workaround... :/
          if (numOfStylesheets < self.targetWindow.document.styleSheets.length) {
            if (!completed) {
              completed = true;
              if (typeof callback === 'function') {
                //  setTimeout(function(){callback(parameters)},1000); // safety first
                callback(parameters); // safety first
              }
              clearInterval(interval_id);
            }
          }
        }, 10);
      }
      if (typeof fileref != 'undefined') {
        if (filetype == 'css') {
          this.targetWindow.document.getElementsByTagName("head")[0].appendChild(fileref);
        } else {
          this.targetWindow.document.body.appendChild(fileref);
        }
      }
    },

    getFileUrl: function(fileName) {
      // return 'http://localhost:3000/src/' + fileName;
      return this.advert.getFileUrl(fileName);
    }
  };

  return function (gate) {
    return new Utils(gate);
  };
});