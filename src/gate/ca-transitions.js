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
      if (this.card.children[0].className.indexOf('flipped') ===  -1) {
        setTimeout(function () {
          self.card.children[0].className += ' flipPosition flipped';
          self.card.children[1].style.display = 'block';
          self.card.children[0].style.pointerEvents = 'none';
        }, 500);
        console.log('[GATE] OPEN!!!!!!!!!');
        self.gate.updateMainDimensions(true);
        cards[0].style.overflow = 'hidden';
        cards[1].style.overflow = 'hidden';
        self.gate.shiftWallpaperPostFlip(false);
      } else {
        console.log('[GATE] CLOSE!!!!!!!!!');
        setTimeout(function () {
          self.card.children[1].style.display = 'none';
        }, 500);
        self.card.children[0].className = 'card-page';
        self.card.children[0].style.pointerEvents = 'auto';
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
    }
  };

  return function (gate) {
    return new Transitions(gate);
  };
});