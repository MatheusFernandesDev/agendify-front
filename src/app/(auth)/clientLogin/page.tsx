"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { isValidEmail } from "@/utils/validators";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            toast.error("Email inválido");
            return;
        }

        if (!password || password.length < 6) {
            toast.error("Senha deve ter no mínimo 6 caracteres");
            return;
        }

        try {
            setLoading(true);
            await signIn({ email, password });
        } catch (error) {
            // Erro já tratado no AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F4F1] flex flex-col">
            {/* Header */}
            <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-300 bg-white">
                <Image src="/images/Logo.svg" alt="Logo" width={58} height={58} priority />
                <Link href="/cadastro">
                    <Button className="bg-black hover:bg-gray-800">Cadastre-se</Button>
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">Entre na sua conta</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail (Obrigatório)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="mateus@goldspell.com.br"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Senha */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha de acesso (Obrigatório)</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••••"
                                    required
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botão */}
                        <Button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800"
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Acessar conta"}
                        </Button>

                        {/* Link Cadastro */}
                        <p className="text-center text-sm text-gray-600">
                            Ainda não tem um cadastro?{" "}
                            <Link href="/cadastro" className="font-semibold text-black underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}