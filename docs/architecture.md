# Propora — Architecture

## 1. Overview

Propora is designed as a **modular monolith** built with Next.js 16, TypeScript, MongoDB, and Mongoose.

The application will contain a public property discovery website and an authenticated management dashboard. Both use the same application and business modules.

The architecture prioritizes:

* Clear separation of responsibilities.
* Feature-oriented organization.
* Server-side security.
* Validated business operations.
* Maintainability for a solo developer.
* A straightforward path to future enhancements without premature distributed-system complexity.

## 2. Architectural Style

### Modular Monolith

Propora will initially run as one application rather than a collection of independently deployed microservices.

Each business domain should own its relevant:

* Types.
* Validation schemas.
* Data access.
* Business logic.
* Feature-specific UI.

Modules may interact through well-defined service functions and shared types. Avoid importing another feature's internal implementation when a public service interface is sufficient.

Do not introduce separate services, queues, or infrastructure unless a real requirement justifies them.

## 3. Application Layers

### Presentation Layer

Responsible for rendering pages and handling user interaction.

Includes:

* Next.js App Router pages and layouts.
* Server Components by default.
* Client Components where browser interaction requires them.
* Shared UI components.
* Forms, tables, filters, dialogs, and feedback states.

Presentation components should not contain substantial business rules or directly manage database access.

### API Layer

Responsible for handling HTTP requests.

Responsibilities:

* Parse and validate request input.
* Authenticate requests where required.
* Enforce authorization through server-side checks.
* Call the appropriate feature service.
* Return consistent response structures.
* Translate expected application errors into appropriate HTTP responses.

API route handlers should remain relatively thin.

### Service Layer

Responsible for business operations and rules.

Examples:

* Creating and publishing properties.
* Updating property availability.
* Assigning leads.
* Validating lead status transitions.
* Scheduling viewings and checking conflicts.
* Managing customer relationships.

Services should enforce business rules regardless of whether they are called by an API route or another trusted server-side entry point.

### Repository Layer

Responsible for persistence and database queries.

Responsibilities:

* Querying MongoDB through Mongoose.
* Creating and updating records.
* Applying reusable query patterns.
* Keeping database-specific details out of presentation components.

Repositories should not become an alternative location for business workflows.

### Data Layer

MongoDB stores application records. Mongoose provides models, schema definitions, and database interaction.

Zod is used to validate untrusted input at application boundaries. Database schema validation and indexes provide additional safeguards but do not replace application-level validation.

## 4. Intended Source Structure

