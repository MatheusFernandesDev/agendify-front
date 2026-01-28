"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/services/api";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Função para limpar dados e fazer logout
  const handleLogout = () => {
    localStorage.removeItem("@Agendify:token");
    localStorage.removeItem("@Agendify:user");
    delete api.defaults.headers.Authorization;
    setUser(null);
    router.push("/clientLogin");
  };

  useEffect(() => {
    // Configurar interceptor de resposta para capturar erros 401 (token expirado)
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Sessão expirada. Faça login novamente.", { position: "top-right" });
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = localStorage.getItem("@Agendify:token");
        const storedUser = localStorage.getItem("@Agendify:user");

        if (token && storedUser) {
          api.defaults.headers.Authorization = `Bearer ${token}`;

          // Verifica se o token ainda é válido fazendo uma requisição simples
          try {
            await api.get("/api/auth/me");
            setUser(JSON.parse(storedUser));
          } catch (err) {
            // Token inválido ou expirado
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do storage:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/login", "/clientLogin", "/cadastro"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push("/clientLogin");
    } else if (user && isPublicPath) {
      if (pathname !== "/dashboard/agendamentos") {
        router.push("/dashboard/agendamentos");
      }
    }
  }, [user, loading, pathname]);

  async function signIn({ email, password }: any) {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { data: { token, user: userData } } = response.data;

      if (!token || !userData) {
        throw new Error("Dados de login inválidos na resposta");
      }

      localStorage.setItem("@Agendify:token", token);
      localStorage.setItem("@Agendify:user", JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
      toast.success("Login efetuado com sucesso", { position: "top-right" });
      router.push("/dashboard/agendamentos");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(errorMessage, { position: "top-right" });
    }
  }

  function signOut() {
    handleLogout();
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);