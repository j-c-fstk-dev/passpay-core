# PassPay Core

A reference implementation of gasless stablecoin payments using passkeys and
account abstraction.

PassPay Core demonstrates how modern authentication (WebAuthn / passkeys)
combined with smart account abstraction can enable stablecoin payments with
a Web2-grade user experience — no seed phrases, no gas tokens, no wallet
extensions.

This repository is intended as a conceptual and technical foundation.
It is chain-agnostic and SDK-agnostic by design.

---

## Why PassPay Core

Crypto payments still suffer from:
- Complex wallet onboarding
- Seed phrase management
- Mandatory gas tokens
- High checkout friction

PassPay Core explores a different approach:

- Passkeys instead of seed phrases
- Gasless transactions via paymasters
- Stablecoin-first payments
- Minimal, familiar UX

The goal is not to build another wallet, but to define a better payment
experience layer for onchain applications.

---

## What This Repository Is

- A reference implementation
- A UX and architecture showcase
- A foundation for multiple deployments (Base, Ethereum, Solana, SaaS)

---

## What This Repository Is NOT

- A production wallet
- A full SaaS backend
- A chain-specific integration
- A finished commercial product

Those live in dedicated forks built on top of this core.

---

## Core Concepts

- Passkey-based authentication (WebAuthn)
- Smart accounts / account abstraction
- Gasless stablecoin transfers
- Checkout-style payment flow
- Chain-agnostic architecture

---

## Architecture Overview

- Frontend: React + TypeScript
- Authentication: WebAuthn / Passkeys
- Payments: Stablecoin transfers
- Gas abstraction: Paymaster pattern
- Deployment: Static frontend (Vercel)

Specific SDKs and chains are intentionally abstracted.

---

## Repository Structure
src/ components/        UI components hooks/             Wallet and auth hooks config/            Network and abstraction layers App.tsx            Application shell
Copiar código

---

## Related Implementations

This repository serves as the core for several purpose-driven forks:

- Base deployment — Base network participation and experimentation
- EVM reference — Ethereum and L2 grant applications
- Solana reference — Solana-focused UX and payment flows
- SaaS product — Commercial implementation

Each fork includes its own README explaining its scope and differences.

---

## Status

This project is under active development.
APIs and structure may evolve as standards and SDKs mature.

---

## License

MIT