const moment = require('moment');
const Pikaday = require('pikaday');
const xss = require('xss');

const paint = require('./paint');

function toggleLoader(show) {
    document.getElementById('loader').style.display = show ? '' : 'none';
    document.querySelectorAll('.picture-info').forEach(elem => {
        elem.style.visibility = show ? 'hidden' : 'visible';
    });
}

const picker = new Pikaday({
    field: document.getElementById('datepicker'),
    maxDate: moment().toDate(),
    onSelect: async date => {
        toggleLoader(true);
        const isoDate = moment(date).format('YYYY-MM-DD');
        const picture = await paint.getNatGeoPhoto(isoDate);
        await paint.setTheme(picture);
        loadPicture();
    }
});

async function loadPicture() {
    const items = await browser.storage.local.get('picture');
    const picture = items.picture;

    picker.setMoment(moment(picture.publishDate), true);

    toggleLoader(false);

    const title = document.getElementById('title');
    title.innerText = picture.title;
    title.href = picture.pageUrl;

    document.getElementById('credit').innerText = `by ${picture.credit}`;

    const image = document.getElementById('image');
    image.src = picture.largeImageUrl;
    image.alt = picture.altText;

    document.getElementById('caption').innerHTML = xss(picture.caption);
}

loadPicture();
