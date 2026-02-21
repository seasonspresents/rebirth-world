"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/supabase/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialProfile?: UserProfile | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [isLoading, setIsLoading] = useState(!initialUser && !initialProfile);

  const createProfile = async (currentUser: User) => {
    try {
      const supabase = createClient();

      // Extract username from email (part before @)
      const username = currentUser.email?.split("@")[0] || "";

      // Get full name from OAuth metadata if available
      const fullName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        null;

      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: currentUser.id,
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
        setProfile(null);
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      setProfile(null);
    }
  };

  const fetchProfile = async (userId: string, currentUser: User) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        // Profile doesn't exist, create it automatically
        await createProfile(currentUser);
      } else if (error) {
        console.error("Profile fetch error:", error);
        setProfile(null);
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth changes (real-time synchronization)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser) {
        fetchProfile(newUser.id, newUser).finally(() => setIsLoading(false));
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
