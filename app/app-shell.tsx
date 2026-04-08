import { ClientShell } from "./client-shell";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return <ClientShell>{children}</ClientShell>;
}
