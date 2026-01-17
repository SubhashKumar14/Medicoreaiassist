# ai_service/main.py
# Single-file FastAPI AI microservice (symptom triage, pill id, report OCR)
# Drop into your ai_service/ folder and run with uvicorn main:app --port 8000

import os
import time
import json
import joblib
import uvicorn
import traceback
from typing import List, Dict, Optional
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import defaultdict
import numpy as np

# Optional heavy imports guarded for environments without GPU / heavy libs
try:
    from PIL import Image
except Exception:
    Image = None

try:
    import torch
    from torchvision import transforms
except Exception:
    torch = None

# Optional Tesseract (report OCR)
try:
    import pytesseract
    import cv2
except Exception:
    pytesseract = None
    cv2 = None

# ----------------------------
# Config and paths
# ----------------------------
BASE_DIR = os.path.dirname(__file__)
KNOW_PATH = os.path.join(BASE_DIR, "knowledge")
MODEL_PATH = os.path.join(BASE_DIR, "models")
os.makedirs(KNOW_PATH, exist_ok=True)
os.makedirs(MODEL_PATH, exist_ok=True)

# ----------------------------
# Utilities
# ----------------------------
def safe_load_json(p):
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def safe_read_csv(p):
    import pandas as pd
    if os.path.exists(p):
        return pd.read_csv(p)
    return None

