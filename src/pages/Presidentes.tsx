import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getUserData, markAsVoted, hasVoted } from "@/lib/storage";
import { candidatosPresidente } from "@/data/mockData";
import { toast } from "sonner";
import { ArrowLeft, Vote } from "lucide-react";

const Presidentes = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = getUserData();
    if (!data) {
      navigate("/dni");
      return;
    }

    if (hasVoted(data.dni, 'presidente')) {
      toast.error("Ya has votado por presidente");
      navigate("/seleccion");
      return;
    }

    setUserData(data);
  }, [navigate]);

  const handleVote = () => {
    if (!selectedCandidate || !userData) return;

    markAsVoted(userData.dni, 'presidente', {
      candidatoId: selectedCandidate,
      distrito: userData.distrito,
      timestamp: new Date().toISOString()
    });

    toast.success("¡Voto por Presidente registrado!");
    
    setTimeout(() => {
      navigate("/seleccion");
    }, 1500);
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen gradient-presidente relative overflow-hidden p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-8 max-w-5xl relative z-10">
        {/* Header */}
        <Card className="p-8 mb-10 shadow-card gradient-presidente border-2 border-white/20 backdrop-blur-xl animate-fade-in">
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
                  Elección de Presidente
                </h1>
                <p className="text-white/95 text-lg">
                  Selecciona tu candidato preferido
                </p>
              </div>
            </div>
            <Vote className="w-12 h-12" />
          </div>
        </Card>

        {/* Candidates */}
        <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {candidatosPresidente.map((candidato, idx) => (
              <Card
                key={candidato.id}
                className={`p-8 cursor-pointer transition-all hover:shadow-card backdrop-blur-xl bg-white/95 border-2 animate-fade-in hover:scale-105 ${
                  selectedCandidate === candidato.id ? 'border-2 border-presidente shadow-soft' : 'border-white/20'
                }`}
                onClick={() => setSelectedCandidate(candidato.id)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <RadioGroupItem value={candidato.id} id={candidato.id} className="mt-2 w-5 h-5" />
                  <Label htmlFor={candidato.id} className="flex-1 cursor-pointer">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden shadow-soft hover:scale-110 transition-smooth">
                        <img 
                          src={candidato.foto} 
                          alt={candidato.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold mb-2">
                          {candidato.nombre}
                        </h3>
                        <p className="text-base text-muted-foreground">
                          {candidato.partido}
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
        <Card className="p-8 shadow-card backdrop-blur-xl bg-white/95 border-2 border-white/20 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-semibold text-lg">
                {selectedCandidate 
                  ? `Has seleccionado: ${candidatosPresidente.find(c => c.id === selectedCandidate)?.nombre}`
                  : 'Selecciona un candidato para continuar'
                }
              </p>
            </div>
            <Button
              onClick={handleVote}
              disabled={!selectedCandidate}
              className="gradient-presidente shadow-soft w-full sm:w-auto h-14 px-8 text-lg font-semibold hover:scale-105 transition-smooth"
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

export default Presidentes;
