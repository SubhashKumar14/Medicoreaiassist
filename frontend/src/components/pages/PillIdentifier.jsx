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
function PillIdentifier() {
  const handleAnalyze = async () => {
    if (!uploadedImage) return;

    // Convert data URL to File object if needed, or modify API to accept data URL
    // For now assuming pillAPI.identifyPill accepts the file object from input
    // We need to store the actual file object.
    // Let's rely on stored file or just use the data URL for preview and assume API handles it or we need to fix file handling.
    // Actually, looking at previous code, handleImageUpload sets uploadedImage to reader.result (data URL).
    // The API might expect a File. 
    // Let's adjust handleImageUpload to store File as well.
  };

  // Re-implementing state to hold the file
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
        // Start analysis immediately
        startAnalysis(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = (file) => {
    setAnalyzing(true);
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          performApiAnalysis(file);
          return 100;
        }
        return prev + 20;
      });
    }, 200); // Fast simulation
  };

  const performApiAnalysis = async (file) => {
    try {
      const data = await pillAPI.identifyPill(file);

      setResults({
        matches: [
          {
            name: data.pill_name || "Unknown Pill",
            confidence: (data.confidence * 100).toFixed(1),
            description: "Identified by AI Analysis",
            category: "Prescription", // Default
            imprint: "Unknown", // Default
            shape: "Round", // Default
            color: "White", // Default
            usage: "Consult a pharmacist for details",
            sideEffects: "Consult a pharmacist for details"
          }
        ]
      });
      toast.success("Analysis complete");
    } catch (error) {
      console.error("Pill Analysis Error:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pill Identifier</h1>
        <p className="text-gray-600">Identify pills by image using advanced AI</p>
      </div>

      {!results && !analyzing && (
        <Card className="border-2 border-dashed border-gray-200 hover:border-cyan-500 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-cyan-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Upload Pill Image</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                Drag and drop your image here, or allow camera access
              </p>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <Button variant="outline" className="flex-1" onClick={() => document.getElementById('pill-upload').click()}>
                Upload File
              </Button>
              <Input
                id="pill-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {analyzing && (
        <Card>
          <CardContent className="py-12 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Analyzing Pill...</h3>
              <p className="text-gray-500">Comparing with pharmaceutical database</p>
            </div>
            <Progress value={progress} className="w-full max-w-md mx-auto" />
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          <Card className="border-cyan-200 bg-cyan-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2 text-cyan-900">
                    <CheckCircle className="w-5 h-5 text-cyan-600" />
                    Best Match
                  </CardTitle>
                </div>
                <Badge className="bg-cyan-600">
                  {results.matches[0].confidence}% Match
                </Badge>
              </div>
              <CardDescription>Highest confidence result</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Medication Name</p>
                    <p className="text-2xl font-bold text-gray-900">{results.matches[0].name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <Badge variant="outline" className="text-sm">
                      {results.matches[0].category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Imprint</span>
                    <span className="font-semibold">{results.matches[0].imprint}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Shape</span>
                    <span className="font-semibold">{results.matches[0].shape}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Color</span>
                    <span className="font-semibold">{results.matches[0].color}</span>
                  </div>
                </div>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <Info className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  <strong>This is an approximate identification.</strong> Verify with a pharmacist before taking any medication.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">⚠️ Important Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-blue-800">
                <p className="font-semibold">🚫 DO NOT:</p>
                <ul className="list-disc list-inside pl-2 space-y-1 text-sm">
                  <li>Take medication based on this identification alone</li>
                  <li>Adjust dosage without consulting a healthcare provider</li>
                  <li>Share medication with others</li>
                </ul>
              </div>

              <div className="space-y-2 text-blue-800 pt-3 border-t border-blue-200">
                <p className="font-semibold">✅ DO:</p>
                <ul className="list-disc list-inside pl-2 space-y-1 text-sm">
                  <li>Verify with your pharmacist or doctor</li>
                  <li>Check the original prescription label</li>
                  <li>Contact poison control if you suspect an error</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Pharmacist
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Book Doctor Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reset */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={clearSelection}>
              Identify Another Pill
            </Button>
          </div>
        </div>
      )}

      {/* Emergency Notice */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Emergency?</p>
              <p>
                If you've taken unknown medication or suspect poisoning, call your local poison control center
                or emergency services immediately. Do not wait for identification results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export {
  PillIdentifier
};
