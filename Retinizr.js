/*!preserve
 * Retinizr - version 0.1.2
 * Copyright (c) 2013, Leonardo D. Schlossmacher (leods92.com).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function(window, document){

  // If the browser doesn't set the pixel density it's not being run in a high density display device and so we won't proceed.
  // Since high density screens are only available in modern devices we'll rely on forEach method of the Array object.
  if (!window.devicePixelRatio || !Array.prototype.forEach) {
    return;
  }

  var R = {};

  //
  // Options
  //
  var defaults = {
        min_pixel_ratio: 1.5 // Apple Retina devices have 2.0 ratio but I opted the default to be 1.5 as that's the ratio of some Android devices displays.
      , images: {
          css_class: "hires-image" // The CSS class your upgradeable images have.
        , source_suffix: "@2x" // The text before high resolution images' extension. E.g.: logo.png => logo@2x.png. Note: regular expression characters must be escaped.
      }
      , google_static_maps: {
          css_class: "hires-map"
        , scale: 2 // Google also provides scale=4 for Business API users
      }
      , gravatars: {
          css_class: "hires-gravatar"
        , scale: 2 // Be careful not to exceed Gravatar's limit that is 2048px. Note that even though the image provided will be in the requested size, user's source image might not be that big and so the quality may be compromised.
      }
    }
    , options = {}
  ;

  R.setOptions = function(_options) {
    _options = _options || {};

    var pickOption = function(custom, _default) {
      return typeof custom !== "undefined" ? custom : _default;
    };

    for (var prop in defaults) {
      if (typeof defaults[prop] === "object") {
        // In case a boolean was set, we'll set all options as default.
        if (typeof _options[prop] !== "object") {
          options[prop] = defaults[prop];
          continue;
        }

        options[prop] = {};

        for (var childProp in defaults[prop]) {
          options[prop][childProp] = pickOption(_options[prop][childProp], defaults[prop][childProp]);
        }
        continue;
      }

      options[prop] = pickOption(_options[prop], defaults[prop]);
    }
  };


  //
  // DOM searching
  //
  R.getList = function(css_class) {
    return document.getElementsByClassName(css_class);
  };


  //
  // Images
  //
  R.scaleImages = function() {
    var images = R.getImagesList();
    R.scaleItems("scaleImage", images);
  };

  R.getImagesList = function() {
    return R.getList(options.images.css_class);
  };

  R.scaleImage = function(img) {
    // about ".*?" - the "?" prevents it from not matching the extension
    var new_src = img.src.replace(/^(.*?)(\.[a-z]{3,4})?$/, '$1' + options.images.source_suffix + '$2');

    R.loadImage(new_src, function() {
      // Retinizr will first load the image then replace for a better user experience.
      img.src = new_src;
    });
  };

  R.loadImage = function(src, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", src, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Only images that really exists will replace current images.
        callback();
      }
    };
    xhr.send();
  };


  //
  // Google Static Maps
  //
  R.scaleGoogleStaticMaps = function() {
    var maps = R.getGoogleStaticMapsList();
    R.scaleItems("scaleGoogleStaticMap", maps);
  };

  R.getGoogleStaticMapsList = function() {
    return R.getList(options.google_static_maps.css_class);
  };

  R.scaleGoogleStaticMap = function(map) {
    var dimensions = map.src.match(/size=([0-9]+)x([0-9]+)/);

    map.width = dimensions[1];
    map.height = dimensions[2];
    map.src = map.src.replace("scale=1", "scale=" + options.google_static_maps.scale);
  };


  //
  // Gravatars
  //
  R.scaleGravatars = function() {
    var gravatars = R.getGravatarsList();
    R.scaleItems("scaleGravatar", gravatars);
  };

  R.getGravatarsList = function() {
    return R.getList(options.gravatars.css_class);
  };

  R.scaleGravatar = function(gravatar) {
    var regex = /(size|s)=([0-9]+)/
      , size  = gravatar.src.match(regex)[2]
    ;

    gravatar.width = size;
    gravatar.src = gravatar.src.replace(regex, "$1=" + parseInt(size, 10) * options.gravatars.scale);
  };


  //
  // Helpers
  //
  R.scaleItems = function(scalingFunction, items) {
    if (!items) return; // returns if null or undefined

    Array.prototype.forEach.call(items, function(item) {
      R.checkHTMLElement(item);
      // It'll only replace the image if it's not already the high resolution version.
      if (!R.deviceRequiresRetinazation() || R.elIsRetinized(item)) return;

      R[scalingFunction](item);
      R.setElAsRetinized(item);
    });
  };

  R.checkHTMLElement = function(el) {
    if (!(el instanceof HTMLImageElement)) {
      throw "Element has proper class was supposed to be retinized but is not an img element.";
    }
  };

  R.elIsRetinized = function(el) {
    return !!el.getAttribute('data-retinized');
  };

  R.setElAsRetinized = function(el) {
    el.setAttribute('data-retinized', true);
  };

  R.deviceRequiresRetinazation = function() {
    return window.devicePixelRatio >= options.min_pixel_ratio;
  };


  //
  // Exposes Retinizr
  //
  window.Retinizr = function(_options) {
    R.setOptions(_options);

    if (_options.scaleImages !== false) R.scaleImages();
    if (_options.google_static_maps) R.scaleGoogleStaticMaps();
    if (_options.gravatars) R.scaleGravatars();
  };

})(window, window.document);