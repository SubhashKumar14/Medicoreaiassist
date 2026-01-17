const express = require('express');
const router = express.Router();
const { bookAppointment, getDoctors, getQueue, updateStatus } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/doctors', protect, getDoctors); // Technically user resource but grouped here for convenience
router.post('/book', protect, bookAppointment);
router.get('/queue', protect, getQueue);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
