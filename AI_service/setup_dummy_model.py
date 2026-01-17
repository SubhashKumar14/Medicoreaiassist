import os
import json
import joblib
import pickle

KNOW_PATH = "c:/Projects/MediCoreAI_UI-1/AI_service/knowledge"
os.makedirs(KNOW_PATH, exist_ok=True)

# 1. Create Mock Model (dict with predict function simulation)
# We can't pickle a lambda easily so we'll just pickle a dummy class
class MockModel:
    def predict(self, X):
        return ["Migraine"] * len(X)
    def predict_proba(self, X):
        # Return probability [0.9, 0.1]
        return [[0.9, 0.1]] * len(X)
    @property
    def classes_(self):
        return ["Migraine", "Other"]

model_data = {
    'model': MockModel(),
    'vectorizer': None, 
    'label_encoder': None
}

with open(os.path.join(KNOW_PATH, "medicore_model_v4.pkl"), "wb") as f:
    joblib.dump(model_data, f)

# 2. synonyms.json
synonyms = {
    "headache": ["migraine", "cephalgia"],
    "fever": ["high temperature", "pyrexia"]
}
with open(os.path.join(KNOW_PATH, "synonyms.json"), "w") as f:
    json.dump(synonyms, f)

# 3. medicine_rules.json
rules = {
    "interactions": [],
    "contraindications": []
}
with open(os.path.join(KNOW_PATH, "medicine_rules.json"), "w") as f:
    json.dump(rules, f)

# 4. red_flags.json
red_flags = {
    "symptoms": ["chest pain", "shortness of breath", "unconscious"]
}
with open(os.path.join(KNOW_PATH, "red_flags.json"), "w") as f:
    json.dump(red_flags, f)

print("Mock knowledge, model, and rules created successfully.")
