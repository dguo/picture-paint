/* eslint-disable no-console */

const fontColorContrast = require('font-color-contrast');
const loadImage = require('image-promise');
const iq = require('image-q');

function getSmallestSizePath(sizes) {
    const sorted = Object.keys(sizes).sort((a, b) => parseInt(a) - parseInt(b));
    const smallestSize = sorted[0];
    const path = sizes[smallestSize];
    return path;
}

async function getNatGeoPhoto() {
    const url =
        'https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json';
    const response = await fetch(url);
    const json = await response.json();
    // console.log(json);
    const currentPhoto = json.items[0];
    const path = getSmallestSizePath(currentPhoto.sizes);
    return `${currentPhoto.url}${path}`;
}

async function updateTheme() {
    const natGeoUrl = await getNatGeoPhoto();
    const image = await loadImage(natGeoUrl);
    const pointContainer = iq.utils.PointContainer.fromHTMLImageElement(image);
    const palette = await iq.buildPalette([pointContainer], {colors: 4});
    const colors = palette._pointArray;
    const accentColor = [colors[0].r, colors[0].g, colors[0].b];
    const toolbarColor = [colors[1].r, colors[1].g, colors[1].b];
    const toolbarFieldColor = [colors[2].r, colors[2].g, colors[2].b];
    const separatorColor = [colors[3].r, colors[3].g, colors[3].b];

    const theme = {
        colors: {
            accentcolor: accentColor,
            textcolor: fontColorContrast(accentColor),
            toolbar: toolbarColor,
            toolbar_text: fontColorContrast(toolbarColor),
            toolbar_field: toolbarFieldColor,
            toolbar_field_text: fontColorContrast(toolbarFieldColor),
            toolbar_top_separator: separatorColor,
            toolbar_bottom_separator: separatorColor,
            toolbar_field_border: separatorColor
        }
    };

    // console.log('theme:', theme);
    browser.theme.update(theme);
}

updateTheme();

browser.alarms.onAlarm.addListener(updateTheme);
browser.alarms.create('updateTheme', {periodInMinutes: 720});
