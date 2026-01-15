// src/App.tsx - VERSÃO MOBILE CORRIGIDA
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
    console.log('🟡 useEffect - isConnected:', isConnected, 'step:', onboardingStep);
    
    if (isConnected && onboardingStep === 'success') {
      // Quando conectar E estiver na tela de sucesso, aguarda 1 segundo e vai pro dashboard
      console.log('✅ Conectado na tela de sucesso! Indo para dashboard em 1s...');
      const timer = setTimeout(() => {
        setOnboardingStep('dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isConnected && onboardingStep !== 'intro') {
      // Se desconectou, volta para intro
      console.log('❌ Desconectado! Voltando para intro...');
      setOnboardingStep('intro');
      setIsTransactionMode(false);
    }
  }, [isConnected, onboardingStep]);

  // Handler para iniciar o processo de criação da carteira
  const handleStartWalletCreation = async () => {
    console.log('🔵 Iniciando criação da carteira...');
    
    // Passo 1: Animação de biometria
    setOnboardingStep('auth');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Passo 2: Animação de criação (WebAuthn roda aqui)
    setOnboardingStep('creating');
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Passo 3: Animação de sucesso
    setOnboardingStep('success');
    // O useEffect acima vai detectar isConnected e ir pro dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Background animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-32 w-64 h-64 md:w-96 md:h-96 bg-purple-600 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 md:w-96 md:h-96 bg-cyan-600 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* === HEADER === */}
      <header className="sticky top-0 z-40 glass backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-xl md:text-2xl">💜</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold gradient-text">PassPay</h1>
                <p className="text-purple-300 text-[10px] md:text-xs">Gasless USDC</p>
              </div>
            </div>

            {isConnected && wallet && onboardingStep === 'dashboard' && (
              <div className="badge-success text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
                <code className="font-mono hidden md:inline">
                  {`${wallet.smartWallet?.slice(0, 4)}...${wallet.smartWallet?.slice(-4)}`}
                </code>
                <span className="md:hidden">✓</span>
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {onboardingStep === 'intro' && !isConnected && (
          /* === ONBOARDING VIEW === */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              {/* Hero Icon */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl md:rounded-3xl mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-glow animate-pulse-slow glass">
                <span className="text-5xl md:text-6xl">🔐</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 md:mb-6">
                Biometria Pura
              </h1>

              {/* Description */}
              <p className="text-base md:text-xl text-purple-200 leading-relaxed max-w-2xl mx-auto mb-6 md:mb-8 px-4">
                Autenticação nativa com digital ou FaceID. Sem seed phrases.
                Transações USDC completamente gasless.
              </p>

              {/* CTA Button */}
              <div className="px-4">
                <WalletConnect onSuccess={handleStartWalletCreation} />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-16 px-4">
              {[
                { icon: '🔒', title: 'Biometria', desc: 'Autenticação nativa' },
                { icon: '⚡', title: 'Gasless', desc: 'Zero taxas de gas' },
                { icon: '🎯', title: 'Seguro', desc: 'Sem seed phrases' },
              ].map((feature) => (
                <div key={feature.title} className="card-hover text-center p-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-600/20 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl">{feature.icon}</span>
                  </div>
                  <h4 className="text-white font-bold mb-1 text-sm md:text-base">{feature.title}</h4>
                  <p className="text-purple-300 text-xs md:text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {onboardingStep === 'dashboard' && isConnected && wallet && (
          /* === DASHBOARD VIEW === */
          <div className="space-y-6 md:space-y-8">
            {/* Balance & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <BalanceCard
                  balance={wallet.balance?.usdc || '0.00'}
                  address={wallet.smartWallet}
                  network="Devnet"
                />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="card text-center">
                  <p className="text-purple-300 text-xs md:text-sm mb-2">Transações</p>
                  <p className="text-3xl md:text-4xl font-bold gradient-text">
                    {wallet.transactions?.length || 0}
                  </p>
                </div>
                <div className="card text-center">
                  <p className="text-purple-300 text-xs md:text-sm mb-2">Status</p>
                  <div className="badge-success mx-auto text-xs">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Ativo
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions
              onSend={() => setIsTransactionMode(true)}
              onReceive={() => setShowReceive(true)}
            />

            {/* Transaction Form Modal */}
            {isTransactionMode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-300">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="card border-2 border-purple-500/30">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                      <h3 className="text-xl md:text-2xl font-bold text-white">Enviar USDC</h3>
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-300">
                <div className="w-full max-w-md">
                  <div className="card border-2 border-cyan-500/30">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white">Receber USDC</h3>
                      <button
                        onClick={() => setShowReceive(false)}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-2xl mx-auto mb-6 p-4">
                        <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                          <span className="text-5xl md:text-6xl">📱</span>
                        </div>
                      </div>
                      
                      <p className="text-purple-300 text-xs md:text-sm mb-4">Seu endereço:</p>
                      <div className="bg-gray-900 p-3 md:p-4 rounded-xl break-all font-mono text-xs md:text-sm text-cyan-400 mb-4">
                        {wallet.smartWallet}
                      </div>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(wallet.smartWallet || '');
                          alert('Endereço copiado!');
                        }}
                        className="btn-primary w-full text-sm md:text-base"
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
              <div className="card text-center py-12 md:py-16">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-600/20 rounded-2xl md:rounded-3xl mx-auto mb-4 md:mb-6 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl">📊</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  Nenhuma transação ainda
                </h3>
                <p className="text-purple-300 mb-6 md:mb-8 max-w-md mx-auto px-4 text-sm md:text-base">
                  Comece enviando ou recebendo USDC
                </p>
                <button
                  onClick={() => setIsTransactionMode(true)}
                  className="btn-primary mx-auto text-sm md:text-base"
                >
                  Fazer Primeira Transação
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* === FOOTER === */}
      <footer className="relative z-10 glass border-t border-purple-500/20 mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-xs md:text-sm text-purple-300 text-center">
              <p>LazorKit Bounty Demo</p>
              <p className="hidden md:inline">•</p>
              <p>WebAuthn Real</p>
              <p className="hidden md:inline">•</p>
              <p>Janeiro 2026</p>
            </div>
            <a
              href="https://github.com/lazor-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs md:text-sm px-4 py-2"
            >
              <span className="mr-2">🔗</span>
              GitHub
            </a>
          </div>
          <div className="text-center mt-4 md:mt-6">
            <p className="text-[10px] md:text-xs text-purple-500/70">
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