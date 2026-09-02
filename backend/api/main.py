import logging

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr

from ml.clustering import get_clustering_model
from recommender.recommendation import recommend_songs
from services.gemini_service import (
    GeminiConfigurationError,
    GeminiResponseError,
    GeminiServiceError,
    generate_playlist_description,
    interpret_mood,
)

logger = logging.getLogger("module_d.backend")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

app = FastAPI(title="Module D - Mood-Based Music Recommendation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://music-discovery-mood-recommendation.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MoodRequest(BaseModel):
    mood: constr(strip_whitespace=True, min_length=1, max_length=200)  # type: ignore[valid-type]


@app.get("/")
def read_root():
    return {
        "message": " backend is running successfully.",
        "project": "Mood-Based Music Recommendation System",
    }


@app.post("/recommend")
def recommend_endpoint(request: MoodRequest):
    """Interpret a mood with Gemini, select local tracks, and describe the playlist."""
    try:
        analysis = interpret_mood(request.mood)
        songs = recommend_songs(request.mood, analysis)
        playlist_description = generate_playlist_description(analysis, songs)
    except GeminiConfigurationError as error:
        logger.warning("Gemini configuration error while handling mood='%s': %s", request.mood, error)
        analysis = {
            "mood": request.mood,
            "genre": "Pop",
            "tempo": "Fast",
            "energy": "High",
            "description": "Offline fallback interpretation used for local development.",
        }
        songs = recommend_songs(request.mood, analysis)
        playlist_description = generate_playlist_description(analysis, songs)
    except (GeminiServiceError, GeminiResponseError) as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    logger.info(
        "Mood request: %s | genre=%s | tempo=%s | energy=%s | cluster=%s | songs=%s",
        request.mood,
        analysis.get("genre"),
        analysis.get("tempo"),
        analysis.get("energy"),
        songs[0].get("cluster") if songs else None,
        [song.get("filename") for song in songs[:5]],
    )

    return {
        **analysis,
        "reasoning": analysis["description"],
        "songs": songs,
        "playlist_description": playlist_description,
    }


@app.get("/clusters")
def get_clusters():
    """Return lightweight debugging info about the cluster model."""
    try:
        model = get_clustering_model()
        return {
            "status": "ready",
            "model_info": model.get_model_info(),
        }
    except FileNotFoundError:
        return {
            "status": "unavailable",
            "message": "No GTZAN dataset is present yet. Add backend/data/features_30_sec.csv or set GTZAN_DATASET_PATH.",
        }


@app.get("/clusters/{cluster_id}")
def get_cluster(cluster_id: int):
    """Return songs assigned to a specific cluster."""
    try:
        model = get_clustering_model()
        songs = model.get_cluster_songs(cluster_id)
        return {
            "cluster_id": cluster_id,
            "songs": songs,
            "count": len(songs),
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Clustering model is not available yet.") from None


@app.get("/model-info")
def get_model_info():
    """Return metadata for the trained clustering model."""
    try:
        model = get_clustering_model()
        return model.get_model_info()
    except FileNotFoundError:
        return {
            "status": "unavailable",
            "message": "No GTZAN dataset is present yet. Add backend/data/features_30_sec.csv or set GTZAN_DATASET_PATH.",
        }


@app.post("/predict-genre")
async def predict_genre_endpoint(audio: UploadFile = File(...)):
    """Accept raw audio file and return predicted genre using Vaishnaw's AIML SVM Classifier."""
    try:
        from services.aiml_service import predict_genre_svm
    except ImportError as error:
        raise HTTPException(
            status_code=503,
            detail="Genre prediction is unavailable because its ML dependencies are not installed.",
        ) from error

    content = await audio.read()
    genre = predict_genre_svm(content)
    return {"genre": genre, "model": "Vaishnaw AIML SVM Classifier"}


@app.post("/predict-genre-features")
async def predict_genre_features_endpoint(features: dict):
    """Predict genre from GTZAN feature dictionary using Vaishnaw's AIML SVM Classifier."""
    try:
        from services.aiml_service import predict_genre_from_features
    except ImportError as error:
        raise HTTPException(
            status_code=503,
            detail="Genre prediction is unavailable because its ML dependencies are not installed.",
        ) from error

    genre = predict_genre_from_features(features)
    return {"genre": genre, "model": "Vaishnaw AIML SVM Classifier"}
