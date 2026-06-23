# Stellar White Belt dApp

A simple Stellar Testnet dApp built with React, Freighter, and Stellar SDK.

## Features
- Connect and disconnect Freighter wallet
- Fetch and display XLM balance
- Send XLM on Stellar Testnet
- Show transaction success or failure with hash

## Tech Stack
- React
- Vite
- @stellar/freighter-api
- @stellar/stellar-sdk

## Setup

### 1. Clone the repo
```bash
git clone <your-github-repo-url>
cd stellar-white-belt
```

### 2. Install dependencies
```bash
npm install
npm install @stellar/freighter-api @stellar/stellar-sdk
```

### 3. Run locally
```bash
npm run dev
```

## Wallet Setup
1. Install Freighter.
2. Switch Freighter to Testnet.
3. Fund your testnet account with Friendbot.

## Screenshots
### Wallet connected
![Wallet connected](./screenshots/wallet-connected.png)

### Balance displayed
![Balance displayed](./screenshots/balance.png)

### Successful transaction
![Successful transaction](./screenshots/transaction-success.png)

### Transaction feedback
![Transaction feedback](./screenshots/transaction-feedback.png)