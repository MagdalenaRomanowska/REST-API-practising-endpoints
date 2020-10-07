const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.route('/concerts').get((req, res) => {//ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db.db.concerts);
});
 
  router.route('/concerts/:id').get((req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
    res.json(db.db.concerts[req.params.id -1]); //https://expressjs.com/en/api.html#res
  });
  
  function changePerformerAndGenre(id, performer, genre) { //https://stackoverflow.com/questions/4689856/how-to-change-value-of-object-which-is-inside-an-array-using-javascript-or-jquer/50504081
    for(let i in db.db.concerts) {
      if (db.db.concerts[i].id == id) {
        db.db.concerts[i].performer = performer;
        db.db.concerts[i].genre = genre;
         break; //Stop this loop.
      }
    }
  }
  
  router.route('/concerts/:id').put((req, res) => {//modyfikujemy atrybuty o pasującym :id. 
    changePerformerAndGenre(db.db.concerts[req.params.id -1].id, req.body.performer, req.body.genre);
    console.log('db.db.concerts:', db.db.concerts);
    res.json({ message: 'OK' });
  });
  
  router.route('/concerts').post((req, res) => {//dodajemy nowy element do tablicy. 
    let newId = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
    let newPerformer = req.body.performer;
    let newGenre = req.body.genre;
    let newObject = {};
    newObject = {id: newId, performer: newPerformer, genre: newGenre};
    db.db.concerts.push(newObject);
    console.log('db.db.concerts:', db.db.concerts);
    res.json({ message: 'OK' }); 
  });
  
  router.route('/concerts/:id').delete((req, res) => {//usuwamy z tablicy wpis o podanym id.
    db.db.concerts.splice(req.params.id -1, 1);
    console.log('db.db.concerts:', db.db.concerts);
    res.json({ message: 'OK' });
  });

module.exports = router;