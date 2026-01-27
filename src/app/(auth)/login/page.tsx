"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // Estado para erro do email
  const [passwordError, setPasswordError] = useState(""); // Estado para erro da senha
  const [emailFocused, setEmailFocused] = useState(false); // Para controlar foco no email
  const [passwordFocused, setPasswordFocused] = useState(false); // Para controlar foco na senha
  const { loading } = useAuth();

  const { signIn } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Resetar erros antes de validar
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError("E-mail é obrigatório");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Senha é obrigatória");
      hasError = true;
    }

    if (hasError) return; // Não prossegue se houver erro

    await signIn({ email, password });
  }

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

      {/* Title */}
      <h1
        className="text-center text-[#000000] mb-8 w-full max-w-md"
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontWeight: 600,
          fontSize: "28px",
          lineHeight: "50px",
          letterSpacing: "0px",
          height: "50px",
        }}
      >
        Login Admin
      </h1>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-white rounded-lg shadow-sm border-0">
        <form onSubmit={handleLogin}>
          <CardContent className="p-6 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                E-mail (Obrigatório)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="mateus@goldspell.com.br"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(""); // Limpa erro ao digitar
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className={`w-full h-10 ${emailError ? "border-red-500" : emailFocused ? "border-red-500" : ""
                  }`} // Borda vermelha se erro ou foco
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-black">
                Senha de acesso (Obrigatório)
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(""); // Limpa erro ao digitar
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={`w-full h-10 pr-10 ${passwordError ? "border-red-500" : passwordFocused ? "border-red-500" : ""
                    }`} // Borda vermelha se erro ou foco
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-black/90 rounded-md h-10 font-medium cursor-pointer"
            >
              {loading ? "Carregando..." : "Acessar conta"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}