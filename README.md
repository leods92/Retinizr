**Attention:** the API has changed in version `0.1.1`.
Now, you are required to send image-scaling related options wrapped in an object called `images`, e.g. `Retinizr({ images: { ... } })`.
The default images' css class is now `hires-image`. You can keep your mark-up and just call `Retinizr({ images: { css_class: "hires_img"} })` to mimic `0.1.0` version behavior.

# Retinizr
A jQuery-less script that replaces images with ones optmized for high density devices (as those with Apple Retina).

## Usage
Include `Retinizr.min.js` in the `head` or at the end of the `body` (prefferable) section of your HTML document.
When DOM is ready, call Retinizr with `Retinizr()`. You may do that by adding the function at the end of the `body`.

### Images
Add CSS class `hires-image` (or set a custom class in Retinizr's options) to all `img` elements you want to provide a high resolution version. Don't forget to set images' physical width and height.

For example:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="Retinizr.min.js"></script>
  </head>
  <body>
    <img src="http://example.com/image.jpg" class="hires-image" width="100" height="100" />
    <script>
      Retinizr();
    </script>
  </body>
```

### Google Static Maps
Google provides an execellent API to retrieve images of maps. As the images are static you get what you get and scalling them will cause distortion. Hopefully, Google accepts a parameter call `scale` which generate another image with the *exactly* same viewport size and position but denser.
Retinizr deals with that automatically for you as long as you're using the version 2 of Google's API.

This is disabled by default though.
In order to enable it, when calling `Retinizr()` set the option `google_static_maps` to `true` or an object (`{...}`) containing the options you want.
For example: `Retinizr({ google_static_maps: true })`

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
* `min_pixel_ratio`: The density ratio of the screen you are targeting to. Apple Retina devices have 2.0 ratio and some Android devices 1.5. 1.0 is the standard we're all used to. You might want to check this <a href="http://en.wikipedia.org/wiki/List_of_displays_by_pixel_density" target="_blank">list of screen densities</a>, pay attention to the "CSS pixel ratio" columns.
* `images`: Enables or disables images scaling.
* `google_static_maps`: Enables or disables Google Static Maps scaling.
* `gravatars`: Enables or disbles Gravatars scaling.

Defaults:
* `min_pixel_ratio`: `1.5`
* `images`: `true`
* `google_static_maps`: `false`
* `gravatars`: `false`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    min_pixel_ratio: 2.0,
    google_static_maps: true
  });
</script>
```

As generating images appropriated for each density would be time-consuming we suggest you to use 1.5 in `min_pixel_ratio` while providing an image twice as dense as the original one what would cover devices from 1.5 to 2.0 screen densities.

### Images
To use these you should set an object with the options you want to the `images` key of the main options object.

* `css_class`: The CSS class your scalable images have.
* `source_suffix`: The text before high resolution images' extension. E.g.: if set to `"@2x"` then `logo.png` becomes `logo@2x.png`. Note: regular expression characters must be escaped.

Defaults:
* `css_class`: `highres-image`
* `source_suffix`: `"@2x"`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    images: {
      css_class: "my-much-cooler-custom-css-class",
      source_suffix: "_highres"
    }
  });
</script>
```

### Google Static Maps
To use these you should set an object with the options you want to the `google_static_maps` key of the main options object.

* `css_class`: The CSS class your scalable map images have.
* `scale`: The number by which the size of the original map will be multiplied. Google accepts 1, 2, 4 (the latter available for business customers only).

Defaults:
* `css_class`: `highres-map`
* `scale`: `2`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    google_static_maps: {
      css_class: "my-much-cooler-custom-css-class",
      scale: 4 // "4" is excessive, you probably don't need such a dense image and is only availble in the paid version of the API.
    }
  });
</script>
```

### Gravatars
To use these you should set an object with the options you want to the `gravatars` key of the main options object.

* `css_class`: The CSS class your scalable gravatar images have.
* `scale`: The number by which the size of the original gravatar will be multiplied.

Defaults:
* `css_class`: `highres-gravatar`
* `scale`: `2`

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    gravatar: {
      css_class: "my-much-cooler-custom-css-class",
      scale: 2
    }
  });
</script>
```

## License
Copyright (c) 2013, Leonardo D. Schlossmacher.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.