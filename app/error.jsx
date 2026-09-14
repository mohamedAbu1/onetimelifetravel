"use client";

import { useEffect } from "react";
import PharaohState from "@/components/layout/PharaohState";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return <PharaohState kind="error" reset={reset} />;
}
