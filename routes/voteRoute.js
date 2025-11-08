const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

router.post('/toggle/:ideaId', voteController.toggleVote);
router.get('/count/:ideaId', voteController.getVoteCount);

module.exports = router;