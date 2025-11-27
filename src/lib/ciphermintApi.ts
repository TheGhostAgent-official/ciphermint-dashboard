export type ChainStatus = {
  chainId: string;
  latestBlockHeight: number; // primary name
  latestHeight: number;      // alias, for older components
  latestBlockTime: string;
  nodeVersion: string;
};

export type Coin = {
  denom: string;
  amount: string;
};

export type Transaction = {
  hash: string;
  height: number;
  timestamp: string;
  status: "Success" | "Failed" | "Pending";
};

export const DEMO_MODE =
  process.env.NEXT_PUBLIC_CIPHERMINT_DEMO_MODE === "true";

export const DEMO_ADDRESS = "ciphermint1demoaddressxyz";

const API_BASE =
  process.env.NEXT_PUBLIC_CIPHERMINT_API_BASE_URL ||
  "http://localhost:1317";

/**
 * DEMO DATA
 * This is what investors see when demo mode is enabled.
 */
const DEMO_CHAIN_STATUS: ChainStatus = {
  chainId: "ciphermint-demo-1",
  latestBlockHeight: 18235,
  latestHeight: 18235,
  latestBlockTime: "2025-11-26T11:14:10Z",
  nodeVersion: "CipherMintd demo-node v0.1.0",
};

const DEMO_BALANCES: Coin[] = [
  { denom: "ucmint", amount: "125000000" },
  { denom: "urackd", amount: "84500000" },
];

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    hash: "A2F4F1DEMO1234567890ABCDEF",
    height: 18235,
    timestamp: "2025-11-26T11:14:10Z",
    status: "Success",
  },
  {
    hash: "B9E0DEMO0987654321FEDCBA",
    height: 18210,
    timestamp: "2025-11-26T10:39:10Z",
    status: "Success",
  },
];

/**
 * In DEMO_MODE we NEVER call the real API.
 */

export async function fetchChainStatus(): Promise<ChainStatus> {
  if (DEMO_MODE) {
    return DEMO_CHAIN_STATUS;
  }

  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) {
    throw new Error("Failed to fetch chain status from API");
  }
  const data = await res.json();

  const heightNum = Number(data?.sync_info?.latest_block_height ?? 0);

  return {
    chainId: data?.node_info?.network ?? "unknown",
    latestBlockHeight: heightNum,
    latestHeight: heightNum,
    latestBlockTime: data?.sync_info?.latest_block_time ?? "",
    nodeVersion: data?.node_info?.version ?? "unknown",
  };
}

export async function fetchBalances(
  address: string
): Promise<{ balances: Coin[] }> {
  if (DEMO_MODE) {
    return { balances: DEMO_BALANCES };
  }

  const res = await fetch(
    `${API_BASE}/cosmos/bank/v1beta1/balances/${address}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch balances from API");
  }
  const data = await res.json();

  const balances: Coin[] =
    data?.balances?.map((b: any) => ({
      denom: b.denom,
      amount: b.amount,
    })) ?? [];

  return { balances };
}

export async function fetchRecentTransactions(
  address: string
): Promise<Transaction[]> {
  if (DEMO_MODE) {
    return DEMO_TRANSACTIONS;
  }

  // Endpoint can be refined when we plug into the live chain.
  const res = await fetch(
    `${API_BASE}/txs?message.sender=${encodeURIComponent(address)}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch transactions from API");
  }
  const data = await res.json();

  const txs: Transaction[] =
    data?.txs?.map((tx: any) => ({
      hash: tx.txhash,
      height: Number(tx.height ?? 0),
      timestamp: tx.timestamp ?? "",
      status: tx.code === 0 ? "Success" : "Failed",
    })) ?? [];

  return txs;
}
