import { ethers } from 'ethers';
import { useGasStore } from '../store/useGasStore';
import { GasState } from './types';

export async function startGasStream() {
  const providers = {
    ethereum: new ethers.WebSocketProvider(
      process.env.NEXT_PUBLIC_ETHEREUM_WS_URL!
    ),
    polygon: new ethers.WebSocketProvider(
      process.env.NEXT_PUBLIC_POLYGON_WS_URL!
    ),
    arbitrum: new ethers.WebSocketProvider(
      process.env.NEXT_PUBLIC_ARBITRUM_WS_URL!
    ),
  };

  const updateGasStore = useGasStore.getState().updateGasData;
  const debounce = (fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  Object.entries(providers).forEach(([chain, provider]) => {
    const debouncedUpdate = debounce((blockNumber: number) => {
      provider.getBlock(blockNumber).then((block) => {
        if (!block) {
          console.error(`Block ${blockNumber} not found for ${chain}`);
          return;
        }
        provider.getFeeData().then((feeData) => {
          const baseFee = Number(ethers.formatUnits(block.baseFeePerGas ?? 0, 'gwei'));
          const gasPrice = Number(ethers.formatUnits(feeData.gasPrice ?? 0, 'gwei'));
          const priorityFee = gasPrice - baseFee;

          updateGasStore(chain as keyof GasState['chains'], {
            timestamp: Date.now(),
            baseFee,
            priorityFee,
          });
        }).catch((error) => console.error(`Error fetching fee data for ${chain}:`, error));
      }).catch((error) => console.error(`Error fetching block for ${chain}:`, error));
    }, 1000); // Debounce updates to 1 second

    provider.on('block', debouncedUpdate);
  });

  return () => {
    Object.values(providers).forEach((provider) => {
      provider.removeAllListeners();
      if (provider.websocket) {
        provider.websocket.close();
      }
    });
  };
}