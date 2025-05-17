"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  GraduationCap,
  Settings,
  BarChart3,
  UserCircle2,
  BookOpenCheck,
  LineChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";


interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { role, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Admin Navigation
  const AdminNav = [
    { title: "Dashboard", href: "/admin", icon: Home },
    { title: "Add Student", href: "/add-student", icon: GraduationCap },
    { title: "Priorities", href: "/priorities", icon: BarChart3 },
  ];

  // Teacher Navigation
  const TeacherNav = [
    { title: "Dashboard", href: "/teacher", icon: Home },
    { title: "Add Student", href: "/add-student", icon: GraduationCap },
    { title: "Priorities", href: "/priorities", icon: BarChart3 },
    { title: "Analytics", href: "/analysis", icon: LineChart },
  ];

  // Student Navigation
  const StudentNav = [
    { title: "Dashboard", href: "/student", icon: Home },
    { title: "Analytics", href: "/analysis", icon: BarChart3 },
  ];


  const navigation =
    role === "ADMIN" ? AdminNav : role === "TEACHER" ? TeacherNav : StudentNav;

  const roleColors = {
    ADMIN: {
      bg: "bg-white border-r border-border",
      active: "bg-admin/10 text-admin border-l-4 border-admin",
      hover: "hover:bg-admin/5 hover:text-admin",
    },
    TEACHER: {
      bg: "bg-white border-r border-border",
      active: "bg-teacher/10 text-teacher border-l-4 border-teacher",
      hover: "hover:bg-teacher/5 hover:text-teacher",
    },
    STUDENT: {
      bg: "bg-white border-r border-border",
      active: "bg-student/10 text-student border-l-4 border-student",
      hover: "hover:bg-student/5 hover:text-student",
    },
    DEFAULT: {
      bg: "bg-white border-r border-border",
      active: "bg-primary/10 text-primary border-l-4 border-primary",
      hover: "hover:bg-gray-100",
    },
  }[role ?? "DEFAULT"];

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[250px]",
        roleColors.bg,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {!collapsed && (
          <Link href="/" className="text-xl font-bold tracking-tight">
            ClassForge
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Nav Links */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? roleColors.active : "text-gray-700",
                  !isActive && roleColors.hover
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        {!collapsed && (
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-medium text-red-600 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
        {collapsed && (
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5 text-red-500" />
          </Button>
        )}
      </div>
    </aside>
  );
}
