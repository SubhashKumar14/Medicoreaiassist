
import pytesseract
import re
import cv2
import numpy as np
from pdf2image import convert_from_path
try:
    from PIL import Image
except ImportError:
    import Image

class MedicalReportAnalyzer:
    def __init__(self):
        # Configuration: The 'Knowledge Base' of the analyzer
        # Format: "Test Name": {"regex": pattern, "min": low_val, "max": high_val, "unit": unit}
        self.rules = {
            "Hemoglobin": {"regex": r"Hemoglobin.*?([\d\.]+)", "min": 13.0, "max": 17.0, "unit": "g/dL"},
            "WBC Count": {"regex": r"Total.*?WBC.*?([\d]+)", "min": 4000, "max": 11000, "unit": "cells/cmm"},
            "RBC Count": {"regex": r"RBC.*?Count.*?([\d\.]+)", "min": 4.5, "max": 5.5, "unit": "mill/cmm"},
            "Platelets": {"regex": r"Platelet.*?([\d]+)", "min": 150000, "max": 450000, "unit": "cells/cmm"},
            "Hematocrit": {"regex": r"Hematocrit.*?([\d\.]+)", "min": 40, "max": 50, "unit": "%"},
            "MCV": {"regex": r"MCV.*?([\d\.]+)", "min": 80, "max": 100, "unit": "fL"},
            "Glucose (Fasting)": {"regex": r"Glucose.*?Fasting.*?([\d]+)", "min": 70, "max": 100, "unit": "mg/dL"},
            "Glucose (PP)": {"regex": r"Glucose.*?PP.*?([\d]+)", "min": 90, "max": 140, "unit": "mg/dL"},
            "Cholesterol": {"regex": r"Cholesterol.*?Total.*?([\d]+)", "min": 0, "max": 200, "unit": "mg/dL"},
            "Triglycerides": {"regex": r"Triglycerides.*?([\d]+)", "min": 0, "max": 150, "unit": "mg/dL"},
            "Creatinine": {"regex": r"Creatinine.*?([\d\.]+)", "min": 0.7, "max": 1.3, "unit": "mg/dL"}
        }

    def _preprocess_image(self, image):
        # Convert to grayscale and threshold to improve OCR accuracy
        gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
        # Apply binary thresholding (make text black, background white)
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
        return thresh

    def extract_text(self, file_path):
        # Detect if PDF or Image
        full_text = ""
        try:
            if file_path.lower().endswith('.pdf'):
                images = convert_from_path(file_path)
                for img in images:
                    processed_img = self._preprocess_image(img)
                    full_text += pytesseract.image_to_string(processed_img) + "\n"
            else:
                img = Image.open(file_path)
                processed_img = self._preprocess_image(img)
                full_text += pytesseract.image_to_string(processed_img)
            
            return full_text
        except Exception as e:
            return f"Error reading file: {str(e)}"

    def analyze(self, file_path):
        text = self.extract_text(file_path)
        if text.startswith("Error"):
            return {"error": text}

        results = {
            "raw_text_snippet": text[:300] + "...", # For debugging
            "extracted_vitals": [],
            "alerts": []
        }

        # Apply Rules
        for test_name, rule in self.rules.items():
            # Regex Search (Case Insensitive)
            match = re.search(rule["regex"], text, re.IGNORECASE | re.DOTALL)
            if match:
                try:
                    value = float(match.group(1))
                    status = "Normal"
                    
                    if value < rule["min"]:
                        status = "Low"
                        results["alerts"].append(f"{test_name} is Low ({value} {rule['unit']})")
                    elif value > rule["max"]:
                        status = "High"
                        results["alerts"].append(f"{test_name} is High ({value} {rule['unit']})")
                    
                    results["extracted_vitals"].append({
                        "test": test_name,
                        "value": value,
                        "unit": rule["unit"],
                        "status": status,
                        "reference": f"{rule['min']} - {rule['max']}"
                    })
                except ValueError:
                    continue # Extracted text wasn't a number
        
        return results

# Self-test block
if __name__ == "__main__":
    print("This module is intended to be imported.")
    print("Usage: from medical_report_analyzer import MedicalReportAnalyzer")
