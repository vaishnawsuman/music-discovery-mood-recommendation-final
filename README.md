# Module D - Mood-Based Music Recommendation System

## Project Overview
This project is a beginner-friendly full-stack module for the AI/ML Capstone Project. It demonstrates how a user enters a mood or activity in natural language, and the system maps it to a simple music recommendation using dummy data.

## Problem Statement
The goal of this module is to create a working skeleton for a mood-based music recommendation system where the frontend and backend communicate through a clean API. The project is designed for the first mentoring session so it can be run immediately, even before the actual GTZAN dataset and Gemini API are added.

## Tech Stack
- Frontend: React + Vite
- Backend: FastAPI + Python
- HTTP Client: Axios
- Placeholder LLM: Google Gemini API
- Future ML Integration: GTZAN dataset, SVM, Random Forest, PCA, KMeans, CNN

## Folder Structure

module-d/
├── backend/
│   ├── api/
│   │   └── main.py
│   ├── recommender/
│   │   └── recommendation.py
│   ├── services/
│   │   └── gemini_service.py
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MoodInput.jsx
│   │   │   ├── PlaylistCard.jsx
│   │   │   └── PlaylistDescription.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Recommendation.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
└── README.md

## Installation Steps

### Backend
1. Go to the backend folder.
2. Use Python 3.12 for the cleanest local setup.
3. Install dependencies:

   py -3.12 -m pip install -r requirements.txt

4. Start the backend:

   py -3.12 -m uvicorn api.main:app --reload

### Frontend
1. Go to the frontend folder.
2. Install dependencies:

   npm install

3. Start the frontend:

   npm run dev

## Backend Run Commands
- `uvicorn api.main:app --reload`

## Frontend Run Commands
- `npm install`
- `npm run dev`

## Future Integration Plan
In future versions:
- Gemini API will map user mood to a genre and tempo.
- ML team outputs such as SVM, Random Forest, PCA, KMeans, and CNN will be integrated.
- GTZAN dataset will replace dummy songs.
- Audio preview and real playlist generation will be added.




## 📸 Project Screenshots & 🎥 Demo

[View Screenshots & Demo](https://drive.google.com/drive/folders/1G8xnTE_yCt76wJAIgogv9aNpiLJ5h2US?usp=drive_link)
