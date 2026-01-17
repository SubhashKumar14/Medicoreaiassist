const axios = require('axios');
const TriageSession = require('../models/TriageSession');
const AIConfig = require('../models/AIConfig');
const User = require('../models/User');

// Helper to get active config
async function getAIConfig() {
    const config = await AIConfig.findOne().sort({ version: -1 });
    return config || {
        symptomChecker: { enabled: true, maxQuestions: 10, confidenceThreshold: 0.8, emergencyThreshold: 0.9 }
    };
}

// @desc    Start Triage Session
// @route   POST /api/triage/start
// @access  Private
exports.startSession = async (req, res) => {
    try {
        const config = await getAIConfig();
        if (!config.symptomChecker.enabled) {
            return res.status(503).json({ error: { code: "AI_DISABLED", message: "Symptom checker temporarily disabled by admin" } });
        }

        // Check for existing active session
        let session = await TriageSession.findOne({
            patientId: req.user.id,
            status: "IN_PROGRESS"
        });

        if (!session) {
            session = await TriageSession.create({
                patientId: req.user.id,
                status: "IN_PROGRESS",
                symptomsConfirmed: [],
                questionsAsked: [],
                aiPredictions: [],
                questionCount: 0
            });
        }

        res.status(200).json({
            sessionId: session._id,
            status: session.status,
            message: 'Session started',
            lastQuestion: session.questionsAsked.length > 0 ? session.questionsAsked[session.questionsAsked.length - 1] : null
        });
    } catch (error) {
        console.error("Start Session Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Symptoms / Answer Question
// @route   POST /api/triage/submit
// @access  Private
exports.submitSymptoms = async (req, res) => {
    try {
        const { sessionId, symptoms } = req.body;
        const config = await getAIConfig();

        if (!config.symptomChecker.enabled) {
            return res.status(503).json({ error: { code: "AI_DISABLED", message: "Symptom checker disabled" } });
        }

        const session = await TriageSession.findById(sessionId);
        if (!session || session.status !== 'IN_PROGRESS') {
            return res.status(404).json({ message: 'Active session not found' });
        }

        // Handle Yes/No context from previous question
        let inputToAI = symptoms;
        let lastQ = session.questionsAsked.length > 0 ? session.questionsAsked[session.questionsAsked.length - 1] : null;

        if (lastQ && (symptoms.toLowerCase() === 'yes' || symptoms.toLowerCase() === 'no')) {
            // If answer is yes/no, we need to associate it with the last question (symptom)
            // But we don't know strictly if lastQuestion was a symptom name.
            // We'll rely on AI being smart enough or we append context: "User has <lastQ>"
            if (symptoms.toLowerCase() === 'yes') {
                inputToAI = lastQ; // Treat as confirming the symptom
            } else {
                inputToAI = ""; // Treat as ignoring/denying
            }
        }

        // 1. Call AI Service
        let payload = {
            text: inputToAI,
            confirmed_symptoms: session.symptomsConfirmed,
            session_id: sessionId
        };

        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict/symptoms`, payload);

        if (!aiResponse.data.success) {
            throw new Error(aiResponse.data.error || "AI Service Failed");
        }

        const aiData = aiResponse.data.data;

        // 2. Update Session State
        session.symptomsConfirmed = [...new Set([...session.symptomsConfirmed, ...aiData.extracted_symptoms])];

        // Update predictions
        let preds = [];
        if (aiData.candidates && aiData.candidates.length > 0) {
            preds = aiData.candidates.map(c => {
                if (typeof c === 'string') return { disease: c, confidence: 0.0 };
                return c;
            });
        }
        session.aiPredictions = preds;
        session.questionCount += 1;

        // 3. Determine Next Step
        const topCandidate = preds[0];
        const isConfident = topCandidate && topCandidate.confidence >= config.symptomChecker.confidenceThreshold;
        const maxQuestionsReached = session.questionCount >= config.symptomChecker.maxQuestions;
        const isEmergency = aiData.red_flags && aiData.red_flags.length > 0;

        let responsePayload = {
            sessionId: session._id,
            status: "IN_PROGRESS",
            identified_symptoms: session.symptomsConfirmed,
            diagnosis: session.aiPredictions
        };

        if (isEmergency) {
            session.status = "ESCALATED";
            session.severity = "critical";
            responsePayload.status = "ESCALATED";
            responsePayload.message = "Critical symptoms detected. Please seek immediate medical attention.";
            responsePayload.red_flags = aiData.red_flags;
        } else if (isConfident || maxQuestionsReached) {
            session.status = "COMPLETED";
            session.completedAt = Date.now();
            responsePayload.status = "COMPLETED";
            responsePayload.message = "Analysis complete.";
            responsePayload.recommendation = "Please consult a doctor for further evaluation.";
        } else {
            // Pick next question
            let nextQ = aiData.next_questions && aiData.next_questions.length > 0 ? aiData.next_questions[0] : null;

            if (nextQ) {
                session.questionsAsked.push(nextQ); // Log specifically what we asked
                responsePayload.next_question = nextQ;
                responsePayload.message = `Do you also experience ${nextQ}?`;
            } else {
                session.status = "COMPLETED";
                responsePayload.status = "COMPLETED";
                responsePayload.message = "Analysis complete.";
            }
        }

        await session.save();
        res.status(200).json(responsePayload);

    } catch (error) {
        console.error("Triage Error:", error);
        res.status(500).json({ message: 'Triage Service Error' });
    }
};

exports.answerQuestion = exports.submitSymptoms;

// @desc    Get Results
// @route   GET /api/triage/results/:sessionId
// @access  Private
exports.getResults = async (req, res) => {
    try {
        const session = await TriageSession.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
