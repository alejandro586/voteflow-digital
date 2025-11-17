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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto py-8 max-w-6xl">
        {/* Header */}
        <Card className="p-6 mb-8 shadow-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold">
                {userData.nombre} {userData.apellidos}
              </h1>
              <p className="text-muted-foreground">
                DNI: {userData.dni} • Distrito: {userData.distrito}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Salir
            </Button>
          </div>
        </Card>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isClickable = !category.locked && !category.voted;

            return (
              <Card
                key={category.id}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  isClickable 
                    ? 'hover:scale-105 hover:shadow-card' 
                    : 'opacity-60'
                } ${category.voted ? 'border-2 border-primary' : ''}`}
                onClick={() => isClickable && handleCategoryClick(category.id)}
              >
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4`}>
                  {category.voted ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : category.locked ? (
                    <Lock className="w-8 h-8 text-white" />
                  ) : (
                    <Icon className="w-8 h-8 text-white" />
                  )}
                </div>

                <h2 className="text-xl font-heading font-bold mb-2">
                  {category.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  {category.voted && (
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Votado
                    </span>
                  )}
                  {category.locked && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      Bloqueado
                    </span>
                  )}
                  {!category.voted && !category.locked && (
                    <span className="text-primary font-semibold">
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
