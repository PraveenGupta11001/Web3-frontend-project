import { ethers } from 'ethers';
import { useGasStore } from '../store/useGasStore';

const ARBITRUM_GAS_PRICE_ORACLE = '0x000000000000000000000000000000000000006C';

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

  // Special handler for Arbitrum
  const handleArbitrumUpdate = async (blockNumber: number) => {
    try {
      const arbitrumProvider = providers.arbitrum;
      const oracleContract = new ethers.Contract(
        ARBITRUM_GAS_PRICE_ORACLE,
        ['function getPricesInWei() view returns (uint256, uint256, uint256)'],
        arbitrumProvider
      );
      
      const [gasPrice] = await oracleContract.getPricesInWei();
      const baseFee = Number(ethers.formatUnits(gasPrice, 'gwei'));
      
      updateGasStore('arbitrum', {
        timestamp: Date.now(),
        baseFee,
        priorityFee: 0, // Arbitrum doesn't have priority fees
      });
    } catch (error) {
      console.error('Error fetching Arbitrum gas data:', error);
    }
  };

  const handleEthereumPolygonUpdate = (chain: 'ethereum' | 'polygon', blockNumber: number) => {
    const provider = providers[chain];
    provider.getBlock(blockNumber).then((block) => {
      if (!block) {
        console.error(`Block ${blockNumber} not found for ${chain}`);
        return;
      }
      provider.getFeeData().then((feeData) => {
        const baseFee = Number(ethers.formatUnits(block.baseFeePerGas ?? 0, 'gwei'));
        const gasPrice = Number(ethers.formatUnits(feeData.gasPrice ?? 0, 'gwei'));
        const priorityFee = gasPrice - baseFee;

        updateGasStore(chain, {
          timestamp: Date.now(),
          baseFee,
          priorityFee,
        });
      }).catch((error) => console.error(`Error fetching fee data for ${chain}:`, error));
    }).catch((error) => console.error(`Error fetching block for ${chain}:`, error));
  };

  // Setup listeners
  providers.ethereum.on('block', debounce(
    (blockNumber: number) => handleEthereumPolygonUpdate('ethereum', blockNumber),
    1000
  ));

  providers.polygon.on('block', debounce(
    (blockNumber: number) => handleEthereumPolygonUpdate('polygon', blockNumber),
    1000
  ));

  providers.arbitrum.on('block', debounce(
    (blockNumber: number) => handleArbitrumUpdate(blockNumber),
    1000
  ));

  return () => {
    Object.values(providers).forEach((provider) => {
      provider.removeAllListeners();
      provider.websocket?.close();
    });
  };
}