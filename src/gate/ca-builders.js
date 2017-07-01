define(function (gate) {
  var Builders = function (gate) {
    this.gate = gate;
    this.advert = gate.advert;
    this.targetWindow = gate.targetWindow;
  };

  Builders.prototype = {
    buildBackground: function () {
      var bgSettings = this.advert.getContent('Background');
      var self = this;
      console.log('[builders] bgSettings : ' + bgSettings);
      if (bgSettings) {
        if (bgSettings.enabled === true) {
          setTimeout(function () {
            var back = self.targetWindow.document.getElementById('back');
            back.style.backgroundColor = bgSettings.colour;
          }, 400);
        }
      }
    },

    buildFlyover: function () {
      var flyoverSettings = this.advert.getContent('Flyover Object');
      var self = this;
      if (flyoverSettings.enabled === true) {
        var imgEl = this.targetWindow.document.createElement('img');
        var imgDivEl = this.targetWindow.document.createElement('div');
        imgEl.src = flyoverSettings.image;
        imgDivEl.appendChild(imgEl);
        imgDivEl.style.display = 'block';
        imgDivEl.style.position = 'absolute';
        imgDivEl.style.top = flyoverSettings.y;
        imgDivEl.style.zIndex = 988889;
        imgDivEl.id = 'flyover';
        self.gate.container.appendChild(imgDivEl);
        setTimeout(function () {
          imgDivEl.style.left = '100vw';
        }, 100);

        setTimeout(function () {
          imgDivEl.style.display = 'none';
        }, 3000);
      }
    }
  };

  return function (gate) {
    return new Builders(gate);
  };
});