# Web3 Real-Time Gas Price Tracker

A **real-time, multi-chain gas fee tracker** built with **Next.js**, **Ethers.js**, **Uniswap V3 Logs**, and **Zustand**, supporting Ethereum, Polygon, and Arbitrum. Includes a **live gas widget**, **candlestick chart visualization**, and a **transaction cost simulator**.

---

## Features

* **Live Gas Fee Tracking:** Real-time updates from Ethereum, Polygon, and Arbitrum using WebSocket providers.
* **USD Price Streaming:** ETH/USD price fetched from Uniswap V3 swap logs.
* **Gas Fee Charts:** Lightweight candlestick charts displaying historical gas fee trends.
* **Transaction Cost Simulation:** Simulate transaction costs using live or fallback static data.
* **Dark Mode Support**
* **Live vs Simulation Mode Toggle**

---

## Tech Stack

* **Next.js** (App & UI)
* **Ethers.js** (WebSocket, Smart Contract Interaction)
* **Zustand** (State Management)
* **Tailwind CSS** (Styling)
* **Lightweight-Charts** (Candlestick Charts)
* **Uniswap V3 Logs** (On-chain USD Pricing)

---

## Setup & Installation

1. **Clone the Repository:**

```bash
git clone https://github.com/PraveenGupta11001/Web3-frontend-project.git
cd Web3-frontend-project
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Configure Environment Variables:**

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_ETHEREUM_WS_URL=wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID
NEXT_PUBLIC_POLYGON_WS_URL=wss://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_ARBITRUM_WS_URL=wss://arb-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_UNISWAP_V3_POOL_ADDRESS=0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
```

4. **Run the Development Server:**

```bash
npm run dev
```

---

## Project Structure

* `components/` — UI Components (Charts, Widgets, Forms)
* `lib/` — Gas stream, USD price streaming, calculation logic
* `store/` — Zustand global state store
* `pages/` — Next.js pages
* `styles/` — Global CSS

---

## Notes

* If live USD price stream fails, simulation mode uses a fallback ETH price (default: \$3000).
* Arbitrum does not use priority fees; handled as zero.

---

## License

This project is open-source and free to use under the MIT License.
