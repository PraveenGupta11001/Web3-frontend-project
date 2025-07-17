import { useEffect } from 'react';
import GasWidget from '../components/GasWidget';
import SimulationForm from '../components/SimulationForm';
import CandlestickChart from '../components/CandlestickChart';
import { startGasStream } from '../lib/gasStream';
import { startPriceStream } from '../lib/uniswapPrice';

export default function Home() {
  useEffect(() => {
    let cleanupGas: () => void;
    let cleanupPrice: () => void;

    async function initializeStreams() {
      cleanupGas = await startGasStream();
      cleanupPrice = await startPriceStream();
    }

    initializeStreams().catch((error) => {
      console.error('Error initializing streams:', error);
    });

    return () => {
      if (cleanupGas) cleanupGas();
      if (cleanupPrice) cleanupPrice();
    };
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Real-Time Gas Price Tracker</h1>
      <GasWidget />
      <SimulationForm />
      <div className="grid grid-cols-1 md:grid-cols-3 gap 4">
        <CandlestickChart chain="ethereum" />
        <CandlestickChart chain="polygon" />
        <CandlestickChart chain="arbitrum" />
      </div>
    </div>
  );
}