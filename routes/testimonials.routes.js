const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const express = require('express');
const router = express.Router();
const {db} = require('../db.js');

router.route('/testimonials').get((req, res) => {//ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db.testimonials);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.route('/testimonials/random').get((req, res) => { //zwracamy losowy element z tablicy. Do losowania id możesz użyć zewn. biblioteki, np. uuid.
  let id = getRandomInt(0, db.testimonials.length - 1);
  res.json(db.testimonials[id]);
});

router.route('/testimonials/:id').get((req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
  let id = req.params.id; //id z adresu np http://localhost:8000/api/testimonials/5 to będzie 5.
  let [testimonial] = db.testimonials.filter(x => x.id == id);
  res.json(testimonial); //https://expressjs.com/en/api.html#res
});

router.route('/testimonials/:id').put((req, res) => {//modyfikujemy atrybuty author i text elementu tablicy o pasującym :id. Załóż, że body otrzymane w requeście będzie obiektem z atrybutami author i text.
  let id = req.params.id; //id z adresu np http://localhost:8000/api/testimonials/5 to będzie 5.
  let [testimonial] = db.testimonials.filter(x => x.id == id);  //https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
  testimonial.author = req.body.author;
  testimonial.text = req.body.text;
  res.json({ message: 'OK' });
});

router.route('/testimonials').post((req, res) => {//dodajemy nowy element do tablicy. Body przekazywane przez klienta będzie obiektem z atrybutami author i text. Id dodawanego elementu musisz losować.
  let id = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
  let author = req.body.author;
  let text = req.body.text;
  let newObject = { id, author, text };
  db.testimonials.push(newObject);
  res.json({ message: 'OK' });
});

router.route('/testimonials/:id').delete((req, res) => {//usuwamy z tablicy wpis o podanym id.
  let id = req.params.id; //id z adresu np http://localhost:8000/api/testimonials/2 to będzie 2.
  let testimonialIndex = db.testimonials.findIndex(x => x.id == id); //findIndex metoda zwraca 1szy znaleziony indeks elementu.
  db.testimonials.splice(testimonialIndex, 1);
  res.json({ message: 'OK' });
});

module.exports = router;