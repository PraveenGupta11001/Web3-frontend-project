import { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { useGasStore } from '../store/useGasStore';
import { GasState } from '../lib/types';

export default function CandlestickChart({ chain }: { chain: keyof GasState['chains'] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { chains } = useGasStore();

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        timeScale: { timeVisible: true, secondsVisible: false },
      });

      const candlestickSeries = chartRef.current.addCandlestickSeries();
      const data = chains[chain].history.reduce((acc: any[], point, index, arr) => {
        if (index === 0) {
          const initialTime = point.timestamp / 1000;
          acc.push({
            time: initialTime,
            open: point.baseFee + point.priorityFee,
            high: point.baseFee + point.priorityFee,
            low: point.baseFee + point.priorityFee,
            close: point.baseFee + point.priorityFee,
          });
          return acc;
        }
        const prev = arr[index - 1];
        const total = point.baseFee + point.priorityFee;
        const prevTotal = prev.baseFee + prev.priorityFee;
        const adjustedTime = acc[acc.length - 1].time + 1;
        acc.push({
          time: adjustedTime,
          open: prevTotal,
          high: Math.max(total, prevTotal),
          low: Math.min(total, prevTotal),
          close: total,
        });
        return acc;
      }, []);

      candlestickSeries.setData(data);

      return () => {
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, [chain, chains]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl capitalize mb-4">{chain} Gas Price Chart</h2>
      <div ref={chartContainerRef} />
    </div>
  );
}