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
    if (status === "loading") return; 
    
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <>{fallback}</>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}