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
            if(!value || value.trim() === ""){
                return "El nombre es obligatorio";
            }
            if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(value)) return "El nombre solo puede contener letras y espacios";
            return null;
        }
    },
    location : {
        editable:true,
        required:true,
        type:"string",
        label:"Ubicación",
        validate: (value) => {
            if(!value || value.trim() === ""){
                return "La ubicación es obligatoria";
            }
            if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(value)) return "La ubicación solo puede contener letras y espacios";
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
            if(!value || value.trim() === "") return "El nivel de entrenamiento es obligatorio";
            if (!/^\d+$/.test(value)) return "El nivel de entrenamiento debe ser un número natural";
            const num = parseInt(value);
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
            if(!value || value.trim() === "") return "El estado es obligatorio";
            if (!["En Entrenamiento", "En Proceso", "Transferido"].includes(value)) return "Estado inválido";
            return null;
        }
    }
}