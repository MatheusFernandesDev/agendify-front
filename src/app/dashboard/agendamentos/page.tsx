"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Settings, X, Check, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { AppointmentModal } from "@/components/AppointmentModal";
import { AppointmentSettingsModal } from "@/components/AppointmentSettingsModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";
import { Appointment } from "@/types/appointment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AgendamentosPage() {
  const { user } = useAuth();
  const {
    appointments,
    loading,
    pagination,
    fetchAppointments,
    createAppointment,
    cancelAppointment,
    confirmAppointment,
    refreshAppointments,
  } = useAppointments();

  const [modalOpen, setModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    title: string;
    description: string;
    variant: "default" | "danger" | "success";
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    loadAppointments();
  }, [currentPage, statusFilter, searchTerm, dateFilter]);

  const loadAppointments = () => {
    fetchAppointments({
      page: currentPage,
      limit: 10,
      status: statusFilter === "all" ? undefined : statusFilter as any,
      search: searchTerm,
      date: dateFilter,
    });
  };

  const handleCreateAppointment = async (data: any) => {
    const result = await createAppointment(data);
    if (result) {
      setModalOpen(false);
    }
  };

  const handleCancelAppointment = (id: string, appointmentName: string) => {
    setConfirmModalConfig({
      title: isAdmin ? "Recusar Agendamento" : "Cancelar Agendamento",
      description: isAdmin
        ? `Tem certeza que deseja recusar o agendamento de ${appointmentName}?`
        : `Tem certeza que deseja cancelar este agendamento?`,
      variant: "danger",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await cancelAppointment(id);
          setConfirmModalOpen(false);
        } finally {
          setActionLoading(false);
        }
      },
    });
    setConfirmModalOpen(true);
  };

  const handleConfirmAppointment = (id: string, appointmentName: string) => {
    setConfirmModalConfig({
      title: "Aprovar Agendamento",
      description: `Confirmar o agendamento de ${appointmentName}?`,
      variant: "success",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await confirmAppointment(id);
          setConfirmModalOpen(false);
        } finally {
          setActionLoading(false);
        }
      },
    });
    setConfirmModalOpen(true);
  };

  const handleSaveSettings = async (rooms: any[]) => {
    console.log("Salvando configurações:", rooms);
  };

  const handleRefresh = () => {
    refreshAppointments();
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
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2 font-montserrat">
                Agendamento{isAdmin ? "s" : ""}
              </h1>
              <p className="text-base text-gray-600">
                Acompanhe todos os {isAdmin ? "agendamentos de clientes" : "seus agendamentos"} de forma simples
              </p>
            </div>

            <div className="hidden md:block">
              {isAdmin ? (
                <Button
                  onClick={() => setSettingsModalOpen(true)}
                  className="bg-black hover:bg-gray-800 h-11 px-6"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Ajustes de agendamento
                </Button>
              ) : (
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-black hover:bg-gray-800 h-11 px-6"
                >
                  Novo Agendamento
                </Button>
              )}
            </div>
          </div>
        </div>

        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-4 md:p-8 flex flex-col flex-1">
            {/* Filtros */}
            <div className="flex flex-col gap-4 mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
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
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 w-full md:w-48">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="analise">Em análise</SelectItem>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>

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

              <div className="md:hidden">
                {isAdmin ? (
                  <Button
                    onClick={() => setSettingsModalOpen(true)}
                    className="bg-black hover:bg-gray-800 h-11 w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Ajustes de agendamento
                  </Button>
                ) : (
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="bg-black hover:bg-gray-800 h-11 w-full"
                  >
                    Novo Agendamento
                  </Button>
                )}
              </div>
            </div>

            {/* Tabela */}
            {loading ? (
              <LoadingSpinner />
            ) : appointments.length === 0 ? (
              <EmptyState
                title="Nada por aqui ainda..."
                description={isAdmin ? "Nenhum agendamento encontrado" : "Crie seu primeiro agendamento"}
              />
            ) : (
              <>
                <DataTable
                  columns={["Data e hora", "Nome", "Sala de agendamento", "Status", "Ação"]}
                  data={appointments}
                  renderRow={(appointment: Appointment) => (
                    <>
                      <td className="py-4 px-4 text-[#000000] font-medium">
                        {formatDate(appointment.date)} às {appointment.time}
                      </td>

                      <td className="py-4 px-4 text-[#000000]">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {appointment.user?.name} {appointment.user?.surname}
                          </span>
                          <span className="text-xs text-gray-500">Cliente</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="inline-flex items-center bg-black text-white rounded-full px-4 py-1.5 text-xs font-medium">
                          {appointment.room}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={appointment.status} />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isAdmin ? (
                            <>
                              {appointment.status === "analise" && (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleConfirmAppointment(
                                      appointment.id,
                                      `${appointment.user?.name} ${appointment.user?.surname}`
                                    )}
                                    className="h-8 w-8 rounded-full bg-green-100 hover:bg-green-200"
                                    title="Aprovar"
                                  >
                                    <Check className="h-4 w-4 text-green-700" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleCancelAppointment(
                                      appointment.id,
                                      `${appointment.user?.name} ${appointment.user?.surname}`
                                    )}
                                    className="h-8 w-8 rounded-full bg-red-100 hover:bg-red-200"
                                    title="Recusar"
                                  >
                                    <X className="h-4 w-4 text-red-700" />
                                  </Button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {appointment.status !== "cancelado" && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleCancelAppointment(
                                    appointment.id,
                                    ""
                                  )}
                                  className="h-8 w-8 rounded-full bg-black hover:bg-gray-800"
                                  title="Cancelar"
                                >
                                  <X className="h-4 w-4 text-white" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                  renderMobileCard={(appointment: Appointment) => (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-base">
                            {appointment.user?.name} {appointment.user?.surname}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)} às {appointment.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center bg-black text-white rounded-full px-3 py-1.5 text-xs font-medium">
                          {appointment.room}
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        {isAdmin ? (
                          appointment.status === "analise" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleConfirmAppointment(
                                  appointment.id,
                                  `${appointment.user?.name} ${appointment.user?.surname}`
                                )}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelAppointment(
                                  appointment.id,
                                  `${appointment.user?.name} ${appointment.user?.surname}`
                                )}
                              >
                                Recusar
                              </Button>
                            </>
                          )
                        ) : (
                          appointment.status !== "cancelado" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelAppointment(appointment.id, "")}
                            >
                              Cancelar
                            </Button>
                          )
                        )}
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

      {/* Modals */}
      {!isAdmin && (
        <AppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateAppointment}
        />
      )}

      {isAdmin && (
        <AppointmentSettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          onSave={handleSaveSettings}
        />
      )}

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