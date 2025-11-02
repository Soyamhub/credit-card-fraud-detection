import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve, precision_recall_curve
from imblearn.over_sampling import SMOTE
import joblib
import os
import json

DATASET_PATH = os.path.join('..', 'data', 'creditcard.csv')

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml_models')
os.makedirs(MODEL_DIR, exist_ok=True)

print("Loading dataset...")
df = pd.read_csv(DATASET_PATH)
print(df.head())

print("Class distribution:")
print(df['Class'].value_counts())

X = df.drop('Class', axis=1)
y = df['Class']

# Save feature means
feature_means = X.mean().to_dict()
means_path = os.path.join(MODEL_DIR, 'feature_means.json')
with open(means_path, 'w') as f:
    json.dump(feature_means, f)
print(f"Feature means saved as {means_path}")

# Scale all features
print("Scaling all features...")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X = pd.DataFrame(X_scaled, columns=X.columns)

print("Handling class imbalance with SMOTE...")
sm = SMOTE(random_state=42)
X_res, y_res = sm.fit_resample(X, y)

print("Splitting data into train and test sets...")
X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.3, random_state=42)

# Hyperparameter tuning with GridSearchCV
print("Starting hyperparameter tuning with GridSearchCV...")
param_grid = {
    'n_estimators': [50],         # Only 1 value
    'max_depth': [None, 10],      # Only 2 values
    'min_samples_split': [2],     # Only 1 value
    'min_samples_leaf': [1], 
}

rf = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=2, n_jobs=-1, scoring='roc_auc')
grid_search.fit(X_train, y_train)

print("Best parameters found:", grid_search.best_params_)

model = grid_search.best_estimator_

print("Evaluating best model...")
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))

cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()

fpr, tpr, _ = roc_curve(y_test, y_prob)
plt.plot(fpr, tpr, label=f"AUC = {roc_auc_score(y_test, y_prob):.2f}")
plt.plot([0, 1], [0, 1], 'k--')
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve")
plt.legend()
plt.show()

# Precision-Recall curve for threshold tuning
precision, recall, thresholds = precision_recall_curve(y_test, y_prob)
plt.plot(thresholds, precision[:-1], label='Precision')
plt.plot(thresholds, recall[:-1], label='Recall')
plt.xlabel('Threshold')
plt.ylabel('Score')
plt.title('Precision and Recall vs Threshold')
plt.legend()
plt.show()

# Feature importances
importances = model.feature_importances_
feature_names = X.columns
feat_imp = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)

print("Top 10 feature importances:")
for f, imp in feat_imp[:10]:
    print(f"{f}: {imp:.4f}")

# Save model and scaler
model_path = os.path.join(MODEL_DIR, 'fraudmodel.pkl')
scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')

joblib.dump(model, model_path)
joblib.dump(scaler, scaler_path)

print(f"Model saved as {model_path}")
print(f"Scaler saved as {scaler_path}")
