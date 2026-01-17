const mongoose = require("mongoose");

const TriageSessionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["IN_PROGRESS", "COMPLETED", "ESCALATED", "ABANDONED"],
        default: "IN_PROGRESS"
    },

    symptomsConfirmed: [String],

    questionsAsked: [String],

    aiPredictions: [
        {
            disease: String,
            confidence: Number
        }
    ],

    severity: {
        type: String,
        enum: ["low", "moderate", "high", "critical"]
    },

    questionCount: {
        type: Number,
        default: 0
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    completedAt: Date
});

module.exports = mongoose.model("TriageSession", TriageSessionSchema);
