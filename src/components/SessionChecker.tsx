// src/components/SessionChecker.tsx
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SessionChecker() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.error === "RefreshAccessTokenError") {
      router.push(`/auth/error?error=SessionExpired`);
    }
  }, [session, status]);

  return null;
}