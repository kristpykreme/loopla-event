"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function CreatedToast() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = sessionStorage.getItem("event:created");
    if (flag) {
      toast.success("Event created successfully");
      sessionStorage.removeItem("event:created"); // one-time toast
    }
  }, []);

  return null;
}
