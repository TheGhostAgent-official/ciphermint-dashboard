export type ChainStatus = {
  chainId: string;
  latestBlockHeight: number; // primary
  latestHeight: number;      // alias for older UI code
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
  success: boolean;
};

export type DemoWallet = {
  id: string;
  label: string;
  address: string;
  description?: string;
};

export const DEMO_MODE =
  process.env.NEXT_PUBLIC_CIPHERMINT_DEMO_MODE === "true";

/**
 * Demo wallets that appear in the UI.
 */
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
    address: "ciphermint1gamerxyz000001",
    description: "In-game rewards and drops.",
  },
  {
    id: "creator",
    label: "Creator Royalty Wallet",
    address: "ciphermint1creatorxyz0001",
    description: "Payouts from creator economies.",
  },
];

export const DEMO_ADDRESS = DEMO_WALLETS[0].address;

const API_BASE =
  process.env.NEXT_PUBLIC_CIPHERMINT_API_BASE_URL ||
  "http://localhost:1317";

/**
 * Demo chain status (shared for all wallets in demo mode).
 */
const DEMO_CHAIN_STATUS: ChainStatus = {
  chainId: "ciphermint-demo-1",
  latestBlockHeight: 18235,
  latestHeight: 18235,
  latestBlockTime: "2025-11-26T11:14:10Z",
  nodeVersion: "CipherMintd demo-node v0.1.0",
};

/**
 * Per-wallet demo balances.
 * Amounts are in "micro" units (e.g. ucmint => divide by 1e6 for display).
 */
const DEMO_BALANCES_BY_ADDRESS: Record<string, Coin[]> = {
  [DEMO_WALLETS[0].address]: [
    { denom: "ucmint", amount: "125000000" }, // 125 CMINT
    { denom: "urackd", amount: "84500000" },  // 84.5 RACKD
    { denom: "ugame", amount: "56000000" },   // 56 GAME
  ],
  [DEMO_WALLETS[1].address]: [
    { denom: "ucmint", amount: "42000000" },
    { denom: "urackd", amount: "125000000" },
    { denom: "uxp", amount: "230000000" }, // XP-like token
  ],
  [DEMO_WALLETS[2].address]: [
    { denom: "ucmint", amount: "220000000" },
    { denom: "urackd", amount: "32000000" },
    { denom: "uroyal", amount: "99000000" }, // royalties
  ],
};

/**
 * Per-wallet demo transactions.
 */
const DEMO_TX_BY_ADDRESS: Record<string, Transaction[]> = {
  [DEMO_WALLETS[0].address]: [
    {
      hash: "A2F4F1DEMO1234567890ABCDEF",
      height: 18235,
      timestamp: "2025-11-26T11:14:10Z",
      status: "Success",
      success: true,
    },
    {
      hash: "B9E0DEMO0987654321FEDCBA",
      height: 18210,
      timestamp: "2025-11-26T10:39:10Z",
      status: "Success",
      success: true,
    },
    {
      hash: "C7D9DEMOFF00112233445566",
      height: 18180,
      timestamp: "2025-11-26T09:58:10Z",
      status: "Failed",
      success: false,
    },
  ],
  [DEMO_WALLETS[1].address]: [
    {
      hash: "GAMERDEMO1122334455667788",
      height: 18200,
      timestamp: "2025-11-25T21:14:10Z",
      status: "Success",
      success: true,
    },
    {
      hash: "GAMERDROP9988776655443322",
      height: 18170,
      timestamp: "2025-11-25T20:01:10Z",
      status: "Success",
      success: true,
    },
  ],
  [DEMO_WALLETS[2].address]: [
    {
      hash: "CRE8PAY0000111122223333",
      height: 18100,
      timestamp: "2025-11-24T15:14:10Z",
      status: "Success",
      success: true,
    },
    {
      hash: "CRE8FAIL9999888877776666",
      height: 18090,
      timestamp: "2025-11-24T14:55:10Z",
      status: "Failed",
      success: false,
    },
  ],
};

/**
 * In DEMO_MODE we NEVER call a real API.
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
    const balances =
      DEMO_BALANCES_BY_ADDRESS[address] ??
      DEMO_BALANCES_BY_ADDRESS[DEMO_WALLETS[0].address];
    return { balances };
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
    return DEMO_TX_BY_ADDRESS[address] ?? [];
  }

  const res = await fetch(
    `${API_BASE}/txs?message.sender=${encodeURIComponent(address)}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch transactions from API");
  }
  const data = await res.json();

  const txs: Transaction[] =
    data?.txs?.map((tx: any) => {
      const ok = tx.code === 0;
      return {
        hash: tx.txhash,
        height: Number(tx.height ?? 0),
        timestamp: tx.timestamp ?? "",
        status: ok ? "Success" : "Failed",
        success: ok,
      };
    }) ?? [];

  return txs;
}
