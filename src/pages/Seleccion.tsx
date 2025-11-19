import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserData, hasVoted, hasCompletedAllVotes, getActiveVotingCategory } from "@/lib/storage";
import { Vote, CheckCircle2, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Seleccion = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [votedPresidente, setVotedPresidente] = useState(false);
  const [votedMesa, setVotedMesa] = useState(false);
  const [votedAlcalde, setVotedAlcalde] = useState(false);

  useEffect(() => {
    const data = getUserData();
    if (!data) {
      toast.error("Sesión no válida");
      navigate("/dni");
      return;
    }

    setUserData(data);
    setVotedPresidente(hasVoted(data.dni, 'presidente'));
    setVotedMesa(hasVoted(data.dni, 'mesa'));
    setVotedAlcalde(hasVoted(data.dni, 'alcalde'));

    // Check if all votes completed
    if (hasCompletedAllVotes(data.dni)) {
      toast.success("¡Has completado todas tus votaciones!");
      setTimeout(() => navigate("/"), 3000);
    }
  }, [navigate]);

  const handleCategoryClick = (category: string) => {
    if (!userData) return;

    const activeCategory = getActiveVotingCategory();
    
    // Verificar si hay una categoría activa y si es diferente a la seleccionada
    if (activeCategory && activeCategory !== category) {
      toast.error(`Solo está habilitada la votación de ${activeCategory} en este momento`);
      return;
    }

    const dni = userData.dni;

    if (category === 'presidente' && !votedPresidente) {
      navigate('/presidentes');
    } else if (category === 'mesa' && votedPresidente && !votedMesa) {
      navigate('/mesa-redonda');
    } else if (category === 'alcalde' && votedPresidente && votedMesa && !votedAlcalde) {
      navigate('/alcaldes');
    }
  };

  if (!userData) return null;

  const activeCategory = getActiveVotingCategory();

  const categories = [
    {
      id: 'presidente',
      title: 'Presidente de la República',
      description: 'Elige al próximo presidente del Perú',
      color: 'gradient-presidente',
      icon: Vote,
      voted: votedPresidente,
      locked: false,
      isActive: !activeCategory || activeCategory === 'presidente'
    },
    {
      id: 'mesa',
      title: 'Mesa Redonda',
      description: 'Vota por el partido de tu preferencia',
      color: 'gradient-mesa',
      icon: Vote,
      voted: votedMesa,
      locked: !votedPresidente,
      isActive: !activeCategory || activeCategory === 'mesa'
    },
    {
      id: 'alcalde',
      title: 'Alcalde Distrital',
      description: `Elige al alcalde de ${userData.distrito}`,
      color: 'gradient-alcalde',
      icon: Vote,
      voted: votedAlcalde,
      locked: !votedPresidente || !votedMesa,
      isActive: !activeCategory || activeCategory === 'alcalde'
    }
  ];

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden p-4 animate-page-enter">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto py-8 max-w-6xl relative z-10">
        {/* Header */}
        <Card className="p-8 mb-10 shadow-card animate-fade-in backdrop-blur-xl bg-white/95 border-2 border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">
                {userData.nombre} {userData.apellidos}
              </h1>
              <p className="text-muted-foreground text-lg">
                DNI: <span className="font-semibold">{userData.dni}</span> • Distrito: <span className="font-semibold">{userData.distrito}</span>
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} className="hover:scale-105 transition-smooth border-2">
              Salir
            </Button>
          </div>
        </Card>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            const isClickable = !category.locked && !category.voted;

            return (
              <Card
                key={category.id}
                className={`p-8 cursor-pointer transition-all duration-300 backdrop-blur-xl bg-white/95 border-2 animate-fade-in ${
                  isClickable 
                    ? 'hover:scale-105 hover:shadow-card border-white/20 hover:border-primary/50' 
                    : 'opacity-60 border-white/10'
                } ${category.voted ? 'border-2 border-primary shadow-soft' : ''}`}
                onClick={() => isClickable && handleCategoryClick(category.id)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-20 h-20 rounded-2xl ${category.color} flex items-center justify-center mb-6 shadow-soft hover:scale-110 transition-smooth`}>
                  {category.voted ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : category.locked ? (
                    <Lock className="w-8 h-8 text-white" />
                  ) : (
                    <Icon className="w-8 h-8 text-white" />
                  )}
                </div>

                <h2 className="text-2xl font-heading font-bold mb-3">
                  {category.title}
                </h2>
                <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-base">
                  {category.voted && (
                    <span className="text-primary font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Votado
                    </span>
                  )}
                  {category.locked && (
                    <span className="text-muted-foreground font-semibold flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Bloqueado
                    </span>
                  )}
                  {!category.voted && !category.locked && (
                    <span className="text-primary font-bold flex items-center gap-2">
                      Click para votar →
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Seleccion;
