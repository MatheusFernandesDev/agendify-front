"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fetchAddressByCEP } from "@/utils/helpers";
import { formatCEP, unformatCEP } from "@/utils/formatters";

export default function MinhaContaPage() {
    const { profile, loading, fetchProfile, updateProfile, updatePassword } = useUser();
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        cep: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loadingCEP, setLoadingCEP] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                surname: profile.surname || "",
                email: profile.email || "",
                cep: profile.cep || "",
                address: profile.address || "",
                number: profile.number || "",
                complement: profile.complement || "",
                neighborhood: profile.neighborhood || "",
                city: profile.city || "",
                state: profile.state || "",
            });
        }
    }, [profile]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
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

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);

        const success = await updateProfile(formData);

        if (success) {
            toast.success("Perfil atualizado com sucesso!");
        }

        setSavingProfile(false);
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("As senhas não coincidem", { position: 'top-right' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("A nova senha deve ter no mínimo 6 caracteres", { position: 'top-right' });
            return;
        }

        setSavingPassword(true);

        const success = await updatePassword(
            passwordData.oldPassword,
            passwordData.newPassword
        );

        if (success) {
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }

        setSavingPassword(false);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingSpinner />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div
                className={cn(
                    "bg-[#FFFFFF] flex-1 flex flex-col px-4 md:px-8 py-4 md:py-6 mx-auto w-full",
                    isMobile ? "mt-16" : "mt-0"
                )}
            >
                {/* Header */}
                <div className="border-b border-gray-300 mb-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-black mb-2 font-montserrat">
                            Minha conta
                        </h1>
                        <p className="text-base text-gray-600">
                            Ajuste informações da sua conta de forma simples
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto w-full space-y-6">
                    {/* Card de Informações Pessoais */}
                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <CardContent className="p-6 md:p-8">
                            <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                {/* Nome e Sobrenome */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome (Obrigatório)</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="surname">Sobrenome (Obrigatório)</Label>
                                        <Input
                                            id="surname"
                                            value={formData.surname}
                                            onChange={(e) => handleInputChange("surname", e.target.value)}
                                            required
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
                                        required
                                    />
                                </div>

                                {/* CEP */}
                                <div className="space-y-2">
                                    <Label htmlFor="cep">CEP (Obrigatório)</Label>
                                    <Input
                                        id="cep"
                                        value={formData.cep}
                                        onChange={(e) => handleInputChange("cep", e.target.value)}
                                        onBlur={handleCEPBlur}
                                        placeholder="00000-000"
                                        maxLength={9}
                                        disabled={loadingCEP}
                                    />
                                </div>

                                {/* Endereço */}
                                <div className="space-y-2">
                                    <Label htmlFor="address">Endereço</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        disabled={loadingCEP}
                                    />
                                </div>

                                {/* Número e Complemento */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="number">Número</Label>
                                        <Input
                                            id="number"
                                            value={formData.number}
                                            onChange={(e) => handleInputChange("number", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="complement">Complemento</Label>
                                        <Input
                                            id="complement"
                                            value={formData.complement}
                                            onChange={(e) => handleInputChange("complement", e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Bairro */}
                                <div className="space-y-2">
                                    <Label htmlFor="neighborhood">Bairro</Label>
                                    <Input
                                        id="neighborhood"
                                        value={formData.neighborhood}
                                        onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                                        disabled={loadingCEP}
                                    />
                                </div>

                                {/* Cidade e Estado */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Cidade</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange("city", e.target.value)}
                                            disabled={loadingCEP}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">Estado</Label>
                                        <Input
                                            id="state"
                                            value={formData.state}
                                            onChange={(e) => handleInputChange("state", e.target.value)}
                                            disabled={loadingCEP}
                                        />
                                    </div>
                                </div>

                                {/* Botão Salvar */}
                                <Button
                                    type="submit"
                                    className="w-full bg-black hover:bg-gray-800"
                                    disabled={savingProfile || loadingCEP}
                                >
                                    {savingProfile ? "Salvando..." : "Salvar"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Card de Alterar Senha */}
                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <CardContent className="p-6 md:p-8">
                            <h2 className="text-xl font-semibold mb-6">Alterar Senha</h2>

                            <form onSubmit={handleSavePassword} className="space-y-4">
                                {/* Senha Atual */}
                                <div className="space-y-2">
                                    <Label htmlFor="oldPassword">Senha Atual (Obrigatório)</Label>
                                    <Input
                                        id="oldPassword"
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Nova Senha */}
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Nova Senha (Obrigatório)</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Confirmar Nova Senha */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nova Senha (Obrigatório)</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Botão Alterar Senha */}
                                <Button
                                    type="submit"
                                    className="w-full bg-black hover:bg-gray-800"
                                    disabled={savingPassword}
                                >
                                    {savingPassword ? "Alterando..." : "Alterar Senha"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}