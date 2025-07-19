import { useEffect, useState } from 'react';
import { useGasStore } from '../store/useGasStore';
import { calculateTransactionCost } from '../lib/calculateCost';
import { SimulationInput, GasState } from '../lib/types';

export default function SimulationForm() {
  const { setMode } = useGasStore();
  const chains = useGasStore((state) => state.chains);
  const usdPrice = useGasStore((state) => state.usdPrice);

  const [input, setInput] = useState<SimulationInput>({ amount: 0.5, chain: 'ethereum' });
  const [cost, setCost] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { chains, usdPrice } = useGasStore.getState();  // ← real-time snapshot
  
    const result = calculateTransactionCost(input, chains, usdPrice);
    setCost(result);
  };
  

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl mb-4">Transaction Cost Simulation</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Amount (ETH/MATIC)</label>
          <input
            type="number"
            value={input.amount}
            onChange={(e) => setInput({ ...input, amount: Number(e.target.value) })}
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:text-white"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Chain</label>
          <select
            value={input.chain}
            onChange={(e) => setInput({ ...input, chain: e.target.value as keyof GasState['chains'] })}
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="arbitrum">Arbitrum</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Calculate Cost
        </button>
        {cost !== null && (
          <p className="mt-4">Estimated Cost: ${cost.toFixed(2)} USD</p>
        )}
      </div>
    </div>
  );
}
