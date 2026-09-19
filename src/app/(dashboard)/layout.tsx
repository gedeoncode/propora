import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Dashboard sidebar will go here */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="p-6">
            <span className="text-lg font-semibold">Propora</span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Dashboard top bar will go here */}
          <header className="flex h-16 items-center border-b px-6">
            <span className="font-medium">Dashboard</span>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}