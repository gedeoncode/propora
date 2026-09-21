# Propora - API Documentation

## 1. Overview

Propora exposes HTTP endpoints through the Next.js App Router.

The API supports the public property discovery experience and the authenticated management dashboard.

**Base path:**

`/api/v1`

The API is versioned to provide a clear path for future changes.

> **Implementation status:** This document describes the intended API contract. Endpoints must be checked against the current route handlers before being treated as fully implemented. Authentication placeholders must not be considered completed security controls.

## 2. General Conventions

### Content Type

JSON request bodies should use:

`Content-Type: application/json`

File uploads may use `multipart/form-data` when supported by the relevant endpoint.

### Success Response

Successful responses follow this general structure:

```json
{
  "success": true,
  "data": {}
}
```

### Paginated Response

Paginated collection endpoints should include pagination information:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

The exact pagination fields and defaults must remain consistent across collection endpoints.

### Error Response

Errors should follow a consistent structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be validated."
  }
}
```

Do not expose stack traces, database credentials, internal exception details, or sensitive information in production responses.

## 3. HTTP Status Codes

| Status | Meaning                                                              |
| ------ | -------------------------------------------------------------------- |
| `200`  | Request completed successfully                                       |
| `201`  | Resource created successfully                                        |
| `204`  | Request completed without a response body, where appropriate         |
| `400`  | Malformed or invalid request                                         |
| `401`  | Authentication required                                              |
| `403`  | Authenticated user lacks permission                                  |
| `404`  | Resource not found or not accessible through the requested operation |
| `409`  | Conflict with the current resource state                             |
| `422`  | Semantically invalid input, if adopted consistently                  |
| `429`  | Rate limit exceeded                                                  |
| `500`  | Unexpected internal error                                            |
| `503`  | Service temporarily unavailable                                      |

Choose one consistent validation-error convention, such as `400` or `422`, and apply it throughout the API.

## 4. Error Codes

The following application error codes are intended for consistent use:

| Code                     | Meaning                                                   |
| ------------------------ | --------------------------------------------------------- |
| `VALIDATION_ERROR`       | Request input failed validation                           |
| `UNAUTHENTICATED`        | The request requires authentication                       |
| `FORBIDDEN`              | The user is not permitted to perform the operation        |
| `NOT_FOUND`              | The requested resource was not found or is not accessible |
| `CONFLICT`               | The operation conflicts with the current resource state   |
| `RATE_LIMITED`           | The request exceeded an applicable rate limit             |
| `EXTERNAL_SERVICE_ERROR` | An external dependency failed                             |
| `INTERNAL_SERVER_ERROR`  | An unexpected server error occurred                       |

## 5. Authentication and Authorization

Public endpoints may be accessed without an authenticated session where explicitly intended.

Management endpoints require authentication and appropriate authorization.

Protected operations must verify:

1. The user has a valid authenticated session.
2. The user has the required permission.
3. The target record belongs to an organization the user may access.
4. Related records and assignments are valid within that organization.

Hiding a button or navigation item is not an authorization mechanism.

The current property write endpoints may contain placeholder authentication guards. Keep those protections in place until real authentication and authorization are implemented.

## 6. Properties API

### List Public Properties

`GET /api/v1/properties`

Returns properties eligible for public discovery.

Potential query parameters:

| Parameter     | Purpose                |
| ------------- | ---------------------- |
| `page`        | Requested page         |
| `limit`       | Page size              |
| `search`      | Text search            |
| `type`        | Property type          |
| `listingType` | Sale or rental listing |
| `city`        | City filter            |
| `minPrice`    | Minimum price          |
| `maxPrice`    | Maximum price          |
| `bedrooms`    | Bedroom filter         |
| `sort`        | Supported sort order   |

Only implement filters supported by the current schema and query logic.

Public results must exclude drafts and archived properties. Availability rules should be applied according to the intended public listing experience.

### Create Property

`POST /api/v1/properties`

**Authentication:** Required.

Creates a property draft for an authorized organization.

Expected behavior:

* Validate the request body.
* Verify organization access.
* Validate any agent assignment.
* Set initial publication status to `draft`.
* Persist the record.
* Return the created property.

### Get Property by ID

`GET /api/v1/properties/:id`

Returns a property only when the requesting user is permitted to access it.

For public access, only eligible published properties may be returned.

Management access to drafts and other non-public records requires authorization.

### Update Property

`PATCH /api/v1/properties/:id`

**Authentication:** Required.

Updates permitted property fields.

The service must validate changes and ensure the property belongs to the user's authorized organization.

### Publish Property

`POST /api/v1/properties/:id/publish`

**Authentication:** Required.

Publishes a property after validating the required listing information.

The service should reject publication when required fields or media are missing.

### Update Availability

`PATCH /api/v1/properties/:id/availability`

**Authentication:** Required.

Changes the property's availability status without implicitly changing its publication status.

### Archive Property

`POST /api/v1/properties/:id/archive`

**Authentication:** Required.

Archives a property while preserving its historical record.

Archived properties must not appear in public property discovery.

## 7. Future API Modules

The following endpoint groups are planned. Their exact routes and request schemas should be finalized as each module is implemented.

### Authentication

Potential operations:

* Register or invite a user.
* Log in.
* Log out.
* Retrieve the current user.
* Initiate and complete password recovery.

### Leads

Potential operations:

* Create a lead from a public enquiry.
* List and retrieve authorized leads.
* Update lead information.
* Assign a lead.
* Change lead status.
* Record follow-up activity.

### Customers

Potential operations:

* Create and update customer records.
* List and retrieve authorized customers.
* Associate customers with leads and viewings.

### Agents

Potential operations:

* Manage agent profiles.
* Manage organization membership.
* Assign properties and leads.
* Update agent status.

### Viewings

Potential operations:

* Submit a viewing request.
* List and retrieve authorized viewing records.
* Confirm, reschedule, or cancel a viewing.
* Record a viewing outcome.

### Notifications

Potential operations:

* List notifications for the current user.
* Mark a notification as read.
* Update supported notification preferences.

### Analytics

Potential operations:

* Retrieve permission-aware property summaries.
* Retrieve lead and viewing metrics.
* Retrieve date-filtered operational reports.

### Audit

Potential operations:

* Retrieve authorized audit history.
* Filter audit events by resource, actor, or date.

## 8. Validation

Use Zod schemas to validate untrusted request data.

Validation should cover:

* Required fields.
* String lengths and formats.
* Numeric ranges.
* Enum values.
* Object identifiers.
* Date and time values.
* Pagination limits.
* Supported filters.
* File metadata and upload constraints.

Do not rely solely on browser-side validation.

## 9. Business Rules

### Property Publication

* New properties begin as drafts.
* Draft and archived properties are excluded from public discovery.
* Publication requires valid listing information.
* Availability and publication are separate statuses.
* Archiving preserves history.

### Leads

* Lead status transitions are validated in the service layer.
* Assignments must be authorized.
* Important changes should be recorded.

### Viewings

* New viewing requests begin pending.
* Confirmation is explicit.
* Conflicting appointments must be detected.
* Concurrent booking attempts must be handled safely.
* Viewing history should be preserved according to retention rules.

## 10. API Security

Before production use:

* Enforce authentication and authorization on protected operations.
* Apply organization-level data isolation.
* Validate all client-controlled identifiers.
* Rate-limit public forms and sensitive endpoints.
* Protect against unauthorized access to private records.
* Validate and restrict file uploads.
* Avoid leaking internal errors.
* Log security-relevant events without recording secrets.

## 11. API Testing

Test:

* Valid and invalid request bodies.
* Missing and expired authentication.
* Insufficient permissions.
* Cross-organization record access.
* Missing resources.
* Invalid status transitions.
* Property publication requirements.
* Viewing conflicts and concurrent requests.
* Pagination and filtering.
* Unexpected database and dependency failures.

Use isolated test data and never seed the production business database with test records.
