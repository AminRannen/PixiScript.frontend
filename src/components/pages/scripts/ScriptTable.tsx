"use client";

import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>ID</TableHead>
          <TableHead>{t("title")}</TableHead>
          <TableHead>{t("goal")}</TableHead>
          <TableHead>{t("createdAt")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scripts.map(script => (
          <TableRow
            key={script.id}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/scripts/${script.id}`)}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedIds.includes(script.id)}
                onChange={() => onSelect(script.id)}
              />
            </TableCell>
            <TableCell>{script.id}</TableCell>
            <TableCell>{script.title}</TableCell>
            <TableCell>{script.goal}</TableCell>
            <TableCell>{formatDate(script.created_at)}</TableCell>
            <TableCell className="space-x-2 text-right">
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
  );
}
