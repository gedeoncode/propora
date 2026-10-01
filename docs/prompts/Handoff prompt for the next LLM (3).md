# Propora — Project Handoff & UX Modernization

You are continuing development of **Propora**, a real estate platform and CRM. I will provide the current `project.zip`, containing the application source code and `global.css`.

## 1. Project context

Propora uses:

* Next.js 16 App Router, React 19, TypeScript.
* Tailwind CSS 4, shadcn/ui (Base Nova), and Lucide icons.
* MongoDB, Mongoose 9, and Zod 4.
* Auth.js / NextAuth for authentication and role-based access.
* A feature-based modular monolith architecture.

The application includes marketing pages, authentication, a dashboard, and CRM modules such as properties, leads, customers, agents, and viewings.

## 2. Primary objective

Modernize Propora’s UX so it feels like a **premium, cohesive, enterprise-grade real estate platform rather than a basic CRUD application**.

Focus on intuitive workflows, clear information hierarchy, polished data tables and forms, contextual actions, useful summaries, effective navigation, meaningful feedback, and responsive layouts. Introduce dashboard insights and richer interactions where they genuinely improve usability.

Avoid generic SaaS templates, excessive cards, unnecessary decoration, arbitrary gradients, and repetitive AI-generated design patterns.

## 3. Visual design — follow the existing design system

The supplied ZIP contains `global.css`, which defines Propora’s design tokens, colors, typography, and styling conventions.

**Inspect `global.css` before making any UI changes. Treat it as the primary source of truth for visual design.** Also examine existing components and pages to understand how the design system is applied.

Preserve the established brand identity, color palette, typography, spacing, padding, border radii, backgrounds, borders, shadows, and component styles. Reuse existing tokens and component variants rather than introducing arbitrary values.

If a genuine design-system gap exists, propose a minimal, consistent extension. Do not replace the existing visual identity or rewrite the styling system unnecessarily.

## 4. Architecture and code quality

Build on the existing codebase rather than restructuring it unnecessarily.

* Inspect relevant files before proposing or implementing changes.
* Reuse existing components, utilities, hooks, schemas, services, and API routes where appropriate.
* Respect the feature-based architecture and separation of UI, business logic, data access, and API handlers.
* Preserve existing business rules, API contracts, authentication, and role-based authorization.
* Maintain type safety, accessibility, keyboard navigation, visible focus states, and responsive behavior.
* Handle loading, error, empty, success, and disabled states thoughtfully.
* Avoid unnecessary dependencies, duplicate components, overengineering, and unrelated refactoring.
* Never assume a component, token, or helper exists without verifying it.

## 5. Collaboration and implementation

Work conversationally with me. I will integrate the code manually, so provide practical, complete code rather than assuming direct repository access.

For each task:

1. Inspect the relevant files and understand the existing implementation.
2. Briefly explain the proposed improvement and important decisions.
3. Make the smallest coherent set of changes needed.
4. Provide exact file paths and complete replacement code for modified files, or precise patches when appropriate.
5. Explain integration steps and any compatibility concerns.
6. Recommend relevant checks without claiming tests passed unless they were actually run.

Work incrementally. Focus on the requested improvement, preserve working functionality, and wait for my feedback or instruction before proceeding to the next task.

## 6. First task: audit before redesigning

Start by inspecting `project.zip`, the dashboard layout, navigation, shared UI components, and existing CRM pages.

Provide a concise assessment of the current UX and identify the most significant opportunities to make Propora more modern, consistent, and enterprise-ready.

Then propose a **prioritized, practical improvement plan grounded in the actual codebase**. Explain which area should be addressed first and why.

Do not immediately rewrite the application, invent a new design system, or begin unrelated changes. Wait for my approval before implementing the first improvement.

## Guiding principle

Make Propora feel like one cohesive, thoughtfully designed real estate product. Prioritize usability, visual consistency, efficient workflows, and maintainable code over novelty and complexity.
