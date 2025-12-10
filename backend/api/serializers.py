# api/serializers.py
from rest_framework import serializers
from .models import Transaction

class FraudPredictionSerializer(serializers.Serializer):
    # -------- NEW: human-friendly fields (front-end) --------
    amount = serializers.FloatField(required=False)  # transaction amount
    time_since_last_txn = serializers.FloatField(required=False)  # in minutes/hours
    channel = serializers.ChoiceField(
        choices=['online', 'pos', 'atm'],
        required=False
    )
    merchant_category = serializers.ChoiceField(
        choices=['electronics', 'groceries', 'clothing', 'travel',
                 'gaming', 'utilities', 'restaurants', 'fuel'],
        required=False
    )
    country = serializers.ChoiceField(
        choices=['IN', 'US', 'UK', 'CA', 'AU', 'SG'],
        required=False
    )
    time_of_day = serializers.ChoiceField(
        choices=['morning', 'afternoon', 'evening', 'night'],
        required=False
    )
    day_of_week = serializers.ChoiceField(
        choices=['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        required=False
    )
    previous_24h_txns = serializers.IntegerField(required=False)
    avg_amount_7d = serializers.FloatField(required=False)
    chargeback_history = serializers.ChoiceField(
        choices=['yes', 'no'],
        required=False
    )

    # -------- OLD: low-level model features (internal / advanced mode) --------
    Time = serializers.FloatField(required=False)
    V1 = serializers.FloatField(required=False)
    V2 = serializers.FloatField(required=False)
    V3 = serializers.FloatField(required=False)
    V4 = serializers.FloatField(required=False)
    V5 = serializers.FloatField(required=False)
    V6 = serializers.FloatField(required=False)
    V7 = serializers.FloatField(required=False)
    V8 = serializers.FloatField(required=False)
    V9 = serializers.FloatField(required=False)
    V10 = serializers.FloatField(required=False)
    V11 = serializers.FloatField(required=False)
    V12 = serializers.FloatField(required=False)
    V13 = serializers.FloatField(required=False)
    V14 = serializers.FloatField(required=False)
    V15 = serializers.FloatField(required=False)
    V16 = serializers.FloatField(required=False)
    V17 = serializers.FloatField(required=False)
    V18 = serializers.FloatField(required=False)
    V19 = serializers.FloatField(required=False)
    V20 = serializers.FloatField(required=False)
    V21 = serializers.FloatField(required=False)
    V22 = serializers.FloatField(required=False)
    V23 = serializers.FloatField(required=False)
    V24 = serializers.FloatField(required=False)
    V25 = serializers.FloatField(required=False)
    V26 = serializers.FloatField(required=False)
    V27 = serializers.FloatField(required=False)
    V28 = serializers.FloatField(required=False)
    Amount = serializers.FloatField(required=False)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ("user", "created_at")