const Report = require('../models/Report');
const AIConfig = require('../models/AIConfig'); // Added Import
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// @desc    Upload and Analyze Report
// @route   POST /api/reports/upload
// @access  Private
exports.uploadReport = async (req, res) => {
    try {
        // Governance Check
        const config = await AIConfig.findOne().sort({ version: -1 });
        if (config && !config.reportAnalyzer.enabled) {
            if (req.file) fs.unlinkSync(req.file.path); // Cleanup
            return res.status(503).json({ error: { code: "AI_DISABLED", message: "Report Analyzer temporarily disabled" } });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, path: filePath, filename } = req.file;

        // 1. Save metadata to DB
        const report = await Report.create({
            user: req.user.id,
            filename: originalname,
            path: filePath
        });

        // 2. Call AI Service for Analysis
        // We need to send the file to the AI service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // Fix for Axios headers with FormData
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/analyze_report`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // 3. Transform Data for Frontend
        const responseBody = aiResponse.data; // { success: true, data: { findings: [], raw_text: "" } }
        const aiData = responseBody.data || {}; // Inner data object

        const abnormalValues = [];
        const normalValues = [];
        const recommendations = [];

        // Map 'findings' (AI Service) to 'extracted' dictionary for O(1) access in UI
        const vitals = aiData.findings || [];
        const extracted = {};

        vitals.forEach(vital => {
            // Standardize format
            extracted[vital.test] = {
                value: vital.value,
                unit: vital.unit || "",
                status: (vital.status || "NORMAL").toUpperCase(),
                reference: vital.reference || ""
            };

            const item = {
                parameter: vital.test,
                value: `${vital.value} ${vital.unit || ''}`,
                normalRange: vital.reference,
                severity: (vital.status || '').toLowerCase() === 'normal' ? 'low' : 'high',
                trend: (vital.status || '').toLowerCase() === 'low' ? 'down' : 'up' // Simplified trend logic
            };

            if (item.severity === 'high') {
                abnormalValues.push(item);
                recommendations.push(`Consult doctor regarding abnormal ${vital.test} levels.`);
            } else {
                normalValues.push(item);
            }
        });

        if (recommendations.length === 0) {
            recommendations.push("Maintain healthy lifestyle.", "Regular checkups.");
        }

        const formattedAnalysis = {
            summary: aiData.raw_text ? `Analyzed content from ${originalname}. Found ${abnormalValues.length} abnormal values.` : "Report analyzed.",
            abnormalities: abnormalValues,
            normalValues: normalValues,
            recommendations: recommendations,
            extracted: extracted, // <--- New Data-Driven Contract
            raw_text: aiData.raw_text
        };

        report.analysis = formattedAnalysis;
        await report.save();

        // 4. Cleanup Temp File
        fs.unlinkSync(filePath);

        res.status(200).json(report);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Report Analysis Failed' });
    }
};

// @desc    Get Report Details
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });
        if (report.user.toString() !== req.user.id && req.user.role !== 'doctor') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Reports for User
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
