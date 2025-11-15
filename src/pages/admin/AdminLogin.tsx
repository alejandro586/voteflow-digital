import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminsDB } from "@/data/mockData";
import { saveAdminSession } from "@/lib/storage";
import { Shield, Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const admin = adminsDB.find(a => a.email === email && a.password === password);

    if (!admin) {
      toast.error("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    saveAdminSession(admin.email, admin.rol, admin.distrito, admin.nombre, admin.dni);
    toast.success(`Bienvenido/a ${admin.nombre}`);

    setTimeout(() => {
      if (admin.rol === 'superadmin') {
        navigate("/admin/panel_de_superadmin");
      } else {
        navigate("/admin/panel_de_admin");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-admin p-4">
      <Card className="max-w-md w-full p-8 shadow-admin animate-fade-in bg-admin-bg border-admin-primary/20">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full gradient-admin flex items-center justify-center shadow-admin">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-center mb-2 text-white">
          Panel Administrativo
        </h1>
        <p className="text-center text-admin-primary mb-8">
          Acceso exclusivo para administradores
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@votodigital.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-admin-primary/30 text-white placeholder:text-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-admin-primary/30 text-white placeholder:text-white/50"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-admin shadow-admin"
            disabled={loading}
          >
            <Lock className="mr-2 h-4 w-4" />
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-admin-primary/10 rounded-lg border border-admin-primary/20">
          <p className="text-xs text-admin-primary text-center">
            Credenciales de prueba: admin@votodigital.pe / admin123
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
