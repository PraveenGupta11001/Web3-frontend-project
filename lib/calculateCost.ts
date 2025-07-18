import { useGasStore } from '../store/useGasStore';
import { SimulationInput } from './types';

export function calculateTransactionCost(input: SimulationInput): number {
  const { chains, usdPrice } = useGasStore.getState();
  const { amount, chain } = input;
  const data = chains[chain];
  const gasLimit = 21000; // Standard gas limit for a simple ETH transfer
  const totalFeeGwei = data.baseFee + data.priorityFee;
  const totalFeeEth = (totalFeeGwei * gasLimit) / 1e9; // Convert Gwei to ETH
  return totalFeeEth * usdPrice * amount; // Cost in USD for the amount
}