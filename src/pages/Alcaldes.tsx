import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getUserData, markAsVoted, hasVoted } from "@/lib/storage";
import { alcaldesPorDistrito } from "@/data/mockData";
import { toast } from "sonner";
import { ArrowLeft, Vote } from "lucide-react";

const Alcaldes = () => {
  const navigate = useNavigate();
  const [selectedAlcalde, setSelectedAlcalde] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [candidatos, setCandidatos] = useState<any[]>([]);

  useEffect(() => {
    const data = getUserData();
    if (!data) {
      navigate("/dni");
      return;
    }

    if (!hasVoted(data.dni, 'presidente') || !hasVoted(data.dni, 'mesa')) {
      toast.error("Debes completar las votaciones anteriores");
      navigate("/seleccion");
      return;
    }

    if (hasVoted(data.dni, 'alcalde')) {
      toast.error("Ya has votado por alcalde");
      navigate("/seleccion");
      return;
    }

    setUserData(data);
    const distritoCandidatos = alcaldesPorDistrito[data.distrito] || [];
    setCandidatos(distritoCandidatos);
  }, [navigate]);

  const handleVote = () => {
    if (!selectedAlcalde || !userData) return;

    markAsVoted(userData.dni, 'alcalde', {
      candidatoId: selectedAlcalde,
      distrito: userData.distrito,
      timestamp: new Date().toISOString()
    });

    toast.success("¡Voto por Alcalde registrado!");
    
    setTimeout(() => {
      navigate("/seleccion");
    }, 1500);
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto py-8 max-w-5xl">
        {/* Header */}
        <Card className="p-6 mb-8 shadow-card gradient-alcalde">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/seleccion")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-heading font-bold">
                  Elección de Alcalde
                </h1>
                <p className="text-white/90">
                  Candidatos para {userData.distrito}
                </p>
              </div>
            </div>
            <Vote className="w-10 h-10" />
          </div>
        </Card>

        {/* Candidatos */}
        <RadioGroup value={selectedAlcalde} onValueChange={setSelectedAlcalde}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {candidatos.map((candidato) => (
              <Card
                key={candidato.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-card ${
                  selectedAlcalde === candidato.id ? 'border-2 border-alcalde shadow-card' : ''
                }`}
                onClick={() => setSelectedAlcalde(candidato.id)}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem value={candidato.id} id={candidato.id} className="mt-1" />
                  <Label htmlFor={candidato.id} className="flex-1 cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <img 
                          src={candidato.foto} 
                          alt={candidato.nombre}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-bold mb-1">
                          {candidato.nombre}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {candidato.partido}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {candidato.distrito}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>

        {/* Vote Button */}
        <Card className="p-6 shadow-card">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">
                {selectedAlcalde 
                  ? `Has seleccionado: ${candidatos.find(c => c.id === selectedAlcalde)?.nombre}`
                  : 'Selecciona un candidato para continuar'
                }
              </p>
            </div>
            <Button
              onClick={handleVote}
              disabled={!selectedAlcalde}
              className="gradient-alcalde shadow-soft w-full sm:w-auto"
              size="lg"
            >
              Confirmar Voto
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Alcaldes;
