define(function () {
  var Transitions = function (gate) {this.gate = gate;};

  Transitions.prototype = {
    initTransition: function () {
      var targetWindow = this.gate.targetWindow;
      this.card = targetWindow.document.getElementById('webpageContainer');
      var self = this;

      this.flipTimer1 = setTimeout(function () {
        self.flip();
      }, this.gate.autoOpenDelay * 1000); // autoflip
      this.flipTimer2 = setTimeout(function () {
        self.flip();
      }, this.gate.autoCloseDelay * 1000);
    },
    flip: function () {
      var self = this;
      var targetWindow = this.gate.targetWindow;
      var cards = targetWindow.document.getElementsByClassName('card-page');
      var frontPage = self.card.children[0];
      var backPage = self.card.children[1];
      var backgroundPage = self.card.children[2];
      if (frontPage.className.indexOf('flipped') === -1) {
        setTimeout(function () {
          frontPage.className += ' flipPosition flipped';
          backgroundPage.className += ' opacityFadeIn';
          frontPage.style.pointerEvents = 'none';
        }, 500);
          setTimeout(function() {
            backPage.style.display = 'block';
            backPage.className += ' opacityFadeIn';
          }, 1200);
        console.log('[GATE] OPEN!!!!!!!!!');
        self.gate.updateMainDimensions(true);
        cards[0].style.overflow = 'hidden';
        cards[1].style.overflow = 'hidden';
        self.gate.shiftWallpaperPostFlip(false);
      } else {
        console.log('[GATE] CLOSE!!!!!!!!!');
        setTimeout(function () {
          backPage.style.display = 'none';
        }, 500);
        frontPage.className = 'card-page';
        backPage.className = 'card-page';
        backgroundPage.className = 'card-page';
        frontPage.style.pointerEvents = 'auto';
        self.gate.updateMainDimensions(false);

        setTimeout(function () {
          self.gate.advert.eventBus.dispatchEvent('pause_video_player');
          cards[0].style.overflow = 'visible';
          cards[1].style.overflow = 'visible';
          self.gate.shiftWallpaperPostFlip(true);
          clearTimeout(self.flipTimer1);
          clearTimeout(self.flipTimer2);
        }, 1000);
      }
    },

    playCloseAnimation: function() {
      clearTimeout(this.flipTimer1);
      clearTimeout(this.flipTimer2);
      this.flip();
    }
  };

  return function (gate) {
    return new Transitions(gate);
  };
});