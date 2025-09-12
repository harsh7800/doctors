"use client";

import * as React from "react";
import {
  Calendar,
  Users,
  Stethoscope,
  ClipboardList,
  UserPlus,
  Search,
  Settings,
  LogOut,
  Home,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function DoctorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  const data = {
    user: {
      name: user?.name || "Dr. User",
      email: user?.email || "user@clinic.com",
      avatar: "/avatars/doctor.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Patients",
        url: "/patients",
        icon: Users,
      },
      {
        title: "Consultations",
        url: "/appointments",
        icon: Calendar,
      },
      {
        title: "Tasks",
        url: "/tasks",
        icon: ClipboardList,
      },
      {
        title: "Doctors",
        url: "/doctors",
        icon: UserCheck,
      },
    ],
    navSecondary: [
      {
        title: "Add Patient",
        url: "/patients/add",
        icon: UserPlus,
      },
      {
        title: "Search",
        url: "/search",
        icon: Search,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Stethoscope className="!size-5" />
                <span className="text-base font-semibold">
                  Doctor Dashboard
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
