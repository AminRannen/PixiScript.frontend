// pages/scripts/[id]/edit.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import ScriptEditForm from "@/components/pages/scripts/ScriptEditForm";

export default function ScriptEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-tertiary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <PrivateLayout>
      <ScriptEditForm />
    </PrivateLayout>
  );
}