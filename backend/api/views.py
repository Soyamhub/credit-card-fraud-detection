# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FraudPredictionSerializer
from .utils import model, scaler
from .feature_mapping import build_model_features_from_friendly  # <-- helper
import numpy as np
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "ml_models")

with open(os.path.join(MODEL_DIR, "feature_means.json"), "r") as f:
    feature_means = json.load(f)

FEATURE_ORDER = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]


# -------------------------------------------------------------------
# 1) Rule-based risk using human-friendly fields (0..1)
# -------------------------------------------------------------------
def rule_based_risk(data):
    """
    Very simple heuristic risk score in [0,1].
    Uses the HUMAN-FRIENDLY fields (amount, previous_24h_txns, etc.).
    This is only for demo, not a real fraud engine.
    """

    # DRF validated_data is a dict with python types already
    amount = float(data.get("amount") or data.get("Amount") or 0.0)
    avg_7d = float(data.get("avg_amount_7d") or amount or 0.0)
    prev_24h = float(data.get("previous_24h_txns") or 0.0)
    channel = (data.get("channel") or "").lower()
    tod = (data.get("time_of_day") or "").lower()
    country = (data.get("country") or "").upper()
    chargeback = str(data.get("chargeback_history") or "no").lower()

    points = 0

    # Very large compared to normal spending
    if avg_7d > 0 and amount > 3 * avg_7d:
        points += 3
    elif avg_7d > 0 and amount > 2 * avg_7d:
        points += 2

    # Many transactions in last 24h
    if prev_24h >= 10:
        points += 3
    elif prev_24h >= 5:
        points += 2

    # Risky time/channel combo
    if channel == "online" and tod in ("evening", "night"):
        points += 2

    # Previous chargeback history
    if chargeback == "yes":
        points += 3

    # Foreign country (for demo, treat non-IN as a bit riskier)
    if country not in ("IN",):
        points += 1

    # Max possible ~11 → normalize to [0,1]
    max_points = 11.0
    return min(points / max_points, 1.0)


class PredictFraud(APIView):
    def post(self, request):
        serializer = FraudPredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # ---------------------------------------------------------
        # 2) Decide which mode to use (low-level vs human-friendly)
        # ---------------------------------------------------------
        has_low_level = any(
            key in data
            for key in (["Time", "Amount"] + [f"V{i}" for i in range(1, 29)])
        )

        if has_low_level:
            # OLD behaviour: user sends Time, V1..V28, Amount directly
            features = []
            for feat in FEATURE_ORDER:
                features.append(data.get(feat, feature_means.get(feat, 0.0)))
        else:
            # NEW behaviour: build features from human-friendly fields
            features = build_model_features_from_friendly(
                data=data,
                feature_means=feature_means,
                feature_order=FEATURE_ORDER,
            )

        # ---------------------------------------------------------
        # 3) Run through scaler + ML model
        # ---------------------------------------------------------
        features = np.array(features)
        features_scaled = scaler.transform([features])

        # ML model probability for fraud
        ml_prob = float(model.predict_proba(features_scaled)[0][1])

        # ---------------------------------------------------------
        # 4) Rule-based risk + risk bonus (only for friendly mode)
        # ---------------------------------------------------------
        rules_prob = 0.0
        risk_bonus = 0.0

        if not has_low_level:
            # main rule-based score
            rules_prob = float(rule_based_risk(data))

            # extra risk bonus like in your earlier code
            amount = float(data.get("amount", 0.0))
            prev24 = float(data.get("previous_24h_txns", 0.0))
            avg7d = float(data.get("avg_amount_7d", 0.0))
            chargeback_flag = (
                str(data.get("chargeback_history", "no")).lower() == "yes"
            )
            foreign = data.get("country", "IN") != "IN"

            # big amount
            if amount > 5000:
                risk_bonus += 0.2
            if amount > 10000:
                risk_bonus += 0.2

            # burst of many txns
            if prev24 >= 5:
                risk_bonus += 0.15
            if prev24 >= 10:
                risk_bonus += 0.15

            # amount much larger than usual
            if avg7d > 0 and amount > 2 * avg7d:
                risk_bonus += 0.1

            # past chargebacks
            if chargeback_flag:
                risk_bonus += 0.2

            # foreign country (for demo)
            if foreign:
                risk_bonus += 0.1

        # clamp risk_bonus
        risk_bonus = max(0.0, min(1.0, risk_bonus))

        # ---------------------------------------------------------
        # 5) Combine ML + rules + bonus into final probability
        # ---------------------------------------------------------
        # If we have human-friendly fields:
        #   combined = 0.5 * ml_prob + 0.5 * rules_prob + risk_bonus
        # If low-level only, just trust ML.
        if not has_low_level:
            combined_prob = 0.5 * ml_prob + 0.5 * rules_prob + risk_bonus
        else:
            combined_prob = ml_prob

        # clamp final prob to [0,1]
        combined_prob = max(0.0, min(1.0, combined_prob))

        # Threshold for final decision
        threshold = 0.5
        prediction = 1 if combined_prob >= threshold else 0

        return Response(
            {
                "prediction": int(prediction),
                "fraud_probability": combined_prob,
                "ml_probability": ml_prob,
                "rule_probability": rules_prob,
                "risk_bonus": risk_bonus,
            }
        )
