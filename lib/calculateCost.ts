import { SimulationInput } from './types';
import { GasState } from './types';
import { useGasStore } from '../store/useGasStore';

export function calculateTransactionCost(
  input: SimulationInput,
  chains: GasState['chains'],
  usdPrice: number
): number {
  const mode = useGasStore.getState().mode;

  const { amount, chain } = input;
  const data = chains[chain];
  const gasLimit = 21000;
  const totalFeeGwei = data.baseFee + data.priorityFee;
  const totalFeeEth = (totalFeeGwei * gasLimit) / 1e9;
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
