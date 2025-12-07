/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldConstraint {
  editable: boolean;              // Si el campo se puede modificar
  required?: boolean;             // Si es obligatorio
  type?: "string" | "number" | "date" | "boolean"|"select"; // Tipo de dato esperado
  label?: string;
  options? : string[];                 // Nombre visible en el modal
  validate?: (value: any) => string | null; // Función de validación personalizada
}

export type Constraints = Record<string, FieldConstraint>;

export const agencyConstraints: Constraints = {
    id : {editable:false , label:"id"},
    name : {
        editable:true,
        required:true,
        type:"string",
        label:"Nombre",
        validate: (value) => {
            const valueText = String(value)
            if(!valueText || valueText.trim() === ""){
                return "El nombre es obligatorio";
            }
            if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(valueText)) return "El nombre solo puede contener letras y espacios";
            return null;
        }
    },
    location : {
        editable:true,
        required:true,
        type:"string",
        label:"Ubicación",
        validate: (value) => {
            const valueText = String(value)
            if(!valueText || valueText.trim() === ""){
                return "La ubicación es obligatoria";
            }
            if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(valueText)) return "La ubicación solo puede contener letras y espacios";
            return null;
        }
    },
    founded : {editable:false , label:"Año de Fundación"}
}

export const apprenticeConstraints: Constraints = {
    id : {editable:false , label:"id"},
    name : {editable:false , label:"Nombre Completo"},
    dateOfBirth : {editable:false , label:"Fecha de Nacimiento"},
    age : {editable:false , label:"Edad"},
    trainingLv : {
        editable:true,
        required:true,
        type:"number",
        label:"Nivel de Entrenamiento",
        validate: (value) => {
            const valueText = String(value)
            if(!value || valueText.trim() === "") return "El nivel de entrenamiento es obligatorio";
            if (!/^\d+$/.test(valueText)) return "El nivel de entrenamiento debe ser un número natural";
            const num = parseInt(valueText);
            if(num < 0 || num > 10) return "El nivel de entrenamiento debe estar entre 0 y 10";
            return null;
        }
    },
    status : {
        editable:true,
        required:true,
        type:"select",
        label:"Estado",
        options:["En Entrenamiento", "En Proceso", "Transferido"],
        validate: (value) => {
            const valueText = String(value)
            if(!value || value.trim() === "") return "El estado es obligatorio";
            if (!["En Entrenamiento", "En Proceso", "Transferido"].includes(valueText)) return "Estado inválido";
            return null;
        }
    }
}

// Artista
export const artistConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre Real",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre es obligatorio";
            if (valueText.length < 2) return "El nombre debe tener al menos 2 caracteres";
            return null;
        }
    },
    stageName: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre Artístico",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre artístico es obligatorio";
            return null;
        }
    },
    email: {
        editable: true,
        required: true,
        type: "string",
        label: "Email",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El email es obligatorio";
            if (!/^\S+@\S+\.\S+$/.test(valueText)) return "Email inválido";
            return null;
        }
    },
    phone: {editable: true, type: "string", label: "Teléfono"},
    birthDate: {editable: false, type: "date", label: "Fecha de Nacimiento"},
    nationality: {editable: true, type: "string", label: "Nacionalidad"},
    genre: {editable: true, type: "string", label: "Género Musical"},
    status: {
        editable: true,
        required: true,
        type: "select",
        label: "Estado",
        options: ["active", "inactive", "on_tour", "training"],
        validate: (value) => {
            if (!value) return "El estado es obligatorio";
            return null;
        }
    },
    bio: {editable: true, type: "string", label: "Biografía"}
}

// Grupo
export const groupConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre del Grupo",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre del grupo es obligatorio";
            if (valueText.length < 2) return "El nombre debe tener al menos 2 caracteres";
            return null;
        }
    },
    debutDate: {editable: false, type: "date", label: "Fecha de Debut"},
    members: {
        editable: true,
        type: "number",
        label: "Número de Miembros",
        validate: (value) => {
            const num = Number(value);
            if (isNaN(num) || num < 1) return "Debe haber al menos 1 miembro";
            return null;
        }
    },
    status: {
        editable: true,
        required: true,
        type: "select",
        label: "Estado",
        options: ["activo", "en_pausa", "disuelto"]
    },
    agencyName: {editable: false, label: "Agencia"}
}

// Álbum
export const albumConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    title: {
        editable: true,
        required: true,
        type: "string",
        label: "Título",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El título es obligatorio";
            return null;
        }
    },
    releaseDate: {editable: false, type: "date", label: "Fecha de Lanzamiento"},
    genre: {editable: true, type: "string", label: "Género"},
    sales: {
        editable: true,
        type: "number",
        label: "Ventas",
        validate: (value) => {
            const num = Number(value);
            if (isNaN(num) || num < 0) return "Las ventas no pueden ser negativas";
            return null;
        }
    },
    artistName: {editable: false, label: "Artista"},
    groupName: {editable: false, label: "Grupo"}
}

// Canción
export const songConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    title: {
        editable: true,
        required: true,
        type: "string",
        label: "Título",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El título es obligatorio";
            return null;
        }
    },
    duration: {
        editable: true,
        type: "string",
        label: "Duración",
        validate: (value) => {
            const valueText = String(value).trim();
            if (valueText && !/^\d{1,2}:\d{2}$/.test(valueText)) {
                return "Formato inválido (ej: 3:45)";
            }
            return null;
        }
    },
    genre: {editable: true, type: "string", label: "Género"},
    releaseDate: {editable: false, type: "date", label: "Fecha de Lanzamiento"},
    albumTitle: {editable: false, label: "Álbum"}
}

