const mensaplan = require('../src/mensaplan');
const expect = require('chai').expect;

const menueMonday = {
    category: 'Vegetarisch',
    description: 'Hirtenkäse im Knuspermantel A,H,A1 mit Tomatensauce',
    price: '2,10 €'
};

describe('mensaplan', () => {

    it('get the plan of the actual week', (done) => {
        mensaplan.init(() => {
            const lunchCardMonday = mensaplan.lunchCard('2017-08-07')[0];
            expect(lunchCardMonday).to.deep.equal(menueMonday);
            done();
        });
    });

});