# ----------------------------
# InferenceEngine (Pickle Model)
# ----------------------------
class InferenceEngine:
    """
    Inference engine using trained Scikit-learn model (medicore_model_v4.pkl)
    """
    def __init__(self, model_path=None, synonyms_path=None, medicine_rules=None, red_flags=None):
        self.model_path = model_path or os.path.join(KNOW_PATH, "medicore_model_v4.pkl")
        self.synonyms_path = synonyms_path or os.path.join(KNOW_PATH, "synonyms.json")
        self.medicine_rules = safe_load_json(medicine_rules or os.path.join(KNOW_PATH, "medicine_rules.json"))
        self.red_flags = safe_load_json(red_flags or os.path.join(KNOW_PATH, "red_flags.json"))
        self.synonyms = safe_load_json(self.synonyms_path)
        
        self.model = None
        self.vectorizer = None
        self.label_encoder = None
        self._load_model()
        self.symptom_cols = self.get_all_symptoms() # For normalization compatibility

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                # Using 'joblib' to load the pickle
                data = joblib.load(self.model_path)
                
                # Assume the pickle contains a dict with model components
                if hasattr(data, 'predict'): 
                    self.model = data
                    print("Loaded model as direct pipeline/classifier")
                elif isinstance(data, dict):
                    self.model = data.get('model') or data.get('classifier')
                    self.vectorizer = data.get('vectorizer')
                    self.label_encoder = data.get('label_encoder')
                    print(f"Loaded dict model with keys: {data.keys()}")
                else:
                    self.model = data
                    print(f"Loaded model of type {type(data)}")
                    
            else:
                print(f"Model file not found at {self.model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            traceback.print_exc()

    def get_all_symptoms(self):
        if self.vectorizer and hasattr(self.vectorizer, 'get_feature_names_out'):
            return list(self.vectorizer.get_feature_names_out())
        return []

    def normalize_text(self, text: str) -> List[str]:
        # Simple extraction for now - could be improved with Named Entity Recognition (NER)
        # or just simple keyword matching from synonyms
        if not text: return []
        text_low = text.lower()
        found = set()
        
        # Keyword matching
        for canon, variants in self.synonyms.items():
            for v in variants + [canon]:
                if v in text_low:
                    found.add(canon)
        
        return list(found)

    def start_session(self, text: str, confirmed_symptoms: Optional[List[str]] = None):
        extracted = self.normalize_text(text)
        if confirmed_symptoms:
            extracted = list(set(extracted + confirmed_symptoms))
            
        results = self.predict(extracted)
        top_disease = results[0]['disease'] if results else "Unknown"
        confidence = results[0]['confidence'] if results else 0.0
        
        # Next question logic - dynamic based on model coefficients
        next_questions = []
        try:
            # Check if we have a pipeline with a linear classifier
            if self.model and hasattr(self.model, 'named_steps') and 'clf' in self.model.named_steps:
                clf = self.model.named_steps['clf']
                vect = self.model.named_steps['vect']
                
                # Get index of top disease
                classes = list(clf.classes_)
                if top_disease in classes:
                    class_idx = classes.index(top_disease)
                    
                    # Get coefficients for this class
                    if hasattr(clf, 'coef_'):
                        # shape (n_classes, n_features) or (1, n_features) for binary
                        coefs = clf.coef_[class_idx] if clf.coef_.shape[0] > 1 else clf.coef_[0]
                        feature_names = vect.get_feature_names_out()
                        
                        # Pair feature with coef
                        feat_imp = zip(feature_names, coefs)
                        # Sort by importance (descending)
                        sorted_feats = sorted(feat_imp, key=lambda x: x[1], reverse=True)
                        
                        # Find top features not yet confirmed/extracted
                        for feat, score in sorted_feats:
                            if feat not in extracted and score > 0:
                                next_questions.append(feat)
                                if len(next_questions) >= 3: break
        except Exception as e:
            print(f"Error generating next questions: {e}")

        meds = self.medicine_rules.get(top_disease, {})
        red_alerts = [self.red_flags[s] for s in extracted if s in self.red_flags]

        return {
            "extracted_symptoms": extracted,
            "posterior": [], # Not used in pickle model
            "candidates": [r['disease'] for r in results],
            "next_questions": next_questions,
            "explainability": {},
            "red_flags": red_alerts,
            "top_disease": top_disease,
            "medicines_and_advice": meds,
            "asked": []
        }

    def predict(self, symptoms: List[str], top_k=3):
        if not self.model:
            return [{"disease": "System Error: Model not loaded", "confidence": 0.0}]

        confirmed_text = " ".join(symptoms)
        
        try:
            # Case 1: Model is a Pipeline that handles text
            if hasattr(self.model, 'predict_proba'):
                try:
                    # Some pipelines expect iterator
                    probs = self.model.predict_proba([confirmed_text])[0]
                except:
                     # Fallback if vectorizer is needed manually
                     if self.vectorizer:
                         X = self.vectorizer.transform([confirmed_text])
                         probs = self.model.predict_proba(X)[0]
                     else:
                         raise Exception("Model expects vectorizer but none found")
                
                classes = self.model.classes_
            
            # Case 2: Manual vectorization (dict)
            elif self.vectorizer and self.model:
                X = self.vectorizer.transform([confirmed_text])
                probs = self.model.predict_proba(X)[0]
                classes = self.model.classes_
                
            else:
                return [{"disease": "Configuration Error", "confidence": 0.0}]

            # Process results
            results = []
            for i, p in enumerate(probs):
                if p > 0.01:
                    disease_name = classes[i]
                    results.append({"disease": disease_name, "confidence": float(p)})
            
            results.sort(key=lambda x: x['confidence'], reverse=True)
            return results[:top_k]

        except Exception as e:
            print(f"Prediction error: {e}")
            traceback.print_exc()
            return []

    def handle_answer(self, current_posterior: List[float], symptom: str, answer: bool, asked_list: List[str]):
        # Since we are stateless/model-based, we just add the symptom if yes
        # If no, we might mark it as negative (logic depends on model training)
        # For now, we only add positive symptoms to the text
        
        # This needs the full session context to be re-passed or we assume 'symptom' is added to 'extracted'
        # But this method signature is legacy.
        # We will assume the caller updates state and re-calls predict/start_session logic mechanism.
        
        return {} # Should not be used directly in new flow

# ----------------------------
# Session Manager
# ----------------------------
class SessionManager:
    def __init__(self, ttl_seconds=1800):
        self.sessions = {}  # session_id -> {created, engine_state...}
        self.ttl = ttl_seconds

    def create(self, data):
        sid = str(int(time.time()*1000))  # simple id
        self.sessions[sid] = {"created": time.time(), "data": data}
        return sid

    def get(self, sid):
        item = self.sessions.get(sid)
        if not item:
            return None
        if time.time() - item["created"] > self.ttl:
            del self.sessions[sid]
            return None
        return item["data"]

    def update(self, sid, data):
        if sid in self.sessions:
            self.sessions[sid]["data"] = data
            self.sessions[sid]["created"] = time.time()
            return True
        return False

    def cleanup(self):
        now = time.time()
        for sid, item in list(self.sessions.items()):
            if now - item["created"] > self.ttl:
                del self.sessions[sid]

# ----------------------------
# Simple RedFlagGuard (safety)
# ----------------------------
class RedFlagGuard:
    def __init__(self, red_flags_path=None):
        self.red_flags = safe_load_json(red_flags_path or os.path.join(KNOW_PATH, "red_flags.json"))
    def check(self, symptoms: List[str]):
        alerts = []
        for s in symptoms:
            if s in self.red_flags:
                alerts.append({"symptom": s, "action": self.red_flags[s]})
        return alerts

# ----------------------------
# Pill Model Loader (lightweight)
# ----------------------------
class PillModel:
    def __init__(self):
        # try to load torch model
        self.model = None
        self.labels = None
        # try torch model
        torch_path = os.path.join(MODEL_PATH, "pill_model.pt")
        labels_path = os.path.join(MODEL_PATH, "pill_labels.json")
        if torch and os.path.exists(torch_path):
            try:
                self.model = torch.jit.load(torch_path) if torch.jit.isinstance(torch.jit, object) else torch.load(torch_path, map_location='cpu')
                if os.path.exists(labels_path):
                    self.labels = safe_load_json(labels_path)
            except Exception:
                self.model = None
        # else leave model None (fallback)
    def infer(self, image_bytes):
        # return dummy if not available
        if self.model is None or torch is None:
            return {"pill_name": "Unknown - model missing", "confidence": 0.0}
        try:
            img = Image.open(image_bytes).convert("RGB")
            tf = transforms.Compose([
                transforms.Resize((224,224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
            ])
            x = tf(img).unsqueeze(0)
            self.model.eval()
            with torch.no_grad():
                out = self.model(x)
                probs = torch.softmax(out, dim=1).cpu().numpy()[0]
                idx = int(np.argmax(probs))
                conf = float(probs[idx])
                name = self.labels.get(str(idx), f"class_{idx}") if self.labels else f"class_{idx}"
                return {"pill_name": name, "confidence": conf}
        except Exception as e:
            return {"pill_name":"error","confidence":0.0,"error":str(e)}

# ----------------------------
# FastAPI app + endpoints
# ----------------------------
app = FastAPI(title="MediCore AI Service")

# CORS (allow your Node backend)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# instantiate components
engine = InferenceEngine()
sessions = SessionManager(ttl_seconds=60*60)  # 1 hour default
guard = RedFlagGuard()
pill_model = PillModel()

# Request models
class TriageRequest(BaseModel):
    text: str
    history: Optional[List[str]] = []
    confirmed_symptoms: Optional[List[str]] = []
    session_id: Optional[str] = None
    user_id: Optional[str] = None

@app.get("/health")
async def health():
    return {"ok": True, "uptime": time.time()}

# start triage (creates a session and returns first question and candidates)
@app.post("/predict/symptoms")
async def predict_symptoms(req: TriageRequest):
    try:
        # start session
        result = engine.start_session(req.text, confirmed_symptoms=req.confirmed_symptoms)
        session_data = {
            "text": req.text,
            "extracted": result["extracted_symptoms"],
            "posterior": result["posterior"],
            "asked": result["asked"],
            "candidates": result["candidates"]
        }
        sid = sessions.create(session_data)
        result["session_id"] = sid
        return {"success": True, "data": result}
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": str(e)}

# answer a follow-up question
@app.post("/predict/answer")
async def answer_question(session_id: str = Form(...), symptom: str = Form(...), answer: bool = Form(...)):
    try:
        sdata = sessions.get(session_id)
        if not sdata:
            return {"success": False, "error": "session not found"}
            
        # For pickle model, we just aggregate symptoms and re-predict
        # We need to trust the backend to maintain the list of confirmed symptoms, 
        # or we update the session data here.
        
        extracted = sdata.get("extracted", [])
        if answer:
            extracted.append(symptom)
            
        # Re-predict
        results = engine.predict(extracted)
        top_disease = results[0]['disease'] if results else "Unknown"
        
        # Update session
        sdata.update({"extracted": extracted, "candidates": [r['disease'] for r in results]})
        sessions.update(session_id, sdata)
        
        return {"success": True, "data": {
            "candidates": [r['disease'] for r in results],
            "top_disease": top_disease,
            "next_questions": [] # TODO: Implement next question logic for pickle model
        }}
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": str(e)}

# pill identifier (multipart/form-data)
@app.post("/identify_pill")
async def identify_pill(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        from io import BytesIO
        bio = BytesIO(contents)
        res = pill_model.infer(bio)
        return {"success": True, "data": res}
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": str(e)}

# analyze report (OCR + heuristic parsing)
@app.post("/analyze_report")
async def analyze_report(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        from io import BytesIO
        bio = BytesIO(contents)
        text = ""
        if pytesseract and cv2 and Image:
            # attempt to use OpenCV + pytesseract
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            # simple threshold/denoise
            gray = cv2.medianBlur(gray, 3)
            # Check if pytesseract is executable
            try:
                text = pytesseract.image_to_string(gray)
            except:
                text = "" # Fallback
        else:
            # fallback: try PIL text extraction (very weak)
            if Image:
                img = Image.open(bio)
                try:
                    text = pytesseract.image_to_string(img) if pytesseract else ""
                except Exception:
                    text = ""
        # simple regex examples for Hemoglobin / WBC
        import re
        findings = []
        hb = re.search(r'(hemoglob(in|in|in\.)|hgb)[^\d\n\r]{0,6}(\d+\.?\d*)', text, flags=re.IGNORECASE)
        if hb:
            val = float(hb.group(3))
            ref = "13.5-17.5"  # placeholder
            status = "low" if val < 13.5 else "normal"
            findings.append({"test":"Hemoglobin","value":val,"status":status,"reference":ref})
        # return
        if not findings and not text:
            # Mock fallback for demonstration if OCR is missing
            findings = [
                {"test": "Hemoglobin", "value": 12.5, "status": "low", "reference": "13.5-17.5"},
                {"test": "WBC", "value": 7.5, "status": "normal", "reference": "4.5-11.0"},
                {"test": "Platelets", "value": 250, "status": "normal", "reference": "150-450"}
            ]
            text = "[SIMULATED OCR] Hemoglobin: 12.5 g/dL (Low), WBC: 7.5, Platelets: 250... (OCR unavailable, showing usage demo)"

        return {"success": True, "data": {"raw_text": text[:1000], "findings": findings}}
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": str(e)}

# background cleanup endpoint
@app.post("/admin/cleanup_sessions")
async def cleanup_sessions():
    sessions.cleanup()
    return {"success": True, "count": len(sessions.sessions)}

if __name__ == "__main__":
    # direct run (useful for single-cell)
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT",8000)), reload=True)
