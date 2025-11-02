import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock data - will be replaced with API calls
  const allTransactions = [
    { id: "TXN001", time: 12345, amount: 1250.50, prediction: "Safe", date: "2025-10-15 14:23:11", confidence: 95.2 },
    { id: "TXN002", time: 12346, amount: 8500.00, prediction: "Fraud", date: "2025-10-15 14:25:33", confidence: 89.7 },
    { id: "TXN003", time: 12347, amount: 45.20, prediction: "Safe", date: "2025-10-15 14:28:45", confidence: 97.3 },
    { id: "TXN004", time: 12348, amount: 15000.00, prediction: "Fraud", date: "2025-10-15 14:30:12", confidence: 92.1 },
    { id: "TXN005", time: 12349, amount: 320.75, prediction: "Safe", date: "2025-10-15 14:32:08", confidence: 94.8 },
    { id: "TXN006", time: 12350, amount: 7800.25, prediction: "Fraud", date: "2025-10-15 14:35:22", confidence: 88.4 },
    { id: "TXN007", time: 12351, amount: 150.00, prediction: "Safe", date: "2025-10-15 14:38:45", confidence: 96.5 },
    { id: "TXN008", time: 12352, amount: 9999.99, prediction: "Fraud", date: "2025-10-15 14:42:18", confidence: 91.3 },
    { id: "TXN009", time: 12353, amount: 523.40, prediction: "Safe", date: "2025-10-15 14:45:33", confidence: 93.7 },
    { id: "TXN010", time: 12354, amount: 220.00, prediction: "Safe", date: "2025-10-15 14:48:56", confidence: 95.9 },
  ];

  const filteredTransactions = allTransactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.amount.toString().includes(searchTerm);
    const matchesFilter = filterType === "all" || txn.prediction.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground mb-8">
          View and search all analyzed transactions
        </p>

        {/* Search and Filter */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                All
              </Button>
              <Button
                variant={filterType === "safe" ? "default" : "outline"}
                onClick={() => setFilterType("safe")}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Safe
              </Button>
              <Button
                variant={filterType === "fraud" ? "default" : "outline"}
                onClick={() => setFilterType("fraud")}
                className="gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Fraud
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {allTransactions.length} transactions
        </div>

        {/* Transactions Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold">Transaction ID</th>
                  <th className="text-left py-4 px-6 font-semibold">Time</th>
                  <th className="text-left py-4 px-6 font-semibold">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold">Prediction</th>
                  <th className="text-left py-4 px-6 font-semibold">Confidence</th>
                  <th className="text-left py-4 px-6 font-semibold">Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-mono font-semibold text-primary">{txn.id}</td>
                      <td className="py-4 px-6 text-muted-foreground">{txn.time}</td>
                      <td className="py-4 px-6 font-semibold">${txn.amount.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          txn.prediction === "Fraud" 
                            ? "bg-destructive/10 text-destructive" 
                            : "bg-success/10 text-success"
                        }`}>
                          {txn.prediction === "Fraud" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          {txn.prediction}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{txn.confidence}%</td>
                      <td className="py-4 px-6 text-muted-foreground">{txn.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No transactions found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
