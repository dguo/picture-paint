const moment = require('moment');
const Pikaday = require('pikaday');
const xss = require('xss');

const paint = require('./paint');

// It seems like before this date, months don't reliably have
// a Picture of the Day for every day.
const MIN_DATE = moment('2010-08-01');

let publishDate;

function toggleLoader(show) {
    document.getElementById('loader').style.display = show ? '' : 'none';

    document.querySelectorAll('.picture-info').forEach(elem => {
        elem.style.visibility = show ? 'hidden' : 'visible';
    });

    // It's hidden by CSS on the initial load, but it should always be
    // visible afterwards.
    document.getElementById('date').style.visibility = 'visible';

    if (show) {
        console.log('hiding error');
        document.getElementById('error-text').innerText = '';
        document.getElementById('error-message').style.display = 'none';
    }
}

function displayError(message) {
    toggleLoader(false);
    document.getElementById('error-text').innerText = message;
    document.getElementById('error-message').style.display = 'block';
}

const picker = new Pikaday({
    field: document.getElementById('datepicker'),
    minDate: MIN_DATE.toDate(),
    maxDate: moment().toDate(),
    onSelect: async date => {
        toggleLoader(true);
        const isoDate = moment(date).format('YYYY-MM-DD');
        let picture;
        try {
            picture = await paint.getNatGeoPhoto(isoDate);
        } catch (error) {
            console.error(error);
            displayError('Failed to retrieve the image.');
            return;
        }
        console.log('wtf');
        await paint.setTheme(picture);
        loadPicture();
    }
});

function checkPagerButtons() {
    const previousButton = document.getElementById('previous-date');
    previousButton.disabled =
        MIN_DATE.year() === publishDate.year() &&
        MIN_DATE.month() === publishDate.month() &&
        MIN_DATE.date() === publishDate.date();

    const nextButton = document.getElementById('next-date');
    const now = moment();
    nextButton.disabled =
        now.year() === publishDate.year() &&
        now.month() === publishDate.month() &&
        now.date() === publishDate.date();
}

function pageDate(back) {
    if (!publishDate) {
        return;
    }

    if (back) {
        publishDate.subtract(1, 'days');
    } else {
        publishDate.add(1, 'days');
    }

    picker.setMoment(publishDate);
}

document.getElementById('previous-date').onclick = () => {
    pageDate(true);
};

document.getElementById('next-date').onclick = () => {
    pageDate(false);
};

async function loadPicture() {
    const items = await browser.storage.local.get('picture');
    const picture = items.picture;

    publishDate = moment(picture.publishDate);
    checkPagerButtons();
    picker.setMoment(publishDate, true);

    const title = document.getElementById('title');
    title.innerText = picture.title;
    title.href = picture.pageUrl;

    if (picture.credit.startsWith('<p>')) {
        document.getElementById('credit').innerHTML = xss(picture.credit);
    } else {
        document.getElementById('credit').innerText = `by ${picture.credit}`;
    }

    const image = document.getElementById('image');
    image.onload = () => {
        toggleLoader(false);
    };
    image.onerror = () => {
        displayError('Failed to load the image.');
    };
    image.src = picture.largeImageUrl;
    image.alt = picture.altText;

    document.getElementById('caption').innerHTML = xss(picture.caption);
}

browser.storage.local.get('picture').then(items => {
    if (items.picture) {
        loadPicture();
    } else {
        picker.setMoment(moment());
    }
});
