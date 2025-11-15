// Base de datos mock para VotoDigital

export interface Votante {
  dni: string;
  nombre: string;
  apellidos: string;
  edad: number;
  distrito: string;
}

export interface Admin {
  email: string;
  password: string;
  nombre: string;
  dni: string;
  distrito: string | null; // null para super admin
  rol: 'admin' | 'superadmin';
}

export interface Candidato {
  id: string;
  nombre: string;
  partido: string;
  foto?: string;
  logo?: string;
}

export interface Alcalde extends Candidato {
  distrito: string;
}

// Base de datos de votantes
export const votantesDB: Votante[] = [
  { dni: "12345678", nombre: "Juan", apellidos: "Pérez García", edad: 35, distrito: "Lima Centro" },
  { dni: "87654321", nombre: "María", apellidos: "López Sánchez", edad: 28, distrito: "Miraflores" },
  { dni: "11223344", nombre: "Carlos", apellidos: "Rodríguez Torres", edad: 42, distrito: "San Isidro" },
  { dni: "44332211", nombre: "Ana", apellidos: "Martínez Ruiz", edad: 31, distrito: "Surco" },
  { dni: "55667788", nombre: "Luis", apellidos: "González Díaz", edad: 39, distrito: "Lima Centro" },
  { dni: "60432205", nombre: "Super Admin", apellidos: "Sistema", edad: 99, distrito: "Administración" },
];

// Base de datos de administradores
export const adminsDB: Admin[] = [
  {
    email: "admin@votodigital.pe",
    password: "admin123",
    nombre: "Jorge Administrador",
    dni: "60432205",
    distrito: null,
    rol: "superadmin"
  },
  {
    email: "admin.lima@votodigital.pe",
    password: "lima123",
    nombre: "Pedro Admin Lima",
    dni: "99887766",
    distrito: "Lima Centro",
    rol: "admin"
  },
  {
    email: "admin.miraflores@votodigital.pe",
    password: "mira123",
    nombre: "Laura Admin Miraflores",
    dni: "99887767",
    distrito: "Miraflores",
    rol: "admin"
  }
];

// Candidatos a Presidente
export const candidatosPresidente: Candidato[] = [
  { id: "p1", nombre: "Roberto Castillo", partido: "Partido Renovación", foto: "/placeholder.svg" },
  { id: "p2", nombre: "Elena Vargas", partido: "Movimiento Popular", foto: "/placeholder.svg" },
  { id: "p3", nombre: "Miguel Santos", partido: "Alianza Nacional", foto: "/placeholder.svg" },
  { id: "p4", nombre: "Carmen Flores", partido: "Frente Democrático", foto: "/placeholder.svg" },
];

// Partidos para Mesa Redonda
export const partidosMesa: Candidato[] = [
  { id: "m1", nombre: "Partido Renovación", partido: "Partido Renovación", logo: "/placeholder.svg" },
  { id: "m2", nombre: "Movimiento Popular", partido: "Movimiento Popular", logo: "/placeholder.svg" },
  { id: "m3", nombre: "Alianza Nacional", partido: "Alianza Nacional", logo: "/placeholder.svg" },
  { id: "m4", nombre: "Frente Democrático", partido: "Frente Democrático", logo: "/placeholder.svg" },
  { id: "m5", nombre: "Unión Progresista", partido: "Unión Progresista", logo: "/placeholder.svg" },
];

// Candidatos a Alcalde por distrito
export const alcaldesPorDistrito: Record<string, Alcalde[]> = {
  "Lima Centro": [
    { id: "a1", nombre: "Jorge Ramírez", partido: "Partido Verde", distrito: "Lima Centro", foto: "/placeholder.svg" },
    { id: "a2", nombre: "Patricia Mendoza", partido: "Cambio Lima", distrito: "Lima Centro", foto: "/placeholder.svg" },
    { id: "a3", nombre: "Fernando Cruz", partido: "Lima Progresa", distrito: "Lima Centro", foto: "/placeholder.svg" },
  ],
  "Miraflores": [
    { id: "a4", nombre: "Ricardo Silva", partido: "Miraflores Unida", distrito: "Miraflores", foto: "/placeholder.svg" },
    { id: "a5", nombre: "Sofía Paredes", partido: "Futuro Verde", distrito: "Miraflores", foto: "/placeholder.svg" },
    { id: "a6", nombre: "Diego Morales", partido: "Renovación Miraflores", distrito: "Miraflores", foto: "/placeholder.svg" },
  ],
  "San Isidro": [
    { id: "a7", nombre: "Andrés Gutiérrez", partido: "San Isidro Avanza", distrito: "San Isidro", foto: "/placeholder.svg" },
    { id: "a8", nombre: "Valeria Rojas", partido: "Vecinos Unidos", distrito: "San Isidro", foto: "/placeholder.svg" },
  ],
  "Surco": [
    { id: "a9", nombre: "Manuel Torres", partido: "Surco Progresa", distrito: "Surco", foto: "/placeholder.svg" },
    { id: "a10", nombre: "Isabella Castro", partido: "Juntos por Surco", distrito: "Surco", foto: "/placeholder.svg" },
    { id: "a11", nombre: "Oscar Vega", partido: "Nueva Surco", distrito: "Surco", foto: "/placeholder.svg" },
  ],
};

export const distritos = ["Lima Centro", "Miraflores", "San Isidro", "Surco"];
