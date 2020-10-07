const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.route('/testimonials').get((req, res) => {//ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db.db.testimonials);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  router.route('/testimonials/random').get((req, res) => { //zwracamy losowy element z tablicy. Do losowania id możesz użyć zewn. biblioteki, np. uuid.
    let id = getRandomInt(0, db.db.testimonials.length -1);
    res.json(db.db.testimonials[id]);
  });
  
  router.route('/testimonials/:id').get((req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
    res.json(db.db.testimonials[req.params.id -1]); //https://expressjs.com/en/api.html#res
  });
  
  function changeAuthorAndText(id, author, text) { //https://stackoverflow.com/questions/4689856/how-to-change-value-of-object-which-is-inside-an-array-using-javascript-or-jquer/50504081
    for(let i in db.db.testimonials) {
      if (db.db.testimonials[i].id == id) {
        db.db.testimonials[i].author = author;
        db.db.testimonials[i].text = text;
         break; //Stop this loop.
      }
    }
  }
  
  router.route('/testimonials/:id').put((req, res) => {//modyfikujemy atrybuty author i text elementu tablicy o pasującym :id. Załóż, że body otrzymane w requeście będzie obiektem z atrybutami author i text.
    changeAuthorAndText(db.db.testimonials[req.params.id -1].id, req.body.author, req.body.text);
    res.json({ message: 'OK' });
  });
  
  router.route('/testimonials').post((req, res) => {//dodajemy nowy element do tablicy. Body przekazywane przez klienta będzie obiektem z atrybutami author i text. Id dodawanego elementu musisz losować.
    let newId = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
    let newAuthor = req.body.author;
    let newText = req.body.text;
    let newObject = {};
    newObject = {id: newId, author: newAuthor, text: newText};
    db.db.testimonials.push(newObject);
    res.json({ message: 'OK' }); 
  });
  
  router.route('/testimonials/:id').delete((req, res) => {//usuwamy z tablicy wpis o podanym id.
    db.db.testimonials.splice(req.params.id -1, 1);
    res.json({ message: 'OK' });
  });

module.exports = router;