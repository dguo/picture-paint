/* eslint-disable no-console */

const fontColorContrast = require('font-color-contrast');

async function getNatGeoPhoto() {
    const url = 'https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json';
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    const currentPhoto = json.items[0];
    return `${currentPhoto.url}${currentPhoto.originalUrl}`;
}

async function updateTheme() {
    const natGeoUrl = await getNatGeoPhoto();
    console.log(natGeoUrl);
    const color = '#FFFFFF';
    const theme = {
        colors: {
            accentcolor: color,
            textcolor: fontColorContrast(color)
        }
    };

    browser.theme.update(theme);
}

updateTheme();

browser.alarms.onAlarm.addListener(updateTheme);
browser.alarms.create('updateTheme', {periodInMinutes: 720});
