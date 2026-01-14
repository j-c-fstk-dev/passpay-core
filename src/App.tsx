import { useEffect, useState } from 'react';
import { LazorkitProvider, useWallet } from './mocks/lazorKitMock';
import WalletConnect from './components/WalletConnect';
import TransactionForm from './components/TransactionForm';

function AppContent() {
  const { isConnected, wallet } = useWallet();
  const [isTransactionMode, setIsTransactionMode] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setIsTransactionMode(false);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen">
      {/* === HEADER === */}
      <header className="bg-gray-800/80 backdrop-blur sticky top-0 z-50 border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💜</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  PassPay
                </h1>
                <p className="text-purple-300 text-sm">Gasless USDC • Biometric Auth</p>
              </div>
            </div>

            {isConnected && wallet && (
              <div className="bg-gray-700 p-3 rounded-2xl text-xs flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">✅</span>
                </div>
                <code className="font-mono truncate max-w-[180px] text-green-400">
                  {`${wallet.smartWallet?.slice(0,6)}...${wallet.smartWallet?.slice(-4)}`}
                </code>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* === LEFT: HERO / STATS === */}
          <div className="space-y-8 lg:max-w-lg">
            {!isConnected ? (
              <div className="bg-gray-800/50 p-12 rounded-3xl text-center">
                <div className="w-28 h-28 bg-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <span className="text-4xl">🔐</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Biometria Pura
                </h2>
                <p className="text-xl text-purple-200 leading-relaxed max-w-md mx-auto">
                  Autenticação nativa com digital ou FaceID. Sem seed phrases.
                  Transações USDC completamente gasless.
                </p>
              </div>
            ) : (
              <div className="bg-gray-800/50 p-10 rounded-3xl text-center">
                <div className="w-24 h-24 bg-green-500 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-3xl font-bold text-green-400 mb-6">
                  Carteira Ativa
                </h3>
                <div className="bg-gray-900 p-4 rounded-2xl max-w-md mx-auto font-mono text-sm break-all text-green-400">
                  {wallet?.smartWallet}
                  <div className="text-xs text-green-400/80 mt-2 font-medium">
                    🔐 WebAuthn • Devnet
                  </div>
                </div>
              </div>
            )}

            {/* === STATS CARDS === */}
            <div className="grid md:grid-cols-3 gap-6 pt-4">
              <div className="bg-gray-800/50 p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">0.00</div>
                <div className="text-sm text-purple-300">USDC</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                <div className="text-sm text-green-300">Txs</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">Devnet</div>
                <div className="text-sm text-blue-300">Network</div>
              </div>
            </div>
          </div>

          {/* === RIGHT: ACTION PANEL === */}
          <div>
            <div className="bg-gray-800/50 p-10 rounded-3xl sticky top-24">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-bold text-white">
                  {isConnected ? 'Envie USDC' : 'Comece Agora'}
                </h3>
                {isConnected && (
                  <button
                    onClick={() => setIsTransactionMode(!isTransactionMode)}
                    className="bg-gray-700 px-6 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-gray-600 flex items-center gap-2"
                  >
                    {isTransactionMode ? (
                      <>
                        <span>Fechar</span>
                        <span className="w-5 h-5 border rounded-full border-white/30 flex items-center justify-center">−</span>
                      </>
                    ) : (
                      <>
                        <span>Abrir</span>
                        <span className="w-5 h-5 border rounded-full border-white/30 flex items-center justify-center">+</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="min-h-[400px]">
                {!isConnected ? (
                  <WalletConnect onSuccess={() => setIsTransactionMode(false)} />
                ) : isTransactionMode ? (
                  <TransactionForm
                    senderAddress={wallet?.smartWallet || ''}
                    onSuccess={() => setIsTransactionMode(false)}
                  />
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                      <span className="text-4xl">✨</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">Tudo Pronto!</h4>
                    <p className="text-purple-300 mb-8 max-w-sm mx-auto leading-relaxed">Sua carteira está ativa e pronta para transações gasless USDC.</p>
                    <button
                      onClick={() => setIsTransactionMode(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-2xl w-full max-w-sm mx-auto hover:from-purple-700"
                    >
                      Abrir Formulário de Pagamento
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* === FOOTER === */}
      <footer className="bg-gray-800/50 border-t border-purple-500/20 mt-32">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-purple-300 text-sm mb-6">
            <p>LazorKit Bounty Demo • WebAuthn Real • Janeiro 2026</p>
            <a href="https://github.com/lazor-kit" className="bg-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-600 transition">GitHub</a>
          </div>
          <p className="text-xs text-purple-500/70">Superteam Earn Submission • Pré-audit Demo</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LazorkitProvider>
      <AppContent />
    </LazorkitProvider>
  );
}
