"use client";

import { DashboardHeader } from "../../layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/components/auth/auth-context";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserProfile } from "@/lib/supabase/types";

export default function SettingsNotificationsPage() {
  const {
    user,
    profile: contextProfile,
    isLoading,
    refreshProfile,
  } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
        setProfile({
          ...data,
          push_notifications: data.push_notifications || "mentions",
          communication_emails: data.communication_emails ?? false,
          social_emails: data.social_emails ?? true,
          security_emails: data.security_emails ?? true,
          mobile_notifications_different:
            data.mobile_notifications_different ?? false,
        });
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to fetch profile information.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.id, supabase]);

  // Set profile from Context to local state
  useEffect(() => {
    if (contextProfile) {
      setProfile({
        ...contextProfile,
        push_notifications: contextProfile.push_notifications || "mentions",
        communication_emails: contextProfile.communication_emails ?? false,
        social_emails: contextProfile.social_emails ?? true,
        security_emails: contextProfile.security_emails ?? true,
        mobile_notifications_different:
          contextProfile.mobile_notifications_different ?? false,
      });
      setIsLoadingProfile(false);
    } else if (user?.id && !isLoading) {
      fetchProfile();
    } else if (!user && !isLoading) {
      setIsLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextProfile, user?.id, isLoading, fetchProfile]);

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | boolean
  ) => {
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
          push_notifications: profile.push_notifications,
          email_notifications: profile.email_notifications,
          marketing_emails: profile.marketing_emails,
          communication_emails: profile.communication_emails,
          social_emails: profile.social_emails,
          security_emails: profile.security_emails,
          mobile_notifications_different:
            profile.mobile_notifications_different,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update notification preferences.");
      } else {
        toast.success("Notification preferences updated successfully.");
        await refreshProfile();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update notification preferences.");
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
                    Notifications
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
                  Notifications
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Notification Settings</h1>
            <p className="text-muted-foreground">
              Manage how you receive notifications
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Push Notifications */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>
                  Choose when you want to receive push notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={profile?.push_notifications || "mentions"}
                  onValueChange={(value) =>
                    handleInputChange("push_notifications", value)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="all" id="notify-all" />
                    <Label htmlFor="notify-all" className="cursor-pointer">
                      All new messages
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="mentions" id="notify-mentions" />
                    <Label htmlFor="notify-mentions" className="cursor-pointer">
                      Direct messages and mentions
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="none" id="notify-none" />
                    <Label htmlFor="notify-none" className="cursor-pointer">
                      Nothing
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure which emails you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Communication emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails about your account activity.
                    </p>
                  </div>
                  <Switch
                    checked={profile?.communication_emails || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("communication_emails", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails about new products, features, and more.
                    </p>
                  </div>
                  <Switch
                    checked={profile?.marketing_emails || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("marketing_emails", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Social emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails for friend requests, follows, and more.
                    </p>
                  </div>
                  <Switch
                    checked={profile?.social_emails || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("social_emails", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails about your account activity and security.
                    </p>
                  </div>
                  <Switch
                    checked={profile?.security_emails || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("security_emails", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mobile Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Mobile Settings</CardTitle>
                <CardDescription>
                  Configure mobile-specific notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="mobile-different"
                    checked={profile?.mobile_notifications_different || false}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "mobile_notifications_different",
                        checked as boolean
                      )
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="mobile-different"
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Use different settings for my mobile devices
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      You can manage your mobile notifications in the mobile
                      settings page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Update notifications"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
