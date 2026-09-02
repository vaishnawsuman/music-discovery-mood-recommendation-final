import os
import numpy as np
import librosa
import cv2
import joblib
from tensorflow.keras.models import load_model


# Determine the directory containing the model files
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
MODEL_PATH = os.path.join(BASE_DIR, "genre_cnn.keras")
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.pkl")

# Lazy-load model and label encoder (loaded on first prediction request)
_model = None
_label_encoder = None


def _load_model():
    """Load the CNN model and label encoder on first use."""
    global _model, _label_encoder
    if _model is not None:
        return
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"CNN model file not found at {MODEL_PATH}")
    if not os.path.exists(LABEL_ENCODER_PATH):
        raise FileNotFoundError(f"Label encoder file not found at {LABEL_ENCODER_PATH}")
    _model = load_model(MODEL_PATH)
    _label_encoder = joblib.load(LABEL_ENCODER_PATH)

# Constants matching the notebook preprocessing
SR = 22050
CHUNK_DURATION = 3  # seconds
N_MELS = 128
IMG_SIZE = (128, 128)

def _preprocess_chunk(y: np.ndarray) -> np.ndarray:
    """Convert a raw audio chunk to the model input shape (128, 128, 1)."""
    # Compute mel-spectrogram
    mel = librosa.feature.melspectrogram(y=y, sr=SR, n_mels=N_MELS)
    # Convert power to dB
    mel_db = librosa.power_to_db(mel, ref=np.max)
    # Normalize to [0, 1]
    mel_norm = (mel_db - mel_db.min()) / (mel_db.max() - mel_db.min() + 1e-6)
    # Resize to 128x128 (height, width)
    resized = cv2.resize(mel_norm, IMG_SIZE, interpolation=cv2.INTER_AREA)
    # Expand dims to (128, 128, 1)
    return resized[..., np.newaxis]

def _split_into_chunks(y: np.ndarray) -> list:
    """Split full audio waveform into 3‑second chunks (zero‑pad the last chunk if needed)."""
    chunk_len = SR * CHUNK_DURATION
    total_len = y.shape[0]
    chunks = []
    for start in range(0, total_len, chunk_len):
        end = start + chunk_len
        chunk = y[start:end]
        if chunk.shape[0] < chunk_len:
            # Zero‑pad short final chunk
            pad_width = chunk_len - chunk.shape[0]
            chunk = np.pad(chunk, (0, pad_width), mode="constant")
        chunks.append(chunk)
    return chunks

def predict_genre(audio_bytes: bytes) -> str:
    """Run the CNN on raw audio bytes and return the predicted genre name.

    The function follows the exact pipeline described in the notebook:
    1. Load with librosa at 22050 Hz.
    2. Split into 3‑second chunks.
    3. For each chunk compute a mel‑spectrogram → dB → normalize → resize → reshape.
    4. Predict each chunk, take the majority vote.
    5. Convert the numeric label back to the genre string via the label encoder.
    """
    _load_model()
    import io
    import soundfile as sf
    with io.BytesIO(audio_bytes) as buffer:
        y, source_sr = sf.read(buffer, dtype="float32")
        if y.ndim > 1:
            y = np.mean(y, axis=1)  # Convert to mono if needed
        if source_sr != SR:
            y = librosa.resample(y, orig_sr=source_sr, target_sr=SR)
    if y.shape[0] == 0:
        raise ValueError("Empty audio input")
    chunks = _split_into_chunks(y)
    processed = np.stack([_preprocess_chunk(chunk) for chunk in chunks], axis=0)
    preds = _model.predict(processed, verbose=0)
    class_ids = np.argmax(preds, axis=1)
    if len(class_ids) == 0:
        raise RuntimeError("No audio chunks were processed")
    majority_id = np.bincount(class_ids).argmax()
    genre = _label_encoder.inverse_transform([majority_id])[0]
    return str(genre)
