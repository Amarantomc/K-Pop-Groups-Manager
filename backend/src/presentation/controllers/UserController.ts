import { PrismaClient } from '../../generated/prisma'
import { CreateUserUseCase } from "../../application/usesCase/user/CreateUser";
import { UnitOfWork } from '../../infrastructure/PrismaUnitOfWork';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import type { Request,Response } from 'express';
import { CreateUserDto } from '../../application/dtos/user/CreateUserDto';
import { GetUserUseCase } from '../../application/usesCase/user/GetUserUseCase';

export class UserController {
    private createUserUseCase:CreateUserUseCase
    private getUserUseCase:GetUserUseCase

    constructor()
    {
        const prisma=new PrismaClient()
        const unitOfWork=new UnitOfWork(prisma)
        const userRepository=new UserRepository(prisma,unitOfWork)
        this.createUserUseCase=new CreateUserUseCase(userRepository,unitOfWork)
        this.getUserUseCase=new GetUserUseCase(userRepository)

    }

      async createUser(req: Request, res: Response) 
      {
    try {
      const { email, name, password,rol } = req.body;
      console.log("Ok1")
      if (!email || !name || !password || !rol) {
        return res.status(400).json({
          success: false,
          error: 'Email, name and password are required'
        });
      }
      console.log("Ok2")
      
      const userDto=new CreateUserDto(email,name,password,rol)
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