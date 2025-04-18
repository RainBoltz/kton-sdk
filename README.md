# KTON SDK

<img src="https://kton.io/logo.svg" width="300">

![npm](https://img.shields.io/npm/v/kton-sdk?color=red&label=npm%20version)
![npm](https://img.shields.io/npm/dt/kton-sdk?color=red&label=npm%20downloads)
![GitHub](https://img.shields.io/github/license/rainboltz/kton-sdk?color=blue&label=license)

> *forked via [tonstakers-sdk](https://github.com/tonstakers/tonstakers-sdk)*


KTON SDK offers an advanced set of tools for developers aiming to incorporate staking functionalities into their applications on the TON blockchain. This updated version introduces a more extensive interaction with the TON ecosystem, including staking operations, balance inquiries, and much more, enhancing your application's capabilities.

## Features

- Simplified staking and unstaking operations, including options for maximum stake, instant unstake, and best rate unstake.
- Retrieval of staked, available, TVL (Total Value Locked), and stakers count balances.
- Fetching current and historical APY (Annual Percentage Yield) for staked assets.
- Enhanced API key configuration for improved access limits to the tonapi.
- Event-driven architecture for initialization and deinitialization notifications.

## Installation

KTON SDK can be easily installed using npm or yarn, or integrated directly into your HTML pages.

### Using npm or yarn (WIP)

```bash
npm install kton-sdk
# or
yarn add kton-sdk
```

### Using a `<script>` tag

For direct HTML integration:

```html
<script src="path/to/kton-sdk.min.js"></script>
```

Replace `"path/to/kton-sdk.min.js"` with the actual SDK path.

## Usage

### In a Module Environment

Initialize the SDK with your wallet connector (usually, a TonConnect instance) and optional parameters:

```javascript
import { KTON } from "kton-sdk";

// this is an example connector
import { TonConnectUI } from "@tonconnect/ui";
export const tonConnectUI = new TonConnectUI({
  manifestUrl: MANIFEST_URL,
});

const kton = new KTON({
  connector: yourWalletConnector, // Your wallet connector
  partnerCode: 123456, // Optional partner code, limited to 64-bits
  tonApiKey: "YOUR_API_KEY", // Optional API key for tonapi
  isTestnet: false, // Optional testnet flag
});
```

### In a Browser Environment

Direct HTML file initialization:

```html
<script src="path/to/kton-sdk.min.js"></script>
<script>
  const { KTON } = KTONSDK;

  const kton = new KTON({
    connector: yourWalletConnector,
    partnerCode: 123456,
    tonApiKey: "YOUR_API_KEY",
    isTestnet: false,
  });
</script>
```

#### Event Listeners

```javascript
tonstakers.addEventListener("initialized", () => {
  console.log("KTON SDK initialized successfully.");
});

tonstakers.addEventListener("deinitialized", () => {
  console.log("KTON SDK has been deinitialized.");
});
```

#### Performing Operations

Stake and unstake with new methods:

```javascript
await kton.stake(1); // Stake 1 TON
await kton.unstake(1); // Unstake 1 tsTON
await kton.stakeMax(); // Stake the maximum available balance
await kton.unstakeInstant(1); // Instant unstake 1 tsTON
await kton.unstakeBestRate(1); // Unstake 1 tsTON at the best available rate
```

Retrieve information:

```javascript
const stakedBalance = await kton.getStakedBalance();
console.log(`Current staked balance: ${stakedBalance}`);

const tonBalance = await kton.getBalance();
console.log(`Current user ton balance: ${tonBalance}`);

const availableBalance = await kton.getAvailableBalance();
console.log(`Available balance for staking: ${availableBalance}`);

const currentApy = await kton.getCurrentApy();
console.log(`Current APY: ${currentApy}%`);

const historicalApy = await kton.getHistoricalApy();
console.log(`Historical APY data: ${historicalApy}`);

const tvl = await kton.getTvl();
console.log(`Total Value Locked (TVL): ${tvl}`);

const stakersCount = await kton.getStakersCount();
console.log(`Current number of stakers: ${stakersCount}`);

const rates = await kton.getRates();
console.log(`1 TON = ${rates.TONUSD} USD`);
console.log(`1 KTON = ${rates.KTONTON} TON`);
console.log(`Projected 1 KTON = ${rates.KTONTONProjected} TON`);

const [cycleStart, cycleEnd] = await tonstakers.getRoundTimestamps();
console.log(`Cycle start: ${cycleStart}, Cycle end: ${cycleEnd}`);

const activeWithdrawals = await tonstakers.getActiveWithdrawalNFTs();
console.log(`Active withdrawal NFTs: ${JSON.stringify(activeWithdrawals)}`);

const instantLiquidity = await tonstakers.getInstantLiquidity();
console.log(`Instant liquidity: ${instantLiquidity}`);
```

Clear storage data:

```javascript
await tonstakers.clearStorageData(); // Clear all cached data
await tonstakers.clearStorageUserData(); // Clear cached user-specific data
```

## Demo

A demo HTML page is included with the SDK to demonstrate integration into web applications, showcasing wallet connection, staking/unstaking operations, and balance updates.
