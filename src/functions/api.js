/**
 * A very special function to load the gapi inside the DOM, directly.
 * So it'll load the real and most recent gapi-scrip from google and attach to DOM:
 * let gapi = loadGapiInsideDOM();
 * Now you can use it anywhere.
 */
const loadGapiInsideDOM = async function () {
    return new Promise(resolve => {
        const element = document.getElementsByTagName('script')[0];
        const js = document.createElement('script');
        js.id = 'google-platform';
        js.src = 'https://apis.google.com/js/api.js';
        js.async = true;
        js.defer = true;
        element.parentNode.insertBefore(js, element);
        js.onload = async () => {
            resolve(window.gapi);
        }
    });
}

export { loadGapiInsideDOM }