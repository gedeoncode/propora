import Link from "next/link";

export function ErrorState() {
  return (
    <div
      role="alert"
      className="rounded-xl border border-border bg-card px-6 py-12 text-center"
    >
      <h3 className="font-semibold text-foreground">
        Properties are temporarily unavailable
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        We couldn’t load listings right now. Please try again in a moment.
      </p>
      <Link
        href="/discover"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </Link>
    </div>
  );
}

