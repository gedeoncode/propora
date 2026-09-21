# Propora

**Real Estate Management & CRM Platform**

Propora is a web-based platform designed to help real-estate agencies and property managers manage property listings, prospective customers, leads, agents, and property viewings from one place.

The platform combines a public property discovery experience with an internal management dashboard.

> **Project status:** In development. Features described in this document may be planned, partially implemented, or awaiting verification. Refer to the source code and current project progress before treating a feature as production-ready.

## 1. Project Goals

Propora aims to:

* Help agencies create, maintain, publish, and manage property listings.
* Give prospective customers a way to discover properties and submit enquiries.
* Help staff organize leads and customer relationships.
* Support agent assignments and property viewing appointments.
* Provide useful operational information based on real business records.
* Establish a secure, maintainable foundation that can grow with agency needs.

Propora will not use fabricated business records to make the application appear populated. Properties, leads, customers, appointments, and analytics displayed in the application should come from genuine user-entered records or authorized integrations.

Isolated test data may be used in a dedicated testing environment.

## 2. Core Features

### Public Website

* Property discovery and search.
* Property detail pages.
* Property images and relevant listing information.
* Enquiry submission.
* Viewing requests, where enabled.

### Management Dashboard

* Property creation, editing, publication, and archival.
* Property availability management.
* Lead tracking and assignment.
* Customer records.
* Agent management.
* Viewing scheduling.
* Follow-up activities.
* Notifications.
* Operational analytics.
* Audit history.

### Platform Administration

* Authentication and session management.
* Organization membership and role-based permissions.
* Organization-level data isolation.
* Application configuration and operational controls.

These features will be delivered incrementally. The presence of a feature in this list does not mean it is already implemented.

## 3. Technology Stack

* **Framework:** Next.js 16 with App Router
* **Language:** TypeScript
* **UI:** React, Tailwind CSS, shadcn/ui
* **Icons:** Lucide
* **Package manager:** pnpm
* **Database:** MongoDB
* **ODM:** Mongoose
* **Validation:** Zod

The application follows a modular monolith architecture with feature-oriented organization.

## 4. Project Structure

The intended source organization is:

```text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
│       └── v1/
├── features/
│   ├── auth/
│   ├── properties/
│   ├── leads/
│   ├── customers/
│   ├── agents/
│   ├── viewings/
│   ├── media/
│   ├── notifications/
│   ├── analytics/
│   ├── audit/
│   └── content/
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
├── lib/
├── hooks/
├── types/
└── config/
```

Keep business logic inside the relevant feature module. Add further folders only when they provide a clear organizational benefit.

## 5. Getting Started

### Prerequisites

Install:

* Node.js version compatible with the project's Next.js 16 dependencies.
* pnpm.
* Access to a MongoDB database for development.

Check the installed tools:

```bash
node --version
pnpm --version
```

### Installation

Clone the repository, navigate to its directory, and install dependencies:

```bash
pnpm install
```

### Environment Configuration

Create a local environment file:

```text
.env.local
```

Add the environment variables required by the current application configuration. At minimum, the application will need a MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

Other variables may be required as authentication, media storage, email, and deployment features are introduced.

Do not commit `.env.local` or expose credentials in client-side code.

### Run the Development Server

```bash
pnpm dev
```

Open the local address printed by Next.js in your terminal.

## 6. Development Checks

Run the checks supported by the current project configuration:

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

If a command is not configured in `package.json`, configure the appropriate script or use the project's existing equivalent.

Do not consider a feature complete solely because its page renders. Verify its validation, persistence, authorization, error handling, and relevant business rules.

## 7. Product Rules

* New properties begin as drafts.
* Draft and archived properties must not be exposed through public property endpoints.
* Publication status is separate from availability status.
* Archiving preserves historical records rather than silently deleting them.
* Protected operations require server-side authentication and authorization.
* Untrusted input must be validated.
* Lead status transitions must be validated in the business layer.
* Viewing scheduling must check for conflicts and handle concurrent requests safely.
* Organization data must be isolated according to the user's permissions.
* Analytics must be based on actual records.

## 8. Design System

Propora uses the **Navy & Sky Blue** visual identity.

Light theme:

* Background: `#F8FAFC`
* Foreground: `#0F172A`
* Card: `#FFFFFF`
* Secondary surface: `#F1F5F9`
* Muted text: `#64748B`
* Border: `#E2E8F0`
* Primary: `#2563EB`

Dark theme:

* Background: `#0B1220`
* Foreground: `#F8FAFC`
* Card: `#111C2E`
* Secondary surface: `#1E293B`
* Muted text: `#94A3B8`
* Border: `#263449`
* Primary: `#60A5FA`

Use semantic design tokens and shared UI components. Avoid scattering hardcoded color values throughout the application.

## 9. Data and Privacy

Propora is intended to support real business records.

* Do not seed production with fictional properties, customers, leads, or activity.
* Use isolated test fixtures only in development or testing environments.
* Collect only personal information necessary for the intended business purpose.
* Protect customer information through access controls and appropriate retention practices.
* Review applicable data-protection obligations before onboarding real agencies and customers.

## 10. Development Approach

Development is incremental:

1. Verify the application foundation.
2. Implement authentication and authorization.
3. Establish organizations and roles.
4. Complete property management.
5. Build public property discovery and enquiry capture.
6. Implement CRM, customers, and agents.
7. Add viewing scheduling and follow-ups.
8. Add notifications, analytics, and audit history.
9. Complete security, testing, and production preparation.
10. Introduce additional modules based on validated business needs.

## 11. Scope Boundaries

The initial product does not prioritize:

* Rent collection.
* Accounting and financial management.
* Mortgage processing.
* Legal document preparation.
* E-signatures.
* Full maintenance management.
* Advanced AI automation.
* WhatsApp automation.
* Subscription billing.
* Automated property valuation.

These may be considered later if actual customer requirements justify them.

## 12. Documentation

* `README.md` — project overview and development setup.
* `architecture.md` — application structure and architectural decisions.
* `api.md` — API conventions and endpoint documentation.
* `deployment.md` — deployment and operational guidance.

## 13. License

The project license has not yet been specified. Add the applicable license before distributing the software.
