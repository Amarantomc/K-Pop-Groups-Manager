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
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'checkbox' | 'file' | 'hidden' | 'group' | 'daterange';
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
    maxFileSizeMB?: number; // tamaño máximo de archivo en MB
    fields?: Field[]; // campos anidados para grupos
    multiple?: boolean; // para selects múltiples
    dependsOn?: string; // nombre del campo del que depende para cargar opciones dinámicas
    addButtonLabel?: string; // etiqueta para el botón de agregar en campos de tipo 'group'
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

export const ROLES_GROUPS = ['Lider', 'Vocalista', 'Bailarín', 'Rapper', 'Productor', 'Compositor', 'Visual'] as const;
export type Role = typeof ROLES_GROUPS[number];

export const ACTIVITY_TYPES = ['individual', 'grupal'] as const;
export type ActivityType = typeof ACTIVITY_TYPES[number];

export const ACTIVITY_TYPES_EVENTS = ['Concierto', 'Sesion Fotografica', 'Festival', 'Show TV', 'Entrevista', 'Ensayo'] as const;
export type ActivityTypeEvent = typeof ACTIVITY_TYPES_EVENTS[number];

export const ROLE_TYPES = ['Admin', 'Manager', 'Director', 'Artista', 'Aprendiz'] as const;
export type RoleType = typeof ROLE_TYPES[number];

export const INCOME_TYPES = ['Contrato', 'Patrocinio', 'Merchandising', 'Eventos'] as const;
export type IncomeType = typeof INCOME_TYPES[number];

export const REQUEST_STATUS = ['Aprobado', 'Rechazado', 'En Espera', 'Finalizado'] as const;
export type RequestStatus = typeof REQUEST_STATUS[number];

export const LIST_SCOPE = ['Nacional', 'Internacional'] as const;
export type ListScope = typeof LIST_SCOPE[number];

export const enumToOptions = (list: readonly string[]): FieldOption[] => {
    return list.map((v) => ({ value: v, label: String(v).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }));
}

