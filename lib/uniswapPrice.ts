import { ethers } from 'ethers';
import { useGasStore } from '../store/useGasStore';

const UNISWAP_V3_POOL_ADDRESS = process.env.NEXT_PUBLIC_UNISWAP_V3_POOL_ADDRESS!;
const SWAP_EVENT_TOPIC = ethers.keccak256(
  ethers.toUtf8Bytes('Swap(address,address,int256,int256,uint160,int128,int24)')
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
      alert('Uniswap Swap event detected');
      console.log('Uniswap Swap event log:', log);
      try {
        const abiCoder = new ethers.AbiCoder();
        const data = abiCoder.decode(
          ['address', 'address', 'int256', 'int256', 'uint160', 'int128', 'int24'],
          log.data
        );

        const sqrtPriceX96 = data[4]; // uint160 sqrtPriceX96
        const sqrtPriceX96BigInt = BigInt(sqrtPriceX96);

        const priceBigInt = (sqrtPriceX96BigInt * sqrtPriceX96BigInt * BigInt(1e18)) / (BigInt(2) ** BigInt(192));
        const price = Number(priceBigInt) / 1e18;

        updateUsdPrice(price);
        console.log('Decoded USD price:', price);
      } catch (error) {
        console.error('Error decoding Uniswap Swap event:', error, log.data);
        // Consider: don't set fallback silently. Log and monitor instead.
      }
    }
  );
  provider.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  return () => {
    provider.removeAllListeners();
    if (provider.websocket && provider.websocket.readyState === WebSocket.OPEN) {
      provider.websocket.close();
    }
  };
}
