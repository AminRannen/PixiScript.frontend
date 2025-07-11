import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { fetchScripts, fetchScriptById,fetchSharedScripts } from "@/lib/services/scriptService";
import ScriptTable from "@/components/pages/scripts/ScriptTable";
import ScriptToolbar from "@/components/pages/scripts/ScriptToolbar";
import BulkDeleteBar from "@/components/pages/scripts/BulkDeleteBar";
import axios from "axios";
import { ScriptData } from "@/types/script";

export default function ScriptsIndex() {
  const { data: session } = useSession();
  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [currentView, setCurrentView] = useState<"my" | "shared">("my");

  const accessToken = session?.accessToken;

  const fetchMyScripts = async () => {
    const res = await fetchScripts(accessToken!);
    setScripts(res.data.data);
  };

const loadSharedScripts = async () => {
  const scripts = await fetchSharedScripts(accessToken!);
  setScripts(scripts);
};

useEffect(() => {
  if (!accessToken) return;
  if (currentView === "my") fetchMyScripts();
  else loadSharedScripts();
}, [accessToken, currentView]);

  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (scriptId: number) => {
    if (!confirm("Are you sure you want to delete this script?")) return;
    setScripts(prev => prev.filter(script => script.id !== scriptId));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected scripts?`)) return;
    setScripts(prev => prev.filter(script => !selectedIds.includes(script.id)));
    setSelectedIds([]);
  };

  const filteredScripts = scripts.filter(script =>
    script.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PrivateLayout>
      <div className="p-4">
        <BulkDeleteBar selectedCount={selectedIds.length} onDeleteSelected={handleDeleteSelected} />
        <ScriptToolbar
          search={search}
          onSearchChange={setSearch}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <ScriptTable
          scripts={filteredScripts}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
        {filteredScripts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No scripts found.
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}
