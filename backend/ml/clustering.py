"""GTZAN clustering pipeline for mood-aware recommendation support."""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import adjusted_rand_score
from sklearn.preprocessing import LabelEncoder, StandardScaler

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "ml" / "models"
DEFAULT_DATA_PATH = DATA_DIR / "features_30_sec.csv"
SCALER_PATH = MODEL_DIR / "scaler.joblib"
PCA_PATH = MODEL_DIR / "pca.joblib"
KMEANS_PATH = MODEL_DIR / "kmeans.joblib"
SONGS_PATH = MODEL_DIR / "songs_with_clusters.csv"


def resolve_dataset_path(dataset_path: str | os.PathLike[str] | None = None) -> Path:
    """Resolve the dataset path from an explicit argument or environment."""
    if dataset_path is not None:
        candidate = Path(dataset_path).expanduser()
        if candidate.exists():
            return candidate

    env_path = os.getenv("GTZAN_DATASET_PATH")
    if env_path:
        candidate = Path(env_path).expanduser()
        if candidate.exists():
            return candidate

    return DEFAULT_DATA_PATH


class MusicClusteringModel:
    """Train, cache and query a GTZAN clustering model."""

    def __init__(self, dataset_path: str | os.PathLike[str] | None = None):
        self.dataset_path = resolve_dataset_path(dataset_path)
        self.df: pd.DataFrame | None = None
        self.scaler: StandardScaler | None = None
        self.pca: PCA | None = None
        self.kmeans: KMeans | None = None
        self.feature_columns: list[str] = []
        self.ari: float | None = None
        self.model_dir = MODEL_DIR
        self.model_dir.mkdir(parents=True, exist_ok=True)

    @property
    def is_ready(self) -> bool:
        return (
            self.df is not None
            and self.scaler is not None
            and self.pca is not None
            and self.kmeans is not None
        )

    def _get_numeric_feature_columns(self, frame: pd.DataFrame) -> list[str]:
        excluded = {"filename", "length", "label"}
        numeric_columns = [
            column
            for column in frame.columns
            if column not in excluded and pd.api.types.is_numeric_dtype(frame[column])
        ]
        if not numeric_columns:
            raise ValueError(
                "No numeric audio feature columns were found after excluding filename, length, and label."
            )
        return numeric_columns

    def train(self, dataset_path: str | os.PathLike[str] | None = None) -> dict[str, Any]:
        path = resolve_dataset_path(dataset_path)
        if not path.exists():
            raise FileNotFoundError(
                f"GTZAN dataset not found at {path}. Set GTZAN_DATASET_PATH or place the CSV in backend/data/."
            )

        logger.info("Loading GTZAN dataset from %s", path)
        self.df = pd.read_csv(path)
        if self.df.empty:
            raise ValueError(f"GTZAN dataset at {path} is empty.")

        feature_columns = self._get_numeric_feature_columns(self.df)
        self.feature_columns = feature_columns

        x = self.df[feature_columns].copy()
        y = self.df["label"].astype(str)

        scaler = StandardScaler()
        x_scaled = scaler.fit_transform(x)

        pca = PCA(n_components=2)
        x_pca = pca.fit_transform(x_scaled)

        kmeans = KMeans(n_clusters=10, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(x_pca)

        encoder = LabelEncoder()
        y_encoded = encoder.fit_transform(y)
        ari = adjusted_rand_score(y_encoded, clusters)

        self.df = self.df.copy()
        self.df["cluster"] = clusters.astype(int)
        self.df["pca_x"] = x_pca[:, 0]
        self.df["pca_y"] = x_pca[:, 1]

        self.scaler = scaler
        self.pca = pca
        self.kmeans = kmeans
        self.ari = float(ari)

        self.model_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.scaler, SCALER_PATH)
        joblib.dump(self.pca, PCA_PATH)
        joblib.dump(self.kmeans, KMEANS_PATH)
        self.df.to_csv(SONGS_PATH, index=False)

        logger.info(
            "KMeans training complete. Songs: %s | Features: %s | ARI: %.4f",
            len(self.df),
            len(feature_columns),
            ari,
        )
        return self.get_model_info()

    def load(self, dataset_path: str | os.PathLike[str] | None = None) -> dict[str, Any]:
        if self.is_ready:
            return self.get_model_info()

        path = resolve_dataset_path(dataset_path)
        model_files_exist = all(
            file.exists() for file in [SCALER_PATH, PCA_PATH, KMEANS_PATH, SONGS_PATH]
        )

        if model_files_exist:
            logger.info("Loading trained clustering artifacts from %s", self.model_dir)
            self.scaler = joblib.load(SCALER_PATH)
            self.pca = joblib.load(PCA_PATH)
            self.kmeans = joblib.load(KMEANS_PATH)
            self.df = pd.read_csv(SONGS_PATH)
            self.feature_columns = [
                column
                for column in self.df.columns
                if column not in {"filename", "length", "label", "cluster", "pca_x", "pca_y"}
            ]
            self.ari = None
            return self.get_model_info()

        if path.exists():
            return self.train(path)

        raise FileNotFoundError(
            f"No trained clustering model artifacts were found and no dataset was found at {path}."
        )

    def get_model_info(self) -> dict[str, Any]:
        if self.df is None:
            self.load()

        cluster_distribution = (
            self.df["cluster"].value_counts().sort_index().astype(int).to_dict()
            if "cluster" in self.df.columns
            else {}
        )

        return {
            "songs": int(len(self.df)),
            "features": int(len(self.feature_columns) or len(self.df.select_dtypes(include="number").columns)),
            "clusters": int(self.kmeans.n_clusters) if self.kmeans is not None else 10,
            "pca_components": int(self.pca.n_components_) if self.pca is not None else 2,
            "variance_retained": float(self.pca.explained_variance_ratio_.sum()) if self.pca is not None else 0.0,
            "ari": float(self.ari) if self.ari is not None else None,
            "cluster_distribution": cluster_distribution,
        }

    def get_song_cluster(self, filename: str) -> int | None:
        if self.df is None:
            self.load()

        match = self.df[self.df["filename"].astype(str).str.lower() == str(filename).lower()]
        if match.empty:
            return None
        return int(match.iloc[0]["cluster"])

    def get_cluster_songs(self, cluster_id: int, limit: int = 10) -> list[dict[str, Any]]:
        if self.df is None:
            self.load()

        songs = self.df[self.df["cluster"] == int(cluster_id)].copy()
        return [_song_to_payload(row) for _, row in songs.head(limit).iterrows()]

    def get_genre_cluster_candidates(self, genre: str, limit: int = 3) -> list[int]:
        if self.df is None:
            self.load()

        normalized_genre = str(genre or "").strip().lower()
        if not normalized_genre:
            return []

        genre_rows = self.df[self.df["label"].astype(str).str.lower() == normalized_genre]
        if genre_rows.empty:
            return []

        cluster_counts = genre_rows["cluster"].value_counts().sort_values(ascending=False)
        return [int(cluster_id) for cluster_id in cluster_counts.head(limit).index.tolist()]

    def get_recommendations_from_cluster(
        self,
        genre: str | None = None,
        cluster_id: int | None = None,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        if self.df is None:
            self.load()

        result = self.df.copy()

        if cluster_id is not None:
            result = result[result["cluster"] == int(cluster_id)]

        if genre is not None:
            normalized_genre = str(genre).strip().lower()
            result = result[result["label"].astype(str).str.lower() == normalized_genre]

        if result.empty:
            if cluster_id is not None:
                result = self.df[self.df["cluster"] == int(cluster_id)].copy()
            if genre is not None and result.empty:
                normalized_genre = str(genre).strip().lower()
                result = self.df[self.df["label"].astype(str).str.lower() == normalized_genre].copy()

        if result.empty:
            return []

        result = result.head(limit).copy()
        recommendations: list[dict[str, Any]] = []
        for _, row in result.iterrows():
            recommendations.append(_song_to_payload(row))
        return recommendations


def _song_to_payload(row: pd.Series, score: float | None = None) -> dict[str, Any]:
    genre_name = str(row.get("label") or row.get("genre") or "Unknown")
    filename = str(row.get("filename") or row.get("title") or "unknown-track")
    title = filename.rsplit("/", 1)[-1]
    title = title.rsplit(".", 1)[0] if "." in title else title
    if not title:
        title = filename

    payload = {
        "id": filename,
        "title": title.replace("_", " ").title(),
        "artist": "GTZAN Collection",
        "genre": genre_name,
        "filename": filename,
        "cluster": int(row.get("cluster", 0)),
        "duration": str(row.get("length") or "3:30"),
        "score": float(score if score is not None else 0.9),
        "emoji": "🎵",
        "color": "#3b82f6",
    }
    return payload


music_model = MusicClusteringModel()


def get_clustering_model(force_reload: bool = False) -> MusicClusteringModel:
    if force_reload:
        music_model.df = None
        music_model.scaler = None
        music_model.pca = None
        music_model.kmeans = None

    if music_model.df is None and not any(file.exists() for file in [SCALER_PATH, PCA_PATH, KMEANS_PATH, SONGS_PATH]):
        if resolve_dataset_path().exists():
            music_model.train(resolve_dataset_path())
        else:
            raise FileNotFoundError(
                "No clustering dataset was found. Add the GTZAN features CSV to backend/data/ or set GTZAN_DATASET_PATH."
            )

    if music_model.df is None:
        music_model.load()

    return music_model
