import React, { useState, useCallback } from 'react';

// Mock implementation for LazorKit SDK since package is not published yet
// Uses REAL WebAuthn biometry for authentic demo

// Mock transaction data
const generateMockTransactions = () => [
  {
    id: 'tx_001',
    hash: '5xKqXiGaslessTx_' + Date.now() + '_demo_001',
    type: 'send',
    amount: '25.50',
    token: 'USDC',
    to: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'confirmed',
    gasless: true
  },
  {
    id: 'tx_002',
    hash: '5xKqXiGaslessTx_' + Date.now() + '_demo_002',
    type: 'receive',
    amount: '100.00',
    token: 'USDC',
    from: 'So11111111111111111111111111111111111111112',
    timestamp: Date.now() - 172800000, // 2 days ago
    status: 'confirmed',
    gasless: true
  },
  {
    id: 'tx_003',
    hash: '5xKqXiGaslessTx_' + Date.now() + '_demo_003',
    type: 'send',
    amount: '15.25',
    token: 'USDC',
    to: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    timestamp: Date.now() - 259200000, // 3 days ago
    status: 'confirmed',
    gasless: true
  }
];

export const LazorkitProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useState<{
    smartWallet: string;
    credentialId?: string;
    balance: { usdc: string; usd: string };
    transactions: any[];
  } | null>(null);

  return {
    connect: async ({ feeMode }: { feeMode?: string } = {}) => {
      setIsConnecting(true);
      console.log('🔐 Iniciando autenticação biométrica real (WebAuthn)...');
      void feeMode; // Mark as used to satisfy TypeScript

      try {
        // REAL WebAuthn - Creates biometric credential
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)), // Secure random challenge
            rp: {
              name: "LazorKit Bounty Demo",
              id: window.location.hostname
            },
            user: {
              id: crypto.getRandomValues(new Uint8Array(16)),
              name: "demo@lazorkit-bounty.com",
              displayName: "Demo User"
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" }, // ES256
              { alg: -257, type: "public-key" } // RS256
            ],
            authenticatorSelection: {
              userVerification: "required", // REQUIRES biometric/PIN
              residentKey: "preferred"
            },
            timeout: 60000
          }
        } as any);

        console.log('✅ BIOMETRIA CONFIRMADA! Credencial criada:', credential);

        // Simulate smart wallet creation with balance and transactions
        const walletAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        void walletAddress; // Mark as used for TypeScript
        const mockWallet = {
          smartWallet: walletAddress,
          credentialId: credential?.id,
          balance: {
            usdc: '150.75',
            usd: '150.75'
          },
          transactions: generateMockTransactions()
        };

        setWallet(mockWallet);
        setIsConnected(true);

        return mockWallet;
      } catch (error: any) {
        console.error('❌ Biometria falhou:', error.name);
        if (error.name === 'NotAllowedError') {
          alert('Autenticação biométrica cancelada. Use digital/PIN/FaceID.');
        } else if (error.name === 'NotSupportedError') {
          alert('WebAuthn não suportado neste navegador.');
        }
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    disconnect: () => {
      console.log('👋 Wallet desconectada');
      setIsConnected(false);
      setWallet(null);
    },
    isConnected,
    isConnecting,
    wallet,
    signAndSendTransaction: useCallback(async (tx: any) => {
      console.log('🔐 Solicitando segunda autenticação biométrica...');
      void tx; // Mark as used

      try {
        // REAL WebAuthn assertion for signing
        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            allowCredentials: wallet?.credentialId ? [{
              id: new TextEncoder().encode(wallet.credentialId),
              type: 'public-key'
            }] : [],
            userVerification: 'required' // REQUIRES biometric again
          }
        } as any);

        void assertion; // Mark as used for TypeScript

        console.log('✅ Assinatura biométrica confirmada!');

        // Simulate gasless transaction with balance update
        await new Promise(resolve => setTimeout(resolve, 1500));

        const txHash = '5xKqXiGaslessTx_' + Date.now() + '_WebAuthn';

        // Update wallet with new transaction and reduced balance
        if (wallet) {
          const amount = 25.50; // Mock amount being sent
          const newBalance = parseFloat(wallet.balance.usdc) - amount;
          const newTransaction = {
            id: `tx_${Date.now()}`,
            hash: txHash,
            type: 'send',
            amount: amount.toString(),
            token: 'USDC',
            to: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Mock recipient
            timestamp: Date.now(),
            status: 'confirmed',
            gasless: true
          };

          setWallet({
            ...wallet,
            balance: {
              usdc: newBalance.toFixed(2),
              usd: newBalance.toFixed(2)
            },
            transactions: [newTransaction, ...wallet.transactions]
          });
        }

        return txHash;

      } catch (error: any) {
        console.error('❌ Assinatura biométrica falhou:', error.name);
        throw new Error('Assinatura biométrica cancelada');
      }
    }, [wallet])
  };
};