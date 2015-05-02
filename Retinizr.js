/*!preserve
 * Retinizr - version 1.0.0
 * Copyright (c) 2013-2015 Leonardo D. Schlossmacher (leods92.com).
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
  var options = {};

  var defaults = {
      // Apple Retina devices have 2.0 ratio but I opted the default to be 1.5 as that's the ratio of some Android devices displays.
      minPixelRatio: 1.5

    , images: {
        // The CSS class your upgradeable images have.
        cssClass: "js-retinizr-image"

        // The text before high resolution images' extension.
        // E.g.: logo.png => logo@2x.png.
        // Note: regular expression characters must be escaped.
      , sourceSuffix: "@2x"

        // ~> data-retinizr-hires-url
      , dataAttribute: "retinizr-hires-url"
    }

    , googleStaticMaps: {
        cssClass: "js-retinizr-map"

      // Google also provides scale=4 for Business API users
      , scale: 2
    }

    , gravatars: {
        cssClass: "js-retinizr-gravatar"

      // Be careful not to exceed Gravatar's limit that is 2048px.
      // Note that even though the image provided will be in the requested
      // size, user's source image might not be that big and
      // so the quality may be compromised.
      , scale: 2
    }
  };

  R.setOptions = function(newOptions) {
    newOptions = newOptions || {};

    var pickOption = function(custom, _default) {
      return typeof custom !== "undefined" ? custom : _default;
    };

    for (var prop in defaults) {
      if (typeof defaults[prop] === "object") {
        // In case a boolean was set, we'll set all options as default.
        if (typeof newOptions[prop] !== "object") {
          options[prop] = defaults[prop];
          continue;
        }

        options[prop] = {};

        for (var childProp in defaults[prop]) {
          options[prop][childProp] =
            pickOption(newOptions[prop][childProp], defaults[prop][childProp]);
        }
        continue;
      }

      options[prop] = pickOption(newOptions[prop], defaults[prop]);
    }
  };


  //
  // DOM searching
  //
  R.getList = function(cssClass) {
    return document.getElementsByClassName(cssClass);
  };


  //
  // Images
  //
  R.scaleImages = function() {
    var images = R.getImagesList();
    R.scaleItems("scaleImage", images);
  };

  R.getImagesList = function() {
    return R.getList(options.images.cssClass);
  };

  R.scaledImageName = function(img) {
    var dataAttribute = "data-" + options.images.dataAttribute
      , manualUrl = img.getAttribute(dataAttribute)
    ;

    if (manualUrl) {
      return manualUrl;
    }
    else {
      // about ".*?" - the "?" prevents it from not matching the extension
      return img.src.replace(/^(.*?)(\.[a-z]{3,4})?$/, '$1' + options.images.sourceSuffix + '$2');
    }
  };

  R.scaleImage = function(img) {
    var new_src = R.scaledImageName(img)
      , dimensions = [img.width, img.height]
    ;

    R.loadImage(new_src, function() {
      img.width = dimensions[0];
      img.height = dimensions[1];

      // Retinizr will first load the image then replace
      // for a better user experience.
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
    return R.getList(options.googleStaticMaps.cssClass);
  };

  R.scaleGoogleStaticMap = function(map) {
    var dimensions = map.src.match(/size=([0-9]+)x([0-9]+)/),
      regExp = /scale=1/
    ;

    map.width = dimensions[1];
    map.height = dimensions[2];

    if (map.src.match(regExp)) {
      map.src = map.src.replace(regExp, "scale=" + options.google_static_maps.scale);
    }
    else {
      map.src += "&scale=2";
    }
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
      if (!R.deviceRequiresRetinazation()) return;

      // Assures images are fully loaded before scaling them.
      // This is necessary because we need image's dimensions.
      $(item).load(function() {
        // It'll only replace the image if it's not already
        // the high resolution version.
        // Otherwise we'd be in a loop.
        if (R.elIsRetinized(item)) { return; }

        R[scalingFunction](item);
        R.setElAsRetinized(item);
      });
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
    return window.devicePixelRatio >= options.minPixelRatio;
  };


  //
  // Exposes Retinizr
  //
  window.Retinizr = function(options) {
    R.setOptions(options);

    if (options.scaleImages !== false) R.scaleImages();
    if (options.googleStaticMaps) R.scaleGoogleStaticMaps();
    if (options.gravatars) R.scaleGravatars();
  };

})(window, window.document);
