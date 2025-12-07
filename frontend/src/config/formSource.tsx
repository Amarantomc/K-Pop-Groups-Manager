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

// Campo dinámico: agencia
{/* 
        id: 'agencyId', 
        name: 'agencyId', 
        label: 'Agencia', 
        type: 'select',
        optionsEndpoint: '/api/agency/'
    */}

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
    //{ id: 'age', name: 'age', label: 'Edad', type: 'number', min: 15, required: true },

    { id: 'trainingLv', name: 'trainingLv', label: 'Nivel Entrenamiento', type: 'number', min: 0, required: true },
    //{ id: 'status', name: 'status', label: 'Estado Aprendiz', type: 'select', options: APPRENTICE_STATUS_OPTIONS, required: true },
    { id: 'agencyName', name: 'agencyName', label: 'Nombre de Agencia', type: 'text', required: true },
];

// Artista
export const artistFields: Field[] = [
    { id: 'fullName', name: 'fullName', label: 'Nombre Completo', type: 'text', required: true, minLength: 2 },
    //{ id: 'stageName', name: 'stageName', label: 'Nombre Artístico', type: 'text', maxLength: 100 },
    //{ id: 'birthdate', name: 'birthdate', label: 'Fecha Nacimiento', type: 'date' },
    //{ id: 'debutDate', name: 'debutDate', label: 'Fecha Debut', type: 'date' },
    //{ id: 'status', name: 'status', label: 'Estado Artista', type: 'select', options: enumToOptions(ARTIST_STATUS) },
    //{ id: 'photo', name: 'photo', label: 'Foto', type: 'file', accept: 'image/*', maxFileSizeMB: 5 },
    //{ id: 'bio', name: 'bio', label: 'Biografía', type: 'textarea', maxLength: 2000 },
];

// Grupo
export const groupFields: Field[] = [
    { id: 'name', name: 'name', label: 'Nombre Grupo', type: 'text', required: true },
    { id: 'debutDate', name: 'debutDate', label: 'Fecha Debut', type: 'date' },
    { id: 'members', name: 'members', label: 'No Miembros', type: 'number', min: 0 },
    { id: 'status', name: 'status', label: 'Estado Grupo', type: 'select', options: enumToOptions(GROUP_STATUS) },
];

// Álbum
export const albumFields: Field[] = [
    { id: 'title', name: 'title', label: 'Título Álbum', type: 'text' },
    { id: 'releaseDate', name: 'releaseDate', label: 'Fecha Lanzamiento', type: 'date' },
    { id: 'tracks', name: 'tracks', label: 'No. Canciones', type: 'number', min: 0 },
    { id: 'producer', name: 'producer', label: 'Productor', type: 'text' },
];

// Canción
export const songFields: Field[] = [
    { id: 'title', name: 'title', label: 'Título Canción', type: 'text' },
    { id: 'producer', name: 'producer', label: 'Productor', type: 'text' },
    { id: 'releaseDate', name: 'releaseDate', label: 'Fecha Lanzamiento', type: 'date' },
    { id: 'genre', name: 'genre', label: 'Género', type: 'text' },
];

// Premio
export const awardFields: Field[] = [
    { id: 'title', name: 'title', label: 'Título Premio', type: 'text' },
    { id: 'academy', name: 'academy', label: 'Nombre Academia', type: 'text' },
];

// Lista de Popularidad
export const popularityListFields: Field[] = [
    { id: 'name', name: 'name', label: 'Nombre Lista', type: 'text' },
    { id: 'scope', name: 'scope', label: 'Ámbito', type: 'select', options: enumToOptions(LIST_SCOPE) },
];

