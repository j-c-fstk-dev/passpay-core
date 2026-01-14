interface TransactionPreviewProps {
  recipient: string;
  amount: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TransactionPreview({
  recipient,
  amount,
  loading,
  onConfirm,
  onCancel,
}: TransactionPreviewProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Confirm Payment</h2>

      {/* Preview details */}
      <div className="bg-slate-900 rounded-lg p-4 mb-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Recipient</span>
          <span className="text-white font-mono text-sm break-all text-right">
            {recipient}
          </span>
        </div>
        <div className="border-t border-slate-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Amount</span>
            <span className="text-white font-bold text-lg">
              {amount} USDC
            </span>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Gas Fee</span>
            <span className="text-green-400 font-semibold">FREE 🎉</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Paymaster sponsors all transaction fees
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 mb-4">
        <p className="text-purple-200 text-sm">
          ✔ Payment is gasless thanks to LazorKit Paymaster. Click confirm to sign with your biometric.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin">⏳</span>
              Confirming...
            </>
          ) : (
            '✓ Confirm & Sign'
          )}
        </button>
      </div>
    </div>
  );
}