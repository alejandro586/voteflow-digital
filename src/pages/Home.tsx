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
      <div className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden p-4">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <Card className="max-w-2xl w-full p-12 md:p-16 text-center shadow-card animate-fade-in backdrop-blur-xl bg-white/95 border-2 border-white/20 relative z-10">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-primary/10 flex items-center justify-center shadow-soft hover:scale-110 transition-smooth">
            <Vote className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            ¡Gracias por Votar!
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Tu participación democrática ha sido registrada exitosamente. 
            Tus votos contribuyen al futuro de nuestra nación.
          </p>
          <Button onClick={() => navigate("/dni")} className="gradient-hero shadow-soft h-14 px-10 text-lg font-semibold hover:scale-105 transition-smooth">
            Volver al Inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <div className="w-28 h-28 mx-auto mb-8 bg-white/95 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-card hover:scale-110 transition-smooth hover:rotate-6">
            <Vote className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
            VotoDigital
          </h1>
          
          <p className="text-xl md:text-3xl text-white/95 mb-10 font-light leading-relaxed">
            Sistema de Votación Electrónica Seguro y Transparente
          </p>
          
          <Button 
            onClick={handleStartVoting}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-soft text-xl px-12 py-8 rounded-2xl transition-smooth hover:scale-105 hover:shadow-card font-semibold"
          >
            <Vote className="mr-3 h-6 w-6" />
            Iniciar Votación
          </Button>
        </div>

        {/* News Section */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-heading font-bold text-white text-center mb-12 animate-fade-in">
              Noticias de políticas relacionadas al Perú
            </h2>
            
            {/* El Comercio Card */}
            <a 
              href="https://elcomercio.pe/noticias/politica/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mb-8 group animate-fade-in"
            >
              <Card className="overflow-hidden bg-white/95 backdrop-blur-xl shadow-card hover:shadow-soft transition-smooth transform hover:scale-[1.03] border-2 border-white/20">
                <div className="relative">
                  <img 
                    src={elComercioImg} 
                    alt="El Comercio - Noticias de Política"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-3xl font-heading font-bold mb-3 flex items-center gap-2 group-hover:text-primary transition-smooth">
                        El Comercio - Política
                        <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-smooth" />
                      </h3>
                      <p className="text-white/95 text-lg">
                        Mantente informado con las últimas noticias políticas del Perú
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </a>

            {/* News Tents */}
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="p-8 bg-white/95 backdrop-blur-xl shadow-card hover:shadow-soft transition-smooth border-l-4 border-primary hover:scale-105">
                <h3 className="text-2xl font-heading font-bold mb-4 text-primary">📰 Últimas Noticias</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Cobertura completa de los acontecimientos políticos más relevantes del Perú
                </p>
              </Card>

              <Card className="p-8 bg-white/95 backdrop-blur-xl shadow-card hover:shadow-soft transition-smooth border-l-4 border-accent hover:scale-105">
                <h3 className="text-2xl font-heading font-bold mb-4 text-accent">🗳️ Análisis Electoral</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
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
