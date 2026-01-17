const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadReport, getReport, getReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/upload', protect, upload.single('report'), uploadReport);
router.get('/:id', protect, getReport);
router.get('/', protect, getReports);

module.exports = router;
