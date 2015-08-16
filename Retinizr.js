/*!preserve
 * Retinizr - version 1.0.1
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
      // Apple Retina devices have 2.0 ratio (except iPhone 6+)
      // but I opted the default to be 1.5 as that's the ratio
      // of some Android devices displays.
      minPixelRatio: 1.5

    , images: {
        // The CSS class your upgradeable images have.
        cssClass: 'js-retinizr-image'

        // The text before high resolution images' extension.
        // E.g.: logo.png => logo@2x.png.
        // Note: regular expression characters must be escaped.
      , sourceSuffix: '@2x'

        // ~> data-retinizr-hires-url
      , dataAttribute: 'retinizr-hires-url'
    }

    , googleStaticMaps: {
        cssClass: 'js-retinizr-map'

      // fluidCssClass is used to automatically change width
      // based on image's container.
      // This affects also images that won't be scaled to
      // the higher resolution.
      //
      // Watch out: this feature is inteded for mobile devices.
      // That said, if you use the free static maps API,
      // Google will limit 'browser width' to 640px 
      , fluidCssClass: 'js-retinizr-fluid'

      // Google also provides scale=4 for Business API users
      , scale: 2
    }

    , gravatars: {
        cssClass: 'js-retinizr-gravatar'

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
      return typeof custom !== 'undefined' ? custom : _default;
    };

    for (var prop in defaults) {
      if (typeof defaults[prop] === 'object') {
        // In case a boolean was set, we'll set all options as default.
        if (typeof newOptions[prop] !== 'object') {
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
    R.scaleItems('scaleImage', images);
  };

  R.getImagesList = function() {
    return R.getList(options.images.cssClass);
  };

  R.scaledImageName = function(img) {
    var dataAttribute = 'data-' + options.images.dataAttribute
      , manualUrl = img.getAttribute(dataAttribute)
    ;

    if (manualUrl) {
      return manualUrl;
    }
    else {
      // about '.*?' - the '?' prevents it from not matching the extension
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

    xhr.open('GET', src, true);
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
  R.googleStaticMapsUrlSizeRegexp = /size=([0-9]+)x([0-9]+)/;

  R.scaleGoogleStaticMaps = function() {
    var maps = R.getGoogleStaticMapsList();
    R.scaleItems('scaleGoogleStaticMap', maps);
  };

  R.getGoogleStaticMapsList = function() {
    return R.getList(options.googleStaticMaps.cssClass);
  };

  // If measurements have no unit, px is assumed.
  R.updateGoogleStaticMapDimensions = function(map, width, height) {
    // It's important to set width/height via .style,
    // otherwise because width is set height is ignored
    // (to keep proportion, apparently.)
    // Height must be set beforehand, to avoid page reflow.
    map.style.height = typeof height == 'string' ? height : height + 'px';
    map.style.width = typeof width == 'string' ? width : width + 'px';
  };

  R.updateFluidGoogleStaticMapResizeTimeout = null;

  // This also handles mobile devices orientation changes.
  R.updateFluidGoogleStaticMapOnResize = function(map) {
    clearTimeout(R.updateFluidGoogleStaticMapResizeTimeout);

    R.updateFluidGoogleStaticMapResizeTimeout = setTimeout(function() {
      R.updateFluidGoogleStaticMap(map);
    }, 500);
  };

  R.updateFluidGoogleStaticMapSrc = function(map, src, beforeRequestCb) {
    // Hiding image not to display distorted image while the new one loads.
    map.style.visibility = 'hidden';

    if (beforeRequestCb) { beforeRequestCb(); }

    map.src = src;

    map.addEventListener('retinizr:img:load', function() {
      map.style.visibility = 'visible';
    });

    map.addEventListener('load', function() {
      R.triggerEvent(map, 'retinizr:img:load');
    });

    // Triggering load manually when image is already cached.
    if (map.complete) {
      R.triggerEvent(map, 'retinizr:img:load');
    }
  };

  R.updateFluidGoogleStaticMap = function(map, src) {
    // Using clientWidth not offsetWidth not to get borders.
    var newWidth     = map.parentNode.clientWidth
      , cachedHeight = map.offsetHeight
      , newSize      = 'size=' + newWidth + 'x$2'
    ;

    // Useful to be called when src is being changed by another function.
    // Thus preventing a second HTTP request from being performed.
    src = src || map.src;
    src = src.replace(R.googleStaticMapsUrlSizeRegexp, newSize);

    if (map.src != src) {
      R.updateFluidGoogleStaticMapSrc(map, src, function() {
        R.updateGoogleStaticMapDimensions(map, newWidth, cachedHeight);
      });
    }

    // 'If multiple identical EventListeners are registered on the same
    // EventTarget with the same parameters, the duplicate instances
    // are discarded.'
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Multiple_identical_event_listeners
    window.addEventListener('resize', function() {
      R.updateFluidGoogleStaticMapOnResize(map);
    });
  };

  R.scaleGoogleStaticMap = function(map) {
    var dimensions  = map.src.match(R.googleStaticMapsUrlSizeRegexp)
      , scaleRegExp = /scale=1/
      , newScale    = options.googleStaticMaps.scale
      , newSrc      = map.src
    ;

    // Saving 'displayed resolution' so that new scale keeps size
    // but increses pixel density.
    R.updateGoogleStaticMapDimensions(map, dimensions[1], dimensions[2]);

    if (map.src.match(scaleRegExp)) {
      newSrc = newSrc.replace(scaleRegExp, 'scale=' + newScale);
    }
    else {
      newSrc += '&scale=' + newScale;
    }

    if (~map.className.indexOf(options.googleStaticMaps.fluidCssClass)) {
      R.updateFluidGoogleStaticMap(map, newSrc);
    }
    else {
      map.src = newSrc;
    }
  };


  //
  // Gravatars
  //
  R.scaleGravatars = function() {
    var gravatars = R.getGravatarsList();
    R.scaleItems('scaleGravatar', gravatars);
  };

  R.getGravatarsList = function() {
    return R.getList(options.gravatars.cssClass);
  };

  R.scaleGravatar = function(gravatar) {
    var regex = /(size|s)=([0-9]+)/
      , size  = gravatar.src.match(regex)[2]
    ;

    gravatar.width = size;
    gravatar.src = gravatar.src.replace(regex, '$1=' + parseInt(size, 10) * options.gravatars.scale);
  };


  //
  // Helpers
  //
  R.triggerEvent = function(element, eventName) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
  };

  R.scaleItems = function(scalingFunction, items) {
    if (!items) return; // returns if null or undefined

    // Ensures images are fully loaded before scaling them.
    // This is necessary because we need image's dimensions.
    function scale() {
      // It'll only replace the image if it wasn't scaled yet.
      // Otherwise we'd be in a loop, given that new image
      // may also trigger the load event.
      if (R.elWasScaled(this)) { return; }

      if (R.deviceRequiresRetinazation()) {
        R[scalingFunction](this);
      }
      else if (scalingFunction == 'scaleGoogleStaticMap') {
        // To save an extra HTTP request, scaleGoogleStaticMaps
        // already makes width fluid when retinizing (above).
        R.updateFluidGoogleStaticMap(this);
      }

      R.setElWasScaled(this);
    }

    Array.prototype.forEach.call(items, function(item) {
      R.checkHTMLElement(item);

      item.addEventListener('retinizr:img:load', scale);

      item.addEventListener('load', function() {
        R.triggerEvent(item, 'retinizr:img:load');
      });

      // If image is cached, no load event is triggered.
      // Therefore its callbacks should be triggered manually.
      if (item.complete) {
        R.triggerEvent(item, 'retinizr:img:load');
      }
    });
  };

  R.checkHTMLElement = function(el) {
    if (!(el instanceof HTMLImageElement)) {
      throw 'Element is not an img element.';
    }
  };

  R.elWasScaled = function(el) {
    return !!el.getAttribute('data-retinizr-scaled');
  };

  R.setElWasScaled = function(el) {
    el.setAttribute('data-retinizr-scaled', true);
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
