import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function QuestionCard({ question, onAnswer, isAnalyzing }) {
    if (!question) return null;

    const { text, type, options, id } = question; // { id, text, type: 'yes_no'|'choice'|'text', options: [] }

    const handleOptionClick = (value) => {
        onAnswer(value);
    };

    const [textInput, setTextInput] = React.useState("");

    return (
        <Card className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-center text-slate-800">
                    {text}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Render based on type */}
                {type === 'yes_no' && (
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-24 text-lg border-2 hover:border-cyan-500 hover:bg-cyan-50 transition-all"
                            onClick={() => handleOptionClick('yes')}
                            disabled={isAnalyzing}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-24 text-lg border-2 hover:border-rose-500 hover:bg-rose-50 transition-all"
                            onClick={() => handleOptionClick('no')}
                            disabled={isAnalyzing}
                        >
                            No
                        </Button>
                    </div>
                )}

                {type === 'choice' && options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {options.map((opt, idx) => (
                            <Button
                                key={idx}
                                variant="outline"
                                className="h-auto py-4 text-left justify-start px-6 text-base"
                                onClick={() => handleOptionClick(opt)}
                                disabled={isAnalyzing}
                            >
                                {opt}
                            </Button>
                        ))}
                    </div>
                )}

                {type === 'text' && (
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Type your answer here..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            className="min-h-[120px] text-lg"
                            disabled={isAnalyzing}
                        />
                        <Button
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-lg py-6"
                            onClick={() => handleOptionClick(textInput)}
                            disabled={!textInput.trim() || isAnalyzing}
                        >
                            Submit Answer
                        </Button>
                    </div>
                )}

                {/* Fallback for unknown type or default */}
                {!['yes_no', 'choice', 'text'].includes(type) && (
                    <div className="text-center text-gray-500">
                        <p>Use the chat input to answer.</p>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
