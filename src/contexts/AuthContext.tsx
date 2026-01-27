"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/services/api";
import { toast } from "sonner"

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

  useEffect(() => {
    function loadStorageData() {
      const token = localStorage.getItem("@Agendify:token");
      const storedUser = localStorage.getItem("@Agendify:user");

      if (token && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      }
      // Seta loading como false somente APÓS checar o storage
      setLoading(false);
    }

    loadStorageData();
  }, []);

  useEffect(() => {
    // Se ainda está carregando o localStorage, não faz nada
    if (loading) return;

    const publicPaths = ["/login", "/clientLogin", "/cadastro"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push("/clientLogin");
    } else if (user && isPublicPath) {
      // Evita loop se já estiver no dashboard
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
      const errorMessage = err.response?.data?.message || "Erro desconhecido no login. Tente novamente.";
      toast.error(errorMessage, { position: "top-right" });
    }
  }

  function signOut() {
    localStorage.removeItem("@Agendify:token");
    localStorage.removeItem("@Agendify:user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);