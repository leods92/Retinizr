/*!
 * Retinizr - version 0.1.0
 * Copyright (c) 2012, Leonardo D. Schlossmacher (leods92.com).
 * License: MIT
 */

/*
  Copyright (c) 2012, Leonardo D. Schlossmacher.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function(window){

  // If the browser doesn't set the pixel density it's not being run in a high density display device and so we won't proceed.
  // Since high density screens are only available in modern devices we'll rely on forEach method of the Array object.
  if (!window.devicePixelRatio || !Array.prototype.forEach) {
    return;
  }

  var document = window.document
    , defaults = {
        css_class: 'hires_img' // The CSS class your upgradeable images have.
      , source_suffix: '@2x' // The text before high resolution images' extension. E.g.: logo.png => logo@2x.png. Note: regular expression characters must be escaped.
      , min_pixel_ratio: 1.5 // Apple Retina devices have 2.0 ratio but opted the default to be 1.5 as that's the ratio of some Android devices displays.
    }
  ;

  function getImagesList(css_class) {
    return document.getElementsByClassName(css_class);
  }

  function loadImage(src, callback) {
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", src, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Only images that really exists will replace current images.
        callback();
      }
    };
    xhr.send();
  }

  function upgradeImage(img, suffix) {
    var new_src = img.src.replace(/^(.*)(\.[a-z]{3,4})$/, '$1' + suffix + '$2');

    loadImage(new_src, function() {
      // Retinizr will first load the image then replace for a better user experience.
      img.src = new_src;
      console.log('callback called');
    });
  }

  function upgradeImages(settings) {
    var images;

    settings = typeof settings === 'object' ? settings : {};

    for (var prop in defaults) {
      if (typeof settings[prop] === 'undefined') {
        settings[prop] = defaults[prop];
      }
    }

    images = getImagesList(settings.css_class);

    Array.prototype.forEach.call(images, function(img) {
      var is_hires;

      if (!(img instanceof HTMLImageElement)) {
        throw "Element has class '" + settings.css_class + "' but is not an img element.";
      }

      is_hires = (new RegExp(settings.source_suffix + '\\.[a-z]{3,4}')).test(img.src);

      // It'll only replace the image if it's not already the high resolution version.
      // Only on devices with at least the settings.min_pixel_ratio high resolution images will be displayed.
      if (!is_hires && window.devicePixelRatio >= settings.min_pixel_ratio) {
        upgradeImage(img, settings.source_suffix);
      }
    });
  }

  // Exposes Retinizr
  window.Retinizr = upgradeImages;

})(window);