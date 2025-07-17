import { useGasStore } from "../store/useGasStore";
import { SimulationInput } from "./types";

export function calculateTransactionCost(input: SimulationInput): number {
const { amount, chain } = input;
const { chains, usdPrice } = useGasStore.getState();
const chainData = chains[chain];

const totalGasFeeGwei = (chainData.baseFee + chainData.priorityFee) * 21000;
const totalGasFeeEth = totalGasFeeGwei / 1e9;
const gasCostUsd = totalGasFeeEth * usdPrice;
const amountUsd = amount * usdPrice;

return gasCostUsd + amountUsd;
}
