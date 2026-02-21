"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GalleryVerticalEnd,
  LifeBuoy,
  Package,
  Send,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const teams = [
  {
    name: "Rebirth World",
    logo: GalleryVerticalEnd,
    plan: "Pro",
  },
];

const navSecondary = [
  {
    title: "Support",
    url: "mailto:hello@rebirth.world",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "mailto:hello@rebirth.world?subject=Feedback",
    icon: Send,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/dashboard/settings");
  const isOrdersPage = pathname.startsWith("/dashboard/orders");

  const navMain = [
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: Package,
      isActive: isOrdersPage,
      items: [
        {
          title: "All Orders",
          url: "/dashboard/orders",
        },
      ],
    },
    {
      title: "Resources",
      url: "/dashboard",
      icon: BookOpen,
      items: [
        {
          title: "Getting Started",
          url: "https://rebirth.world",
        },
        {
          title: "Changelog",
          url: "/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard",
      icon: Settings2,
      isActive: isSettingsPage,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Account",
          url: "/dashboard/settings/account",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
