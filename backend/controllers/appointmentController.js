const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book Appointment
// @route   POST /api/appointments/book
// @access  Private
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, symptoms, severity, triageSessionId } = req.body;

        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor: doctorId,
            symptoms,
            severity,
            triageSessionId,
            status: 'pending'
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Available Doctors
// @route   GET /api/doctors
// @access  Private
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('name email');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Patient Queue (Doctor only)
// @route   GET /api/appointments/queue
// @access  Private (Doctor)
exports.getQueue = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Sort by severity (critical > high > moderate > low)
        // We can use a custom sort or just fetch and sort in JS
        const appointments = await Appointment.find({
            doctor: req.user.id,
            status: { $ne: 'completed' }
        }).populate('patient', 'name email');

        const severityOrder = { 'critical': 0, 'high': 1, 'moderate': 2, 'low': 3 };

        appointments.sort((a, b) => {
            return severityOrder[a.severity] - severityOrder[b.severity];
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Appointment Status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
exports.updateStatus = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = req.body.status;
        await appointment.save();

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
