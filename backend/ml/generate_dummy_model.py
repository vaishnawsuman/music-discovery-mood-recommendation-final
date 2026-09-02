"""Generate dummy CNN model and label encoder for development and testing."""

import os
import joblib
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.preprocessing import LabelEncoder

# Define output directory relative to backend root
ML_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(ML_DIR)
model_dir = os.path.join(BASE_DIR, "models")
os.makedirs(model_dir, exist_ok=True)

# Build a simple CNN matching notebook description
input_shape = (128, 128, 1)
num_classes = 10

inputs = layers.Input(shape=input_shape)
# Conv block 1
x = layers.Conv2D(32, (3,3), activation='relu', padding='same')(inputs)
x = layers.BatchNormalization()(x)
x = layers.MaxPooling2D((2,2))(x)
# Conv block 2
x = layers.Conv2D(64, (3,3), activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)
x = layers.MaxPooling2D((2,2))(x)
# Conv block 3
x = layers.Conv2D(128, (3,3), activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)
x = layers.MaxPooling2D((2,2))(x)
# Conv block 4
x = layers.Conv2D(256, (3,3), activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)
x = layers.MaxPooling2D((2,2))(x)
# Flatten and dense layers
x = layers.Flatten()(x)
x = layers.Dropout(0.5)(x)
x = layers.Dense(256, activation='relu')(x)
outputs = layers.Dense(num_classes, activation='softmax')(x)

model = models.Model(inputs=inputs, outputs=outputs)
# Compile (loss not needed for inference, but required to save)
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')

# Save model
model_path = os.path.join(model_dir, "genre_cnn.keras")
model.save(model_path)

# Create a proper label encoder with GTZAN genre names
genres = ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"]
label_encoder = LabelEncoder()
label_encoder.fit(genres)
# Save encoder using joblib
encoder_path = os.path.join(model_dir, "label_encoder.pkl")
joblib.dump(label_encoder, encoder_path)

print(f"Dummy model and encoder saved to {model_dir}")
