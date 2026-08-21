 import { useEffect, useState } from "react";

import {
  CreditCard,
  Check,
  Zap,
  Building2,
  Users,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import api from "./api";
import "./Subscription.css";

function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await api.get(
        `/api/v1/subscriptions/tenant/${tenantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = parseSubscription(response.data);
      setSubscription(data);
    } catch (err) {
      console.error("SUBSCRIPTION ERROR:", err);
      setError("Unable to load subscription.");
    } finally {
      setLoading(false);
    }
  };

  const parseSubscription = (value) => {
    const result = {};

    String(value)
      .split(",")
      .forEach((item) => {
        const [key, ...rest] = item.split("=");

        if (key) {
          result[key.trim()] = rest.join("=").trim();
        }
      });

    return {
      tenantId: result.tenantId,
      plan: result.plan,
      maxUsers:
        result.maxUsers === "null" ||
        result.maxUsers === "" ||
        result.maxUsers === undefined
          ? null
          : Number(result.maxUsers),
      status: result.status,
    };
  };

  const changePlan = async (plan) => {
    try {
      setChanging(plan);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("accessToken");

      await api.put(
        `/api/v1/subscriptions/tenant/${tenantId}/plan`,
        null,
        {
          params: {
            plan,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        `Subscription successfully changed to ${plan}.`
      );

      await loadSubscription();
    } catch (err) {
      console.error("CHANGE PLAN ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to change subscription plan.";

      setError(
        typeof message === "string"
          ? message
          : "Unable to change subscription plan."
      );
    } finally {
      setChanging("");
    }
  };

  if (loading) {
    return (
      <section className="content subscription-page">
        <div className="subscription-loading">
          <div className="loading-icon">
            <CreditCard size={28} />
          </div>

          <h2>Loading subscription...</h2>

          <p>
            Fetching your current workspace plan.
          </p>
        </div>
      </section>
    );
  }

  if (error && !subscription) {
    return (
      <section className="content subscription-page">
        <div className="subscription-loading">
          <div className="loading-icon error-icon">
            <CreditCard size={28} />
          </div>

          <h2>{error}</h2>

          <p>
            We couldn't retrieve your subscription details.
          </p>

          <button
            className="subscription-retry"
            onClick={loadSubscription}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      </section>
    );
  }

  const currentPlan = subscription?.plan || "FREE";

  return (
    <section className="content subscription-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="subscription-top">

        <div>
          <div className="subscription-eyebrow">
            <CreditCard size={15} />
            BILLING & SUBSCRIPTION
          </div>

          <h1>Subscription</h1>

          <p>
            Manage your workspace plan, user limits and
            subscription access.
          </p>
        </div>

        <div className="subscription-status-badge">
          <span className="status-dot" />
          {subscription?.status || "ACTIVE"}
        </div>

      </div>


      {/* =========================
          CURRENT PLAN HERO
      ========================= */}

      <div className="current-subscription-card">

        <div className="current-subscription-glow" />

        <div className="current-subscription-left">

          <div className="current-subscription-icon">
            <Zap size={27} />
          </div>

          <div>

            <span className="current-label">
              CURRENT PLAN
            </span>

            <div className="current-plan-title">
              <h2>{currentPlan}</h2>

              <span className="active-plan-badge">
                <span />
                Active
              </span>
            </div>

            <p>
              Your workspace is currently running on the{" "}
              <strong>{currentPlan}</strong> plan.
            </p>

          </div>

        </div>

        <div className="current-subscription-divider" />

        <div className="current-subscription-right">

          <span>USER LIMIT</span>

          <strong>
            {subscription?.maxUsers ?? "∞"}
          </strong>

          <small>
            {subscription?.maxUsers
              ? "maximum users"
              : "unlimited users"}
          </small>

        </div>

      </div>


      {/* =========================
          SUCCESS / ERROR
      ========================= */}

      {success && (
        <div className="subscription-message success">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="subscription-message error">
          <span>{error}</span>
        </div>
      )}


      {/* =========================
          PLANS HEADER
      ========================= */}

      <div className="plans-heading">

        <div>
          <div className="plans-heading-title">
            <Sparkles size={18} />
            <h2>Choose your plan</h2>
          </div>

          <p>
            Select the plan that best fits your organization.
          </p>
        </div>

        <div className="plans-security">
          <ShieldCheck size={17} />
          Secure billing
        </div>

      </div>


      {/* =========================
          PLAN CARDS
      ========================= */}

      <div className="plans-grid">

        <PlanCard
          name="FREE"
          price="$0"
          period="forever"
          description="For small teams getting started."
          users="5 users"
          icon={<Users size={23} />}
          features={[
            "Basic workspace",
            "User management",
            "JWT authentication",
            "Standard support",
          ]}
          current={currentPlan === "FREE"}
          changing={changing === "FREE"}
          onSelect={() => changePlan("FREE")}
        />

        <PlanCard
          name="PRO"
          price="$29"
          period="per month"
          description="For growing organizations."
          users="25 users"
          icon={<Zap size={23} />}
          features={[
            "Everything in FREE",
            "Up to 25 users",
            "Advanced workspace access",
            "Priority support",
            "Advanced analytics",
          ]}
          featured
          current={currentPlan === "PRO"}
          changing={changing === "PRO"}
          onSelect={() => changePlan("PRO")}
        />

        <PlanCard
          name="ENTERPRISE"
          price="Custom"
          period="for your team"
          description="For large-scale organizations."
          users="Unlimited"
          icon={<Building2 size={23} />}
          features={[
            "Everything in PRO",
            "Unlimited users",
            "Enterprise workspace",
            "Advanced security",
            "Dedicated support",
          ]}
          current={currentPlan === "ENTERPRISE"}
          changing={changing === "ENTERPRISE"}
          onSelect={() => changePlan("ENTERPRISE")}
        />

      </div>


      {/* =========================
          SECURITY FOOTER
      ========================= */}

      <div className="subscription-security-card">

        <div className="subscription-security-icon">
          <ShieldCheck size={21} />
        </div>

        <div className="subscription-security-content">

          <strong>
            Secure subscription management
          </strong>

          <p>
            Plan changes are authenticated through your
            JWT-protected workspace.
          </p>

        </div>

        <div className="security-status">
          <span />
          Protected
        </div>

      </div>

    </section>
  );
}


/* =========================================================
   PLAN CARD
   ========================================================= */

function PlanCard({
  name,
  price,
  period,
  description,
  users,
  icon,
  features,
  current,
  featured,
  changing,
  onSelect,
}) {
  return (
    <div
      className={`subscription-plan-card ${
        featured ? "featured" : ""
      } ${current ? "current" : ""}`}
    >

      {featured && (
        <div className="plan-popular">
          <Sparkles size={13} />
          MOST POPULAR
        </div>
      )}

      <div className="plan-card-top">

        <div className="plan-card-icon">
          {icon}
        </div>

        {current && (
          <span className="plan-current-badge">
            CURRENT
          </span>
        )}

      </div>

      <h3>{name}</h3>

      <p className="plan-card-description">
        {description}
      </p>

      <div className="plan-price">

        <strong>{price}</strong>

        <span>
          {period}
        </span>

      </div>

      <div className="plan-user-limit">
        <Users size={16} />
        <span>{users}</span>
      </div>

      <div className="plan-line" />

      <div className="plan-feature-list">

        {features.map((feature) => (
          <div
            className="plan-feature"
            key={feature}
          >
            <span className="feature-check">
              <Check size={13} />
            </span>

            <span>{feature}</span>
          </div>
        ))}

      </div>

      <button
        className={`plan-select-button ${
          current ? "current-plan-button" : ""
        }`}
        disabled={current || changing}
        onClick={onSelect}
      >

        {changing ? (
          <>
            <RefreshCw
              size={16}
              className="spin"
            />
            Updating...
          </>
        ) : current ? (
          <>
            <Check size={16} />
            Current Plan
          </>
        ) : (
          <>
            Switch to {name}
            <ArrowRight size={16} />
          </>
        )}

      </button>

    </div>
  );
}

export default Subscription;