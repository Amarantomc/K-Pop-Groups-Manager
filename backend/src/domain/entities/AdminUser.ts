import { Role } from "../enums/Role"
import  User from "./user"

export class AdminUser extends User {
    constructor(attrs: {
        id: number
        name: string
        email: string
        password: string
    }) {
        super({ ...attrs, rol: Role.Admin })
    }
    
    getProfileData() {
        return {}
    }
    
    hasFullAccess(): boolean {
        return true
    }
}