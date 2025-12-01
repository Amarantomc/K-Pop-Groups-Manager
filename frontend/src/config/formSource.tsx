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
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'checkbox' | 'file' | 'hidden' | 'group';
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
    // Para type === 'group'
    fields?: Field[];
};

// Enums y utilidades para convertirlos a opciones del select
// Valores exactamente como los define el backend (enum Status)
// Claves del enum `Status` del backend (keys). El backend valida que `status` sea una de estas claves.
export const APPRENTICE_STATUS = ['Training', 'Process', 'Transferred'] as const;
export type ApprenticeStatus = typeof APPRENTICE_STATUS[number];

// Labels en español para mostrar en el formulario; los `value` enviados serán las claves del enum.
const APPRENTICE_STATUS_LABELS: Record<ApprenticeStatus, string> = {
    'Training': 'En entrenamiento',
    'Process': 'En proceso de evaluación',
    'Transferred': 'Transferido',
};

export const APPRENTICE_STATUS_OPTIONS = (APPRENTICE_STATUS as readonly string[]).map((v) => ({ value: v, label: APPRENTICE_STATUS_LABELS[v as ApprenticeStatus] }));

export const ARTIST_STATUS = ['activo', 'en_pausa', 'inactivo'] as const;
export type ArtistStatus = typeof ARTIST_STATUS[number];

export const GROUP_STATUS = ['activo', 'en_pausa', 'disuelto'] as const;
export type GroupStatus = typeof GROUP_STATUS[number];

export const CONTRACT_STATUS = ['activo', 'en_renovacion', 'finalizado', 'rescindido'] as const;
export type ContractStatus = typeof CONTRACT_STATUS[number];

export const ACTIVITY_TYPES = ['individual', 'grupal'] as const;
export type ActivityType = typeof ACTIVITY_TYPES[number];

export const ROLE_TYPES = ['Admin', 'Manager', 'Director', 'Artista', 'Aprendiz'] as const;
export type RoleType = typeof ROLE_TYPES[number];

export const INCOME_TYPES = ['ventas', 'concierto', 'publicidad', 'otros'] as const;
export type IncomeType = typeof INCOME_TYPES[number];

export const REQUEST_STATUS = ['Aprobado', 'Rechazado', 'En Espera', 'Finalizado'] as const;
export type RequestStatus = typeof REQUEST_STATUS[number];

export const LIST_SCOPE = ['national', 'international'] as const;
export type ListScope = typeof LIST_SCOPE[number];

export const enumToOptions = (list: readonly string[]): FieldOption[] => {
    return list.map((v) => ({ value: v, label: String(v).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }));
}

// Usuario (auth)
export const userFields: Field[] = [
    { id: 'username', name: 'name', label: 'Nombre de usuario', type: 'text', placeholder: 'usuario', required: true },
    { id: 'email', name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@gmail.com', required: true },
    { id: 'password', name: 'password', label: 'Contraseña', type: 'password', required: true },
    { id: 'role', name: 'role', label: 'Rol de usuario', type: 'select', options: enumToOptions(ROLE_TYPES), required: true }
];

// Agencia
export const agencyFields: Field[] = [
    // Alineado con CreateAgencyDTO del backend: name, address, foundation
    { id: 'name', name: 'name', label: 'Nombre Agencia', type: 'text', placeholder: 'Nombre de la agencia', required: true, minLength: 2, maxLength: 120 },
    { id: 'address', name: 'address', label: 'Ubicación', type: 'text', placeholder: 'Ciudad / Dirección', required: true, maxLength: 200 },
    { id: 'foundation', name: 'foundation', label: 'Fecha Fundación', type: 'date', required: true },
];

// Aprendiz
export const apprenticeFields: Field[] = [
    // Campos alineados con CreateApprenticeDto del backend
    { id: 'name', name: 'name', label: 'Nombre Completo', type: 'text', required: true },
    { id: 'dateOfBirth', name: 'dateOfBirth', label: 'Fecha Nacimiento', type: 'date', required: true },
    { id: 'age', name: 'age', label: 'Edad', type: 'number', min: 15, required: true },
    { id: 'trainingLv', name: 'trainingLv', label: 'Nivel Entrenamiento', type: 'number', min: 0, required: true },
    { id: 'status', name: 'status', label: 'Estado Aprendiz', type: 'select', options: APPRENTICE_STATUS_OPTIONS, required: true },
    { id: 'agencyId', name: 'agencyId', label: 'ID de Agencia', type: 'number', required: true, min: 1 },
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
]
//Solicitud - subgrupo descripción del grupo
const descriptionRequest: Field[] = [
    { id: 'groupId', name: 'groupId', label: 'ID Grupo', type: 'text' },
    { id: 'name', name: 'name', label: 'Nombre Grupo', type: 'text', required: true },
    { id: 'debutDate', name: 'debutDate', label: 'Fecha Debut', type: 'date' },
    { id: 'members', name: 'members', label: 'No Miembros', type: 'number', min: 0 },
    { id: 'status', name: 'status', label: 'Estado Grupo', type: 'select', options: enumToOptions(GROUP_STATUS) },
];
// Solicitud
export const requestFields: Field[] = [
    { id: 'requestId', name: 'requestId', label: 'ID Solicitud', type: 'text' },
    { id: 'requestStatus', name: 'requestStatus', label: 'Solicitud', type: 'select', options: enumToOptions(REQUEST_STATUS) },
    { id: 'date', name: 'date', label: 'Fecha Solicitud', type: 'date' },
    { id: 'description', name: 'description', label: 'Descripción', type: 'group', fields: descriptionRequest },
    { id: 'status', name: 'status', label: 'Estado Grupo', type: 'select', options: enumToOptions(GROUP_STATUS) },
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

// Mapeo de roles UI (español) a valores del backend (inglés con mayúscula inicial)
export const ROLE_MAPPING: Record<string, string> = {
    'Admin': 'Admin',
    'Manager': 'Manager',
    'Director': 'Director',
    'Artista': 'Artist',
    'Aprendiz': 'Apprentice'
};

// Campos adicionales para manager/director
export const managerDirectorFields: Field[] = [
    { id: 'agencyId', name: 'agencyId', label: 'ID de Agencia', type: 'number', placeholder: '1', required: true, min: 1 }
];

// Campos adicionales para aprendiz
export const apprenticeUserFields: Field[] = [
    { id: 'IdAp', name: 'IdAp', label: 'ID de Aprendiz', type: 'number', placeholder: '1', required: true, min: 1 }
];

// Campos adicionales para artista
export const artistUserFields: Field[] = [
    { id: 'IdAp', name: 'IdAp', label: 'ID de Aprendiz', type: 'number', placeholder: '1', required: true, min: 1 },
    { id: 'IdGr', name: 'IdGr', label: 'ID de Grupo', type: 'number', placeholder: '1', required: true, min: 1 }
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