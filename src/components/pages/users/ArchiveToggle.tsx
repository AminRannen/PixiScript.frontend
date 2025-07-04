"use client";

import { Button } from "@/components/ui/button";

interface ArchiveToggleProps {
  userId: number;
  currentStatus: string; 
  onToggle: (userId: number, newStatus: string) => void;
}

export default function ArchiveToggle({ userId, currentStatus, onToggle }: ArchiveToggleProps) {
  const newStatus = currentStatus === "archived" ? "active" : "archived";
  const label = currentStatus === "archived" ? "Reactivate" : "Archive";

  return (
    <Button
      variant={currentStatus === "archived" ? "default" : "secondary"}
      size="sm"
      onClick={() => onToggle(userId, newStatus)}
    >
      {label}
    </Button>
  );
}
