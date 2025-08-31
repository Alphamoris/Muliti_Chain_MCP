#!/usr/bin/env node

import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔑 Generating new accounts for Solana and Ethereum...\n');

// Generate Solana keypair
const solanaKeypair = Keypair.generate();
const solanaPrivateKey = Buffer.from(solanaKeypair.secretKey).toString('base64');
const solanaPublicKey = solanaKeypair.publicKey.toString();

console.log('🌟 SOLANA ACCOUNT (Devnet):');
console.log('├─ Public Key:', solanaPublicKey);
console.log('├─ Private Key:', solanaPrivateKey);
console.log('└─ Explorer: https://explorer.solana.com/address/' + solanaPublicKey + '?cluster=devnet\n');

// Generate Ethereum wallet
const ethereumWallet = ethers.Wallet.createRandom();
const ethereumPrivateKey = ethereumWallet.privateKey;
const ethereumAddress = ethereumWallet.address;

console.log('⚡ ETHEREUM ACCOUNT (Mainnet):');
console.log('├─ Address:', ethereumAddress);
console.log('├─ Private Key:', ethereumPrivateKey);
console.log('└─ Explorer: https://etherscan.io/address/' + ethereumAddress + '\n');

// Update .env file
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update existing keys
    envContent = envContent.replace(/SOLANA_PRIVATE_KEY=.*/, `SOLANA_PRIVATE_KEY=${solanaPrivateKey}`);
    envContent = envContent.replace(/ETH_PRIVATE_KEY=.*/, `ETH_PRIVATE_KEY=${ethereumPrivateKey}`);
} else {
    // Create new .env content
//     envContent = `# Generated accounts
// SOLANA_PRIVATE_KEY=${solanaPrivateKey}
// ETH_PRIVATE_KEY=${ethereumPrivateKey}
// `;
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Updated .env file with new private keys');
console.log('\n🚨 SECURITY WARNING:');
console.log('   Keep these private keys secure and never share them!');
console.log('   The private keys have been saved to your .env file.');

console.log('\n💰 FUNDING:');
console.log('🌟 Solana Devnet: Get free SOL at https://faucet.solana.com');
console.log('⚡ Ethereum Mainnet: You need to fund this address with real ETH');
