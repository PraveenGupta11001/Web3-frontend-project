import { ethers } from 'ethers';
import { useGasStore } from '../store/useGasStore';

const UNISWAP_V3_POOL_ADDRESS = process.env.NEXT_PUBLIC_UNISWAP_V3_POOL_ADDRESS!;
const SWAP_EVENT_TOPIC = ethers.keccak256(
  ethers.toUtf8Bytes('Swap(address,address,int256,int256,uint160,uint128,int24)')
);

export async function startPriceStream() {
  const provider = new ethers.WebSocketProvider(
    process.env.NEXT_PUBLIC_ETHEREUM_WS_URL!
  );

  const updateUsdPrice = useGasStore.getState().updateUsdPrice;

  provider.on(
    {
      address: UNISWAP_V3_POOL_ADDRESS,
      topics: [SWAP_EVENT_TOPIC],
    },
    (log: ethers.Log) => {
      try {
        const abiCoder = new ethers.AbiCoder();
        const data = abiCoder.decode(
          ['address', 'address', 'int256', 'int256', 'uint160', 'uint128', 'int24'],
          log.data
        );
        const sqrtPriceX96 = data[4];
        const price = (Number(sqrtPriceX96) ** 2 * 1e12) / 2 ** 192 / 1e6;
        updateUsdPrice(price);
      } catch (error) {
        console.error('Error decoding Uniswap Swap event:', error);
      }
    }
  );

  return () => {
    provider.removeAllListeners();
    if (provider.websocket) {
      provider.websocket.close();
    }
  };
}