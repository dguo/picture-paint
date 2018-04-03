const sanitizeHtml = require('sanitize-html');

(async function loadCurrentPicture() {
    const items = await browser.storage.local.get('picture');
    const picture = items.picture;
    if (!picture) {
        return;
    }

    const title = document.getElementById('title');
    title.innerText = picture.title;
    title.href = picture.pageUrl;

    document.getElementById('credit').innerText = `by ${picture.credit}`;

    const image = document.getElementById('image');
    image.src = picture.largeImageUrl;
    image.alt = picture.altText;

    document.getElementById('caption').innerHTML = sanitizeHtml(
        picture.caption
    );
})();
