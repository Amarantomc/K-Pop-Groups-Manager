import { Role } from "../enums/Role"
import  User from "./user"

export class ApprenticeUser extends User {
   
    readonly apprenticeId: number
    
    constructor(attrs: {
        id: number
        name: string
        email: string
        password: string
        apprenticeId: number
    }) {
        super({ ...attrs, role: Role.Apprentice })
        this.apprenticeId = attrs.apprenticeId
    }
    
     getProfileData(): Record<string, any> {
        return{
            apprenticeId:this.apprenticeId
        }
    }
}