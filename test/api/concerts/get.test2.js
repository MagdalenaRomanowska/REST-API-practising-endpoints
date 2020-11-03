const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');//dostęp do serwera pod stałą server.
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp); //dodać do chai jako middleware. 

const expect = chai.expect; //tworzymy sobie skróty do metod expect i request. Zawsze lepiej pisać expect niż chai.expect.
const request = chai.request; //funkcja pomocnicza request do symulowania requestów, nie jest wbudowana w pakiet Chai. Trzeba pobrać plugin: yarn add chai-http@4.3.0.

describe('GET /api/concerts', () => {
    let resultId;
    before(async () => {//dajemy jakieś dane do zwracania.
        const testConcertOne = new Concert({ id: '01', performer: 'a1', genre: 'a2', price: 'a3', day: 'a4', image: 'a5', tickets: 'a6' });
        resultId = await testConcertOne.save();
        const testConcertTwo = new Concert({ id: '02', performer: 'b1', genre: 'b2', price: 'b3', day: 'b4', image: 'b5', tickets: 'b6' });
        await testConcertTwo.save();

    });
    it('/ should return all concerts', async () => {
        const res = await request(server).get('/api/concerts'); //Łączymy się z api/concerts za pomocą metody GET.
        expect(res.status).to.be.equal(200); //sprawdzamy, czy serwer zwrócił kod sukcesu (a powinien)
        expect(res.body).to.be.an('array'); // i czy otrzymaliśmy jako odpowiedź tablicę z dokładnie dwoma elementami.
        expect(res.body.length).to.be.equal(2);
    });

    it('/:id should return one concert by :id ', async () => {
        const res = await request(server).get('/api/concerts/' + resultId._id);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object'); // czy odpowiedź jest obiektem i czy nie jest nullem. Null sugerowałby, że obiektu nie udało się odnaleźć.
        expect(res.body).to.not.be.null;
    });

    it('/random should return one random concert', async () => {
        const res = await request(server).get('/api/concerts/random');
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.null;
    });

    after(async () => {//kasujemy fake`owe dane.
        await Concert.deleteMany();
    });
});