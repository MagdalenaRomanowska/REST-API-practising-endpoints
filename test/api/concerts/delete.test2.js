const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/concerts', () => {
    let resultId;
    before(async () => {//dajemy jakieś dane do usuwania.
        const testConcertOne = new Concert({ id: '5d9f11', performer: 'a1', genre: 'a2', price: 'a3', day: 'a4', image: 'a5', tickets: 'a6' });
        resultId = await testConcertOne.save();
    });

    it('/ should delete document from db and return success', async () => {
        const res = await request(server).delete('/api/concerts/' + resultId._id).send({ performer: 'a1' });
        const newConcert = await Concert.find({ performer: 'a1' });
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('OK');
        expect(newConcert).to.be.empty;//sprawdza, czy element rzeczywiście jest usunięty z bazy.
    });

});