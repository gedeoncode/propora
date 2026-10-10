
import Link from "next/link";
import { ArrowUpRight, Building2, ShieldCheck } from "lucide-react";

import { clientEnv } from "@/config/env.client";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  const appName = clientEnv.NEXT_PUBLIC_APP_NAME;

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.9fr)]">
      {/* Brand panel */}
      <section className="relative isolate hidden min-h-screen overflow-hidden bg-brand-950 text-background lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-16 xl:py-12">
        {/* Architectural line illustration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <svg
            viewBox="0 0 700 900"
            fill="none"
            className="absolute inset-0 size-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <g
              stroke="white"
              strokeOpacity="0.12"
              strokeWidth="1"
            >
              <path d="M0 170H700M0 270H700M0 370H700M0 470H700M0 570H700M0 670H700M0 770H700" />
              <path d="M100 0V900M200 0V900M300 0V900M400 0V900M500 0V900M600 0V900" />
            </g>

            <g
              stroke="#93C5FD"
              strokeOpacity="0.65"
              strokeWidth="1.5"
            >
              <path d="M90 610V330L350 180L610 330V610" />
              <path d="M125 610V350L350 220L575 350V610" />
              <path d="M175 610V390H270V610M300 390H400V610M430 390H525V610" />
              <path d="M175 425H270M175 470H270M175 515H270M300 440H400M300 490H400M430 425H525M430 470H525M430 515H525" />
              <path d="M320 610V535Q350 490 380 535V610" />
              <path d="M70 610H630M100 635H600" />
            </g>

            <g stroke="white" strokeOpacity="0.2">
              <path d="M350 130V180M325 155H375" />
              <circle cx="350" cy="180" r="7" />
              <circle cx="350" cy="180" r="19" />
            </g>
          </svg>

          <div className="absolute inset-0 bg-brand-950/25" />

          <div className="absolute bottom-16 left-12 right-12 h-px bg-background/10 xl:left-16 xl:right-16" />
        </div>

        {/* Brand */}
        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
          aria-label={`${appName} home`}
        >
          <span className="flex size-10 items-center justify-center rounded-lg border border-white/15 bg-white/10">
            <Building2 className="size-5 text-brand-300" />
          </span>

          <span className="text-lg font-semibold tracking-tight">
            {appName}
          </span>
        </Link>

        {/* Brand message */}
        <div className="relative z-10 mb-10 max-w-xl xl:mb-14">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-brand-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              Property management, refined
            </p>
          </div>

          <h2 className="max-w-lg text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">
            Your property business.
            <span className="mt-2 block text-brand-300">
              In better focus.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-7 text-slate-300 xl:text-base">
            One place to manage properties, coordinate your team, and
            keep every opportunity moving forward.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="size-4 text-brand-300" />
              Secure account access
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Building2 className="size-4 text-brand-300" />
              One connected workspace
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400">
          A clearer way to manage real estate.
        </p>
      </section>

      {/* Sign-in area */}
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 sm:py-8 lg:justify-center lg:px-12 xl:px-20">
        {/* Compact mobile brand */}
        <header className="flex items-center justify-between lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </span>

            <span className="font-semibold tracking-tight">
              {appName}
            </span>
          </Link>

          <span className="text-xs text-muted-foreground">
            Secure sign in
          </span>
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12 lg:flex-none lg:py-0">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Welcome back
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Sign in to your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Enter your credentials to access your {appName} workspace.
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <p className="text-xs leading-5 text-muted-foreground">
              Your account is protected by secure authentication.
              Only sign in on a device you trust.
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Need help accessing your account?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            >
              Visit {appName}
              <ArrowUpRight
                className="ml-0.5 inline size-3"
                aria-hidden="true"
              />
            </Link>
          </p>
        </div>

        <footer className="mx-auto w-full max-w-md border-t border-border pt-4 lg:border-0 lg:pt-0">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {appName}
          </p>
        </footer>
      </section>
    </main>
  );
}