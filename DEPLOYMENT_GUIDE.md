# 🚀 Deployment Guide: Starknet Time-Locked Countdown

This guide walks you through deploying the Cairo contracts to Starknet Sepolia testnet and setting up the frontend.

## Prerequisites

- Node.js 18+
- Scarb (installed via: `curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh`)
- Starkli (installed via: `curl https://get.starkli.sh | sh`)
- A Starknet testnet wallet (Argent X or Braavos)
- Some ETH on Starknet Sepolia testnet (get from [faucet](https://starknet-faucet.vercel.app/))

## Step 1: Deploy Cairo Contracts

### 1.1 Set Up Starknet Account

First, set up an account on Starknet Sepolia testnet:

```bash
# Initialize a new keystore
starkli account oz init ~/.starkli/account_sepolia --network sepolia

# Follow the prompts to create an account
# Note: You'll need to fund the account with testnet ETH first
```

### 1.2 Deploy TimeRegistry Contract

```bash
cd contracts

# Build contracts
scarb build

# Declare the contract (this uploads the contract code)
starkli declare target/dev/contracts_TimeRegistry.sierra.json \
  --account ~/.starkli/account_sepolia \
  --network sepolia \
  --keystore ~/.starkli/keystore.json

# Save the class hash returned (you'll need it for deployment)
# Example: 0x123...abc

# Deploy a contract instance
starkli deploy <CLASS_HASH> \
  --account ~/.starkli/account_sepolia \
  --network sepolia \
  --keystore ~/.starkli/keystore.json

# Save the deployed contract address (you'll need this for the frontend)
# Example: 0x456...def
```

### 1.3 Verify Contract Deployment

```bash
# Check if contract is deployed correctly
starkli call <CONTRACT_ADDRESS> get_my_deadline \
  --account ~/.starkli/account_sepolia \
  --network sepolia \
  --keystore ~/.starkli/keystore.json

# Should return 0 if no deadline is set yet
```

## Step 2: Set Up Frontend

### 2.1 Create Environment File

```bash
cd frontend

# Copy example environment file
cp .env.example .env.local

# Edit .env.local and add your deployed contract address
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x456...def (the address from step 1.3)
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Run Locally

```bash
npm run dev

# Open http://localhost:3000 in your browser
# Connect your Starknet testnet wallet
# Set a deadline and watch the countdown!
```

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy
```

### 3.2 Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add `NEXT_PUBLIC_CONTRACT_ADDRESS` with your deployed contract address
4. Redeploy: `vercel deploy --prod`

## Step 4: Deploy Frontend to GitHub Pages (Alternative)

```bash
# Update next.config.ts for static export
# npm run build
# Push to gh-pages branch
# Enable GitHub Pages in repository settings
```

## Verifying Deployment

### Test the Contract

1. Navigate to your deployed frontend
2. Connect your Starknet Sepolia wallet
3. Set a deadline (e.g., 5 days, 3 hours)
4. Verify the countdown starts and ticks
5. Check status badge updates

### Check Contract State

Use Starknet Explorer to verify contract calls:
- [Starknet Sepolia Explorer](https://sepolia.starkscan.co)
- Search for your contract address
- View transactions and state

## Troubleshooting

### Contract Deployment Fails

**Issue**: "Account not funded"
- **Solution**: Get testnet ETH from the faucet: https://starknet-faucet.vercel.app/

**Issue**: "Class hash not found"
- **Solution**: Make sure you've declared the contract (step 1.2) before deploying

### Frontend Connection Issues

**Issue**: "Unable to connect to contract"
- **Solution**: 
  1. Verify contract address in `.env.local`
  2. Check wallet is connected to Starknet Sepolia
  3. Verify contract exists on testnet explorer

**Issue**: "Wallet not showing in selector"
- **Solution**: 
  1. Install Argent X or Braavos extension
  2. Ensure testnet network is selected
  3. Refresh page

### Countdown Not Updating

**Issue**: Countdown shows 0 or doesn't sync
- **Solution**:
  1. Verify contract address is correct
  2. Set deadline again using the input form
  3. Check browser console for errors
  4. Wait for transaction to confirm on-chain

## Advanced: Deploy to Mainnet

Once you've tested on Sepolia, you can deploy to Starknet Mainnet:

```bash
# Create mainnet account
starkli account oz init ~/.starkli/account_mainnet --network mainnet

# Fund account with actual ETH
# Then declare and deploy same way as above with --network mainnet
```

## Monitoring & Maintenance

### Monitor Contract Usage

```bash
# View all set_deadline transactions
starkli logs <CONTRACT_ADDRESS> \
  --network sepolia \
  --account ~/.starkli/account_sepolia
```

### Update Contract (if needed)

To update the contract logic:
1. Modify Cairo code in `contracts/src/`
2. Rebuild: `scarb build`
3. Declare new version: `starkli declare ...`
4. Migrate state if necessary
5. Update frontend with new address

## Environment Configuration

### Frontend .env.local

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...  # Your deployed contract
NEXT_PUBLIC_NETWORK=SN_SEPOLIA         # Network selection
```

### Starkli Configuration

```bash
# Starkli stores configuration in:
~/.starkli/

# Contains:
# - account_sepolia/    # Account info
# - keystore.json       # Private key (encrypted)
# - env                 # Shell environment setup
```

## Support & Resources

- **Starknet Docs**: https://docs.starknet.io
- **Starkli Docs**: https://book.starkli.sh
- **Cairo Book**: https://book.cairo-lang.org
- **Starknet Discord**: https://discord.gg/starknet
- **Starknet Faucet**: https://starknet-faucet.vercel.app

---

**First-time deployment estimated time**: 15-20 minutes  
**Subsequent deployments**: 5-10 minutes

Good luck! 🚀
