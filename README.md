# 💜 LazorKit Gasless USDC Payment Demo

Uma demonstração prática de pagamento **sem seed phrase** e **sem SOL** usando o LazorKit SDK para Solana.

## 🎯 O que é isto?

Uma aplicação web simples que demonstra os dois conceitos centrais do LazorKit:

1. **Autenticação Biométrica (Passkey)**: Cria uma carteira usando FaceID/TouchID - sem seed phrase necessária
2. **Transações Gasless (Paymaster)**: Envia USDC sem precisar de SOL para pagar taxas de rede

## ⚡ Por que isto importa?

### O Problema
- ❌ Carteiras tradicionais usam seed phrase (risco de vazamento)
- ❌ Para transacionar em Solana, você **precisa** de SOL (mesmo que não esteja transacionando SOL)
- ❌ Onboarding cripto é confuso para usuários Web2

### A Solução LazorKit
- ✅ **Biometria nativa**: Autentique com seu telefone, não com seed phrase
- ✅ **Paymaster**: O aplicativo patrocina as taxas de rede (experiência Web2)
- ✅ **Developer-friendly**: SDK simples, sem complexidade de wallets tradicionais

## 🚀 Quick Start (3 passos)

### 1️⃣ Clonar e instalar
```bash
git clone <seu-repo>
cd lazorkit-bounty-demo
npm install
```

### 2️⃣ Configurar ambiente
```bash
cp .env.example .env
# .env já vem com valores Devnet padrão - não precisa mudar nada
```

### 3️⃣ Rodar localmente
```bash
npm run dev
```

Abra http://localhost:5173 no navegador.

## 📱 Como usar

### Fluxo de Pagamento

1. **Click "Connect with Passkey"**
   - Abre portal LazorKit
   - Você autentica com biometria (FaceID/TouchID)
   - Carteira é criada automaticamente no blockchain

2. **Endereço aparece**
   - Você vê seu endereço Solana criado
   - Nenhuma seed phrase necessária

3. **Preencha o formulário**
   - Recipient: endereço Solana do destinatário
   - Amount: quantos USDC enviar

4. **Click "Preview Payment"**
   - Vê os detalhes: destinatário, montante, taxa (0!)

5. **Click "Confirm & Sign"**
   - Biometria assina a transação
   - Paymaster patrocina gas
   - Transação enviada para blockchain
   - Sucesso! ✅

## 🏗️ Arquitetura

### Tech Stack
- **Frontend**: React + TypeScript + Vite (hot module reload)
- **Blockchain**: @solana/web3.js
- **Crypto**: @lazorkit/wallet (SDK principal)
- **Styling**: Tailwind CSS
- **Tokens**: @solana/spl-token (para USDC transfers)

### Estrutura de Pastas
```
src/
├── App.tsx                    # Provider + Layout principal
├── App.css
├── main.tsx
├── index.css
└── components/
    ├── WalletConnect.tsx      # Botão conexão + biometria
    ├── TransactionForm.tsx    # Form USDC
    └── TransactionPreview.tsx # Preview + Confirm
```

## 🔧 Configuração Detalhada

### .env.example
```env
# RPC Endpoint (Devnet Solana)
VITE_RPC_URL=https://api.devnet.solana.com

# LazorKit Portal (autenticação biométrica)
VITE_PORTAL_URL=https://portal.lazor.sh

# LazorKit Paymaster (gasless)
VITE_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

### USDC Devnet
Este projeto usa USDC no Devnet. Mint:
```
4zMMC9srt5Ri5X14Gr934z2uirKHXoTqmbMWj5gJsYx
```

## 📖 Como o LazorKit funciona

### 1. LazorKitProvider
O provider inicializa a conexão com o portal e paymaster. Todos os filhos podem usar `useWallet()`.

### 2. useWallet() Hook
```typescript
const { 
  connect,              // () => Promise → abre WebAuthn
  disconnect,           // () => Promise → desconecta
  isConnected,          // boolean
  wallet,               // { smartWallet: string }
  signAndSendTransaction // (tx) => Promise<signature>
} = useWallet();
```

### 3. connect({ feeMode: 'paymaster' })
Inicia o fluxo WebAuthn. O usuário autentica com biometria. A carteira smart-contract é criada no blockchain.

### 4. signAndSendTransaction(tx)
Automaticamente:
1. Pede biometria para assinar
2. Submete ao Paymaster
3. Paymaster patrocina as taxas
4. Retorna assinatura quando confirmada

## 🚢 Deploy

### Deploy no Vercel (Recomendado)

1. **Push para GitHub**
```bash
git add .
git commit -m "bounty: LazorKit gasless USDC demo"
git push origin main
```

2. **Conectar Vercel**
   - Acesse vercel.com
   - Clique "Import Project"
   - Selecione seu GitHub repo
   - Clique "Deploy"

3. **Seu link está vivo!**
https://lazorkit-demo-XXXX.vercel.app

```

### Deploy local (para testar antes)
```bash
npm run build
npm run preview
```

## 🐛 Troubleshooting

### "Biometria não funciona"
- Testando no navegador desktop? Passkeys funcionam melhor em mobile/Safari
- Verifique que seu dispositivo suporta WebAuthn
- Teste no Safari (iPhone) para melhor compatibilidade

### "Transação falha com erro de ATA"
- ATA (Associated Token Account) do recipient pode não existir
- Você pode criar ATA manualmente via `createAssociatedTokenAccountInstruction`

### "Paymaster retorna erro"
- Verifique que está no Devnet (não Mainnet)
- Devnet pode ter quotas de paymaster - tente novamente depois
- Consulte logs do browser (F12) para mais detalhes

## 🧪 Testando no Devnet

### Obter USDC Testnet
1. Acesse https://spl-token-faucet.com/?token-name=usdc-dev
2. Cole seu endereço Solana
3. Receba USDC fake para testar

### Verificar Transações
1. Use https://solscan.io/?cluster=devnet
2. Cole sua assinatura tx
3. Veja a transação confirmada on-chain

## 📚 Próximas Melhorias

- [ ] Suporte para mais tokens (USDT, etc)
- [ ] Histórico de transações
- [ ] QR code para copiar endereço
- [ ] Dark/Light mode toggle
- [ ] Mobile optimizations

## 📖 Referências

- **LazorKit Docs**: https://docs.lazorkit.com/
- **LazorKit GitHub**: https://github.com/lazor-kit
- **Solana Web3.js**: https://solana-labs.github.io/solana-web3.js/
- **SPL Token**: https://spl.solana.com/token
- **WebAuthn/Passkeys**: https://passkeys.dev/

## ⚠️ Avisos de Segurança

- **Pre-audit**: LazorKit está em fase pré-audit. Não use em produção.
- **Devnet apenas**: Este demo usa Devnet Solana (testnet). Não tem valor real.
- **Não é carteira completa**: É uma demo educacional, não uma carteira de produção.

## 💬 Suporte

Encontrou um bug? Abra uma issue no GitHub.

Tem dúvidas sobre LazorKit? Consulte a documentação oficial.

---

**Feito com 💜 para Superteam Bounty**

Built with LazorKit | Demo Devnet | January 2026
