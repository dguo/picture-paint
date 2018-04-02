/* eslint-disable no-console */

const fontColorContrast = require('font-color-contrast');
const loadImage = require('image-promise');
const iq = require('image-q');

function getSizePaths(sizes) {
    const sorted = Object.keys(sizes).sort((a, b) => parseInt(a) - parseInt(b));
    const smallPath = sizes[sorted[0]];
    const largePath = sizes[sorted[sorted.length - 1]];
    return [smallPath, largePath];
}

async function getNatGeoPhoto() {
    const url =
        'https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json';
    const response = await fetch(url);
    const json = await response.json();
    // console.log(json);
    const photo = json.items[0];
    console.log(photo);
    const [smallPath, largePath] = getSizePaths(photo.sizes);
    return {
        altText: photo.altText,
        caption: photo.caption,
        credit: photo.credit,
        smallImageUrl: `${photo.url}${smallPath}`,
        largeImageUrl: `${photo.url}${largePath}`,
        pageUrl: photo.pageUrl,
        title: photo.title
    };
}

function pointToRgb(point) {
    return point.rgba.slice(0, 3);
}

async function updateTheme() {
    const picture = await getNatGeoPhoto();

    // Don't do anything if the Photo of the Day hasn't changed yet
    const storedPicture = await browser.storage.local.get('picture');
    if (storedPicture && storedPicture.pageUrl === picture.pageUrl) {
        return;
    }

    const image = await loadImage(picture.smallImageUrl);
    const pointContainer = iq.utils.PointContainer.fromHTMLImageElement(image);
    const palette = await iq.buildPalette([pointContainer], {colors: 4});
    const points = palette._pointArray;
    const accentColor = pointToRgb(points[0]);
    const toolbarColor = pointToRgb(points[1]);
    const toolbarFieldColor = pointToRgb(points[2]);
    const separatorColor = pointToRgb(points[3]);

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
    browser.storage.local.set({picture});
}

updateTheme();

browser.alarms.onAlarm.addListener(updateTheme);
browser.alarms.create('updateTheme', {periodInMinutes: 240});
