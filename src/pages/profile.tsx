"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/seperator";
import { Loader2, User, Mail, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { useTranslation } from 'react-i18next';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  primary_role: string;
  created_at: string;
  updated_at: string;
}

interface Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: "RefreshAccessTokenError";
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: session } = useSession() as { data: Session | null };
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await fetch(`${API_BASE_URL}/my-profile`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(t('updateError'));
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('updateError'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, t]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'moderator': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">{t('loading')}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <XCircle className="w-8 h-8 text-red-500" />
            <span className="ml-2 text-red-600">{t('errorOccurredWhileCreatingScript')}: {error}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PrivateLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('profile')} {t('general Information')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="text-lg">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold">{profile?.name}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile?.email}
                    </p>
                    <p className="text-sm text-gray-500">ID: {profile?.id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{t('status')}:</span>
                      <Badge className={getStatusColor(profile?.status || '')}>
                        {profile?.status === 'active' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {t(profile?.status?.toLowerCase() || '')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{t('role')}:</span>
                      <Badge className={getRoleColor(profile?.primary_role || '')}>
                        <Shield className="w-3 h-3 mr-1" />
                        {t(profile?.primary_role?.toLowerCase() || '')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('edit')} {t('profile')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">{t('firstName')}</Label>
                    <Input
                      id="first_name"
                      defaultValue={profile?.first_name || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('readOnlyField')}</p>
                  </div>

                  <div>
                    <Label htmlFor="last_name">{t('lastName')}</Label>
                    <Input
                      id="last_name"
                      defaultValue={profile?.last_name || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('readOnlyField')}</p>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="name">{t('fullName')}</Label>
                    <Input
                      id="name"
                      defaultValue={profile?.name || ""}
                      placeholder={t('enterDisplayName')}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('onlyEditableField')}</p>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={profile?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('readOnlyField')}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">{t('status')}</Label>
                    <Input
                      id="status"
                      defaultValue={t(profile?.status?.toLowerCase() || '')}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('readOnlyField')}</p>
                  </div>

                  <div>
                    <Label htmlFor="primary_role">{t('role')}</Label>
                    <Input
                      id="primary_role"
                      defaultValue={t(profile?.primary_role?.toLowerCase() || '')}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('readOnlyField')}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-[#78c400] hover:bg-[#599400] text-[#FFFFFF] font-semibold border border-[#5a9e00] shadow-sm transition-all duration-200 hover:shadow-md"
                    type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('updating')}
                      </>
                    ) : (
                      t('updateUser')
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('accountInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('accountCreated')}</Label>
                  <p className="text-sm">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('lastUpdated')}</Label>
                  <p className="text-sm">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PrivateLayout>
  );
}