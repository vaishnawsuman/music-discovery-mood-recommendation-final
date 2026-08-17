# Backend README

This backend provides the API skeleton for the Module D project.

## What it does
- Exposes a simple FastAPI app
- Supports GET / to check health
- Supports POST /recommend with mood input
- Returns dummy recommendation data

## Run locally

1. Open a terminal inside this folder.
2. Use Python 3.12 for the cleanest local setup.
3. Install dependencies:

   py -3.12 -m pip install -r requirements.txt

4. Start the API:

   py -3.12 -m uvicorn api.main:app --reload

4. Open the docs page:

   http://127.0.0.1:8000/docs
