"""
EDUSign – API Server
Connects the React frontend (port 5173) to the CNN + MediaPipe model.

POST /api/predict
  Body:  { "image": "<data:image/jpeg;base64,...>", "target": "A", "mode": "learning"|"quiz" }
  Reply: { "label": "A", "confidence": 0.95, "hand_detected": true }
"""

import os
import base64
import io
import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
import tensorflow as tf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import uvicorn

# ── paths (Dynamic for server deployment) 
BASE_DIR      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH    = os.path.join(BASE_DIR, "models", "sign_cnn.h5")
LABELS_PATH   = os.path.join(BASE_DIR, "models", "labels.npy")
MP_MODEL_PATH = os.path.join(BASE_DIR, "models", "hand_landmarker.task")

# ── global resources (loaded once at startup) 
cnn_model  = None
CLASSES    = None
detector   = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global cnn_model, CLASSES, detector

    print("Loading CNN model…")
    cnn_model = tf.keras.models.load_model(MODEL_PATH)
    CLASSES   = np.load(LABELS_PATH, allow_pickle=True).tolist()
    print(f"CNN model ready. Classes: {CLASSES}")

    print("Loading MediaPipe Hand Landmarker…")
    options = mp_vision.HandLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=MP_MODEL_PATH),
        running_mode=mp_vision.RunningMode.IMAGE,   # IMAGE mode: one frame at a time
        num_hands=1,
        min_hand_detection_confidence=0.5,
        min_hand_presence_confidence=0.5,
    )
    detector = mp_vision.HandLandmarker.create_from_options(options)
    print("MediaPipe ready.")

    yield  # Server runs here

    detector.close()
    print("Server shut down cleanly.")

# ── FastAPI app ─────────────────────────────────────────────────────────────
app = FastAPI(title="EDUSign API", lifespan=lifespan)

# Allow requests from the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow requests from Vercel hosted frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    image: str        # data:image/jpeg;base64,...
    target: str = ""  # expected letter (for context; not used in inference)
    mode: str = "learning"

class PredictResponse(BaseModel):
    label: str | None
    confidence: float
    hand_detected: bool

def decode_image(data_url: str) -> np.ndarray:
    """Convert base64 data URL → BGR numpy array."""
    if "," in data_url:
        data_url = data_url.split(",", 1)[1]
    raw = base64.b64decode(data_url)
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img

def extract_landmarks(result: mp_vision.HandLandmarkerResult):
    """Return flat 63-element vector [x,y,z × 21] or None if no hand."""
    if not result or not result.hand_landmarks:
        return None
    vec = []
    for lm in result.hand_landmarks[0]:
        vec.extend([lm.x, lm.y, lm.z])
    return np.array(vec, dtype=np.float32)

@app.post("/api/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    # 1. Decode incoming frame
    bgr = decode_image(req.image)
    if bgr is None:
        return PredictResponse(label=None, confidence=0.0, hand_detected=False)

    # 2. Run MediaPipe hand detection (IMAGE mode — synchronous)
    rgb      = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    result   = detector.detect(mp_image)

    vec = extract_landmarks(result)
    if vec is None:
        return PredictResponse(label=None, confidence=0.0, hand_detected=False)

    # 3. CNN inference
    probs = cnn_model.predict(vec.reshape(1, 63), verbose=0)[0]
    idx   = int(np.argmax(probs))
    label = CLASSES[idx]
    conf  = float(probs[idx])

    return PredictResponse(label=label, confidence=conf, hand_detected=True)

@app.get("/health")
async def health():
    return {"status": "ok", "classes": len(CLASSES) if CLASSES else 0}

if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=False)
