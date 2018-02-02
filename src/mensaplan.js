const request = require('request');

exports.lunchCard = lunchCard;

const meals_url = 'http://openmensa.org/api/v2/canteens/100/days';

function lunchCard(date, callback) {
  const url = `${meals_url}/${date}/meals`;
  console.log(url);
  request(url, (error, response, body) => {
    if (error || (response && response.statusCode !== 200)) {
      console.log('error:', error);
      console.log('response status:', response.status);
    } else {
      callback(JSON.parse(body));
    }
  });
}