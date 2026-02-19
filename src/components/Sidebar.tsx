"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FileStack,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "Jobs", icon: Briefcase, href: "/jobs" },
  { name: "Templates", icon: FileStack, href: "/templates" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              S
            </div>
            <span className="font-bold text-lg">Scribe</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <div className="h-8 w-8 bg-muted flex items-center justify-center text-muted-foreground font-medium text-sm rounded-full">
            CY
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User</p>
              <p className="text-xs text-muted-foreground truncate">
                user@scribe.ai
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
