import { PrismaClient } from '../../generated/prisma'
import { CreateUserUseCase } from "../../application/usesCase/user/CreateUser";
import { UnitOfWork } from '../../infrastructure/PrismaUnitOfWork';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import type { Request,Response } from 'express';
import { CreateUserDto } from '../../application/dtos/user/CreateUserDto';
import { GetUserUseCase } from '../../application/usesCase/user/GetUserUseCase';
import { inject, injectable } from 'inversify';
import { Types } from '../../infrastructure/di/Types';

@injectable()
export class UserController {
    
constructor(@inject(Types.CreateUserUseCase)  private createUserUseCase:CreateUserUseCase,
                  @inject(Types.GetUserUseCase) private getUserUseCase:GetUserUseCase){}

      async createUser(req: Request, res: Response) 
      {
    try {
          
      const userDto=CreateUserDto.Create(req.body)
      const user = await this.createUserUseCase.execute(userDto);

      

      res.status(201).json({
        success: true,
        data: user
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
      }

      async getUser(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const user = await this.getUserUseCase.execute(id!);
              console.log(user.rol)
               

              res.json({
                success: true,
                data: user
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}