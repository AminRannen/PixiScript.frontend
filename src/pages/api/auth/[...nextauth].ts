import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Debug logger
const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
};

// Optimized for backend format: "2025-06-24 10:13:14"
const parseBackendExpiresAt = (expires_at: string): number => {
  // Convert "2025-06-24 10:13:14" to "2025-06-24T10:13:14Z"
  const isoString = expires_at.replace(' ', 'T') + 'Z';
  return new Date(isoString).getTime();
};
// With optional fallback if you want to keep the safety check:
const parseBackendExpiresAtSafe = (expires_at: string, fallbackMinutes: number = 10): number => {
  const isoString = expires_at.replace(' ', 'T') + 'Z';
  const timestamp = new Date(isoString).getTime();

  // If expired or expires soon, use fallback
  if (timestamp <= Date.now() + 30000) {
    console.warn('Token expires too soon, using fallback:', expires_at);
    return Date.now() + (fallbackMinutes * 60 * 1000);
  }

  return timestamp;
}; //A fucntion for converting backend date format to timestamp

// Refresh token logic
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    log("Attempting refresh with refreshToken:", token.refreshToken?.slice(0, 10) + "...");

    const response = await fetch("http://localhost:8000/api/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const data = await response.json();

    if (!response.ok || !data.data?.access_token) {
      throw new Error(data.message || "Refresh failed");
    }

    const expiresAt = parseBackendExpiresAt(data.data.expires_at, 10); // 10 minutes for access token

    log("Refresh successful. New access token expires at:", new Date(expiresAt).toISOString());

    return {
      ...token,
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token || token.refreshToken,
      expiresAt,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiresAt / 1000),
      error: undefined,
    };
  } catch (error) {
    log("Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
      exp: 0, // force logout
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          log("Login attempt for:", credentials?.email);

          const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (response.ok && data.data?.access_token) {
            const expiresAt = parseBackendExpiresAt(data.data.expires_at, 10); // 10 minutes for access token

            log("Login successful. Token expires at:", {
              received_expires_at: data.data.expires_at,
              parsed_timestamp: expiresAt,
              parsed_date: new Date(expiresAt).toISOString(),
              time_until_expiry: Math.round((expiresAt - Date.now()) / 1000 / 60) + " minutes"
            });

            return {
              id: data.data.user.id.toString(),
              name: data.data.user.name,
              email: data.data.user.email,
              roles: data.data.user.roles, // Add roles from backend
              primary_role: data.data.user.primary_role, // Add primary_role from backend
              accessToken: data.data.access_token,
              refreshToken: data.data.refresh_token,
              expiresAt,
            };
          }

          log("Login failed:", data.message || "Unknown error");
          return null;
        } catch (error) {
          log("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial login
      if (user) {
        log("Creating new JWT for user:", user.email);
        return {
          ...token,
          ...user,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(user.expiresAt / 1000),
        };
      }

      // Check if token is still valid (with 2 minute buffer for 10-minute tokens)
      const bufferTime = 2 * 60 * 1000; // 2 minutes in ms
      if (token.expiresAt && Date.now() < (token.expiresAt - bufferTime)) {
        const timeUntilExpiry = Math.round((token.expiresAt - Date.now()) / 1000 / 60);
        log("Using existing valid access token. Expires in:", timeUntilExpiry + " minutes");
        return token;
      }

      // Refresh if expired or expiring soon
      log("Access token expired or expiring soon. Attempting refresh...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        roles: token.roles, // Add roles to session.user
        primary_role: token.primary_role, // Add primary_role to session.user
      };
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      session.error = token.error;

      log("Session built:", {
        user: session.user,
        expiresAt: token.expiresAt ? new Date(token.expiresAt).toISOString() : 'undefined',
        timeUntilExpiry: token.expiresAt ? Math.round((token.expiresAt - Date.now()) / 1000 / 60) + " minutes" : 'undefined',
        error: session.error,
      });

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60, // 14 days
    updateAge: 60, // revalidate every minute
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);