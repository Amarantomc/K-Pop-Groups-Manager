import { inject, injectable } from "inversify";
import type { CreateUserDto } from "../../application/dtos/user/CreateUserDto";
import { UserResponseDto } from "../../application/dtos/user/UserResponseDto";
 
import type { IUserRepository } from "../../application/interfaces/repositories/IUserRepository";
import type { User } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { Types } from "../di/Types";
 
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
                role:data.rol
            }
        })
         
        return UserResponseDto.toEntity(user)

    }
    async findById(id: any): Promise<User | null> {
         id=(Number)(id)
        const user=await this.db.user.findUnique({
           where:{id}
        })
        return user ? UserResponseDto.toEntity(user) : null
    }
    update(id: string, data: any): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

 

  async findByEmail(email: string): Promise<User | null> {
        const user= await this.db.user.findUnique({
            where:{email}
        })
        return user ? UserResponseDto.toEntity(user) : null
    }
    
    
    
}