# Version 1.0.0
* Standardized variables to be camelCased.
* Changed defaults to follow Github [CSS Style Guide](https://github.com/styleguide) and prepend js- to classes used in JavaScript (may break some implementations).
* Removed jQuery dependencies (shouldn't be here anyway).
* Fixed bug preventing images from being scaled when images were cached.
* Fixed: scale set in options not being used when url doesn't have scale in query-string. (google static map)
* Added option to make google static maps fluid by adding js-retinizr-fluid to map image class.

# Version 0.1.6
* Fixed bug: Retinizr now waits images to be fully loaded so that it can capture their original sizes.

# Version 0.1.5
* Enhacement: manually setting image dimensions is no longer necessary.

# Version 0.1.4
* Added data- attribute support. Useful with version-named assets.

# Version 0.1.3
* Added changelog to keep track of changes.
* Fixed bug with Google Maps.
