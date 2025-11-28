import { Role } from "../enums/Role"
import  User  from "./user"

export class ManagerUser extends User {
  
    readonly agencyId: number
     
    
    constructor(attrs: {
        id: number
        name: string
        email: string
        password: string
        agencyId: number
         
    }) {
        super({ ...attrs, rol: Role.Manager })
        this.agencyId = attrs.agencyId
        
    }
      getProfileData(): Record<string, any> {
        return {
            agencyId:this.agencyId
        }
    }
  
 
}