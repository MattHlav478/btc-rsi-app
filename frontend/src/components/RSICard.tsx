import type { RSIMetrics } from "../App";

const cardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: "0.75rem",
  padding: "1.5rem",
  maxWidth: "20rem",
  backgroundColor: "#f8fafc",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.1)",
};

interface RSICardProps {
  metrics: RSIMetrics | null;
}

function formatValue(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "--";
  }

  return value.toFixed(2);
}

export default function RSICard({ metrics }: RSICardProps) {
  return (
    <section style={cardStyle}>
      <h2 style={{ marginBottom: "0.5rem" }}>Relative Strength Index</h2>
      <p style={{ margin: 0 }}>
        <strong>Value:</strong> {formatValue(metrics?.value)}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Symbol:</strong> {metrics?.symbol ?? "--"}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Timeframe:</strong> {metrics?.timeframe ?? "--"}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Timestamp:</strong> {metrics?.timestamp ?? "--"}
      </p>
    </section>
  );
}
