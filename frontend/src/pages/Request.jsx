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
    Time: "",
    V1: "",
    V2: "",
    V3: "",
    V4: "",
    V5: "",
    V6: "",
    V7: "",
    V8: "",
    V9: "",
    V10: "",
    V11: "",
    V12: "",
    V13: "",
    V14: "",
    V15: "",
    V16: "",
    V17: "",
    V18: "",
    V19: "",
    V20: "",
    V21: "",
    V22: "",
    V23: "",
    V24: "",
    V25: "",
    V26: "",
    V27: "",
    V28: "",
    Amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Amount) {
      newErrors.Amount = "Amount is required";
    } else if (isNaN(Number(formData.Amount)) || parseFloat(formData.Amount) <= 0) {
      newErrors.Amount = "Amount must be a positive number";
    }
    
    if (!formData.Time) {
      newErrors.Time = "Time is required";
    } else if (isNaN(Number(formData.Time)) || parseInt(formData.Time) < 0) {
      newErrors.Time = "Time must be a non-negative number";
    }

    // Validate V1-V28 fields
    for (let i = 1; i <= 28; i++) {
      const field = `V${i}`;
      if (!formData[field]) {
        newErrors[field] = `V${i} is required`;
      } else if (isNaN(Number(formData[field]))) {
        newErrors[field] = `V${i} must be a number`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    
    try {
      // Convert all form values to numbers
      const numericData = {};
      for (let key in formData) {
        numericData[key] = parseFloat(formData[key]);
      }

      // Call the backend API
      const result = await predictFraud(numericData);
      
      // Store result to pass to Result page
      sessionStorage.setItem('lastResult', JSON.stringify({
        ...numericData,
        prediction: result.prediction,
        probability: result.probability,
        timestamp: new Date().toISOString()
      }));
      
      toast.success("Analysis complete!");
      navigate("/result");
      
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error.response?.data?.error || 
        "Failed to analyze transaction. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Fill sample data for testing
  const fillSampleData = () => {
    setFormData({
      Time: "406",
      V1: "-2.3122265423263",
      V2: "1.95199201064158",
      V3: "-1.60985073229769",
      V4: "3.99790659274637",
      V5: "-0.522187864667764",
      V6: "-1.42654531920595",
      V7: "-2.53738730624579",
      V8: "1.39165724829804",
      V9: "-2.77008927719433",
      V10: "-2.77227214465915",
      V11: "3.20203320709635",
      V12: "-2.89990738849473",
      V13: "-0.595221881324605",
      V14: "-4.28925378244217",
      V15: "0.389724120274487",
      V16: "-1.14074717980657",
      V17: "-2.83005567450437",
      V18: "-0.0168224681808257",
      V19: "0.416955705037907",
      V20: "0.126910559061474",
      V21: "0.517232370861764",
      V22: "-0.0350493686052974",
      V23: "-0.465211076182388",
      V24: "0.320198198514526",
      V25: "0.0445191674731724",
      V26: "0.177839798284401",
      V27: "0.261145002567677",
      V28: "-0.143275874698919",
      Amount: "0"
    });
    toast.info("Sample data filled!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Fraud Detection Request</h1>
        <p className="text-muted-foreground mb-8">
          Enter transaction details to check for potential fraud
        </p>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primary Fields - Amount and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount Field */}
              <div className="space-y-2">
                <Label htmlFor="Amount" className="text-base font-semibold">
                  Transaction Amount ($) *
                </Label>
                <Input
                  id="Amount"
                  name="Amount"
                  type="number"
                  step="any"
                  placeholder="e.g., 1250.50"
                  value={formData.Amount}
                  onChange={handleChange}
                  className={errors.Amount ? "border-destructive" : ""}
                />
                {errors.Amount && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.Amount}</span>
                  </div>
                )}
              </div>

              {/* Time Field */}
              <div className="space-y-2">
                <Label htmlFor="Time" className="text-base font-semibold">
                  Transaction Time (seconds) *
                </Label>
                <Input
                  id="Time"
                  name="Time"
                  type="number"
                  step="any"
                  placeholder="e.g., 12345"
                  value={formData.Time}
                  onChange={handleChange}
                  className={errors.Time ? "border-destructive" : ""}
                />
                {errors.Time && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.Time}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PCA Features V1-V28 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  PCA Features (V1-V28) *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillSampleData}
                >
                  Fill Sample Data
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => {
                  const fieldName = `V${num}`;
                  return (
                    <div key={num} className="space-y-1">
                      <Label htmlFor={fieldName} className="text-xs">
                        V{num}
                      </Label>
                      <Input
                        id={fieldName}
                        name={fieldName}
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={formData[fieldName]}
                        onChange={handleChange}
                        className={`text-sm ${errors[fieldName] ? "border-destructive" : ""}`}
                      />
                    </div>
                  );
                })}
              </div>
              
              {Object.keys(errors).some(key => key.startsWith('V')) && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>All V1-V28 fields must be filled with numeric values</span>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                How it works
              </h3>
              <p className="text-sm text-muted-foreground">
                Our machine learning model analyzes transaction patterns using RandomForest 
                algorithm with SMOTE and StandardScaler preprocessing. The V1-V28 features 
                are PCA-transformed components that capture transaction patterns while 
                maintaining privacy.
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
