export type Coin = {
  denom: string;
  amount: string;
};

export type BalanceResponse = {
  balances: Coin[];
};

export type ChainStatus = {
  chainId: string;
  latestHeight: string;
  latestTime: string;
};

export type Transaction = {
  hash: string;
  height: string;
  timestamp: string;
  success: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CIPHERMINT_API_BASE_URL || "http://localhost:1317";

const DEMO_MODE =
  process.env.NEXT_PUBLIC_CIPHERMINT_DEMO_MODE === "true";

/**
 * ---- DEMO DATA ----
 * Used when DEMO_MODE=true so you can show investors
 * a working UI even if the node is offline.
 */
const DEMO_ADDRESS = "ciphermint1demoaddressxyz";

const DEMO_BALANCES: Coin[] = [
  { denom: "ucmint", amount: "125000000" },
  { denom: "urackd", amount: "84500000" },
];

const DEMO_CHAIN_STATUS: ChainStatus = {
  chainId: "ciphermint-local-1",
  latestHeight: "18240",
  latestTime: new Date().toISOString(),
};

const DEMO_TXS: Transaction[] = [
  {
    hash: "A2F4F1DEMO123456789",
    height: "18235",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    success: true,
  },
  {
    hash: "B7C9E0DEMO987654321",
    height: "18210",
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    success: true,
  },
];

async function httpGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `HTTP ${res.status} when calling ${url}: ${text || "No response body"}`
    );
  }

  return (await res.json()) as T;
}

/**
 * Get all balances for a given CipherMint address.
 *
 * Cosmos REST: /cosmos/bank/v1beta1/balances/{address}
 */
export async function fetchBalances(address: string): Promise<BalanceResponse> {
  if (DEMO_MODE) {
    return { balances: DEMO_BALANCES };
  }

  if (!address) {
    throw new Error("Address is required");
  }

  const data = await httpGet<{ balances: Coin[] }>(
    `/cosmos/bank/v1beta1/balances/${address}`
  );

  return {
    balances: data.balances || [],
  };
}

/**
 * Get latest chain status (height, time, chain ID) using Tendermint REST.
 *
 * Cosmos REST: /cosmos/base/tendermint/v1beta1/blocks/latest
 */
export async function fetchChainStatus(): Promise<ChainStatus> {
  if (DEMO_MODE) {
    return {
      ...DEMO_CHAIN_STATUS,
      latestTime: new Date().toISOString(),
    };
  }

  const data = await httpGet<{
    block_id: { hash: string };
    block: {
      header: {
        chain_id: string;
        height: string;
        time: string;
      };
    };
  }>(`/cosmos/base/tendermint/v1beta1/blocks/latest`);

  const chainId = data.block.header.chain_id;
  const latestHeight = data.block.header.height;
  const latestTime = data.block.header.time;

  return {
    chainId,
    latestHeight,
    latestTime,
  };
}

/**
 * Fetch recent transactions involving an address.
 *
 * Cosmos v1beta1 tx search using events.
 */
export async function fetchRecentTransactions(
  address: string,
  limit: number = 20
): Promise<Transaction[]> {
  if (DEMO_MODE) {
    return DEMO_TXS;
  }

  if (!address) {
    throw new Error("Address is required");
  }

  const query = encodeURIComponent(`message.sender='${address}'`);
  const path = `/cosmos/tx/v1beta1/txs?events=${query}&order_by=ORDER_BY_DESC&limit=${limit}`;

  const data = await httpGet<{
    tx_responses?: Array<{
      txhash: string;
      height: string;
      timestamp: string;
      code: number;
    }>;
  }>(path);

  const txs = data.tx_responses || [];

  return txs.map((tx) => ({
    hash: tx.txhash,
    height: tx.height,
    timestamp: tx.timestamp,
    success: tx.code === 0,
  }));
}

export { DEMO_ADDRESS, DEMO_MODE };
