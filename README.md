# OwnaFarm - Investor Frontend 

**OwnaFarm** is a gamified Real World Asset (RWA) contract farming protocol on the **Mantle Network**. This repository contains the **Investor Frontend**, a mobile-first PWA where users act as "gamers" to fund agriculture invoices wrapped as game assets ("Seeds").

##  Project Overview

OwnaFarm bridges the capital gap for farmers and the complexity barrier for retail investors.
- **For Investors (Gamers):** A "Hay Day" style simulation where buying seeds equals funding real-world invoices, and harvesting equals receiving yield.
- **The Solution:** Democratizing access to invoice financing through gamification, abstracting DeFi complexity.

**Current Project Scope:**
This frontend focuses specifically on the **Investor Interface**:
1.  **Marketplace:** Buying "Seeds" (RWA Contracts/Invoices).
2.  **My Garden:** Isometric/Grid view for managing assets (Watering, Leveling).
3.  **Portfolio:** Tracking GOLD (USDC) and Game Stats (XP, Levels).

---

##  Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (for game-like feel) & Lottie
- **Web3 Integration:** Wagmi / Viem / TanStack Query
- **Blockchain:** Mantle Network L2
- **Package Manager:** pnpm

---

## Game Mechanics (Frontend Implementation)

The frontend implements the following core loops:

1.  **Buy Seed (Funding):**
    - User converts GOLD (USDC) to purchase Crop NFTs (representative of Purchase Orders).
    - UI: 3D Card views of crops (e.g., "Indofood Chili").

2.  **Cultivate (Engagement):**
    - **Watering:** Users spend WATER points to interact with plants.
    - **Visuals:** Isometric garden view with growth progress bars.
    - **Rewards:** Gain XP to increase User Level (unlocking higher yield allocations).

3.  **Harvest (Settlement):**
    - When the real-world invoice matures, the crop becomes "Ready".
    - User interactions trigger the smart contract claim function.

---

## Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- pnpm (`npm install -g pnpm`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd investor-frontend
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

---

##  Architecture Context

This frontend is part of the larger OwnaFarm ecosystem:

| Component | Description | Tech |
| :--- | :--- | :--- |
| **Investor Frontend** | **(This Repo)** Gamified Interface for Investors | Next.js, Tailwind |
| **Farmer Frontend** | Interface for Farmers to register & submit POs | *Separate Project* |
| **Backend API** | Game logic, User Profile, XP/Water state | Golang (Gin/Fiber) |
| **Smart Contracts** | ERC-1155 (Crops), Vaults, Settlement | Solidity (Mantle Network) |

---

##  Features (MVP)

- **Mobile-First Design:** Optimized as a PWA.
- **Account Abstraction:** Social Login (Google) integration (planned).
- **Real-time Updates:** Optimistic UI updates for game interactions (Watering/XP).
- **RWA Transparency:** "CCTV" concept to view real farm status.

---

*Note: This project is currently under active development. Features and contracts are subject to change.*
