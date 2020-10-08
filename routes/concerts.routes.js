const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.route('/concerts').get((req, res) => {//ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db.db.concerts);
});

router.route('/concerts/:id').get((req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
  res.json(db.db.concerts[req.params.id - 1]); //https://expressjs.com/en/api.html#res
});

router.route('/concerts/:id').put((req, res) => {//modyfikujemy atrybuty o pasującym :id. 
  let id = req.params.id; //id z adresu np http://localhost:8000/api/concerts/2 to będzie 2.
  let newArray = (db.db.concerts).filter(x => x.id == id);  //https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
  newArray[0].performer = req.body.performer;
  newArray[0].genre = req.body.genre;
  res.json({ message: 'OK' });
});

router.route('/concerts').post((req, res) => {//dodajemy nowy element do tablicy. 
  let newId = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
  let newPerformer = req.body.performer;
  let newGenre = req.body.genre;
  let newObject = {};
  newObject = { id: newId, performer: newPerformer, genre: newGenre };
  db.db.concerts.push(newObject);
  console.log('db.db.concerts:', db.db.concerts);
  res.json({ message: 'OK' });
});

router.route('/concerts/:id').delete((req, res) => {//usuwamy z tablicy wpis o podanym id.
  db.db.concerts.splice(req.params.id - 1, 1);
  console.log('db.db.concerts:', db.db.concerts);
  res.json({ message: 'OK' });
});

module.exports = router;