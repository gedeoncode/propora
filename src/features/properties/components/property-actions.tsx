"use client";

import { Menu } from "@base-ui/react/menu";
import { useState } from "react";
import {
  Archive,
  Check,
  Edit3,
  Eye,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
import { cn } from "cn";
import type {
  PropertyAvailabilityStatus,
  PropertyPublicationStatus,
} from "@/features/properties/types/property";

type PropertyActionsProps = {
  propertyId: string;
  propertyTitle: string;
  publicationStatus: PropertyPublicationStatus;
  availabilityStatus: PropertyAvailabilityStatus;
};

type PendingAction =
  | "publish"
  | "archive"
  | "availability"
  | null;

const AVAILABILITY_OPTIONS: Array<{
  value: PropertyAvailabilityStatus;
  label: string;
}> = [
  {
    value: "available",
    label: "Available",
  },
  {
    value: "under_offer",
    label: "Under offer",
  },
  {
    value: "rented",
    label: "Rented",
  },
  {
    value: "sold",
    label: "Sold",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
  },
];

export function PropertyActions({
  propertyId,
  propertyTitle,
  publicationStatus,
  availabilityStatus,
}: PropertyActionsProps) {
  const router = useRouter();

  const [pendingAction, setPendingAction] =
    useState<PendingAction>(null);

  const [selectedAvailability, setSelectedAvailability] =
    useState<PropertyAvailabilityStatus>(
      availabilityStatus,
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const isArchived =
    publicationStatus === "archived";

  function openAction(
    action: Exclude<PendingAction, null>,
  ) {
    setErrorMessage(null);
    setPendingAction(action);
  }

  function closeDialog() {
    if (isSubmitting) {
      return;
    }

    setPendingAction(null);
    setErrorMessage(null);
  }

  async function runAction() {
    if (!pendingAction) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let response: Response;

      if (pendingAction === "publish") {
        response = await fetch(
          `/api/v1/properties/${propertyId}/publish`,
          {
            method: "POST",
          },
        );
      } else if (pendingAction === "archive") {
        response = await fetch(
          `/api/v1/properties/${propertyId}/archive`,
          {
            method: "POST",
          },
        );
      } else {
        response = await fetch(
          `/api/v1/properties/${propertyId}/availability`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              availabilityStatus:
                selectedAvailability,
            }),
          },
        );
      }

      const result = (await response.json()) as {
        success?: boolean;
        error?: {
          message?: string;
        };
      };

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error?.message ??
            "Unable to complete this action. Please try again.",
        );

        return;
      }

      setPendingAction(null);

      router.refresh();
    } catch {
      setErrorMessage(
        "A network error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const dialogCopy =
    pendingAction === "publish"
      ? {
          title: "Publish property?",
          description: `“${propertyTitle}” will become publicly visible once published.`,
          action: "Publish property",
        }
      : pendingAction === "archive"
        ? {
            title: "Archive property?",
            description: `“${propertyTitle}” will be removed from active inventory. Archiving preserves the record and is safer than permanently deleting it.`,
            action: "Archive property",
          }
        : {
            title: "Change availability?",
            description: `Update the availability status for “${propertyTitle}”.`,
            action: "Update availability",
          };

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          aria-label={`Actions for ${propertyTitle}`}
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
                  router.push(
                    `/properties/${propertyId}`,
                  )
                }
                className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm outline-none data-highlighted:bg-muted"
              >
                <Eye
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                View property
              </Menu.Item>

              {!isArchived && (
                <Menu.Item
                  onClick={() =>
                    router.push(
                      `/properties/${propertyId}/edit`,
                    )
                  }
                  className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm outline-none data-highlighted:bg-muted"
                >
                  <Edit3
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />

                  Edit property
                </Menu.Item>
              )}

              {!isArchived && (
                <Menu.Separator className="my-1 h-px bg-border" />
              )}

              {!isArchived &&
                publicationStatus === "draft" && (
                  <Menu.Item
                    onClick={() =>
                      openAction("publish")
                    }
                    className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm outline-none data-highlighted:bg-muted"
                  >
                    <Check
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />

                    Publish property
                  </Menu.Item>
                )}

              {!isArchived && (
                <Menu.Item
                  onClick={() =>
                    openAction("availability")
                  }
                  className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm outline-none data-highlighted:bg-muted"
                >
                  <RotateCcw
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />

                  Update availability
                </Menu.Item>
              )}

              {!isArchived && (
                <>
                  <Menu.Separator className="my-1 h-px bg-border" />

                  <Menu.Item
                    onClick={() =>
                      openAction("archive")
                    }
                    className="flex h-9 cursor-default items-center gap-2 rounded-md px-2.5 text-sm text-destructive outline-none data-highlighted:bg-destructive/10"
                  >
                    <Archive
                      className="size-4"
                      aria-hidden="true"
                    />

                    Archive property
                  </Menu.Item>
                </>
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogCopy.title}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {dialogCopy.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingAction === "availability" && (
            <div className="space-y-2">
              <label
                htmlFor={`availability-${propertyId}`}
                className="text-sm font-medium"
              >
                Availability
              </label>

              <select
                id={`availability-${propertyId}`}
                value={selectedAvailability}
                onChange={(event) =>
                  setSelectedAvailability(
                    event.target
                      .value as PropertyAvailabilityStatus,
                  )
                }
                disabled={isSubmitting}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {AVAILABILITY_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}

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
              className={cn(
                pendingAction === "archive" &&
                  "bg-destructive text-white hover:bg-destructive/90",
              )}
              onClick={(event) => {
                event.preventDefault();
                void runAction();
              }}
            >
              {isSubmitting
                ? "Updating..."
                : dialogCopy.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}