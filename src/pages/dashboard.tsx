import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { ChartTest } from "@/components/ChartTest";
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Handle refresh token failure
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.warn("Access token expired and refresh failed. Signing out...");
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  if (status === "loading") return <p>Loading session...</p>;

  return (
    <PrivateLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {session ? (
          <div>
            <p className="text-lg">Welcome, {session.user?.name || session.user?.email}!</p>
            <p>Your email: {session.user?.email}</p>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
      <ChartTest></ChartTest>

            {/* 🧪 For testing purposes */}
       
            
          </div>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
    </PrivateLayout>
  );
}
