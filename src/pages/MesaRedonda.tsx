import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getUserData, markAsVoted, hasVoted } from "@/lib/storage";
import { partidosMesa } from "@/data/mockData";
import { toast } from "sonner";
import { ArrowLeft, Vote } from "lucide-react";

const MesaRedonda = () => {
  const navigate = useNavigate();
  const [selectedPartido, setSelectedPartido] = useState("");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = getUserData();
    if (!data) {
      navigate("/dni");
      return;
    }

    if (!hasVoted(data.dni, 'presidente')) {
      toast.error("Debes votar por presidente primero");
      navigate("/seleccion");
      return;
    }

    if (hasVoted(data.dni, 'mesa')) {
      toast.error("Ya has votado en Mesa Redonda");
      navigate("/seleccion");
      return;
    }

    setUserData(data);
  }, [navigate]);

  const handleVote = () => {
    if (!selectedPartido || !userData) return;

    markAsVoted(userData.dni, 'mesa', {
      candidatoId: selectedPartido,
      distrito: userData.distrito,
      timestamp: new Date().toISOString()
    });

    toast.success("¡Voto en Mesa Redonda registrado!");
    
    setTimeout(() => {
      navigate("/seleccion");
    }, 1500);
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto py-8 max-w-5xl">
        {/* Header */}
        <Card className="p-6 mb-8 shadow-card gradient-mesa">
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
                  Mesa Redonda
                </h1>
                <p className="text-white/90">
                  Vota por el partido de tu preferencia
                </p>
              </div>
            </div>
            <Vote className="w-10 h-10" />
          </div>
        </Card>

        {/* Partidos */}
        <RadioGroup value={selectedPartido} onValueChange={setSelectedPartido}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {partidosMesa.map((partido) => (
              <Card
                key={partido.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-card ${
                  selectedPartido === partido.id ? 'border-2 border-mesa shadow-card' : ''
                }`}
                onClick={() => setSelectedPartido(partido.id)}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <RadioGroupItem value={partido.id} id={partido.id} className="self-start" />
                  <Label htmlFor={partido.id} className="flex-1 cursor-pointer w-full">
                    <div className="w-24 h-24 mx-auto rounded-lg bg-muted flex items-center justify-center mb-3">
                      <img 
                        src={partido.logo} 
                        alt={partido.nombre}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-heading font-bold">
                      {partido.partido}
                    </h3>
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
                {selectedPartido 
                  ? `Has seleccionado: ${partidosMesa.find(p => p.id === selectedPartido)?.partido}`
                  : 'Selecciona un partido para continuar'
                }
              </p>
            </div>
            <Button
              onClick={handleVote}
              disabled={!selectedPartido}
              className="gradient-mesa shadow-soft w-full sm:w-auto"
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

export default MesaRedonda;
