"use client";

import { useEffect } from "react";

import ServerErrorPage from "@/components/error/ServerErrorPage";
import { buttonClass } from "@/components/ui/button";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <ServerErrorPage />
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => unstable_retry()}
          className={buttonClass({ size: "sm" })}
        >
          Riprova
        </button>
      </div>
    </div>
  );
}
