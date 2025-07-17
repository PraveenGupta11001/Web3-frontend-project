import { useGasStore } from '../store/useGasStore';

export default function GasWidget() {
  const { chains, usdPrice } = useGasStore();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(chains).map(([chain, data]) => (
          <div key={chain} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl capitalize">{chain}</h2>
            <p>Base Fee: {data.baseFee.toFixed(2)} Gwei</p>
            <p>Priority Fee: {data.priorityFee.toFixed(2)} Gwei</p>
            <p>Total Gas Fee: {(data.baseFee + data.priorityFee).toFixed(2)} Gwei</p>
            <p>Gas Cost USD: {(((data.baseFee + data.priorityFee) * 21000) / 1e9 * usdPrice).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-2xl mb-4">Gas Price History (Last 5)</h2>
        {Object.entries(chains).map(([chain, data]) => (
          <div key={chain} className="mb-8">
            <h3 className="text-xl capitalize">{chain}</h3>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-2">Timestamp</th>
                  <th className="p-2">Base Fee (Gwei)</th>
                  <th className="p-2">Priority Fee (Gwei)</th>
                  <th className="p-2">Total (Gwei)</th>
                  <th className="p-2">Total (USD)</th>
                </tr>
              </thead>
              <tbody>
                {data.history.slice(-5).map((point, index) => (
                  <tr key={`${chain}-${point.timestamp}-${index}`} className="border-b">
                    <td className="p-2">{new Date(point.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2">{point.baseFee.toFixed(2)}</td>
                    <td className="p-2">{point.priorityFee.toFixed(2)}</td>
                    <td className="p-2">{(point.baseFee + point.priorityFee).toFixed(2)}</td>
                    <td className="p-2">{(((point.baseFee + point.priorityFee) * 21000) / 1e9 * usdPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}