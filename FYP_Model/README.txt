EDUSign – Interactive Sign Recognition Prototype

This project demonstrates a hand landmark–based sign language recognition system.

Contents:
- models/sign_cnn.h5 : Trained CNN model
- models/labels.npy  : Class labels
- data/processed/landmarks_full_dataset.npz : Processed landmark dataset
- src/realtime_quiz.py : Real-time webcam prototype
- notebook/EDUSign_Training.ipynb : Training and evaluation notebook
- results/ : Accuracy plots and confusion matrix

Step 1: Download Project

* Download the EDUSign folder from the provided Google Drive link.
* Extract the folder to any location (recommended: D:\EDUSign).

Step 2: How to run the prototype (optional):

1. Install Python 3.13.9
2. Install required libraries:
   pip install tensorflow mediapipe opencv-python numpy
   [versions: 
          Open CV - 4.13.0  (pip install opencv-python==4.13.0.0)
          Media Pipe - 0.10.9 (pip install mediapipe==0.10.9)
          Tensorflow - 2.12.0 (pip install tensorflow==2.12.0)]
3. Run:
   python src/realtime_quiz.py
4. Show the requested hand sign on webcam.

Alternatively:
- Please refer to demo_video.mp4 for a full demonstration of functionality.
