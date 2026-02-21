"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GalleryVerticalEnd,
  LifeBuoy,
  MessageSquare,
  CalendarCheck,
  BarChart3,
  Bot,
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
      title: "Conversations",
      url: "/dashboard",
      icon: MessageSquare,
      isActive: !isSettingsPage && !isOrdersPage,
      items: [
        {
          title: "All Messages",
          url: "/dashboard",
        },
        {
          title: "DMs",
          url: "/dashboard",
        },
        {
          title: "SMS",
          url: "/dashboard",
        },
        {
          title: "Voice",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Bookings",
      url: "/dashboard",
      icon: CalendarCheck,
      items: [
        {
          title: "Upcoming",
          url: "/dashboard",
        },
        {
          title: "Completed",
          url: "/dashboard",
        },
        {
          title: "Canceled",
          url: "/dashboard",
        },
      ],
    },
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
      title: "AI Assistants",
      url: "/dashboard",
      icon: Bot,
      items: [
        {
          title: "Active Agents",
          url: "/dashboard",
        },
        {
          title: "Scripts & Tone",
          url: "/dashboard",
        },
        {
          title: "Training",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Response Times",
          url: "/dashboard",
        },
        {
          title: "Revenue",
          url: "/dashboard",
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
