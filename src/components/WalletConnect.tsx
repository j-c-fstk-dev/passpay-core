import { useState } from 'react';
import { useWallet } from '../mocks/lazorKitMock';

interface WalletConnectProps {
  onSuccess?: () => void;
}

export default function WalletConnect({ onSuccess }: WalletConnectProps) {
  const { connect, disconnect, isConnected, isConnecting } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    try {
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
    }
  };

  if (isConnected) {
    return (
      <div className="glass-hover rounded-3xl p-10 text-center animate-bounce-glow">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-glow">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">PassPay Ativo</h2>
        <p className="text-green-100 text-lg mb-8">Autenticação biométrica confirmada</p>
        <button
          onClick={handleDisconnect}
          className="btn-secondary w-full"
        >
          Desconectar Carteira
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-3xl p-10 text-center">
        <div className="w-24 h-24 bg-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center">
          <span className="text-4xl">🔐</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          PassPay
        </h2>
        <p className="text-purple-100 text-lg leading-relaxed mb-8">
          Crie sua carteira com biometria nativa. Sem seed phrase. 100% gasless.
        </p>

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-2xl w-full max-w-md mx-auto hover:from-purple-700"
        >
          {isConnecting ? (
            <>
              <span className="inline-block animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"></span>
              Verificando biometria...
            </>
          ) : (
            <>
              <span className="mr-3">👆</span>
              Conectar com Digital/FaceID
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 p-6 rounded-2xl border border-red-500">
          <div className="text-red-300 text-sm text-center">{error}</div>
        </div>
      )}

      <div className="bg-gray-800/50 p-6 rounded-2xl">
        <p className="font-semibold text-purple-200 text-sm mb-3 flex items-center justify-center">
          <span className="w-5 h-5 bg-purple-500 rounded-lg flex items-center justify-center mr-2 text-xs">ℹ️</span>
          Próximo passo
        </p>
        <ul className="text-purple-100 text-sm space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
            Confirmação biométrica (digital/PIN/FaceID)
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
            Smart wallet criada automaticamente
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
            Pronto para USDC gasless
          </li>
        </ul>
      </div>
    </div>
  );
}