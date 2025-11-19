import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { votantesDB } from "@/data/mockData";
import { saveUserData, hasCompletedAllVotes } from "@/lib/storage";
import { IdCard, AlertCircle } from "lucide-react";

const DNIValidation = () => {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Admin redirect
    if (dni === "60432205") {
      setTimeout(() => {
        navigate("/admin/login");
      }, 500);
      return;
    }

    // Validate votante
    const votante = votantesDB.find(v => v.dni === dni);
    
    if (!votante) {
      toast.error("DNI no encontrado en el padrón electoral");
      setLoading(false);
      return;
    }

    // Check if already voted
    if (hasCompletedAllVotes(dni)) {
      toast.error("Ya has completado tu votación");
      setTimeout(() => {
        navigate("/");
      }, 3000);
      setLoading(false);
      return;
    }

    // Save user data and redirect
    saveUserData({
      dni: votante.dni,
      nombre: votante.nombre,
      apellidos: votante.apellidos,
      distrito: votante.distrito
    });

    toast.success(`Bienvenido/a ${votante.nombre} ${votante.apellidos}`);
    
    setTimeout(() => {
      navigate("/seleccion");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden p-4 animate-page-enter">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="max-w-md w-full p-10 shadow-card animate-fade-in backdrop-blur-xl bg-white/95 border-2 border-white/20 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center shadow-soft hover:scale-110 transition-smooth">
            <IdCard className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-heading font-bold text-center mb-3">
          Validación de DNI
        </h1>
        <p className="text-center text-muted-foreground mb-10 text-lg">
          Ingresa tu número de documento para continuar
        </p>

        <form onSubmit={handleValidation} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="dni" className="text-base font-semibold">Número de DNI</Label>
            <Input
              id="dni"
              type="text"
              placeholder="Ej: 12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              maxLength={8}
              className="text-xl h-14 border-2 focus:border-primary transition-smooth"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-hero shadow-soft h-14 text-lg font-semibold hover:scale-105 transition-smooth"
            disabled={dni.length !== 8 || loading}
          >
            {loading ? "Validando..." : "Continuar"}
          </Button>
        </form>

        <div className="mt-8 p-5 bg-primary/5 rounded-xl border-2 border-primary/10">
          <div className="flex gap-3 text-sm text-muted-foreground">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
            <p className="leading-relaxed">
              <span className="font-semibold text-foreground">DNI de prueba disponibles:</span> 12345678, 87654321, 11223344, 44332211, 55667788
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DNIValidation;
