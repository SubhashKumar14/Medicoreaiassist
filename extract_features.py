
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import json
import os

# Load Data
csv_path = 'AI_service/datasets/Symptomdisease-NLP/Symptom2Disease.csv'
df = pd.read_csv(csv_path)

# Vectorize
tfidf = TfidfVectorizer(stop_words='english', max_features=1000, ngram_range=(1,2))
tfidf.fit(df['text'])

features = tfidf.get_feature_names_out()

# Heuristic filter: keep features that appear in a curated list or look 'symptom-like'
# Since we can't easily auto-detect 'symptom-ness', we will dump the top 200 features 
# and I will ask the agent (myself) to manually curate/filter them into a valid JSON file.
# For now, let's just save the top features to a file to inspect.

print(f"Total features: {len(features)}")
with open('AI_service/knowledge/extracted_features.txt', 'w') as f:
    for feat in features:
        f.write(feat + '\n')

print("Saved extracted_features.txt")
