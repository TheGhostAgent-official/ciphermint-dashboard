export type ChainStatus = {
  latestHeight: number;
  latestBlockTime: string;
  nodeVersion: string;
};

export type Coin = {
  denom: string; // e.g. "ucmint"
  amount: string; // micro units as string
};

export type Transaction = {
  hash: string;
  height: number;
  timestamp: string;
  status: "Success" | "Failed" | "Pending";
  success: boolean;
};

export type DemoWallet = {
  id: string;
  label: string;
  address: string;
  description: string;
};

export const DEMO_MODE =
  process.env.NEXT_PUBLIC_CIPHERMINT_DEMO_MODE === "true";

export const DEMO_WALLETS: DemoWallet[] = [
  {
    id: "primary",
    label: "Main CipherMint Wallet",
    address: "ciphermint1demoaddressxyz",
    description: "Primary wallet for ecosystem activity.",
  },
  {
    id: "gamer",
    label: "Gamer Earnings Wallet",
    address: "ciphermintgamerxyz000001",
    description: "In-game rewards and drops.",
  },
  {
    id: "creator",
    label: "Creator Royalty Wallet",
    address: "ciphermintcreatorxyz0001",
    description: "Payouts from creator economies.",
  },
];

export const DEMO_ADDRESS = DEMO_WALLETS[0].address;

const API_BASE =
  process.env.NEXT_PUBLIC_CIPHERMINT_API_BASE_URL || "http://localhost:1317";

/** Demo chain status (shared across wallets in demo mode). */
export const DEMO_CHAIN_STATUS: ChainStatus = {
  latestHeight: 18235,
  latestBlockTime: "2025-11-26T11:14:10Z",
  nodeVersion: "CipherMint demo-node v0.1.0",
};

export const DEMO_BALANCES_BY_ADDRESS: Record<string, Coin[]> = {
  [DEMO_WALLETS[0].address]: [
    { denom: "ucmint", amount: "125000000" }, // 125 CMINT
    { denom: "urackd", amount: "84500000" },  // 84.5 RACKD
  ],
  [DEMO_WALLETS[1].address]: [
    { denom: "ucmint", amount: "56000000" },  // 56 CMINT
    { denom: "urackd", amount: "126000000" }, // 126 RACKD
  ],
  [DEMO_WALLETS[2].address]: [
    { denom: "ucmint", amount: "92000000" },
    { denom: "urackd", amount: "30500000" },
  ],
};

export const DEMO_TXS_BY_ADDRESS: Record<string, Transaction[]> = {
  [DEMO_WALLETS[0].address]: [
    {
      hash: "A2F4F1DEMO123",
      height: 18235,
      timestamp: "2025-11-26T11:14:10Z",
      status: "Success",
      success: true,
    },
    {
      hash: "B9E0DEMO4567",
      height: 18210,
      timestamp: "2025-11-26T10:39:10Z",
      status: "Success",
      success: true,
    },
  ],
  [DEMO_WALLETS[1].address]: [
    {
      hash: "GAMERDROP777",
      height: 18190,
      timestamp: "2025-11-26T09:22:00Z",
      status: "Success",
      success: true,
    },
  ],
  [DEMO_WALLETS[2].address]: [
    {
      hash: "CREATORPAY001",
      height: 18110,
      timestamp: "2025-11-26T08:02:00Z",
      status: "Success",
      success: true,
    },
  ],
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchChainStatus(): Promise<ChainStatus> {
  if (DEMO_MODE) {
    await delay(300);
    return DEMO_CHAIN_STATUS;
  }

  const res = await fetch(`${API_BASE}/chain/status`, {
    next: { revalidate: 5 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chain status");
  }

  const data = await res.json();
  return {
    latestHeight: Number(data.latest_height ?? data.height ?? 0),
    latestBlockTime: data.latest_block_time ?? data.block_time ?? "",
    nodeVersion: data.node_version ?? data.version ?? "unknown",
  };
}

export async function fetchBalances(
  address: string
): Promise<{ balances: Coin[] }> {
  if (DEMO_MODE) {
    await delay(300);
    const balances =
      DEMO_BALANCES_BY_ADDRESS[address] ??
      DEMO_BALANCES_BY_ADDRESS[DEMO_ADDRESS] ??
      [];
    return { balances };
  }

  const res = await fetch(`${API_BASE}/wallets/${address}/balances`, {
    next: { revalidate: 5 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch balances");
  }

  const data = await res.json();
  const balances: Coin[] = (data.balances ?? []).map((b: any) => ({
    denom: String(b.denom),
    amount: String(b.amount),
  }));
  return { balances };
}

export async function fetchRecentTransactions(
  address: string
): Promise<Transaction[]> {
  if (DEMO_MODE) {
    await delay(400);
    return DEMO_TXS_BY_ADDRESS[address] ?? [];
  }

  const res = await fetch(`${API_BASE}/wallets/${address}/transactions`, {
    next: { revalidate: 5 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const data = await res.json();
  return (data.txs ?? []).map((tx: any) => ({
    hash: String(tx.hash),
    height: Number(tx.height ?? 0),
    timestamp: String(tx.timestamp ?? ""),
    status: (tx.status ?? "Success") as "Success" | "Failed" | "Pending",
    success: Boolean(
      tx.success ?? (tx.status ? tx.status === "Success" : true)
    ),
  }));
}