```text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   │   └── v1/
│   ├── layout.tsx
│   ├── globals.css
│   ├── error.tsx
│   ├── not-found.tsx
│   └── loading.tsx
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

The structure is an architectural guide. Create subdirectories as implementation needs become clear rather than adding empty abstractions in advance.

## 5. Feature Responsibilities

### Auth

* User authentication.
* Session lifecycle.
* Password and account security.
* Organization membership and permission integration.

### Properties

* Property records and specifications.
* Publication and availability workflows.
* Property search and filtering.
* Property management interfaces.

### Media

* Media upload and validation.
* Storage-provider integration.
* Media metadata and ordering.
* Authorized removal and replacement.

### Leads

* Lead creation and updates.
* Lead assignment.
* Status transitions.
* Follow-up information and activity.

### Customers

* Customer profiles.
* Customer contact details.
* Links to leads, interests, and viewings.
* Customer record access rules.

### Agents

* Agent profiles.
* Agent membership and status.
* Property and lead assignments.
* Agent-specific work views.

### Viewings

* Viewing requests.
* Confirmation, cancellation, and rescheduling.
* Scheduling conflict validation.
* Viewing history.

### Notifications

* In-app notifications.
* Notification read status and preferences.
* Event-driven notification creation.
* Future email delivery integration.

### Analytics

* Queries and calculations based on real records.
* Date-range filtering.
* Permission-aware operational summaries.

### Audit

* Recording important business changes.
* Actor, action, target, and timestamp information.
* Restricted access to audit history.

### Content

* Public website content that requires management.
* Reusable content structures where justified.

## 6. Request Flow

A typical authenticated property update follows this flow:

1. The user submits a request from the dashboard.
2. The API route validates the request body and parameters.
3. The server authenticates the user.
4. Authorization verifies that the user can update the target property within the appropriate organization.
5. The route calls the property service.
6. The service applies business rules.
7. The repository performs the database operation.
8. The route returns a consistent response.
9. The interface displays the updated state or an appropriate error.

Authorization must not depend solely on whether a button is visible in the UI.

## 7. Data Ownership and Organization Isolation

Business records should be associated with the organization that owns them.

Where applicable, records should include an organization identifier and relevant audit metadata.

For every protected query or mutation:

* Determine the authenticated user's organization context.
* Verify the user's membership and permissions.
* Scope record access to the authorized organization.
* Verify relationships between records before accepting assignments or links.
* Avoid trusting organization identifiers supplied by the client without authorization checks.

The exact schema should be finalized as authentication and organization membership are implemented.

## 8. Property Domain Rules

Property publication and availability are separate concepts.

Publication status:

* `draft`
* `published`
* `archived`

Availability status:

* `available`
* `under_offer`
* `rented`
* `sold`
* `withdrawn`

New properties begin as drafts.

Public property queries must return only records that satisfy the public visibility rules. Drafts and archived properties must not be exposed through public endpoints.

Archiving should preserve historical records.

Publishing should validate required property information and media before changing publication status.

## 9. Lead and Viewing Rules

### Leads

Lead status changes must be validated by the service layer.

Assignments should be checked against the relevant organization and permissions. Important changes should be recorded in the activity or audit history.

### Viewings

Viewing requests begin in a pending state.

Confirmation must be an explicit action.

Scheduling checks must detect overlapping appointments. For an existing interval and requested interval, overlap is determined by:

`existingStart < requestedEnd AND existingEnd > requestedStart`

The implementation must also address concurrent booking attempts, rather than relying solely on a preliminary conflict query.

Viewing history should be retained according to the application's data-retention rules.

## 10. API Conventions

The API is organized under `/api/v1`.

Successful responses use a consistent envelope:

```json
{
  "success": true,
  "data": {}
}
```

Paginated responses also provide pagination metadata.

Errors should use a consistent structure and suitable HTTP status codes. See `api.md` for the API contract.

## 11. Security Principles

* Authenticate protected requests on the server.
* Enforce authorization for every protected operation.
* Validate untrusted input.
* Keep secrets and privileged database access server-side.
* Avoid exposing private records through public endpoints.
* Apply rate limiting to sensitive and abuse-prone operations.
* Validate uploaded media.
* Avoid logging credentials, session secrets, or unnecessary personal information.
* Use secure session and password practices.
* Review data isolation and access controls before real customer onboarding.

## 12. Rendering and UI Principles

* Prefer Server Components.
* Use Client Components only for necessary interactivity.
* Reuse shared components and semantic design tokens.
* Provide loading, empty, error, and success states.
* Ensure forms have meaningful validation feedback.
* Avoid placeholder business metrics and fabricated records.
* Keep business logic outside UI components.

## 13. External Integrations

External services may eventually support:

* Media storage.
* Email delivery.
* Monitoring and error reporting.
* Additional communication channels.

Integrations should be introduced behind focused interfaces where that makes the code easier to maintain. Do not add integration abstractions without an actual integration requirement.

## 14. Testing Strategy

Use isolated test data and environments.

Prioritize tests for:

* Authentication and authorization.
* Organization data isolation.
* Property publication rules.
* Property availability changes.
* Lead status transitions.
* Viewing scheduling conflicts.
* API validation and error responses.
* Critical public-to-dashboard user journeys.

Test data must not be inserted into the production business database.

## 15. Architecture Evolution

Keep the initial architecture simple.

Consider additional infrastructure only when supported by demonstrated requirements, such as:

* Background jobs for reliable asynchronous processing.
* Dedicated search infrastructure for measured search limitations.
* Separate services when independent scaling or deployment becomes necessary.
* More advanced reporting when basic database queries are no longer sufficient.

The default is to extend the modular monolith while preserving clear module boundaries.
