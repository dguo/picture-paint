# Picture Paint

[![Mozilla Add-on](https://img.shields.io/amo/v/picture-paint)](https://addons.mozilla.org/en-US/firefox/addon/picture-paint/)
[![CI status](https://github.com/dguo/picture-paint/workflows/CI/badge.svg)](https://github.com/dguo/picture-paint/actions?query=branch%3Amaster)

A [dynamic Firefox
theme](https://developer.mozilla.org/en-US/Add-ons/Themes/Theme_concepts#Dynamic_themes)
that uses the color palette of the current [National Geographic Photo of the Day](https://www.nationalgeographic.com/photography/photo-of-the-day/).
The theme automatically updates every day, and you can click the toolbar button
to see the picture and click through to the National Geographic page. You can
also view [past
pictures](https://www.nationalgeographic.com/photography/photo-of-the-day/archive/)
and themes by changing the date in the popup. If you'd like to turn off the
automatic updates and keep the theme on a particular date, change the setting
in the extension's preferences page.

Picture Paint is available in [Firefox
Add-ons](https://addons.mozilla.org/en-US/firefox/addon/picture-paint/).

The color palette is determined by [color
quantization](https://en.wikipedia.org/wiki/Color_quantization)
using the [image-q](https://github.com/ibezkrovnyi/image-quantization) package.

Picture Paint was originally created for the [Firefox Quantum Extensions
Challenge](https://extensionschallenge.com/). I wrote a [blog
post](https://www.dannyguo.com/blog/building-dynamic-firefox-themes/) detailing
my experience.

## Gallery

![lava](https://i.imgur.com/uSqHCKQ.png)
---
Popup coloring:
![popup coloring](https://i.imgur.com/IGzEXXK.png)
---
Scroll for picture details:
![picture details](https://i.imgur.com/22etI5f.png)
---
Preferences:
![preferences](https://i.imgur.com/oHdTDf7.png)
---
![lightning](https://i.imgur.com/FvIy7CI.png)
---
![orangutan](https://i.imgur.com/rbEluSY.png)
---
![desert](https://i.imgur.com/geh3MSi.png)
---
![giraffes and gazelles](https://i.imgur.com/qD7zAJR.png)
---
![marble caves](https://i.imgur.com/TnlmeBk.png)
---
![octopus](https://i.imgur.com/xMu1nZq.png)
---
![Golden Gate Bridge](https://i.imgur.com/g3bfzRd.png)

## Installation

Firefox 63 and above is required. Install the extension from the
[Add-ons](https://addons.mozilla.org/en-US/firefox/addon/picture-paint/) page.
It might take a few seconds to process the image and then apply the theme.

Note that it will need permission to "Access your data for all websites." This
permission allows it to use the
[canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) API to
process the image and determine the color palette. As far as [I can
tell](https://stackoverflow.com/a/49696532/1481479), there isn't a narrower
permission that I can use instead. Nevertheless, Picture Paint does not read
your browsing history or send your data anywhere.

## Build Instructions

I use the Node version specified in `.nvmrc`. Run `$ yarn install && yarn run
build:release`. This should generate the final JavaScript files and place
them in `extension/js`.

Load the development build using
[about:debugging](about:debugging#/runtime/this-firefox).

To generate a ZIP file for uploading to [Add-ons](https://addons.mozilla.org/),
run `$ yarn run release`.

If you have Python 3 and Docker, you can also run `$ ./dev` for a development
CLI.

## Other Themes

* [Chromatastic](https://addons.mozilla.org/en-US/firefox/addon/chromatastic/): continuously cycles through colors
* [Color Tailor](https://addons.mozilla.org/en-US/firefox/addon/color-tailor/): changes the theme to the current website's "primary" color
* [Containers Theme](https://addons.mozilla.org/en-US/firefox/addon/containers-theme/): changes the theme color to match the active [container tab](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/)
* [Quantum Lights](https://addons.mozilla.org/en-US/firefox/addon/quantum-lights-dynamic/): Firefox Quantum palette-inspired theme that changes based on the time of day
* [Gradientus](https://addons.mozilla.org/en-US/firefox/addon/gradientus/): also changes colors based on the time of day

## License

[MIT](https://github.com/dguo/picture-paint/blob/master/LICENSE)
