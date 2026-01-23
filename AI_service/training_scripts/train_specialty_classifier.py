
import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

# Configuration
DATASET_PATH = os.path.join(os.path.dirname(__file__), '../datasets/MedicalTranscriptions/mtsamples.csv')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../specialty_classifier.pkl')
VECTORIZER_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../specialty_vectorizer.pkl')

def train_model():
    print(f"Loading dataset from {DATASET_PATH}...")
    try:
        df = pd.read_csv(DATASET_PATH)
    except FileNotFoundError:
        print(f"Error: File not found at {DATASET_PATH}")
        return

    # Data Cleaning
    print(f"Initial shape: {df.shape}")
    df = df.dropna(subset=['transcription', 'medical_specialty'])
    print(f"Shape after dropping NaNs: {df.shape}")

    # Inspect class distribution
    print("Top 5 Specialties:")
    print(df['medical_specialty'].value_counts().head())

    X = df['transcription']
    y = df['medical_specialty']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Vectorization
    print("Vectorizing text...")
    vectorizer = CountVectorizer(stop_words='english', max_features=10000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Training
    print("Training Naive Bayes classifier...")
    model = MultinomialNB()
    model.fit(X_train_vec, y_train)

    # Evaluation
    predictions = model.predict(X_test_vec)
    print("Training complete.")
    print(f"Accuracy: {accuracy_score(y_test, predictions)}")
    # print(classification_report(y_test, predictions)) # Can be very long if many classes

    # Save
    print(f"Saving model to {MODEL_SAVE_PATH}...")
    with open(MODEL_SAVE_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"Saving vectorizer to {VECTORIZER_SAVE_PATH}...")
    with open(VECTORIZER_SAVE_PATH, 'wb') as f:
        pickle.dump(vectorizer, f)

    print("Done.")

if __name__ == "__main__":
    train_model()
