const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalDiagnosis: {
        type: Array,
        default: []
    },
    correctDiagnosis: {
        type: String,
        required: true
    },
    symptoms: {
        type: Array,
        required: true
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
