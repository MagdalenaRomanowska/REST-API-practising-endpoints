const Concert = require('../models/concert.model');
const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    let concerts = await Concert.find();
    let newConcertWithTickets = [];
    for(let element of concerts){
      const newConcert = { id: element.id, performer: element.performer, genre: element.genre, price: element.price, day: element.day, image: element.image, tickets: element.tickets };
        //znaleźć wszystkie miejsca na dany dzień z danego koncertu, policzyć ile jest elem takiej tablicy, odjąć od 50,
        let freeTicketsForOneDay = 50 - await Seat.find( {day:{$eq: element.day} } ).countDocuments();
        newConcert.tickets = freeTicketsForOneDay; //przypisać do newConcert.tickets
        newConcertWithTickets.push(newConcert);
    }
    res.json(newConcertWithTickets);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const dep = await Concert.findById(req.params.id);
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.put = async (req, res) => {
  const { id, performer, genre, price, day, image } = req.body;
  try {
    const dep = await(Concert.findById(req.params.id));
    if(dep) {
      dep.id = id;
      dep.performer = performer;
      dep.genre = genre;
      dep.price = price;
      dep.day = day;
      dep.image = image;
      await dep.save();
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  try {
    const { id, performer, genre, price, day, image } = req.body;
    const newConcert = new Concert({ id: id, performer: performer, genre: genre, price: price, day: day, image: image });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const dep = await(Concert.findById(req.params.id));
    if(dep) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};