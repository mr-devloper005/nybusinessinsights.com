"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/shared/navbar";

export function NavbarShell() {
  return (
    <Suspense fallback={null}>
      <Navbar />
    </Suspense>
  );
}
