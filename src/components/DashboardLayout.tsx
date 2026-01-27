"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileDrawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex min-h-screen bg-[#F6F4F1]">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-30 bg-black text-white hover:bg-black/90 h-10 w-10 p-0"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <MobileDrawer open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        </MobileDrawer>
      ) : (
        <Sidebar />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 flex flex-col min-h-screen",
          isMobile ? "ml-0 mb-10" : "ml-[260px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}

