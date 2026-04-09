import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
import joblib
import os

def main():
    # Create dataset path
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATASET_PATH = os.path.join(BASE_DIR, 'dataset', 'resume_dataset.csv')

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    # Load Dataset
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    # Features and Labels
    # We combine resume text and role so the model learns role-specific relevance
    X = df['resume_text'] + " " + df['role']
    y_score = df['finalScore']
    y_decision = df['decision']

    # TF-IDF Vectorization
    print("Training TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    X_vec = vectorizer.fit_transform(X)

    # Train Regressor for finalScore
    print("Training Random Forest Regressor for Score...")
    regressor = RandomForestRegressor(n_estimators=100, random_state=42)
    regressor.fit(X_vec, y_score)

    # Train Classifier for decision
    print("Training Random Forest Classifier for Decision...")
    classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    classifier.fit(X_vec, y_decision)

    # Save Models and Vectorizer
    print("Saving models...")
    joblib.dump(vectorizer, os.path.join(BASE_DIR, 'tfidf_vectorizer.pkl'))
    joblib.dump(regressor, os.path.join(BASE_DIR, 'score_model.pkl'))
    joblib.dump(classifier, os.path.join(BASE_DIR, 'decision_model.pkl'))

    print("Training Complete. Models saved successfully.")

if __name__ == "__main__":
    main()
