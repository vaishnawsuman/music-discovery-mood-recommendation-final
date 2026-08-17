from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recommender.recommendation import recommend_songs

app = FastAPI(title="Module D - Mood-Based Music Recommendation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MoodRequest(BaseModel):
    mood: str


@app.get("/")
def read_root():
    return {
        "message": "Module D backend is running successfully.",
        "project": "Mood-Based Music Recommendation System",
    }


@app.post("/recommend")
def recommend_endpoint(request: MoodRequest):
    recommendation = recommend_songs(request.mood)
    return recommendation
