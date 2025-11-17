import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminSession, clearAdminSession, getAllVotesByCategory } from "@/lib/storage";
import { toast } from "sonner";
import { BarChart3, LogOut, Users, FileText, Database } from "lucide-react";
import ResultsTable from "@/components/admin/ResultsTable";
import MLProcessor from "@/components/admin/MLProcessor";
import VotingControl from "@/components/admin/VotingControl";

const PanelAdmin = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, presidente: 0, mesa: 0, alcalde: 0 });

  useEffect(() => {
    const session = getAdminSession();
    if (!session || session.rol !== 'admin') {
      toast.error("Acceso no autorizado");
      navigate("/admin/login");
      return;
    }

    setAdminData(session);
    calculateStats(session.distrito);
  }, [navigate]);

  const calculateStats = (distrito: string) => {
    const vPresidente = getAllVotesByCategory('presidente').filter(v => v.distrito === distrito);
    const vMesa = getAllVotesByCategory('mesa').filter(v => v.distrito === distrito);
    const vAlcalde = getAllVotesByCategory('alcalde').filter(v => v.distrito === distrito);

    setStats({
      total: vPresidente.length + vMesa.length + vAlcalde.length,
      presidente: vPresidente.length,
      mesa: vMesa.length,
      alcalde: vAlcalde.length
    });
  };

  const handleLogout = () => {
    clearAdminSession();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (!adminData) return null;

  return (
    <div className="min-h-screen bg-admin-bg text-white p-4">
      <div className="container mx-auto py-8 max-w-7xl">
        {/* Header */}
        <Card className="p-6 mb-8 bg-card/5 border-admin-primary/20 shadow-admin backdrop-blur">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-admin-primary" />
                Panel de Administrador
              </h1>
              <p className="text-admin-primary font-medium">
                {adminData.nombre} • DNI: {adminData.dni} • Distrito: {adminData.distrito}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-admin-primary/30 text-white hover:bg-admin-primary/10">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card/5 border-admin-primary/20 backdrop-blur shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-admin-primary/20">
                <Users className="w-6 h-6 text-admin-primary" />
              </div>
              <div>
                <p className="text-sm text-admin-primary">Total Votos</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/5 border-presidente/20 backdrop-blur shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-presidente/20">
                <FileText className="w-6 h-6 text-presidente" />
              </div>
              <div>
                <p className="text-sm text-presidente">Presidente</p>
                <p className="text-3xl font-bold text-white">{stats.presidente}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/5 border-mesa/20 backdrop-blur shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-mesa/20">
                <FileText className="w-6 h-6 text-mesa" />
              </div>
              <div>
                <p className="text-sm text-mesa">Mesa + Alcalde</p>
                <p className="text-3xl font-bold text-white">{stats.mesa + stats.alcalde}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/5 border border-admin-primary/20">
            <TabsTrigger value="results" className="data-[state=active]:bg-admin-primary/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="control" className="data-[state=active]:bg-admin-primary/20">
              <FileText className="w-4 h-4 mr-2" />
              Control
            </TabsTrigger>
            <TabsTrigger value="ml" className="data-[state=active]:bg-admin-primary/20">
              <Database className="w-4 h-4 mr-2" />
              ML Processor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <ResultsTable distrito={adminData.distrito} />
          </TabsContent>

          <TabsContent value="control" className="space-y-6">
            <VotingControl />
          </TabsContent>

          <TabsContent value="ml" className="space-y-6">
            <MLProcessor distrito={adminData.distrito} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PanelAdmin;
