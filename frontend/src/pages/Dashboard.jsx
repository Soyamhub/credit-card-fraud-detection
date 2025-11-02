import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Activity, TrendingUp } from "lucide-react";

const Dashboard = () => {
  // Mock data - will be replaced with API calls
  const stats = {
    totalTransactions: 1247,
    fraudulent: 43,
    legitimate: 1204,
    accuracy: 99.5
  };

  const recentTransactions = [
    { id: "TXN001", amount: 1250.50, time: 12345, prediction: "Safe", date: "2025-10-15" },
    { id: "TXN002", amount: 8500.00, time: 12346, prediction: "Fraud", date: "2025-10-15" },
    { id: "TXN003", amount: 45.20, time: 12347, prediction: "Safe", date: "2025-10-15" },
    { id: "TXN004", amount: 15000.00, time: 12348, prediction: "Fraud", date: "2025-10-15" },
    { id: "TXN005", amount: 320.75, time: 12349, prediction: "Safe", date: "2025-10-15" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <p className="text-3xl font-bold">{stats.totalTransactions}</p>
              </div>
              <Activity className="h-12 w-12 text-primary opacity-80" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fraudulent</p>
                <p className="text-3xl font-bold text-destructive">{stats.fraudulent}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-destructive opacity-80" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Legitimate</p>
                <p className="text-3xl font-bold text-success">{stats.legitimate}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-success opacity-80" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-secondary">{stats.accuracy}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-secondary opacity-80" />
            </div>
          </Card>
        </div>

        {/* Visual Chart Placeholder */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Fraud Detection Overview</h2>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Chart visualization will be displayed here</p>
              <p className="text-sm text-muted-foreground mt-2">Integrate with Chart.js or similar library</p>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Time</th>
                  <th className="text-left py-3 px-4 font-semibold">Prediction</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{txn.id}</td>
                    <td className="py-3 px-4 font-semibold">${txn.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{txn.time}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        txn.prediction === "Fraud" 
                          ? "bg-destructive/10 text-destructive" 
                          : "bg-success/10 text-success"
                      }`}>
                        {txn.prediction === "Fraud" ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        {txn.prediction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
