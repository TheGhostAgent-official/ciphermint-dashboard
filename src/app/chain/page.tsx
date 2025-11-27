"use client";

import { useEffect, useState } from "react";
import ChainStatusCard from "@/components/ChainStatusCard";
import { fetchChainStatus, type ChainStatus } from "@/lib/ciphermintApi";

export default function ChainPage() {
  const [chainStatus, setChainStatus] = useState<ChainStatus | null>(null);
  const [loadingChain, setLoadingChain] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadChainStatus = async () => {
    setLoadingChain(true);
    setErrorMessage(null);
    try {
      const status = await fetchChainStatus();
      setChainStatus(status);
    } catch (err: any) {
      console.error(err);
      setChainStatus(null);
      setErrorMessage(err.message || "Failed to load chain status.");
    } finally {
      setLoadingChain(false);
    }
  };

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
                <span className="cm-title-gradient">Chain Health</span>
              </div>
              <p className="cm-subtitle">
                High-level status view for the CipherMint network: block height,
                timing, and network identity.
              </p>
            </div>
          </div>
        </header>

        {errorMessage && <div className="cm-error">{errorMessage}</div>}

        <div className="cm-grid">
          <section>
            <ChainStatusCard loading={loadingChain}
              status={chainStatus}
              error={null}
              
              onRefresh={loadChainStatus}
            />
          </section>

          <aside>
            <div className="cm-card">
              <h2 className="cm-card-title">Why this matters</h2>
              <p className="cm-info-text">
                For validators, partners, and investors, these metrics answer a
                simple question:{" "}
                <span className="cm-info-highlight">is CipherMint up,
                  healthy, and producing blocks?</span>
              </p>
              <p className="cm-info-text">
                This view will eventually surface validator counts, uptime
                scores, and latency metrics for exchanges, game studios,
                and infrastructure partners.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
