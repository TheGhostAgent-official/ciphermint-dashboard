"use client";

import React, { useEffect, useState } from "react";
import ChainStatusCard from "@/components/ChainStatusCard";
import {
  fetchChainStatus,
  type ChainStatus,
  DEMO_MODE,
} from "@/lib/ciphermintApi";

export default function HomePage() {
  const [chainStatus, setChainStatus] = useState<ChainStatus | null>(null);
  const [loadingChain, setLoadingChain] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadChainStatus() {
    setLoadingChain(true);
    setErrorMessage(null);
    try {
      const status = await fetchChainStatus();
      setChainStatus(status);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to load chain status.");
    } finally {
      setLoadingChain(false);
    }
  }

  useEffect(() => {
    loadChainStatus();
  }, []);

  return (
    <main className="cm-page">
      <div className="cm-shell">
        <header className="cm-header">
          <div className="cm-header-left">
            <div className="cm-logo-block" />
            <div className="cm-title-wrap">
              <div className="cm-title">
                <span className="cm-title-gradient">CipherMint Chain</span>
                <span> Dashboard</span>
              </div>
              <p className="cm-subtitle">
                Unified view of CipherMint wallets, Rackdog balances,
                and live chain status.
              </p>
            </div>
          </div>
        </header>

        <p className="cm-demo-banner">
          {DEMO_MODE
            ? "Demo mode is enabled. Data is simulated for presentations. Connect to a live node to show real network data."
            : "Connected to a live CipherMint node."}
        </p>

        <div className="cm-grid">
          <ChainStatusCard
            status={chainStatus}
            loading={loadingChain}
            error={errorMessage}
            onRefresh={loadChainStatus}
          />
        </div>
      </div>
    </main>
  );
}
