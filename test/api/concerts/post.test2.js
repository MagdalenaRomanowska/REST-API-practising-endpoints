const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /api/concerts', () => {

    it('/ should insert new document to db and return success', async () => {
        const res = await request(server).post('/api/concerts').send({ id: '01', performer: 'a1', genre: 'a2', price: 'a3', day: 'a4', image: 'a5', tickets: 'a6' });
        const newConcert = await Concert.find({ id: '01', performer: 'a1', genre: 'a2', price: 'a3', day: 'a4', image: 'a5', tickets: 'a6' });
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('OK');
        expect(newConcert).to.not.be.null;//sprawdza, czy element rzeczywiście jest dodany do bazy.
    });

    after(async () => {//Usuwanie próbnego wpisu, który będzie dodawany podczas testowego requestu. Nie korzystamy z hooka before, ale after się przyda.
        await Concert.deleteMany();
    });
});