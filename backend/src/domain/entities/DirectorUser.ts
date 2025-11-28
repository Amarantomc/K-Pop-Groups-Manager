import { Role } from "../enums/Role"
import  User  from "./user"

export class DirectorUser extends User {
    readonly agenciaId: number
     
    
    constructor(attrs: {
        id: number
        name: string
        email: string
        password: string
        agenciaId: number
         
    }) {
        super({ ...attrs, rol: Role.Director })
        this.agenciaId = attrs.agenciaId
         
    }
 
}