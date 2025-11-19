import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Power, PowerOff } from "lucide-react";
import { setActiveVotingCategory, getActiveVotingCategory } from "@/lib/storage";

const VotingControl = () => {
  const [activeCategory, setActiveCategoryState] = useState<'presidente' | 'mesa' | 'alcalde' | null>(getActiveVotingCategory());

  useEffect(() => {
    const category = getActiveVotingCategory();
    setActiveCategoryState(category);
  }, []);

  const handleToggle = (categoria: 'presidente' | 'mesa' | 'alcalde') => {
    if (activeCategory === categoria) {
      // Desactivar
      setActiveVotingCategory(null);
      setActiveCategoryState(null);
      toast.info(`Votación de ${categoria} desactivada`);
    } else {
      // Activar y desactivar anteriores
      setActiveVotingCategory(categoria);
      setActiveCategoryState(categoria);
      toast.success(`Votación de ${categoria} activada`);
    }
  };

  const categories = [
    { id: 'presidente' as const, name: 'Presidente', color: 'bg-presidente' },
    { id: 'mesa' as const, name: 'Mesa Redonda', color: 'bg-mesa' },
    { id: 'alcalde' as const, name: 'Alcalde', color: 'bg-alcalde' },
  ];

  return (
    <Card className="p-8 bg-card shadow-card border-admin-primary/20 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-admin-primary/10">
          <Power className="w-7 h-7 text-admin-primary" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground">Control de Votaciones</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category, idx) => {
          const isActive = activeCategory === category.id;
          const isDisabled = activeCategory !== null && activeCategory !== category.id;
          
          return (
            <Card
              key={category.id}
              className={`p-8 transition-all animate-fade-in hover:scale-105 ${
                isActive 
                  ? 'border-2 border-admin-primary shadow-soft bg-admin-primary/5' 
                  : isDisabled 
                  ? 'opacity-50' 
                  : 'border-2 border-border'
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-3">
                  <h3 className="text-xl font-semibold text-foreground text-center">{category.name}</h3>
                  {isActive && (
                    <Badge className="bg-admin-primary text-white shadow-soft px-4 py-1 text-sm">Activa</Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => handleToggle(category.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`w-full h-12 text-base font-semibold hover:scale-105 transition-smooth ${isActive ? 'gradient-admin shadow-soft' : 'border-2 border-admin-primary/30'}`}
                >
                  {isActive ? (
                    <>
                      <PowerOff className="w-5 h-5 mr-2" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <Power className="w-5 h-5 mr-2" />
                      Activar
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-admin-primary/5 to-admin-secondary/5 rounded-xl border-2 border-admin-primary/10">
        <p className="text-base text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-bold">Nota:</strong> Solo una categoría puede estar activa a la vez. 
          Al activar una categoría, las anteriores se desactivan automáticamente para mantener el orden: 
          <span className="font-semibold text-foreground"> Presidente → Mesa Redonda → Alcalde</span>.
        </p>
      </div>
    </Card>
  );
};

export default VotingControl;
