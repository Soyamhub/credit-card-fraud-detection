import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowLeft, BarChart3, Shield } from "lucide-react";

const Result = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Retrieve result from sessionStorage
    const storedResult = sessionStorage.getItem('lastResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Result Available</h2>
          <p className="text-muted-foreground mb-6">
            Please submit a transaction request first to see results.
          </p>
          <Link to="/request">
            <Button>Submit Transaction</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Backend returns prediction as 0 (safe) or 1 (fraud)
  const isFraud = result.prediction === 1;
  const confidence = result.probability ? (result.probability * 100).toFixed(2) : "N/A";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-3xl">
        <Link to="/request">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Request
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-2">Analysis Result</h1>
        <p className="text-muted-foreground mb-8">
          Fraud detection analysis completed
        </p>

        {/* Main Result Card */}
        <Card className={`p-8 mb-6 border-2 ${
          isFraud ? "border-destructive bg-destructive/5" : "border-green-500 bg-green-500/5"
        }`}>
          <div className="text-center">
            {isFraud ? (
              <AlertTriangle className="h-20 w-20 mx-auto mb-4 text-destructive" />
            ) : (
              <CheckCircle className="h-20 w-20 mx-auto mb-4 text-green-600" />
            )}
            
            <h2 className="text-3xl font-bold mb-2">
              {isFraud ? "⚠️ Fraudulent Transaction Detected" : "✅ Transaction Appears Safe"}
            </h2>
            
            <div className="mt-4 inline-block">
              <div className={`px-6 py-3 rounded-full text-lg font-semibold ${
                isFraud ? "bg-destructive text-destructive-foreground" : "bg-green-600 text-white"
              }`}>
                {isFraud ? "FRAUD" : "LEGITIMATE"}
              </div>
            </div>
          </div>
        </Card>

        {/* Model Confidence */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Model Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Prediction Confidence</span>
                <span className="text-sm font-semibold">{confidence}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    isFraud ? "bg-destructive" : "bg-green-600"
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{result.prediction}</p>
                <p className="text-xs text-muted-foreground mt-1">Prediction Value</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">
                  {isFraud ? "High Risk" : "Low Risk"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Risk Level</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Transaction Details */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Transaction Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction Amount</p>
                <p className="text-3xl font-bold text-primary">
                  ${parseFloat(result.Amount || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction Time</p>
                <p className="text-xl font-semibold">{result.Time} seconds</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Since first transaction
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Analysis Timestamp</p>
                <p className="text-lg font-semibold">
                  {new Date(result.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Features Analyzed</p>
                <p className="text-xl font-semibold">30 PCA Components</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Time, Amount, V1-V28
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* PCA Features Summary (Optional - can be collapsed) */}
        <Card className="p-6 mb-6">
          <details className="cursor-pointer">
            <summary className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span>📊 Feature Values</span>
              <span className="text-sm text-muted-foreground font-normal">(Click to expand)</span>
            </summary>
            <div className="mt-4 grid grid-cols-4 md:grid-cols-7 gap-3">
              {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => {
                const field = `V${num}`;
                return (
                  <div key={num} className="p-2 bg-muted/50 rounded text-center">
                    <p className="text-xs text-muted-foreground">{field}</p>
                    <p className="text-xs font-mono font-semibold truncate">
                      {parseFloat(result[field] || 0).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </details>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {isFraud ? "⚠️ Recommended Actions" : "✓ Recommendations"}
          </h3>
          <ul className="space-y-3">
            {isFraud ? (
              <>
                <li className="flex gap-3 items-start">
                  <span className="text-destructive font-bold">1.</span>
                  <span>
                    <strong>Immediate Action:</strong> Contact the cardholder immediately to verify 
                    the transaction authenticity
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-destructive font-bold">2.</span>
                  <span>
                    <strong>Account Review:</strong> Check recent account activity for other 
                    suspicious transactions or patterns
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-destructive font-bold">3.</span>
                  <span>
                    <strong>Security Measure:</strong> Consider temporarily freezing the account 
                    until verification is complete
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-destructive font-bold">4.</span>
                  <span>
                    <strong>Escalation:</strong> Report to fraud investigation team for detailed 
                    forensic analysis
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-destructive font-bold">5.</span>
                  <span>
                    <strong>Documentation:</strong> Document all findings and actions taken for 
                    compliance records
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="flex gap-3 items-start">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Safe to Process:</strong> Transaction appears legitimate and can 
                    proceed normally
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Continue Monitoring:</strong> Keep tracking account activity for 
                    any unusual patterns
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Standard Processing:</strong> No immediate security action required
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Best Practice:</strong> Maintain regular fraud detection checks on 
                    future transactions
                  </span>
                </li>
              </>
            )}
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/request" className="flex-1">
            <Button className="w-full" size="lg">
              Analyze Another Transaction
            </Button>
          </Link>
          <Link to="/transactions" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              View Transaction History
            </Button>
          </Link>
        </div>

        {/* Model Information */}
        <Card className="mt-6 p-4 bg-muted/30">
          <details className="cursor-pointer">
            <summary className="font-semibold mb-2">ℹ️ About This Model</summary>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Algorithm:</strong> Random Forest Classifier with SMOTE (Synthetic Minority 
                Over-sampling Technique) for handling class imbalance
              </p>
              <p>
                <strong>Features:</strong> 30 features including Time, Amount, and 28 PCA-transformed 
                components (V1-V28) that preserve privacy while capturing transaction patterns
              </p>
              <p>
                <strong>Preprocessing:</strong> StandardScaler normalization applied to ensure 
                consistent feature scaling
              </p>
              <p>
                <strong>Training Data:</strong> Trained on historical credit card transaction data 
                with verified fraud labels
              </p>
            </div>
          </details>
        </Card>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center border border-border">
          <p>
            <strong>Disclaimer:</strong> This prediction is generated by a machine learning model 
            for educational and demonstration purposes. Always verify with additional security 
            measures and human oversight before taking action on financial transactions. 
            This tool should complement, not replace, comprehensive fraud detection systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Result;
