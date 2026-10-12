
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
import { withDatabase } from "@/lib/db/with-db";

export type CustomerListFilters = {
  status?: CustomerStatus;
  customerType?: CustomerType;
  assignedAgentId?: string;
  sourceLeadId?: string;
};

const customerPopulate = [
  {
    path: "userId",
    select: "firstName lastName email phone",
  },
  {
    path: "assignedAgentId",
    select: "userId",
    populate: {
      path: "userId",
      select: "firstName lastName email phone",
    },
  },
  {
    path: "sourceLeadId",
    select: "firstName lastName email phone status source",
  },
];

export const customerRepository = {
  async findById(id: string) {
    return withDatabase(() =>
      Customer.findById(id)
        .populate(customerPopulate)
        .exec(),
    );
  },

  async findBySourceLeadId(sourceLeadId: string) {
    return withDatabase(() =>
      Customer.findOne({ sourceLeadId }).exec(),
    );
  },

  async existsBySourceLeadId(sourceLeadId: string) {
    return withDatabase(() =>
      Customer.exists({ sourceLeadId }),
    );
  },

  async findByUserId(userId: string) {
    return withDatabase(() =>
      Customer.findOne({ userId }).exec(),
    );
  },

  async list(filters: CustomerListFilters = {}) {
    return withDatabase(() => {
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
        .populate(customerPopulate)
        .sort({ createdAt: -1 })
        .exec();
    });
  },

  async create(input: CreateCustomerInput) {
    return withDatabase(async () => {
      const customer = await Customer.create(input);

      return Customer.findById(customer._id)
        .populate(customerPopulate)
        .exec();
    });
  },

  async updateById(id: string, input: UpdateCustomerInput) {
    return withDatabase(() => {
      const { userId, contact, ...fields } = input;

      const update: {
        $set: Record<string, unknown>;
        $unset: Record<string, 1>;
      } = {
        $set: { ...fields },
        $unset: {},
      };

      // Switch to a registered user.
      if (userId) {
        update.$set.userId = userId;
        update.$unset.contact = 1;
      }

      // Switch to a CRM-only contact.
      if (contact) {
        update.$set.contact = contact;
        update.$unset.userId = 1;
      }

      if (Object.keys(update.$set).length === 0) {
        delete (
          update as {
            $set?: Record<string, unknown>;
          }
        ).$set;
      }

      if (Object.keys(update.$unset).length === 0) {
        delete (
          update as {
            $unset?: Record<string, 1>;
          }
        ).$unset;
      }

      return Customer.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
        .populate(customerPopulate)
        .exec();
    });
  },

  async updateStatus(id: string, status: CustomerStatus) {
    return withDatabase(() =>
      Customer.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        },
      )
        .populate(customerPopulate)
        .exec(),
    );
  },

  async assignAgent(id: string, assignedAgentId: string | null) {
    return withDatabase(() =>
      Customer.findByIdAndUpdate(
        id,
        { assignedAgentId },
        {
          new: true,
          runValidators: true,
        },
      )
        .populate(customerPopulate)
        .exec(),
    );
  },
};
