// components/ProtectedRoute.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  fallback = <div className="flex items-center justify-center min-h-screen">Loading...</div> 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return <>{fallback}</>;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}