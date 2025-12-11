// src/pages/Transactions.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getMyTransactions } from "@/services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const data = await getMyTransactions();
        // normalize numeric fields if necessary
        const normalized = (data || []).map((t) => ({
          ...t,
          amount: t.amount ?? t.amount_usd ?? t.amount_usd ?? 0,
          prediction: Number(t.prediction ?? 0),
          fraud_probability: t.fraud_probability ?? t.probability ?? t.fraud_probability ?? null,
        }));
        setTransactions(normalized);
      } catch (err) {
        console.error("Failed to load transactions:", err);
      }
    };
    fetchTxns();
  }, []);

  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const isFraud = Number(t.prediction) === 1;
      if (filter === "safe" && isFraud) return false;
      if (filter === "fraud" && !isFraud) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return String(t.id ?? "").toLowerCase().includes(q) || String(t.amount ?? "").toLowerCase().includes(q);
    });
  }, [transactions, filter, search]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground mb-6">View and search all analyzed transactions</p>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="Search by transaction ID or amount..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
              <Button variant={filter === "safe" ? "default" : "outline"} onClick={() => setFilter("safe")}>Safe</Button>
              <Button variant={filter === "fraud" ? "default" : "outline"} onClick={() => setFilter("fraud")}>Fraud</Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3">Showing {filteredTxns.length} of {transactions.length} transactions</p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold">Transaction ID</th>
                  <th className="py-3 px-4 text-left font-semibold">Time Since Last Txn</th>
                  <th className="py-3 px-4 text-left font-semibold">Amount</th>
                  <th className="py-3 px-4 text-left font-semibold">Prediction</th>
                  <th className="py-3 px-4 text-left font-semibold">Confidence</th>
                  <th className="py-3 px-4 text-left font-semibold">Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.length === 0 ? (
                  <tr><td colSpan={6} className="py-6 px-4 text-center text-muted-foreground">No transactions yet.</td></tr>
                ) : (
                  filteredTxns.map((t, idx) => {
                    const isFraud = Number(t.prediction) === 1;
                    const amountNum = Number(t.amount ?? 0);
                    const prob = t.fraud_probability ?? t.probability ?? null;
                    const dateStr = t.created_at || t.submittedAt || t.dateSubmitted || t.timestamp || null;
                    return (
                      <tr key={t.id ?? idx} className="border-b last:border-0">
                        <td className="py-3 px-4 font-mono text-primary">{t.id ?? idx + 1}</td>
                        <td className="py-3 px-4">{t.time_since_last_txn != null ? `${t.time_since_last_txn} min` : "-"}</td>
                        <td className="py-3 px-4">{isNaN(amountNum) ? "-" : `₹${amountNum.toFixed(2)}`}</td>
                        <td className="py-3 px-4">
                          {isFraud ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium">Fraud</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium">Safe</span>
                          )}
                        </td>
                        <td className="py-3 px-4">{prob != null ? `${(Number(prob)*100).toFixed(1)}%` : "N/A"}</td>
                        <td className="py-3 px-4">{dateStr ? new Date(dateStr).toLocaleString() : "-"}</td>
                      </tr>
                    );
                  })
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
