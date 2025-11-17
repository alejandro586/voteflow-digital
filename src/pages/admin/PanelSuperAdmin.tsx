import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminSession, clearAdminSession, getAllVotesByCategory, resetAllVotes } from "@/lib/storage";
import { distritos } from "@/data/mockData";
import { toast } from "sonner";
import { Crown, LogOut, Users, Trash2, BarChart3, Database } from "lucide-react";
import ResultsTable from "@/components/admin/ResultsTable";
import MLProcessor from "@/components/admin/MLProcessor";
import VotingControl from "@/components/admin/VotingControl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PanelSuperAdmin = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);
  const [totalStats, setTotalStats] = useState({ total: 0, presidente: 0, mesa: 0, alcalde: 0 });

  useEffect(() => {
    const session = getAdminSession();
    if (!session || session.rol !== 'superadmin') {
      toast.error("Acceso no autorizado");
      navigate("/admin/login");
      return;
    }

    setAdminData(session);
    calculateTotalStats();
  }, [navigate]);

  const calculateTotalStats = () => {
    const vPresidente = getAllVotesByCategory('presidente');
    const vMesa = getAllVotesByCategory('mesa');
    const vAlcalde = getAllVotesByCategory('alcalde');

    setTotalStats({
      total: vPresidente.length + vMesa.length + vAlcalde.length,
      presidente: vPresidente.length,
      mesa: vMesa.length,
      alcalde: vAlcalde.length
    });
  };

  const getStatsByDistrito = (distrito: string) => {
    const vPresidente = getAllVotesByCategory('presidente').filter(v => v.distrito === distrito);
    const vMesa = getAllVotesByCategory('mesa').filter(v => v.distrito === distrito);
    const vAlcalde = getAllVotesByCategory('alcalde').filter(v => v.distrito === distrito);

    return {
      total: vPresidente.length + vMesa.length + vAlcalde.length,
      presidente: vPresidente.length,
      mesa: vMesa.length,
      alcalde: vAlcalde.length
    };
  };

  const handleLogout = () => {
    clearAdminSession();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const handleResetVotes = () => {
    resetAllVotes();
    toast.success("Todos los votos han sido eliminados");
    calculateTotalStats();
  };

  if (!adminData) return null;

  return (
    <div className="min-h-screen gradient-admin p-4">
      <div className="container mx-auto py-8 max-w-7xl">
        {/* Header */}
        <Card className="p-6 mb-8 bg-destructive/90 border-none shadow-admin backdrop-blur">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white flex items-center gap-3">
                <Crown className="w-10 h-10" />
                Panel Super Administrador
              </h1>
              <p className="text-white/90 text-lg font-medium mt-1">
                {adminData.nombre} • Vista Nacional Completa
              </p>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset Votos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos los votos registrados en el sistema. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetVotes} className="bg-destructive">
                      Confirmar Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button onClick={handleLogout} variant="outline" className="border-white text-white hover:bg-white hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Card>

        {/* National Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg gradient-hero shadow-soft">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Nacional</p>
                <p className="text-4xl font-bold">{totalStats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg gradient-presidente shadow-soft">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Presidente</p>
                <p className="text-4xl font-bold text-presidente">{totalStats.presidente}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg gradient-mesa shadow-soft">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mesa Redonda</p>
                <p className="text-4xl font-bold text-mesa">{totalStats.mesa}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur shadow-card hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg gradient-alcalde shadow-soft">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alcalde</p>
                <p className="text-4xl font-bold text-alcalde">{totalStats.alcalde}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/95 backdrop-blur border border-muted">
            <TabsTrigger value="results" className="data-[state=active]:bg-primary/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="districts" className="data-[state=active]:bg-primary/10">
              <Users className="w-4 h-4 mr-2" />
              Distritos
            </TabsTrigger>
            <TabsTrigger value="control" className="data-[state=active]:bg-primary/10">
              <Crown className="w-4 h-4 mr-2" />
              Control
            </TabsTrigger>
            <TabsTrigger value="ml" className="data-[state=active]:bg-primary/10">
              <Database className="w-4 h-4 mr-2" />
              ML Processor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <ResultsTable distrito={null} />
          </TabsContent>

          <TabsContent value="districts" className="space-y-6">
            <Card className="p-6 bg-white/95 backdrop-blur shadow-card">
              <h2 className="text-2xl font-heading font-bold mb-6">Estadísticas por Distrito</h2>
              <div className="space-y-4">
                {distritos.map(distrito => {
                  const stats = getStatsByDistrito(distrito);
                  return (
                    <Card key={distrito} className="p-4 bg-secondary/50 hover:bg-secondary/70 transition-smooth">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-heading font-semibold">{distrito}</h3>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-bold">{stats.total}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pres: </span>
                            <span className="font-bold text-presidente">{stats.presidente}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Mesa: </span>
                            <span className="font-bold text-mesa">{stats.mesa}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Alc: </span>
                            <span className="font-bold text-alcalde">{stats.alcalde}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="control" className="space-y-6">
            <VotingControl />
          </TabsContent>

          <TabsContent value="ml" className="space-y-6">
            <MLProcessor distrito={null} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PanelSuperAdmin;
