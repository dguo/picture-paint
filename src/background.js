const paint = require('./paint');

async function updateTheme(date) {
    const picture = await paint.getNatGeoPhoto(date);
    await paint.setTheme(picture);
}

function createAlarm() {
    return browser.alarms.create('updateTheme', {periodInMinutes: 240});
}

(async function init() {
    const items = await browser.storage.local.get('lockDate');
    if (!items.lockDate) {
        await createAlarm();
    }

    updateTheme(items.lockDate);
})();

browser.alarms.onAlarm.addListener(() => {
    updateTheme();
});

browser.storage.onChanged.addListener(changes => {
    if (changes.hasOwnProperty('lockDate')) {
        if (changes.lockDate) {
            browser.alarms.clearAll();
        } else {
            createAlarm();
        }
    }
});
