import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Request = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    time: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    
    if (!formData.time) {
      newErrors.time = "Time is required";
    } else if (isNaN(Number(formData.time)) || parseInt(formData.time) < 0) {
      newErrors.time = "Time must be a non-negative number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock prediction logic
      const prediction = parseFloat(formData.amount) > 5000 ? "Fraud" : "Safe";
      const confidence = Math.random() * 20 + 80; // 80-100%
      
      // Store result in sessionStorage to pass to Result page
      sessionStorage.setItem('lastResult', JSON.stringify({
        amount: formData.amount,
        time: formData.time,
        prediction,
        confidence: confidence.toFixed(2),
        timestamp: new Date().toISOString()
      }));
      
      setLoading(false);
      toast.success("Analysis complete!");
      navigate("/result");
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-2">Fraud Detection Request</h1>
        <p className="text-muted-foreground mb-8">
          Enter transaction details to check for potential fraud
        </p>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Field */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-semibold">
                Transaction Amount ($)
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="e.g., 1250.50"
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.amount}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Enter the transaction amount in USD
              </p>
            </div>

            {/* Time Field */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-base font-semibold">
                Transaction Time (seconds)
              </Label>
              <Input
                id="time"
                name="time"
                type="number"
                placeholder="e.g., 12345"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? "border-destructive" : ""}
              />
              {errors.time && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.time}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Time in seconds since epoch or transaction start
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                How it works
              </h3>
              <p className="text-sm text-muted-foreground">
                Our machine learning model analyzes transaction patterns using RandomForest 
                algorithm with SMOTE and StandardScaler preprocessing to detect anomalies 
                that may indicate fraudulent activity.
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Transaction...
                </>
              ) : (
                "Check for Fraud"
              )}
            </Button>
          </form>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            All transaction data is processed securely and confidentially. 
            Results are generated in real-time using our trained ML model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Request;
