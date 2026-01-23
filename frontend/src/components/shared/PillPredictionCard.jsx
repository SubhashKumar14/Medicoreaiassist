import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, AlertTriangle, ExternalLink, Info, Pill } from "lucide-react";
import { Button } from "../ui/button";

export function PillPredictionCard({ result, onReset }) {
    if (!result) return null;

    // Contract: { visual_predictions: [], ocr_text: "", final_match: { drug, confidence } }
    const { final_match, ocr_text, visual_predictions } = result;

    const confidencePercent = (final_match.confidence * 100).toFixed(1);
    const isHighConfidence = final_match.confidence > 0.8;
    const isLowConfidence = final_match.confidence < 0.6;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

            {/* Main Prediction */}
            <Card className={`border-t-4 ${isHighConfidence ? 'border-t-cyan-500' : 'border-t-amber-500'}`}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardDescription>Identified Medication</CardDescription>
                            <CardTitle className="text-3xl font-bold mt-2 text-slate-900">
                                {final_match.drug}
                            </CardTitle>
                        </div>
                        <Badge className={`text-lg px-3 py-1 ${isHighConfidence ? 'bg-cyan-600' : 'bg-amber-600'}`}>
                            {confidencePercent}% Match
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* OCR Verification */}
                    {ocr_text && (
                        <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-200">
                            <div className="bg-white p-2 rounded shadow-sm">
                                <span className="text-xs font-mono text-slate-500">OCR TEXT</span>
                                <div className="font-mono font-bold text-slate-700">{ocr_text}</div>
                            </div>
                            {ocr_text.toLowerCase().includes(final_match.drug.toLowerCase().split(' ')[0]) ? (
                                <div className="flex items-center text-green-600 text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 mr-1" /> Verified by Text
                                </div>
                            ) : (
                                <div className="flex items-center text-amber-600 text-sm font-medium">
                                    <AlertTriangle className="w-4 h-4 mr-1" /> Text Mismatch Check
                                </div>
                            )}
                        </div>
                    )}

                    {/* Visual Candidates */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Visual Analysis</h4>
                        <div className="space-y-2">
                            {visual_predictions?.slice(0, 3).map((pred, i) => (
                                <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded">
                                    <span className="flex items-center gap-2">
                                        <Pill className="w-4 h-4 text-slate-400" />
                                        {pred.label}
                                    </span>
                                    <span className="font-mono text-slate-600">{(pred.confidence * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Confidence Warning */}
                    {isLowConfidence && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Confidence is low. Please verify this medication with a pharmacist before use.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Disclaimer */}
                    <Alert className="bg-blue-50 border-blue-200 text-blue-900">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                            AI identification is for reference only. <strong>Always check physical imprint code.</strong>
                        </AlertDescription>
                    </Alert>

                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={onReset}>
                    Scan Another Pill
                </Button>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <ExternalLink className="w-4 h-4 mr-2" /> Drug Details
                </Button>
            </div>

        </div>
    );
}
