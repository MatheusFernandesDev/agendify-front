"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-[260px] bg-[#F6F4F1] border-r border-gray-300 z-50 flex flex-col",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 transition-colors z-10"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

