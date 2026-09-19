import type { ReactNode } from "react";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Public site header will go here */}
      <main>{children}</main>
      {/* Public site footer will go here */}
    </div>
  );
}