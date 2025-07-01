import { useRouter } from "next/router";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    console.error("Authentication error occurred:", error);
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="error-container">
      <h1>Auth Error</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <p>Redirecting to login...</p>
    </div>
  );
}