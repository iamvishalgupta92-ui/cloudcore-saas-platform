 import { useEffect, useMemo, useState } from "react";

import {
  Users as UsersIcon,
  UserPlus,
  Search,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Crown,
  UserRound,
} from "lucide-react";
import "./Users.css";
import api from "./api";

function UsersPage() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [page, setPage] = useState(1);

  const [showAddUser, setShowAddUser] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });

  const [creating, setCreating] =
    useState(false);

  const tenantId =
    localStorage.getItem("tenantId");

  const PAGE_SIZE = 6;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    roleFilter,
    statusFilter,
  ]);

  const loadUsers = async () => {
    try {
      setRefreshing(true);
      setError("");

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const response = await api.get(
        "/api/v1/users",
        {
          params: {
            tenantId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "USERS ERROR:",
        err
      );

      setError(
        "Unable to load workspace users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const name =
        user.name ||
        user.fullName ||
        "";

      const email =
        user.email || "";

      const role =
        user.role ||
        "MEMBER";

      const active =
        user.active !== false;

      const matchesSearch =
        !query ||
        name
          .toLowerCase()
          .includes(query) ||
        email
          .toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "ALL" ||
        role.toUpperCase() ===
          roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter ===
          "ACTIVE" &&
          active) ||
        (statusFilter ===
          "INACTIVE" &&
          !active);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const totalPages = Math.max(
    Math.ceil(
      filteredUsers.length /
        PAGE_SIZE
    ),
    1
  );

  const currentUsers =
    filteredUsers.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

  const activeCount =
    users.filter(
      (user) => user.active !== false
    ).length;

  const inactiveCount =
    users.length - activeCount;

  const ownerCount =
    users.filter(
      (user) =>
        String(
          user.role || ""
        ).toUpperCase() ===
        "OWNER"
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        String(
          user.role || ""
        ).toUpperCase() ===
        "ADMIN"
    ).length;

  const handleFormChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateUser =
    async (e) => {
      e.preventDefault();

      if (
        !form.email.trim() ||
        !form.password.trim()
      ) {
        return;
      }

      try {
        setCreating(true);
        setError("");

        const token =
          localStorage.getItem(
            "accessToken"
          );

        await api.post(
          "/api/v1/users",
          {
            name: form.name.trim(),
            email:
              form.email.trim(),
            password:
              form.password,
            role: form.role,
            tenantId:
              Number(tenantId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setForm({
          name: "",
          email: "",
          password: "",
          role: "MEMBER",
        });

        setShowAddUser(false);

        await loadUsers();
      } catch (err) {
        console.error(
          "CREATE USER ERROR:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Unable to create user."
        );
      } finally {
        setCreating(false);
      }
    };

  const getUserName = (user) => {
    return (
      user.name ||
      user.fullName ||
      user.email
        ?.split("@")[0] ||
      "Workspace User"
    );
  };

  const getInitials = (user) => {
    const name =
      getUserName(user);

    const parts =
      name
        .trim()
        .split(/\s+/);

    if (parts.length >= 2) {
      return (
        parts[0][0] +
        parts[1][0]
      ).toUpperCase();
    }

    return name
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleIcon = (role) => {
    const value =
      String(
        role || "MEMBER"
      ).toUpperCase();

    if (value === "OWNER") {
      return <Crown size={14} />;
    }

    if (value === "ADMIN") {
      return (
        <ShieldCheck
          size={14}
        />
      );
    }

    return (
      <UserRound size={14} />
    );
  };

  const getRoleClass = (role) => {
    const value =
      String(
        role || "MEMBER"
      ).toUpperCase();

    if (value === "OWNER") {
      return "owner";
    }

    if (value === "ADMIN") {
      return "admin";
    }

    return "member";
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
            Loading users...
          </h2>

          <p>
            Fetching workspace
            members.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="content users-page">

      {/* HEADER */}

      <div className="users-page-header">

        <div>
          <p className="welcome-label">
            WORKSPACE MANAGEMENT
          </p>

          <h2>
            Users
          </h2>

          <p>
            Manage members, roles and
            workspace access.
          </p>
        </div>

        <div className="users-header-actions">

          <button
            type="button"
            className="users-refresh"
            onClick={loadUsers}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="add-user-button"
            onClick={() =>
              setShowAddUser(true)
            }
          >
            <UserPlus
              size={17}
            />

            Add User
          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="users-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X size={15} />
          </button>
        </div>
      )}


      {/* STATS */}

      <div className="users-stats">

        <UserStat
          icon={
            <UsersIcon size={21} />
          }
          type="purple"
          label="Total Users"
          value={users.length}
          text="Workspace members"
        />

        <UserStat
          icon={
            <ShieldCheck
              size={21}
            />
          }
          type="green"
          label="Active Users"
          value={activeCount}
          text="Currently active"
        />

        <UserStat
          icon={
            <Crown size={21} />
          }
          type="orange"
          label="Owners"
          value={ownerCount}
          text="Workspace owners"
        />

        <UserStat
          icon={
            <UserRound
              size={21}
            />
          }
          type="blue"
          label="Admins"
          value={adminCount}
          text={`${inactiveCount} inactive`}
        />

      </div>


      {/* MAIN TABLE PANEL */}

      <div className="users-panel">

        <div className="users-panel-top">

          <div>
            <h3>
              Workspace Users
            </h3>

            <p>
              {filteredUsers.length}{" "}
              users match your
              current filters.
            </p>
          </div>

        </div>


        {/* FILTER BAR */}

        <div className="users-toolbar">

          <div className="users-search">

            <Search size={17} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search by name or email..."
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={15} />
              </button>
            )}

          </div>


          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
            className="users-filter"
          >
            <option value="ALL">
              All Roles
            </option>

            <option value="OWNER">
              Owner
            </option>

            <option value="ADMIN">
              Admin
            </option>

            <option value="MEMBER">
              Member
            </option>
          </select>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="users-filter"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

        </div>


        {/* TABLE */}

        <div className="users-table-wrapper">

          <div className="users-table-head">

            <span>
              USER
            </span>

            <span>
              ROLE
            </span>

            <span>
              STATUS
            </span>

            <span>
              JOINED
            </span>

            <span>
              ACTION
            </span>

          </div>


          {currentUsers.length ===
            0 && (
            <div className="users-empty">

              <div>
                <UsersIcon
                  size={27}
                />
              </div>

              <strong>
                No users found
              </strong>

              <p>
                Try changing your
                search or filters.
              </p>

            </div>
          )}


          {currentUsers.map(
            (user, index) => {

              const name =
                getUserName(user);

              const email =
                user.email ||
                "—";

              const role =
                String(
                  user.role ||
                    "MEMBER"
                ).toUpperCase();

              const active =
                user.active !==
                false;

              return (
                <div
                  className="users-table-row"
                  key={
                    user.id ||
                    `${email}-${index}`
                  }
                >

                  <div className="users-user-cell">

                    <div
                      className={`users-avatar avatar-${index % 5}`}
                    >
                      {getInitials(
                        user
                      )}
                    </div>

                    <div>

                      <strong>
                        {name}
                      </strong>

                      <span>
                        {email}
                      </span>

                    </div>

                  </div>


                  <div
                    className={`users-role ${getRoleClass(
                      role
                    )}`}
                  >
                    {getRoleIcon(
                      role
                    )}

                    {role}
                  </div>


                  <div
                    className={
                      active
                        ? "users-status active"
                        : "users-status inactive"
                    }
                  >
                    <span />

                    {active
                      ? "Active"
                      : "Inactive"}
                  </div>


                  <div className="users-date">

                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString(
                          undefined,
                          {
                            day: "2-digit",
                            month:
                              "short",
                            year:
                              "numeric",
                          }
                        )
                      : "—"}

                  </div>


                  <div className="users-action">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedUser(
                          user
                        )
                      }
                      title="View user"
                    >
                      <MoreVertical
                        size={17}
                      />
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>


        {/* FOOTER */}

        <div className="users-footer">

          <span>
            Showing{" "}
            {filteredUsers.length ===
            0
              ? 0
              : (page - 1) *
                  PAGE_SIZE +
                1}
            {"–"}
            {Math.min(
              page *
                PAGE_SIZE,
              filteredUsers.length
            )}{" "}
            of{" "}
            {filteredUsers.length}
          </span>


          <div className="users-pagination">

            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (value) =>
                    Math.max(
                      value - 1,
                      1
                    )
                )
              }
            >
              <ChevronLeft
                size={16}
              />
            </button>


            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, i) =>
                i + 1
            ).map(
              (pageNumber) => (
                <button
                  type="button"
                  key={
                    pageNumber
                  }
                  className={
                    page ===
                    pageNumber
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setPage(
                      pageNumber
                    )
                  }
                >
                  {pageNumber}
                </button>
              )
            )}


            <button
              type="button"
              disabled={
                page ===
                totalPages
              }
              onClick={() =>
                setPage(
                  (value) =>
                    Math.min(
                      value + 1,
                      totalPages
                    )
                )
              }
            >
              <ChevronRight
                size={16}
              />
            </button>

          </div>

        </div>

      </div>


      {/* ADD USER MODAL */}

      {showAddUser && (
        <div
          className="users-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setShowAddUser(false);
            }
          }}
        >

          <div className="users-modal">

            <div className="users-modal-header">

              <div>

                <div className="modal-icon">
                  <UserPlus
                    size={20}
                  />
                </div>

                <div>
                  <h3>
                    Add New User
                  </h3>

                  <p>
                    Create a member for
                    this workspace.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddUser(
                    false
                  )
                }
              >
                <X size={19} />
              </button>

            </div>


            <form
              onSubmit={
                handleCreateUser
              }
              className="users-form"
            >

              <label>
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={
                  handleFormChange
                }
                placeholder="John Doe"
              />


              <label>
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={
                  handleFormChange
                }
                placeholder="john@company.com"
                required
              />


              <label>
                Password
              </label>

              <input
                name="password"
                type="password"
                value={
                  form.password
                }
                onChange={
                  handleFormChange
                }
                placeholder="Create password"
                required
              />


              <label>
                Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={
                  handleFormChange
                }
              >
                <option value="MEMBER">
                  Member
                </option>

                <option value="ADMIN">
                  Admin
                </option>
              </select>


              <div className="users-form-actions">

                <button
                  type="button"
                  className="cancel-user"
                  onClick={() =>
                    setShowAddUser(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-user"
                  disabled={creating}
                >
                  {creating
                    ? "Creating..."
                    : "Create User"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* USER ACTION MODAL */}

      {selectedUser && (
        <div
          className="users-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setSelectedUser(
                null
              );
            }
          }}
        >

          <div className="user-detail-modal">

            <button
              type="button"
              className="user-detail-close"
              onClick={() =>
                setSelectedUser(
                  null
                )
              }
            >
              <X size={18} />
            </button>


            <div className="user-detail-avatar">
              {getInitials(
                selectedUser
              )}
            </div>

            <h3>
              {getUserName(
                selectedUser
              )}
            </h3>

            <p>
              {selectedUser.email ||
                "—"}
            </p>


            <div className="user-detail-grid">

              <div>
                <span>
                  Role
                </span>

                <strong>
                  {String(
                    selectedUser.role ||
                      "MEMBER"
                  ).toUpperCase()}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {selectedUser.active !==
                  false
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

              <div>
                <span>
                  Tenant
                </span>

                <strong>
                  {tenantId}
                </strong>
              </div>

              <div>
                <span>
                  User ID
                </span>

                <strong>
                  {selectedUser.id ||
                    "—"}
                </strong>
              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}


/* =========================================================
   USER STAT
========================================================= */

function UserStat({
  icon,
  type,
  label,
  value,
  text,
}) {
  return (
    <div className="users-stat-card">

      <div
        className={`users-stat-icon ${type}`}
      >
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {text}
        </small>

      </div>

    </div>
  );
}

export default UsersPage;