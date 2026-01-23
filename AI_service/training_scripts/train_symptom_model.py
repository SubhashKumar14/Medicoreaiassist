
import pandas as pd
import pickle
import os
import json
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# Configuration
BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, '../datasets/Symptomdisease-NLP/Symptom2Disease.csv')
MODEL_SAVE_PATH = os.path.join(BASE_DIR, '../models/medicore_model_v4.pkl') # Aligning with main.py
SYMPTOM_LIST_PATH = os.path.join(BASE_DIR, '../knowledge/symptom_list.json')

def load_data(path):
    print(f"Loading dataset from {path}...")
    try:
        df = pd.read_csv(path)
        if 'label' not in df.columns or 'text' not in df.columns:
            if 'Unnamed: 0' in df.columns:
                 df = df.drop(columns=['Unnamed: 0'])
            return df
        return df[['label', 'text']]
    except FileNotFoundError:
        print(f"Error: File not found at {path}")
        return None

def train_model():
    df = load_data(DATASET_PATH)
    if df is None:
        return

    print(f"Dataset loaded. Shape: {df.shape}")

    # Load controlled vocabulary
    vocab = None
    if os.path.exists(SYMPTOM_LIST_PATH):
        with open(SYMPTOM_LIST_PATH, 'r') as f:
            vocab = json.load(f)
            # Preprocess vocab to match simple tokenization if needed, 
            # but Tfidf will map phrases if we use ngram_range
            print(f"Loaded {len(vocab)} symptoms for controlled vocabulary.")
    else:
        print("Warning: symptom_list.json not found. Training with full vocabulary.")

    X = df['text']
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Vectorizing text with controlled vocabulary...")
    # Using ngram_range=(1,3) to capture "stiff neck", "high fever", etc.
    # vocabulary argument forces the vectorizer to ONLY consider these terms.
    vectorizer = TfidfVectorizer(
        stop_words='english', 
        vocabulary=vocab, 
        ngram_range=(1, 3),
        binary=True # Presence/Absence is more important than TF-IDF frequency for this
    )
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    print("Training Logistic Regression model...")
    clf = LogisticRegression(max_iter=1000, class_weight='balanced') # Balanced for better rare disease detection
    clf.fit(X_train_tfidf, y_train)

    predictions = clf.predict(X_test_tfidf)
    print("Training complete.")
    print(f"Accuracy: {accuracy_score(y_test, predictions)}")
    # print(classification_report(y_test, predictions))

    # Save as Dictionary (mimicking current main.py expectation)
    model_data = {
        'model': clf,
        'vectorizer': vectorizer,
        'label_encoder': None # Not needed as Sklearn handles strings directly
    }

    print(f"Saving model to {MODEL_SAVE_PATH}...")
    with open(MODEL_SAVE_PATH, 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Done.")

if __name__ == "__main__":
    train_model()
