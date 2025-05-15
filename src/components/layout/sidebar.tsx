"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  UserCircle,
  Settings,
  BookOpen,
  GraduationCap,
  BarChart,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const AdminNav = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
    },
    {
      title: "Teachers",
      href: "/admin/teachers",
      icon: Users,
    },
    {
      title: "Students",
      href: "/admin/students",
      icon: GraduationCap,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const TeacherNav = [
    {
      title: "Dashboard",
      href: "/teacher",
      icon: Home,
    },
    {
      title: "Students",
      href: "/teacher/students",
      icon: GraduationCap,
    },
    {
      title: "Profile",
      href: "/teacher/profile",
      icon: UserCircle,
    },
  ];

  const StudentNav = [
    {
      title: "Dashboard",
      href: "/student",
      icon: Home,
    },
    {
      title: "Courses",
      href: "/student/courses",
      icon: BookOpen,
    },
    {
      title: "Performance",
      href: "/student/performance",
      icon: BarChart,
    },
    {
      title: "Profile",
      href: "/student/profile",
      icon: UserCircle,
    },
  ];

  // Select navigation based on role
  const navigation = role === "ADMIN" 
    ? AdminNav 
    : role === "TEACHER" 
      ? TeacherNav 
      : StudentNav;

  const getRoleColors = () => {
    switch (role) {
      case "ADMIN":
        return {
          bg: "border-r border-border bg-white hover:bg-gray-50",
          active: "bg-admin/10 text-admin border-l-2 border-admin",
          hover: "hover:bg-admin/5",
        };
      case "TEACHER":
        return {
          bg: "border-r border-border bg-white hover:bg-gray-50",
          active: "bg-teacher/10 text-teacher border-l-2 border-teacher",
          hover: "hover:bg-teacher/5",
        };
      case "STUDENT":
        return {
          bg: "border-r border-border bg-white hover:bg-gray-50",
          active: "bg-student/10 text-student border-l-2 border-student",
          hover: "hover:bg-student/5",
        };
      default:
        return {
          bg: "border-r border-border bg-white hover:bg-gray-50",
          active: "bg-primary/10 text-primary border-l-2 border-primary",
          hover: "hover:bg-gray-100",
        };
    }
  };

  const roleColors = getRoleColors();

  return (
    <div
      className={cn(
        "flex flex-col h-screen sticky top-0",
        roleColors.bg,
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className={cn("p-4", collapsed ? "items-center" : "")}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl">ClassGen</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 px-2">
        <nav className="flex flex-col gap-1 py-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                pathname === item.href
                  ? roleColors.active
                  : roleColors.hover
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        {!collapsed && (
          <p className="text-xs text-muted-foreground mb-2">
            {role} Dashboard
          </p>
        )}
      </div>
    </div>
  );
}