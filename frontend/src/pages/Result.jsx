import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowLeft, BarChart3 } from "lucide-react";

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

  const isFraud = result.prediction === "Fraud";

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
          isFraud ? "border-destructive bg-destructive/5" : "border-success bg-success/5"
        }`}>
          <div className="text-center">
            {isFraud ? (
              <AlertTriangle className="h-20 w-20 mx-auto mb-4 text-destructive" />
            ) : (
              <CheckCircle className="h-20 w-20 mx-auto mb-4 text-success" />
            )}
            
            <h2 className="text-3xl font-bold mb-2">
              {isFraud ? "Fraudulent Transaction Detected" : "Transaction Appears Safe"}
            </h2>
            
            <p className={`text-lg ${isFraud ? "text-destructive" : "text-success"}`}>
              Prediction: {result.prediction}
            </p>
          </div>
        </Card>

        {/* Transaction Details */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Transaction Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p className="text-2xl font-bold">${parseFloat(result.amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Time (seconds)</p>
              <p className="text-2xl font-bold">{result.time}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Model Confidence</p>
              <p className="text-2xl font-bold">{result.confidence}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Analyzed At</p>
              <p className="text-lg font-semibold">
                {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {isFraud ? "⚠️ Recommended Actions" : "✓ Recommendations"}
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            {isFraud ? (
              <>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Contact the cardholder immediately to verify the transaction</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Review recent account activity for other suspicious transactions</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Consider temporarily freezing the account</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Report to fraud investigation team for further analysis</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Transaction appears legitimate and can be processed</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Continue monitoring for unusual patterns</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>No immediate action required</span>
                </li>
              </>
            )}
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/request" className="flex-1">
            <Button className="w-full" size="lg">
              Submit Another Transaction
            </Button>
          </Link>
          <Link to="/transactions" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              View All Transactions
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
          <p>
            This prediction is generated by a machine learning model for educational/demo purposes. 
            Always verify with additional security measures before taking action on financial transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Result;
