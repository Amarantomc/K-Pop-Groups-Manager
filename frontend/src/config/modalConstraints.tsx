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