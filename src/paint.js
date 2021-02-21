const fontColorContrast = require("font-color-contrast");
const iq = require("image-q");
const loadImage = require("image-promise");
const moment = require("moment");

// It seems like before this date, months don't reliably have
// a Picture of the Day for every day.
const MIN_DATE = moment("2010-08-01");

// If provided, the date should be in 'yyyy-mm-dd' format
async function getNatGeoPhoto(date) {
    const yearAndMonth = date ? `.${date.substring(0, 7)}` : "";
    const url = `https://www.nationalgeographic.com/content/photography/en_US/photo-of-the-day/_jcr_content/.gallery${yearAndMonth}.json`;
    const response = await fetch(url);
    const json = await response.json();

    if (process.env.NODE_ENV !== "production") {
        console.log(json);
    }

    let photo = json.items[0];
    if (date) {
        const targetPublishDate = moment(date).format("MMMM D, Y");
        photo = json.items.find(
            (item) => item.publishDate === targetPublishDate
        );
    }

    if (process.env.NODE_ENV !== "production") {
        console.log(photo);
    }

    const details = {
        altText: photo.image.alt_text,
        caption: photo.image.caption,
        credit: photo.image.credit,
        smallImageUrl: photo.image.renditions[0].uri,
        largeImageUrl:
            photo.image.renditions[photo.image.renditions.length - 1].uri,
        pageUrl: photo.pageUrl,
        publishDate: moment(photo.publishDate, "MMMM D, Y").format(
            "YYYY-MM-DD"
        ),
        title: photo.image.title
    };

    return details;
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
    const firstColorContrast = fontColorContrast(firstColor);
    const secondColor = pointToRgb(points[1]);
    const secondColorContrast = fontColorContrast(secondColor);
    const thirdColor = pointToRgb(points[2]);
    const thirdColorContrast = fontColorContrast(thirdColor);
    const fourthColor = pointToRgb(points[3]);

    const theme = {
        colors: {
            frame: firstColor,
            popup: thirdColor,
            popup_border: fourthColor,
            popup_text: thirdColorContrast,
            tab_background_text: firstColorContrast,
            tab_line: fourthColor,
            tab_loading: secondColorContrast,
            toolbar: secondColor,
            toolbar_bottom_separator: fourthColor,
            toolbar_field: thirdColor,
            toolbar_field_border: fourthColor,
            toolbar_field_text: thirdColorContrast,
            toolbar_text: secondColorContrast,
            toolbar_top_separator: fourthColor
        }
    };

    await browser.theme.update(theme);
    await browser.storage.local.set({picture, theme});
}

module.exports = {
    getNatGeoPhoto,
    MIN_DATE,
    setTheme
};
