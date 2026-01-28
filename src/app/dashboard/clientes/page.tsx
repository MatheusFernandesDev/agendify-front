"use client";

import { useEffect, useState } from "react";
import { Search, CalendarDays, MapPin, Clock, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatters";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/auth";

export default function ClientsPage() {
  const {
    loading,
    clients,
    pagination,
    fetchClients,
    refreshClients,
    toggleClientStatus,
    updateClientPermissions
  } = useUser();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    title: string;
    description: string;
    variant: "default" | "danger" | "success";
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, [currentPage, searchTerm, selectedDate]);

  const loadClients = () => {
    fetchClients({
      page: currentPage,
      limit: 10,
      search: searchTerm,
    });
  };

  const handleToggleStatus = (client: User) => {
    setConfirmModalConfig({
      title: client.isActive ? "Desativar Cliente" : "Ativar Cliente",
      description: client.isActive
        ? `Tem certeza que deseja desativar ${client.name} ${client.surname}? O cliente não poderá mais acessar o sistema.`
        : `Tem certeza que deseja ativar ${client.name} ${client.surname}?`,
      variant: client.isActive ? "danger" : "success",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await toggleClientStatus(client.id);
          setConfirmModalOpen(false);
        } finally {
          setActionLoading(false);
        }
      },
    });
    setConfirmModalOpen(true);
  };

  const handleTogglePermission = (
    client: User,
    permissionType: 'appointments' | 'logs',
    currentValue: boolean
  ) => {
    const permissionName = permissionType === 'appointments' ? 'Agendamentos' : 'Logs';

    setConfirmModalConfig({
      title: currentValue ? `Remover Permissão de ${permissionName}` : `Conceder Permissão de ${permissionName}`,
      description: currentValue
        ? `Remover a permissão de ${permissionName} de ${client.name} ${client.surname}?`
        : `Conceder a permissão de ${permissionName} para ${client.name} ${client.surname}?`,
      variant: currentValue ? "danger" : "success",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const newPermissions = {
            ...client.permissions,
            [permissionType]: !currentValue
          };
          await updateClientPermissions(client.id, newPermissions);
          setConfirmModalOpen(false);
        } finally {
          setActionLoading(false);
        }
      },
    });
    setConfirmModalOpen(true);
  };

  const handleRefresh = () => {
    refreshClients();
  };

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
            <h1 className="text-3xl font-bold text-black mb-2 font-montserrat">Clientes</h1>
            <p className="text-base text-gray-600">
              Overview de todos os clientes
            </p>
          </div>
        </div>

        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-4 md:p-8 flex flex-col flex-1">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6 md:mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Filtre por nome"
                  className="pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Input
                placeholder="Selecione"
                className="h-11 w-full md:w-48"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0"
                title="Atualizar"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>

            {/* Tabela */}
            {loading ? (
              <LoadingSpinner />
            ) : clients.length === 0 ? (
              <EmptyState
                title="Nenhum cliente encontrado"
                description="Ainda não há clientes cadastrados"
              />
            ) : (
              <>
                <DataTable
                  columns={["Data de cadastro", "Nome", "Endereço", "Permissões", "Status"]}
                  data={clients}
                  renderRow={(client: User) => (
                    <>
                      <td className="py-4 px-4 text-[#000000] font-medium">
                        {formatDateTime(client.createdAt)}
                      </td>

                      <td className="py-4 px-4 text-[#000000]">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {client.name} {client.surname}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {client.role}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[#000000] text-sm">
                        {client.address}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleTogglePermission(
                              client,
                              'appointments',
                              client.permissions.appointments
                            )}
                            className={cn(
                              "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                              client.permissions.appointments
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-[#F6F4F1] border border-[#D7D7D7] text-[#4A4A4A] hover:bg-gray-200"
                            )}
                          >
                            Agendamentos
                          </button>
                          <button
                            onClick={() => handleTogglePermission(
                              client,
                              'logs',
                              client.permissions.logs
                            )}
                            className={cn(
                              "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                              client.permissions.logs
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-[#F6F4F1] border border-[#D7D7D7] text-[#4A4A4A] hover:bg-gray-200"
                            )}
                          >
                            Logs
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(client)}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-colors cursor-pointer",
                            client.isActive ? "bg-black" : "bg-gray-300"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                            client.isActive ? "right-1" : "left-1"
                          )} />
                        </button>
                      </td>
                    </>
                  )}
                  renderMobileCard={(client: User) => (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-base">
                            {client.name} {client.surname}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{client.role}</p>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(client)}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-colors",
                            client.isActive ? "bg-black" : "bg-gray-300"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                            client.isActive ? "right-1" : "left-1"
                          )} />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="mt-0.5 shrink-0" />
                          <span>{client.address}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleTogglePermission(
                            client,
                            'appointments',
                            client.permissions.appointments
                          )}
                          className={cn(
                            "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                            client.permissions.appointments
                              ? "bg-black text-white"
                              : "bg-[#F6F4F1] border border-[#D7D7D7] text-[#4A4A4A]"
                          )}
                        >
                          Agendamentos
                        </button>
                        <button
                          onClick={() => handleTogglePermission(
                            client,
                            'logs',
                            client.permissions.logs
                          )}
                          className={cn(
                            "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                            client.permissions.logs
                              ? "bg-black text-white"
                              : "bg-[#F6F4F1] border border-[#D7D7D7] text-[#4A4A4A]"
                          )}
                        >
                          Logs
                        </button>
                      </div>

                      <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-3 py-1.5 text-xs font-medium text-[#4A4A4A]">
                        <Clock size={14} />
                        <span>{formatDateTime(client.createdAt)}</span>
                      </div>
                    </div>
                  )}
                />

                {/* Paginação */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-8 h-8",
                              currentPage === page && "bg-black text-white"
                            )}
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={currentPage === pagination.totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação */}
      {confirmModalConfig && (
        <ConfirmationModal
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={confirmModalConfig.onConfirm}
          title={confirmModalConfig.title}
          description={confirmModalConfig.description}
          variant={confirmModalConfig.variant}
          loading={actionLoading}
          confirmText="Confirmar"
          cancelText="Cancelar"
        />
      )}
    </DashboardLayout>
  );
}