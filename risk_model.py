import numpy as np
from sklearn.linear_model import LogisticRegression
import joblib

# Generate synthetic training data
np.random.seed(42)

X = []
y = []

for _ in range(1000):
    person_count = np.random.randint(0, 50)
    avg_speed = np.random.uniform(0, 10)
    max_zone_density = np.random.randint(0, 15)

    # Simulated logic for risk labeling
    if person_count > 25 and avg_speed < 3 and max_zone_density > 8:
        label = 1  # Dangerous
    else:
        label = 0  # Safe

    X.append([person_count, avg_speed, max_zone_density])
    y.append(label)

X = np.array(X)
y = np.array(y)

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "crowd_risk_model.pkl")

print("Model trained and saved.")