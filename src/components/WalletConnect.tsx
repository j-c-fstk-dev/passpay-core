import { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';

interface WalletConnectProps {
  onSuccess?: () => void;
}

export default function WalletConnect({ onSuccess }: WalletConnectProps) {
  const { connect, disconnect, isConnected, isConnecting } = useWallet();
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // handleConnect: Inicia fluxo de autenticação
  // 1. Abre portal LazorKit
  // 2. Usuário autentica com biometria
  // 3. Carteira smart-contract criada no chain
  // 4. useWallet() hook retorna credencial
  // ============================================

  const handleConnect = async () => {
    setError(null);
    try {
      // feeMode: 'paymaster' = transações gasless automáticas
      await connect({ feeMode: 'paymaster' });
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Falha ao conectar. Tente novamente.'
      );
      console.error('Connection error:', err);
    }
  };

  const handleDisconnect = async () => {
    setError(null);
    try {
      await disconnect();
    } catch (err) {
      setError('Falha ao desconectar.');
      console.error('Disconnect error:', err);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-8 shadow-xl">
        {/* Se não conectado: mostrar botão connect */}
        {!isConnected ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to PassPay
              </h2>
              <p className="text-purple-100">
                Create a wallet with your fingerprint. No seed phrase.
              </p>
            </div>

            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                isConnecting
                  ? 'bg-purple-700 cursor-not-allowed opacity-50'
                  : 'bg-white text-purple-700 hover:bg-purple-50 active:scale-95'
              }`}
            >
              {isConnecting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⏳</span>
                  Creating wallet...
                </span>
              ) : (
                '👆 Connect with Passkey'
              )}
            </button>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Info box */}
            <div className="mt-6 p-4 bg-purple-700/50 rounded-lg text-purple-100 text-sm space-y-2">
              <p className="font-semibold">What happens next?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Biometric verification (FaceID/TouchID)</li>
                <li>Smart contract wallet created on Solana</li>
                <li>Ready to send USDC gaslessly</li>
              </ul>
            </div>
          </>
        ) : (
          // Se conectado: mostrar endereço + botão disconnect
          <>
            <div className="text-center mb-6">
              <p className="text-purple-100 text-sm mb-2">Wallet Connected ✅</p>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full py-3 px-4 rounded-lg font-semibold text-purple-700 bg-white hover:bg-purple-50 transition"
            >
              Disconnect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}