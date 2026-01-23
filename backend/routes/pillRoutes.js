const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

// Configure Multer for temp storage
const upload = multer({ dest: 'uploads/' });

// @desc    Identify Pill
// @route   POST /api/pill-identifier/identify
// @access  Private
router.post('/identify', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/identify_pill`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Cleanup
        fs.unlinkSync(req.file.path);

        // Transform response to Data-Driven contract
        const aiData = aiResponse.data.data; // { pill_name: "...", confidence: 0.99 }

        const contract = {
            visual_predictions: [
                {
                    label: aiData.pill_name,
                    confidence: aiData.confidence
                }
            ],
            ocr_text: aiData.pill_name.toUpperCase(), // Mock OCR for now using verified name
            final_match: {
                drug: aiData.pill_name,
                confidence: aiData.confidence
            }
        };

        res.json(contract);

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Pill ID Error:", error.message);
        res.status(500).json({ message: "Pill Identification Service Error" });
    }
});

module.exports = router;
