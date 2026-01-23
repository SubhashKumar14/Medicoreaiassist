import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Camera,
  Upload,
  Search,
  AlertTriangle,
  Pill,
  CheckCircle,
  Info,
  ExternalLink
} from "lucide-react";
import { Progress } from "../ui/progress";
import { pillAPI } from "../../lib/api";
import { toast } from "sonner";
import { PillPredictionCard } from "../shared/PillPredictionCard";
function PillIdentifier() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        // Start analysis flow
        startAnalysis(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = (file) => {
    setAnalyzing(true);
    setProgress(0);
    setResults(null);

    // Simulated progress for UX before API call completes
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    performApiAnalysis(file, interval);
  };

  const performApiAnalysis = async (file, interval) => {
    try {
      const data = await pillAPI.identifyPill(file);
      // data contract: { visual_predictions: [], ocr_text: "", final_match: {} }

      clearInterval(interval);
      setProgress(100);

      // Artificial delay to show 100% briefly
      setTimeout(() => {
        setResults(data);
        setAnalyzing(false);
        toast.success("Identification complete");
      }, 500);

    } catch (error) {
      clearInterval(interval);
      console.error("Pill Analysis Error:", error);
      toast.error("Failed to analyze image. Please try again.");
      setAnalyzing(false);
    }
  };

  const clearSelection = () => {
    setUploadedImage(null);
    setSelectedFile(null);
    setResults(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pill Identifier</h1>
        <p className="text-gray-600">Identify pills by image using advanced AI (Visual + Text Verification)</p>
      </div>

      {!results && !analyzing && (
        <Card className="border-2 border-dashed border-gray-200 hover:border-cyan-500 transition-all hover:bg-cyan-50/20 cursor-pointer" onClick={() => document.getElementById('pill-upload').click()}>
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center animate-bounce-slow">
              <Upload className="w-10 h-10 text-cyan-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Upload Pill Image</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Ensure pill is well-lit and text is visible for best accuracy.
              </p>
            </div>
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
              Select from Device
            </Button>
            <Input
              id="pill-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              onClick={(e) => e.stopPropagation()}
            />
          </CardContent>
        </Card>
      )}

      {analyzing && (
        <Card>
          <CardContent className="py-16 space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold animate-pulse">Scanning Pill...</h3>
              <p className="text-gray-500">Analyzing shape, color, and imprint codes</p>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>Preprocessing</span>
                <span>AI Inference</span>
                <span>Database Match</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="grid md:grid-cols-2 gap-8 items-start animate-in fade-in">
          {/* Left: Input Image */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Your Image</h3>
            <div className="rounded-xl overflow-hidden border shadow-sm">
              <img src={uploadedImage} alt="Uploaded Pill" className="w-full h-auto object-cover" />
            </div>
          </div>

          {/* Right: Prediction Card */}
          <div>
            <PillPredictionCard result={results} onReset={clearSelection} />
          </div>
        </div>
      )}

      {/* Emergency Notice */}
      {!results && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Medical Emergency?</p>
              <p>
                If you suspect poisoning or overdose, call emergency services immediately. Do not rely on this app.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export {
  PillIdentifier
};
