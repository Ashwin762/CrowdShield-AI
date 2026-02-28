from ultralytics import YOLO
import cv2
import math
import numpy as np
import joblib
from collections import defaultdict, deque

# ----------------------------
# Load Detection Model
# ----------------------------
yolo_model = YOLO("yolov8n.pt")

# ----------------------------
# Load ML Risk Model
# ----------------------------
risk_model = joblib.load("crowd_risk_model.pkl")

cap = cv2.VideoCapture("sample.mp4")

if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# ----------------------------
# Configuration
# ----------------------------
GRID_ROWS = 4
GRID_COLS = 4

MIN_MOVEMENT = 5
SMOOTH_WINDOW = 5

# ----------------------------
# State Storage
# ----------------------------
previous_positions = {}
speed_history = defaultdict(lambda: deque(maxlen=SMOOTH_WINDOW))

# ----------------------------
# Main Loop
# ----------------------------
while True:
    ret, frame = cap.read()
    if not ret:
        break

    height, width = frame.shape[:2]
    zone_counts = np.zeros((GRID_ROWS, GRID_COLS))

    results = yolo_model.track(frame, persist=True, classes=[0], conf=0.4)
    annotated_frame = frame.copy()

    person_count = 0
    total_speed = 0
    moving_people = 0

    if results[0].boxes is not None and results[0].boxes.id is not None:
        boxes = results[0].boxes
        ids = boxes.id.cpu().numpy()
        xyxy = boxes.xyxy.cpu().numpy()

        person_count = len(ids)

        for i, person_id in enumerate(ids):
            x1, y1, x2, y2 = xyxy[i]
            center_x = int((x1 + x2) / 2)
            center_y = int((y1 + y2) / 2)

            # Speed calculation
            if person_id in previous_positions:
                prev_x, prev_y = previous_positions[person_id]
                distance = math.sqrt(
                    (center_x - prev_x) ** 2 +
                    (center_y - prev_y) ** 2
                )

                if distance > MIN_MOVEMENT:
                    speed_history[person_id].append(distance)
                else:
                    speed_history[person_id].append(0)

                smoothed_speed = sum(speed_history[person_id]) / len(speed_history[person_id])
                total_speed += smoothed_speed
                moving_people += 1

            previous_positions[person_id] = (center_x, center_y)

            # Zone counting
            row = int(center_y / height * GRID_ROWS)
            col = int(center_x / width * GRID_COLS)

            if 0 <= row < GRID_ROWS and 0 <= col < GRID_COLS:
                zone_counts[row, col] += 1

            cv2.rectangle(
                annotated_frame,
                (int(x1), int(y1)),
                (int(x2), int(y2)),
                (0, 255, 0),
                2
            )

    avg_speed = total_speed / moving_people if moving_people > 0 else 0
    max_zone_density = int(np.max(zone_counts))

    # ----------------------------
    # ML Prediction
    # ----------------------------
    features = np.array([[person_count, avg_speed, max_zone_density]])
    prediction = risk_model.predict(features)[0]
    probability = risk_model.predict_proba(features)[0][1]

    if prediction == 1:
        status = "DANGER"
        color = (0, 0, 255)
    else:
        status = "SAFE"
        color = (0, 255, 0)

    # ----------------------------
    # Heatmap Overlay
    # ----------------------------
    for r in range(GRID_ROWS):
        for c in range(GRID_COLS):
            count = zone_counts[r, c]

            x1 = int(c * width / GRID_COLS)
            y1 = int(r * height / GRID_ROWS)
            x2 = int((c + 1) * width / GRID_COLS)
            y2 = int((r + 1) * height / GRID_ROWS)

            if count > 5:
                overlay = annotated_frame.copy()
                cv2.rectangle(
                    overlay,
                    (x1, y1),
                    (x2, y2),
                    (0, 0, 255),
                    -1
                )
                cv2.addWeighted(overlay, 0.3, annotated_frame, 0.7, 0, annotated_frame)

    # ----------------------------
    # Display Info
    # ----------------------------
    cv2.putText(
        annotated_frame,
        f"People: {person_count}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2
    )

    cv2.putText(
        annotated_frame,
        f"Avg Speed: {avg_speed:.2f}",
        (20, 80),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2
    )

    cv2.putText(
        annotated_frame,
        f"Max Zone Density: {max_zone_density}",
        (20, 120),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2
    )

    cv2.putText(
        annotated_frame,
        f"Risk Probability: {probability:.2f}",
        (20, 160),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2
    )

    cv2.putText(
        annotated_frame,
        f"Status: {status}",
        (20, 200),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2
    )

    cv2.imshow("CrowdShield - ML Risk Monitor", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()