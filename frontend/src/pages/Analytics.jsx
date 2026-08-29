import { useEffect, useState } from "react";
import {
  MessageSquare,
  FileText,
  Send,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    try {
      setLoading(true);

      const response = await api.get(
        "/api/analytics"
      );

      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <p className="eyebrow">SYSTEM INSIGHTS</p>

          <h1>Analytics</h1>

          <p>
            Overview of your ProbeAI activity.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadAnalytics}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="analytics-loading">
          Loading analytics...
        </div>
      ) : (
        <div className="analytics-grid">

          <AnalyticsCard
            icon={MessageSquare}
            value={data?.conversations ?? 0}
            label="Conversations"
          />

          <AnalyticsCard
            icon={FileText}
            value={data?.documents ?? 0}
            label="Documents"
          />

          <AnalyticsCard
            icon={Send}
            value={data?.messages ?? 0}
            label="Messages"
          />

        </div>
      )}
    </div>
  );
}

function AnalyticsCard({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="analytics-card">
      <div className="analytics-icon">
        <Icon size={20} />
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default Analytics;