# Propora - Deployment Guide

## 1. Overview

This document describes the intended deployment and operational practices for Propora.

The application is built with Next.js 16 and uses MongoDB through Mongoose.

Deployment configuration must be verified against the actual project, hosting provider, authentication implementation, and external integrations.

## 2. Deployment Components

A production deployment is expected to require:

* A hosting environment that supports the application's Next.js features.
* A production MongoDB database.
* Secure environment-variable configuration.
* A media-storage solution when property uploads are enabled.
* A domain and HTTPS.
* Logging and error monitoring.
* Database backup and recovery procedures.

Email delivery and other external integrations may be added as their features are implemented.

## 3. Environment Configuration

Use separate configuration for development, testing, and production.

### Environment Variables

The exact variables depend on the current implementation. The following is an illustrative starting point:

```env
NODE_ENV=production

MONGODB_URI=

# Configure only when the authentication implementation requires them.
AUTH_SECRET=
AUTH_URL=

# Configure when media storage is implemented.
MEDIA_STORAGE_PROVIDER=
MEDIA_STORAGE_BUCKET=
MEDIA_STORAGE_ACCESS_KEY=
MEDIA_STORAGE_SECRET_KEY=

# Configure when email delivery is implemented.
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=
```

These names are examples, not a claim that the application currently reads all of them. Align them with the actual environment schema and integration code before deployment.

Do not:

* Commit secrets to source control.
* Expose server secrets through `NEXT_PUBLIC_` variables.
* Reuse development credentials in production.
* Print secrets in logs or error messages.

Use the hosting provider's encrypted environment-variable configuration.

## 4. Database Preparation

Before deploying:

1. Create or provision a production MongoDB database.
2. Create a dedicated database user with only the permissions the application requires.
3. Configure network access and database authentication.
4. Set the production connection string securely.
5. Confirm the application can connect from the hosting environment.
6. Review required indexes.
7. Establish backup and recovery procedures.

Do not use a local development database as the production database.

### Database Indexes

Review indexes based on actual queries and access patterns.

Potentially useful fields include:

* Organization identifiers.
* Property publication and availability.
* Property type and listing type.
* Property location.
* Lead status and assignment.
* Viewing date and agent assignment.

Indexes should be selected and verified against the implemented schema. Avoid creating unnecessary indexes without a query or performance justification.

## 5. Media Storage

When property uploads are enabled, use an appropriate object-storage provider.

The implementation should:

* Validate file type and size.
* Generate safe storage keys.
* Prevent unauthorized uploads and deletions.
* Store media metadata and references in MongoDB.
* Support image ordering and cover-image selection.
* Handle failed uploads and cleanup.
* Avoid relying on temporary local server storage for durable production media.

Configure storage credentials only on the server.

## 6. Build and Deployment Preparation

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Run TypeScript checks:

```bash
pnpm exec tsc --noEmit
```

Run linting:

```bash
pnpm lint
```

Create a production build:

```bash
pnpm build
```

The exact scripts must match the project's `package.json`.

Resolve build errors and review warnings before deployment. Do not treat a successful build as proof that authentication, authorization, business workflows, or production integrations are correct.

## 7. Hosting

Choose a hosting platform that supports the Next.js features used by the application.

Before selecting a platform, verify support for:

* App Router.
* Server Components and Server Actions, if used.
* Route handlers.
* Runtime and execution limits.
* Environment variables.
* File upload constraints.
* Any required scheduled or background processing.

Configure the production domain and HTTPS.

The deployment process should be repeatable and documented.

## 8. Production Data Policy

Propora is intended to operate on genuine business records.

* Do not seed production with fictional properties.
* Do not insert fake leads, customers, agents, or viewing activity to make dashboards look populated.
* Do not run development seed scripts against the production database.
* Do not use production customer records as test fixtures.
* Use isolated test environments for automated tests.

Empty states should guide users toward creating their first real record.

## 9. Security Checklist

Before real agency onboarding, verify:

* Authentication is implemented and tested.
* Protected routes and API operations enforce server-side authorization.
* Organization-level data isolation is tested.
* Session and password handling follow secure practices.
* Public forms have appropriate validation and abuse protection.
* Media upload and retrieval permissions are enforced.
* Sensitive environment variables are protected.
* Error responses do not reveal internal implementation details.
* Security-relevant events are logged appropriately.
* Dependencies are reviewed and updated responsibly.
* Applicable privacy and data-protection requirements have been assessed.

## 10. Monitoring and Logging

Configure appropriate monitoring for:

* Application errors.
* Failed requests.
* Database connectivity.
* External service failures.
* Resource usage and hosting limits.
* Unexpected increases in public form submissions.

Logs should help diagnose operational issues without exposing passwords, tokens, credentials, or unnecessary customer information.

Avoid logging entire request bodies by default.

## 11. Backups and Recovery

Establish a backup policy appropriate to the business and database provider.

Document:

* Backup frequency.
* Retention period.
* Access restrictions.
* Recovery procedures.
* Recovery objectives.
* How restoration is tested.

A backup strategy is incomplete until restoration has been tested.

## 12. Deployment Workflow

A typical release process:

1. Review the code changes.
2. Run the available automated checks.
3. Verify environment-variable requirements.
4. Confirm database and external-service readiness.
5. Deploy to a staging environment when available.
6. Test critical workflows.
7. Deploy to production.
8. Check application health and logs.
9. Confirm key user journeys.
10. Monitor for regressions and errors.

Use a rollback strategy appropriate to the hosting platform and database changes.

## 13. Operational Readiness

Before onboarding a real agency, confirm:

* An organization can be created or onboarded securely.
* Authorized users can access their organization's records.
* Property records can be created, edited, published, and archived.
* Public users can discover eligible published properties.
* Enquiries are persisted and available to authorized staff.
* Leads and customers can be managed.
* Viewing requests and scheduling rules work correctly.
* Errors and empty states are understandable.
* Backups, monitoring, and support procedures are in place.

## 14. Privacy and Compliance

Before processing real customer data, review applicable Kenyan data-protection requirements and any other requirements relevant to the agency's operating locations.

Define appropriate practices for:

* Data collection and purpose.
* User access and permissions.
* Data retention and deletion.
* Security incident handling.
* Customer requests concerning personal data.
* External processors and integrations.

Obtain qualified legal or compliance guidance where necessary.

## 15. Future Operational Enhancements

Consider these when actual usage justifies them:

* Background job processing.
* Scheduled notifications.
* More advanced monitoring.
* Dedicated search infrastructure.
* Additional reporting and exports.
* Automated operational maintenance.
* More sophisticated deployment pipelines.


