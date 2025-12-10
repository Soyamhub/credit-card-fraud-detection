from django.urls import path
from .views import PredictFraud, MyTransactions
from .views_auth import register_user

urlpatterns = [
    path("auth/register/", register_user, name="register"),
    path('predict/', PredictFraud.as_view(), name='predict-fraud'),
    path("my-transactions/", MyTransactions.as_view(), name="my_transactions"),
]

