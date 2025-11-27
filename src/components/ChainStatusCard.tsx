"use client";

import React from "react";
import type { ChainStatus } from "@/lib/ciphermintApi";

type ChainStatusCardProps = {
  status: ChainStatus | null;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
};

export default function ChainStatusCard({
  status,
  error,
  refreshing,
  onRefresh,
}: ChainStatusCardProps) {
  return (
    <section className="cm-card">
      <div className="cm-card-header">
        <h2 className="cm-card-title">Chain Status</h2>
        <button
          type="button"
          className="cm-refresh-btn"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="cm-error">{error}</p>}

      {!status && !error && (
        <p className="cm-muted">No chain data loaded yet.</p>
      )}

      {status && (
        <div className="cm-status-grid">
          <div className="cm-status-row">
            <span className="cm-status-label">Chain ID</span>
            <span className="cm-status-value">{status.chainId}</span>
          </div>
          <div className="cm-status-row">
            <span className="cm-status-label">Height</span>
            <span className="cm-status-value">
              {status.latestBlockHeight.toLocaleString()}
            </span>
          </div>
          <div className="cm-status-row">
            <span className="cm-status-label">Latest Block Time</span>
            <span className="cm-status-value">
              {status.latestBlockTime
                ? new Date(status.latestBlockTime).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="cm-status-row">
            <span className="cm-status-label">Node Version</span>
            <span className="cm-status-value">{status.nodeVersion}</span>
          </div>
        </div>
      )}
    </section>
  );
}
