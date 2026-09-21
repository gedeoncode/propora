# Propora — Feature Implementation Roadmap

## Phase 1 — Product Definition and Foundation

### Step 1 — Product Requirements and User Journeys
- Define user types: public visitor, agent, administrator, and agency owner.
- Define permissions and responsibilities for each user type.
- Map the property, enquiry, lead, customer, and viewing workflows.
- Establish MVP scope and feature boundaries.

### Step 2 — Data Model and Relationships
- Define Organization and User models.
- Define organization membership and role relationships.
- Define Property and Property Media models.
- Define Lead and Customer models.
- Define Viewing and Follow-up Task models.
- Define Notification and Audit Event models.
- Establish required fields, relationships, indexes, and data ownership rules.

### Step 3 — Database and Backend Foundation
- Configure and verify MongoDB connectivity.
- Implement and validate Mongoose models.
- Establish Zod validation schemas.
- Establish repository and service patterns.
- Standardize API responses, error handling, and logging.
- Verify database health and failure handling.

## Phase 2 — Authentication and Application Structure

### Step 4 — Authentication
- User sign-in and sign-out.
- Secure session management.
- Password hashing and password reset.
- Registration or invitation-based onboarding.
- Protected dashboard routes and API endpoints.

### Step 5 — Organizations, Membership, and Authorization
- Organization creation and onboarding.
- User membership management.
- Role and permission definitions.
- Organization-level data isolation.
- Server-side authorization for protected actions.

### Step 6 — Application Layouts and Navigation
- Public website layout.
- Authentication layout.
- Dashboard shell.
- Sidebar and primary navigation.
- Dashboard header and user menu.
- Responsive navigation and shared page structure.

## Phase 3 — Property Management

### Step 7 — Property Backend
- Create, retrieve, update, and list properties.
- Property search, filtering, sorting, and pagination.
- Draft, published, and archived publication states.
- Availability status management.
- Organization ownership and permission enforcement.

### Step 8 — Property Management Interface
- Property inventory page.
- Property creation and editing forms.
- Property details page.
- Search, filters, sorting, and pagination.
- Publication and availability controls.
- Loading, empty, success, and error states.

### Step 9 — Property Media Management
- Property image upload and storage.
- Media validation and access control.
- Cover-image selection and image ordering.
- Image replacement and removal.
- Media metadata and property associations.

### Step 10 — Property Publication Workflow
- Draft validation.
- Property publishing and unpublishing rules, if supported.
- Archive workflow.
- Separation of publication and availability statuses.
- Public visibility rules.

## Phase 4 — Public Property Website

### Step 11 — Public Homepage
- Brand header and navigation.
- Property search entry point.
- Introduction to the agency's property offerings.
- Published property section.
- Property browsing and contact entry points.
- Responsive layout and database-driven empty states.

### Step 12 — Property Listing Page
- Published property cards.
- Search and filters.
- Sorting and pagination.
- Property summary information.
- Loading, error, and no-results states.

### Step 13 — Property Details Page
- Property image gallery.
- Description, price, and listing type.
- Location, specifications, and amenities.
- Availability information.
- Enquiry and viewing request entry points.

## Phase 5 — CRM

### Step 14 — Enquiry Capture
- Public enquiry form.
- Input validation and abuse protection.
- Enquiry persistence.
- Association with the relevant property.
- Submission confirmation and error handling.

### Step 15 — Lead Management Backend
- Lead creation, retrieval, and listing.
- Lead assignment and reassignment.
- Validated lead status transitions.
- Lead source tracking.
- Notes, follow-up dates, and activity history.
- Search and filtering.

### Step 16 — Lead Management Interface
- Lead list and detail pages.
- Lead status controls.
- Assignment controls.
- Notes and follow-up information.
- Search, filters, and empty/error states.

### Step 17 — Customer Management
- Customer records and profiles.
- Contact details and communication preferences.
- Links between customers, leads, properties, and viewings.
- Property interests and preferences.
- Search, filtering, and duplicate handling.

### Step 18 — Agent Management
- Agent profiles.
- Organization membership and role management.
- Agent activation and deactivation.
- Property and lead assignments.
- Agent-specific work views.

## Phase 6 — Viewings and Daily Operations

### Step 19 — Viewing Requests and Scheduling
- Public viewing request form.
- Viewing records linked to properties and customers or leads.
- Requested date and time.
- Confirmation, rescheduling, cancellation, and completion workflows.
- Scheduling conflict validation.
- Viewing history.

### Step 20 — Viewing Management Interface
- Viewing list and details.
- Calendar or schedule view.
- Filters by date, agent, and status.
- Confirmation, rescheduling, and cancellation controls.
- Loading, empty, and error states.

### Step 21 — Follow-up Tasks
- Task creation and assignment.
- Due dates and task status.
- Links to leads and customers.
- Completion and cancellation.
- Upcoming and overdue task views.

### Step 22 — Notifications
- In-app notifications for enquiries and lead assignments.
- Viewing request and status notifications.
- Follow-up task reminders.
- Notification read/unread state.
- Email notifications where required.

## Phase 7 — Dashboard and Business Visibility

### Step 23 — Dashboard and Analytics
- Property inventory overview.
- Property availability summary.
- Lead pipeline and lead activity.
- Recent enquiries.
- Upcoming viewings.
- Follow-up task overview.
- Role-appropriate agent workload information.
- Metrics and activity derived from persisted records.

### Step 24 — Audit History
- Property publication, archival, and availability events.
- Lead assignment and status-change events.
- Viewing status-change events.
- Membership and permission-change events.
- Restricted audit history access.

## Phase 8 — Production Readiness

### Step 25 — Security and Privacy
- Authentication and authorization review.
- Organization-level data isolation checks.
- Public API exposure review.
- Input validation and rate limiting.
- Secure media upload review.
- Session and password-reset security.
- Personal-data access, retention, and deletion policies.
- Review of applicable data-protection obligations.

### Step 26 — Testing and Reliability
- Unit tests for business rules and validation.
- Repository and service integration tests.
- API authentication and authorization tests.
- Property publication workflow tests.
- Lead transition tests.
- Viewing conflict tests.
- End-to-end tests for critical user journeys.
- Error reporting and operational logging.

### Step 27 — Deployment and Operations
- Production environment configuration.
- Production database and media storage.
- Application deployment and domain configuration.
- HTTPS and security configuration.
- Monitoring and error reporting.
- Database backups and recovery procedures.
- Agency onboarding process.

## Phase 9 — Post-MVP Enhancements

### Step 28 — Advanced Search and Discovery
- Map-based property search.
- Saved searches.
- Expanded property filters.
- Enhanced location features.

### Step 29 — Reporting and Exports
- Lead reports.
- Property inventory reports.
- Viewing reports.
- Agent activity reports.
- Permission-controlled CSV or spreadsheet exports.

### Step 30 — Additional Business Modules
- Maintenance management.
- Rent collection.
- Financial reporting.
- Document management.
- Subscription billing.
- Third-party integrations.
- Advanced workflow automation.
