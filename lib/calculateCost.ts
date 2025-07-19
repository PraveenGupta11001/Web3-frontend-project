// lib/calculateCost.ts

import { SimulationInput } from './types';
import { GasState } from './types';
import { useGasStore } from '../store/useGasStore';

export function calculateTransactionCost(
  input: SimulationInput,
  chains: GasState['chains'],
  usdPrice: number
): number {
  const mode = useGasStore.getState().mode;  // ✅ Access store state safely outside components

  const { amount, chain } = input;
  const data = chains[chain];
  const gasLimit = 21000; // Standard gas limit for ETH transfer
  const totalFeeGwei = data.baseFee + data.priorityFee;
  const totalFeeEth = (totalFeeGwei * gasLimit) / 1e9;

  // Fallback price only in simulation mode
  const effectiveUsdPrice = (usdPrice === 0 && mode === 'simulation') ? 3000 : usdPrice;

  console.log({
    baseFee: data.baseFee,
    priorityFee: data.priorityFee,
    totalFeeEth,
    usdPrice: effectiveUsdPrice,
    amount,
    mode,
  });

  return totalFeeEth * effectiveUsdPrice * amount;
}
