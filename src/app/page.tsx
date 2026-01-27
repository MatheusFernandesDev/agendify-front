"use client";

import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F4F1] p-4">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/images/Logo.svg"
          alt="Logo"
          width={58}
          height={58}
          priority
        />
      </div>

      {/* Loading Text */}
      <p className="text-center text-gray-600 text-sm">
        {loading ? "Carregando..." : "Redirecionando..."}
      </p>


      <div className="mt-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    </div>
  );
}