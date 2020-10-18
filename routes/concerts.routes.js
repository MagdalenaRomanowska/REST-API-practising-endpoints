const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const express = require('express');
const router = express.Router();
const {db} = require('../db.js');

router.route('/concerts').get((req, res) => {//ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
  let id = req.params.id; //id z adresu np http://localhost:8000/api/concerts/2 to będzie 2.
  let [concert] = db.concerts.filter(x => x.id == id);
  res.json(concert); //https://expressjs.com/en/api.html#res
});

router.route('/concerts/:id').put((req, res) => {//modyfikujemy atrybuty o pasującym :id. 
  let id = req.params.id; //id z adresu np http://localhost:8000/api/concerts/2 to będzie 2.
  let [concert] = db.concerts.filter(x => x.id == id);  //https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
  concert.performer = req.body.performer;
  concert.genre = req.body.genre;
  res.json({ message: 'OK' });
});

router.route('/concerts').post((req, res) => {//dodajemy nowy element do tablicy. 
  let id = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
  let performer = req.body.performer;
  let genre = req.body.genre;
  let newObject = { id, performer, genre};
  db.concerts.push(newObject);
  console.log('db.concerts MADZIA', db.concerts);
  res.json({ message: 'OK' });
});

router.route('/concerts/:id').delete((req, res) => {//usuwamy z tablicy wpis o podanym id.
  let id = req.params.id; //id z adresu np http://localhost:8000/api/concerts/2 to będzie 2.
  let concertIndex = db.concerts.findIndex(x => x.id == id); //findIndex metoda zwraca 1szy znaleziony indeks elementu.
  db.concerts.splice(concertIndex, 1);
  res.json({ message: 'OK' });
});

module.exports = router;