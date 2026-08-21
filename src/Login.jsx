 import { useState } from "react";

import {
  LockKeyhole,
  Mail,
  Building2,
  ArrowRight,
  ShieldCheck,
  Users,
  CreditCard,
  Layers3,
  CheckCircle2,
} from "lucide-react";

import api from "./api";
import "./Login.css";

function Login({ onLogin }) {
  const [tenantId, setTenantId] = useState("2");
  const [email, setEmail] = useState("owner@test.com");
  const [password, setPassword] = useState("Owner@12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/api/v1/auth/login",
        null,
        {
          params: {
            tenantId: Number(tenantId),
            email: email.trim(),
            password,
          },
        }
      );

      const token = response.data.accessToken;

      if (!token) {
        throw new Error(
          "Access token was not returned by the server."
        );
      }

      localStorage.setItem("accessToken", token);
      localStorage.setItem("tenantId", tenantId);
      localStorage.setItem("email", email.trim());

      onLogin(token);
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError(
          "Authentication failed. Check your credentials."
        );
      } else if (err.response?.status === 400) {
        setError("Invalid email or password.");
      } else if (!err.response) {
        setError(
          "Cannot connect to backend. Make sure Spring Boot is running."
        );
      } else {
        setError(
          `Login failed (${err.response.status}). Please try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          LEFT SIDE — PRODUCT OVERVIEW
      ===================================================== */}

      <section className="login-visual">

        <div className="visual-grid" />
        <div className="visual-glow visual-glow-one" />
        <div className="visual-glow visual-glow-two" />

        {/* BRAND */}

        <div className="login-brand">

          <div className="brand-logo">
            <span>☁</span>
          </div>

          <div>
            <strong>
              Cloud<span>Core</span>
            </strong>

            <small>
              B2B SAAS PLATFORM
            </small>
          </div>

        </div>

        {/* HERO */}

        <div className="visual-content">

          <div className="visual-label">
            <span />
            MULTI-TENANT INFRASTRUCTURE
          </div>

          <h1>
            Everything your
            <br />
            <span>workspace needs.</span>
          </h1>

          <p>
            Manage organizations, users, subscriptions
            and secure workspace access from a single
            scalable SaaS platform.
          </p>

          {/* =================================================
              PLATFORM OVERVIEW
          ================================================= */}

          <div className="architecture project-overview">

            <div className="architecture-heading">
              PLATFORM OVERVIEW
            </div>

            <div className="project-overview-grid">

              {/* MULTI TENANT */}

              <div className="overview-item">

                <div className="overview-icon purple">
                  <Building2 size={17} />
                </div>

                <div className="overview-copy">
                  <strong>
                    Multi-Tenant
                  </strong>

                  <span>
                    Isolated workspaces
                  </span>
                </div>

              </div>

              {/* API */}

              <div className="overview-item">

                <div className="overview-icon blue">
                  <Layers3 size={17} />
                </div>

                <div className="overview-copy">
                  <strong>
                    Spring Boot API
                  </strong>

                  <span>
                    Scalable backend services
                  </span>
                </div>

              </div>

              {/* JWT */}

              <div className="overview-item">

                <div className="overview-icon green">
                  <ShieldCheck size={17} />
                </div>

                <div className="overview-copy">
                  <strong>
                    JWT Security
                  </strong>

                  <span>
                    Token-based authentication
                  </span>
                </div>

              </div>

              {/* RBAC */}

              <div className="overview-item">

                <div className="overview-icon violet">
                  <Users size={17} />
                </div>

                <div className="overview-copy">
                  <strong>
                    RBAC
                  </strong>

                  <span>
                    Role-based access control
                  </span>
                </div>

              </div>

              {/* SUBSCRIPTIONS */}

              <div className="overview-item">

                <div className="overview-icon cyan">
                  <CreditCard size={17} />
                </div>

                <div className="overview-copy">
                  <strong>
                    Subscriptions
                  </strong>

                  <span>
                    Plans & usage management
                  </span>
                </div>

              </div>

              {/* DATABASE */}

              <div className="overview-item">

                <div className="overview-icon orange">
                  <Layers3 size={17} />
                </div>

                <div className="overview-copy">
                  <strong>
                    PostgreSQL
                  </strong>

                  <span>
                    Persistent data storage
                  </span>
                </div>

              </div>

            </div>

            {/* TECH STACK */}

            <div className="project-stack">

              <span>REST API</span>

              <i />

              <span>JWT</span>

              <i />

              <span>RBAC</span>

              <i />

              <span>PostgreSQL</span>

            </div>

          </div>

          {/* TRUST */}

          <div className="visual-trust">

            <div>
              <CheckCircle2 size={14} />
              JWT Authentication
            </div>

            <div>
              <CheckCircle2 size={14} />
              Tenant Isolation
            </div>

            <div>
              <CheckCircle2 size={14} />
              Role-based Access
            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="visual-footer">
          CloudCore · Secure SaaS Infrastructure
        </div>

      </section>

      {/* =====================================================
          RIGHT SIDE — LOGIN
      ===================================================== */}

      <section className="login-area">

        <div className="login-shell">

          {/* LOGIN HEADER */}

          <div className="login-header">

            <span className="login-overline">
              WELCOME BACK
            </span>

            <h2>
              Sign in to
              <br />
              your workspace.
            </h2>

            <p>
              Enter your workspace credentials
              to continue securely.
            </p>

          </div>

          {/* LOGIN FORM */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* TENANT ID */}

            <div className="field">

              <label htmlFor="tenantId">
                Tenant ID
              </label>

              <div className="field-control">

                <Building2 size={17} />

                <input
                  id="tenantId"
                  type="number"
                  value={tenantId}
                  onChange={(e) =>
                    setTenantId(e.target.value)
                  }
                  placeholder="Enter tenant ID"
                  required
                />

                <span className="field-state">
                  WORKSPACE
                </span>

              </div>

            </div>

            {/* EMAIL */}

            <div className="field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="field-control">

                <Mail size={17} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@company.com"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="field">

              <div className="password-heading">

                <label htmlFor="password">
                  Password
                </label>

                <span>
                  Protected
                </span>

              </div>

              <div className="field-control">

                <LockKeyhole size={17} />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  required
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="login-error">

                <ShieldCheck size={15} />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  Continue to workspace
                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </form>

          {/* SECURITY CARD */}

          <div className="login-security">

            <div className="security-check">
              <ShieldCheck size={17} />
            </div>

            <div className="security-copy">

              <strong>
                Protected authentication
              </strong>

              <span>
                Your credentials are securely verified
                before workspace access.
              </span>

            </div>

            <div className="security-badge">
              <i />
              SECURE
            </div>

          </div>

          {/* FOOTER */}

          <div className="login-bottom">

            <span>
              CloudCore SaaS Platform
            </span>

            <i />

            <span>
              Multi-tenant infrastructure
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;