// Premio
export const awardConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre del Premio",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre del premio es obligatorio";
            return null;
        }
    },
    category: {editable: true, type: "string", label: "Categoría"},
    awardDate: {editable: true, type: "date", label: "Fecha de Premiación"},
    artistName: {editable: false, label: "Artista"},
    groupName: {editable: false, label: "Grupo"}
}

// Lista de Popularidad
export const popularityListConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre de la Lista",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre de la lista es obligatorio";
            return null;
        }
    },
    scope: {
        editable: true,
        type: "select",
        label: "Alcance",
        options: ["national", "international"]
    },
    date: {editable: true, type: "date", label: "Fecha"},
    rank: {
        editable: true,
        type: "number",
        label: "Posición",
        validate: (value) => {
            const num = Number(value);
            if (isNaN(num) || num < 1) return "La posición debe ser mayor a 0";
            return null;
        }
    }
}

// Concepto
export const conceptConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre del Concepto",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre es obligatorio";
            return null;
        }
    },
    description: {
        editable: true,
        required: true,
        type: "string",
        label: "Descripción"
    },
    category: {editable: true, type: "string", label: "Categoría"},
    status: {
        editable: true,
        type: "select",
        label: "Estado",
        options: ["active", "inactive", "in_development", "archived"]
    },
    createdAt: {editable: false, type: "date", label: "Fecha de Creación"},
    agencyName: {editable: false, label: "Agencia"}
}

// Concepto Visual
export const visualConceptConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre es obligatorio";
            return null;
        }
    },
    description: {editable: true, type: "string", label: "Descripción"},
    imageUrl: {editable: true, type: "string", label: "URL de Imagen"},
    conceptName: {editable: false, label: "Concepto Asociado"}
}

// Actividad
export const activityConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre de la Actividad",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre es obligatorio";
            return null;
        }
    },
    date: {editable: true, required: true, type: "date", label: "Fecha"},
    type: {
        editable: true,
        type: "select",
        label: "Tipo",
        options: ["individual", "grupal"]
    },
    description: {editable: true, type: "string", label: "Descripción"}
}

// Ingreso
export const incomeConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    amount: {
        editable: true,
        required: true,
        type: "number",
        label: "Monto",
        validate: (value) => {
            const num = Number(value);
            if (isNaN(num) || num <= 0) return "El monto debe ser mayor a 0";
            return null;
        }
    },
    type: {
        editable: true,
        required: true,
        type: "select",
        label: "Tipo",
        options: ["ventas", "concierto", "publicidad", "otros"]
    },
    date: {editable: true, type: "date", label: "Fecha"},
    description: {editable: true, type: "string", label: "Descripción"},
    agencyName: {editable: false, label: "Agencia"}
}

// Solicitud
export const requestConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    type: {editable: true, required: true, type: "string", label: "Tipo de Solicitud"},
    status: {
        editable: true,
        required: true,
        type: "select",
        label: "Estado",
        options: ["Aprobado", "Rechazado", "En Espera", "Finalizado"]
    },
    description: {editable: true, type: "string", label: "Descripción"},
    submissionDate: {editable: false, type: "date", label: "Fecha de Envío"},
    approvalDate: {editable: true, type: "date", label: "Fecha de Aprobación"},
    apprenticeName: {editable: false, label: "Aprendiz"}
}

// Contrato
export const contractConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    startDate: {editable: true, required: true, type: "date", label: "Fecha de Inicio"},
    endDate: {editable: true, type: "date", label: "Fecha de Fin"},
    terms: {editable: true, required: true, type: "string", label: "Términos"},
    status: {
        editable: true,
        required: true,
        type: "select",
        label: "Estado",
        options: ["activo", "en_renovacion", "finalizado", "rescindido"]
    },
    artistName: {editable: false, label: "Artista"},
    agencyName: {editable: false, label: "Agencia"}
}

// Evaluación
export const evaluationConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    score: {
        editable: true,
        required: true,
        type: "number",
        label: "Puntuación",
        validate: (value) => {
            const num = Number(value);
            if (isNaN(num) || num < 0 || num > 100) return "La puntuación debe estar entre 0 y 100";
            return null;
        }
    },
    comments: {editable: true, type: "string", label: "Comentarios"},
    evaluationDate: {editable: true, type: "date", label: "Fecha de Evaluación"},
    apprenticeName: {editable: false, label: "Aprendiz"}
}

// Usuario
export const userConstraints: Constraints = {
    id: {editable: false, label: "ID"},
    name: {
        editable: true,
        required: true,
        type: "string",
        label: "Nombre",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El nombre es obligatorio";
            return null;
        }
    },
    email: {
        editable: true,
        required: true,
        type: "string",
        label: "Email",
        validate: (value) => {
            const valueText = String(value).trim();
            if (!valueText) return "El email es obligatorio";
            if (!/^\S+@\S+\.\S+$/.test(valueText)) return "Email inválido";
            return null;
        }
    },
    role: {
        editable: true,
        required: true,
        type: "select",
        label: "Rol",
        options: ["Admin", "Manager", "Director", "Artista", "Aprendiz"]
    },
    agencyName: {editable: false, label: "Agencia"}
}