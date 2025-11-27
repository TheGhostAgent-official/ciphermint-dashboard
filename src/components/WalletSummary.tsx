import type { Coin } from "@/lib/ciphermintApi";

type WalletSummaryProps = {
  address: string;
  balances: Coin[];
};

export default function WalletSummary({
  address,
  balances,
}: WalletSummaryProps) {
  return (
    <div className="cm-card">
      <h2 className="cm-card-title">Wallet Overview</h2>
      <p className="cm-address">{address}</p>

      {balances.length === 0 ? (
        <p className="cm-helper" style={{ marginTop: 12 }}>
          No balances found.
        </p>
      ) : (
        <div style={{ marginTop: 12 }}>
          {balances.map((coin) => (
            <div
              key={`${coin.denom}-${coin.amount}`}
              className="cm-balance-row"
            >
              <span className="cm-balance-denom">{coin.denom}</span>
              <span className="cm-balance-amount">{coin.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
