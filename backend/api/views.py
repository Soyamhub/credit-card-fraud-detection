from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FraudPredictionSerializer
from .utils import model, scaler
import numpy as np
import json
import os

# Assume your ml_models directory is same as training script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Parent directory of api folder
MODEL_DIR = os.path.join(BASE_DIR, 'ml_models')

# Load feature means file
with open(os.path.join(MODEL_DIR, 'feature_means.json'), 'r') as f:
    feature_means = json.load(f)

class PredictFraud(APIView):
    def post(self, request):
        serializer = FraudPredictionSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            feature_order = ['Time'] + [f'V{i}' for i in range(1,29)] + ['Amount']

            features = []
            for feat in feature_order:
                features.append(data.get(feat, feature_means.get(feat, 0)))

            features = np.array(features)
            features_scaled = scaler.transform([features])
            
            prob = model.predict_proba(features_scaled)[0][1]
            
            # Use custom threshold here, adjust as needed
            threshold = 0.3
            prediction = 1 if prob >= threshold else 0

            return Response({
                'prediction': int(prediction),
                'fraud_probability': float(prob),
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)