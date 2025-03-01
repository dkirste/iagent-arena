# Correct Flow to Run the iAgent with Trading System Prompts

Based on the logs you've shared, I can see you've encountered several issues while trying to run the application. Here's the correct sequence to ensure everything works properly:

## 1. Prerequisites

First, ensure you have the proper Node.js environment:

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# In lieu of restarting the shell
. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 23.3.0

# Verify the Node.js version:
node -v # Should print "v23.9.0" or similar
nvm current # Should print "v23.9.0" or similar

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v
```

Alternatively, if you already have npm installed:

```bash
# Install the specific pnpm version required
npm install -g pnpm@9.12.3
```

## 2. Set up the environment

```bash
# Navigate to the project directory
cd iagent-ts

# Copy the example environment file
cp .env.example .env

# Edit the .env file with your API keys
# INJECTIVE_PUBIC_KEY="XXXX"
# INJECTIVE_PRIVATE_KEY="XXXX"
# EVM_PUBLIC_KEY="XXXX"
# INJECTIVE_NETWORK="Mainnet"
# OPENAI_API_KEY="sks-x"
```

## 3. Clean install dependencies

```bash
# Remove existing node_modules to avoid conflicts
rm -rf node_modules

# Clean pnpm cache
pnpm store prune

# Fresh install dependencies
pnpm install --no-frozen-lockfile
```

## 4. Build the project

```bash
# Build all packages
pnpm build
```

## 5. Run the application

You need to run both the server and the client in separate terminal windows:

**Terminal 1 - Run the server:**
```bash
pnpm start
```

**Terminal 2 - Run the client:**
```bash
cd iagent-ts
pnpm start:client
```

The server should start and show the OpenAI plugin being loaded. The client should start and provide a URL (typically http://localhost:5173/).

## 6. Testing the trading system prompts

Once the application is running, navigate to the client URL in your browser and try some of the example queries from the trading system prompts documentation:

* Basic query: "What's the current state of the BTC/USDT market?"
* Advanced query: "I'd like to open a long position on ETH/USDT with 3x leverage, using 20% of my available balance, and set a stop loss at 5% below entry"

## Troubleshooting Common Issues

1. **Node.js version mismatch**
   * Solution: Use nvm to install and use Node.js v23

```bash
nvm install 23
nvm use 23
```

2. **pnpm version issues**
   * Solution: Try using npm instead for specific commands

```bash
npm run start:client
```

3. **Build errors**
   * Solution: Clean and rebuild

```bash
pnpm clean # if available
rm -rf node_modules
pnpm install --no-frozen-lockfile
pnpm build
```

4. **SQLite native module errors**
   * Solution: Rebuild the SQLite module

```bash
npm rebuild better-sqlite3
# or
pnpm rebuild better-sqlite3
```

5. **Missing dependencies**
   * Solution: Install global dependencies

```bash
npm install -g node-gyp
```

Following this sequence should help you successfully run the application with the new trading system prompts.