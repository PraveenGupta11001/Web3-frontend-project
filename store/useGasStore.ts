import { create } from "zustand";
import { GasState, GasPoint } from "../lib/types";

export const useGasStore = create<GasState>((set) => ({
mode: "live",
chains: {
 ethereum: { baseFee: 0, priorityFee: 0, history: [] },
 polygon: { baseFee: 0, priorityFee: 0, history: [] },
 arbitrum: { baseFee: 0, priorityFee: 0, history: [] },
},
usdPrice: 0,
setMode: (mode) => set({ mode }),
updateGasData: (chain, data) =>
 set((state) => ({
   chains: {
     ...state.chains,
     [chain]: {
       ...state.chains[chain],
       baseFee: data.baseFee,
       priorityFee: data.priorityFee,
       history: [...state.chains[chain].history, data].slice(-100),
     },
   },
 })),
updateUsdPrice: (price) => set({ usdPrice: price }),
}));
