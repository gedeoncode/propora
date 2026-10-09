import {
  Building2,
  CalendarCheck,
  Handshake,
  Users,
} from "lucide-react";

const workflowAreas = [
  {
    title: "Properties",
    description:
      "Keep your property portfolio organized and make property information easier for your team to manage.",
    icon: Building2,
  },
  {
    title: "Leads",
    description:
      "Keep track of prospects, opportunities, and the conversations that move them forward.",
    icon: Handshake,
  },
  {
    title: "Customers",
    description:
      "Maintain a clear view of customer relationships and the work your team needs to follow up on.",
    icon: Users,
  },
  {
    title: "Viewings",
    description:
      "Coordinate property viewings alongside the people, properties, and opportunities involved.",
    icon: CalendarCheck,
  },
];

export function MarketingWorkflowSection() {
  return (
    <section id="properties" className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            Everything connected
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The work behind every property transaction, in one place.
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Real-estate operations rarely happen in isolation. Propora
            connects the key parts of your workflow so your team can spend
            less time switching between disconnected processes.
          </p>
        </div>

        <div className="mt-12 grid border border-border sm:grid-cols-2 lg:grid-cols-4">
          {workflowAreas.map((area, index) => {
            const Icon = area.icon;

            return (
              <article
                key={area.title}
                className={[
                  "bg-card p-6 sm:p-7",
                  index > 0 ? "border-t border-border sm:border-t-0" : "",
                  index % 2 === 1 ? "sm:border-l sm:border-border" : "",
                  index >= 2 ? "lg:border-t-0" : "",
                  index > 0 ? "lg:border-l lg:border-border" : "",
                ].join(" ")}
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-muted text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>

                <h3 className="mt-6 text-base font-semibold text-foreground">
                  {area.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}