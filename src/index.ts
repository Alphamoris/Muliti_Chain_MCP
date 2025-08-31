import { config } from 'dotenv';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for .env file
const envPath = resolve(__dirname, '../.env');
console.error('Looking for .env file at:', envPath);
console.error('.env file exists:', existsSync(envPath));

// Load environment variables
const result = config({ path: envPath });
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGeneralTools } from "./general/index.js";

// Create server instance
const server = new McpServer({
  name: "web3-rpc",
  version: "1.0.0",
});

// Helper function to check if a feature is enabled
const isEnabled = (envVar: string): boolean => {
  const value = process.env[envVar]?.toLowerCase();
  return value === 'true' || value === '1' || value === 'yes';
};

// Register general tools
console.error('Registering general tools...');
registerGeneralTools(server);

async function main() {
  // Register chain-specific tools based on environment variables
  if (isEnabled('ENABLE_SOLANA_TOOLS')) {
    console.error('Registering Solana tools...');
    const { registerSolanaTools } = await import('./chains/solana/solana.js');
    registerSolanaTools(server);
  }

  if (isEnabled('ENABLE_EVM_TOOLS')) {
    console.error('Registering EVM chain tools...');
    const { registerEvmTools } = await import('./chains/evm/evm.js');
    registerEvmTools(server);
  }

  // UTXO Chain Tools
  if (isEnabled('ENABLE_BITCOIN_TOOLS')) {
    console.error('Registering Bitcoin tools...');
    const { registerBitcoinTools } = await import('./chains/UTXO/index.js');
    registerBitcoinTools(server);
  }

  if (isEnabled('ENABLE_LITECOIN_TOOLS')) {
    console.error('Registering Litecoin tools...');
    const { registerLitecoinTools } = await import('./chains/UTXO/index.js');
    registerLitecoinTools(server);
  }

  if (isEnabled('ENABLE_DOGECOIN_TOOLS')) {
    console.error('Registering Dogecoin tools...');
    const { registerDogecoinTools } = await import('./chains/UTXO/index.js');
    registerDogecoinTools(server);
  }

  if (isEnabled('ENABLE_BITCOINCASH_TOOLS')) {
    console.error('Registering Bitcoin Cash tools...');
    const { registerBitcoinCashTools } = await import('./chains/UTXO/index.js');
    registerBitcoinCashTools(server);
  }

  if (isEnabled('ENABLE_CARDANO_TOOLS')) {
    console.error('Registering Cardano tools...');
    const { registerCardanoTools } = await import('./chains/UTXO/index.js');
    registerCardanoTools(server);
  }

  if (isEnabled('ENABLE_THORCHAIN_TOOLS')) {
    console.error('Registering THORChain tools...');
    const { registerThorchainTools } = await import('./chains/thorchain/thorchain.js');
    registerThorchainTools(server);
  }

  if (isEnabled('ENABLE_RIPPLE_TOOLS')) {
    console.error('Registering Ripple (XRP) tools...');
    const { registerRippleTools } = await import('./chains/ripple/ripple.js');
    registerRippleTools(server);
  }

  if (isEnabled('ENABLE_TON_TOOLS')) {
    console.error('Registering TON tools...');
    const { registerTonTools } = await import('./chains/ton/ton.js');
    registerTonTools(server);
  }

  console.error('All tool registration complete. Starting MCP server...');
  const transport = new StdioServerTransport();
  console.error('Server connecting to transport...');
  await server.connect(transport);
  console.error('MCP Server is ready and listening for connections!');
}

main().catch((err: unknown) => {
  const error = err as Error;
  console.error("Fatal error in main():", error.message);
  process.exit(1);
});