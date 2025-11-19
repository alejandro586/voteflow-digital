import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Trash2, Play, Database } from "lucide-react";
import { saveTrainingData, getTrainingData, deleteTrainingData, clearAllTrainingData, markTrainingDataProcessed, TrainingData } from "@/lib/storage";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MLProcessorProps {
  distrito?: string | null;
}

const MLProcessor = ({ distrito }: MLProcessorProps) => {
  const [trainingData, setTrainingData] = useState<TrainingData[]>(getTrainingData());
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResults, setTrainingResults] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simular carga de datos
    const mockData: TrainingData = {
      id: `${Date.now()}-${Math.random()}`,
      distrito: distrito || 'Nacional',
      categoria: 'presidente',
      votos: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString(),
      processed: false
    };

    saveTrainingData(mockData);
    setTrainingData(getTrainingData());
    toast.success("Datos cargados exitosamente");
  };

  const handleDeleteData = (id: string) => {
    deleteTrainingData(id);
    setTrainingData(getTrainingData());
    toast.success("Datos eliminados");
  };

  const handleClearAll = () => {
    clearAllTrainingData();
    setTrainingData([]);
    setTrainingResults(null);
    toast.success("Todos los datos eliminados");
  };

  const handleTrain = () => {
    if (trainingData.length === 0) {
      toast.error("No hay datos para entrenar");
      return;
    }

    setIsTraining(true);
    
    // Simular entrenamiento
    setTimeout(() => {
      const processedData = trainingData.filter(d => distrito ? d.distrito === distrito : true);
      
      // Marcar datos como procesados
      trainingData.forEach(item => markTrainingDataProcessed(item.id));
      
      // Generar resultados mock
      const results = {
        accuracy: (Math.random() * 20 + 75).toFixed(2),
        precision: (Math.random() * 15 + 80).toFixed(2),
        recall: (Math.random() * 18 + 77).toFixed(2),
        samples: processedData.length,
        // Datos para gráficos
        lineData: [
          { epoch: 1, loss: 0.8, accuracy: 65 },
          { epoch: 2, loss: 0.6, accuracy: 72 },
          { epoch: 3, loss: 0.45, accuracy: 78 },
          { epoch: 4, loss: 0.3, accuracy: 85 },
          { epoch: 5, loss: 0.2, accuracy: 90 },
        ],
        barData: [
          { categoria: 'Presidente', prediccion: Math.floor(Math.random() * 500 + 300) },
          { categoria: 'Mesa', prediccion: Math.floor(Math.random() * 400 + 250) },
          { categoria: 'Alcalde', prediccion: Math.floor(Math.random() * 450 + 280) },
        ],
        pieData: [
          { name: 'Correcto', value: Math.floor(Math.random() * 30 + 70) },
          { name: 'Incorrecto', value: Math.floor(Math.random() * 20 + 10) },
          { name: 'Pendiente', value: Math.floor(Math.random() * 15 + 5) },
        ],
      };

      setTrainingResults(results);
      setIsTraining(false);
      toast.success("Entrenamiento completado");
    }, 3000);
  };

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  return (
    <Card className="p-8 bg-card shadow-card border-admin-primary/20 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-admin-primary/10">
            <Database className="w-7 h-7 text-admin-primary" />
          </div>
          <h2 className="text-3xl font-heading font-bold">
            Procesador ML
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={trainingData.length === 0}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar Todo
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-foreground">Cargar Datos de Entrenamiento</Label>
          <div className="flex gap-2">
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="bg-background border-admin-primary/20"
            />
            <Button type="button" variant="outline" size="icon" className="border-admin-primary/30">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleTrain}
            disabled={trainingData.length === 0 || isTraining}
            className="w-full gradient-admin shadow-soft"
          >
            <Play className="w-4 h-4 mr-2" />
            {isTraining ? "Entrenando..." : "Entrenar Modelo"}
          </Button>
        </div>
      </div>

      {/* Data List */}
      {trainingData.length > 0 && (
        <Card className="p-4 mb-6 bg-muted/30 border-admin-primary/10">
          <h3 className="font-semibold mb-3 text-foreground">Datos Cargados ({trainingData.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {trainingData.filter(d => distrito ? d.distrito === distrito : true).map((data) => (
              <div key={data.id} className="flex items-center justify-between p-2 bg-background/50 rounded border border-admin-primary/10">
                <div className="text-sm">
                  <span className="font-medium text-foreground">{data.distrito}</span>
                  <span className="text-muted-foreground"> • {data.categoria} • {data.votos} votos</span>
                  {data.processed && <span className="text-admin-primary ml-2">✓ Procesado</span>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteData(data.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Training Results */}
      {trainingResults && (
        <div className="space-y-6">
          <Card className="p-4 bg-admin-primary/10 border-admin-primary/20">
            <h3 className="font-semibold mb-4 text-foreground">Métricas del Modelo</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-primary">{trainingResults.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Precisión</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-primary">{trainingResults.precision}%</div>
                <div className="text-xs text-muted-foreground">Exactitud</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-primary">{trainingResults.recall}%</div>
                <div className="text-xs text-muted-foreground">Recall</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-primary">{trainingResults.samples}</div>
                <div className="text-xs text-muted-foreground">Muestras</div>
              </div>
            </div>
          </Card>

          {/* Charts */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Line Chart - Training Progress */}
            <Card className="p-4 bg-background border-admin-primary/10">
              <h4 className="font-semibold mb-3 text-sm text-foreground">Progreso de Entrenamiento</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trainingResults.lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="loss" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar Chart - Predictions */}
            <Card className="p-4 bg-background border-admin-primary/10">
              <h4 className="font-semibold mb-3 text-sm text-foreground">Predicciones por Categoría</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trainingResults.barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="categoria" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="prediccion" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart - Classification */}
            <Card className="p-4 bg-background border-admin-primary/10">
              <h4 className="font-semibold mb-3 text-sm text-foreground">Clasificación de Resultados</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={trainingResults.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trainingResults.pieData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MLProcessor;
