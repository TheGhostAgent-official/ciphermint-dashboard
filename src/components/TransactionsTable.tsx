"use client";

import React from "react";
import type { Transaction } from "@/lib/ciphermintApi";

type Props = {
  transactions: Transaction[];
  loading: boolean;
};

function shortenHash(hash: string): string {
  if (!hash) return "";
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}…${hash.slice(-6)}`;
}

function formatTimestamp(ts: string): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export default function TransactionsTable({ transactions, loading }: Props) {
  return (
    <div className="cm-card">
      <h2 className="cm-card-title">Recent Transactions</h2>

      {loading && transactions.length === 0 ? (
        <p className="cm-info-text">Loading recent activity…</p>
      ) : null}

      {!loading && transactions.length === 0 ? (
        <p className="cm-info-text">No transactions yet for this wallet.</p>
      ) : null}

      {transactions.length > 0 && (
        <table className="cm-table">
          <thead>
            <tr>
              <th>Hash</th>
              <th>Height</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash}>
                <td>{shortenHash(tx.hash)}</td>
                <td>{tx.height}</td>
                <td>{formatTimestamp(tx.timestamp)}</td>
                <td>
                  <span
                    className={[
                      "cm-status-pill",
                      tx.success ? "cm-status-success" : "cm-status-failed",
                    ].join(" ")}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
