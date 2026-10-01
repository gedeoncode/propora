"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { ViewingStatus } from "@/features/viewings/types/viewing";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ViewingStatusActionsProps = {
  viewingId: string;
  status: ViewingStatus;
};

type Action = {
  status: ViewingStatus;
  label: string;
  variant: "default" | "outline" | "destructive";
};

type ApiResponse = {
  success?: boolean;
  error?: {
    message?: string;
  };
};

const ACTIONS: Record<ViewingStatus, Action[]> = {
  scheduled: [
    {
      status: "confirmed",
      label: "Confirm",
      variant: "default",
    },
    {
      status: "cancelled",
      label: "Cancel",
      variant: "outline",
    },
    {
      status: "no_show",
      label: "Mark no-show",
      variant: "outline",
    },
  ],

  confirmed: [
    {
      status: "completed",
      label: "Mark completed",
      variant: "default",
    },
    {
      status: "cancelled",
      label: "Cancel",
      variant: "outline",
    },
    {
      status: "no_show",
      label: "Mark no-show",
      variant: "outline",
    },
  ],

  completed: [],
  cancelled: [],
  no_show: [],
};

function requiresCancellationReason(status: ViewingStatus) {
  return status === "cancelled";
}

function getConfirmationCopy(status: ViewingStatus) {
  switch (status) {
    case "confirmed":
      return {
        title: "Confirm this viewing?",
        description:
          "The appointment will be marked as confirmed and remain on the active schedule.",
        actionLabel: "Confirm viewing",
      };

    case "completed":
      return {
        title: "Mark viewing as completed?",
        description:
          "This will record the appointment as completed. Completed viewings cannot be edited.",
        actionLabel: "Mark completed",
      };

    case "no_show":
      return {
        title: "Mark this viewing as a no-show?",
        description:
          "This will record that the scheduled participant did not attend.",
        actionLabel: "Mark no-show",
      };

    default:
      return {
        title: "Update viewing status?",
        description:
          "This will update the status of this viewing.",
        actionLabel: "Continue",
      };
  }
}

export function ViewingStatusActions({
  viewingId,
  status,
}: ViewingStatusActionsProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStatus, setActiveStatus] =
    useState<ViewingStatus | null>(null);
  const [pendingStatus, setPendingStatus] =
    useState<ViewingStatus | null>(null);
  const [cancellationReason, setCancellationReason] =
    useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const actions = ACTIONS[status];

  if (actions.length === 0) {
    return null;
  }

  const confirmationCopy = pendingStatus
    ? getConfirmationCopy(pendingStatus)
    : null;

  function openStatusConfirmation(nextStatus: ViewingStatus) {
    setErrorMessage(null);
    setCancellationReason("");
    setPendingStatus(nextStatus);
  }

  function closeStatusConfirmation() {
    if (isSubmitting) {
      return;
    }

    setPendingStatus(null);
    setCancellationReason("");
  }

  async function updateStatus(nextStatus: ViewingStatus) {
    const reason = cancellationReason.trim();

    if (requiresCancellationReason(nextStatus) && !reason) {
      setErrorMessage("A cancellation reason is required.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setActiveStatus(nextStatus);

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
            ...(reason
              ? { cancellationReason: reason }
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
      setCancellationReason("");
      router.refresh();
    } catch {
      setErrorMessage(
        "A network error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      setActiveStatus(null);
    }
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => {
            const isActive = activeStatus === action.status;

            return (
              <Button
                key={action.status}
                type="button"
                variant={action.variant}
                disabled={isSubmitting}
                onClick={() =>
                  openStatusConfirmation(action.status)
                }
              >
                {isActive ? (
                  <LoaderCircle
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : action.status === "completed" ||
                  action.status === "confirmed" ? (
                  <Check aria-hidden="true" />
                ) : (
                  <X aria-hidden="true" />
                )}

                {isActive ? "Updating..." : action.label}
              </Button>
            );
          })}
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <AlertDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeStatusConfirmation();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmationCopy?.title}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {confirmationCopy?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingStatus === "cancelled" && (
            <div className="space-y-2">
              <label
                htmlFor="cancellation-reason"
                className="text-sm font-medium"
              >
                Cancellation reason
              </label>

              <Textarea
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(event) =>
                  setCancellationReason(event.target.value)
                }
                placeholder="Explain why this viewing is being cancelled..."
                maxLength={1000}
                disabled={isSubmitting}
                aria-describedby="cancellation-reason-hint"
                autoFocus
              />

              <p
                id="cancellation-reason-hint"
                className="text-xs text-muted-foreground"
              >
                Required. Maximum 1,000 characters.
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Keep viewing
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                isSubmitting ||
                (pendingStatus === "cancelled" &&
                  !cancellationReason.trim())
              }
              onClick={(event) => {
                event.preventDefault();

                if (pendingStatus) {
                  void updateStatus(pendingStatus);
                }
              }}
              className={
                pendingStatus === "cancelled"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {isSubmitting && (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}

              {isSubmitting
                ? "Updating..."
                : confirmationCopy?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}