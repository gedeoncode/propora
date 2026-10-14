"use client";

import { useState } from "react";
import { Images, X } from "lucide-react";
import { PropertyMedia } from "../types/property";

export function PropertyGallery({
  images,
  title,
}: {
  images: PropertyMedia[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
        No property images available
      </div>
    );
  }

  const hero = images[0];
  const secondary = images.slice(1, 3);
  const extraCount = Math.max(images.length - 3, 0);

  return (
    <>
      <figure className="overflow-hidden rounded-lg border border-border bg-muted">
        {/* Desktop: hero + 2 stack */}
        <div className="grid gap-px sm:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)]">
          <button
            type="button"
            onClick={() => {
              setActiveIndex(0);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]"
            aria-label={`Open image 1 of ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.url}
              alt={hero.alt}
              fetchPriority="high"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>

          {secondary.length > 0 && (
            <div className="hidden gap-px sm:grid sm:grid-rows-2">
              {secondary.map((image, index) => {
                const isLast = index === secondary.length - 1;
                const globalIndex = index + 1;
                return (
                  <button
                    key={`${image.url}-${image.order}`}
                    type="button"
                    onClick={() => {
                      setActiveIndex(globalIndex);
                      setOpen(true);
                    }}
                    className="group relative min-h-0 overflow-hidden"
                    aria-label={
                      isLast && extraCount > 0
                        ? `Open gallery, ${images.length} images`
                        : `Open image ${globalIndex + 1} of ${images.length}`
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    {isLast && extraCount > 0 && (
                      <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/45 via-black/10 to-transparent p-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
                          <Images className="size-3" aria-hidden="true" />
                          +{extraCount} more
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile thumb strip */}
        {images.length > 1 && (
          <div className="flex gap-1 overflow-x-auto border-t border-border bg-card p-1 sm:hidden">
            {images.slice(0, 8).map((image, index) => (
              <button
                key={`${image.url}-${image.order}`}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setOpen(true);
                }}
                className="aspect-square w-16 shrink-0 overflow-hidden rounded-md bg-muted"
                aria-label={`Open image ${index + 1} of ${images.length}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </button>
            ))}
            {images.length > 8 && (
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(8);
                  setOpen(true);
                }}
                className="flex aspect-square w-16 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-medium text-muted-foreground"
                aria-label={`View all ${images.length} images`}
              >
                +{images.length - 8}
              </button>
            )}
          </div>
        )}
      </figure>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${activeIndex + 1} of ${images.length}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-[13px] tabular-nums opacity-80">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div
            className="flex flex-1 items-center justify-center overflow-hidden px-2 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-4">
            {images.map((image, index) => (
              <button
                key={`${image.url}-${image.order}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
                className={`aspect-square w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  index === activeIndex
                    ? "border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}