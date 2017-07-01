define(['ca-wallpaper-settings'], function(caSettings) {
  var wallpaper = function() {
    this.settings = new caSettings();
  };
  
  wallpaper.prototype = {
    init: function(targetWindow, settings) {
      console.log('INIT CALLED ::: ' + targetWindow + '>> ' + settings);
      console.log(this.settings);
    }
  };
  
  return function() { return new wallpaper(); };
});
