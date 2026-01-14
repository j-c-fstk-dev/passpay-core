import { useEffect, useState } from 'react';
import { LazorkitProvider, useWallet } from '@lazorkit/wallet';
import WalletConnect from './components/WalletConnect';
import TransactionForm from './components/TransactionForm';
import './App.css';

// ============================================
// CONFIGURAÇÃO LAZORKIT
// Estes URLs vêm do .env e configuram:
// - rpcUrl: endpoint Devnet Solana
// - portalUrl: portal de autenticação biométrica
// - paymasterUrl: serviço que patrocina gas fees
// ============================================

const LAZORKIT_CONFIG = {
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://api.devnet.solana.com',
  portalUrl: import.meta.env.VITE_PORTAL_URL || 'https://portal.lazor.sh',
  configPaymaster: {
    paymasterUrl: import.meta.env.VITE_PAYMASTER_URL || 'https://kora.devnet.lazorkit.com',
  },
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function AppContent() {
  const { isConnected, wallet } = useWallet();
  const [isTransactionMode, setIsTransactionMode] = useState(false);

  // Se desconectou, volta a tela de conexão
  useEffect(() => {
    if (!isConnected) {
      setIsTransactionMode(false);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            💜 LazorKit Gasless Payments
          </h1>
          <p className="text-purple-300 text-sm mt-1">
            Pay USDC without SOL. No seed phrase. Biometric auth.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!isConnected ? (
          // Screen 1: Wallet Connection
          <div className="max-w-md mx-auto">
            <WalletConnect onSuccess={() => setIsTransactionMode(false)} />
          </div>
        ) : (
          // Screen 2: Transaction Interface
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Wallet Info */}
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Wallet</h2>
              <div className="bg-slate-900 rounded-lg p-4 break-all font-mono text-sm text-green-400">
                {wallet?.smartWallet}
              </div>
              <button
                onClick={() => setIsTransactionMode(!isTransactionMode)}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isTransactionMode ? 'Hide Form' : 'Send Payment'}
              </button>
            </div>

            {/* Right: Transaction Form */}
            {isTransactionMode && (
              <div>
                <TransactionForm
                  senderAddress={wallet?.smartWallet || ''}
                  onSuccess={() => setIsTransactionMode(false)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 backdrop-blur mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-purple-300 text-sm">
          <p>Built with LazorKit | <a href="https://github.com/lazor-kit" className="hover:text-white">GitHub</a></p>
          <p className="mt-1">⚠️ Pre-audit demo. Devnet only.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// APP ROOT COM PROVIDER
// LazorkitProvider wraps toda a app
// Fornece useWallet() hook para qualquer filho
// ============================================

export default function App() {
  return (
    <LazorkitProvider {...LAZORKIT_CONFIG}>
      <AppContent />
    </LazorkitProvider>
  );
}
