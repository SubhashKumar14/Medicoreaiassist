const mongoose = require("mongoose");

const AIConfigSchema = new mongoose.Schema({
    version: {
        type: Number,
        required: true
    },

    symptomChecker: {
        enabled: { type: Boolean, default: true },
        minQuestions: { type: Number, default: 3 },
        maxQuestions: { type: Number, default: 10 },
        confidenceThreshold: { type: Number, default: 0.8 },
        emergencyThreshold: { type: Number, default: 0.9 }
    },

    aiChat: {
        enabled: { type: Boolean, default: true },
        disableOnCritical: { type: Boolean, default: true },
        allowedModels: [String]
    },

    pillIdentifier: {
        enabled: { type: Boolean, default: true },
        confidenceThreshold: { type: Number, default: 0.85 }
    },

    reportAnalyzer: {
        enabled: { type: Boolean, default: true }
    },

    updatedBy: {
        type: String
    },

    reason: {
        type: String
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("AIConfig", AIConfigSchema);
