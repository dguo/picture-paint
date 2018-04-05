const paint = require('./paint');

async function updateTheme() {
    const picture = await paint.getNatGeoPhoto();
    await paint.setTheme(picture);
}

updateTheme();

browser.alarms.onAlarm.addListener(updateTheme);
browser.alarms.create('updateTheme', {periodInMinutes: 240});
