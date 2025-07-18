import { create } from 'zustand';
import { GasState } from '../lib/types';

export const useGasStore = create<GasState>((set) => ({
  chains: {
    ethereum: { baseFee: 0, priorityFee: 0, history: [], timestamp: 0 },
    polygon: { baseFee: 0, priorityFee: 0, history: [], timestamp: 0 },
    arbitrum: { baseFee: 0, priorityFee: 0, history: [], timestamp: 0 },
  },
  usdPrice: 0,
  updateGasData: (chain, data) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: {
          ...state.chains[chain],
          ...data,
          history: [...state.chains[chain].history, data].slice(-100),
        },
      },
    })),
  updateUsdPrice: (price) => set({ usdPrice: price }),
  setMode: (mode) => set({ mode }),
  mode: 'live',
}));