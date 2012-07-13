# Retinizr
A jQuery-less script that replaces images with ones optmized for high density devices (as those with Apple Retina).

## Usage
Include `Retinizr.min.js` in the `head` or in the end of the `body` (prefferable) section of your HTML document.
Add CSS class `hires_img` (or another one, this is configurable) to all `img` elements you want to provide a high resolution version.
Afterwards, cakk Retinizr with `Retinizr()`.

For example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr();
</script>
```

## Settings
Settings can be set by sending an object as the first parameter in the `Retinizr()` call.

The options are:
* `css_class`: The CSS class your upgradeable images have.
* `source_suffix`: The text before high resolution images' extension. E.g.: if set to `"@2x"` then `logo.png` becomes `logo@2x.png`. Note: regular expression characters must be escaped.
* `min_pixel_ratio`: The density ratio of the screen you are targeting to. Apple Retina devices have 2.0 ratio and some Android devices 1.5. 1.0 is the standard we're all used to. You might want to check this <a href="http://en.wikipedia.org/wiki/List_of_displays_by_pixel_density" target="_blank">list of screen densities</a>, pay attention to the "CSS pixel ratio" columns.

Here's an example:
```html
<script src="Retinizr.min.js"></script>
<script>
  Retinizr({
    css_class: 'superultramega_hires_img',
    source_suffix: '_hires',
    min_pixel_ratio: 2.0
  });
</script>
```

And here are the defaults that will be used in case you don't override them:
* `css_class`: `"hires_img"`
* `source_suffix`: `"@2x"`
* `min_pixel_ratio`: `1.5`

As generating images appropriated for each density is time-consuming we suggest you to use 1.5 in `min_pixel_ratio` while providing an image for 2.0 devices only.