const express = require('express');
const { v4: uuidv4 } = require('uuid'); //Do losowania id możesz użyć zewnętrznej biblioteki, np. uuid.
const bodyParser = require('body-parser');

const app = express(); 
app.use(express.urlencoded({ extended: false }));//Jeśli chcesz mieć obsługę formularzy x-www-form-urlencoded, dodaj middleware express.urlencoded.
app.use(express.json()); //Jeśli dodatkowo chcesz odbierać dane w formacie JSON (mogą być wysyłane za pomocą form-data), to również express.json.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // to support URL-encoded bodies
  
const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
  { id: 3, author: 'Dave Gahan', text: 'Speak & Spell.' },
  { id: 4, author: 'Martin Gore', text: 'Enjoy the Silence.' },
  { id: 5, author: 'Alan Wilder', text: 'Walking in my shoes.' },
  { id: 6, author: 'Vince Clarke', text: 'A question of time.' },
];

app.get('/testimonials', (req, res) => { //ma zwracać całą zawartość tablicy. W formacie JSON - https://expressjs.com/en/api.html
  res.json(db);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/testimonials/random', (req, res) => { //zwracamy losowy element z tablicy. Do losowania id możesz użyć zewn. biblioteki, np. uuid.
  let id = getRandomInt(0, db.length -1);
  res.json(db[id]);
});

app.get('/testimonials/:id', (req, res) => { //zwracamy tylko jeden element tablicy, zgodny z :id.
  res.json(db[req.params.id -1]); //https://expressjs.com/en/api.html#res
});

function changeAuthorAndText(id, author, text) { //https://stackoverflow.com/questions/4689856/how-to-change-value-of-object-which-is-inside-an-array-using-javascript-or-jquer/50504081
  for(let i in db) {
    if (db[i].id == id) {
      db[i].author = author;
      db[i].text = text;
       break; //Stop this loop.
    }
  }
}

app.put('/testimonials/:id', (req, res) => {//modyfikujemy atrybuty author i text elementu tablicy o pasującym :id. Załóż, że body otrzymane w requeście będzie obiektem z atrybutami author i text.
  changeAuthorAndText(db[req.params.id -1].id, req.body.author, req.body.text);
  console.log('dbAfterChange:', db);
  res.json({ message: 'OK' });
});

app.post('/testimonials', (req, res) => {//dodajemy nowy element do tablicy. Body przekazywane przez klienta będzie obiektem z atrybutami author i text. Id dodawanego elementu musisz losować.
  let newId = uuidv4(); //losuję ID z uzyciem biblioteki uuid.
  let newAuthor = req.body.author;
  let newText = req.body.text;
  let newObject = {};
  newObject = {id: newId, author: newAuthor, text: newText};
  db.push(newObject);
  res.json({ message: 'OK' }); 
});

app.delete('/testimonials/:id', (req, res) => {//usuwamy z tablicy wpis o podanym id.
  db.splice(req.params.id -1, 1);
  res.json({ message: 'OK' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' }); 
});

app.listen(8000, () => { 
  console.log('Server is running on port: 8000'); 
});