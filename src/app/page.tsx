"use client";

import { useEffect, useState } from "react";
import WalletForm from "@/components/WalletForm";
import WalletSummary from "@/components/WalletSummary";
import TransactionsTable from "@/components/TransactionsTable";
import ChainStatusCard from "@/components/ChainStatusCard";
import {
  fetchBalances,
  fetchChainStatus,
  fetchRecentTransactions,
  type Coin,
  type ChainStatus,
  type Transaction,
  DEMO_ADDRESS,
  DEMO_MODE,
} from "@/lib/ciphermintApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CIPHERMINT_API_BASE_URL ||
  "http://localhost:1317";

export default function HomePage() {
  const [address, setAddress] = useState(
    DEMO_MODE ? DEMO_ADDRESS : ""
  );
  const [currentAddress, setCurrentAddress] = useState(
    DEMO_MODE ? DEMO_ADDRESS : ""
  );
  const [balances, setBalances] = useState<Coin[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chainStatus, setChainStatus] = useState<ChainStatus | null>(
    null
  );
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingChain, setLoadingChain] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  const handleLoadWallet = async () => {
    setErrorMessage(null);
    setLoadingWallet(true);
    try {
      const targetAddress = DEMO_MODE ? DEMO_ADDRESS : address;
      const [balanceRes, txs] = await Promise.all([
        fetchBalances(targetAddress),
        fetchRecentTransactions(targetAddress),
      ]);
      setBalances(balanceRes.balances);
      setTransactions(txs);
      setCurrentAddress(targetAddress);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to load wallet data.");
      setBalances([]);
      setTransactions([]);
      setCurrentAddress("");
    } finally {
      setLoadingWallet(false);
    }
  };

  const loadChainStatus = async () => {
    setLoadingChain(true);
    setErrorMessage(null);
    try {
      const status = await fetchChainStatus();
      setChainStatus(status);
    } catch (err: any) {
      console.error(err);
      setChainStatus(null);
      setErrorMessage(
        (prev) => prev || err.message || "Failed to load chain status."
      );
    } finally {
      setLoadingChain(false);
    }
  };

  useEffect(() => {
    loadChainStatus();
    if (DEMO_MODE) {
      handleLoadWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="cm-page">
      <div className="cm-shell">
        {/* Header */}
        <header className="cm-header">
          <div className="cm-header-left">
            <div className="cm-logo-block" />
            <div className="cm-title-wrap">
              <div className="cm-title">
                <span className="cm-title-gradient">
                  CipherMint Chain
                </span>{" "}
                Dashboard
              </div>
              <p className="cm-subtitle">
                Unified view of CipherMint wallets, Rackdog balances, and
                live chain status.
              </p>
            </div>
          </div>
          <div className="cm-header-right">
            <div>
              API: <code>{API_BASE_URL}</code>
            </div>
            <div>
              Mode:{" "}
              <strong
                style={{
                  color: DEMO_MODE ? "#ffb020" : "#6ee7b7",
                }}
              >
                {DEMO_MODE ? "DEMO" : "LIVE"}
              </strong>
            </div>
          </div>
        </header>

        {DEMO_MODE && (
          <div className="cm-banner">
            Demo mode is enabled. Data shown is simulated to demonstrate the
            CipherMint experience. Switch to LIVE by setting{" "}
            <code>NEXT_PUBLIC_CIPHERMINT_DEMO_MODE=false</code> and pointing
            the API to a running CipherMint node.
          </div>
        )}

        {errorMessage && <div className="cm-error">{errorMessage}</div>}

        <div className="cm-grid">
          {/* Left: wallet + transactions */}
          <section>
            <div className="cm-card">
              <h2 className="cm-card-title">Load Wallet</h2>
              <WalletForm
                address={address}
                onChange={setAddress}
                onSubmit={handleLoadWallet}
                loading={loadingWallet}
                demoMode={DEMO_MODE}
              />
            </div>

            {currentAddress && (
              <WalletSummary
                address={currentAddress}
                balances={balances}
              />
            )}

            <TransactionsTable transactions={transactions} />
          </section>

          {/* Right: chain + Rackdog + story */}
          <aside>
            <ChainStatusCard
              status={chainStatus}
              error={null}
              refreshing={loadingChain}
              onRefresh={loadChainStatus}
            />

            {/* Rackdog Ecosystem Card */}
            <div className="cm-card" style={{ marginTop: 12 }}>
              <div className="cm-eco-header">
                <div className="cm-eco-left">
                  <div className="cm-eco-logo" />
                  <div>
                    <div className="cm-eco-title">Rackdog (RACKD)</div>
                    <div className="cm-helper">
                      Flagship ecosystem token on CipherMint.
                    </div>
                  </div>
                </div>
                <span className="cm-eco-tag">Flagship Token</span>
              </div>

              <ul className="cm-eco-list">
                <li>
                  • Meme + utility hybrid powering creator and gaming
                  economies.
                </li>
                <li>
                  • Used for access, rewards, fees, and future in-game
                  items.
                </li>
                <li>
                  • First asset brands and studios can plug into without
                  designing a new token.
                </li>
              </ul>

              <div className="cm-eco-metric-row">
                <span className="cm-eco-label">
                  Demo circulating supply (RACKD)
                </span>
                <span className="cm-eco-value">84,500,000</span>
              </div>
            </div>

            {/* Investor story card */}
            <div className="cm-card" style={{ marginTop: 12 }}>
              <h2 className="cm-card-title">
                What investors are seeing
              </h2>
              <p className="cm-info-text">
                This dashboard is the front door into the{" "}
                <span className="cm-info-highlight">
                  CipherMint Chain
                </span>{" "}
                ecosystem. Any address on CipherMint can be inspected here:
                balances across native CMINT and ecosystem tokens like{" "}
                <span className="cm-info-highlight">
                  Rackdog (RACKD)
                </span>
                , plus their recent on-chain activity.
              </p>
              <p className="cm-info-text">
                On the right, live chain status shows block height, chain ID,
                and block time. Behind this UI is a Cosmos-style REST API, the
                same interface games, brands, and DeFi apps will use to
                integrate with CipherMint at scale.
              </p>
              <p className="cm-info-text">
                From here, we can expand into a full{" "}
                <span className="cm-info-accent">
                  CipherMint Hub
                </span>
                : token launchpads, NFT/game asset views, revenue dashboards
                for creators, and cross-chain bridges into the broader
                ecosystem.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
