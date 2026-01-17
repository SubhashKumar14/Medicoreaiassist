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

      // Transform API response to UI model if needed
      // Assuming data.analysis is the JSON or structured object
      const result = data.analysis || {
        fileName: selectedFile.name,
        uploadDate: new Date(),
        aiSummary: data.summary || "Analysis complete. Please review with a medical professional.",
        abnormalValues: data.abnormalities || [], // Expecting backend to provide this
        normalValues: [], // Optional
        recommendations: data.recommendations || ["Consult a doctor"]
      };

      // If backend returns flat text, might need parsing, but assuming JSON for now as per design

      setAnalysisResults({
        ...result,
        fileName: selectedFile.name,
        uploadDate: new Date()
      });

      sessionStorage.setItem("aiChatContext", JSON.stringify({
        source: "report-analyzer",
        fileName: selectedFile.name,
        hasAbnormalities: (result.abnormalValues?.length || 0) > 0
      }));
      sessionStorage.setItem("reportAnalysisComplete", "true");
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
                  <p className="text-sm text-gray-500">
                    Blood tests, X-rays, MRI scans, prescriptions, etc.
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-6 flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-cyan-600" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : "Analyze Report"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          { /* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold mb-1">Quick Analysis</h3>
                <p className="text-sm text-gray-600">Get results in under 2 minutes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-1">Abnormality Detection</h3>
                <p className="text-sm text-gray-600">AI highlights concerning values</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-1">Expert Recommendations</h3>
                <p className="text-sm text-gray-600">Actionable health insights</p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          { /* Analysis Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Analysis Complete</CardTitle>
                  <CardDescription>
                    {analysisResults.fileName} • Analyzed on{" "}
                    {analysisResults.uploadDate.toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setAnalysisResults(null)}>
                  Upload New Report
                </Button>
              </div>
            </CardHeader>
          </Card>

          { /* AI Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">AI Analysis Summary</h3>
                  <p className="text-sm text-blue-800">{analysisResults.aiSummary}</p>
                  <p className="text-xs text-blue-700 mt-2">
                    📋 This analysis is based on pattern recognition and should be reviewed with a doctor
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          { /* Abnormal Values */}
          {analysisResults.abnormalValues && analysisResults.abnormalValues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Values Requiring Attention
                </CardTitle>
                <CardDescription>
                  AI has identified {analysisResults.abnormalValues.length} parameters outside normal range
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResults.abnormalValues.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{item.parameter}</h4>
                        <p className="text-sm text-gray-600">Normal range: {item.normalRange}</p>
                      </div>
                      <SeverityBadge severity={item.severity} />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Your value:</span>
                        <span className="ml-2 font-semibold text-orange-700">{item.value}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600">
                        {item.trend === "up" ? "\u2191" : "\u2193"}
                        <span>{item.trend === "up" ? "Above" : "Below"} normal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          { /* Normal Values */}
          {analysisResults.normalValues && analysisResults.normalValues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Normal Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {analysisResults.normalValues.map((item, index) => (
                    <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">{item.parameter}</h4>
                      <p className="text-green-700 font-medium">{item.value}</p>
                      <p className="text-xs text-green-600 mt-1">✓ Within normal range</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          { /* Recommendations */}
          {analysisResults.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Suggested next steps based on your results</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResults.recommendations.map((rec, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-700 text-xs font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          { /* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/patient/chat")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Discuss Results with AI
            </Button>
            <Button
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              onClick={() => navigate("/patient/booking")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Doctor Consultation
            </Button>
          </div>

          { /* Next Steps */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-base">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-cyan-600">→</span>
                <span>Save this report for your medical records</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-600">→</span>
                <span>Discuss abnormal values with your doctor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-600">→</span>
                <span>Consider symptom check if experiencing related issues</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
export {
  ReportAnalyzer
};
