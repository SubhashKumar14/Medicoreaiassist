const express = require("express");
const router = express.Router();
const DoctorOverride = require("../models/DoctorOverride");
const { protect, authorize } = require("../middleware/authMiddleware");

// @desc    Submit Doctor Override
// @route   POST /api/doctor/override
// @access  Private (Doctor only)
router.post("/override", protect, authorize('doctor'), async (req, res) => {
    try {
        const {
            patientId,
            sessionId, // Link to the TriageSession
            aiDiagnosis,
            doctorDiagnosis,
            overrideReason,
            severity
        } = req.body;

        if (!overrideReason || overrideReason.length < 10) {
            return res.status(400).json({
                error: "Override reason required (min 10 chars)"
            });
        }

        const record = await DoctorOverride.create({
            doctorId: req.user.id,
            patientId,
            sessionId,
            aiDiagnosis,
            doctorDiagnosis,
            overrideReason,
            severity
        });

        res.status(201).json({ success: true, record });
    } catch (error) {
        console.error("Doctor Override Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
