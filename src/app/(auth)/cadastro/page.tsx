"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { fetchAddressByCEP } from "@/utils/helpers";
import { isValidEmail, isValidCEP, isValidPassword } from "@/utils/validators";
import { unformatCEP } from "@/utils/formatters";
import { toast } from "sonner";

export default function CadastroPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        cep: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingCEP, setLoadingCEP] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCEPBlur = async () => {
        const cleanCEP = unformatCEP(formData.cep);

        if (cleanCEP.length === 8) {
            try {
                setLoadingCEP(true);
                const addressData = await fetchAddressByCEP(cleanCEP);

                setFormData((prev) => ({
                    ...prev,
                    address: addressData.address || prev.address,
                    neighborhood: addressData.neighborhood || prev.neighborhood,
                    city: addressData.city || prev.city,
                    state: addressData.state || prev.state,
                }));

                toast.success("CEP encontrado!");
            } catch (error) {
                toast.error("CEP não encontrado");
            } finally {
                setLoadingCEP(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações
        if (!isValidEmail(formData.email)) {
            toast.error("Email inválido");
            return;
        }

        if (!isValidPassword(formData.password)) {
            toast.error("Senha deve ter no mínimo 6 caracteres");
            return;
        }

        const cleanCEP = unformatCEP(formData.cep);
        if (!isValidCEP(cleanCEP)) {
            toast.error("CEP inválido");
            return;
        }

        try {
            setLoading(true);

            await authService.register({
                ...formData,
                cep: cleanCEP,
            });

            toast.success("Cadastro realizado com sucesso!");
            router.push("/clientLogin");
        } catch (error: any) {
            const message = error.response?.data?.message || "Erro ao realizar cadastro";
            toast.error(message, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F4F1] flex flex-col">
            {/* Header */}
            <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-300 bg-white">
                <Image src="/images/Logo.svg" alt="Logo" width={58} height={58} priority />
                <Link href="/login">
                    <Button className="bg-black hover:bg-gray-800">Login</Button>
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-4 py-8">
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">Cadastre-se</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nome e Sobrenome */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome (Obrigatório)</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="ex.: Jose"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="surname">Sobrenome (Obrigatório)</Label>
                                <Input
                                    id="surname"
                                    value={formData.surname}
                                    onChange={(e) => handleInputChange("surname", e.target.value)}
                                    placeholder="ex.: Lima"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail (Obrigatório)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Insira seu e-mail"
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
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    placeholder="Insira sua senha"
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

                        {/* CEP */}
                        <div className="space-y-2">
                            <Label htmlFor="cep">CEP (Obrigatório)</Label>
                            <Input
                                id="cep"
                                value={formData.cep}
                                onChange={(e) => handleInputChange("cep", e.target.value)}
                                onBlur={handleCEPBlur}
                                placeholder="Insira seu CEP"
                                required
                                disabled={loading || loadingCEP}
                                maxLength={9}
                            />
                        </div>

                        {/* Endereço */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                placeholder="Rua Coronel irineu de Castro"
                                disabled={loading || loadingCEP}
                            />
                        </div>

                        {/* Número */}
                        <div className="space-y-2">
                            <Label htmlFor="number">Número</Label>
                            <Input
                                id="number"
                                value={formData.number}
                                onChange={(e) => handleInputChange("number", e.target.value)}
                                placeholder="43"
                                disabled={loading}
                            />
                        </div>

                        {/* Complemento */}
                        <div className="space-y-2">
                            <Label htmlFor="complement">Complemento</Label>
                            <Input
                                id="complement"
                                value={formData.complement}
                                onChange={(e) => handleInputChange("complement", e.target.value)}
                                placeholder="Sala 1302"
                                disabled={loading}
                            />
                        </div>

                        {/* Bairro */}
                        <div className="space-y-2">
                            <Label htmlFor="neighborhood">Bairro</Label>
                            <Input
                                id="neighborhood"
                                value={formData.neighborhood}
                                onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                                placeholder="Jardim Anália Franco"
                                disabled={loading || loadingCEP}
                            />
                        </div>

                        {/* Cidade */}
                        <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                placeholder="São Paulo"
                                disabled={loading || loadingCEP}
                            />
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <Label htmlFor="state">Estado</Label>
                            <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => handleInputChange("state", e.target.value)}
                                placeholder="São Paulo"
                                disabled={loading || loadingCEP}
                            />
                        </div>

                        {/* Botão */}
                        <Button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800"
                            disabled={loading || loadingCEP}
                        >
                            {loading ? "Cadastrando..." : "Cadastrar-se"}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}