// Usuario (auth)
export const userFields: Field[] = [
    { id: 'role', name: 'role', label: 'Rol de usuario', type: 'select', options: enumToOptions(ROLE_TYPES), required: true },
    { id: 'username', name: 'name', label: 'Nombre de usuario', type: 'select', required: true, placeholder: 'Selecciona un usuario' },
    { id: 'email', name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@gmail.com', required: true },
    { id: 'password', name: 'password', label: 'Contraseña', type: 'password', required: true }
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
    {
        id: 'agencyId',
        name: 'agencyId',
        label: 'Nombre de Agencia',
        type: 'select',
        required: true,
        optionsEndpoint: '/api/agency'
    },
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
    { id: 'producer', name: 'producer', label: 'Productor', type: 'text' },
];

// Canción
export const songFields: Field[] = [
    { id: 'title', name: 'title', label: 'Título Canción', type: 'text' },
    { id: 'producer', name: 'producer', label: 'Productor', type: 'text' },
    { id: 'releaseDate', name: 'releaseDate', label: 'Fecha Lanzamiento', type: 'date' },
    { id: 'gender', name: 'gender', label: 'Género', type: 'text' },
];

// Premio
export const awardFields: Field[] = [
    { id: 'awardTitle', name: 'awardTitle', label: 'Título Premio', type: 'text' },
    { id: 'academyName', name: 'academyName', label: 'Nombre Academia', type: 'text' },
    {id:'requirement',name:'requirement',label:'Requisito',type:'number',min:1000000}
];

// Lista de Popularidad
export const popularityListFields: Field[] = [
    { id: 'name', name: 'name', label: 'Nombre Lista', type: 'text' },
    { id: 'listType', name: 'listType', label: 'Ámbito', type: 'select', options: enumToOptions(LIST_SCOPE) },
    {id:'requirement',name:'requirement',label:'Requisito',type:'number',min:10000}
];

// Concepto
export const conceptFields: Field[] = [
    { id: 'name', name: 'name', label: 'Nombre del Concepto', type: 'text', placeholder: 'Ej: Concepto retro años 80', required: true, minLength: 3, maxLength: 100 },
    { id: 'description', name: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Describe el concepto en detalle', required: true, minLength: 10, maxLength: 500 },
];

// Concepto Visual
export const visualConceptFields: Field[] = [
    { id: 'image', name: 'image', label: 'Imagen', type: 'file' },
];

// Actividad
export const activityFields: Field[] = [
    { id: 'place', name: 'place', label: 'Lugar', type: 'text' },
    { id: 'typeEvent', name: 'typeEvent', label: 'Evento', type: 'select', options: enumToOptions(ACTIVITY_TYPES_EVENTS) },
    { id: 'type', name: 'type', label: 'Tipo Actividad', type: 'select', options: enumToOptions(ACTIVITY_TYPES) },
    {
        id: 'performer',
        name: 'performer',
        label: 'Artista(s)/Grupo(s)',
        type: 'group',
        fields: [
            {
                id: 'type',
                name: 'type',
                label: 'Tipo',
                type: 'select',
                options: [
                    { value: 'group', label: 'Grupo' },
                    { value: 'artist', label: 'Artista' }
                ],
                required: true
            },
            {
                id: 'memberId',
                name: 'memberId',
                label: 'Miembro',
                type: 'select',
                options: [], // Se cargan dinámicamente según tipo
                required: true
            }
        ],
        addButtonLabel: 'Agregar performer'
    },
];

// Ingreso
export const incomeFields: Field[] = [
    { id: 'amount', name: 'amount', label: 'Monto', type: 'number', min: 0 },
    { id: 'incomeType', name: 'incomeType', label: 'Tipo Ingreso', type: 'select', options: enumToOptions(INCOME_TYPES) },
]
// Solicitud
export const groupMemberFields: Field[] = [
    { id: 'member', name: 'member', label: 'Miembro', type: 'text', required: true },
    {
        id: 'role',
        name: 'role',
        label: 'Rol',
        type: 'select',
        options: Object.values(ROLES_GROUPS).map(role => ({ label: role, value: role })),
        required: true
    }
];

export const requestFields: Field[] = [
    { id: 'name', name: 'name', label: 'Nombre Grupo', type: 'text', required: true },
    {
        id: 'members',
        name: 'members',
        label: 'Miembros',
        type: 'group',
        fields: groupMemberFields,
        addButtonLabel: 'Agregar miembro'
    },
    {
        id: 'concept',
        name: 'concept',
        label: 'Concepto',
        type: 'select',
        required: true,
        optionsEndpoint: '/api/concept',
        placeholder: 'Selecciona un concepto'
    },
];

// Contrato
export const contractFields: Field[] = [
    { id: 'startDate', name: 'startDate', label: 'Fecha Inicio', type: 'date', required: true },
    { id: 'endDate', name: 'endDate', label: 'Fecha Finalización', type: 'date' },
    { id: 'value', name: 'value', label: 'Valor', type: 'text', required: true, placeholder: 'Monto del contrato' },
    { id: 'terms', name: 'terms', label: 'Términos', type: 'textarea', required: true, placeholder: 'Condiciones del contrato' },
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
    {
        id: 'agencyId',
        name: 'agencyId',
        label: 'Agencia',
        type: 'select',
        required: true,
        optionsEndpoint: '/api/agency'
    }
];

// Campos adicionales para aprendiz (usa el nombre de usuario del campo base)
export const apprenticeUserFields: Field[] = [
    {
        id: 'username',
        name: 'name',
        label: 'Nombre de usuario',
        type: 'select',
        required: true,
        optionsEndpoint: '/api/apprentice'
    }
];

// Campos adicionales para artista (usa el nombre de usuario del campo base)
export const artistUserFields: Field[] = [
    {
        id: 'username',
        name: 'name',
        label: 'Nombre de usuario',
        type: 'select',
        required: true,
        optionsEndpoint: '/api/artist'
    }
];

// Utilidad: obtener campos por entidad
export const formFieldsByEntity: Record<string, Field[]> = {
    user: userFields,
    agency: agencyFields,
    apprentice: apprenticeFields,
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