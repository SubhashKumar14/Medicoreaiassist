import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, CheckCircle, Calendar, FileText, Activity } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge"; // Assuming in same folder or adjust import
import { useNavigate } from "react-router-dom";

export function SymptomResultCard({ results }) {
    const navigate = useNavigate();

    if (!results) return null;

    const { diagnosis, triage_level, advice, summary } = results; // Matches backend contract

    // Determine styling based on triage level
    const isEmergency = triage_level?.toLowerCase().includes('emergency') || triage_level?.toLowerCase().includes('critical');
    const isUrgent = triage_level?.toLowerCase().includes('urgent') || triage_level?.toLowerCase().includes('consult');

    return (
        <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">

            {/* Triage Banner */}
            <Card className={`border-l-8 ${isEmergency ? 'border-l-red-600 bg-red-50' : isUrgent ? 'border-l-orange-500 bg-orange-50' : 'border-l-green-500 bg-green-50'}`}>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${isEmergency ? 'bg-red-100 text-red-600' : isUrgent ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                            {isEmergency ? <AlertTriangle className="w-8 h-8" /> : <Activity className="w-8 h-8" />}
                        </div>
                        <div className="space-y-2">
                            <h2 className={`text-2xl font-bold ${isEmergency ? 'text-red-800' : isUrgent ? 'text-orange-800' : 'text-green-800'}`}>
                                {triage_level || "Assessment Complete"}
                            </h2>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                {advice}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Diagnosis List */}
            <Card>
                <CardHeader>
                    <CardTitle>Possible Conditions</CardTitle>
                    <CardDescription>Based on the symptoms you reported</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {diagnosis?.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="font-semibold text-lg text-slate-800">{d.disease || d.Condition}</div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${(d.confidence || parseFloat(d.Probability)) > 0.5 ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {d.confidence ? `${(d.confidence * 100).toFixed(0)}% Match` : d.Probability}
                            </div>
                        </div>
                    ))}
                    {(!diagnosis || diagnosis.length === 0) && (
                        <div className="text-center text-gray-500 py-4">No specific conditions matched.</div>
                    )}
                </CardContent>
            </Card>

            {/* Summary */}
            {summary && (
                <p className="text-sm text-center text-gray-500">
                    Session Summary: {summary}
                </p>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {isUrgent || isEmergency ? (
                    <Button
                        size="lg"
                        className="w-full bg-red-600 hover:bg-red-700 h-16 text-lg shadow-lg shadow-red-200"
                        onClick={() => navigate("/patient/booking")}
                    >
                        <Calendar className="mr-2 h-5 w-5" /> Book Immediate Consultation
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        className="w-full bg-cyan-600 hover:bg-cyan-700 h-16 text-lg"
                        onClick={() => navigate("/patient/booking")}
                    >
                        <Calendar className="mr-2 h-5 w-5" /> Schedule Check-up
                    </Button>
                )}

                <Button variant="outline" size="lg" className="w-full h-16 text-lg" onClick={() => navigate("/patient/report-analyzer")}>
                    <FileText className="mr-2 h-5 w-5" /> Upload Related Reports
                </Button>
            </div>

        </div>
    );
}
