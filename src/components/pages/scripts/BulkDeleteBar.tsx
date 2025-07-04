"use client";

import { Button } from "@/components/ui/button";

interface Props {
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function BulkDeleteBar({ selectedCount, onDeleteSelected }: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 flex justify-end">
      <Button
        className="bg-[#EF4E4E] hover:bg-[#E12D39] text-white font-medium border border-[#CF1124]"
        onClick={onDeleteSelected}
      >
        Delete Selected ({selectedCount})
      </Button>
    </div>
  );
}
