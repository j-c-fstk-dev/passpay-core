// src/App.tsx - VERSÃO CORRIGIDA
import { useEffect, useState } from 'react';
import { LazorkitProvider, useWallet } from './mocks/lazorKitMock';
import { BiometricAnimation, CreatingWalletAnimation, SuccessAnimation } from './components/BiometricAnimation';
import { BalanceCard, QuickActions, TransactionList } from './components/DashboardComponents';
import WalletConnect from './components/WalletConnect';
import TransactionForm from './components/TransactionForm';

function AppContent() {
  const { isConnected, wallet } = useWallet();
  const [isTransactionMode, setIsTransactionMode] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'intro' | 'auth' | 'creating' | 'success' | 'dashboard'>('intro');

  // Sincroniza onboardingStep com isConnected
  useEffect(() => {
    console.log('🟡 App useEffect - isConnected:', isConnected, 'step:', onboardingStep);
    
    if (isConnected && onboardingStep !== 'dashboard') {
      // Se conectou mas ainda não está no dashboard, vai para lá
      console.log('✅ Conectado! Indo para dashboard...');
      setOnboardingStep('dashboard');
    } else if (!isConnected && onboardingStep !== 'intro') {
      // Se desconectou, volta para intro
      console.log('❌ Desconectado! Voltando para intro...');
      setOnboardingStep('intro');
      setIsTransactionMode(false);
    }
  }, [isConnected]); // Remove onboardingStep das dependências para evitar loop

  // Handler para iniciar o processo de criação da carteira
  const handleStartWalletCreation = async () => {
    console.log('🔵 handleStartWalletCreation: Iniciando...');
    
    // Passo 1: Animação de biometria
    setOnboardingStep('auth');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Passo 2: Animação de criação (WebAuthn roda aqui)
    setOnboardingStep('creating');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Passo 3: Animação de sucesso
    setOnboardingStep('success');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Passo 4: Vai para dashboard (o useEffect acima cuida disso quando isConnected = true)
    console.log('🔵 Animações concluídas, aguardando conexão...');
  };

  const handleSend = () => {
    setIsTransactionMode(true);
  };

  const handleReceive = () => {
    setShowReceive(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Background animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-600 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* === HEADER === */}
      <header className="sticky top-0 z-40 glass backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-2xl">💜</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">PassPay</h1>
                <p className="text-purple-300 text-xs">Gasless USDC • Biometric Auth</p>
              </div>
            </div>

            {isConnected && wallet && (
              <div className="badge-success">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <code className="font-mono text-xs">
                  {`${wallet.smartWallet?.slice(0, 4)}...${wallet.smartWallet?.slice(-4)}`}
                </code>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* === ANIMAÇÕES DE ONBOARDING (fullscreen overlays) === */}
      {onboardingStep === 'auth' && <BiometricAnimation />}
      {onboardingStep === 'creating' && <CreatingWalletAnimation />}
      {onboardingStep === 'success' && <SuccessAnimation />}

      {/* === MAIN CONTENT === */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {onboardingStep === 'intro' && !isConnected && (
          /* === ONBOARDING VIEW === */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-glow animate-pulse-slow glass">
                <span className="text-6xl">🔐</span>
              </div>
              <h1 className="text-6xl font-bold gradient-text mb-6">
                Biometria Pura
              </h1>
              <p className="text-xl text-purple-200 leading-relaxed max-w-2xl mx-auto mb-8">
                Autenticação nativa com digital ou FaceID. Sem seed phrases.
                Transações USDC completamente gasless.
              </p>

              {/* Botão de conectar */}
              <WalletConnect onSuccess={handleStartWalletCreation} />
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              {[
                { icon: '🔒', title: 'Biometria', desc: 'Autenticação nativa' },
                { icon: '⚡', title: 'Gasless', desc: 'Zero taxas de gas' },
                { icon: '🎯', title: 'Seguro', desc: 'Sem seed phrases' },
              ].map((feature) => (
                <div key={feature.title} className="card-hover text-center p-6">
                  <div className="w-16 h-16 bg-purple-600/20 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                  <p className="text-purple-300 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {onboardingStep === 'dashboard' && isConnected && wallet && (
          /* === DASHBOARD VIEW === */
          <div className="space-y-8">
            {/* Balance & Stats */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BalanceCard
                  balance={wallet.balance?.usdc || '0.00'}
                  address={wallet.smartWallet}
                  network="Devnet"
                />
              </div>

              <div className="space-y-4">
                <div className="card text-center">
                  <p className="text-purple-300 text-sm mb-2">Transações</p>
                  <p className="text-4xl font-bold gradient-text">
                    {wallet.transactions?.length || 0}
                  </p>
                </div>
                <div className="card text-center">
                  <p className="text-purple-300 text-sm mb-2">Status</p>
                  <div className="badge-success mx-auto">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Ativo
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions
              onSend={handleSend}
              onReceive={handleReceive}
            />

            {/* Transaction Form Modal */}
            {isTransactionMode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-6 animate-in fade-in duration-300">
                <div className="w-full max-w-2xl">
                  <div className="card border-2 border-purple-500/30">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-white">Enviar USDC</h3>
                      <button
                        onClick={() => setIsTransactionMode(false)}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                    <TransactionForm
                      senderAddress={wallet.smartWallet}
                      onSuccess={() => setIsTransactionMode(false)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Receive Modal */}
            {showReceive && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-6 animate-in fade-in duration-300">
                <div className="w-full max-w-md">
                  <div className="card border-2 border-cyan-500/30">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">Receber USDC</h3>
                      <button
                        onClick={() => setShowReceive(false)}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-6 p-4">
                        <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                          <span className="text-6xl">📱</span>
                        </div>
                      </div>
                      
                      <p className="text-purple-300 text-sm mb-4">Seu endereço:</p>
                      <div className="bg-gray-900 p-4 rounded-xl break-all font-mono text-sm text-cyan-400 mb-4">
                        {wallet.smartWallet}
                      </div>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(wallet.smartWallet || '');
                          alert('Endereço copiado!');
                        }}
                        className="btn-primary w-full"
                      >
                        📋 Copiar Endereço
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction History */}
            {wallet.transactions && wallet.transactions.length > 0 && (
              <TransactionList transactions={wallet.transactions} />
            )}

            {/* Empty State */}
            {(!wallet.transactions || wallet.transactions.length === 0) && (
              <div className="card text-center py-16">
                <div className="w-24 h-24 bg-purple-600/20 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-5xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Nenhuma transação ainda
                </h3>
                <p className="text-purple-300 mb-8 max-w-md mx-auto">
                  Comece enviando ou recebendo USDC
                </p>
                <button
                  onClick={() => setIsTransactionMode(true)}
                  className="btn-primary mx-auto"
                >
                  Fazer Primeira Transação
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* === FOOTER === */}
      <footer className="relative z-10 glass border-t border-purple-500/20 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8 text-sm text-purple-300">
              <p>LazorKit Bounty Demo</p>
              <p>WebAuthn Real</p>
              <p>Janeiro 2026</p>
            </div>
            <a
              href="https://github.com/lazor-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm"
            >
              <span className="mr-2">🔗</span>
              GitHub
            </a>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-purple-500/70">
              Superteam Earn Submission • Pré-audit Demo
            </p>
          </div>
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