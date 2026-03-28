import os
import time
import random
import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
import tensorflow as tf

# ── paths ──────────────────────────────────────────────────────────────────
PROJECT_ROOT   = "D:\FinalModelCopy\FYP_Model"
MODEL_PATH     = os.path.join(PROJECT_ROOT, "models", "sign_cnn.h5")
LABELS_PATH    = os.path.join(PROJECT_ROOT, "models", "labels.npy")
MP_MODEL_PATH  = os.path.join(PROJECT_ROOT, "models", "hand_landmarker.task")

# ── load sign-recognition model ────────────────────────────────────────────
model  = tf.keras.models.load_model(MODEL_PATH)
CLASSES = np.load(LABELS_PATH, allow_pickle=True).tolist()
print("Model loaded")
print("Classes:", CLASSES)

# ── hand connections (21-landmark topology) ────────────────────────────────
HAND_CONNECTIONS = [
    (0,1),(1,2),(2,3),(3,4),
    (0,5),(5,6),(6,7),(7,8),
    (5,9),(9,10),(10,11),(11,12),
    (9,13),(13,14),(14,15),(15,16),
    (13,17),(17,18),(18,19),(19,20),
    (0,17),
]

def draw_landmarks(frame, hand_landmarks_list):
    h, w = frame.shape[:2]
    for hand in hand_landmarks_list:
        pts = [(int(lm.x * w), int(lm.y * h)) for lm in hand]
        for a, b in HAND_CONNECTIONS:
            cv2.line(frame, pts[a], pts[b], (0, 200, 200), 2)
        for x, y in pts:
            cv2.circle(frame, (x, y), 4, (0, 255, 0), -1)

# ── mediapipe hand landmarker (Tasks API, LIVE_STREAM mode) ────────────────
_latest_result = None

def _callback(result: mp_vision.HandLandmarkerResult,
               output_image: mp.Image, timestamp_ms: int):
    global _latest_result
    try:
        _latest_result = result
    except Exception as e:
        print(f"[CALLBACK ERROR] {e}")

options = mp_vision.HandLandmarkerOptions(
    base_options=mp_python.BaseOptions(model_asset_path=MP_MODEL_PATH),
    running_mode=mp_vision.RunningMode.LIVE_STREAM,
    num_hands=1,
    min_hand_detection_confidence=0.6,
    min_hand_presence_confidence=0.6,
    min_tracking_confidence=0.6,
    result_callback=_callback,
)
detector = mp_vision.HandLandmarker.create_from_options(options)

def extract_landmarks(result):
    if not result or not result.hand_landmarks:
        return None
    vec = []
    for lm in result.hand_landmarks[0]:
        vec.extend([lm.x, lm.y, lm.z])
    return np.array(vec, dtype=np.float32)

# ── quiz state ─────────────────────────────────────────────────────────────
target_label   = random.choice(CLASSES)
score_correct  = 0
score_total    = 0
last_check     = 0.0
CHECK_INTERVAL = 1.0   # seconds

# ── webcam main loop ───────────────────────────────────────────────────────
cap = cv2.VideoCapture(1)  # index 1 = built-in MacBook camera (index 0 is Continuity Camera, unreliable)
if not cap.isOpened():
    raise RuntimeError("Camera not accessible. Check System Settings → Privacy → Camera.")

# Give camera time to warm up on macOS
import time as _time
_time.sleep(1.0)

print("EDUSign started  |  'n' = new sign  |  'q' = quit")

timestamp_ms = 0
failed_reads = 0
MAX_FAILED_READS = 10

while True:
    ret, frame = cap.read()
    if not ret:
        failed_reads += 1
        print(f"[WARN] Failed to read frame ({failed_reads}/{MAX_FAILED_READS})")
        if failed_reads >= MAX_FAILED_READS:
            print("[ERROR] Too many failed reads — camera disconnected or dropped.")
            break
        _time.sleep(0.05)
        continue
    failed_reads = 0  # reset on success

    frame     = cv2.flip(frame, 1)
    rgb       = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image  = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

    timestamp_ms += 33          # ~30 fps
    detector.detect_async(mp_image, timestamp_ms)

    # draw landmarks
    if _latest_result and _latest_result.hand_landmarks:
        draw_landmarks(frame, _latest_result.hand_landmarks)

    # prediction
    pred_label = "-"
    pred_conf  = 0.0
    vec = extract_landmarks(_latest_result)
    if vec is not None:
        probs      = model.predict(vec.reshape(1, 63), verbose=0)[0]
        idx        = int(np.argmax(probs))
        pred_label = CLASSES[idx]
        pred_conf  = float(probs[idx])

    # quiz evaluation
    now      = time.time()
    feedback = "Show the sign"
    if vec is not None and now - last_check >= CHECK_INTERVAL:
        score_total += 1
        if pred_label == target_label:
            score_correct += 1
            feedback = "CORRECT!"
        else:
            feedback = "WRONG"
        last_check = now

    acc = score_correct / score_total if score_total else 0.0

    # HUD
    fb_color = (0, 255, 80) if feedback == "CORRECT!" else (0, 100, 255)
    cv2.putText(frame, f"TARGET: {target_label}",                    (10, 35),  cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255,255,255), 2)
    cv2.putText(frame, f"PRED:   {pred_label}  ({pred_conf:.2f})",   (10, 75),  cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255,255,255), 2)
    cv2.putText(frame, feedback,                                      (10, 115), cv2.FONT_HERSHEY_SIMPLEX, 0.9, fb_color, 2)
    cv2.putText(frame, f"ACCURACY: {acc:.2f}  ({score_correct}/{score_total})", (10, 155), cv2.FONT_HERSHEY_SIMPLEX, 0.75,(255,255,255), 2)
    cv2.putText(frame, "'n' new sign | 'q' quit",                    (10, frame.shape[0]-15), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180,180,180), 1)

    cv2.imshow("EDUSign - Real-Time Quiz", frame)

    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('n'):
        target_label = random.choice(CLASSES)
        last_check   = 0.0

detector.close()
cap.release()
cv2.destroyAllWindows()
