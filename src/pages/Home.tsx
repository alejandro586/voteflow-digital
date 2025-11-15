import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Vote, Shield, TrendingUp } from "lucide-react";
import { hasCompletedAllVotes, getUserData } from "@/lib/storage";

const Home = () => {
  const navigate = useNavigate();
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const userData = getUserData();
    if (userData && hasCompletedAllVotes(userData.dni)) {
      setShowThanks(true);
    }
  }, []);

  const handleStartVoting = () => {
    navigate("/dni");
  };

  if (showThanks) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center shadow-card animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Vote className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            ¡Gracias por Votar!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Tu participación democrática ha sido registrada exitosamente. 
            Tus votos contribuyen al futuro de nuestra nación.
          </p>
          <Button onClick={() => navigate("/dni")} className="gradient-hero shadow-soft">
            Volver al Inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-8 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-card">
            <Vote className="w-14 h-14 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            VotoDigital
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            Sistema de Votación Electrónica Seguro y Transparente
          </p>
          
          <Button 
            onClick={handleStartVoting}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-soft text-lg px-8 py-6 rounded-xl transition-smooth hover:scale-105"
          >
            <Vote className="mr-2 h-5 w-5" />
            Iniciar Votación
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Seguro</h3>
            <p className="text-muted-foreground">
              Sistema protegido con encriptación de última generación
            </p>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth">
            <Vote className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Simple</h3>
            <p className="text-muted-foreground">
              Interfaz intuitiva para una experiencia de votación fluida
            </p>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Transparente</h3>
            <p className="text-muted-foreground">
              Resultados en tiempo real con total trazabilidad
            </p>
          </Card>
        </div>

        {/* News Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-white/95 backdrop-blur shadow-card">
            <h2 className="text-2xl font-heading font-bold mb-6 text-center">Noticias Destacadas</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold text-lg">El Comercio</p>
                <p className="text-muted-foreground">
                  "VotoDigital revoluciona el sistema electoral peruano con tecnología de punta"
                </p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <p className="font-semibold text-lg">Belaúnde Digital</p>
                <p className="text-muted-foreground">
                  "Participación récord en las últimas elecciones gracias a plataformas digitales"
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
