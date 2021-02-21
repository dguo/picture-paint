const moment = require("moment");
const Pikaday = require("pikaday");

const paint = require("./paint");

const dailyRadio = document.getElementById("daily");
const lockRadio = document.getElementById("lock");

function toggleLoader(show) {
    document.getElementById("loader").style.display = show ? "" : "none";
}

function hideMessage() {
    document.getElementById("message").style.display = "none";
}

function showMessage(message, error) {
    toggleLoader(false);

    document.getElementById("message-icon").innerText = error ? "!" : "✓";
    document.getElementById("message-text").innerText = message;
    const messageDiv = document.getElementById("message");
    messageDiv.style.display = "block";
    messageDiv.style.backgroundColor = error ? "#d70022" : "#30e60b";
    messageDiv.style.color = error ? "#ffffff" : "#003706";
    const iconDiv = document.getElementById("message-icon");
    iconDiv.style.backgroundColor = error ? "#ffffff" : "#003706";
    iconDiv.style.color = error ? "#d70022" : "#30e60b";
}

dailyRadio.onchange = hideMessage;
lockRadio.onchange = hideMessage;

const datepicker = new Pikaday({
    field: document.getElementById("datepicker"),
    maxDate: moment().toDate(),
    minDate: paint.MIN_DATE.toDate(),
    onClose: () => {
        document.body.style.paddingBottom = "";
    },
    onOpen: () => {
        hideMessage();
        lockRadio.checked = true;
        document.body.style.paddingBottom = "200px";
    },
    position: "bottom left",
    reposition: false
});

document.getElementById("behavior-form").onsubmit = async (e) => {
    e.preventDefault();

    hideMessage();

    if (dailyRadio.checked) {
        try {
            await browser.storage.local.set({lockDate: null});
            showMessage("Saved.");
        } catch (error) {
            showMessage("Failed to save the setting.", true);
        }
        return;
    }

    const date = datepicker.toString("YYYY-MM-DD");
    if (!date) {
        showMessage("Invalid date.", true);
        return;
    }

    toggleLoader(true);

    let picture;
    try {
        picture = await paint.getNatGeoPhoto(date);
    } catch (error) {
        showMessage("Failed to retrieve the image.", true);
        return;
    }

    try {
        await paint.setTheme(picture);
    } catch (error) {
        showMessage("Failed to process the image.", true);
        return;
    }

    try {
        await browser.storage.local.set({lockDate: date});
        showMessage("Saved.");
    } catch (error) {
        showMessage("Failed to save the setting.", true);
    }
};

(async function init() {
    toggleLoader(false);

    const items = await browser.storage.local.get("lockDate");
    if (items.lockDate) {
        lockRadio.checked = true;
        datepicker.setMoment(moment(items.lockDate), true);
    } else {
        dailyRadio.checked = true;
        datepicker.setMoment(moment(), true);
    }
})();
