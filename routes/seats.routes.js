const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.route('/seats').get((req, res) => {//ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db.db.seats);
});

router.route('/seats/:id').get((req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
  let id = req.params.id; //id z adresu np http://localhost:8000/api/seats/2 to będzie 2.
  let [seat] = db.db.seats.filter(x => x.id == id);
  res.json(seat);
});

router.route('/seats/:id').put((req, res) => {//modyfikujemy atrybuty  o pasującym :id. 
  let id = req.params.id; //id z adresu np http://localhost:8000/api/concerts/2 to będzie 2.
  let [seat] = db.db.seats.filter(x => x.id == id);  //https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
  seat.client = req.body.client;
  seat.email = req.body.email;
  res.json({ message: 'OK' });
});

router.route('/seats').post((req, res) => {//dodajemy nowy element do tablicy. 
  let id = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
  let client = req.body.client;
  let email = req.body.email;
  let day = req.body.day;
  let seat = req.body.seat;
  let newObject = { id, client, email, day, seat };
  let isSetReserved = db.db.seats.some(x => x.seat == seat && x.day == day); //zadanie submoduł 27.6: w przypadku, gdy wybrane miejsce jest zajęte na wybrany dzień, zwrócił komunikat o treści: { message: "The slot is already taken..." }. Koniecznie ustaw też odpowiedni kod statusu.
  if (isSetReserved){
    res.status(500).json({ message: 'The slot is already taken...' });
  } else{
    db.db.seats.push(newObject);
    res.json({ message: 'OK' });
  }
});

router.route('/seats/:id').delete((req, res) => {//usuwamy z tablicy wpis o podanym id.
  let id = req.params.id; //id z adresu np http://localhost:8000/api/seats/2 to będzie 2.
  let seatIndex = db.db.seats.findIndex(x => x.id == id); //findIndex metoda zwraca 1szy znaleziony indeks elementu.
  db.db.seats.splice(seatIndex, 1);
  res.json({ message: 'OK' });
});

module.exports = router;