"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Calendar as CalendarIcon, BookOpen, User, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { useLogs } from "@/hooks/useLogs";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatters";
import { Log } from "@/types/log";
import { Button } from "@/components/ui/button";

export default function LogsPage() {
  const { user } = useAuth();
  const { logs, loading, pagination, fetchLogs } = useLogs();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isAdmin = user?.role === "ADMIN";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadLogs();
  }, [currentPage, searchTerm]);

  const loadLogs = () => {
    fetchLogs({
      page: currentPage,
      limit: 10,
      search: searchTerm,
    });
  };

  // Função para mapear entity para nome do módulo
  const getModuleName = (entity: string) => {
    const moduleMap: Record<string, string> = {
      user: "Minha Conta",
      appointment: "Agendamento",
    };
    return moduleMap[entity?.toLowerCase()] || entity;
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
            <h1 className="text-3xl font-bold text-black mb-2 font-montserrat">Logs</h1>
            <p className="text-base text-gray-600">
              {isAdmin ? "Acompanhe todos as Logs de clientes" : "Acompanhe todos as suas Logs"}
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
                  placeholder={isAdmin ? "Filtre por cliente, tipo de atividade ou Módulo" : "Filtre por tipo de atividade ou Módulo"}
                  className="pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input placeholder="Selecione" className="pr-10 h-11 w-48" type="date" />
              </div>
            </div>

            {/* Tabela */}
            {loading ? (
              <LoadingSpinner />
            ) : logs.length === 0 ? (
              <EmptyState
                title="Nenhum log encontrado"
                description="Ainda não há atividades registradas"
              />
            ) : (
              <>
                {isAdmin ? (
                  // TABELA ADMIN: Cliente, Tipo de atividade, Módulo, Data e horário
                  <DataTable
                    columns={["Cliente", "Tipo de atividade", "Módulo", "Data e horário"]}
                    data={logs}
                    renderRow={(log: Log) => (
                      <>
                        {/* Cliente */}
                        <td className="py-4 px-4 text-[#000000]">
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {log.user.name} {log.user.surname}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {log.user.role}
                            </span>
                          </div>
                        </td>

                        {/* Tipo de atividade */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center justify-center bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-4 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.description}
                          </div>
                        </td>

                        {/* Módulo */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-4 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.entity === "appointment" ? (
                              <Calendar size={14} />
                            ) : (
                              <User size={14} />
                            )}
                            <span>{getModuleName(log.entity)}</span>
                          </div>
                        </td>

                        {/* Data e horário */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-4 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            <span>{formatDateTime(log.createdAt)}</span>
                          </div>
                        </td>
                      </>
                    )}
                    renderMobileCard={(log: Log) => (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-base">
                              {log.user.name} {log.user.surname}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{log.user.role}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <div className="inline-flex items-center justify-center bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-3 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.description}
                          </div>

                          <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-3 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.entity === "appointment" ? (
                              <Calendar size={14} />
                            ) : (
                              <User size={14} />
                            )}
                            <span>{getModuleName(log.entity)}</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-3 py-1.5 text-xs font-medium text-[#4A4A4A]">
                          <Clock size={14} />
                          <span>{formatDateTime(log.createdAt)}</span>
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  // TABELA CLIENTE: Tipo de atividade, Módulo, Data e horário
                  <DataTable
                    columns={["Tipo de atividade", "Módulo", "Data e horário"]}
                    data={logs}
                    renderRow={(log: Log) => (
                      <>
                        {/* Tipo de atividade */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center justify-center bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-4 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.description}
                          </div>
                        </td>

                        {/* Módulo */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-4 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.entity === "appointment" ? (
                              <Calendar size={14} />
                            ) : (
                              <User size={14} />
                            )}
                            <span>{getModuleName(log.entity)}</span>
                          </div>
                        </td>

                        {/* Data e horário */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-4 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            <span>{formatDateTime(log.createdAt)}</span>
                          </div>
                        </td>
                      </>
                    )}
                    renderMobileCard={(log: Log) => (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <div className="inline-flex items-center justify-center bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-3 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.description}
                          </div>

                          <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-3 py-1.5 text-xs font-medium text-[#4A4A4A]">
                            {log.entity === "appointment" ? (
                              <Calendar size={14} />
                            ) : (
                              <User size={14} />
                            )}
                            <span>{getModuleName(log.entity)}</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 bg-[#F6F4F1] border border-[#D7D7D7] rounded-full px-3 py-1.5 text-xs font-medium text-[#4A4A4A]">
                          <Clock size={14} />
                          <span>{formatDateTime(log.createdAt)}</span>
                        </div>
                      </div>
                    )}
                  />
                )}

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
    </DashboardLayout>
  );
}