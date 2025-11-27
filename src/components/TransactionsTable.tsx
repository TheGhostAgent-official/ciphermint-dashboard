import type { Transaction } from "@/lib/ciphermintApi";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  return (
    <div className="cm-card">
      <h2 className="cm-card-title">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="cm-helper" style={{ marginTop: 12 }}>
          No recent transactions.
        </p>
      ) : (
        <div className="cm-table-wrapper">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Height</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.hash}>
                  <td className="cm-hash">
                    {tx.hash.slice(0, 10)}...
                  </td>
                  <td className="cm-hash">{tx.height}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>
                    <span
                      className={[
                        "cm-status-pill",
                        tx.success
                          ? "cm-status-success"
                          : "cm-status-failed",
                      ].join(" ")}
                    >
                      {tx.success ? "Success" : "Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
