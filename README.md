# Picture Paint [![Build Status](https://travis-ci.org/dguo/picture-paint.svg?branch=master)](https://travis-ci.org/dguo/picture-paint)
A [dynamic Firefox
theme](https://developer.mozilla.org/en-US/Add-ons/Themes/Theme_concepts#Dynamic_themes)
that uses the color palette of the current [National Geographic Photo of the Day](https://www.nationalgeographic.com/photography/photo-of-the-day/).
The theme automatically updates every day, and you can click the toolbar button
to see the picture and click through to the National Geographic page. Available
in [Firefox
Add-ons](https://addons.mozilla.org/en-US/firefox/addon/picture-paint/).

## Gallery
![blue](https://i.imgur.com/hn6DOl4.png)
---
![green](https://i.imgur.com/2xNfcQ8.png)
---
![brown](https://i.imgur.com/vCHtdA2.png)
---
![red](https://i.imgur.com/JaDy3lV.png)

## Installation
This extension requires Firefox 60 and above. Install it from the
[Add-ons](https://addons.mozilla.org/en-US/firefox/addon/picture-paint/) page.
It might take a few seconds to process the image and then apply the theme.

## Build Instructions
I use the Node version specified in `.nvmrc`. Run `$ yarn install && yarn run
build:release`. This should generate the final JavaScript files and place
them in `extension/js`.

To generate a ZIP file for uploading to [Add-ons](https://addons.mozilla.org/),
run `$ yarn run release`.

If you have Python 3 and Docker, you can also run `$ ./dev` for a development
CLI.

## Other Themes
* [Containers Theme](https://addons.mozilla.org/en-US/firefox/addon/containers-theme/): changes the theme color to match the active [container tab](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/)
* [Quantum Lights](https://addons.mozilla.org/en-US/firefox/addon/quantum-lights-dynamic/): Firefox Quantum palette-inspired theme that changes based on the time of day
* [Gradientus](https://addons.mozilla.org/en-US/firefox/addon/gradientus/): also changes colors based on the time of day

## License
[MIT](https://github.com/dguo/picture-paint/blob/master/LICENSE)
