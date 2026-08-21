 import { useEffect, useState } from "react";

import {
  Building2,
  ShieldCheck,
  Users,
  CreditCard,
  CalendarDays,
  Hash,
  Globe2,
  RefreshCw,
} from "lucide-react";

import api from "./api";
import "./Tenant.css";

function Tenant() {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    loadTenant();
  }, []);

  const loadTenant = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await api.get(
        `/api/v1/tenants/${tenantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTenant(response.data);
    } catch (err) {
      console.error("TENANT ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          "Unable to load tenant information."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="content tenant-page">
        <div className="page-placeholder">
          <div className="placeholder-icon">
            <Building2 size={28} />
          </div>

          <h2>Loading workspace...</h2>

          <p>
            Fetching your tenant information.
          </p>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="content tenant-page">
        <div className="page-placeholder">
          <div className="placeholder-icon">
            <ShieldCheck size={28} />
          </div>

          <h2>{error}</h2>

          <p>
            We couldn't retrieve your workspace details.
          </p>

          <button
            className="manage-button"
            onClick={loadTenant}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </section>
    );
  }

  /* =====================================================
     TENANT DATA
  ===================================================== */

  const workspaceName =
    tenant?.name || "CloudCore";

  const workspaceSlug =
    tenant?.slug || "—";

  const workspaceId =
    tenant?.id || tenantId || "—";

  const createdDate = tenant?.createdAt
    ? new Date(
        tenant.createdAt
      ).toLocaleDateString()
    : "-";

  const updatedDate = tenant?.updatedAt
    ? new Date(
        tenant.updatedAt
      ).toLocaleDateString()
    : "-";

  return (
    <section className="content tenant-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="tenant-page-header">

        <div>
          <p className="welcome-label">
            WORKSPACE SETTINGS
          </p>

          <h2>
            Tenant Workspace
          </h2>

          <p>
            Manage and view your organization workspace
            details.
          </p>
        </div>

        <div className="tenant-status">
          <span />
          Active Workspace
        </div>

      </div>


      {/* =================================================
          TENANT HERO
      ================================================= */}

      <div className="tenant-hero">

        <div className="tenant-hero-icon">
          <Building2 size={30} />
        </div>

        <div className="tenant-hero-info">

          <span className="tenant-label">
            ORGANIZATION
          </span>

          <h2>
            {workspaceName}
          </h2>

          <p>
            {workspaceSlug}
          </p>

        </div>

        <div className="tenant-id-card">

          <Hash size={17} />

          <div>
            <span>
              Tenant ID
            </span>

            <strong>
              {workspaceId}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          INFORMATION CARDS
      ================================================= */}

      <div className="tenant-info-grid">

        {/* Workspace */}

        <div className="tenant-info-card">

          <div className="tenant-card-icon">
            <Building2 size={20} />
          </div>

          <span>
            Workspace Name
          </span>

          <strong>
            {workspaceName}
          </strong>

        </div>


        {/* Slug */}

        <div className="tenant-info-card">

          <div className="tenant-card-icon">
            <Globe2 size={20} />
          </div>

          <span>
            Workspace Slug
          </span>

          <strong>
            {workspaceSlug}
          </strong>

        </div>


        {/* Plan */}

        <div className="tenant-info-card">

          <div className="tenant-card-icon">
            <CreditCard size={20} />
          </div>

          <span>
            Current Plan
          </span>

          <strong className="tenant-plan">
            PRO
          </strong>

        </div>


        {/* Users */}

        <div className="tenant-info-card">

          <div className="tenant-card-icon">
            <Users size={20} />
          </div>

          <span>
            User Capacity
          </span>

          <strong>
            12 / 25
          </strong>

        </div>

      </div>


      {/* =================================================
          DETAILS
      ================================================= */}

      <div className="tenant-details-grid">

        {/* =================================================
            WORKSPACE DETAILS
        ================================================= */}

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>
                Workspace Details
              </h3>

              <p>
                Basic information about your tenant.
              </p>
            </div>

          </div>


          {/* Tenant ID */}

          <div className="tenant-detail-row">

            <div>
              <Hash size={17} />

              <span>
                Tenant ID
              </span>
            </div>

            <strong>
              {workspaceId}
            </strong>

          </div>


          {/* Organization */}

          <div className="tenant-detail-row">

            <div>
              <Building2 size={17} />

              <span>
                Organization
              </span>
            </div>

            <strong>
              {workspaceName}
            </strong>

          </div>


          {/* Slug */}

          <div className="tenant-detail-row">

            <div>
              <Globe2 size={17} />

              <span>
                Slug
              </span>
            </div>

            <strong>
              {workspaceSlug}
            </strong>

          </div>


          {/* Created */}

          <div className="tenant-detail-row">

            <div>
              <CalendarDays size={17} />

              <span>
                Created
              </span>
            </div>

            <strong>
              {createdDate}
            </strong>

          </div>


          {/* Updated */}

          <div className="tenant-detail-row">

            <div>
              <CalendarDays size={17} />

              <span>
                Last Updated
              </span>
            </div>

            <strong>
              {updatedDate}
            </strong>

          </div>

        </div>


        {/* =================================================
            SECURITY
        ================================================= */}

        <div className="panel tenant-security-panel">

          <div className="panel-header">

            <div>
              <h3>
                Workspace Security
              </h3>

              <p>
                Authentication and access status.
              </p>
            </div>

          </div>


          {/* Security Status */}

          <div className="security-status">

            <div className="security-check">
              <ShieldCheck size={22} />
            </div>

            <div>

              <strong>
                Workspace Protected
              </strong>

              <span>
                  JWT authentication enabled
              </span>

            </div>

          </div>


          {/* Authentication */}

          <div className="security-item">

            <span>
              Authentication
            </span>

            <strong>
              JWT
            </strong>

          </div>


          {/* Role */}

          <div className="security-item">

            <span>
              Role
            </span>

            <strong>
              OWNER
            </strong>

          </div>


          {/* Tenant Isolation */}

          <div className="security-item">

            <span>
              Tenant Isolation
            </span>

            <strong className="security-good">
              Enabled
            </strong>

          </div>


          {/* Workspace Status */}

          <div className="security-item">

            <span>
              Workspace Status
            </span>

            <strong className="security-good">
              Active
            </strong>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Tenant;