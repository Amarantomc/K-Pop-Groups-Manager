 
import { CreateUserUseCase } from "../../application/usesCase/user/CreateUser";
 
import type { Request,Response } from 'express';
import { CreateUserDto } from '../../application/dtos/user/CreateUserDto';
import { GetUserUseCase } from '../../application/usesCase/user/GetUserUseCase';
import { inject, injectable } from 'inversify';
import { Types } from '../../infrastructure/di/Types';
import type { GetUsersUseCase } from "../../application/usesCase/user/GerUsersUseCase";
import type { DeleteUserUseCase } from "../../application/usesCase/user/DeleteUserUseCase";
import type { UpdateUserUseCase } from "../../application/usesCase/user/UpdateUserUseCase";
import { UserResponseDto } from "../../application/dtos/user/UserResponseDto";
import { UpdateUserDto } from "../../application/dtos/user/UpdateUserDto";

@injectable()
export class UserController {
    
constructor(@inject(Types.CreateUserUseCase)  private createUserUseCase:CreateUserUseCase,
            @inject(Types.GetUserUseCase) private getUserUseCase:GetUserUseCase,
            @inject(Types.GetUsersUseCase) private getUsersUseCase:GetUsersUseCase,
            @inject(Types.DeleteUserUseCase) private deleteUserUseCase:DeleteUserUseCase,
          @inject(Types.UpdateUserUseCase) private updateUserUseCase:UpdateUserUseCase){}

    
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

    async getUsers(req: Request, res: Response) {
    try {
      
      const users = await this.getUsersUseCase.execute()
      

      res.json({
        success: true,
        data: users
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

    async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id!);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

    async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data=UpdateUserDto.create(id,req.body)
      const user = await this.updateUserUseCase.execute(data)

       

      res.json({
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

}