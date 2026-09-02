# Module D - Mood-Based Music Recommendation System

## Project Overview

This project is a full-stack music recommendation application combining a React frontend with a FastAPI backend.

The application interprets natural-language mood requests, maps them to music preferences, and generates personalized music recommendations.

The recommendation engine integrates machine learning techniques including GTZAN-based clustering, PCA, K-Means, SVM genre classification, and CNN-based genre prediction.

## System Architecture

```text
React Frontend
       |
       | REST API
       v
FastAPI Backend
       |
       +-------------------+
       |                   |
       v                   v
 Gemini AI            ML Pipeline
 Mood Analysis        |
                       +-- PCA
                       +-- K-Means
                       +-- SVM
                       +-- CNN
       |
       v
Recommendation Engine
       |
       v
Personalized Playlist
```

## Unsupervised Learning Integration

The backend provides a reusable clustering pipeline in:

```text
backend/ml/clustering.py
```

The pipeline:

1. Loads the GTZAN feature dataset from `backend/data/features_30_sec.csv` or the path specified by `GTZAN_DATASET_PATH`.
2. Removes non-audio metadata such as filename, length, and label.
3. Standardizes numerical features using `StandardScaler`.
4. Reduces the feature space using `PCA(n_components=2)`.
5. Trains `KMeans(n_clusters=10, random_state=42)`.
6. Saves and reuses the trained clustering model for recommendation requests.

## Audio Features

Audio feature columns are read directly from the GTZAN feature CSV.

Non-audio metadata such as:

* filename
* length
* label

is excluded before clustering.

## Standardization

The numerical audio features are scaled using `StandardScaler`.

This ensures that features with different ranges and distributions contribute more evenly to the clustering process.

## PCA

Principal Component Analysis reduces the standardized feature matrix to two principal components.

This provides a lower-dimensional representation that can be efficiently used for clustering and visualization.

## K-Means

K-Means clustering is configured with:

```text
n_clusters = 10
random_state = 42
```

The algorithm partitions the songs into discovery clusters.

Each song is assigned a cluster ID that can be used by the recommendation engine.

## Cluster Assignment

The processed song data contains the original GTZAN metadata along with a cluster identifier.

The recommendation engine can therefore use both genre and cluster information when ranking songs.

## Mood / Genre Mapping

The AI mood interpretation system maps a natural-language request to music preferences such as:

* preferred genre
* tempo
* energy
* mood characteristics

The selected genre is then used together with the clustering results to identify relevant songs.

## Song Retrieval

After determining the relevant cluster, the backend:

1. Retrieves songs from the selected cluster.
2. Filters by genre when possible.
3. Calculates recommendation scores.
4. Ranks the songs.
5. Returns the best matches to the frontend.

## Personalized Playlist

The recommendation API maintains a stable frontend response format.

The response contains a songs array with metadata such as:

* title
* artist
* genre
* duration
* cluster
* recommendation score

It also includes the mood analysis and generated playlist description.

## Machine Learning Models

The backend can use multiple ML components:

```text
SVM
├── Genre classification
│
CNN
├── Mel-spectrogram based genre prediction
│
PCA
├── Dimensionality reduction
│
K-Means
└── Unsupervised music clustering
```

Saved model artifacts are stored under:

```text
backend/models/
```

## Dataset

The project uses features derived from the GTZAN music genre dataset.

For local development, the feature dataset can be placed at:

```text
backend/data/features_30_sec.csv
```

Alternatively, configure:

```text
GTZAN_DATASET_PATH
```

to point to the dataset location.

Large datasets and model files should not be committed to GitHub if they exceed repository or deployment limits. Small demo datasets can be included when appropriate.

## Gemini AI Integration

Gemini is used to interpret natural-language mood descriptions.

For example, a user can provide a request describing an activity or mood, and the AI service can extract relevant music preferences for the recommendation pipeline.

The Gemini API key must be stored as an environment variable.

Create:

```text
backend/.env
```

with:

```env
GEMINI_API_KEY=your_api_key_here
```

Never commit the actual `.env` file or API key to GitHub.

## Project Structure

```text
module-d/
│
├── backend/
│   ├── api/
│   │   └── main.py
│   │
│   ├── data/
│   │   ├── features.csv
│   │   └── features_30_sec.csv
│   │
│   ├── ml/
│   │   ├── clustering.py
│   │   ├── generate_dummy_model.py
│   │   └── train_vaishnaw_model.py
│   │
│   ├── models/
│   │   ├── feature_columns.json
│   │   ├── genre_cnn.keras
│   │   ├── label_encoder.joblib
│   │   ├── scaler.joblib
│   │   └── svm_genre_classifier.joblib
│   │
│   ├── recommender/
│   │   └── recommendation.py
│   │
│   ├── services/
│   │   ├── aiml_service.py
│   │   ├── cnn_service.py
│   │   └── gemini_service.py
│   │
│   ├── train_vaishnaw_model.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md
```

## Installation

### Backend

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
py -m pip install -r requirements.txt
```

Start the FastAPI server:

```bash
py -m uvicorn api.main:app --reload
```

The backend will run locally on:

```text
http://127.0.0.1:8000
```

### Frontend

Open another terminal and go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## Backend API

Important endpoints include:

```text
GET  /
POST /recommend
POST /predict-genre
```

The exact available endpoints may depend on the current backend implementation.

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Example:

```env
GEMINI_API_KEY=
GTZAN_DATASET_PATH=
```

### Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:8000
```

For production, `VITE_API_URL` should point to the deployed FastAPI backend.

## Future Integration

Future versions can include:

* Improved Gemini-based mood understanding
* More advanced playlist ranking
* Real-time audio preview
* Full music streaming integration
* Larger music datasets
* Improved CNN genre classification
* User-specific recommendation history
* Cloud-based model storage
* Production-scale recommendation infrastructure

## Project Screenshots & Demo

[View Screenshots & Demo](https://drive.google.com/drive/folders/1G8xnTE_yCt76wJAIgogv9aNpiLJ5h2US?usp=drive_link)
