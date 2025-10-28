const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');

router.get('/ideas', ideaController.getAllIdeas);
router.get('/ideas', ideaController.saveIdea);
router.get('/ideas/:id', ideaController.updateIdea)

module.exports = router;