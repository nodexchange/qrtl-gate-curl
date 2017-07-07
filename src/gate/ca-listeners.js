define(function () {
  var Listeners = function (gate) {
      this.gate = gate;
      this.advert = gate.advert;
      this.assignListeners();
  };

  Listeners.prototype = {
    assignListeners: function () {
      this.advert.eventBus.addEventListener('wallpaper-click', this.wallpaperClickHandler.bind(this));
      this.advert.eventBus.addEventListener('close_advert', this.closeHandler.bind(this));
    },

    assignClickHandlers: function() {
      this.gate.backgroundPage.addEventListener('click', this.gateBackgroundClickHandler.bind(this));
      this.gate.backDiv.addEventListener('click', this.gateBackgroundClickHandler.bind(this));
    },

    wallpaperClickHandler: function () {
      this.gate.loadFiles();
    },

    gateBackgroundClickHandler: function() {
      var ct = this.advert.contentProperties.wallpaper.clickthrough;
      if (ct != '') {
        this.advert.dynamicClick('Background', ct);
      }
    },

    closeHandler: function () {
      /*
       * This will get invoked when the close event has been dispatched by any one
       * of your ad units.
       */
      // clearTimeout(this.flipTimer1);
      // clearTimeout(this.flipTimer2);
    },

    clickReferences: function() {
      // ADTECH.dynamicClick('Background');
    }
  };

  return function (gate) {
    return new Listeners(gate);
  };
});