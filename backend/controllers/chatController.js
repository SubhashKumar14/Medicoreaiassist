const axios = require('axios');
const Chat = require('../models/Chat');
const AIConfig = require('../models/AIConfig');
const TriageSession = require('../models/TriageSession');

async function getAIConfig() {
    const config = await AIConfig.findOne().sort({ version: -1 });
    return config || { aiChat: { enabled: true, disableOnCritical: true } };
}

exports.sendMessage = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        const config = await getAIConfig();

        if (!config.aiChat.enabled) {
            return res.json({
                reply: "AI chat is currently disabled by system administrators.",
                sender: "ai"
            });
        }

        let contextSystemPrompt = "You are a helpful medical assistant. You provide educational information ONLY. Do NOT diagnose or prescribe.";

        if (sessionId) {
            const session = await TriageSession.findById(sessionId);
            if (session) {
                if (session.severity === 'critical' && config.aiChat.disableOnCritical) {
                    return res.json({
                        reply: "This situation requires immediate medical attention. AI Chat is disabled for safety.",
                        blocked: true,
                        sender: "ai"
                    });
                }
                const conditions = session.aiPredictions.map(c => `${c.disease} (${c.confidence})`).join(", ");
                contextSystemPrompt += `Context: User is undergoing triage. Suspected conditions: ${conditions}. Severity: ${session.severity}. Confirmed symptoms: ${session.symptomsConfirmed.join(", ")}.`;
            }
        }

        let aiResponse = "";
        const systemPrompt = contextSystemPrompt;
        const geminiKey = process.env.GEMINI_API_KEY;
        const openRouterKey = process.env.OPENROUTER_API_KEY;

        if (geminiKey) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
                const response = await axios.post(url, {
                    contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:` }] }]
                }, { headers: { 'Content-Type': 'application/json' } });
                aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch (err) {
                console.error("Gemini Error:", err.message);
            }
        }

        if (!aiResponse && openRouterKey) {
            try {
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: 'google/gemini-2.0-flash-exp:free',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ]
                }, {
                    headers: { 'Authorization': `Bearer ${openRouterKey}`, 'HTTP-Referer': 'http://medicore.ai' }
                });
                aiResponse = response.data?.choices?.[0]?.message?.content;
            } catch (err) {
                console.error("OpenRouter Error:", err.message);
            }
        }

        if (!aiResponse) {
            aiResponse = "I apologize, I cannot connect to my medical knowledge base right now. Please consult a doctor.";
        }

        res.json({
            reply: aiResponse,
            sender: "ai",
            disclaimer: true
        });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ message: "Chat Service Error" });
    }
};

exports.getChatHistory = async (req, res) => {
    res.json([]);
};
