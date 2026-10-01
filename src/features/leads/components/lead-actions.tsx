"use client";

import { Menu } from "@base-ui/react/menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Edit3,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { LeadStatus } from "@/features/leads/types/lead";

type LeadActionsProps = {
  leadId: string;
  leadName: string;
  currentStatus: LeadStatus;
};

type DialogAction =
  | "status"
  | "delete"
  | null;

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  viewing_scheduled: "Viewing scheduled",
  negotiating: "Negotiating",
  converted: "Converted",
  lost: "Lost",
};

const ALLOWED_TRANSITIONS: Record<
  LeadStatus,
  LeadStatus[]
> = {
  new: ["contacted", "lost"],
  contacted: ["qualified", "lost"],
  qualified: [
    "viewing_scheduled",
    "negotiating",
    "lost",
  ],
  viewing_scheduled: [
    "negotiating",
    "qualified",
    "lost",
  ],
  negotiating: ["converted", "lost"],
  converted: [],
  lost: ["new"],
};

export function LeadActions({
  leadId,
  leadName,
  currentStatus,
}: LeadActionsProps) {
  const router = useRouter();

  const [dialogAction, setDialogAction] =
    useState<DialogAction>(null);

  const [selectedStatus, setSelectedStatus] =
    useState<LeadStatus | "">("");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const allowedStatuses =
    ALLOWED_TRANSITIONS[currentStatus];

  const hasStatusActions =
    allowedStatuses.length > 0;

  function openDialog(action: DialogAction) {
    setErrorMessage(null);
    setDialogAction(action);

    if (action === "status") {
      setSelectedStatus("");
    }
  }

  function closeDialog() {
    if (isSubmitting) {
      return;
    }

    setDialogAction(null);
    setSelectedStatus("");
    setErrorMessage(null);
  }

  async function handleStatusUpdate() {
    if (!selectedStatus) {
      setErrorMessage(
        "Select a new status first.",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/v1/leads/${leadId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        },
      );

      const result = (await response.json()) as {
        success?: boolean;
        error?: {
          message?: string;
        };
      };

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error?.message ??
            "Unable to update the lead status.",
        );

        return;
      }

      closeDialog();
      router.refresh();
    } catch {
      setErrorMessage(
        "A network error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/v1/leads/${leadId}`,
        {
          method: "DELETE",
        },
      );

      const result = (await response.json()) as {
        success?: boolean;
        error?: {
          message?: string;
        };
      };

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error?.message ??
            "Unable to delete this lead.",
        );

        return;
      }

      router.push("/leads");
      router.refresh();
    } catch {
      setErrorMessage(
        "A network error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          type="button"
          aria-label={`Actions for ${leadName}`}
          title="More actions"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <MoreHorizontal
            className="size-4"
            aria-hidden="true"
          />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner
            side="bottom"
            align="end"
            sideOffset={4}
            className="z-50"
          >
            <Menu.Popup className="min-w-48 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
              <Menu.Item
                onClick={() =>
                  router.push(`/leads/${leadId}`)
                }
                className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm outline-none data-highlighted:bg-muted"
              >
                <Eye
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                View lead
              </Menu.Item>

              <Menu.Item
                onClick={() =>
                  router.push(
                    `/leads/${leadId}/edit`,
                  )
                }
                className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm outline-none data-highlighted:bg-muted"
              >
                <Edit3
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                Edit lead
              </Menu.Item>

              {hasStatusActions && (
                <>
                  <Menu.Separator className="my-1 h-px bg-border" />

                  <Menu.Item
                    onClick={() =>
                      openDialog("status")
                    }
                    className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm outline-none data-highlighted:bg-muted"
                  >
                    <span
                      className="flex size-4 items-center justify-center"
                      aria-hidden="true"
                    >
                      ↻
                    </span>

                    Change status
                  </Menu.Item>
                </>
              )}

              <Menu.Separator className="my-1 h-px bg-border" />

              <Menu.Item
                onClick={() =>
                  openDialog("delete")
                }
                className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm text-destructive outline-none data-highlighted:bg-destructive/10"
              >
                <Trash2
                  className="size-4"
                  aria-hidden="true"
                />

                Delete lead
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <AlertDialog
        open={dialogAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <AlertDialogContent>
          {dialogAction === "status" ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Change lead status
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Choose the next valid status for{" "}
                  <strong>{leadName}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2">
                <label
                  htmlFor={`lead-status-${leadId}`}
                  className="text-sm font-medium"
                >
                  New status
                </label>

                <select
                  id={`lead-status-${leadId}`}
                  value={selectedStatus}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target
                        .value as LeadStatus | "",
                    )
                  }
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">
                    Select a status
                  </option>

                  {allowedStatuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {STATUS_LABELS[status]}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errorMessage}
                </p>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isSubmitting}
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={
                    isSubmitting ||
                    !selectedStatus
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    void handleStatusUpdate();
                  }}
                >
                  {isSubmitting
                    ? "Updating..."
                    : "Update status"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete lead?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This will permanently remove{" "}
                  <strong>{leadName}</strong> from
                  the CRM. The action is only allowed
                  when the lead is not referenced by a
                  customer or viewing.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {errorMessage && (
                <p
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errorMessage}
                </p>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isSubmitting}
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={isSubmitting}
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={(event) => {
                    event.preventDefault();
                    void handleDelete();
                  }}
                >
                  {isSubmitting
                    ? "Deleting..."
                    : "Delete lead"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}