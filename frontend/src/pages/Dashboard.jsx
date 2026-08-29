import {
  MessageSquare,
  FileText,
  Video,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  async function loadDashboardData() {
    try {
      const [
        documentsResponse,
        conversationsResponse,
        analyticsResponse,
      ] = await Promise.all([
        api.get("/api/documents"),
        api.get("/api/conversations"),
        api.get("/api/analytics"),
      ]);

      setDocuments(documentsResponse.data);
      setConversations(conversationsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );
    }
  }

  loadDashboardData();
}, []);

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} />
            AI-POWERED WORKSPACE
          </p>

          <h1>
            Welcome to <span>ProbeAI</span>
          </h1>

          <p className="hero-subtitle">
            Your intelligent assistant for conversations,
            documents, and video insights.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          icon={MessageSquare}
          value={analytics?.conversations ?? "—"}
          label="Chats"
          description="Conversations"
        />

        <StatCard
          icon={FileText}
          value={analytics?.documents ?? "—"}
          label="Documents"
          description="Processed"
        />

        <StatCard
          icon={Video}
          value={analytics?.videos ?? 0}
          label="Videos"
          description="Summarized"
        />

        <StatCard
          icon={BarChart3}
          value={analytics?.messages ?? 0}
          label="Queries"
          description="AI requests"
        />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">GET STARTED</p>
              <h2>What would you like to do?</h2>
            </div>
          </div>

          <div className="quick-actions">
            <QuickAction
              icon={MessageSquare}
              title="Start a new chat"
              description="Ask ProbeAI anything"
              onClick={() => navigate("/chat")}
            />

            <QuickAction
              icon={FileText}
              title="Analyze a document"
              description="Upload and ask questions"
              onClick={() => navigate("/documents")}
            />

            <QuickAction
              icon={Video}
              title="Summarize a video"
              description="Extract key insights"
              onClick={() => navigate("/video")}
            />

            <QuickAction
              icon={BarChart3}
              title="View analytics"
              description="Track your activity"
              onClick={() => navigate("/analytics")}
            />
          </div>
        </div>

        <div className="dashboard-panel nebula-panel">
          <div className="nebula-glow" />

          <div className="panel-heading">
            <div>
              <p className="panel-kicker">PROBEAI</p>
              <h2>Built to understand.</h2>
            </div>
          </div>

          <p className="nebula-text">
            Chat with AI, explore your documents,
            and transform long videos into useful
            insights—all from one intelligent workspace.
          </p>

          <button
            className="primary-action"
            onClick={() => navigate("/chat")}
          >
            Start exploring
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  description,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={19} />
      </div>

      <div>
        <strong>{value}</strong>
        <p>{label}</p>
        <span>{description}</span>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      className="quick-action"
      onClick={onClick}
    >
      <div className="action-icon">
        <Icon size={19} />
      </div>

      <div className="action-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <ArrowRight size={17} />
    </button>
  );
}

export default Dashboard;