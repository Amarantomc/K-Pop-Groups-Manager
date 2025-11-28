import { Role } from "../enums/Role"
import  User  from "./user"

export class ManagerUser extends User {
    readonly agenciaId: number
     
    
    constructor(attrs: {
        id: number
        name: string
        email: string
        password: string
        agenciaId: number
         
    }) {
        super({ ...attrs, rol: Role.Manager })
        this.agenciaId = attrs.agenciaId
        
    }
 
}