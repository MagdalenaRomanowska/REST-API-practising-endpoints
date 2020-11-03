const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('PUT /api/concerts', () => {
    before(async () => {
        const testConcertOne = new Concert({ id: '01', performer: 'a1', genre: 'a2', price: 'a3', day: 'a4', image: 'a5', tickets: 'a6' });
        await testConcertOne.save();
    });

    it('/:id should update chosen document and return success', async () => {
        const res = await request(server).put('/api/concerts/01').send({ performer: '=a1=' });
        const updatedConcert = await Concert.findOne({ id: '01' });
        expect(res.status).to.be.equal(200);
        expect(res.body).to.not.be.null;
        expect(updatedConcert.performer).to.be.equal('=a1=');
    });

    after(async () => {
        await Concert.deleteMany();
    });
});