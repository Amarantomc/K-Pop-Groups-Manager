import { inject, injectable } from "inversify";
import type { CreateUserDto } from "../../application/dtos/user/CreateUserDto";
import { UserResponseDto } from "../../application/dtos/user/UserResponseDto";
 
import type { IUserRepository } from "../../application/interfaces/repositories/IUserRepository";
import type { User } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { Types } from "../di/Types";
import { UserFactory } from "../../domain/factories/UserFactory";
import { Role } from "../../domain/enums/Role";

 
@injectable()
export class UserRepository implements IUserRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork)  private unitOfWork: UnitOfWork
  ) {}


     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateUserDto): Promise<User> {
         const user= await this.db.user.create({
            data:{
                
                email:data.email,
                name:data.name,
                password:data.GetPassword(),
                role:data.role
            }
        })

        let profileData: any = {}
        
    // Crear perfil según el rol
    switch (data.role.toLowerCase() as Role) {
      case Role.Manager:
        
        const managerProfile = await this.db.perfilManager.create({
          data: {
            userId: user.id,
            agenciaId: data.agencyId,
            
          }
        })
        profileData = managerProfile
        
        break

      case Role.Director:
        
        const directorProfile = await this.db.perfilDirector.create({
          data: {
            userId: user.id,
            agenciaId: data.agencyId,
             
          }
        })
        profileData = directorProfile
        break

      case Role.Apprentice:
        
        const apprenticeProfile = await this.db.perfilAprendiz.create({
          data: {
            userId: user.id,
            aprendizId: data.IdAp
          }
        })
        profileData = apprenticeProfile
        break

      case Role.Artist:
         
        const artistProfile = await this.db.perfilArtista.create({
          data: {
            userId: user.id,
            artistaIdAp: data.IdAp,
            artistaIdGr: data.IdGr
          }
        })
        profileData = artistProfile
        
        break
    }

    return UserFactory.create(user, profileData)
         


    }
    async findById(id: any): Promise<User | null> {
         id=(Number)(id)
        const user=await this.db.user.findUnique({
           where:{id},
           include: {
        perfilManager: true,
        perfilDirector: true,
        perfilAprendiz: true,
        perfilArtista: true
      }
        })
        return user ? UserResponseDto.toEntity(user) : null
    }
    async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
      //Update no hace sobre agencia grupo etc
      const user = await this.db.user.update({
                  where: { id: Number(id) },
                  data,
                });
              
                return this.findById(user.id) as Promise<User>
    }
    async delete(id: any): Promise<void> {
        id=(Number)(id)
        await this.db.user.delete({
            where:{id}
        })
        
    }

    async getUsers(): Promise<User[]> {
      const prismaUsers = await this.db.user.findMany({
              include: {
        perfilManager: true,
        perfilDirector: true,
        perfilAprendiz: true,
        perfilArtista: true
      }
      });

    return UserResponseDto.toEntities(prismaUsers)
    }

 

  async findByEmail(email: string): Promise<User | null> {
        const user= await this.db.user.findUnique({
            where:{email},
                  include: {
        perfilManager: true,
        perfilDirector: true,
        perfilAprendiz: true,
        perfilArtista: true
      }

        })
        return user ? UserResponseDto.toEntity(user) : null
    }
    
    
    
}