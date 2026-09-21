import "server-only";

import Customer from "@/features/customers/models/customer.model";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/features/customers/schemas/customer.schema";
import type {
  CustomerStatus,
  CustomerType,
} from "@/features/customers/types/customer";

export type CustomerListFilters = {
  status?: CustomerStatus;
  customerType?: CustomerType;
  assignedAgentId?: string;
  sourceLeadId?: string;
};

export const customerRepository = {
  async findById(id: string) {
    return Customer.findById(id).exec();
  },

  async findBySourceLeadId(sourceLeadId: string) {
    return Customer.findOne({ sourceLeadId }).exec();
  },

  async list(filters: CustomerListFilters = {}) {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.customerType) {
      query.customerType = filters.customerType;
    }

    if (filters.assignedAgentId) {
      query.assignedAgentId = filters.assignedAgentId;
    }

    if (filters.sourceLeadId) {
      query.sourceLeadId = filters.sourceLeadId;
    }

    return Customer.find(query)
      .sort({ createdAt: -1 })
      .exec();
  },

  async create(input: CreateCustomerInput) {
    return Customer.create(input);
  },

  async updateById(id: string, input: UpdateCustomerInput) {
    return Customer.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    }).exec();
  },

  async updateStatus(id: string, status: CustomerStatus) {
    return Customer.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  },

  async assignAgent(
    id: string,
    assignedAgentId: string | null,
  ) {
    return Customer.findByIdAndUpdate(
      id,
      { assignedAgentId },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  },
};