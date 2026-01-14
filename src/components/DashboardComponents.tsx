// src/components/BalanceCard.tsx
interface BalanceCardProps {
  balance: string;
  address: string;
  network?: string;
}

export const BalanceCard = ({ balance, address, network = 'Devnet' }: BalanceCardProps) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // Idealmente adicionar um toast aqui
    alert('Endereço copiado!');
  };

  return (
    <div className="card-hover bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-2 border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="badge-info">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          {network}
        </span>
        <button 
          onClick={copyAddress}
          className="text-sm text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-2"
        >
          <span className="font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-lg">📋</span>
        </button>
      </div>

      {/* Balance */}
      <div className="text-center mb-8">
        <p className="text-purple-300 text-sm mb-2">Saldo Total</p>
        <h2 className="text-6xl font-bold gradient-text mb-3">
          ${balance}
        </h2>
        <p className="text-purple-400 text-lg">USDC</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-purple-500/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">⚡</p>
          <p className="text-xs text-purple-300 mt-1">Gasless</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-cyan-400">🔐</p>
          <p className="text-xs text-purple-300 mt-1">Biométrico</p>
        </div>
      </div>
    </div>
  );
};

// src/components/QuickActions.tsx
interface QuickActionsProps {
  onSend: () => void;
  onReceive: () => void;
  onBuy?: () => void;
}

export const QuickActions = ({ onSend, onReceive, onBuy }: QuickActionsProps) => {
  const actions = [
    { icon: '📤', label: 'Enviar', onClick: onSend, color: 'from-purple-600 to-indigo-600' },
    { icon: '📥', label: 'Receber', onClick: onReceive, color: 'from-cyan-600 to-blue-600' },
    { icon: '💳', label: 'Comprar', onClick: onBuy, color: 'from-amber-600 to-orange-600', disabled: !onBuy },
  ];

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              card-hover text-center py-6 
              ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              transition-transform duration-300
            `}
          >
            <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
              <span className="text-3xl">{action.icon}</span>
            </div>
            <p className="text-white font-semibold">{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// src/components/TransactionList.tsx
interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  token: string;
  timestamp: number;
  status: 'confirmed' | 'pending';
  hash: string;
  to?: string;
  from?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-3xl">📊</span>
        </div>
        <p className="text-purple-300">Nenhuma transação ainda</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-white mb-6">Transações Recentes</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div 
            key={tx.id}
            className="glass-hover p-4 rounded-xl cursor-pointer transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${tx.type === 'send' 
                    ? 'bg-red-500/20 border-2 border-red-500/30' 
                    : 'bg-green-500/20 border-2 border-green-500/30'
                  }
                `}>
                  <span className={`text-2xl ${
                    tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {tx.type === 'send' ? '📤' : '📥'}
                  </span>
                </div>
                
                <div>
                  <p className="text-white font-semibold">
                    {tx.type === 'send' ? 'Enviado' : 'Recebido'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(tx.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="text-right">
                <p className={`text-xl font-bold ${
                  tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {tx.type === 'send' ? '-' : '+'}${tx.amount}
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs text-purple-400">{tx.token}</span>
                  <span className="badge-success text-xs py-1 px-2">
                    ⚡ Gasless
                  </span>
                </div>
              </div>
            </div>

            {/* Hash (expandable) */}
            <details className="mt-3 text-xs text-gray-400">
              <summary className="cursor-pointer hover:text-purple-400 transition-colors">
                Ver detalhes
              </summary>
              <div className="mt-2 p-3 bg-gray-900 rounded-lg font-mono break-all">
                <p><strong>Hash:</strong> {tx.hash}</p>
                {tx.to && <p><strong>Para:</strong> {tx.to}</p>}
                {tx.from && <p><strong>De:</strong> {tx.from}</p>}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};