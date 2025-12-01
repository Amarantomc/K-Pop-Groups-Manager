import { Role } from "../enums/Role"
import  User from "../entities/user"
import { ManagerUser } from "../entities/ManagerUser"
import { DirectorUser } from "../entities/DirectorUser"
import { ApprenticeUser } from "../entities/ApprenticeUser"
import { ArtistUser } from "../entities/ArtistUser"
import { AdminUser } from "../entities/AdminUser"
 

export class UserFactory {
    static create(user: {
        id: number
        name: string
        email: string
        password: string
        role: string
    }, profileData?: any): User {
        
        const role = user.role.toLowerCase() as Role
        
        switch(role) {
            case Role.Manager:
                if (!profileData?.agenciaId) {
                    throw new Error("Manager user requires agencyId")
                }
                return new ManagerUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    agencyId: profileData.agenciaId,
                     
                })
                
            case Role.Director:
                if (!profileData?.agenciaId) {
                    throw new Error("Director user requires agencyId")
                }
                return new DirectorUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    agencyId: profileData.agenciaId,
     
                })
                
            case Role.Apprentice:
                if (!profileData?.aprendizId) {
                    throw new Error("Apprentice user requires aprendizId")
                }
                return new ApprenticeUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    apprenticeId: profileData.aprendizId
                })
                
            case Role.Artist:
                if (!profileData?.IdAp || !profileData?.IdGr) {
                    throw new Error("Artist user requires artistaIdAp and artistaIdGr")
                }
                return new ArtistUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    IdAp: profileData.IdAp,
                    IdGr: profileData.IdGr
                })
                
            case Role.Admin:
                return new AdminUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password
                })
                
            default:
                throw new Error(`Unknown role: ${user.role}`)
        }
    }
}