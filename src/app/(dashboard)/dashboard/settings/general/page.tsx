"use client";

import { useAuth } from "@/components/auth/auth-context";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "../../layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { UserProfile } from "@/lib/supabase/types";

export default function SettingsGeneralPage() {
  const {
    user,
    profile: contextProfile,
    isLoading,
    refreshProfile,
  } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error);
        toast.error("Failed to fetch profile information.");
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to fetch profile information.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    if (contextProfile) {
      setProfile(contextProfile);
      setIsLoadingProfile(false);
    } else if (user?.id && !isLoading) {
      fetchProfile();
    } else if (!user && !isLoading) {
      setIsLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextProfile, user?.id, isLoading, fetchProfile]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile || !user?.id) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("user_profiles")
        .update({
          language: profile.language,
          timezone: profile.timezone,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update preferences.");
      } else {
        toast.success("Preferences updated successfully.");
        await refreshProfile();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <>
        <DashboardHeader
          breadcrumb={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard/settings/general"
                    className="font-semibold"
                  >
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">
                    General
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="max-w-4xl space-y-6">
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard/settings/general"
                  className="font-semibold"
                >
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  General
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">General Settings</h1>
            <p className="text-muted-foreground">
              Manage your application preferences
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>
                  Configure your language, timezone, and theme preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={profile?.language || "en"}
                      onValueChange={(value) =>
                        handleInputChange("language", value)
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ko">한국어</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profile?.timezone || "UTC"}
                      onValueChange={(value) =>
                        handleInputChange("timezone", value)
                      }
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        <SelectItem value="America/New_York">
                          New York (GMT-5)
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          London (GMT+0)
                        </SelectItem>
                        <SelectItem value="Asia/Seoul">
                          Seoul (GMT+9)
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          Tokyo (GMT+9)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={theme || "system"}
                      onValueChange={(value) => setTheme(value)}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
