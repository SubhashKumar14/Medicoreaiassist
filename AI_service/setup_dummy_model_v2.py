from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os
import json

KNOW_PATH = "c:/Projects/MediCoreAI_UI-1/AI_service/knowledge"
os.makedirs(KNOW_PATH, exist_ok=True)

# 1. Create a Pipeline (Vectorizer + Classifier)
# This handles text input automatically, fixing the "Expected 2D array" error
model = Pipeline([
    ('vect', CountVectorizer()),
    ('clf', LogisticRegression())
])

# Train on dummy text data to establish vocabulary and classes
X_train = [
    "headache fever temperature", 
    "stomach pain nausea vomit", 
    "cough sore throat sneeze", 
    "rash itch skin red",
    "chest pain breath shortness"
]
y_train = ["Flu", "Gastritis", "Cold", "Allergy", "Heart Issues_Critical"]

model.fit(X_train, y_train)

# Save the pipeline
joblib.dump(model, os.path.join(KNOW_PATH, "medicore_model_v4.pkl"))

# 2. synonyms.json
synonyms = {
    "headache": ["migraine", "cephalgia"],
    "fever": ["high temperature", "pyrexia"]
}
with open(os.path.join(KNOW_PATH, "synonyms.json"), "w") as f:
    json.dump(synonyms, f)

# 3. medicine_rules.json
rules = {
    "Flu": ["Rest", "Hydration", "Paracetamol"],
    "Gastritis": ["Antacids", "Avoid spicy food"],
    "Cold": ["Warm fluids", "Honey"],
    "Allergy": ["Antihistamines"],
    "Heart Issues_Critical": ["ISEEK IMMEDIATE ATTENTION"]
}
with open(os.path.join(KNOW_PATH, "medicine_rules.json"), "w") as f:
    json.dump(rules, f)

# 4. red_flags.json
red_flags = {
    "symptoms": ["chest pain", "shortness of breath", "unconscious"]
}
with open(os.path.join(KNOW_PATH, "red_flags.json"), "w") as f:
    json.dump(red_flags, f)

print("Mock sklearn Pipeline model created successfully.")
