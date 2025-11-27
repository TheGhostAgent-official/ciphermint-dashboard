import type { ChainStatus } from "@/lib/ciphermintApi";

type ChainStatusCardProps = {
  status: ChainStatus | null;
  error?: string | null;
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
    <div className="cm-card">
      <div className="cm-status-header">
        <h2 className="cm-card-title">Chain Status</h2>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="cm-refresh"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="cm-helper">{error}</p>}

      {status && (
        <div className="cm-status-meta">
          <div className="cm-status-row">
            <span className="cm-status-label">Chain ID</span>
            <span className="cm-status-value">{status.chainId}</span>
          </div>
          <div className="cm-status-row">
            <span className="cm-status-label">Height</span>
            <span className="cm-status-value">{status.latestHeight}</span>
          </div>
          <div className="cm-status-row">
            <span className="cm-status-label">Latest Block Time</span>
            <span className="cm-status-value">
              {new Date(status.latestTime).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {!status && !error && (
        <p className="cm-helper" style={{ marginTop: 8 }}>
          No chain status loaded yet.
        </p>
      )}
    </div>
  );
}
