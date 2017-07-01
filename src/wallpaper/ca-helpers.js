define(function () {
  var WallpaperHelpers = function () {};

  WallpaperHelpers.prototype = {
    adjustIndependentSite: function (targetWindow) {
      try {
        targetWindow.document.getElementsByClassName('billboard')[0].style.display = 'none';
        targetWindow.document.getElementsByClassName('indo_survey')[0].style.display = 'none';
        targetWindow.document.getElementsByClassName('indo_survey')[1].style.display = 'none';
        targetWindow.document.getElementsByClassName('indo_survey')[2].style.display = 'none';
        targetWindow.document.getElementsByClassName('sticky')[0].style.display = 'none';
      } catch (e) {
        console.log('[one] adjustIndependentSite :: error ' + e.message);
      }
    },

    addStyleString: function (str, targetWindow, msnPreviewMode, target) {
      var target = msnPreviewMode ? targetWindow : targetWindow.parent;
      var s = document.createElement('style');
      s.innerHTML = str;
      target.document.head.appendChild(s);
    },

    createDiv: function (targetDoc, id, classId) {
      var d = targetDoc.createElement('div');

      if (id != null && id != '') {
        d.id = id;
      }

      if (classId != null) {
        d.className = classId;
        d.classList = classId;
      }

      return d;
    },

    preloadImage: function (url) {
      var image = new Image();
      image.src = url;
      //image.onload = this.onImagePreload();
    },

    onImagePreload: function () {
      console.log('onImagePreload');
    },

    getPX: function (v) {
      return v != 0 ? v + 'px' : 0;
    },

    logMessage: function (message) {
      console.log('[LOG] : ' + message);
    }
  };

  return function () {
    return new WallpaperHelpers();
  };
});