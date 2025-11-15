import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminSession, clearAdminSession, getAllVotesByCategory } from "@/lib/storage";
import { candidatosPresidente, partidosMesa, alcaldesPorDistrito } from "@/data/mockData";
import { toast } from "sonner";
import { BarChart3, LogOut, Users, FileText } from "lucide-react";

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

  const getResultsByCategory = (categoria: 'presidente' | 'mesa' | 'alcalde') => {
    if (!adminData) return [];
    
    const votes = getAllVotesByCategory(categoria).filter(v => v.distrito === adminData.distrito);
    const counts: Record<string, number> = {};
    
    votes.forEach(vote => {
      counts[vote.candidatoId] = (counts[vote.candidatoId] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count);
  };

  if (!adminData) return null;

  const presidenteResults = getResultsByCategory('presidente');
  const mesaResults = getResultsByCategory('mesa');
  const alcaldeResults = getResultsByCategory('alcalde');

  return (
    <div className="min-h-screen bg-admin-bg text-white p-4">
      <div className="container mx-auto py-8 max-w-7xl">
        {/* Header */}
        <Card className="p-6 mb-8 bg-card/5 border-admin-primary/20 shadow-admin">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-admin-primary" />
                Panel de Administrador
              </h1>
              <p className="text-admin-primary">
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card/5 border-admin-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-admin-primary/20">
                <Users className="w-6 h-6 text-admin-primary" />
              </div>
              <div>
                <p className="text-sm text-admin-primary">Total Votos</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/5 border-presidente/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-presidente/20">
                <FileText className="w-6 h-6 text-presidente" />
              </div>
              <div>
                <p className="text-sm text-presidente">Presidente</p>
                <p className="text-2xl font-bold text-white">{stats.presidente}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/5 border-mesa/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-mesa/20">
                <FileText className="w-6 h-6 text-mesa" />
              </div>
              <div>
                <p className="text-sm text-mesa">Mesa Redonda</p>
                <p className="text-2xl font-bold text-white">{stats.mesa}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/5 border-alcalde/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-alcalde/20">
                <FileText className="w-6 h-6 text-alcalde" />
              </div>
              <div>
                <p className="text-sm text-alcalde">Alcalde</p>
                <p className="text-2xl font-bold text-white">{stats.alcalde}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Presidente Results */}
          <Card className="p-6 bg-card/5 border-presidente/20">
            <h3 className="text-xl font-heading font-bold mb-4 text-presidente">
              Resultados Presidente
            </h3>
            <div className="space-y-3">
              {presidenteResults.map(result => {
                const candidato = candidatosPresidente.find(c => c.id === result.id);
                return (
                  <div key={result.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white text-sm">{candidato?.nombre || 'Desconocido'}</span>
                    <span className="font-bold text-presidente">{result.count}</span>
                  </div>
                );
              })}
              {presidenteResults.length === 0 && (
                <p className="text-muted-foreground text-sm">No hay votos registrados</p>
              )}
            </div>
          </Card>

          {/* Mesa Results */}
          <Card className="p-6 bg-card/5 border-mesa/20">
            <h3 className="text-xl font-heading font-bold mb-4 text-mesa">
              Resultados Mesa Redonda
            </h3>
            <div className="space-y-3">
              {mesaResults.map(result => {
                const partido = partidosMesa.find(p => p.id === result.id);
                return (
                  <div key={result.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white text-sm">{partido?.partido || 'Desconocido'}</span>
                    <span className="font-bold text-mesa">{result.count}</span>
                  </div>
                );
              })}
              {mesaResults.length === 0 && (
                <p className="text-muted-foreground text-sm">No hay votos registrados</p>
              )}
            </div>
          </Card>

          {/* Alcalde Results */}
          <Card className="p-6 bg-card/5 border-alcalde/20">
            <h3 className="text-xl font-heading font-bold mb-4 text-alcalde">
              Resultados Alcalde
            </h3>
            <div className="space-y-3">
              {alcaldeResults.map(result => {
                const candidato = alcaldesPorDistrito[adminData.distrito]?.find(c => c.id === result.id);
                return (
                  <div key={result.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white text-sm">{candidato?.nombre || 'Desconocido'}</span>
                    <span className="font-bold text-alcalde">{result.count}</span>
                  </div>
                );
              })}
              {alcaldeResults.length === 0 && (
                <p className="text-muted-foreground text-sm">No hay votos registrados</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PanelAdmin;
