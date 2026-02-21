"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  avatar?: string;
  avatarFallback: string;
  unread?: boolean;
  actionButtons?: {
    accept?: () => void;
    decline?: () => void;
  };
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Your order is placed",
    message: "Amet minim mollit non deser unt ullamco e...",
    time: "2 days ago",
    avatar: "/blog/authors/john-doe.png",
    avatarFallback: "JD",
    unread: false,
  },
  {
    id: "2",
    title: "Congratulations Darlene 🎉",
    message: "Won the monthly best seller badge",
    time: "11 am",
    avatar: "/blog/authors/lee-robinson.png",
    avatarFallback: "LR",
    unread: true,
  },
  {
    id: "3",
    title: "Joaquina Weisenborn",
    message: "Requesting access permission",
    time: "12 pm",
    avatar: "/blog/authors/richard-roe.png",
    avatarFallback: "JW",
    unread: true,
    actionButtons: {
      accept: () => console.log("Accept"),
      decline: () => console.log("Decline"),
    },
  },
  {
    id: "4",
    title: "Brooklyn Simmons",
    message: "Added you to Top Secret Project...",
    time: "Yesterday",
    avatar: "/blog/authors/john-doe.png",
    avatarFallback: "BS",
    unread: true,
  },
];

interface NotificationsDropdownProps {
  variant?:
    | "ghost"
    | "outline"
    | "default"
    | "secondary"
    | "destructive"
    | "link";
}

export function NotificationsDropdown({
  variant = "ghost",
}: NotificationsDropdownProps) {
  const [notifications] = React.useState<Notification[]>(sampleNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
            View all
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <div
                className={`hover:bg-accent relative flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${
                  notification.unread ? "bg-accent/50" : ""
                }`}
              >
                {notification.unread && (
                  <span className="absolute top-1/2 right-4 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500" />
                )}
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={notification.avatar} />
                  <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {notification.title}
                  </p>
                  <p className="text-muted-foreground truncate text-sm">
                    {notification.message}
                  </p>
                  {notification.actionButtons && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={notification.actionButtons.accept}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        onClick={notification.actionButtons.decline}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                  <p className="text-muted-foreground flex items-center gap-1 pt-1 text-xs">
                    <span className="inline-block">🕐</span>
                    {notification.time}
                  </p>
                </div>
              </div>
              {index < notifications.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
