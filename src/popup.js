const moment = require('moment');
const Pikaday = require('pikaday');
const xss = require('xss');

const paint = require('./paint');

async function loadCurrentPicture(picture) {
    if (!picture) {
        const items = await browser.storage.local.get('picture');
        picture = items.picture;
    }

    const title = document.getElementById('title');
    title.innerText = picture.title;
    title.href = picture.pageUrl;

    document.getElementById('credit').innerText = `by ${picture.credit}`;

    const image = document.getElementById('image');
    image.src = picture.largeImageUrl;
    image.alt = picture.altText;

    document.getElementById('caption').innerHTML = xss(picture.caption);
}

loadCurrentPicture();

new Pikaday({
    field: document.getElementById('datepicker'),
    maxDate: moment().toDate(),
    onSelect: async date => {
        const isoDate = moment(date).format('YYYY-MM-DD');
        const picture = await paint.getNatGeoPhoto(isoDate);
        await paint.setTheme(picture);
        loadCurrentPicture(picture);
    }
});
