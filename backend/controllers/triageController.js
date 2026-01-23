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

        // Return standardized contract
        // Initial state: No question yet, or specific first question "Describe symptoms" handled by frontend?
        // Frontend "Input" step handles the first free-text entry.
        // So we just return success and session ID.
        // If we wanted the AI to start with a question, we'd do it here.

        res.status(200).json({
            session_id: session._id,
            status: session.status,
            message: 'Session started'
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
        const { sessionId, symptoms, answer } = req.body; // 'symptoms' is raw text (start), 'answer' is for specific questions
        const config = await getAIConfig();

        if (!config.symptomChecker.enabled) {
            return res.status(503).json({ error: { code: "AI_DISABLED", message: "Symptom checker disabled" } });
        }

        const session = await TriageSession.findById(sessionId);
        if (!session || session.status !== 'IN_PROGRESS') {
            return res.status(404).json({ message: 'Active session not found' });
        }

        let inputToAI = "";
        let confirmedList = session.symptomsConfirmed || [];

        // Determine input context
        if (symptoms) {
            // Initial free-text symptom description
            inputToAI = symptoms;
        } else if (answer !== undefined) {
            // Answering a specific question
            const lastQ = session.questionsAsked[session.questionsAsked.length - 1];
            if (lastQ) {
                // Logic depends on question type. 
                // For now, our AI only generated "Yes/No" style symptom checks.
                // If answer is "yes" (or true), we append the symptom.
                // If the question was "Do you have X?", lastQ.text might be "Do you have X?" or just "X" (stored id).
                // We need to store the raw symptom ID in questionsAsked to be robust.

                // Backend fix: use symptomId to avoid Mongoose .id virtual conflict
                const symptomId = lastQ.symptomId || lastQ.id || lastQ; // Fallback

                console.log(`[Triage] Answer received for: ${symptomId}, Answer: ${answer}`);

                if (answer === 'yes' || answer === true || answer === 'Yes') {
                    inputToAI = symptomId;
                } else {
                    inputToAI = ""; // Negative answer, don't add to confirmed symptoms
                }
            }
        }

        // 1. Call AI Service
        // AI Service expects: text, confirmed_symptoms (list of strings)
        // It returns: extracted_symptoms, next_questions (candidates)
        let payload = {
            text: inputToAI,
            confirmed_symptoms: confirmedList,
            session_id: sessionId
        };

        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict/symptoms`, payload);

        if (!aiResponse.data.success) {
            throw new Error(aiResponse.data.error || "AI Service Failed");
        }

        const aiData = aiResponse.data.data;

        // 2. Update Session State
        const newSymptoms = aiData.extracted_symptoms || [];
        // Merge uniq
        session.symptomsConfirmed = [...new Set([...confirmedList, ...newSymptoms])];

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
            session_id: session._id,
            status: "IN_PROGRESS"
        };

        // STOP CONDITIONS
        if (isEmergency) {
            session.status = "ESCALATED";
            session.severity = "critical";
            responsePayload.status = "ESCALATED";
            responsePayload.stop_reason = "emergency";
            responsePayload.final_results = {
                triage_level: "Emergency",
                diagnosis: preds,
                advice: "Critical symptoms detected. Seek immediate medical attention.",
                red_flags: aiData.red_flags
            };
        } else if (isConfident || maxQuestionsReached) {
            session.status = "COMPLETED";
            session.completedAt = Date.now();
            responsePayload.status = "COMPLETED";
            responsePayload.stop_reason = isConfident ? "confidence_threshold" : "max_questions";
            responsePayload.final_results = {
                triage_level: "Consultation Recommended",
                diagnosis: preds,
                advice: "Based on your symptoms, we recommend a consultation."
            };
        } else {
            // CONTINUE - NEXT QUESTION
            // AI service returns "next_questions" as list of strings (symptoms to ask about)
            const availableQuestions = aiData.next_questions || [];

            // Filter out questions that have already been asked to prevent looping
            // Check against symptomId
            const alreadyAskedIds = session.questionsAsked.map(q => q.symptomId || q.id || q).filter(Boolean);

            console.log(`[Triage] Already Asked: ${JSON.stringify(alreadyAskedIds)}`);
            console.log(`[Triage] AI Suggested: ${JSON.stringify(availableQuestions)}`);

            const nextSymptom = availableQuestions.find(s => !alreadyAskedIds.includes(s));

            if (nextSymptom) {
                // Construct Dynamic Question Object
                // We default to yes_no for symptom checks, but structure supports others
                const questionObj = {
                    symptomId: nextSymptom, // Symptom key (RENAMED from id)
                    text: `Do you also experience ${nextSymptom.replace(/_/g, ' ')}?`,
                    type: "yes_no",
                    options: ["Yes", "No"]
                };

                // Advanced: if we wanted to ask "How long?" for a specific symptom, we could inject it here
                // e.g. if (nextSymptom === 'fever') { ... type: 'choice', options: ['<1 day', '2-3 days'] ... }

                session.questionsAsked.push(questionObj);
                responsePayload.next_question = questionObj;
            } else {
                // No more questions from AI -> Complete
                session.status = "COMPLETED";
                responsePayload.status = "COMPLETED";
                responsePayload.stop_reason = "no_more_questions";
                responsePayload.final_results = {
                    triage_level: "Self Care",
                    diagnosis: preds,
                    advice: "No specific condition identified. Monitor your symptoms."
                };
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
