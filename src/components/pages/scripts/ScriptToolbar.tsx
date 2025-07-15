import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Search, Plus, Filter } from "lucide-react";
import { useState } from "react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  currentView: "my" | "shared";
  onViewChange: (view: "my" | "shared") => void;
}

export default function ScriptToolbar({
  search,
  onSearchChange,
  currentView,
  onViewChange,
}: Props) {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleButtonStyle = (active: boolean) =>
    `relative overflow-hidden text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${active
      ? "bg-gradient-to-r from-[#00625D] to-[#004c49] shadow-lg shadow-[#00625D]/30"
      : "bg-gradient-to-r from-[#66C0BC] to-[#4ca7a3] hover:from-[#4ca7a3] hover:to-[#3a8e8a] shadow-md shadow-[#66C0BC]/20"
    }`;

  return (
    <div className="space-y-4">
      {/* Mobile and Desktop Layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Title */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {t("scripts")}
        </h2>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* View Toggle Buttons */}
          <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg shadow-gray-200/50 border border-gray-200/50">
            <button
              className={`${toggleButtonStyle(currentView === "my")} mx-1`}
              onClick={() => onViewChange("my")}
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("My scripts")}
              </span>
            </button>
            <button
              className={`${toggleButtonStyle(currentView === "shared")} mx-1`}
              onClick={() => onViewChange("shared")}
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("Shared with me")}
              </span>
            </button>
          </div>


          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("search") + "..."}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
            />
          </div>

          {/* Create Button */}
          <Button
            className="bg-gradient-to-r from-[#78c400] to-[#599400] hover:from-[#599400] hover:to-[#4a7a00] text-white font-semibold border border-[#5a9e00] rounded-xl px-6 py-2.5 shadow-lg shadow-[#78c400]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#78c400]/30"
            asChild
          >
            <Link href="/scripts/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("create")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="lg:hidden space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("search") + "..."}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
          />
        </div>

        {/* Mobile Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View Toggle Buttons */}
          <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg shadow-gray-200/50 border border-gray-200/50 flex-1">
            <button
              className={`${toggleButtonStyle(currentView === "my")} flex-1 text-sm`}
              onClick={() => onViewChange("my")}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                {t("myScripts")}
              </span>
            </button>
            <button
              className={`${toggleButtonStyle(currentView === "shared")} flex-1 text-sm`}
              onClick={() => onViewChange("shared")}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                {t("sharedWithMe")}
              </span>
            </button>
          </div>

          {/* Create Button */}
          <Button
            className="bg-gradient-to-r from-[#78c400] to-[#599400] hover:from-[#599400] hover:to-[#4a7a00] text-white font-semibold border border-[#5a9e00] rounded-xl px-6 py-3 shadow-lg shadow-[#78c400]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#78c400]/30 sm:w-auto w-full"
            asChild
          >
            <Link href="/scripts/new" className="flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              {t("create")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}