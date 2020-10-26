const express = require('express');
const router = express.Router();
const TestimonialController = require('../controllers/testimonials.controller');

router.get('/testimonials', TestimonialController.getAll);
router.get('/testimonials/random', TestimonialController.getRandom);//random musi być przed nast. adresem czyli :id.
router.get('/testimonials/:id', TestimonialController.getById);
router.put('/testimonials/:id', TestimonialController.put);
router.post('/testimonials', TestimonialController.post);
router.delete('/testimonials/:id', TestimonialController.delete);

module.exports = router;