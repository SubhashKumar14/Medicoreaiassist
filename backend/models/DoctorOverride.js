const mongoose = require("mongoose");

const DoctorOverrideSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TriageSession",
        required: true
    },

    // AI OUTPUT (READ-ONLY SNAPSHOT)
    aiDiagnosis: [
        {
            disease: String,
            confidence: Number
        }
    ],

    aiConfidenceLevel: {
        type: String,
        enum: ["low", "medium", "high"]
    },

    // DOCTOR DECISION
    doctorDiagnosis: {
        type: String,
        required: true
    },

    overrideReason: {
        type: String,
        required: true,
        minlength: 15
    },

    severity: {
        type: String,
        enum: ["low", "moderate", "high", "critical"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("DoctorOverride", DoctorOverrideSchema);
