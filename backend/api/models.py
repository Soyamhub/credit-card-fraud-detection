from django.conf import settings
from django.db import models


class Transaction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )

    # store the *human friendly* fields you already send from frontend
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    time_since_last_txn = models.FloatField()
    channel = models.CharField(max_length=20)
    merchant_category = models.CharField(max_length=50)
    country = models.CharField(max_length=5)
    time_of_day = models.CharField(max_length=20)
    day_of_week = models.CharField(max_length=10)
    previous_24h_txns = models.IntegerField()
    avg_amount_7d = models.DecimalField(max_digits=10, decimal_places=2)
    chargeback_history = models.BooleanField()

    # model outputs
    prediction = models.IntegerField()      # 0 = safe, 1 = fraud
    fraud_probability = models.FloatField()
    ml_probability = models.FloatField()
    rule_probability = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.prediction}"
