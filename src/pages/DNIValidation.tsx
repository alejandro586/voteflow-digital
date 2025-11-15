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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="max-w-md w-full p-8 shadow-card animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <IdCard className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-center mb-2">
          Validación de DNI
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Ingresa tu número de documento para continuar
        </p>

        <form onSubmit={handleValidation} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dni">Número de DNI</Label>
            <Input
              id="dni"
              type="text"
              placeholder="Ej: 12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              maxLength={8}
              className="text-lg"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-hero shadow-soft"
            disabled={dni.length !== 8 || loading}
          >
            {loading ? "Validando..." : "Continuar"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              DNI de prueba disponibles: 12345678, 87654321, 11223344, 44332211, 55667788
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DNIValidation;
