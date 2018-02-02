const mensaplan = require('../src/mensaplan');
const expect = require('chai').expect;

const menueMonday = {
  "category": "Tellergericht",
  "description": "Kichererbsen-Tomaten-Eintopf mit Pinienkernen",
  "price": "1,80 €"
};

describe('mensaplan', () => {

  it('get the plan of the actual day', (done) => {
    mensaplan.lunchCard('2018-02-01', (result) => {
      for (let meal of result) {
        console.log(`In der Kategorie ${meal.category}`);
        console.log(`gibt es ${meal.name}`);
        console.log(`für ${meal.prices.students}.`);
        console.log(meal.notes);
      }

      expect(result).to.deep.equal(menueMonday);
      done();
    });
  });

});