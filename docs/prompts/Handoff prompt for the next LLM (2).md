# Propora — Development Context

I am continuing development of **Propora**, a modern real-estate management/CRM platform. I will upload the current project as a ZIP. **Treat the uploaded project as the source of truth.**

You are acting as a senior full-stack developer and UI/UX designer. Work with me conversationally: inspect the uploaded code, understand the existing implementation, and guide development incrementally.

I will **manually copy and paste your code into my project**. You do not need to act as an autonomous coding agent.

## Stack

* Next.js 16 App Router
* React 19
* TypeScript
* Tailwind CSS 4
* shadcn/ui (`base-nova`)
* Lucide icons
* pnpm
* MongoDB + Mongoose
* Zod
* Auth.js / NextAuth

## Architecture

Feature-based modular monolith:

```text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/v1/
├── features/
│   ├── auth/
│   ├── users/
│   ├── properties/
│   ├── agents/
│   ├── leads/
│   ├── customers/
│   ├── viewings/
│   ├── media/
│   ├── notifications/
│   ├── analytics/
│   ├── audit/
│   └── content/
├── components/
├── lib/
├── hooks/
├── types/
└── config/
```

The major domains already exist: **Users/Auth, Properties, Agents, Leads, Customers, and Viewings.**

Do not rebuild completed features or introduce a parallel architecture.

## Existing Principles

* Business logic belongs in services.
* Persistence belongs in repositories.
* External input is validated with Zod.
* Authentication/authorization is server-side.
* Use the existing `AppError` / `apiErrorResponse` infrastructure.
* Agent profiles link to Users through `Agent.userId`.
* Properties reference Agents, not authentication Users.
* Property publication and availability are separate.
* New properties begin as drafts.
* Public users cannot access drafts or archived properties.
* Lead status transitions and viewing scheduling rules belong in services.

Authentication uses Auth.js/NextAuth with credentials and JWT sessions. Server-side authentication/authorization guards already exist. Inspect the uploaded implementation before changing them.

## Design System

Preserve the existing **Navy & Sky Blue** identity.

### Light

```text
Background #F8FAFC
Text       #0F172A
Card       #FFFFFF
Surface    #F1F5F9
Muted      #64748B
Border     #E2E8F0
Primary    #2563EB
```

### Dark

```text
Background #0B1220
Text       #F8FAFC
Card       #111C2E
Surface    #1E293B
Muted      #94A3B8
Border     #263449
Primary    #60A5FA
```

Use the existing semantic Tailwind/shadcn tokens rather than scattered hardcoded colors.

Maintain consistency in:

* spacing and padding
* gutters
* typography
* borders/radii
* shadows
* buttons/forms
* tables/cards/badges
* responsive behavior
* loading/empty/error states
* accessibility and keyboard interaction

The product should feel **modern, polished, restrained, professional, and enterprise-grade**.

Avoid unnecessary gradients, excessive animations, repetitive cards, arbitrary styling, over-abstraction, and generic AI-generated UI patterns.

## Coding Standards

Write production-quality TypeScript:

* strict and meaningful types
* no unnecessary `any`
* focused components/modules
* clear domain boundaries
* reusable abstractions only when justified
* secure server-side validation
* good error handling
* maintainable naming
* accessibility
* performance-conscious implementation

Prefer the existing stack and patterns over introducing new dependencies.

## How We Work

This is important:

**Do not assume the existing code looks like the architecture described above. Inspect the uploaded ZIP first. The actual code is authoritative.**

Before proposing a significant change:

1. Locate and inspect the relevant existing files.
2. Understand how the current implementation works.
3. Identify the smallest appropriate change.
4. Explain important decisions/trade-offs briefly.
5. Give me the exact file path(s) to change.
6. Provide complete, copyable code for each changed file.
7. Include any required test/type-check commands.
8. Stop and let me copy/test the changes.

Do not provide vague snippets when a complete file is needed.

Do not overwrite unseen files.

Do not refactor unrelated code while implementing a feature.

Do not claim something was tested unless it was actually verified from the available project environment.

I prefer working **one step at a time**. When I say **"next"**, continue with the next logical implementation step.

The goal is to continue Propora as though you were joining an existing development team: preserve what is already good, improve what genuinely needs improvement, and maintain one coherent product across the entire codebase and UI.**
