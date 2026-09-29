export type DashboardMetrics = {
  properties: {
    total: number;
    published: number;
    available: number;
  };

  leads: {
    active: number;
  };

  customers: {
    active: number;
  };

  agents: {
    active: number;
  };

  viewings: {
    upcoming: number;
  };
};

export type DashboardViewing = {
  id: string;
  scheduledAt: Date;
  durationMinutes: number;
  type: "physical" | "virtual";
  status: "scheduled" | "confirmed";
  propertyId: string;
  agentId: string;
  customerId: string | null;
  leadId: string | null;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  upcomingViewings: DashboardViewing[];
};