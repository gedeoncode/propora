"use client";

import { useState } from "react";
import {
  Check,
  Eye,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";

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
import { Button } from "@/components/ui/button";
import type { ViewingStatus } from "@/features/viewings/types/viewing";

type ViewingActionsProps = {
  viewingId: string;
  propertyTitle: string;
  participantName: string;
  status: ViewingStatus;
};

type ApiResponse = {
  success?: boolean;
  error?: {
    message?: string;
  };
};

const STATUS_ACTIONS: Record<
  ViewingStatus,
  { status: ViewingStatus; label: string }[]
> = {
  scheduled: [
    {
      status: "confirmed",
      label: "Confirm viewing",
    },
    {
      status: "cancelled",
      label: "Cancel viewing",
    },
    {
      status: "no_show",
      label: "Mark no-show",
    },
  ],

  confirmed: [
    {
      status: "completed",
      label: "Mark completed",
    },
    {
      status: "cancelled",
      label: "Cancel viewing",
    },
    {
      status: "no_show",
      label: "Mark no-show",
    },
  ],

  completed: [],
  cancelled: [],
  no_show: [],
};

function canEdit(status: ViewingStatus) {
  return status === "scheduled" || status === "confirmed";
}

function canDelete(status: ViewingStatus) {
  return status === "scheduled" || status === "confirmed";
}

function isDestructiveStatus(status: ViewingStatus) {
  return status === "cancelled" || status === "no_show";
}

export function ViewingActions({
  viewingId,
  propertyTitle,
  participantName,
  status,
}: ViewingActionsProps) {
  const router = useRouter();

  const [pendingStatus, setPendingStatus] =
    useState<ViewingStatus | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const statusActions = STATUS_ACTIONS[status];

  const activeStatusAction = pendingStatus
    ? statusActions.find((action) => action.status === pendingStatus)
    : null;

  async function updateStatus(nextStatus: ViewingStatus) {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/v1/viewings/${viewingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            ...(nextStatus === "cancelled"
              ? {
                  cancellationReason:
                    "Cancelled from viewing action menu.",
                }
              : {}),
          }),
        },
      );

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error?.message ??
            "Unable to update the viewing status.",
        );
        return;
      }

      setPendingStatus(null);
      router.refresh();
    } catch {
      setErrorMessage(
        "A network error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteViewing() {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/v1/viewings/${viewingId}`,
        {
          method: "DELETE",
        },
      );

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error?.message ??
            "Unable to delete the viewing.",
        );
        return;
      }

      setIsDeleteOpen(false);
      router.push("/viewings");
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
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for viewing ${propertyTitle}`}
            />
          }
        >
          <MoreHorizontal aria-hidden="true" />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner sideOffset={6}>
            <Menu.Popup className="z-50 min-w-48 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none">
              <Menu.Item
                className="flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none data-highlighted:bg-muted"
                onClick={() =>
                  router.push(`/viewings/${viewingId}`)
                }
              >
                <Eye className="size-4" aria-hidden="true" />
                View viewing
              </Menu.Item>

              {canEdit(status) && (
                <Menu.Item
                  className="flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none data-highlighted:bg-muted"
                  onClick={() =>
                    router.push(
                      `/viewings/${viewingId}/edit`,
                    )
                  }
                >
                  <Pencil
                    className="size-4"
                    aria-hidden="true"
                  />
                  Edit viewing
                </Menu.Item>
              )}

              {statusActions.length > 0 && (
                <>
                  <Menu.Separator className="my-1 h-px bg-border" />

                  {statusActions.map((action) => (
                    <Menu.Item
                      key={action.status}
                      className={`flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none data-highlighted:bg-muted ${
                        isDestructiveStatus(action.status)
                          ? "text-destructive"
                          : ""
                      }`}
                      onClick={() =>
                        setPendingStatus(action.status)
                      }
                    >
                      {action.status === "completed" ||
                      action.status === "confirmed" ? (
                        <Check
                          className="size-4"
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          className="size-4"
                          aria-hidden="true"
                        />
                      )}

                      {action.label}
                    </Menu.Item>
                  ))}
                </>
              )}

              {canDelete(status) && (
                <>
                  <Menu.Separator className="my-1 h-px bg-border" />

                  <Menu.Item
                    className="flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm text-destructive outline-none data-highlighted:bg-destructive/10"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2
                      className="size-4"
                      aria-hidden="true"
                    />
                    Delete viewing
                  </Menu.Item>
                </>
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <AlertDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setPendingStatus(null);
            setErrorMessage(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeStatusAction?.label}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {activeStatusAction?.status === "cancelled"
                ? `This will cancel the viewing for ${participantName} at ${propertyTitle}.`
                : activeStatusAction?.status === "no_show"
                  ? `This will record that ${participantName} did not attend the viewing.`
                  : `This will update the viewing for ${participantName} at ${propertyTitle}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {errorMessage}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Keep viewing
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isSubmitting || !pendingStatus}
              onClick={(event) => {
                event.preventDefault();

                if (pendingStatus) {
                  void updateStatus(pendingStatus);
                }
              }}
            >
              {isSubmitting && (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}

              {isSubmitting ? "Updating..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setIsDeleteOpen(false);
            setErrorMessage(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this viewing?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently remove the scheduled viewing
              for {participantName} at {propertyTitle}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {errorMessage}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Keep viewing
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(event) => {
                event.preventDefault();
                void deleteViewing();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}

              {isSubmitting ? "Deleting..." : "Delete viewing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}