import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  Video,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";

import NebulaBackground from "./NebulaBackground";
import { logoutUser } from "../services/auth";
import ChatSidebar from "./ChatSidebar";

function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/chat",
      label: "Chat",
      icon: MessageSquare,
    },
    {
      path: "/documents",
      label: "Documents",
      icon: FileText,
    },
    {
      path: "/video",
      label: "Video",
      icon: Video,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="app-shell">
    <NebulaBackground />

      <aside className="app-sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>

          <span>ProbeAI</span> 
        </div>

        <nav className="main-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <div>
            <span className="status-dot" />
            <span>ProbeAI</span>
          </div>

          <div className="topbar-user">
            <div className="avatar">P</div>
          </div>
        </header>

        <div className="workspace">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;