"use client";

import React from "react";
import type { ChainStatus } from "@/lib/ciphermintApi";

type Props = {
  status: ChainStatus | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
};

export default function ChainStatusCard({
  status,
  loading,
  error,
  onRefresh,
}: Props) {
  return (
    <div className="cm-card">
      <div className="cm-card-header">
        <h2 className="cm-card-title">Chain Health</h2>
        {onRefresh && (
          <button
            type="button"
            className="cm-button-secondary cm-button-xs"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        )}
      </div>

      {error && <p className="cm-error">{error}</p>}

      {status ? (
        <dl className="cm-status-grid">
          <div className="cm-status-row">
            <dt className="cm-status-label">Height</dt>
            <dd className="cm-status-value">{status.latestHeight}</dd>
          </div>
          <div className="cm-status-row">
            <dt className="cm-status-label">Latest Block Time</dt>
            <dd className="cm-status-value">{status.latestBlockTime}</dd>
          </div>
          <div className="cm-status-row">
            <dt className="cm-status-label">Node Version</dt>
            <dd className="cm-status-value">{status.nodeVersion}</dd>
          </div>
        </dl>
      ) : (
        !error && <p className="cm-info-text">Loading chain status…</p>
      )}
    </div>
  );
}
