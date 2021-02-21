const moment = require("moment");
const paint = require("./paint");

/* We want to minimize the impact of running this extension, so don't
   hit the Nat Geo API if the date hasn't changed. Even if we are on a new
   date, don't process the image (which is expensive) if the publishDate hasn't
   changed. Use the force flag to bypass these checks. */
async function updateTheme(date, force) {
    let publishDate;

    if (!force) {
        const items = await browser.storage.local.get("picture");
        if (items.picture) {
            publishDate = items.picture.publishDate;
            if (publishDate === moment().format("YYYY-MM-DD")) {
                return;
            }
        }
    }

    const picture = await paint.getNatGeoPhoto(date);

    if (!force && picture.publishDate === publishDate) {
        return;
    }

    await paint.setTheme(picture);
}

function createAlarm() {
    return browser.alarms.create("updateTheme", {periodInMinutes: 10});
}

(async function init() {
    const items = await browser.storage.local.get("lockDate");
    if (!items.lockDate) {
        await createAlarm();
    }

    updateTheme(items.lockDate, true);
})();

browser.alarms.onAlarm.addListener(() => {
    updateTheme();
});

browser.storage.onChanged.addListener((changes) => {
    if (Object.prototype.hasOwnProperty.call(changes, "lockDate")) {
        if (changes.lockDate.newValue) {
            browser.alarms.clearAll();
        } else {
            createAlarm();
        }
    }
});

browser.windows.onCreated.addListener(async (window) => {
    const items = await browser.storage.local.get("theme");
    if (items.theme) {
        browser.theme.update(window.id, items.theme);
    }
});
