"use client";

import App from "@/App";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return <App>{children}</App>;
}
