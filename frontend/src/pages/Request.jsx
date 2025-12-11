// src/pages/Request.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { predictFraud } from "@/services/api";

const Request = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    time_since_last_txn: "",
    channel: "online",
    merchant_category: "electronics",
    country: "IN",
    time_of_day: "morning",
    day_of_week: "mon",
    previous_24h_txns: "",
    avg_amount_7d: "",
    chargeback_history: "no",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // validation (same as you had)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount) newErrors.amount = "Amount is required";
    else if (isNaN(Number(formData.amount)) || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Amount must be a positive number";

    if (!formData.time_since_last_txn)
      newErrors.time_since_last_txn = "Time since last transaction is required";
    else if (
      isNaN(Number(formData.time_since_last_txn)) ||
      parseFloat(formData.time_since_last_txn) < 0
    )
      newErrors.time_since_last_txn = "Time must be a non-negative number";

    if (formData.previous_24h_txns === "")
      newErrors.previous_24h_txns = "Previous 24h transactions is required";
    else if (
      isNaN(Number(formData.previous_24h_txns)) ||
      parseInt(formData.previous_24h_txns) < 0
    )
      newErrors.previous_24h_txns = "Must be a non-negative integer";

    if (!formData.avg_amount_7d)
      newErrors.avg_amount_7d = "Average amount (7 days) is required";
    else if (
      isNaN(Number(formData.avg_amount_7d)) ||
      parseFloat(formData.avg_amount_7d) < 0
    )
      newErrors.avg_amount_7d = "Average amount must be a non-negative number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const fillSampleData = () => {
    setFormData({
      amount: "2500.75",
      time_since_last_txn: "45",
      channel: "online",
      merchant_category: "electronics",
      country: "IN",
      time_of_day: "evening",
      day_of_week: "fri",
      previous_24h_txns: "3",
      avg_amount_7d: "1200.50",
      chargeback_history: "no",
    });
    toast.info("Sample data filled!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        time_since_last_txn: parseFloat(formData.time_since_last_txn),
        channel: formData.channel,
        merchant_category: formData.merchant_category,
        country: formData.country,
        time_of_day: formData.time_of_day,
        day_of_week: formData.day_of_week,
        previous_24h_txns: parseInt(formData.previous_24h_txns),
        avg_amount_7d: parseFloat(formData.avg_amount_7d),
        chargeback_history: formData.chargeback_history,
      };

      const result = await predictFraud(payload);

      // Save lastResult for Result page (backend returns probabilities & prediction)
      const prob = result.fraud_probability ?? result.probability ?? 0;
      sessionStorage.setItem(
        "lastResult",
        JSON.stringify({
          payload,
          prediction: result.prediction,
          fraud_probability: prob,
          ml_probability: result.ml_probability ?? null,
          rule_probability: result.rule_probability ?? null,
          risk_bonus: result.risk_bonus ?? null,
          timestamp: new Date().toISOString(),
        })
      );

      toast.success("Analysis complete!");
      navigate("/result");
    } catch (err) {
      console.error("API error:", err);
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to analyze transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Fraud Detection Request</h1>
        <p className="text-muted-foreground mb-8">
          Enter transaction details to check for potential fraud
        </p>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Amount & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Transaction Amount (₹) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="any"
                  placeholder="e.g., 1250.50"
                  value={formData.amount}
                  onChange={handleChange}
                  className={errors.amount ? "border-destructive" : ""}
                />
                {errors.amount && (
                  <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.amount}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_since_last_txn">
                  Time Since Last Transaction (minutes) *
                </Label>
                <Input
                  id="time_since_last_txn"
                  name="time_since_last_txn"
                  type="number"
                  step="any"
                  placeholder="e.g., 30"
                  value={formData.time_since_last_txn}
                  onChange={handleChange}
                  className={
                    errors.time_since_last_txn ? "border-destructive" : ""
                  }
                />
                {errors.time_since_last_txn && (
                  <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.time_since_last_txn}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Channel / Merchant / Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="channel">Channel</Label>
                <select
                  id="channel"
                  name="channel"
                  value={formData.channel}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  <option value="online">Online</option>
                  <option value="pos">POS (In-store)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="merchant_category">Merchant Category</Label>
                <select
                  id="merchant_category"
                  name="merchant_category"
                  value={formData.merchant_category}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  <option value="electronics">Electronics</option>
                  <option value="groceries">Groceries</option>
                  <option value="clothing">Clothing</option>
                  <option value="travel">Travel</option>
                  <option value="gaming">Gaming</option>
                  <option value="utilities">Utilities</option>
                  <option value="restaurants">Restaurants</option>
                  <option value="fuel">Fuel</option>
                </select>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  <option value="IN">India (IN)</option>
                  <option value="US">United States (US)</option>
                  <option value="UK">United Kingdom (UK)</option>
                  <option value="CA">Canada (CA)</option>
                  <option value="AU">Australia (AU)</option>
                  <option value="SG">Singapore (SG)</option>
                </select>
              </div>
            </div>

            {/* Time of day / Day / Chargeback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="time_of_day">Time of Day</Label>
                <select
                  id="time_of_day"
                  name="time_of_day"
                  value={formData.time_of_day}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>

              <div>
                <Label htmlFor="day_of_week">Day of Week</Label>
                <select
                  id="day_of_week"
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  <option value="mon">Monday</option>
                  <option value="tue">Tuesday</option>
                  <option value="wed">Wednesday</option>
                  <option value="thu">Thursday</option>
                  <option value="fri">Friday</option>
                  <option value="sat">Saturday</option>
                  <option value="sun">Sunday</option>
                </select>
              </div>

              <div>
                <Label htmlFor="chargeback_history">Previous Chargeback</Label>
                <select
                  id="chargeback_history"
                  name="chargeback_history"
                  value={formData.chargeback_history}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            {/* Previous 24h & Avg 7d */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="previous_24h_txns">Transactions in Last 24h *</Label>
                <Input
                  id="previous_24h_txns"
                  name="previous_24h_txns"
                  type="number"
                  step="1"
                  placeholder="e.g., 3"
                  value={formData.previous_24h_txns}
                  onChange={handleChange}
                />
                {errors.previous_24h_txns && (
                  <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.previous_24h_txns}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="avg_amount_7d">Average Amount (Last 7 Days) *</Label>
                <Input
                  id="avg_amount_7d"
                  name="avg_amount_7d"
                  type="number"
                  step="any"
                  placeholder="e.g., 800.00"
                  value={formData.avg_amount_7d}
                  onChange={handleChange}
                />
                {errors.avg_amount_7d && (
                  <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.avg_amount_7d}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info + Buttons */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">How it works</h3>
              <p className="text-sm">
                You provide readable transaction details. The backend converts these into internal features (V1–V28) and runs the model.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Button type="button" variant="outline" className="md:w-1/3" onClick={fillSampleData}>
                Fill Sample Data
              </Button>
              <Button type="submit" className="flex-1" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Transaction...
                  </>
                ) : (
                  "Check for Fraud"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>All transaction data is processed securely and converted to internal features before analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default Request;
