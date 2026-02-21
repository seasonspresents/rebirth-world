"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown";
import { HeaderUserMenu } from "@/components/dashboard/header-user-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
// Reusable header component that pages can use
export function DashboardHeader({
  breadcrumb,
  actions,
}: {
  breadcrumb: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {breadcrumb}
      </div>
      <div className="flex items-center gap-2">
        <NotificationsDropdown variant="outline" />
        <ModeToggle variant="outline" />
        {actions}
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <HeaderUserMenu />
      </div>
    </header>
  );
}
