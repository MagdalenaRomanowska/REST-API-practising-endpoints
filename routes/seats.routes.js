const express = require('express');
const router = express.Router();

router.get('/seats', async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/seats/:id', async (req, res) => {
  try {
    const dep = await Seat.findById(req.params.id);
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/seats/:id', async (req, res) => {
  const { id, day, seat, client, email } = req.body;
  try {
    const dep = await(Seat.findById(req.params.id));
    if(dep) {
      dep.id = id;
      dep.day = day;
      dep.seat = seat;
      dep.client = client;
      dep.email = email;
      await dep.save();
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/seats', async (req, res) => {
  try {
    const { id, day, seat, client, email } = req.body;
    const newSeat = new Seat({ id: id, day: day, seat: seat, client: client, email: email });
    await newSeat.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/seats/:id', async (req, res) => {
  try {
    const dep = await(Seat.findById(req.params.id));
    if(dep) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;