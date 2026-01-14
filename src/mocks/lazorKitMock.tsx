import React, { useState } from 'react';

// Mock implementation for LazorKit SDK since package is not published yet
// Uses REAL WebAuthn biometry for authentic demo

export const LazorkitProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useState<{ smartWallet: string; credentialId?: string } | null>(null);

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

        // Simulate smart wallet creation
        const mockWallet = {
          smartWallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          credentialId: credential?.id
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
    signAndSendTransaction: async (tx: any) => {
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

        // Simulate gasless transaction
        await new Promise(resolve => setTimeout(resolve, 1500));

        return '5xKqXiGaslessTx_' + Date.now() + '_WebAuthn';

      } catch (error: any) {
        console.error('❌ Assinatura biométrica falhou:', error.name);
        throw new Error('Assinatura biométrica cancelada');
      }
    }
  };
};