// Concepto
export const conceptFields: Field[] = [
    { id: 'name', name: 'name', label: 'Nombre del Concepto', type: 'text', placeholder: 'Ej: Concepto retro años 80', required: true, minLength: 3, maxLength: 100 },
    { id: 'description', name: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Describe el concepto en detalle', required: true, minLength: 10, maxLength: 500 },
    /*{ id: 'category', name: 'category', label: 'Categoría', type: 'text', placeholder: 'Ej: Retro, Futurista, Romántico', required: true, maxLength: 50 },
      { id: 'status', name: 'status', label: 'Estado', type: 'select', required: true, options: [
          { value: 'active', label: 'Activo' },
          { value: 'inactive', label: 'Inactivo' },
          { value: 'in_development', label: 'En Desarrollo' },
          { value: 'archived', label: 'Archivado' }
      ]},*/
];

// Concepto Visual
export const visualConceptFields: Field[] = [
    { id: 'image', name: 'image', label: 'Imagen', type: 'file' },
    { id: 'description', name: 'description', label: 'Descripción', type: 'textarea' },
];

// Actividad
export const activityFields: Field[] = [
    { id: 'date', name: 'date', label: 'Fecha Actividad', type: 'date' },
    { id: 'place', name: 'place', label: 'Lugar', type: 'text' },
    { id: 'type', name: 'type', label: 'Tipo Actividad', type: 'select', options: enumToOptions(ACTIVITY_TYPES) },
    { id: 'responsible', name: 'responsible', label: 'Responsable Actividad', type: 'text' },
];

// Ingreso
export const incomeFields: Field[] = [
    { id: 'activityName', name: 'activityName', label: 'Nombre de Actividad', type: 'text' },
    { id: 'amount', name: 'amount', label: 'Monto', type: 'number', min: 0 },
    { id: 'date', name: 'date', label: 'Fecha Ingreso', type: 'date' },
    { id: 'incomeType', name: 'incomeType', label: 'Tipo Ingreso', type: 'select', options: enumToOptions(INCOME_TYPES) },
    { id: 'responsible', name: 'responsible', label: 'Responsable Ingreso', type: 'text' },
]
// Solicitud
// Campos para agregar aprendices y artistas al grupo
const groupMemberFields: Field[] = [
    { id: 'memberName', name: 'memberName', label: 'Nombre del Miembro', type: 'text', required: true },
    { id: 'stageName', name: 'stageName', label: 'Nombre Artístico', type: 'text', maxLength: 100 },
    { id: 'memberType', name: 'memberType', label: 'Tipo de Miembro', type: 'select', options: enumToOptions(['Aprendiz', 'Artista'] as const), required: true },
    { id: 'memberRole', name: 'memberRole', label: 'Rol en el Grupo', type: 'text', placeholder: 'Ej: Vocalista, Bailarín, Productor', required: true },
];
export const requestFields: Field[] = [
    { id: 'requestStatus', name: 'requestStatus', label: 'Solicitud', type: 'select', options: enumToOptions(REQUEST_STATUS) },
    //{ id: 'date', name: 'date', label: 'Fecha Solicitud', type: 'date' },
    { id: 'members', name: 'members', label: 'Miembros', type: 'group', fields: groupMemberFields },
    { id: 'status', name: 'status', label: 'Estado Grupo', type: 'select', options: enumToOptions(GROUP_STATUS) },
    { id: 'name', name: 'name', label: 'Nombre Grupo', type: 'text', required: true },
];

// Contrato
export const contractFields: Field[] = [
    { id: 'agencyName', name: 'agencyName', label: 'Nombre de Agencia', type: 'text' },
    { id: 'participantName', name: 'participantName', label: 'Nombre de Artista o Grupo', type: 'text' },
    { id: 'startDate', name: 'startDate', label: 'Fecha Inicio', type: 'date' },
    { id: 'endDate', name: 'endDate', label: 'Fecha Finalización', type: 'date' },
    { id: 'initialTerms', name: 'initialTerms', label: 'Condiciones Iniciales', type: 'textarea' },
    { id: 'revenueSplit', name: 'revenueSplit', label: 'Distribución de Ingresos', type: 'text' },
    { id: 'status', name: 'status', label: 'Estado Contrato', type: 'select', options: enumToOptions(CONTRACT_STATUS) },
];

// Evaluación
export const evaluationFields: Field[] = [
    { id: 'apprenticeName', name: 'apprenticeName', label: 'Aprendiz', type: 'select', required: true, optionsEndpoint: '/api/apprentice/' },
    { id: 'evaluatorName', name: 'evaluatorName', label: 'Evaluador', type: 'select', required: true, optionsEndpoint: '/api/artist/' },
    { id: 'category', name: 'category', label: 'Categoría', type: 'text', placeholder: 'Ej: Vocal, Baile, Carisma', required: true },
    { id: 'score', name: 'score', label: 'Puntuación (0-10)', type: 'number', required: true, min: 0, max: 10 },
    { id: 'comments', name: 'comments', label: 'Comentarios', type: 'textarea', placeholder: 'Comentarios de la evaluación' },
    { id: 'evaluationDate', name: 'evaluationDate', label: 'Fecha de Evaluación', type: 'date', required: true },
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
    { id: 'agencyName', name: 'agencyName', label: 'Nombre de Agencia', type: 'text', placeholder: 'Nombre de la agencia', required: true }
];

// Campos adicionales para aprendiz (usa el nombre de usuario del campo base)
export const apprenticeUserFields: Field[] = [];

// Campos adicionales para artista (usa el nombre de usuario del campo base)
export const artistUserFields: Field[] = [];

// Utilidad: obtener campos por entidad
export const formFieldsByEntity: Record<string, Field[]> = {
    user: userFields,
    agency: agencyFields,
    apprentice: apprenticeFields,
    artist: artistFields,
    group: groupFields,
    album: albumFields,
    song: songFields,
    award: awardFields,
    popularityList: popularityListFields,
    concept: conceptFields,
    visualConcept: visualConceptFields,
    activity: activityFields,
    income: incomeFields,
    request: requestFields,
    contract: contractFields,
    evaluation: evaluationFields,
};

export default formFieldsByEntity;