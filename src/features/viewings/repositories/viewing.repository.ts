import "server-only";

import Viewing from "@/features/viewings/models/viewing.model";
import type {
  CreateViewingInput,
  UpdateViewingInput,
} from "@/features/viewings/schemas/viewing.schema";
import type {
  ViewingStatus,
  ViewingType,
} from "@/features/viewings/types/viewing";

export type ViewingListFilters = {
  status?: ViewingStatus;
  type?: ViewingType;
  propertyId?: string;
  agentId?: string;
  customerId?: string;
  leadId?: string;
  from?: Date;
  to?: Date;
};

export const viewingRepository = {
  async findById(id: string) {
    return Viewing.findById(id).exec();
  },

  async list(filters: ViewingListFilters = {}) {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.propertyId) {
      query.propertyId = filters.propertyId;
    }

    if (filters.agentId) {
      query.agentId = filters.agentId;
    }

    if (filters.customerId) {
      query.customerId = filters.customerId;
    }

    if (filters.leadId) {
      query.leadId = filters.leadId;
    }

    if (filters.from || filters.to) {
      query.scheduledAt = {};

      if (filters.from) {
        (query.scheduledAt as Record<string, Date>).$gte =
          filters.from;
      }

      if (filters.to) {
        (query.scheduledAt as Record<string, Date>).$lte =
          filters.to;
      }
    }

    return Viewing.find(query)
      .sort({ scheduledAt: 1 })
      .exec();
  },

  async findConflictingViewing(
    agentId: string,
    scheduledAt: Date,
    durationMinutes: number,
    excludeViewingId?: string,
  ) {
    const requestedEnd = new Date(
      scheduledAt.getTime() + durationMinutes * 60_000,
    );

    const query: Record<string, unknown> = {
      agentId,
      status: {
        $in: ["scheduled", "confirmed"],
      },
      scheduledAt: {
        $lt: requestedEnd,
      },
    };

    if (excludeViewingId) {
      query._id = { $ne: excludeViewingId };
    }

    const candidates = await Viewing.find(query)
      .sort({ scheduledAt: 1 })
      .exec();

    return candidates.find((viewing) => {
      const viewingEnd = new Date(
        viewing.scheduledAt.getTime() +
          viewing.durationMinutes * 60_000,
      );

      return viewingEnd > scheduledAt;
    }) ?? null;
  },

  async create(input: CreateViewingInput) {
    return Viewing.create(input);
  },

  async updateById(id: string, input: UpdateViewingInput) {
    return Viewing.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    }).exec();
  },

  async updateStatus(
    id: string,
    status: ViewingStatus,
    cancellationReason?: string,
  ) {
    const update: {
      status: ViewingStatus;
      cancellationReason?: string | null;
    } = {
      status,
    };

    if (status === "cancelled") {
      update.cancellationReason = cancellationReason ?? null;
    } else {
      update.cancellationReason = null;
    }

    return Viewing.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();
  },
};