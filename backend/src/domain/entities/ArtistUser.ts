import { Role } from "../enums/Role"
import  User from "./user"

export class ArtistUser extends User {
   
    readonly IdAp: number
    readonly IdGr: number
    
    constructor(attrs: {
        id: number
        name: string
        email: string
        password: string
        IdAp: number
        IdGr: number
    }) {
        super({ ...attrs, rol: Role.Artist })
        this.IdAp = attrs.IdAp
        this.IdGr = attrs.IdGr
    }
     getProfileData(): Record<string, any> {
        return {
            IdAp: this.IdAp,
            IdGr:this.IdGr
        }
    }
 
}