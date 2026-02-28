from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
import cv2
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

yolo_model = YOLO("yolov8n.pt")

video_source = None
stop_stream = False
stream_active = False

THRESHOLD = 5

analysis_data = {
    "total_frames": 0,
    "unique_ids": set(),
    "video_finished": False,
    "current_people": 0,
    "danger": False
}


def reset_analysis():
    global analysis_data
    analysis_data = {
        "total_frames": 0,
        "unique_ids": set(),
        "video_finished": False,
        "current_people": 0,
        "danger": False
    }


def generate_frames():
    global analysis_data, video_source, stop_stream, stream_active

    cap = cv2.VideoCapture(video_source)
    reset_analysis()

    stop_stream = False
    stream_active = True

    frame_skip = 2
    frame_count = 0

    while True:
        if stop_stream:
            break

        success, frame = cap.read()
        if not success:
            break

        frame_count += 1
        if frame_count % frame_skip != 0:
            continue

        frame = cv2.resize(frame, (640, 480))

        results = yolo_model.track(frame, persist=True, classes=[0])
        annotated_frame = results[0].plot()

        current_people = 0
        if results[0].boxes is not None:
            current_people = len(results[0].boxes)

        analysis_data["current_people"] = current_people
        analysis_data["danger"] = current_people > THRESHOLD

        if results[0].boxes is not None and results[0].boxes.id is not None:
            ids = results[0].boxes.id.cpu().numpy()
            for person_id in ids:
                analysis_data["unique_ids"].add(int(person_id))

        analysis_data["total_frames"] += 1

        ret, buffer = cv2.imencode(".jpg", annotated_frame)
        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
        )

    cap.release()
    stream_active = False
    analysis_data["video_finished"] = True


@app.post("/start")
async def start_analysis(
    mode: str = Form(...),
    video: UploadFile = File(None),
    rtsp_url: str = Form(None)
):
    global video_source, stop_stream, stream_active

    # Force stop any existing stream
    stop_stream = True

    # Wait briefly for cleanup
    if stream_active:
        import time
        time.sleep(0.5)

    stop_stream = False

    if mode == "upload":
        temp_path = "temp_upload.mp4"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        video_source = temp_path

    elif mode == "webcam":
        video_source = 0

    elif mode == "rtsp":
        video_source = rtsp_url

    reset_analysis()

    return {"message": "Source set"}


@app.post("/stop")
def stop_analysis():
    global stop_stream
    stop_stream = True
    return {"message": "Stream stopped"}


@app.get("/stream")
def stream():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/results")
def results():
    return {
        "total_frames": analysis_data["total_frames"],
        "unique_people": len(analysis_data["unique_ids"]),
        "current_people": analysis_data["current_people"],
        "danger": analysis_data["danger"],
        "video_finished": analysis_data["video_finished"]
    }