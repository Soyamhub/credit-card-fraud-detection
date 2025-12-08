# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FraudPredictionSerializer
from .utils import model, scaler
from .feature_mapping import build_model_features_from_friendly  # <-- new helper
import numpy as np
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'ml_models')

with open(os.path.join(MODEL_DIR, 'feature_means.json'), 'r') as f:
    feature_means = json.load(f)

FEATURE_ORDER = ['Time'] + [f'V{i}' for i in range(1, 29)] + ['Amount']


class PredictFraud(APIView):
    def post(self, request):
        serializer = FraudPredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # --------- Decide which mode to use ----------
        # Mode 1: user sends raw model features (Time, V1–V28, Amount)
        has_low_level = any(
            key in data
            for key in (['Time', 'Amount'] + [f'V{i}' for i in range(1, 29)])
        )

        if has_low_level:
            # ---- OLD BEHAVIOUR (no change) ----
            features = []
            for feat in FEATURE_ORDER:
                features.append(data.get(feat, feature_means.get(feat, 0.0)))

        else:
            # ---- NEW: build V1–V28 from human-friendly fields ----
            features = build_model_features_from_friendly(
                data=data,
                feature_means=feature_means,
                feature_order=FEATURE_ORDER,
            )

        features = np.array(features)
        features_scaled = scaler.transform([features])

        prob = model.predict_proba(features_scaled)[0][1]

        threshold = 0.3
        prediction = 1 if prob >= threshold else 0

        return Response({
            'prediction': int(prediction),
            'fraud_probability': float(prob),
        })
