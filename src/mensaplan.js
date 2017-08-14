const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.lunchCard = lunchCard;
exports.init = init;

const mensa_url = 'http://www.studierendenwerk-aachen.de/speiseplaene/juelich-w.html';
const dayOfWeekIds = [
    'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag',
    'montagNaechste', 'dienstagNaechste', 'mittwochNaechste', 'donnerstagNaechste', 'freitagNaechste'];

let weekplan = undefined;

function init(callback) {
    weekplan = {};
    JSDOM.fromURL(mensa_url).then(dom => {
        dayOfWeekIds.forEach( dayId => {
            const menueCategories = [];
            const menueDescriptions = [];
            const menuePrices = [];

            const dayAnddate = dom.window.document.querySelector("[data-anchor='#" + dayId + "']").textContent.trim();
            const date = dayAnddate.split(',')[1].trim();

            const currentWeekday = dom.window.document.querySelector('#' + dayId);
            const currentMenueCategory = currentWeekday.querySelectorAll('.menue-category');
            currentMenueCategory.forEach(menueCategory => {
                menueCategories.push(menueCategory.textContent.trim());
            });

            const currentMenueDescription = currentWeekday.querySelectorAll('.menue-desc');
            currentMenueDescription.forEach(menueDescription => {
                menueDescriptions.push(menueDescription.textContent.trim());
            });

            const currentMenuePrice = currentWeekday.querySelectorAll('.menue-price');
            currentMenuePrice.forEach(menuePrice => {
                menuePrices.push(menuePrice.textContent.trim());
            });

            weekplan[date] = [];
            for(let i = 0; i < menueCategories.length; i++) {
                const menue = {};
                menue.category = menueCategories[i];
                menue.description = menueDescriptions[i];
                menue.price = menuePrices[i];
                weekplan[date].push(menue);
            }
        });
        //console.log(weekplan);
        callback(); //ready
    });
}



function lunchCard(date) {
    const dateParts = date.split('-');
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    const dateAsString = day+ '.' + month + '.' + year;
    //console.log(dateAsString, weekplan[dateAsString]);
    return weekplan[dateAsString];
}

