 import { useEffect, useMemo, useState } from "react";

import {
  Users,
  CreditCard,
  Building2,
  UserPlus,
  ShieldCheck,
  Crown,
  ArrowUpRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserRoundPlus,
  FileBarChart,
  RefreshCw,
} from "lucide-react";

import api from "./api";
import "./Dashboard.css";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [period, setPeriod] = useState("Last 6 Months");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 4;

  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setRefreshing(true);

      const token = localStorage.getItem("accessToken");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        usersResponse,
        subscriptionResponse,
        tenantResponse,
      ] = await Promise.all([
        api.get("/api/v1/users", {
          params: { tenantId },
          ...config,
        }),

        api.get(
          `/api/v1/subscriptions/tenant/${tenantId}`,
          config
        ),

        api.get(
          `/api/v1/tenants/${tenantId}`,
          config
        ),
      ]);

      const userData = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : [];

      setUsers(userData);

      setSubscription(
        parseSubscription(subscriptionResponse.data)
      );

      setTenant(tenantResponse.data);

      setCurrentPage(1);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const parseSubscription = (value) => {
    if (!value) {
      return null;
    }

    if (typeof value === "object") {
      return value;
    }

    const result = {};

    String(value)
      .split(",")
      .forEach((item) => {
        const [key, ...rest] = item.split("=");

        if (key) {
          result[key.trim()] = rest.join("=").trim();
        }
      });

    return result;
  };

  const activeUsers = users.filter(
    (user) => user.active
  ).length;

  const totalUsers = users.length;

  const maxUsers =
    subscription?.maxUsers === "null" ||
    subscription?.maxUsers === null ||
    subscription?.maxUsers === undefined
      ? "Unlimited"
      : Number(subscription.maxUsers);

  const capacityPercent =
    maxUsers === "Unlimited"
      ? 100
      : maxUsers > 0
      ? Math.min(
          (totalUsers / maxUsers) * 100,
          100
        )
      : 0;

  const plan =
    subscription?.plan ||
    subscription?.name ||
    "N/A";

  const totalPages = Math.max(
    Math.ceil(users.length / usersPerPage),
    1
  );

  const paginatedUsers = useMemo(() => {
    const start =
      (currentPage - 1) * usersPerPage;

    return users.slice(
      start,
      start + usersPerPage
    );
  }, [users, currentPage]);

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  const handleQuickAction = (action) => {
    window.dispatchEvent(
      new CustomEvent(
        "cloudcore:dashboard-action",
        {
          detail: action,
        }
      )
    );
  };

  const handleManageSubscription = () => {
    window.dispatchEvent(
      new CustomEvent(
        "cloudcore:navigate",
        {
          detail: "Subscriptions",
        }
      )
    );
  };

  const handleViewUsers = () => {
    window.dispatchEvent(
      new CustomEvent(
        "cloudcore:navigate",
        {
          detail: "Users",
        }
      )
    );
  };

  if (loading) {
    return (
      <section className="content">
        <div className="page-placeholder">
          <RefreshCw
            size={28}
            className="loading-icon"
          />

          <h2>
            Loading dashboard...
          </h2>

          <p>
            Fetching workspace information.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="content dashboard-page">

      <div className="workspace-banner">

        <div className="workspace-banner-content">

          <div className="workspace-building">
            <Building2 size={30} />
          </div>

          <div>

            <div className="workspace-title">

              <h2>
                {tenant?.name || "CloudCore"}
              </h2>

              <span className="active-badge">
                Active
              </span>

            </div>

            <p>
              Tenant ID:{" "}
              {tenant?.id || tenantId}

              <span>•</span>

              Tenant Isolation: Enabled

              <span>•</span>

              JWT: Enabled
            </p>

          </div>

        </div>

        <button
          type="button"
          className="banner-refresh"
          onClick={loadDashboard}
          title="Refresh dashboard"
          disabled={refreshing}
        >
          <ShieldCheck size={27} />
        </button>

      </div>

      <div className="stats-grid">

        <StatCard
          icon={<Users size={23} />}
          iconClass="purple"
          title="Total Users"
          value={totalUsers}
          change="+ 20%"
          changeText="from last month"
        />

        <StatCard
          icon={<CreditCard size={23} />}
          iconClass="green"
          title="Active Subscriptions"
          value="1"
          change={plan}
          changeText="Plan"
        />

        <StatCard
          icon={<Crown size={23} />}
          iconClass="orange"
          title="User Capacity"
          value={
            maxUsers === "Unlimited"
              ? `${totalUsers}`
              : `${totalUsers} / ${maxUsers}`
          }
          change={`${Math.round(
            capacityPercent
          )}% Utilized`}
          progress={
            maxUsers === "Unlimited"
              ? 100
              : capacityPercent
          }
        />

        <StatCard
          icon={<Building2 size={23} />}
          iconClass="blue"
          title="Tenants"
          value="1"
          change="Active Tenants"
        />

      </div>

      <div className="dashboard-middle">

        <div className="panel growth-panel">

          <div className="panel-header">

            <div>
              <h3>
                User Growth Overview
              </h3>

              <p>
                Workspace user activity
              </p>
            </div>

            <select
              className="period-button"
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
            >
              <option value="Last 3 Months">
                Last 3 Months
              </option>

              <option value="Last 6 Months">
                Last 6 Months
              </option>

              <option value="Last 12 Months">
                Last 12 Months
              </option>

              <option value="This Year">
                This Year
              </option>
            </select>

          </div>

          <div className="chart">

            <div className="chart-y">
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>

            <div className="chart-area">

              <div className="chart-line chart-line-one" />
              <div className="chart-line chart-line-two" />
              <div className="chart-line chart-line-three" />
              <div className="chart-line chart-line-four" />

              <svg
                className="growth-svg"
                viewBox="0 0 600 210"
                preserveAspectRatio="none"
              >

                <defs>

                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopOpacity="0.22"
                    />

                    <stop
                      offset="100%"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>

                <path
                  d="
                    M 0 180
                    C 45 160,
                      55 125,
                      105 135
                    C 145 145,
                      165 120,
                      205 130
                    C 250 140,
                      270 70,
                      315 75
                    C 360 80,
                      370 150,
                      415 150
                    C 460 150,
                      475 80,
                      525 80
                    C 560 80,
                      575 75,
                      600 20
                    L 600 210
                    L 0 210
                    Z
                  "
                  fill="url(#chartGradient)"
                />

                <path
                  d="
                    M 0 180
                    C 45 160,
                      55 125,
                      105 135
                    C 145 145,
                      165 120,
                      205 130
                    C 250 140,
                      270 70,
                      315 75
                    C 360 80,
                      370 150,
                      415 150
                    C 460 150,
                      475 80,
                      525 80
                    C 560 80,
                      575 75,
                      600 20
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <circle
                  cx="600"
                  cy="20"
                  r="6"
                  fill="currentColor"
                />

              </svg>

              <div className="chart-months">

                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>

              </div>

            </div>

          </div>

        </div>

        <div className="plan-usage-card">

          <div className="plan-usage-top">

            <h3>
              Plan & Usage
            </h3>

            <span>
              {plan} PLAN
            </span>

          </div>

          <div className="usage-content">

            <div className="usage-circle">

              <div>

                <strong>
                  {Math.round(
                    capacityPercent
                  )}%
                </strong>

                <small>
                  Utilized
                </small>

              </div>

            </div>

            <div className="usage-details">

              <strong>
                {totalUsers} /{" "}
                {maxUsers === "Unlimited"
                  ? "∞"
                  : maxUsers}
              </strong>

              <span>
                Users
              </span>

              <small>
                Up to{" "}
                {maxUsers === "Unlimited"
                  ? "unlimited"
                  : maxUsers}{" "}
                Users
              </small>

            </div>

          </div>

          <div className="plan-features">

            <span>
              ✓ All Core Features
            </span>

            <span>
              ✓ Priority Support
            </span>

            <span>
              ✓ Advanced Access
            </span>

            <span>
              ✓ API Access
            </span>

            <span>
              ✓ Secure Workspace
            </span>

          </div>

          <button
            type="button"
            className="manage-plan-button"
            onClick={handleManageSubscription}
          >
            Manage Subscription

            <ArrowUpRight size={17} />
          </button>

        </div>

        <div className="quick-actions">

          <div className="panel-header">

            <div>

              <h3>
                Quick Actions
              </h3>

              <p>
                Common workspace actions
              </p>

            </div>

          </div>

          <div className="quick-grid">

            <QuickAction
              icon={<UserRoundPlus size={21} />}
              title="Add User"
              text="Create new user"
              type="purple"
              onClick={() =>
                handleQuickAction("Add User")
              }
            />

            <QuickAction
              icon={<UserPlus size={21} />}
              title="Invite User"
              text="Send invitation"
              type="green"
              onClick={() =>
                handleQuickAction("Invite User")
              }
            />

            <QuickAction
              icon={<Building2 size={21} />}
              title="Add Tenant"
              text="Create new tenant"
              type="orange"
              onClick={() =>
                handleQuickAction("Add Tenant")
              }
            />

            <QuickAction
              icon={<FileBarChart size={21} />}
              title="View Reports"
              text="Analytics & Logs"
              type="blue"
              onClick={() =>
                handleQuickAction("View Reports")
              }
            />

          </div>

        </div>

      </div>

      <div className="dashboard-bottom">

        <div className="panel recent-users">

          <div className="panel-header">

            <div>

              <h3>
                Recent Users
              </h3>

              <p>
                Latest members in this workspace
              </p>

            </div>

            <button
              type="button"
              className="view-all-button"
              onClick={handleViewUsers}
            >
              View All Users
            </button>

          </div>

          <div className="users-table">

            <div className="table-head">

              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined On</span>
              <span>Actions</span>

            </div>

            {paginatedUsers.length === 0 && (
              <div className="empty-users">
                No users found.
              </div>
            )}

            {paginatedUsers.map(
              (user, index) => {

                const avatarIndex = index % 4;

                const displayName =
                  user.name ||
                  user.email?.split("@")[0] ||
                  "Workspace User";

                return (
                  <div
                    className="table-row"
                    key={
                      user.id ||
                      `${user.email}-${index}`
                    }
                  >

                    <div className="user-cell">

                      <div
                        className={`user-avatar avatar-${avatarIndex}`}
                      >
                        {displayName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {displayName}
                        </strong>

                        <small>
                          {user.email ||
                            "user@cloudcore.com"}
                        </small>

                      </div>

                    </div>

                    <span className="role-badge">
                      {user.role || "MEMBER"}
                    </span>

                    <span
                      className={
                        user.active
                          ? "status-badge"
                          : "status-badge inactive"
                      }
                    >
                      {user.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                    <span className="joined-date">
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </span>

                    <button
                      type="button"
                      className="more-button"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent(
                            "cloudcore:user-action",
                            {
                              detail: user,
                            }
                          )
                        )
                      }
                      title="User actions"
                    >
                      <MoreVertical size={17} />
                    </button>

                  </div>
                );
              }
            )}

          </div>

          <div className="table-footer">

            <span>
              Showing{" "}
              {users.length === 0
                ? 0
                : (currentPage - 1) *
                    usersPerPage +
                  1}
              {"–"}
              {Math.min(
                currentPage * usersPerPage,
                users.length
              )}{" "}
              of {users.length} users
            </span>

            <div className="pagination">

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1
              )
                .slice(0, 5)
                .map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage === page
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      handlePageChange(page)
                    }
                  >
                    {page}
                  </button>
                ))}

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage === totalPages
                }
              >
                <ChevronRight size={16} />
              </button>

            </div>

          </div>

        </div>

        <div className="panel activity-panel">

          <div className="panel-header">

            <div>

              <h3>
                Recent Activity
              </h3>

              <p>
                Latest workspace events
              </p>

            </div>

            <button
              type="button"
              className="view-all-button"
              onClick={loadDashboard}
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

          <ActivityRow
            icon={<UserPlus size={18} />}
            title="Workspace users loaded"
            description={`${totalUsers} users belong to this workspace`}
            time="Now"
            type="green"
          />

          <ActivityRow
            icon={<ShieldCheck size={18} />}
            title="Security check completed"
            description="JWT authentication verified"
            time="Now"
            type="blue"
          />

          <ActivityRow
            icon={<CreditCard size={18} />}
            title="Subscription verified"
            description={`Workspace is using ${plan} plan`}
            time="Now"
            type="purple"
          />

          <ActivityRow
            icon={<Building2 size={18} />}
            title="Tenant workspace active"
            description={`Tenant ID: ${
              tenant?.id || tenantId
            }`}
            time="Now"
            type="orange"
          />

          <div className="activity-wave" />

        </div>

      </div>

    </section>
  );
}

function StatCard({
  icon,
  iconClass,
  title,
  value,
  change,
  changeText,
  progress,
}) {
  return (
    <div className="stat-card">

      <div
        className={`stat-icon ${iconClass}`}
      >
        {icon}
      </div>

      <div className="stat-info">

        <h4>
          {title}
        </h4>

        <strong>
          {value}
        </strong>

        <p className={iconClass}>

          {change}

          {changeText && (
            <span>
              {" "}
              {changeText}
            </span>
          )}

        </p>

      </div>

      {progress !== undefined && (
        <div className="stat-progress">

          <span
            style={{
              width: `${progress}%`,
            }}
          />

        </div>
      )}

    </div>
  );
}

function QuickAction({
  icon,
  title,
  text,
  type,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`quick-action ${type}`}
      onClick={onClick}
    >

      <div className="quick-icon">
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>

      </div>

    </button>
  );
}

function ActivityRow({
  icon,
  title,
  description,
  time,
  type,
}) {
  return (
    <div className="activity-row">

      <div
        className={`activity-icon ${type}`}
      >
        {icon}
      </div>

      <div className="activity-text">

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>

      <time>
        {time}
      </time>

    </div>
  );
}

export default Dashboard;