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
    <div className="w-full overflow-x-auto">
      <Table className="text-sm min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 min-w-[48px]"></TableHead>
            <TableHead className="w-16 min-w-[64px]">ID</TableHead>
            <TableHead className="min-w-[200px]">{t("title")}</TableHead>
            <TableHead className="min-w-[200px]">{t("goal")}</TableHead>
            <TableHead className="w-40 min-w-[160px]">{t("createdAt")}</TableHead>
            <TableHead className="w-32 min-w-[140px] text-right">{t("actions")}</TableHead>
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
                <div
                  className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                  title={script.title}
                >
                  {script.title}
                </div>
              </TableCell>

              <TableCell className="py-2">
                <div
                  className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                  title={script.goal}
                >
                  {script.goal}
                </div>
              </TableCell>

              <TableCell className="py-2 text-xs text-gray-500 whitespace-nowrap">
                {formatDate(script.created_at)}
              </TableCell>

              <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1 justify-end">
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
  );
}