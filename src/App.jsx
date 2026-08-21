 import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  LogOut,
  Menu,
  X,
  Crown,
  FileText,
  UserCircle,
  Settings,
  Plug,
  Construction,
  ArrowRight,
} from "lucide-react";

import Login from "./Login";
import Dashboard from "./Dashboard";
import UsersPage from "./Users";
import Subscription from "./Subscription";
import Tenant from "./Tenant";

import "./App.css";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("accessToken")
  );

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  useEffect(() => {
    const handleNavigation = (event) => {
      const page = event.detail;

      if (page) {
        setActivePage(page);
        setSidebarOpen(false);
      }
    };

    const handleDashboardAction = (event) => {
      const action = event.detail;

      if (
        action === "Add User" ||
        action === "Invite User"
      ) {
        setActivePage("Users");
      }

      if (action === "Add Tenant") {
        setActivePage("Tenants");
      }

      if (action === "View Reports") {
        setActivePage("Audit Logs");
      }

      setSidebarOpen(false);
    };

    window.addEventListener(
      "cloudcore:navigate",
      handleNavigation
    );

    window.addEventListener(
      "cloudcore:dashboard-action",
      handleDashboardAction
    );

    return () => {
      window.removeEventListener(
        "cloudcore:navigate",
        handleNavigation
      );

      window.removeEventListener(
        "cloudcore:dashboard-action",
        handleDashboardAction
      );
    };
  }, []);

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      icon: Users,
    },
    {
      name: "Roles",
      icon: Crown,
    },
    {
      name: "Subscriptions",
      icon: CreditCard,
    },
    {
      name: "Tenants",
      icon: Building2,
    },
    {
      name: "Audit Logs",
      icon: FileText,
    },
  ];

  const settingItems = [
    {
      name: "Profile",
      icon: UserCircle,
    },
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Integrations",
      icon: Plug,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("email");

    setToken(null);
    setActivePage("Dashboard");
  };

  const handleNavigation = (item) => {
    setActivePage(item.name);
    setSidebarOpen(false);
  };

  const renderNavigation = (items) => {
    return items.map((item) => {
      const Icon = item.icon;

      return (
        <button
          type="button"
          key={item.name}
          className={`nav-item ${
            activePage === item.name
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleNavigation(item)
          }
        >
          <Icon size={18} />

          <span>{item.name}</span>
        </button>
      );
    });
  };

  const renderComingSoon = () => {
    const pageData = {
      Roles: {
        icon: Crown,
        title: "Roles & Permissions",
        description:
          "Define roles and control access across your multi-tenant workspace.",
        features: [
          "Role-based access control",
          "Permission management",
          "Workspace-level permissions",
        ],
      },

      "Audit Logs": {
        icon: FileText,
        title: "Audit Logs",
        description:
          "Track important workspace activity and security events in one place.",
        features: [
          "Authentication activity",
          "User activity tracking",
          "Security event history",
        ],
      },

      Profile: {
        icon: UserCircle,
        title: "Your Profile",
        description:
          "Manage your CloudCore account information and workspace identity.",
        features: [
          "Account information",
          "Profile preferences",
          "Workspace identity",
        ],
      },

      Settings: {
        icon: Settings,
        title: "Workspace Settings",
        description:
          "Configure workspace preferences and platform behavior.",
        features: [
          "Workspace configuration",
          "Security preferences",
          "Platform settings",
        ],
      },

      Integrations: {
        icon: Plug,
        title: "Integrations",
        description:
          "Connect CloudCore with the tools and services your organization uses.",
        features: [
          "Third-party integrations",
          "API connections",
          "External services",
        ],
      },
    };

    const data = pageData[activePage];

    if (!data) {
      return null;
    }

    const Icon = data.icon;

    return (
      <section className="coming-soon-page">
        <div className="coming-soon-card">
          <div className="coming-soon-icon">
            <Icon size={28} />
          </div>

          <span className="coming-soon-label">
            CLOUDCORE MODULE
          </span>

          <h2>{data.title}</h2>

          <p>{data.description}</p>

          <div className="coming-soon-features">
            {data.features.map((feature) => (
              <div key={feature}>
                <span>✓</span>
                {feature}
              </div>
            ))}
          </div>

          <div className="coming-soon-footer">
            <div>
              <Construction size={15} />

              <span>
                This module is under development
              </span>
            </div>

            <span className="coming-soon-badge">
              COMING SOON
            </span>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        {/* BRAND */}

        <div className="brand">
          <div className="brand-mark">
            ☁
          </div>

          <div className="brand-copy">
            <strong>
              Cloud<span>Core</span>
            </strong>

            <small>
              SaaS Platform
            </small>
          </div>

          <button
            type="button"
            className="mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <p className="nav-title">
            MAIN
          </p>

          {renderNavigation(menuItems)}

          <p className="nav-title settings-title">
            SETTINGS
          </p>

          {renderNavigation(settingItems)}

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="side-plan">

            <div className="side-plan-title">
              <strong>
                CloudCore
              </strong>

              <span>
                PRO PLAN
              </span>
            </div>

            <p>
              Tenant ID:{" "}
              {localStorage.getItem(
                "tenantId"
              ) || "—"}
            </p>

            <div className="side-limit">
              <span>
                User Limit
              </span>

              <b>
                25
              </b>
            </div>

            <div className="side-progress">
              <span />
            </div>

            <p>
              12 / 25 Users
            </p>

            <button
              type="button"
              onClick={() =>
                setActivePage(
                  "Subscriptions"
                )
              }
            >
              <Crown size={14} />
              Upgrade Plan
            </button>

          </div>

          <button
            type="button"
            className="logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* MAIN */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <button
            type="button"
            className="menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={21} />
          </button>

          <div className="welcome-head">
            <h1>
              Welcome back, Owner! 👋
            </h1>

            <p>
              Here's what's happening
              with your organization
              today.
            </p>
          </div>

          <div className="top-actions">

            <div className="search">
              <span>
                ⌕
              </span>

              <input
                placeholder="Search anything..."
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    const value =
                      e.target.value.trim();

                    if (value) {
                      setActivePage(
                        "Users"
                      );
                    }
                  }
                }}
              />

              <kbd>
                Ctrl + K
              </kbd>
            </div>

            <button
              type="button"
              className="round-action"
              title="Theme"
            >
              ☼
            </button>

            <button
              type="button"
              className="round-action bell"
              title="Notifications"
            >
              ♧

              <b>
                4
              </b>
            </button>

            <div className="profile">

              <div className="profile-avatar">
                OC
              </div>

              <div>
                <strong>
                  {localStorage.getItem(
                    "email"
                  ) ||
                    "owner@test.com"}
                </strong>

                <small>
                  OWNER
                </small>
              </div>

              <span>
                ⌄
              </span>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        {activePage ===
          "Dashboard" && (
          <Dashboard />
        )}

        {activePage ===
          "Users" && (
          <UsersPage />
        )}

        {activePage ===
          "Subscriptions" && (
          <Subscription />
        )}

        {activePage ===
          "Tenants" && (
          <Tenant />
        )}

        {[
          "Roles",
          "Audit Logs",
          "Profile",
          "Settings",
          "Integrations",
        ].includes(activePage) &&
          renderComingSoon()}

      </main>

    </div>
  );
}

export default App;