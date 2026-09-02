# Backend README

This backend exposes the FastAPI app for the mood-based recommendation system and integrates the GTZAN clustering pipeline.

## What it does
- Provides GET / and POST /recommend
- Uses Gemini or a local offline fallback to interpret mood
- Loads GTZAN audio features from backend/data/features_30_sec.csv when available
- Standardizes features, runs PCA, and assigns cluster IDs with KMeans
- Reuses trained models via backend/ml/models/
- Returns dataset-backed recommendations when the model is available, while preserving the existing frontend response structure

## Dataset placement
Place the GTZAN feature CSV at one of these locations:
- backend/data/features_30_sec.csv
- a custom path referenced by GTZAN_DATASET_PATH

Do not commit the full dataset or large model files to Git. Keep them local, but keep the training code and artifact paths committed.

## Local run
1. Open a terminal inside the backend folder.
2. Install dependencies:

   py -m pip install -r requirements.txt

3. Start the API:

   py -m uvicorn api.main:app --reload

4. Open the API docs:

   http://127.0.0.1:8000/docs

## Clustering pipeline
Audio features are loaded from the GTZAN CSV, the filename, length, and label columns are removed, then the remaining numeric features are standardized using StandardScaler. PCA reduces the feature space to 2 components, and KMeans assigns 10 clusters with random_state=42. The resulting cluster assignments are persisted to backend/ml/models/songs_with_clusters.csv and reused for recommendation requests.

## Mood / genre / cluster mapping
The recommendation engine first interprets the user mood, then maps it to a preferred genre (Pop, Rock, Classical, Jazz, Dance). The cluster model selects the most relevant cluster for that genre, retrieves songs from that cluster, and ranks the final playlist before returning it to the frontend.
