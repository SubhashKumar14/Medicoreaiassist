
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
        # KNOWLEDGE BASE: Standard Ranges
        self.tests = {
            "Hemoglobin": {"pattern": r"Hemoglobin.*?([\d\.]+)", "min": 13.5, "max": 17.5, "unit": "g/dL"},
            "WBC": {"pattern": r"Total.*?Leucocyte.*?([\d]+)", "min": 4000, "max": 11000, "unit": "cumm"},
            "RBC": {"pattern": r"RBC.*?Count.*?([\d\.]+)", "min": 4.5, "max": 5.9, "unit": "mill/cumm"},
            "Platelets": {"pattern": r"Platelet.*?Count.*?([\d]+)", "min": 150000, "max": 450000, "unit": "cumm"},
            "Glucose (Fasting)": {"pattern": r"Fasting.*?Sugar.*?([\d]+)", "min": 70, "max": 110, "unit": "mg/dL"},
            "Creatinine": {"pattern": r"Creatinine.*?([\d\.]+)", "min": 0.6, "max": 1.2, "unit": "mg/dL"},
            "Cholesterol": {"pattern": r"Total.*?Cholesterol.*?([\d]+)", "min": 0, "max": 200, "unit": "mg/dL"}
        }

    def _ocr(self, file_path):
        # Handle PDF vs Image
        text = ""
        try:
            if file_path.endswith('.pdf'):
                pages = convert_from_path(file_path)
                for page in pages:
                    # Grayscale for accuracy
                    page = cv2.cvtColor(np.array(page), cv2.COLOR_RGB2GRAY)
                    text += pytesseract.image_to_string(page)
            else:
                img = cv2.imread(file_path, 0) # Load as grayscale
                text = pytesseract.image_to_string(img)
        except Exception as e:
            return ""
        return text

    def analyze(self, file_path):
        raw_text = self._ocr(file_path)
        if not raw_text: return {"error": "Could not read file."}

        findings = []
        alerts = []
        
        for name, config in self.tests.items():
            # Robust Regex Search
            match = re.search(config['pattern'], raw_text, re.IGNORECASE | re.DOTALL)
            if match:
                val = float(match.group(1))
                status = "Normal"
                
                if val < config['min']: 
                    status = "Low"
                    alerts.append(f"{name} is Low")
                elif val > config['max']: 
                    status = "High"
                    alerts.append(f"{name} is High")
                
                findings.append({
                    "test": name,
                    "value": val,
                    "unit": config['unit'],
                    "status": status,
                    "range": f"{config['min']}-{config['max']}"
                })
        
        return {"extracted_data": findings, "alerts": alerts}
