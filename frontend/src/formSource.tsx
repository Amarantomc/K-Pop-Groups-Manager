// Estructuras reutilizables para construir formularios.
// Basado en el diagrama ER proporcionado: incluye campos para Agencia, Aprendiz, Artista, Grupo, Álbum, Canción, Premio, Lista de Popularidad, Concepto, Concepto Visual, Actividad, Ingreso, Solicitud y Contrato.

export type FieldOption = {
    value: string;
    label: string;
};

export type Field = {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'checkbox' | 'file';
    placeholder?: string;
    required?: boolean;
    options?: FieldOption[];
    // Si se proporciona, el formulario intentará obtener opciones desde este endpoint
    optionsEndpoint?: string;
    min?: number;
    max?: number;
    // Validación adicional
    minLength?: number;
    maxLength?: number;
    pattern?: string; // regex string
    accept?: string; // para input file: 'image/*'
    maxFileSizeMB?: number;
};

// Enums y utilidades para convertirlos a opciones del select
export const APPRENTICE_STATUS = ['en_entrenamiento', 'en_proceso_seleccion', 'transferido'] as const;
export type ApprenticeStatus = typeof APPRENTICE_STATUS[number];

export const ARTIST_STATUS = ['activo', 'en_pausa', 'inactivo'] as const;
export type ArtistStatus = typeof ARTIST_STATUS[number];

export const GROUP_STATUS = ['activo', 'en_pausa', 'disuelto'] as const;
export type GroupStatus = typeof GROUP_STATUS[number];

export const CONTRACT_STATUS = ['activo', 'en_renovacion', 'finalizado', 'rescindido'] as const;
export type ContractStatus = typeof CONTRACT_STATUS[number];

export const ACTIVITY_TYPES = ['individual','grupal'] as const;
export type ActivityType = typeof ACTIVITY_TYPES[number];

export const ROLE_TYPES = ['lider', 'vocalista', 'rapero', 'bailarin', 'producer'] as const;
export type RoleType = typeof ROLE_TYPES[number];

export const INCOME_TYPES = ['ventas', 'concierto', 'publicidad', 'otras'] as const;
export type IncomeType = typeof INCOME_TYPES[number];

export const REQUEST_TYPES = ['ajuste_horario', 'disponibilidad', 'otro'] as const;
export type RequestType = typeof REQUEST_TYPES[number];

export const LIST_SCOPE = ['national', 'international'] as const;
export type ListScope = typeof LIST_SCOPE[number];

export const enumToOptions = (list: readonly string[]): FieldOption[] => {
    return list.map((v) => ({ value: v, label: String(v).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }));
}

// Usuario (auth)
export const userFields: Field[] = [
    { id: 'username', name: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'usuario', required: true },
    { id: 'email', name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true },
    { id: 'password', name: 'password', label: 'Contraseña', type: 'password', required: true },
];

// Agencia
export const agencyFields: Field[] = [
    { id: 'agencyId', name: 'agencyId', label: 'ID Agencia', type: 'text' },
    { id: 'name', name: 'name', label: 'Nombre Agencia', type: 'text', placeholder: 'Nombre de la agencia', required: true, minLength: 2, maxLength: 120 },
    { id: 'location', name: 'location', label: 'Ubicación', type: 'text', placeholder: 'Ciudad / Dirección', maxLength: 200 },
    { id: 'foundedAt', name: 'foundedAt', label: 'Fecha Fundación', type: 'date' },
];

// Aprendiz
export const apprenticeFields: Field[] = [
    { id: 'apprenticeId', name: 'apprenticeId', label: 'ID Aprendiz', type: 'text' },
    { id: 'fullName', name: 'fullName', label: 'Nombre Completo', type: 'text', required: true },
    { id: 'age', name: 'age', label: 'Edad', type: 'number', min: 0 },
    { id: 'birthdate', name: 'birthdate', label: 'Fecha Nacimiento', type: 'date' },
    { id: 'status', name: 'status', label: 'Estado Aprendiz', type: 'select', options: enumToOptions(APPRENTICE_STATUS) },
    { id: 'trainingLevel', name: 'trainingLevel', label: 'Nivel Entrenamiento', type: 'text' },
];

// Artista
export const artistFields: Field[] = [
    { id: 'artistId', name: 'artistId', label: 'ID Artista', type: 'text' },
    { id: 'fullName', name: 'fullName', label: 'Nombre Completo', type: 'text', required: true, minLength: 2 },
    { id: 'stageName', name: 'stageName', label: 'Nombre Artístico', type: 'text', maxLength: 100 },
    { id: 'birthdate', name: 'birthdate', label: 'Fecha Nacimiento', type: 'date' },
    { id: 'debutDate', name: 'debutDate', label: 'Fecha Debut', type: 'date' },
    { id: 'status', name: 'status', label: 'Estado Artista', type: 'select', options: enumToOptions(ARTIST_STATUS) },
    { id: 'photo', name: 'photo', label: 'Foto', type: 'file', accept: 'image/*', maxFileSizeMB: 5 },
    { id: 'bio', name: 'bio', label: 'Biografía', type: 'textarea', maxLength: 2000 },
];

// Grupo
export const groupFields: Field[] = [
    { id: 'groupId', name: 'groupId', label: 'ID Grupo', type: 'text' },
    { id: 'name', name: 'name', label: 'Nombre Grupo', type: 'text', required: true },
    { id: 'debutDate', name: 'debutDate', label: 'Fecha Debut', type: 'date' },
    { id: 'members', name: 'members', label: 'No Miembros', type: 'number', min: 0 },
    { id: 'status', name: 'status', label: 'Estado Grupo', type: 'select', options: enumToOptions(GROUP_STATUS) },
];

