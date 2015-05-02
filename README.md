# Retinizr
A jQuery-less script that replaces images with ones optmized for high density devices (as those with Apple Retina).

## Usage
Include `Retinizr.min.js` in the `head` or at the end of the `body` (prefferable) section of your HTML document.
When DOM is ready, call Retinizr with `Retinizr()`. You may do that by adding the function at the end of the `body`.

### Images
Add CSS class `js-retinizr-image` (or set a custom class in Retinizr's options) to all `img` elements you want to provide a high resolution version. Don't forget to set images' physical width and height.
There are more options available, read further.

For example:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="Retinizr.min.js"></script>
  </head>
  <body>
    <img src="http://example.com/image.jpg" class="js-retinizr-image" width="100" height="100" />
    <script>
      Retinizr();
    </script>
  </body>
```

#### Data attribute
If your assets are named after their version – usually with a md5 hash as Rails' [AssetPipeline](http://guides.rubyonrails.org/asset_pipeline.html) does, e.g. `my_image-d131dd02c5e6eec4.png` – above implementation will not work. And the reason is that Retinizr cannot know what's the higher resolution image name because lower and higher resolution images have different hashes.
For this scenario you can manually provide the name of the higher resolution by adding `data-retinizr-hires-url` attribute to the `img` tag.
This attribute name is customizable.

For example:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="Retinizr.min.js"></script>
  </head>
  <body>
    <img src="http://example.com/image-716495495f615d1eb9caad17a0cef745.jpg" class="js-retinizr-image" data-retinizr-hires-url="http://example.com/image@2x-146395495f615d1eb9caad16a0dxf111.jpg" width="100" height="100" />
    <script>
      Retinizr();
    </script>
  </body>
```

*Note: you still need to provide `js-retinizr-image` class.*

### Google Static Maps
Google provides an execellent API to retrieve images of maps. As the images are static you get what you get and scalling them will cause distortion. Hopefully, Google accepts a parameter call `scale` which generate another image with the *exactly* same viewport size and position but denser.
Retinizr deals with that automatically for you as long as you're using the version 2 of Google's API.

This is disabled by default though.
In order to enable it, when calling `Retinizr()` set the option `googleStaticMaps` to `true` or an object (`{...}`) containing the options you want.
For example: `Retinizr({ googleStaticMaps: true })`

More information about this functionality is availble in the *Options* section bellow.

### Gravatar
If you want to *automagically* change gravatars diplayed on your page to a denser version, Retinizr can do that for you.

This is disabled by default though.
In order to enable it, when calling `Retinizr()` set the option `gravatars` to `true` or an object (`{...}`) containing the options you want.
For example: `Retinizr({ gravatars: true })`

More information about this functionality is availble in the *Options* section bellow.

## Options
Options can be set by sending an object as the first parameter in the `Retinizr()` call.

The global options are:
* `minPixelRatio`: The density ratio of the screen you are targeting to. Apple Retina devices have 2.0 ratio and some Android devices 1.5. 1.0 is the standard we're all used to. You might want to check this <a href="http://en.wikipedia.org/wiki/List_of_displays_by_pixel_density" target="_blank">list of screen densities</a>, pay attention to the "CSS pixel ratio" columns.
* `images`: Enables or disables images scaling.
* `googleStaticMaps`: Enables or disables Google Static Maps scaling.
* `gravatars`: Enables or disbles Gravatars scaling.

Defaults:
* `minPixelRatio`: `1.5`
* `images`: `true`
* `googleStaticMaps`: `false`
* `gravatars`: `false`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    minPixelRatio: 2.0,
    googleStaticMaps: true
  });
</script>
```

As generating images appropriated for each density would be time-consuming we suggest you to use 1.5 in `minPixelRatio` while providing an image twice as dense as the original one what would cover devices from 1.5 to 2.0 screen densities.

### Images
To use these you should set an object with the options you want to the `images` key of the main options object.

* `cssClass`: The CSS class your scalable images have.
* `sourceSuffix`: The text before high resolution images' extension. E.g.: if set to `"@2x"` then `logo.png` becomes `logo@2x.png`. Note: regular expression characters must be escaped.

Defaults:
* `cssClass`: `js-retinizr-image`
* `sourceSuffix`: `"@2x"`
* `dataAttribute`: `"retinizr-hires-url"`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    images: {
      cssClass: "my-much-cooler-custom-css-class",
      sourceSuffix: "_highres",
      dataAttribute: "retinizr-much-cooler-name-url"
    }
  });
</script>
```

### Google Static Maps
To use these you should set an object with the options you want to the `googleStaticMaps` key of the main options object.

* `cssClass`: The CSS class your scalable map images have.
* `fluidCssClass`: The class of maps that should have fluidity enabled. Such maps will expand to 100% of parent container's width on load, screen resize and screen orientation change. Images may be distorted if parent container's width is longer than *640 px* and you're using Google's free API.
* `scale`: The number by which the size of the original map will be multiplied. Google accepts 1, 2, 4 (the latter available for business customers only).

Defaults:
* `cssClass`: `js-retinizr-map`
* `fluidCssClass`: `js-retinizr-fluid`
* `scale`: `2`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    googleStaticMaps: {
      cssClass: "my-much-cooler-custom-css-class",
      scale: 4 // "4" is excessive, you probably don't need such a dense image and is only availble in the paid version of the API.
    }
  });
</script>
```

### Gravatars
To use these you should set an object with the options you want to the `gravatars` key of the main options object.

* `cssClass`: The CSS class your scalable gravatar images have.
* `scale`: The number by which the size of the original gravatar will be multiplied.

Defaults:
* `cssClass`: `js-retinizr-gravatar`
* `scale`: `2`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    gravatar: {
      cssClass: "my-much-cooler-custom-css-class",
      scale: 2
    }
  });
</script>
```

## License
Copyright (c) 2013-2015 Leonardo D. Schlossmacher.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.