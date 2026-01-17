const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get System Metrics
// @route   GET /api/admin/metrics
// @access  Private (Admin)
exports.getMetrics = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const patientCount = await User.countDocuments({ role: 'patient' });
        const doctorCount = await User.countDocuments({ role: 'doctor' });
        const appointmentCount = await Appointment.countDocuments();
        const emergencyCount = await Appointment.countDocuments({ severity: 'critical' });

        res.status(200).json({
            patients: patientCount,
            doctors: doctorCount,
            appointments: appointmentCount,
            emergencies: emergencyCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
