const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.route('/seats').get((req, res) => {//ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db.db.seats);
});
 
  router.route('/seats/:id').get((req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
    res.json(db.db.seats[req.params.id -1]); //https://expressjs.com/en/api.html#res
  });
  
  function changeClientAndEmail(id, client, email) { //https://stackoverflow.com/questions/4689856/how-to-change-value-of-object-which-is-inside-an-array-using-javascript-or-jquer/50504081
    for(let i in db.db.seats) {
      if (db.db.seats[i].id == id) {
        db.db.seats[i].client = client;
        db.db.seats[i].email = email;
         break; //Stop this loop.
      }
    }
  }
  
  router.route('/seats/:id').put((req, res) => {//modyfikujemy atrybuty  o pasującym :id. 
    changeClientAndEmail(db.db.seats[req.params.id -1].id, req.body.client, req.body.email);
    console.log('db.db.seats:', db.db.seats);
    res.json({ message: 'OK' });
  });
  
  router.route('/seats').post((req, res) => {//dodajemy nowy element do tablicy. 
    let newId = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
    let newClient = req.body.client;
    let newEmail = req.body.email;
    let newObject = {};
    newObject = {id: newId, client: newClient, email: newEmail};
    db.db.seats.push(newObject);
    console.log('db.db.seats:', db.db.seats);
    res.json({ message: 'OK' }); 
  });
  
  router.route('/seats/:id').delete((req, res) => {//usuwamy z tablicy wpis o podanym id.
    db.db.seats.splice(req.params.id -1, 1);
    console.log('db.db.seats:', db.db.seats);
    res.json({ message: 'OK' });
  });

module.exports = router;