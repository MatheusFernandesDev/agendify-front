"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOutIcon, UserCircle } from "lucide-react";
import { AppointmentIcon, UsersIcon, LogsIcon } from "./svg";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const allMenuItems = [
    {
      href: "/dashboard/agendamentos",
      label: "Agendamentos",
      icon: AppointmentIcon,
      roles: ["ADMIN", "USER"],
    },
    {
      href: "/dashboard/clientes",
      label: "Clientes",
      icon: UsersIcon,
      roles: ["ADMIN"],
    },
    {
      href: "/dashboard/logs",
      label: "Logs",
      icon: LogsIcon,
      roles: ["ADMIN", "USER"],
    },
    {
      href: "/dashboard/perfil",
      label: "Minha Conta",
      icon: () => <UserCircle className="h-5 w-5" />,
      roles: ["USER"],
    },
  ];

  const filteredMenu = allMenuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "bg-[#F6F4F1] border-r border-gray-300 flex flex-col",
        isMobile
          ? "w-full h-full"
          : "fixed left-0 top-0 w-65 h-screen"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-start h-25 px-4 border-b border-gray-300">
        <Image
          src="/images/Logo.svg"
          alt="Logo"
          width={58}
          height={58}
          priority
        />
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2.5 px-4 mt-5">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-2 px-3 py-3 rounded-md transition-colors w-full",
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              <Icon />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info */}
      <div
        className={cn(
          "mt-auto border-t border-gray-300 px-4 py-4 flex flex-col transition-all duration-300 ease-in-out",
          isDropdownOpen ? "h-32" : "h-20"
        )}
      >
        {/* Nome e Role */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {user?.name && user?.surname
                ? `${user.name} ${user.surname}`
                : "Carregando..."}
            </span>
            <span className="text-xs text-gray-600 capitalize">
              {user?.role === "USER" ? "Cliente" : user?.role || ""}
            </span>
          </div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors shrink-0 ml-2"
            aria-label="Abrir menu do usuário"
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isDropdownOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </div>

        {/* Logout Button */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isDropdownOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <button
            onClick={() => {
              signOut();
              setIsDropdownOpen(false);
              if (isMobile && onClose) {
                onClose();
              }
            }}
            className="flex items-center gap-2 w-full py-2 px-2 text-sm text-red-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}