// Estructuras reutilizables para construir formularios.
// Cada campo tiene: id (string), name (campo en el modelo), label, type, placeholder, required y opciones (si es select).

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
    min?: number;
    max?: number;
};

// Campos para el formulario de registro / usuario
export const userFields: Field[] = [
    { id: 'username', name: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'john_doe', required: true },
    { id: 'fullName', name: 'fullName', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez', required: true },
    { id: 'email', name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true },
    { id: 'password', name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••', required: true },
    { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', placeholder: '••••••••', required: true },
    { id: 'phone', name: 'phone', label: 'Teléfono', type: 'text', placeholder: '+34 600 000 000' },
];

// Campos para la entidad Agency
export const agencyFields: Field[] = [
    { id: 'name', name: 'name', label: 'Nombre de la agencia', type: 'text', placeholder: 'Nombre Agencia', required: true },
    { id: 'address', name: 'address', label: 'Dirección', type: 'text', placeholder: 'Calle, número' },
    { id: 'city', name: 'city', label: 'Ciudad', type: 'text' },
    { id: 'country', name: 'country', label: 'País', type: 'text' },
    { id: 'contactEmail', name: 'contactEmail', label: 'Email de contacto', type: 'email', placeholder: 'contacto@agencia.com' },
    { id: 'contactPhone', name: 'contactPhone', label: 'Teléfono de contacto', type: 'text', placeholder: '+34 600 000 000' },
    { id: 'website', name: 'website', label: 'Web', type: 'text', placeholder: 'https://www.agencia.com' },
    { id: 'established', name: 'established', label: 'Fecha de fundación', type: 'date' },
    { id: 'logo', name: 'logo', label: 'Logo', type: 'file' },
    { id: 'description', name: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Descripción breve de la agencia' },
];

// Campos para la entidad Artist
export const artistFields: Field[] = [
    { id: 'firstName', name: 'firstName', label: 'Nombre', type: 'text', required: true },
    { id: 'lastName', name: 'lastName', label: 'Apellido', type: 'text' },
    { id: 'stageName', name: 'stageName', label: 'Nombre artístico', type: 'text', placeholder: 'Stage Name' },
    { id: 'genre', name: 'genre', label: 'Género', type: 'select', options: [
        { value: 'pop', label: 'Pop' },
        { value: 'rock', label: 'Rock' },
        { value: 'electronic', label: 'Electrónica' },
        { value: 'urban', label: 'Urbano' },
        { value: 'other', label: 'Otro' },
    ]},
    { id: 'birthdate', name: 'birthdate', label: 'Fecha de nacimiento', type: 'date' },
    { id: 'country', name: 'country', label: 'País', type: 'text' },
    { id: 'email', name: 'email', label: 'Correo electrónico', type: 'email' },
    { id: 'phone', name: 'phone', label: 'Teléfono', type: 'text' },
    { id: 'bio', name: 'bio', label: 'Biografía', type: 'textarea', placeholder: 'Breve biografía del artista' },
    { id: 'photo', name: 'photo', label: 'Foto / Imagen', type: 'file' },
];

// Campos para la entidad Activity (eventos/actividades)
export const activityFields: Field[] = [
    { id: 'title', name: 'title', label: 'Título', type: 'text', required: true },
    { id: 'description', name: 'description', label: 'Descripción', type: 'textarea' },
    { id: 'date', name: 'date', label: 'Fecha', type: 'date', required: true },
    { id: 'time', name: 'time', label: 'Hora', type: 'time' },
    { id: 'venue', name: 'venue', label: 'Lugar / Recinto', type: 'text' },
    { id: 'city', name: 'city', label: 'Ciudad', type: 'text' },
    { id: 'country', name: 'country', label: 'País', type: 'text' },
    { id: 'price', name: 'price', label: 'Precio', type: 'number', min: 0 },
    { id: 'capacity', name: 'capacity', label: 'Aforo', type: 'number', min: 0 },
    { id: 'organizer', name: 'organizer', label: 'Organizador (agencyId)', type: 'select', options: [] },
    { id: 'status', name: 'status', label: 'Estado', type: 'select', options: [
        { value: 'scheduled', label: 'Programado' },
        { value: 'cancelled', label: 'Cancelado' },
        { value: 'completed', label: 'Finalizado' },
    ]},
    { id: 'image', name: 'image', label: 'Imagen', type: 'file' },
];

// Utilidad: obtener campos por entidad
export const formFieldsByEntity: Record<string, Field[]> = {
    user: userFields,
    agency: agencyFields,
    artist: artistFields,
    activity: activityFields,
};

export default formFieldsByEntity;