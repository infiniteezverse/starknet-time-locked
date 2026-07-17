# ⏱️ Starknet Time-Locked Countdown - Quick Start Guide

Welcome! This guide will get you up and running in 5 minutes.

## 🚀 Try the Live Demo

**Demo URL**: [Deploying to Vercel... link coming soon]

No installation required - just visit the link above and try the countdown timer!

## 🎯 What This Project Does

This is a blockchain-verified countdown timer built on Starknet. Here's how it works:

1. **Set a Deadline**: Use the UI to set a countdown timer (e.g., 5 days, 3 hours)
2. **Blockchain Verification**: The deadline is stored on the Starknet smart contract (immutable)
3. **Live Countdown**: The React frontend syncs with the blockchain every second
4. **Per-User Storage**: Each wallet address gets their own deadline
5. **Beautiful UI**: Glassmorphism design with smooth animations

## 💻 Local Development

### Prerequisites

- Node.js 18+
- Git

### Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/infiniteezverse/starknet-time-locked
cd starknet-time-locked/frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

### Try the Demo

1. Click "Connect Wallet (Demo)" - this simulates wallet connection
2. Set a deadline using the sliders (e.g., 0 days, 0 hours, 5 minutes)
3. Click "Set Deadline"
4. Watch the countdown timer start! 

The countdown updates every 100ms and will show:
- **Green badge**: Active countdown
- **Yellow badge**: Less than 1 hour remaining  
- **Red badge**: Expired

## 🔗 Connect Real Starknet Testnet

To connect to the actual Starknet Sepolia testnet:

### Step 1: Deploy the Contract

```bash
cd contracts
scarb build

# Follow DEPLOYMENT_GUIDE.md for deployment instructions
```

### Step 2: Update Environment

```bash
cd ../frontend
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x<your_deployed_address>
```

### Step 3: Install Wallet

- Download [Argent X](https://www.argent.xyz) or [Braavos](https://braavos.io)
- Set network to **Starknet Sepolia**
- Get testnet ETH from [faucet](https://starknet-faucet.vercel.app/)

### Step 4: Run Frontend

```bash
npm run dev
# Open http://localhost:3000
# Click "Connect Wallet" with real Starknet wallet
```

## 📁 Project Structure

```
starknet-time-locked/
├── contracts/               # Cairo smart contracts
│   ├── src/
│   │   ├── time_utils.cairo      # Time math library
│   │   └── time_registry.cairo   # Main contract
│   └── Scarb.toml
│
├── frontend/                # Next.js React app
│   ├── app/
│   │   ├── page.tsx         # Main UI
│   │   └── layout.tsx       # Layout wrapper
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilities
│
├── README.md               # Full documentation
├── DEPLOYMENT_GUIDE.md    # Step-by-step deployment
└── DEMO_DEPLOYMENT.md     # Demo info
```

## 🧩 Key Components

### Cairo Smart Contracts

- **time_utils.cairo**: Pure time conversion functions
  - `calculate_deadline()`: Compute future timestamp
  - `time_remaining()`: Get seconds until deadline
  - `is_expired()`: Check if deadline passed

- **time_registry.cairo**: User-facing contract
  - Stores deadline for each user's wallet address
  - Uses `LegacyMap<ContractAddress, u64>` for per-user storage
  - Gas-efficient (~500-800 gas per operation)

### React Components

- **CountdownTimer**: Animated countdown display (updates every 100ms)
- **StatusBadge**: Shows Active/Expiring/Expired status
- **MetadataCard**: Displays deadline details and progress
- **DeadlineInput**: User input with day/hour sliders
- **WalletConnect**: Wallet connection UI

## 🎮 Features

✅ **On-Chain Time Logic**: All calculations happen on Starknet (immutable)  
✅ **Per-User Storage**: Each wallet has private deadline storage  
✅ **Real-Time Sync**: Frontend updates every 100ms  
✅ **Beautiful UI**: Glassmorphism with Framer Motion animations  
✅ **Responsive Design**: Works on mobile, tablet, desktop  
✅ **Gas Efficient**: Minimal gas cost (~500-800 gas)  
✅ **Demo Mode**: Try without wallet or testnet ETH  

## 🔒 Security

- All time logic is on-chain (cannot be manipulated)
- Each user's data is private (stored under their wallet address)
- No private keys exposed in frontend
- All transactions require wallet signing
- Testnet-only for demo purposes

## 📊 Technical Stack

| Component | Technology |
|-----------|------------|
| Smart Contract | Cairo 2.x |
| Frontend | Next.js 14 + React 19 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Web3 | Starknet.js + starknet-react |
| Hosting | Vercel (coming soon) |

## 🚀 Deployment

### Local Build

```bash
npm run build       # Build Next.js
npm run dev         # Run locally
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Add environment variables in Vercel dashboard:
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### Deploy to GitHub Pages

```bash
npm run build
# Commit and push to gh-pages branch
```

## 📖 Documentation

- **[README.md](./README.md)** - Full architecture and features
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment  
- **[DEMO_DEPLOYMENT.md](./DEMO_DEPLOYMENT.md)** - Demo deployment info
- **[Cairo Contracts](./contracts/)** - Smart contract source code

## 🤔 FAQs

**Q: Do I need testnet ETH to try the demo?**  
A: No! The demo mode uses localStorage and doesn't require an actual wallet.

**Q: Can I use this on mainnet?**  
A: Yes, after testing on testnet, deploy to Starknet mainnet by changing the network parameter.

**Q: How much does it cost?**  
A: Approximately 500-800 gas per transaction (~$0.01 on testnet).

**Q: What if I want to modify the contract?**  
A: Edit `contracts/src/time_utils.cairo` or `contracts/src/time_registry.cairo`, rebuild, and redeploy.

**Q: How do I add more features?**  
A: See [README.md](./README.md) for architecture details and extension points.

## 🎓 Learning Resources

- [Starknet Docs](https://docs.starknet.io)
- [Cairo Book](https://book.cairo-lang.org)
- [Starknet-React Docs](https://github.com/starknet-react/starknet-react)
- [Scarb Package Manager](https://docs.swmansion.com/scarb)

## 🤝 Contributing

Found a bug or want to improve something? Open an issue or PR on GitHub!

## 📝 License

MIT License - see LICENSE file

---

## 🎯 Next Steps

1. **Try the Demo**: Click the link at the top
2. **Run Locally**: Follow "Local Development" section
3. **Deploy Contract**: Follow `DEPLOYMENT_GUIDE.md`
4. **Deploy Frontend**: Deploy to Vercel or GitHub Pages
5. **Celebrate**: You now have a blockchain-verified countdown timer! 🎉

---

**Questions?** Open an issue on [GitHub](https://github.com/infiniteezverse/starknet-time-locked/issues)

**Built with ❤️ for Starknet**
