"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ScriptToolbar({ search, onSearchChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">{t("scripts")}</h2>
      <div className="flex gap-2">
        <Input
          placeholder={t("search") + "..."}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64"
        />
        <Button className="bg-[#78c400] hover:bg-[#599400] text-white font-semibold border border-[#5a9e00]" asChild>
          <Link href="/scripts/new">+ {t("create")}</Link>
        </Button>
      </div>
    </div>
  );
}
