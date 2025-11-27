"use client";

import { useEffect, useState } from "react";
import WalletSummary from "@/components/WalletSummary";
import TransactionsTable from "@/components/TransactionsTable";
import WalletForm from "@/components/WalletForm";
import {
  fetchBalances,
  fetchRecentTransactions,
  type Coin,
  type Transaction,
  DEMO_ADDRESS,
  DEMO_MODE,
} from "@/lib/ciphermintApi";

export default function WalletPage() {
  const [address, setAddress] = useState(
    DEMO_MODE ? DEMO_ADDRESS : ""
  );
  const [currentAddress, setCurrentAddress] = useState(
    DEMO_MODE ? DEMO_ADDRESS : ""
  );
  const [balances, setBalances] = useState<Coin[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  const loadWallet = async () => {
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

  useEffect(() => {
    if (DEMO_MODE) {
      loadWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="cm-page">
      <div className="cm-shell">
        <header className="cm-header">
          <div className="cm-header-left">
            <div className="cm-logo-block" />
            <div className="cm-title-wrap">
              <div className="cm-title">
                <span className="cm-title-gradient">
                  Wallet Details
                </span>
              </div>
              <p className="cm-subtitle">
                Inspect balances and recent activity for a single CipherMint
                address.
              </p>
            </div>
          </div>
        </header>

        {errorMessage && <div className="cm-error">{errorMessage}</div>}

        <div className="cm-grid">
          <section>
            <div className="cm-card">
              <h2 className="cm-card-title">Select Address</h2>
              <WalletForm
                address={address}
                onChange={setAddress}
                onSubmit={loadWallet}
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
          </section>

          <aside>
            <TransactionsTable transactions={transactions} />
          </aside>
        </div>
      </div>
    </main>
  );
}
