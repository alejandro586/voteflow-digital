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
    <Card className="p-6 bg-card shadow-card border-admin-primary/20">
      <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">Control de Votaciones</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const isDisabled = activeCategory !== null && activeCategory !== category.id;
          
          return (
            <Card
              key={category.id}
              className={`p-6 transition-all ${
                isActive 
                  ? 'border-2 border-admin-primary shadow-soft' 
                  : isDisabled 
                  ? 'opacity-50' 
                  : ''
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  {isActive && (
                    <Badge className="bg-admin-primary text-white">Activa</Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => handleToggle(category.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`w-full ${isActive ? 'gradient-admin' : 'border-admin-primary/30'}`}
                >
                  {isActive ? (
                    <>
                      <PowerOff className="w-4 h-4 mr-2" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2" />
                      Activar
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-admin-primary/10">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Nota:</strong> Solo una categoría puede estar activa a la vez. 
          Al activar una categoría, las anteriores se desactivan automáticamente para mantener el orden: 
          Presidente → Mesa Redonda → Alcalde.
        </p>
      </div>
    </Card>
  );
};

export default VotingControl;
