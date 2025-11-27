"use client";

import React, { useEffect, useState } from "react";
import {
  DEMO_ADDRESS,
  DEMO_WALLETS,
  DEMO_MODE,
  type DemoWallet,
  type Coin,
  type Transaction,
  fetchBalances,
  fetchRecentTransactions,
} from "@/lib/ciphermintApi";
import TransactionsTable from "@/components/TransactionsTable";

function toDisplayAmount(denom: string, amount: string): string {
  const num = Number(amount || "0");
  if (Number.isNaN(num)) return amount;
  if (denom.startsWith("u")) {
    return (num / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
  }
  return num.toLocaleString();
}

type SendFormState = {
  to: string;
  amount: string;
  denom: string;
};

export default function WalletPage() {
  const [selectedWallet, setSelectedWallet] = useState<DemoWallet>(() => {
    return (
      DEMO_WALLETS.find((w) => w.address === DEMO_ADDRESS) ?? DEMO_WALLETS[0]
    );
  });

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

  async function loadWallet(address: string, mode: "initial" | "refresh") {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setSendError(null);
    setSendSuccess(null);

    try {
      const [{ balances }, txs] = await Promise.all([
        fetchBalances(address),
        fetchRecentTransactions(address),
      ]);

      setBalances(balances);
      setTransactions(txs);
    } catch (err: any) {
      console.error(err);
      setSendError(err?.message || "Failed to load wallet data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadWallet(selectedWallet.address, "initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleWalletChange(wallet: DemoWallet) {
    setSelectedWallet(wallet);
    loadWallet(wallet.address, "initial");
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSendError(null);
    setSendSuccess(null);
    setSending(true);

    try {
      // Demo-mode transfer simulation only.
      if (!DEMO_MODE) {
        throw new Error("Live transfers will be enabled on mainnet launch.");
      }

      const now = new Date().toISOString();
      const baseHeight = transactions[0]?.height ?? 18235;

      const fakeTx: Transaction = {
        hash: `DEMO${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
        height: baseHeight + 1,
        timestamp: now,
        status: "Success",
        success: true,
      };

      setTransactions((prev) => [fakeTx, ...prev]);
      setSendSuccess(
        "Demo transfer recorded. In production this will submit a real transaction."
      );
    } catch (err: any) {
      setSendError(err?.message || "Failed to send.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="cm-page">
      <div className="cm-shell">
        <header className="cm-header">
          <div className="cm-header-left">
            <div className="cm-logo-block" />
            <div className="cm-title-wrap">
              <div className="cm-title">
                <span className="cm-title-gradient">Wallet</span>
              </div>
              <p className="cm-subtitle">
                Multi-wallet view for the CipherMint ecosystem.
              </p>
            </div>
          </div>
        </header>

        <div className="cm-grid cm-grid-two">
          <section className="cm-card">
            <h2 className="cm-card-title">Select Wallet</h2>
            <p className="cm-info-text">
              Switch between demo wallets to see how balances and activity
              update.
            </p>
            <div className="cm-pill-row">
              {DEMO_WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  className={[
                    "cm-pill",
                    wallet.address === selectedWallet.address
                      ? "cm-pill-active"
                      : "",
                  ].join(" ")}
                  onClick={() => handleWalletChange(wallet)}
                  disabled={loading && wallet.address === selectedWallet.address}
                >
                  {wallet.label}
                </button>
              ))}
            </div>
            <p className="cm-wallet-address">{selectedWallet.address}</p>
            <p className="cm-info-text">{selectedWallet.description}</p>
          </section>

          <section className="cm-card">
            <div className="cm-card-header">
              <h2 className="cm-card-title">Balances</h2>
              <button
                type="button"
                className="cm-button-secondary cm-button-xs"
                onClick={() => loadWallet(selectedWallet.address, "refresh")}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {balances && balances.length > 0 ? (
              <dl className="cm-balance-grid">
                {balances.map((coin) => (
                  <div key={coin.denom} className="cm-balance-row">
                    <dt className="cm-balance-label">
                      {coin.denom === "ucmint"
                        ? "CMINT"
                        : coin.denom === "urackd"
                        ? "RACKD"
                        : coin.denom}
                    </dt>
                    <dd className="cm-balance-value">
                      {toDisplayAmount(coin.denom, coin.amount)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="cm-info-text">
                {loading ? "Loading balances…" : "No balances found."}
              </p>
            )}
          </section>
        </div>

        <section className="cm-card cm-card-spaced">
          <div className="cm-card-header">
            <h2 className="cm-card-title">Send (Demo)</h2>
            <button
              type="button"
              className="cm-button-secondary cm-button-xs"
              onClick={() => setShowSend((prev) => !prev)}
            >
              {showSend ? "Hide Form" : "Open Form"}
            </button>
          </div>

          {showSend && (
            <form className="cm-form" onSubmit={handleSend}>
              <div className="cm-form-row">
                <label className="cm-form-label">
                  To Address
                  <input
                    className="cm-input"
                    value={sendState.to}
                    onChange={(e) =>
                      setSendState((s) => ({ ...s, to: e.target.value }))
                    }
                    placeholder="ciphermint1..."
                  />
                </label>
              </div>
              <div className="cm-form-row cm-form-row-inline">
                <label className="cm-form-label">
                  Amount
                  <input
                    className="cm-input"
                    value={sendState.amount}
                    onChange={(e) =>
                      setSendState((s) => ({ ...s, amount: e.target.value }))
                    }
                    placeholder="0.00"
                  />
                </label>
                <label className="cm-form-label">
                  Asset
                  <select
                    className="cm-input"
                    value={sendState.denom}
                    onChange={(e) =>
                      setSendState((s) => ({ ...s, denom: e.target.value }))
                    }
                  >
                    <option value="ucmint">CMINT</option>
                    <option value="urackd">RACKD</option>
                  </select>
                </label>
              </div>

              {sendError && <p className="cm-error">{sendError}</p>}
              {sendSuccess && <p className="cm-success">{sendSuccess}</p>}

              <button
                type="submit"
                className="cm-button-primary"
                disabled={sending}
              >
                {sending ? "Submitting…" : "Send (Demo Only)"}
              </button>
            </form>
          )}
        </section>

        <TransactionsTable transactions={transactions} loading={loading} />
      </div>
    </main>
  );
}
