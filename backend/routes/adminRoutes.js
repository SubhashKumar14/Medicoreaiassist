const express = require('express');
const router = express.Router();
const { getMetrics, getUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/metrics', protect, getMetrics);
router.get('/users', protect, getUsers);

module.exports = router;
