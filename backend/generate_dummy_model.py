"""Wrapper script to generate dummy CNN model from backend root.

Delegates execution to `backend.ml.generate_dummy_model`.
"""

import os
import sys

# Ensure ml package is imported
from ml.generate_dummy_model import *
