const express = require('express');
const router = express.Router();
const SeatController = require('../controllers/seats.controller');

router.get('/seats', SeatController.getAll);
router.get('/seats/:id', SeatController.getById);
router.put('/seats/:id', SeatController.put);
router.post('/seats', SeatController.post);
router.delete('/seats/:id', SeatController.delete);

module.exports = router;