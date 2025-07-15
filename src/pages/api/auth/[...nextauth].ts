import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const parseBackendExpiresAt = (expires_at: string): number => {
  const isoString = expires_at.replace(' ', 'T') + 'Z';
  return new Date(isoString).getTime();
};
const parseBackendExpiresAtSafe = (expires_at: string, fallbackMinutes: number = 10): number => {
  const isoString = expires_at.replace(' ', 'T') + 'Z';
  const timestamp = new Date(isoString).getTime();

  if (timestamp <= Date.now() + 30000) {
    console.warn('Token expires too soon, using fallback:', expires_at);
    return Date.now() + (fallbackMinutes * 60 * 1000);
  }

  return timestamp;
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    log("Attempting refresh with refreshToken:", token.refreshToken?.slice(0, 10) + "...");

    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const data = await response.json();

    if (!response.ok || !data.data?.access_token) {
      throw new Error(data.message || "Refresh failed");
    }

    const expiresAt = parseBackendExpiresAt(data.data.expires_at, 10);

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
      exp: 0,
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

          const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (response.ok && data.data?.access_token) {
            const expiresAt = parseBackendExpiresAt(data.data.expires_at, 10);
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
              roles: data.data.user.roles,
              primary_role: data.data.user.primary_role,
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
      if (user) {
        log("Creating new JWT for user:", user.email);
        return {
          ...token,
          ...user,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(user.expiresAt / 1000),
        };
      }

      const bufferTime = 2 * 60 * 1000;
      if (token.expiresAt && Date.now() < (token.expiresAt - bufferTime)) {
        const timeUntilExpiry = Math.round((token.expiresAt - Date.now()) / 1000 / 60);
        log("Using existing valid access token. Expires in:", timeUntilExpiry + " minutes");
        return token;
      }

      log("Access token expired or expiring soon. Attempting refresh...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        roles: token.roles,
        primary_role: token.primary_role,

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
    maxAge: 14 * 24 * 60 * 60,
    updateAge: 60,
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);