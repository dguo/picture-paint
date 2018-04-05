const fontColorContrast = require('font-color-contrast');
const iq = require('image-q');
const loadImage = require('image-promise');
const moment = require('moment');

function getSizePaths(sizes) {
    const sorted = Object.keys(sizes).sort((a, b) => parseInt(a) - parseInt(b));
    const smallPath = sizes[sorted[0]];
    const largePath = sizes[sorted[sorted.length - 1]];
    return [smallPath, largePath];
}

// If provided, the date should be in 'yyyy-mm-dd' format
async function getNatGeoPhoto(date) {
    const yearAndMonth = date ? `.${date.substring(0, 8)}` : '';
    const url = `https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery${yearAndMonth}.json`;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    let photo = json.items[0];
    if (date) {
        const targetPublishDate = moment(date).format('MMMM D, Y');
        photo = json.items.find(item => item.publishDate === targetPublishDate);
    }
    console.log(photo);

    let smallPath;
    let largePath;
    if (photo.sizes) {
        [smallPath, largePath] = getSizePaths(photo.sizes);
    }

    return {
        altText: photo.altText,
        caption: photo.caption,
        credit: photo.credit,
        smallImageUrl: smallPath ? `${photo.url}${smallPath}` : photo.url,
        largeImageUrl: largePath ? `${photo.url}${largePath}` : photo.url,
        pageUrl: photo.pageUrl,
        publishDate: moment(photo.publishDate, 'MMMM D, Y').format(
            'YYYY-MM-DD'
        ),
        title: photo.title
    };
}

function pointToRgb(point) {
    return point.rgba.slice(0, 3);
}

async function setTheme(picture) {
    const image = await loadImage(picture.smallImageUrl);
    const pointContainer = iq.utils.PointContainer.fromHTMLImageElement(image);
    const palette = await iq.buildPalette([pointContainer], {colors: 4});
    const points = palette._pointArray;
    const firstColor = pointToRgb(points[0]);
    const secondColor = pointToRgb(points[1]);
    const thirdColor = pointToRgb(points[2]);
    const fourthColor = pointToRgb(points[3]);

    const theme = {
        colors: {
            accentcolor: firstColor,
            popup: thirdColor,
            popup_border: fourthColor,
            popup_text: fontColorContrast(thirdColor),
            tab_line: fourthColor,
            textcolor: fontColorContrast(firstColor),
            toolbar: secondColor,
            toolbar_bottom_separator: fourthColor,
            toolbar_field: thirdColor,
            toolbar_field_border: fourthColor,
            toolbar_field_text: fontColorContrast(thirdColor),
            toolbar_text: fontColorContrast(secondColor),
            toolbar_top_separator: fourthColor
        }
    };

    await browser.theme.update(theme);
    await browser.storage.local.set({picture});
}

module.exports = {
    getNatGeoPhoto,
    setTheme
};
