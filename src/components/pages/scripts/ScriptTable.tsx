"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { ScriptData } from "@/types/script";
import { useTranslation } from "react-i18next";

interface Props {
  scripts: ScriptData[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ScriptTable({
  scripts,
  selectedIds,
  onSelect,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-16">ID</TableHead>
            <TableHead className="max-w-xs">{t("title")}</TableHead>
            <TableHead className="max-w-xs">{t("goal")}</TableHead>
            <TableHead className="w-40">{t("createdAt")}</TableHead>
            <TableHead className="w-32 text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scripts.map(script => (
            <TableRow
              key={script.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.push(`/scripts/${script.id}`)}
            >
              <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(script.id)}
                  onChange={() => onSelect(script.id)}
                  className="rounded"
                />
              </TableCell>
              <TableCell className="py-2 font-mono text-xs text-gray-500">
                {script.id}
              </TableCell>
              <TableCell className="py-2">
                <div className="truncate max-w-xs" title={script.title}>
                  {script.title}
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="truncate max-w-xs" title={script.goal}>
                  {script.goal}
                </div>
              </TableCell>
              <TableCell className="py-2 text-xs text-gray-500">
                {formatDate(script.created_at)}
              </TableCell>
              <TableCell className="py-2 text-right space-x-1">
                <Button
                  className="bg-[#78c400] hover:bg-[#599400] text-white font-semibold border border-[#5a9e00]"
                  size="sm"
                  asChild
                >
                  <Link href={`/scripts/${script.id}/edit`}>{t("edit")}</Link>
                </Button>
                <Button
                  className="bg-[#EF4E4E] hover:bg-[#E12D39] text-white font-medium border border-[#CF1124]"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(script.id);
                  }}
                >
                  {t("delete")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}