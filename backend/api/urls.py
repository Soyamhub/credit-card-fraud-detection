from django.urls import path
from .views import PredictFraud

urlpatterns = [
    path('predict/', PredictFraud.as_view(), name='predict-fraud'),
]
