import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Vote, ExternalLink } from "lucide-react";
import { hasCompletedAllVotes, getUserData } from "@/lib/storage";
import elComercioImg from "@/assets/el-comercio-newspaper.jpg";

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

        {/* News Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-white text-center mb-8">
              Noticias de políticas relacionadas al Perú
            </h2>
            
            {/* El Comercio Card */}
            <a 
              href="https://elcomercio.pe/noticias/politica/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mb-6 group"
            >
              <Card className="overflow-hidden bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth transform hover:scale-[1.02]">
                <div className="relative">
                  <img 
                    src={elComercioImg} 
                    alt="El Comercio - Noticias de Política"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-heading font-bold mb-2 flex items-center gap-2">
                        El Comercio - Política
                        <ExternalLink className="w-5 h-5" />
                      </h3>
                      <p className="text-white/90">
                        Mantente informado con las últimas noticias políticas del Perú
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </a>

            {/* News Tents */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth border-l-4 border-primary">
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">📰 Últimas Noticias</h3>
                <p className="text-muted-foreground">
                  Cobertura completa de los acontecimientos políticos más relevantes del Perú
                </p>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth border-l-4 border-accent">
                <h3 className="text-xl font-heading font-bold mb-3 text-accent">🗳️ Análisis Electoral</h3>
                <p className="text-muted-foreground">
                  Perspectivas y análisis profundo sobre el panorama político nacional
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
