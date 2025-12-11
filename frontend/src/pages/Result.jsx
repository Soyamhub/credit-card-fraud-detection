// src/pages/Result.jsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("lastResult");
    if (raw) {
      setResult(JSON.parse(raw));
    } else {
      setResult(null);
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen p-6">
        <div className="container mx-auto">
          <Card className="p-6 text-center">
            <h3 className="text-xl font-semibold">No analysis available</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Run a transaction analysis from the Request page first.
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate("/request")}>Go to Request</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Interpret values
  const predLabel =
    result.prediction === 1 || result.prediction === "1"
      ? "Fraud"
      : result.prediction === 0 || result.prediction === "0"
      ? "Safe"
      : "-";

  // friendly risk level text (don't show raw probabilities)
  const riskText =
    predLabel === "Fraud"
      ? "High Risk — review and act"
      : predLabel === "Safe"
      ? "Low Risk — likely legitimate"
      : "Unknown";

  const payload = result.payload ?? {
    amount: result.amount ?? null,
    time_since_last_txn: result.time_since_last_txn ?? null,
    channel: result.channel ?? null,
    merchant_category: result.merchant_category ?? null,
    country: result.country ?? null,
    previous_24h_txns: result.previous_24h_txns ?? null,
    avg_amount_7d: result.avg_amount_7d ?? null,
    chargeback_history: result.chargeback_history ?? null,
  };

  // Helpful consumer tips (you can edit text to match your project's tone)
  const fraudTips = [
    "Contact your bank or card issuer immediately and report the transaction.",
    "Freeze or block the card used for this transaction (ask bank to reissue).",
    "Dispute the transaction formally with the bank — provide any evidence.",
    "Change online account passwords and enable two-factor authentication.",
    "Check recent transactions and notify the bank of any other suspicious items.",
    "If personal information was exposed, consider placing a fraud alert with credit bureaus.",
  ];

  const safeTips = [
    "No immediate action required — transaction appears legitimate.",
    "Keep an eye on your account for the next 24–48 hours for unexpected activity.",
    "If you do not recognize the merchant or amount later, contact the bank.",
    "Maintain good security: strong passwords and enable two-factor authentication.",
  ];

  const unknownTips = [
    "Analysis inconclusive. Try again with more accurate or additional details.",
    "Check the input fields for correctness (amount, merchant, country, etc.).",
  ];

  const tipsToShow =
    predLabel === "Fraud" ? fraudTips : predLabel === "Safe" ? safeTips : unknownTips;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Top alert */}
        <Card
          className={`p-6 mb-6 ${
            predLabel === "Fraud" ? "border-red-400" : "border-emerald-200"
          }`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {predLabel === "Fraud"
                ? "⚠️ Fraudulent Transaction Detected"
                : predLabel === "Safe"
                ? "✅ Transaction Looks Safe"
                : "Transaction Analysis"}
            </h2>

            <div className="mt-4">
              <Button
                variant={predLabel === "Fraud" ? "destructive" : "secondary"}
              >
                {predLabel === "Fraud" ? "FRAUD" : "SAFE"}
              </Button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{riskText}</p>
          </div>
        </Card>

        {/* Model Analysis (simple, no raw probs) */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-2">Model Analysis</h3>
          <div className="text-sm text-muted-foreground">Prediction</div>

          <div className="w-full bg-muted h-3 rounded-full my-3">
            <div
              className={`h-3 rounded-full ${
                predLabel === "Fraud" ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: predLabel === "Fraud" ? "85%" : "25%" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-6 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {predLabel === "-" ? "-" : predLabel === "Fraud" ? "1" : "0"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Prediction Value
              </div>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg text-center">
              <div className="text-lg font-semibold">{riskText}</div>
              <div className="text-sm text-muted-foreground mt-2">
                Risk Summary
              </div>
            </div>
          </div>

          {/* Tips preview */}
          <div className="mt-2">
            <h4 className="font-medium mb-2">Quick advice</h4>
            <p className="text-sm text-muted-foreground">
              {predLabel === "Fraud"
                ? "Take immediate action — follow the steps below."
                : predLabel === "Safe"
                ? "No urgent action required. Keep monitoring your account."
                : "Results are inconclusive."}
            </p>
          </div>
        </Card>

        {/* Transaction Summary */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Transaction Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div>
                <strong>Amount:</strong>{" "}
                {payload.amount != null ? `₹${Number(payload.amount).toFixed(2)}` : "-"}
              </div>
              <div>
                <strong>Time Since Last Txn:</strong>{" "}
                {payload.time_since_last_txn != null ? `${payload.time_since_last_txn} min` : "-"}
              </div>
              <div>
                <strong>Channel:</strong> {payload.channel ?? "-"}
              </div>
              <div>
                <strong>Merchant:</strong> {payload.merchant_category ?? "-"}
              </div>
            </div>

            <div>
              <div>
                <strong>Country:</strong> {payload.country ?? "-"}
              </div>
              <div>
                <strong>Previous 24h Txns:</strong> {payload.previous_24h_txns ?? "-"}
              </div>
              <div>
                <strong>Avg 7d Amount:</strong>{" "}
                {payload.avg_amount_7d != null ? `₹${Number(payload.avg_amount_7d).toFixed(2)}` : "-"}
              </div>
              <div>
                <strong>Chargeback History:</strong> {payload.chargeback_history ?? "-"}
              </div>
            </div>
          </div>
        </Card>

        {/* Actionable Tips */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">What you can do now</h3>

          <ul className="list-disc pl-5 space-y-2 text-sm mb-4">
            {tipsToShow.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>

          <div className="flex gap-3">
            {predLabel === "Fraud" && (
              <>
                <a
                  href="mailto:security@yourbank.example?subject=Report%20Suspected%20Fraud&body=I%20want%20to%20report%20a%20suspected%20fraudulent%20transaction."
                  className="inline-block"
                >
                  <Button variant="destructive">Contact Bank</Button>
                </a>

                <Button variant="outline" onClick={() => navigate("/transactions")}>
                  View My Transactions
                </Button>
              </>
            )}

            {predLabel === "Safe" && (
              <>
                <Button onClick={() => navigate("/request")}>Analyze Another</Button>
                <Button variant="outline" onClick={() => navigate("/transactions")}>
                  View Transactions
                </Button>
              </>
            )}

            {predLabel === "-" && (
              <Button onClick={() => navigate("/request")}>Try Again</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Result;
