"""Wrapper script to train Vaishnaw's AIML SVM model from backend root.

Delegates execution to `backend.ml.train_vaishnaw_model`.
"""

from ml.train_vaishnaw_model import train_and_save_model

if __name__ == "__main__":
    train_and_save_model()
