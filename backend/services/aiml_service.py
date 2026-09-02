import os
import json
import io
import numpy as np
import joblib

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
MODEL_PATH = os.path.join(BASE_DIR, "svm_genre_classifier.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.joblib")
FEATURES_PATH = os.path.join(BASE_DIR, "feature_columns.json")

_svm_model = None
_scaler = None
_label_encoder = None
_feature_columns = None

def _load_aiml_artifacts():
    global _svm_model, _scaler, _label_encoder, _feature_columns
    if _svm_model is not None:
        return

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"SVM model artifact not found at {MODEL_PATH}")
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Scaler artifact not found at {SCALER_PATH}")
    if not os.path.exists(ENCODER_PATH):
        raise FileNotFoundError(f"Label encoder artifact not found at {ENCODER_PATH}")
    if not os.path.exists(FEATURES_PATH):
        raise FileNotFoundError(f"Feature columns JSON not found at {FEATURES_PATH}")

    _svm_model = joblib.load(MODEL_PATH)
    _scaler = joblib.load(SCALER_PATH)
    _label_encoder = joblib.load(ENCODER_PATH)
    with open(FEATURES_PATH, "r") as f:
        _feature_columns = json.load(f)

def extract_gtzan_features(y: np.ndarray, sr: int = 22050) -> list:
    """Extract standard GTZAN 57 tabular features from raw audio waveform using librosa."""
    import librosa

    # Chroma STFT
    chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean, chroma_var = float(np.mean(chroma_stft)), float(np.var(chroma_stft))

    # RMS
    rms = librosa.feature.rms(y=y)
    rms_mean, rms_var = float(np.mean(rms)), float(np.var(rms))

    # Spectral Centroid
    spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr)
    cent_mean, cent_var = float(np.mean(spec_cent)), float(np.var(spec_cent))

    # Spectral Bandwidth
    spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    bw_mean, bw_var = float(np.mean(spec_bw)), float(np.var(spec_bw))

    # Rolloff
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    rolloff_mean, rolloff_var = float(np.mean(rolloff)), float(np.var(rolloff))

    # Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y)
    zcr_mean, zcr_var = float(np.mean(zcr)), float(np.var(zcr))

    # Harmonics and Perceptrual
    y_harm, y_perc = librosa.effects.hpss(y)
    harm_mean, harm_var = float(np.mean(y_harm)), float(np.var(y_harm))
    perc_mean, perc_var = float(np.mean(y_perc)), float(np.var(y_perc))

    # Tempo
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo_res = librosa.beat.tempo(onset_envelope=onset_env, sr=sr)
    tempo_val = float(np.atleast_1d(tempo_res)[0])

    features = [
        chroma_mean, chroma_var,
        rms_mean, rms_var,
        cent_mean, cent_var,
        bw_mean, bw_var,
        rolloff_mean, rolloff_var,
        zcr_mean, zcr_var,
        harm_mean, harm_var,
        perc_mean, perc_var,
        tempo_val
    ]

    # MFCCs 1..20
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    for i in range(20):
        features.extend([float(np.mean(mfcc[i])), float(np.var(mfcc[i]))])

    return features

def predict_genre_svm(audio_bytes: bytes) -> str:
    """Predict music genre from audio bytes using Vaishnaw's SVM Model."""
    import soundfile as sf
    import librosa

    _load_aiml_artifacts()

    with io.BytesIO(audio_bytes) as buffer:
        y, sr = sf.read(buffer, dtype="float32")
        if y.ndim > 1:
            y = np.mean(y, axis=1)
        if sr != 22050:
            y = librosa.resample(y, orig_sr=sr, target_sr=22050)
            sr = 22050

    if y.shape[0] == 0:
        raise ValueError("Empty audio file provided")

    features = extract_gtzan_features(y, sr)
    feature_vector = np.array(features).reshape(1, -1)

    scaled_vector = _scaler.transform(feature_vector)
    pred_idx = _svm_model.predict(scaled_vector)[0]
    genre_name = _label_encoder.inverse_transform([pred_idx])[0]
    return str(genre_name)

def predict_genre_from_features(feature_dict: dict) -> str:
    """Predict genre directly from a dictionary of GTZAN feature values."""
    _load_aiml_artifacts()

    vector = []
    for col in _feature_columns:
        if col not in feature_dict:
            vector.append(0.0)
        else:
            vector.append(float(feature_dict[col]))

    feature_vector = np.array(vector).reshape(1, -1)
    scaled_vector = _scaler.transform(feature_vector)
    pred_idx = _svm_model.predict(scaled_vector)[0]
    genre_name = _label_encoder.inverse_transform([pred_idx])[0]
    return str(genre_name)
