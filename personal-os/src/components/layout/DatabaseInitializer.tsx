"use client";

import { seedDefaultData } from "@/lib/seed";
import { useEffect } from "react";

export function DatabaseInitializer() {
  useEffect(() => {
    seedDefaultData().catch(console.error);
  }, []);
  return null;
}
