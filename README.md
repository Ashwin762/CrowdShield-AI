# 🚨 CrowdShield AI

CrowdShield AI is a real-time crowd intelligence system built using Deep Learning and Computer Vision.

It detects, tracks, and analyzes crowd density from:

- 📂 Uploaded video files  
- 📷 Live webcam streams  
- 🎥 RTSP CCTV feeds  

The system provides real-time analytics and automatically triggers danger alerts when crowd density exceeds a defined threshold.

---

## 🧠 Core Capabilities

- Real-time person detection using YOLOv8 (Deep Learning)
- Multi-object tracking with unique ID assignment
- Accurate unique crowd counting
- CPU-optimized frame processing
- Upload video mode
- Live webcam monitoring
- RTSP CCTV stream support
- Automatic threshold-based crowd alert system
- Cinematic Apple-style frontend dashboard

---

## 🏗 System Architecture

1. Video Source (Upload / Webcam / RTSP)
2. Frame Extraction using OpenCV
3. YOLOv8 Object Detection + Tracking
4. Unique ID Tracking & Feature Extraction
5. Threshold-based Risk Evaluation
6. Real-time Stream Rendering to React Dashboard

---

## ⚙️ Tech Stack

### Backend
- Python
- FastAPI
- Ultralytics YOLOv8
- OpenCV

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion

---

## 🚀 How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ashwin762/CrowdShield-AI.git
cd CrowdShield-AI