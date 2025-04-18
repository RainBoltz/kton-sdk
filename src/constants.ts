// Timing-related constants
export const TIMING = {
  DEFAULT_INTERVAL: 5000,
  TIMEOUT: 600000,
  CACHE_TIMEOUT: 30000,
  ESTIMATED_TIME_BW_TX_S: 3,
  ESTIMATED_TIME_AFTER_ROUND_S: 10 * 60,
};

// Blockchain-related constants
export const BLOCKCHAIN = {
  CHAIN_DEV: "-3",
  API_URL: "https://tonapi.io",
  API_URL_TESTNET: "https://testnet.tonapi.io",
};

// Contract-related constants
export const CONTRACT = {
  STAKING_CONTRACT_ADDRESS: "EQA9HwEZD_tONfVz6lJS0PVKR5viEiEGyj9AuQewGQVnXPg0",
  STAKING_CONTRACT_ADDRESS_TESTNET: "kQD2y9eUotYw7VprrD0UJvAigDVXwgCCLWAl-DjaamCHniVr",
  PARTNER_CODE: 0x0000000074746f6e,
  PAYLOAD_UNSTAKE: 0x595f07bc,
  PAYLOAD_STAKE: 0x47d54391,
  STAKE_FEE_RES: 1,
  UNSTAKE_FEE_RES: 1.05,
  RECOMMENDED_FEE_RESERVE: 1.1,
};
