// pages/scripts/[id]/share.tsx
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { useRouter } from "next/router";
import { useState } from "react";
import { fetchUsers } from "@/lib/api/users/userServices";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Share2, User, Lock, Edit } from "lucide-react";

interface SharePageProps {
  scriptId: number;
  users: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

export default function ShareScriptPage({ scriptId, users }: SharePageProps) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [accessType, setAccessType] = useState<"read" | "write">("read");
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  const handleShare = async () => {
    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }

    setIsSharing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/scripts/${scriptId}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await getSession())?.accessToken}`,
          },
          body: JSON.stringify({
            user_id: selectedUserId,
            access_type: accessType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to share script");
      }

      setSuccess("Script shared successfully!");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-blue-600" />
              Share Script
            </CardTitle>
            <CardDescription>
              Select a user and permission level to share this script with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Select User
                </Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedUserId || ""}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  Access Type
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      name="accessType"
                      value="read"
                      checked={accessType === "read"}
                      onChange={() => setAccessType("read")}
                    />
                    <span className="text-sm font-medium leading-none">
                      Read Only
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      name="accessType"
                      value="write"
                      checked={accessType === "write"}
                      onChange={() => setAccessType("write")}
                    />
                    <span className="text-sm font-medium leading-none">
                      Read & Write
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="bg-[#A8A8A8] hover:bg-[#8B8B8B] text-white font-medium border border-[#8B8B8B] shadow-sm transition-all duration-200 hover:shadow-md"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleShare}
                disabled={isSharing || !selectedUserId}
                className="px-6 py-2 bg-[#78c400] hover:bg-[#599400] text-white shadow-lg rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                {isSharing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share Script
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const users = await fetchUsers(session.accessToken as string);
    
    return {
      props: {
        scriptId: context.params?.id,
        users: users.map((user) => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: {
        scriptId: context.params?.id,
        users: [],
      },
    };
  }
};