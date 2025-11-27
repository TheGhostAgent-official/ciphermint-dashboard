"use client";

import React, { useEffect, useState } from "react";
import {
  DEMO_MODE,
  DEMO_WALLETS,
  DEMO_ADDRESS,
  fetchBalances,
  fetchRecentTransactions,
  type Coin,
  type Transaction,
  type DemoWallet,
} from "@/lib/ciphermintApi";

type SendFormState = {
  to: string;
  amount: string;
  denom: string;
};

function formatDenom(denom: string): string {
  if (denom.startsWith("u")) {
    return denom.slice(1).toUpperCase();
  }
  return denom.toUpperCase();
}

function formatAmount(amount: string, denom: string): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return amount;

  if (denom.startsWith("u")) {
    return (num / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
  }

  return num.toLocaleString();
}

function shortenHash(hash: string): string {
  if (!hash || hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}…${hash.slice(-6)}`;
}

function formatTimestamp(ts: string): string {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export default function WalletPage() {
  const [selectedWallet, setSelectedWallet] = useState<DemoWallet>(
    DEMO_WALLETS.find((w) => w.address === DEMO_ADDRESS) ?? DEMO_WALLETS[0]
  );
  const [balances, setBalances] = useState<Coin[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showSend, setShowSend] = useState(false);
  const [sendState, setSendState] = useState<SendFormState>({
    to: "",
    amount: "",
    denom: "ucmint",
  });
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  async function loadWallet(address: string, mode: "initial" | "refresh" = "initial") {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [{ balances }, txs] = await Promise.all([
        fetchBalances(address),
        fetchRecentTransactions(address),
      ]);

      setBalances(balances);
      setTransactions(txs);
    } catch (err) {
      console.error("Failed to load wallet demo data", err);
    } finally {
      if (mode === "initial") {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    loadWallet(selectedWallet.address, "initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet.address]);

  function handleOpenSend() {
    setSendError(null);
    setSendSuccess(null);
    setSendState((prev) => ({
      ...prev,
      to: "",
      amount: "",
      denom: balances?.[0]?.denom ?? "ucmint",
    }));
    setShowSend(true);
  }

  async function handleSendSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSendError(null);
    setSendSuccess(null);

    if (!sendState.to.trim() || !sendState.amount.trim()) {
      setSendError("Please enter a recipient and amount.");
      return;
    }

    setSending(true);

    // Fake latency + fake success
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const now = new Date().toISOString();
    const fakeHash = `DEMO${Math.random().toString(16).slice(2, 18).toUpperCase()}`;

    const newTx: Transaction = {
      hash: fakeHash,
      height: (transactions[0]?.height ?? 18235) + 1,
      timestamp: now,
      status: "Success",
      success: true,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setSendSuccess("Demo send simulated successfully.");
    setSending(false);
  }

  function handleCloseSend() {
    if (sending) return;
    setShowSend(false);
  }

  return (
    <main className="cm-page">
      <header className="cm-header">
        <div>
          <h1 className="cm-title">CipherMint Wallet</h1>
          <p className="cm-subtitle">
            Demo view of how players, creators, and partners will track balances and activity
            across the CipherMint ecosystem.
          </p>
        </div>
        <div className="cm-tag-row">
          <span className="cm-tag cm-tag-demo">
            Mode: DEMO
          </span>
          <span className="cm-tag cm-tag-api">
            API label: http://localhost:1317
          </span>
        </div>
      </header>

      <section className="cm-card">
        <div className="cm-card-header">
          <h2 className="cm-card-title">Select Demo Wallet</h2>
          {DEMO_MODE && (
            <span className="cm-card-badge">No live chain required</span>
          )}
        </div>
        <div className="cm-wallet-switch">
          {DEMO_WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              className={[
                "cm-wallet-pill",
                wallet.address === selectedWallet.address ? "cm-wallet-pill-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelectedWallet(wallet)}
            >
              <span className="cm-wallet-pill-label">{wallet.label}</span>
              <span className="cm-wallet-pill-address">
                {shortenHash(wallet.address)}
              </span>
            </button>
          ))}
        </div>
        {selectedWallet.description && (
          <p className="cm-muted">{selectedWallet.description}</p>
        )}
      </section>

      <section className="cm-grid">
        <div className="cm-grid-left">
          <section className="cm-card">
            <div className="cm-card-header">
              <h2 className="cm-card-title">Balances</h2>
              <div className="cm-cta-row">
                <button
                  type="button"
                  className="cm-btn cm-btn-secondary"
                  onClick={() => loadWallet(selectedWallet.address, "refresh")}
                  disabled={refreshing || loading}
                >
                  {refreshing ? "Refreshing…" : "Refresh"}
                </button>
                <button
                  type="button"
                  className="cm-btn cm-btn-primary"
                  onClick={handleOpenSend}
                  disabled={loading}
                >
                  Send (Demo)
                </button>
              </div>
            </div>

            {loading && (
              <div className="cm-skeleton-list">
                <div className="cm-skeleton-row" />
                <div className="cm-skeleton-row" />
                <div className="cm-skeleton-row" />
              </div>
            )}

            {!loading && (!balances || balances.length === 0) && (
              <p className="cm-muted">No balances for this demo wallet yet.</p>
            )}

            {!loading && balances && balances.length > 0 && (
              <div className="cm-token-list">
                {balances.map((coin) => (
                  <div key={coin.denom} className="cm-token-row">
                    <div className="cm-token-main">
                      <span className="cm-token-symbol">
                        {formatDenom(coin.denom)}
                      </span>
                      <span className="cm-token-denom">{coin.denom}</span>
                    </div>
                    <div className="cm-token-amounts">
                      <span className="cm-token-amount-primary">
                        {formatAmount(coin.amount, coin.denom)}
                      </span>
                      <span className="cm-token-amount-raw">
                        {coin.amount} {coin.denom}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="cm-grid-right">
          <section className="cm-card">
            <div className="cm-card-header">
              <h2 className="cm-card-title">Recent Activity</h2>
            </div>

            {loading && (
              <div className="cm-skeleton-list">
                <div className="cm-skeleton-row" />
                <div className="cm-skeleton-row" />
              </div>
            )}

            {!loading && transactions.length === 0 && (
              <p className="cm-muted">No transactions for this wallet yet.</p>
            )}

            {!loading && transactions.length > 0 && (
              <div className="cm-table">
                <div className="cm-table-head">
                  <span>Hash</span>
                  <span>Height</span>
                  <span>Time</span>
                  <span>Status</span>
                </div>
                <div className="cm-table-body">
                  {transactions.map((tx) => (
                    <div key={tx.hash} className="cm-table-row">
                      <span className="cm-mono">{shortenHash(tx.hash)}</span>
                      <span>{tx.height.toLocaleString()}</span>
                      <span>{formatTimestamp(tx.timestamp)}</span>
                      <span>
                        <span
                          className={[
                            "cm-status-pill",
                            tx.success ? "cm-status-success" : "cm-status-failed",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {tx.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      {showSend && (
        <div className="cm-modal-backdrop" onClick={handleCloseSend}>
          <div
            className="cm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="cm-modal-title">Send Tokens (Demo Only)</h2>
            <p className="cm-muted">
              This flow simulates a send and appends a new transaction to the history.
              No real assets are moved.
            </p>

            <form onSubmit={handleSendSubmit} className="cm-form">
              <label className="cm-field">
                <span className="cm-field-label">From</span>
                <input
                  type="text"
                  value={selectedWallet.address}
                  readOnly
                  className="cm-input cm-input-readonly"
                />
              </label>

              <label className="cm-field">
                <span className="cm-field-label">To (demo address)</span>
                <input
                  type="text"
                  value={sendState.to}
                  onChange={(e) =>
                    setSendState((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="cm-input"
                  placeholder="ciphermint1recipientxyz..."
                />
              </label>

              <div className="cm-field-row">
                <label className="cm-field cm-field-inline">
                  <span className="cm-field-label">Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="0.000001"
                    value={sendState.amount}
                    onChange={(e) =>
                      setSendState((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    className="cm-input"
                    placeholder="0.0"
                  />
                </label>
                <label className="cm-field cm-field-inline">
                  <span className="cm-field-label">Token</span>
                  <select
                    className="cm-input"
                    value={sendState.denom}
                    onChange={(e) =>
                      setSendState((prev) => ({ ...prev, denom: e.target.value }))
                    }
                  >
                    {balances?.map((coin) => (
                      <option key={coin.denom} value={coin.denom}>
                        {formatDenom(coin.denom)}
                      </option>
                    )) ?? (
                      <option value="ucmint">CMINT</option>
                    )}
                  </select>
                </label>
              </div>

              {sendError && <p className="cm-error">{sendError}</p>}
              {sendSuccess && <p className="cm-success">{sendSuccess}</p>}

              <div className="cm-modal-actions">
                <button
                  type="button"
                  className="cm-btn cm-btn-secondary"
                  onClick={handleCloseSend}
                  disabled={sending}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="cm-btn cm-btn-primary"
                  disabled={sending}
                >
                  {sending ? "Simulating…" : "Send (Demo)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
