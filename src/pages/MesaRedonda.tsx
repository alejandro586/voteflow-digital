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
    <div className="min-h-screen gradient-mesa relative overflow-hidden p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-8 max-w-5xl relative z-10">
        {/* Header */}
        <Card className="p-8 mb-10 shadow-card gradient-mesa border-2 border-white/20 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/seleccion")}
                className="text-white hover:bg-white/20 h-12 w-12 rounded-xl transition-smooth hover:scale-110"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-3xl font-heading font-bold mb-2">
                  Mesa Redonda
                </h1>
                <p className="text-white/95 text-lg">
                  Vota por el partido de tu preferencia
                </p>
              </div>
            </div>
            <Vote className="w-12 h-12" />
          </div>
        </Card>

        {/* Partidos */}
        <RadioGroup value={selectedPartido} onValueChange={setSelectedPartido}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {partidosMesa.map((partido, idx) => (
              <Card
                key={partido.id}
                className={`p-8 cursor-pointer transition-all hover:shadow-card backdrop-blur-xl bg-white/95 border-2 animate-fade-in hover:scale-105 ${
                  selectedPartido === partido.id ? 'border-2 border-mesa shadow-soft' : 'border-white/20'
                }`}
                onClick={() => setSelectedPartido(partido.id)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center gap-6">
                  <RadioGroupItem value={partido.id} id={partido.id} className="self-center w-5 h-5" />
                  <Label htmlFor={partido.id} className="flex-1 cursor-pointer w-full">
                    <div className="w-28 h-28 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4 overflow-hidden shadow-soft hover:scale-110 transition-smooth">
                      <img 
                        src={partido.logo} 
                        alt={partido.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-heading font-bold">
                      {partido.partido}
                    </h3>
                  </Label>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>

        {/* Vote Button */}
        <Card className="p-8 shadow-card backdrop-blur-xl bg-white/95 border-2 border-white/20 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-semibold text-lg">
                {selectedPartido 
                  ? `Has seleccionado: ${partidosMesa.find(p => p.id === selectedPartido)?.partido}`
                  : 'Selecciona un partido para continuar'
                }
              </p>
            </div>
            <Button
              onClick={handleVote}
              disabled={!selectedPartido}
              className="gradient-mesa shadow-soft w-full sm:w-auto h-14 px-8 text-lg font-semibold hover:scale-105 transition-smooth"
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
