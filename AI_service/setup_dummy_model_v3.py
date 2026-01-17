from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os
import json

KNOW_PATH = "c:/Projects/MediCoreAI_UI-1/AI_service/knowledge"
os.makedirs(KNOW_PATH, exist_ok=True)
MODEL_FILE = os.path.join(KNOW_PATH, "medicore_model_v4.pkl")

# Force delete existing to ensure clean slate
if os.path.exists(MODEL_FILE):
    os.remove(MODEL_FILE)

# 1. Create a Pipeline (Vectorizer + Classifier)
print("Creating Pipeline...")
model = Pipeline([
    ('vect', CountVectorizer()),
    ('clf', LogisticRegression())
])

# Train on richer dummy data to support dynamic questions
# Symptoms associated with diseases
X_train = [
    "headache fever temperature light_sensitivity", # Migraine/Flu
    "stomach pain nausea vomit indigestion", # Gastritis
    "cough sore throat sneeze runny nose", # Cold
    "rash itch skin red swelling", # Allergy
    "chest pain breath shortness sweating arm_pain", # Heart Issue
    "headache nausea vision_blur", # Migraine
    "fever cough fatigue body_pain", # Flu
    "stomach_pain diarrhea fever", # Gastroenteritis
]
y_train = [
    "Migraine", 
    "Gastritis", 
    "Cold", 
    "Allergy", 
    "Heart Issues_Critical",
    "Migraine",
    "Flu",
    "Gastroenteritis"
]

model.fit(X_train, y_train)

# Save the pipeline
print(f"saving model type: {type(model)}")
joblib.dump(model, MODEL_FILE)
print("Model saved.")

# 2. synonyms.json
synonyms = {
    "headache": ["migraine", "cephalgia", "head pain"],
    "fever": ["high temperature", "pyrexia", "hot"],
    "stomach pain": ["abdominal pain", "belly ache", "stomach ache"],
    "nausea": ["feeling sick", "queasy"],
    "chest pain": ["thoracic pain", "angina"],
    "sore throat": ["throat pain", "pharyngitis"]
}
with open(os.path.join(KNOW_PATH, "synonyms.json"), "w") as f:
    json.dump(synonyms, f)

# 3. medicine_rules.json
rules = {
    "Migraine": ["Rest in dark room", "Hydration", "Pain relievers"],
    "Flu": ["Rest", "Hydration", "Paracetamol", "Monitor temperature"],
    "Gastritis": ["Antacids", "Avoid spicy food", "Bland diet"],
    "Cold": ["Warm fluids", "Honey", "Rest"],
    "Allergy": ["Antihistamines", "Avoid allergen"],
    "Heart Issues_Critical": ["CALL EMERGENCY SERVICES", "Do not drive yourself", "Chew aspirin if advised"],
    "Gastroenteritis": ["Oral rehydration salts", "Small sips of water"]
}
with open(os.path.join(KNOW_PATH, "medicine_rules.json"), "w") as f:
    json.dump(rules, f)

# 4. red_flags.json
red_flags = {
    "chest pain": "Possible heart attack",
    "breath shortness": "Respiratory distress",
    "unconscious": "Loss of consciousness",
    "vision_blur": "Neurological warning",
    "sweating": "With chest pain, possible cardiac event"
}
with open(os.path.join(KNOW_PATH, "red_flags.json"), "w") as f:
    json.dump(red_flags, f)

print("Mock sklearn Pipeline model and knowledge base created successfully.")
