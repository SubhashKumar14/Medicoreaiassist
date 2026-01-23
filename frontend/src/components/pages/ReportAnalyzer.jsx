import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Upload, FileText, AlertTriangle, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import { SeverityBadge } from "../shared/SeverityBadge";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
// ... imports
import { reportAPI } from "../../lib/api";
import { toast } from "sonner";
import { LabTable, StatusBadge } from "../shared/ReportComponents";

function ReportAnalyzer() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size too large. Max 10MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const data = await reportAPI.uploadReport(selectedFile);

      // Backend now returns: { analysis: { extracted: {}, summary: "", abnormalities: [], recommendations: [] } }
      const analysis = data.analysis;

      setAnalysisResults({
        fileName: selectedFile.name,
        uploadDate: new Date(),
        extracted: analysis.extracted,
        aiSummary: analysis.summary,
        abnormalValues: analysis.abnormalities,
        recommendations: analysis.recommendations
      });

      toast.success("Report analysis complete");

    } catch (error) {
      console.error("Report Analysis Error:", error);
      toast.error("Failed to analyze report. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      { /* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Medical Report Analyzer</h1>
        </div>
        <p className="text-gray-600">Upload your medical reports for AI-powered analysis</p>
      </div>

      {!analysisResults ? (
        <>
          { /* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Report</CardTitle>
              <CardDescription>
                Accepted: Blood tests, X-rays, MRI/CT scans, Lab results, Prescriptions • PDF, JPG, PNG (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-cyan-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-6 flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-cyan-600" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Report"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          { /* Analysis Results */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
              <p className="text-slate-500">Analyzed on {analysisResults.uploadDate.toLocaleDateString()}</p>
            </div>
            <Button variant="outline" onClick={() => setAnalysisResults(null)}>
              Upload New Report
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column: Summary & Recs */}
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader><CardTitle className="text-blue-900">AI Summary</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800 leading-relaxed">{analysisResults.aiSummary}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResults.recommendations?.map((rec, index) => (
                      <li key={index} className="flex gap-3 items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Detailed Table */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Lab Values</CardTitle>
                  <CardDescription>Structured data from your report</CardDescription>
                </CardHeader>
                <CardContent>
                  <LabTable extractedData={analysisResults.extracted} />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export {
  ReportAnalyzer
};
