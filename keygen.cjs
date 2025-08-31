#!/usr/bin/env node

/**
 * Solana Key Pair Generator
 * Generates a new Solana public/private key pair
 * 
 * Usage: node keygen.js
 * 
 * Requirements: npm install @solana/web3.js
 */

const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

function generateKeyPair() {
    try {
        console.log('\n🔐 Generating new Solana key pair...\n');
    
        const keypair = Keypair.generate();

        const publicKey = keypair.publicKey.toString();
        const privateKeyArray = keypair.secretKey;
        const privateKeyBase58 = bs58.encode(privateKeyArray);

        console.log('✅ Key pair generated successfully!\n');
        
        console.log('📋 ACCOUNT DETAILS:');
        console.log('═'.repeat(60));
        
        console.log('\n🔑 Private Key (Base58):');
        console.log(`   ${privateKeyBase58}`);
        
        console.log('\n🔑 Private Key (Uint8Array):');
        console.log(`   [${privateKeyArray.join(', ')}]`);
        
        console.log('\n🏠 Public Key (Base58):');
        console.log(`   ${publicKey}`);
        
        console.log('\n' + '═'.repeat(60));
        
        return {
            publicKey,
            privateKeyBase58,
            privateKeyArray
        };
        
    } catch (error) {
        console.error('❌ Error generating key pair:', error.message);
        process.exit(1);
    }
}

// Function to display help
function displayHelp() {
    console.log(`
🔐 Solana Key Pair Generator

DESCRIPTION:
    Generates a new Solana public/private key pair using @solana/web3.js

USAGE:
    node keygen.js [options]

OPTIONS:
    -h, --help     Show this help message
    -v, --version  Show version information
    -j, --json     Output in JSON format

EXAMPLES:
    node keygen.js              Generate a new key pair
    node keygen.js --json       Generate key pair in JSON format
    node keygen.js --help       Show help

REQUIREMENTS:
    npm install @solana/web3.js

SECURITY:
    This tool generates cryptographically secure random keys.
    Always keep your private key secret and secure!

FORMATS:
    • Public Key: Base58 encoded string (44 characters)
    • Private Key: Available in both Base58 and Uint8Array formats
    • Base58 format is commonly used for wallet imports
    • Uint8Array format is used in code applications
`);
}

// Function to generate and output JSON format
function generateKeyPairJSON() {
    try {
        const keypair = Keypair.generate();
        const result = {
            publicKey: keypair.publicKey.toString(),
            privateKey: {
                base58: bs58.encode(keypair.secretKey),
                uint8Array: Array.from(keypair.secretKey)
            },
            timestamp: new Date().toISOString()
        };
        
        console.log(JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('❌ Error generating key pair:', error.message);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('-h') || args.includes('--help')) {
    displayHelp();
    process.exit(0);
}

if (args.includes('-v') || args.includes('--version')) {
    console.log('Solana Key Generator v1.0.0');
    process.exit(0);
}

if (args.includes('-j') || args.includes('--json')) {
    generateKeyPairJSON();
    process.exit(0);
}

// Main execution
if (require.main === module) {
    generateKeyPair();
}

module.exports = { generateKeyPair, generateKeyPairJSON };