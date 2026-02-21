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
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Loader2, ChevronDownIcon } from "lucide-react";
import { UserProfile } from "@/lib/supabase/types";

export default function SettingsAccountPage() {
  const {
    user,
    profile: contextProfile,
    isLoading,
    refreshProfile,
  } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [birthDateOpen, setBirthDateOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        // PGRST116 means no data found
        console.error("Profile fetch error:", error);
        toast.error("Failed to fetch profile information.");
      } else if (data) {
        setProfile(data);
      } else {
        // Create new profile if none exists
        await createProfile();
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to fetch profile information.");
    } finally {
      setIsLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, supabase]);

  const createProfile = useCallback(async () => {
    try {
      // Extract username from email (part before @)
      const username = user?.email?.split("@")[0] || "";

      // Get full name from OAuth metadata if available
      const fullName =
        user?.user_metadata?.full_name || user?.user_metadata?.name || null;

      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: user?.id,
          username: username,
          full_name: fullName,
          language: "en",
          timezone: "UTC",
          email_notifications: true,
          marketing_emails: false,
          is_private: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Profile creation error:", error);
      } else {
        setProfile(data);
        // Also update profile in Context
        await refreshProfile();
      }
    } catch (error) {
      console.error("Profile creation error:", error);
    }
  }, [user?.id, user?.email, user?.user_metadata, supabase, refreshProfile]);

  // Set profile from Context to local state
  useEffect(() => {
    if (contextProfile) {
      setProfile(contextProfile);
      setIsLoadingProfile(false);
    } else if (user?.id && !isLoading) {
      // If profile is not in Context but user exists, fetch directly
      fetchProfile();
    } else if (!user && !isLoading) {
      setIsLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextProfile, user?.id, isLoading, fetchProfile]);

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | null
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
          username: profile.username,
          full_name: profile.full_name,
          bio: profile.bio,
          website: profile.website,
          location: profile.location,
          phone: profile.phone,
          birth_date: profile.birth_date,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update profile.");
      } else {
        toast.success("Profile updated successfully.");
        // Also update profile in Context
        await refreshProfile();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // File type validation
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files can be uploaded.");
      return;
    }

    // File size validation (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be 10MB or less.");
      return;
    }

    try {
      setIsUploadingImage(true);

      // Delete existing profile image if it exists
      if (profile?.profile_image_url) {
        const existingImageUrl = profile.profile_image_url;
        // Extract file path from Supabase storage URL
        const storageUrl = supabase.storage
          .from("profile-images")
          .getPublicUrl("").data.publicUrl;
        if (existingImageUrl.startsWith(storageUrl)) {
          const existingFilePath = existingImageUrl.replace(storageUrl, "");
          const { error: deleteError } = await supabase.storage
            .from("profile-images")
            .remove([existingFilePath]);

          if (deleteError) {
            console.warn("Failed to delete existing image:", deleteError);
            // Continue with upload even if deletion fails
          }
        }
      }

      // Generate file path (timestamp + extension within user_id folder)
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/profile_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload image.");
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        // Update profile
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            profile_image_url: urlData.publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Profile update error:", updateError);
          toast.error("Failed to update profile.");
        } else {
          // Update local state
          setProfile((prev) =>
            prev ? { ...prev, profile_image_url: urlData.publicUrl } : null
          );
          toast.success("Profile image updated successfully.");
          // Also update profile in Context
          await refreshProfile();
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setIsUploadingImage(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
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
                    Account
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
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
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
                  Account
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile information and preferences
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Basic Profile Information */}
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Configure your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Profile Header with Image and Basic Info */}
                <div className="flex flex-col items-center gap-6 rounded-lg border p-6 sm:flex-row sm:items-start">
                  <div className="group relative">
                    <Avatar className="ring-background h-24 w-24 shadow-lg ring-4">
                      <AvatarImage
                        src={
                          profile?.profile_image_url ||
                          user?.user_metadata?.picture
                        }
                        alt={profile?.full_name || undefined}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="absolute -right-2 -bottom-2 h-9 w-9 rounded-full p-0 shadow-md transition-transform group-hover:scale-110"
                      onClick={handleEditImageClick}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">
                        {profile?.full_name || "Your Name"}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        @{profile?.username || "username"}
                      </p>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm sm:justify-start">
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={profile?.username || ""}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        placeholder="Enter a unique username"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="full_name"
                        className="text-sm font-medium"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        value={profile?.full_name || ""}
                        onChange={(e) =>
                          handleInputChange("full_name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted/50 h-11 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profile?.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-muted-foreground text-xs">
                      {profile?.bio?.length || 0}/500 characters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Configure your contact details and location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile?.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="text"
                      value={profile?.website || ""}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      placeholder="www.example.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile?.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="New York, USA"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="birth_date">Date of Birth</Label>
                    <Popover
                      open={birthDateOpen}
                      onOpenChange={setBirthDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="birth_date"
                          className="w-full justify-between font-normal"
                        >
                          {profile?.birth_date
                            ? new Date(
                                profile.birth_date + "T00:00:00"
                              ).toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            profile?.birth_date
                              ? new Date(profile.birth_date + "T00:00:00")
                              : undefined
                          }
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            // Generate YYYY-MM-DD format based on local time to prevent timezone issues
                            let dateString = null;
                            if (date) {
                              const year = date.getFullYear();
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              dateString = `${year}-${month}-${day}`;
                            }
                            handleInputChange("birth_date", dateString);
                            setBirthDateOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
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
