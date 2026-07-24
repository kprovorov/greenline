"use client";

import { Button } from "@greenline/ui/components/button";

export function AlertButton({ children }: { children: React.ReactNode }) {
  return (
    <Button onClick={() => alert("Hello from your web app!")}>
      {children}
    </Button>
  );
}
