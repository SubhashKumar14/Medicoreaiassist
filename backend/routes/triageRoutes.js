const express = require('express');
const router = express.Router();
const { startSession, submitSymptoms, answerQuestion, getResults } = require('../controllers/triageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startSession);
router.post('/submit', protect, submitSymptoms);
router.post('/answer', protect, answerQuestion);
router.get('/results/:sessionId', protect, getResults);

module.exports = router;