// Álbum
export const albumFields: Field[] = [
    { id: 'albumId', name: 'albumId', label: 'ID Álbum', type: 'text' },
    { id: 'title', name: 'title', label: 'Título Álbum', type: 'text' },
    { id: 'releaseDate', name: 'releaseDate', label: 'Fecha Lanzamiento', type: 'date' },
    { id: 'tracks', name: 'tracks', label: 'No. Canciones', type: 'number', min: 0 },
    { id: 'producer', name: 'producer', label: 'Productor', type: 'text' },
];

// Canción
export const songFields: Field[] = [
    { id: 'songId', name: 'songId', label: 'ID Canción', type: 'text' },
    { id: 'title', name: 'title', label: 'Título Canción', type: 'text' },
    { id: 'producer', name: 'producer', label: 'Productor', type: 'text' },
    { id: 'releaseDate', name: 'releaseDate', label: 'Fecha Lanzamiento', type: 'date' },
    { id: 'genre', name: 'genre', label: 'Género', type: 'text' },
];

// Premio
export const prizeFields: Field[] = [
    { id: 'prizeId', name: 'prizeId', label: 'ID Premio', type: 'text' },
    { id: 'title', name: 'title', label: 'Título Premio', type: 'text' },
    { id: 'academy', name: 'academy', label: 'Nombre Academia', type: 'text' },
];

// Lista de Popularidad
export const popularityListFields: Field[] = [
    { id: 'listId', name: 'listId', label: 'ID Lista', type: 'text' },
    { id: 'name', name: 'name', label: 'Nombre Lista', type: 'text' },
    { id: 'scope', name: 'scope', label: 'Ámbito', type: 'select', options: enumToOptions(LIST_SCOPE) },
];

// Concepto
export const conceptFields: Field[] = [
    { id: 'conceptId', name: 'conceptId', label: 'ID Concepto', type: 'text' },
    { id: 'description', name: 'description', label: 'Descripción', type: 'textarea' },
];

// Concepto Visual
export const visualConceptFields: Field[] = [
    { id: 'visualId', name: 'visualId', label: 'ID Concepto Visual', type: 'text' },
    { id: 'image', name: 'image', label: 'Imagen', type: 'file' },
    { id: 'description', name: 'description', label: 'Descripción', type: 'textarea' },
];

// Actividad
export const activityFields: Field[] = [
    { id: 'activityId', name: 'activityId', label: 'ID Actividad', type: 'text' },
    { id: 'date', name: 'date', label: 'Fecha Actividad', type: 'date' },
    { id: 'place', name: 'place', label: 'Lugar', type: 'text' },
    { id: 'type', name: 'type', label: 'Tipo Actividad', type: 'select', options: enumToOptions(ACTIVITY_TYPES) },
    { id: 'responsible', name: 'responsible', label: 'Responsable Actividad', type: 'text' },
];

// Ingreso
export const incomeFields: Field[] = [
    { id: 'incomeId', name: 'incomeId', label: 'ID Ingreso', type: 'text' },
    { id: 'activityId', name: 'activityId', label: 'ID Actividad', type: 'text' },
    { id: 'amount', name: 'amount', label: 'Monto', type: 'number', min: 0 },
    { id: 'date', name: 'date', label: 'Fecha Ingreso', type: 'date' },
    { id: 'incomeType', name: 'incomeType', label: 'Tipo Ingreso', type: 'select', options: enumToOptions(INCOME_TYPES) },
    { id: 'responsible', name: 'responsible', label: 'Responsable Ingreso', type: 'text' },
];

// Solicitud
export const requestFields: Field[] = [
    { id: 'requestId', name: 'requestId', label: 'ID Solicitud', type: 'text' },
    { id: 'requestType', name: 'requestType', label: 'Solicitud', type: 'select', options: enumToOptions(REQUEST_TYPES) },
    { id: 'date', name: 'date', label: 'Fecha Solicitud', type: 'date' },
];

// Contrato
export const contractFields: Field[] = [
    { id: 'contractId', name: 'contractId', label: 'ID Contrato', type: 'text' },
    { id: 'agencyId', name: 'agencyId', label: 'ID Agencia', type: 'text' },
    { id: 'artistId', name: 'artistId', label: 'ID Artista', type: 'text' },
    { id: 'startDate', name: 'startDate', label: 'Fecha Inicio', type: 'date' },
    { id: 'endDate', name: 'endDate', label: 'Fecha Finalización', type: 'date' },
    { id: 'initialTerms', name: 'initialTerms', label: 'Condiciones Iniciales', type: 'textarea' },
    { id: 'revenueSplit', name: 'revenueSplit', label: 'Distribución de Ingresos', type: 'text' },
    { id: 'status', name: 'status', label: 'Estado Contrato', type: 'select', options: enumToOptions(CONTRACT_STATUS) },
];

// Utilidad: obtener campos por entidad
export const formFieldsByEntity: Record<string, Field[]> = {
    user: userFields,
    agency: agencyFields,
    apprentice: apprenticeFields,
    artist: artistFields,
    group: groupFields,
    album: albumFields,
    song: songFields,
    prize: prizeFields,
    popularityList: popularityListFields,
    concept: conceptFields,
    visualConcept: visualConceptFields,
    activity: activityFields,
    income: incomeFields,
    request: requestFields,
    contract: contractFields,
};

export default formFieldsByEntity;