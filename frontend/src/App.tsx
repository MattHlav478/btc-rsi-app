import { useEffect, useState } from "react";
import RSICard from "./components/RSICard";

export type RSIMetrics = {
  symbol: string;
  timeframe: string;
  value: number;
  timestamp: string;
};

function App() {
  const [metrics, setMetrics] = useState<RSIMetrics | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("http://localhost:8000/api/rsi");
        if (!response.ok) {
          throw new Error("Failed to fetch RSI metrics");
        }
        const data = (await response.json()) as RSIMetrics;
        setMetrics(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>BTC RSI Dashboard</h1>
      <p>Monitor the latest Relative Strength Index for Bitcoin.</p>
      <RSICard metrics={metrics} />
    </main>
  );
}

export default App;
