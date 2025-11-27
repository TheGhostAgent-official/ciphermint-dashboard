"use client";

import { FormEvent } from "react";

type WalletFormProps = {
  address: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  demoMode: boolean;
};

export default function WalletForm({
  address,
  onChange,
  onSubmit,
  loading,
  demoMode,
}: WalletFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="cm-form">
      <label className="cm-label">CipherMint Address</label>
      <input
        value={address}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder={demoMode ? "Demo address active" : "ciphermint1..."}
        className="cm-input"
      />
      <button
        type="submit"
        disabled={loading || (!address && !demoMode)}
        className="cm-button"
      >
        {loading ? "Loading..." : demoMode ? "Run Demo" : "Load Wallet"}
      </button>
      {demoMode && (
        <p className="cm-helper">
          Demo mode is enabled. Data shown is simulated for presentation.
        </p>
      )}
    </form>
  );
}
