import { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import TransactionPreview from './TransactionPreview';

interface TransactionFormProps {
  senderAddress: string;
  onSuccess?: () => void;
}

// USDC Mint Address (Devnet)
const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14Gr934z2uirKHXoTqmbMWj5gJsYx');

export default function TransactionForm({
  senderAddress,
  onSuccess,
}: TransactionFormProps) {
  const { signAndSendTransaction } = useWallet();
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
  });

  const [preview, setPreview] = useState<typeof formData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // ============================================
  // handlePreview: Valida form e mostra preview
  // ============================================

  const handlePreview = () => {
    setError(null);

    // Validação: recipient é válido Solana address
    try {
      new PublicKey(formData.recipient);
    } catch {
      setError('Invalid Solana address');
      return;
    }

    // Validação: amount é numérico
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      setError('Enter a valid amount');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setPreview(formData);
  };

  // ============================================
  // handleSubmit: Envia transação com Paymaster
  // 1. Cria USDC transfer instruction
  // 2. Chama signAndSendTransaction()
  // 3. Paymaster patrocina gas automaticamente
  // 4. Retorna assinatura tx
  // ============================================

  const handleSubmit = async () => {
    if (!preview) return;

    setLoading(true);
    setError(null);

    try {
      // Parse inputs
      const recipientPubkey = new PublicKey(preview.recipient);
      const amount = parseFloat(preview.amount);
      const decimals = 6; // USDC tem 6 decimais
      const lamports = Math.floor(amount * Math.pow(10, decimals));

      // ============================================
      // Construir USDC transfer instruction
      // Token Program instrução: transfer do ATA sender → ATA recipient
      // ============================================

      const senderPubkey = new PublicKey(senderAddress);

      // Obter ATA do sender
      const senderATA = await getAssociatedTokenAddress(
        USDC_MINT,
        senderPubkey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Obter ATA do recipient
      const recipientATA = await getAssociatedTokenAddress(
        USDC_MINT,
        recipientPubkey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Criar transfer instruction
      const transferInstruction = createTransferInstruction(
        senderATA,
        recipientATA,
        senderPubkey,
        lamports,
        [],
        TOKEN_PROGRAM_ID
      );

      // Empacotar em Transaction
      const transaction = new Transaction().add(transferInstruction);

      // ============================================
      // signAndSendTransaction() do LazorKit
      // Isto automaticamente:
      // 1. Assina com passkey (biometria)
      // 2. Submete ao Paymaster (sem SOL necessário!)
      // 3. Retorna assinatura se sucesso
      // ============================================

      const signature = await signAndSendTransaction(transaction);
      setTxSignature(signature);

      // Reset form
      setFormData({ recipient: '', amount: '' });
      setPreview(null);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Transaction failed. Try again.'
      );
      console.error('Transaction error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Se transação foi sucesso, mostrar modal
  if (txSignature) {
    return (
      <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4">✅ Success!</h3>
          <p className="text-gray-300 mb-4">Your payment was sent!</p>

          <div className="bg-slate-900 rounded-lg p-4 break-all font-mono text-xs text-green-400 mb-4">
            {txSignature}
          </div>

          <a
            href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition mb-4"
          >
            View on Solscan →
          </a>

          <button
            onClick={() => {
              setTxSignature(null);
              onSuccess?.();
            }}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  // Se preview ativo, mostrar TransactionPreview
  if (preview) {
    return (
      <TransactionPreview
        {...preview}
        loading={loading}
        onConfirm={handleSubmit}
        onCancel={() => setPreview(null)}
      />
    );
  }

  // Form principal
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Send USDC</h2>

      {/* Recipient address input */}
      <div className="mb-4">
        <label className="block text-purple-300 text-sm font-semibold mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          placeholder="Enter Solana address..."
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <label className="block text-purple-300 text-sm font-semibold mb-2">
          Amount (USDC)
        </label>
        <input
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Preview button */}
      <button
        onClick={handlePreview}
        disabled={!formData.recipient || !formData.amount}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition"
      >
        Preview Payment
      </button>
    </div>
  );
}