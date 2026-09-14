"use client";

import { useEffect, useState } from "react";
import { getSeasonalEventForDisplay } from "@/lib/seasonalEvents";

export function useSeasonalEvent() {
  const [event, setEvent] = useState(() => getSeasonalEventForDisplay());

  useEffect(() => {
    const refresh = () => setEvent(getSeasonalEventForDisplay());
    refresh();
    window.addEventListener("seasonal-theme-change", refresh);
    return () => window.removeEventListener("seasonal-theme-change", refresh);
  }, []);

  return event;
}
