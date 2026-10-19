import { clientEnv } from "@/config/env.client";
import Image from "next/image";
import Link from "next/link";

type WordmarkProps = {
  compact?: boolean;
  withBackground?: boolean;
};

export function Wordmark({
  compact = false,
  withBackground = false,
}: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label={`${clientEnv.NEXT_PUBLIC_APP_NAME} home`}
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-md text-primary outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden ${
          compact ? "size-8" : "size-9"
        } ${
          withBackground
            ? "rounded-lg border border-black/5 bg-white p-1 shadow-sm"
            : ""
        }`}
      >
        <Image
          src="/images/logo.png"
          alt=""
          fill
          sizes={compact ? "32px" : "36px"}
          className={`object-contain ${
            withBackground ? "p-1" : ""
          }`}
          priority
        />
      </span>

      <span
        className={`font-semibold   tracking-tight ${
          compact ? "text-base" : "text-[1.0625rem]"
        }`}
      >
        {clientEnv.NEXT_PUBLIC_APP_NAME}
      </span>
    </Link>
  );
}