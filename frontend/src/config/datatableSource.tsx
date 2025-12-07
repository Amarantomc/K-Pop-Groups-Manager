import type { GridColDef } from "@mui/x-data-grid";

export const agencyColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'location', sortable: false, headerName: 'Ubicación', width: 150 },
    { field: 'founded', headerName: 'Año de Fundación', width: 250 },
]

export const apprenticeColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre Completo', width: 150 },
    { field: 'dateOfBirth', headerName: 'Fecha de Nacimiento', width: 250 },
    { field: 'age', headerName: 'Edad', width: 90 },
    // {field: 'agencyName', headerName: 'Agencia', width: 150},
    { field: 'trainingLv', headerName: 'Nivel de Entrenamiento', width: 180 },
    { field: 'status', headerName: 'Estado', width: 120 },
]

export const userColumns: GridColDef[] = [
    { field: 'username', headerName: 'Nombre de Usuario', width: 150 },
    { field: 'email', headerName: 'Correo Electrónico', width: 200 },
    // {field: 'password', headerName: 'Contraseña', width: 150},
    // {field: 'role', headerName: 'Rol', width: 120},
]

export const artistColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre Artístico', width: 200 },
    { field: 'realName', headerName: 'Nombre Real', width: 200 },
    { field: 'dateOfBirth', headerName: 'Fecha de Nacimiento', width: 150 },
]

// Grupo
export const groupColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre Grupo', width: 200 },
    { field: 'debutDate', headerName: 'Fecha Debut', width: 150 },
    { field: 'members', headerName: 'No. Miembros', width: 120 },
    { field: 'status', headerName: 'Estado', width: 120 },
]

// Álbum
export const albumColumns: GridColDef[] = [
    { field: 'title', headerName: 'Título Álbum', width: 200 },
    { field: 'releaseDate', headerName: 'Fecha Lanzamiento', width: 150 },
    { field: 'tracks', headerName: 'No. Canciones', width: 120 },
    { field: 'producer', headerName: 'Productor', width: 150 },
]

// Canción
export const songColumns: GridColDef[] = [
    { field: 'title', headerName: 'Título Canción', width: 200 },
    { field: 'producer', headerName: 'Productor', width: 150 },
    { field: 'releaseDate', headerName: 'Fecha Lanzamiento', width: 150 },
    { field: 'genre', headerName: 'Género', width: 120 },
]

// Premio
export const prizeColumns: GridColDef[] = [
    { field: 'title', headerName: 'Título Premio', width: 250 },
    { field: 'academy', headerName: 'Nombre Academia', width: 200 },
]

// Lista de Popularidad
export const popularityListColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre Lista', width: 250 },
    { field: 'scope', headerName: 'Ámbito', width: 150 },
]

// Concepto
export const conceptColumns: GridColDef[] = [
    { field: 'description', headerName: 'Descripción', width: 400 },
]

// Concepto Visual
export const visualConceptColumns: GridColDef[] = [
    { field: 'image', headerName: 'Imagen', width: 200 },
    { field: 'description', headerName: 'Descripción', width: 300 },
]

// Actividad
export const activityColumns: GridColDef[] = [
    { field: 'date', headerName: 'Fecha Actividad', width: 150 },
    { field: 'place', headerName: 'Lugar', width: 200 },
    { field: 'type', headerName: 'Tipo Actividad', width: 150 },
    { field: 'responsible', headerName: 'Responsable', width: 180 },
]

// Ingreso
export const incomeColumns: GridColDef[] = [
    { field: 'amount', headerName: 'Monto', width: 120 },
    { field: 'date', headerName: 'Fecha Ingreso', width: 150 },
    { field: 'incomeType', headerName: 'Tipo Ingreso', width: 150 },
    { field: 'responsible', headerName: 'Responsable', width: 180 },
]

// Solicitud
export const requestColumns: GridColDef[] = [
    { field: 'requestStatus', headerName: 'Estado Solicitud', width: 180 },
    { field: 'name', headerName: 'Nombre Grupo', width: 200 },
    { field: 'status', headerName: 'Estado Grupo', width: 150 },
]

// Contrato
export const contractColumns: GridColDef[] = [
    { field: 'startDate', headerName: 'Fecha Inicio', width: 150 },
    { field: 'endDate', headerName: 'Fecha Finalización', width: 150 },
    { field: 'revenueSplit', headerName: 'Distribución Ingresos', width: 180 },
    { field: 'status', headerName: 'Estado', width: 150 },
]

// Evaluación
export const evaluationColumns: GridColDef[] = [
    { field: 'category', headerName: 'Categoría', width: 150 },
    { field: 'score', headerName: 'Puntuación', width: 120 },
    { field: 'evaluationDate', headerName: 'Fecha Evaluación', width: 150 },
    { field: 'comments', headerName: 'Comentarios', width: 250 },
]