import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllVotesByCategory } from "@/lib/storage";
import { candidatosPresidente, partidosMesa, alcaldesPorDistrito } from "@/data/mockData";
import { BarChart3 } from "lucide-react";

interface ResultsTableProps {
  distrito?: string | null;
}

const ResultsTable = ({ distrito }: ResultsTableProps) => {
  const getResults = (categoria: 'presidente' | 'mesa' | 'alcalde') => {
    const votes = getAllVotesByCategory(categoria).filter(v => 
      distrito ? v.distrito === distrito : true
    );
    
    const counts: Record<string, number> = {};
    votes.forEach(vote => {
      counts[vote.candidatoId] = (counts[vote.candidatoId] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count);
  };

  const presidenteResults = getResults('presidente');
  const mesaResults = getResults('mesa');
  const alcaldeResults = getResults('alcalde');

  const getCandidateName = (categoria: string, id: string) => {
    if (categoria === 'presidente') {
      return candidatosPresidente.find(c => c.id === id)?.nombre || 'Desconocido';
    } else if (categoria === 'mesa') {
      return partidosMesa.find(p => p.id === id)?.partido || 'Desconocido';
    } else {
      // Para alcaldes, buscar en todos los distritos
      for (const dist in alcaldesPorDistrito) {
        const candidato = alcaldesPorDistrito[dist].find(c => c.id === id);
        if (candidato) return candidato.nombre;
      }
      return 'Desconocido';
    }
  };

  const totalVotes = presidenteResults.reduce((acc, r) => acc + r.count, 0) +
                     mesaResults.reduce((acc, r) => acc + r.count, 0) +
                     alcaldeResults.reduce((acc, r) => acc + r.count, 0);

  return (
    <Card className="p-6 bg-card shadow-card border-admin-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-admin-primary" />
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Tabla de Resultados {distrito && `- ${distrito}`}
        </h2>
      </div>

      <div className="mb-6 p-4 bg-admin-primary/10 rounded-lg border border-admin-primary/20">
        <div className="text-center">
          <div className="text-3xl font-bold text-admin-primary">{totalVotes}</div>
          <div className="text-sm text-muted-foreground">Total de Votos Registrados</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Presidente Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-presidente">Presidente</h3>
          <div className="border border-presidente/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-presidente/10">
                  <TableHead className="text-foreground">Candidato</TableHead>
                  <TableHead className="text-right text-foreground">Votos</TableHead>
                  <TableHead className="text-right text-foreground">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {presidenteResults.length > 0 ? (
                  presidenteResults.map(result => {
                    const total = presidenteResults.reduce((acc, r) => acc + r.count, 0);
                    const percentage = ((result.count / total) * 100).toFixed(1);
                    return (
                      <TableRow key={result.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-foreground">
                          {getCandidateName('presidente', result.id)}
                        </TableCell>
                        <TableCell className="text-right text-presidente font-bold">
                          {result.count}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {percentage}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Sin votos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mesa Redonda Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-mesa">Mesa Redonda</h3>
          <div className="border border-mesa/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-mesa/10">
                  <TableHead className="text-foreground">Partido</TableHead>
                  <TableHead className="text-right text-foreground">Votos</TableHead>
                  <TableHead className="text-right text-foreground">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mesaResults.length > 0 ? (
                  mesaResults.map(result => {
                    const total = mesaResults.reduce((acc, r) => acc + r.count, 0);
                    const percentage = ((result.count / total) * 100).toFixed(1);
                    return (
                      <TableRow key={result.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-foreground">
                          {getCandidateName('mesa', result.id)}
                        </TableCell>
                        <TableCell className="text-right text-mesa font-bold">
                          {result.count}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {percentage}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Sin votos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Alcalde Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-alcalde">Alcalde</h3>
          <div className="border border-alcalde/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-alcalde/10">
                  <TableHead className="text-foreground">Candidato</TableHead>
                  <TableHead className="text-right text-foreground">Votos</TableHead>
                  <TableHead className="text-right text-foreground">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alcaldeResults.length > 0 ? (
                  alcaldeResults.map(result => {
                    const total = alcaldeResults.reduce((acc, r) => acc + r.count, 0);
                    const percentage = ((result.count / total) * 100).toFixed(1);
                    return (
                      <TableRow key={result.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-foreground">
                          {getCandidateName('alcalde', result.id)}
                        </TableCell>
                        <TableCell className="text-right text-alcalde font-bold">
                          {result.count}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {percentage}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Sin votos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultsTable;
