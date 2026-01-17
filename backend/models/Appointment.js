const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be assigned later or via queue
    },
    symptoms: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'moderate', 'high', 'critical'],
        default: 'low'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    triageSessionId: {
        type: String
    },
    scheduledTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
