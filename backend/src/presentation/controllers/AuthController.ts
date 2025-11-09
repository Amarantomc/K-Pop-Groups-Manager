import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { LoginUserUseCase } from "../../application/usesCase/user/LoginUserUseCase";
import { LoginRequestDto } from "../../application/dtos/user/LoginRequestDto";
import type { Request,Response } from 'express';


@injectable()
export class AuthController{
     constructor(
   @inject(Types.LoginUserUseCase) private loginUserUseCase: LoginUserUseCase,
    //@inject(ValidateTokenUseCase) private validateTokenUseCase: ValidateTokenUseCase
  ) {}

    async login(req: Request, res: Response) {
    try {
      const loginRequest = LoginRequestDto.fromBody(req.body);
     
      const result = await this.loginUserUseCase.execute(loginRequest);

      

      res.json({
        success: true,
        data: result
      });

    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

//   async me(req: Request, res: Response) {
//     try {
//       const token = req.headers.authorization?.replace('Bearer ', '');
      
//       if (!token) {
//         return res.status(401).json({
//           success: false,
//           error: 'Token is required'
//         });
//       }

//       const user = await this.validateTokenUseCase.execute(token);
//       const userResponse = UserResponseDto.fromEntity(user);

//       res.json({
//         success: true,
//         data: userResponse
//       });

//     } catch (error: any) {
//       res.status(401).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }

}