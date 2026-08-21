# CloudCore — Multi-Tenant B2B SaaS Platform

CloudCore is a modern multi-tenant B2B SaaS platform designed to manage organizations, users, subscriptions, tenants, and secure workspace access from a centralized dashboard.

## 🚀 Overview

CloudCore provides a centralized workspace for managing SaaS organizations and their users.

The platform is designed around a multi-tenant architecture where each organization operates inside an isolated workspace while sharing the same application infrastructure.

### Core Features

- 🔐 JWT-based authentication
- 🏢 Multi-tenant workspace architecture
- 👥 User management
- 💳 Subscription management
- 🏗️ Tenant management
- 🛡️ Role-based access architecture
- 📊 Organization dashboard
- 🔒 Tenant isolation
- 🎨 Modern React SaaS interface

## 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │       CloudCore         │
                    │     SaaS Platform       │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        ┌────────▼────────┐             ┌────────▼────────┐
        │ React Frontend  │             │ Spring Boot API │
        │                 │             │                 │
        │ JavaScript      │◄───────────►│ REST APIs       │
        │ JSX             │    HTTP     │ JWT Auth        │
        │ CSS             │             │ Business Logic  │
        └─────────────────┘             └────────┬────────┘
                                                 │
                                      ┌──────────▼──────────┐
                                      │     PostgreSQL      │
                                      │                     │
                                      │ Users               │
                                      │ Tenants             │
                                      │ Subscriptions       │
                                      │ Roles               │
                                      └─────────────────────┘
Multi-Tenant Architecture

                    CloudCore
                       │
             ┌─────────┴─────────┐
             │                   │
        Tenant 1              Tenant 2
        Workspace             Workspace
             │                   │
        ┌────┴────┐         ┌────┴────┐
        │ Users   │         │ Users   │
        │ Roles   │         │ Roles   │
        │ Plan    │         │ Plan    │
        └─────────┘         └─────────┘

🔐 Authentication

CloudCore uses JWT-based authentication.

Authentication Flow
User
 │
 │ Login credentials
 ▼
Spring Boot Authentication API
 │
 │ Validate tenant + credentials
 ▼
JWT Access Token
 │
 ▼
React Frontend
 │
 │ Authorization: Bearer <token>
 ▼
Protected API Endpoints

🖥️ Frontend

The frontend is built using React and Vite.

Technologies
React
JavaScript / JSX
Vite
CSS
Axios
Lucide React
Main Modules
Login
  │
  ▼
Dashboard
  │
  ├── Users
  ├── Subscriptions
  ├── Tenants
  ├── Roles
  ├── Audit Logs
  └── Settings
UI Features
Modern dark SaaS interface
CloudCore branded login screen
Responsive sidebar navigation
Dashboard workspace
User management interface
Subscription interface
Tenant interface
JWT authentication state
Workspace-focused navigation
🛠️ Technology Stack
Layer	Technology
Frontend	React
Language	JavaScript / JSX
Build Tool	Vite
Styling	CSS
HTTP Client	Axios
Icons	Lucide React
Backend	Spring Boot
Backend Language	Java
Authentication	JWT
Database	PostgreSQL
Migration	Flyway
Supporting Services	Redis / Kafka
Version Control	Git / GitHub
📁 Frontend Structure
saas-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── Dashboard.jsx
│   ├── Dashboard.css
│   ├── Login.jsx
│   ├── Login.css
│   ├── Users.jsx
│   ├── Users.css
│   ├── Tenant.jsx
│   ├── Tenant.css
│   ├── Subscription.jsx
│   ├── Subscription.css
│   ├── index.css
│   ├── main.jsx
│   └── api.js
│
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
▶️ Run Locally

Clone the repository:

git clone https://github.com/iamvishalgupta92-ui/cloudcore-saas-platform.git

Open the frontend directory:

cd saas-frontend

Install dependencies:

npm install

Start the development server:

npm run dev
🔗 Frontend → Backend

During local development, the React frontend communicates with the Spring Boot backend through REST APIs.

React Frontend
      │
      │ HTTP / REST
      ▼
Spring Boot API
      │
      ▼
PostgreSQL

The frontend API client attaches the JWT access token to authenticated requests.

🔒 Security

CloudCore uses:

JWT authentication
Bearer token authorization
Tenant-aware access
Protected API requests
Role-based access architecture
Tenant isolation

Sensitive credentials should be stored using environment variables and should never be committed to a public repository.

📌 Current Modules
Module	Status
Authentication	✅
Dashboard	✅
Users	✅
Tenants	✅
Subscriptions	✅
Multi-Tenant Architecture	✅
JWT Authentication	✅
Roles	🚧
Audit Logs	🚧
Profile	🚧
Settings	🚧
Integrations	🚧
🎯 Project Goals

CloudCore is built to demonstrate engineering concepts used in scalable B2B SaaS applications:

Tenant-aware architecture
Secure authentication
Organization management
Scalable REST APIs
Relational data management
Modern SaaS dashboard development
Frontend and backend separation
🔮 Future Improvements
Advanced RBAC
Audit log management
User invitations
Profile management
Workspace settings
Third-party integrations
Advanced analytics
Subscription billing
CI/CD
Production cloud deployment
Rate limiting
Centralized logging
👨‍💻 Author

Vishal Gupta

B.Sc. Computer Science

CloudCore — Multi-Tenant B2B SaaS Platform
