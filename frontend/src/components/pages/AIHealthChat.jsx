import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Send, Bot, User, AlertCircle, Heart, Activity, Pill } from "lucide-react";
import { AITypingIndicator } from "../shared/AITypingIndicator";
import { chatAPI } from "../../lib/api";
import { toast } from "sonner";

function AIHealthChat() {
  const contextData = JSON.parse(sessionStorage.getItem("aiChatContext") || "{}");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      message: contextData.source === "symptom-checker" ? `Hello! I can see you just completed a symptom check for ${contextData.topCondition}. I'm here to answer any questions about your results or provide more information. How can I help?` : contextData.source === "report-analyzer" ? `Hello! I've reviewed your ${contextData.fileName} analysis. I can discuss the findings and answer questions about your results. What would you like to know?` : "Hello! I'm your AI Health Assistant. I can provide general health information and answer your questions. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // Keep some static info for UI layout if needed, or fetch from AI
  const scrollRef = useRef(null);

  // TODO: Retrieve real user ID from auth context
  // For now using a temporary ID or getting from localStorage if available
  const userId = localStorage.getItem("userId") || "temp_user";
  // We might want to persist conversation ID
  const [conversationId, setConversationId] = useState(localStorage.getItem("currentChatId") || null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsgText = inputMessage;
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: userMsgText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Send to Backend API
      // If we don't have a conversation ID, the backend might assign one or we treat it as new
      const response = await chatAPI.sendMessage(userId, userMessage.message, conversationId);

      // Assuming response structure: { response: "AI text", conversationId: "123" }
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
        localStorage.setItem("currentChatId", response.conversationId);
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        message: response.response, // Adjust based on actual API response
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to get AI response.");
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        message: "I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "What are the symptoms?",
    "How can I treat it?",
    "How to prevent it?",
    "When should I see a doctor?"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        { /* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>AI Health Assistant</CardTitle>
                  <p className="text-sm text-gray-500">
                    {contextData.source === "symptom-checker" ? `Discussing: ${contextData.topCondition} (${contextData.severity} severity)` : contextData.source === "report-analyzer" ? `Discussing: ${contextData.fileName}` : "Ask me anything about your health"}
                  </p>
                </div>
              </div>
            </CardHeader>

            { /* Safety Disclaimer */}
            <div className="px-6 py-3 bg-amber-50 border-b border-amber-200">
              <div className="flex gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>AI provides information only. Not a substitute for professional medical diagnosis or treatment.</span>
              </div>
            </div>

            { /* Messages */}
            <ScrollArea className="h-[calc(100%-16rem)] p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-cyan-600" />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${msg.sender === "user" ? "bg-cyan-600 text-white rounded-2xl rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm"} px-4 py-3`}>
                      {msg.sender === "ai" && msg.id === messages[messages.length - 1].id ? (
                        <Typewriter text={msg.message} />
                      ) : (
                        <p className="text-sm">{msg.message}</p>
                      )}
                      <span className={`text-xs mt-1 block ${msg.sender === "user" ? "text-cyan-100" : "text-gray-500"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && <AITypingIndicator />}
              </div>
            </ScrollArea>

            { /* Quick Questions */}
            <div className="px-6 py-3 border-t">
              <div className="flex gap-2 flex-wrap mb-3">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputMessage(question);
                    }}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            { /* Input Area */}
            <div className="p-6 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your health question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} className="bg-cyan-600 hover:bg-cyan-700">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="text-cyan-900">Health Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-cyan-800">
                <li className="flex items-start gap-2"><span className="text-cyan-600 mt-1">✓</span> Stay hydrated</li>
                <li className="flex items-start gap-2"><span className="text-cyan-600 mt-1">✓</span> Get adequate sleep</li>
                <li className="flex items-start gap-2"><span className="text-cyan-600 mt-1">✓</span> Consult a doctor for persistent symptoms</li>
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// Simple Typewriter Component
function Typewriter({ text }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    setDisplayedText(""); // Reset on new text
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 15); // Adjust speed here (ms)

    return () => clearInterval(timer);
  }, [text]);

  return <p className="text-sm">{displayedText}</p>;
}

export { AIHealthChat };
