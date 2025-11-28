
import { User } from "../../../domain";
import { UserFactory } from "../../../domain/factories/UserFactory";

export class UserResponseDto {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly name: string,
    public readonly role: string,
    public readonly profileData?: Record<string, any>
    
  ) {}

  static fromEntity(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.email,
      user.name,
      user.role,
      user.getProfileData()
      
    );
  }
  
    static toEntity(userData: any): User {
    let profileData: any = {}

    // Determinar qué perfil tiene
    if (userData.perfilManager) {
      profileData = {
        agenciaId: userData.perfilManager.agenciaId,

      }
    } else if (userData.perfilDirector) {
      profileData = {
        agenciaId: userData.perfilDirector.agenciaId,

      }
    } else if (userData.perfilAprendiz) {
      profileData = {
        aprendizId: userData.perfilAprendiz.aprendizId
      }
    } else if (userData.perfilArtista) {
      profileData = {
        artistaIdAp: userData.perfilArtista.IdAp,
        artistaIdGr: userData.perfilArtista.IdGr
      }
    }

    return UserFactory.create(userData, profileData)
  }


  static fromEntities(users: User[]): UserResponseDto[] {
    return users.map(user => this.fromEntity(user));
  }

  static toEntities(users: any []) :User []{
    return users.map(user=>this.toEntity(user))
  }
}