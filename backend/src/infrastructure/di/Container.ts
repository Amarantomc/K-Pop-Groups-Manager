
import { Container } from 'inversify';
import { PrismaClient } from '../../generated/prisma';
import { Types } from './Types';
import type { IUnitOfWork } from '../../application/interfaces/IUnitOfWork';
import type { IUserRepository } from '../../application/interfaces/repositories/IUserRepository';
import { UnitOfWork } from '../PrismaUnitOfWork';
import { UserRepository } from '../repositories/UserRepository';
import  { CreateUserUseCase } from '../../application/usesCase/user/CreateUser';
import  { GetUserUseCase } from '../../application/usesCase/user/GetUserUseCase';
import  { UserController } from '../../presentation/controllers/UserController';
import { LoginUserUseCase } from '../../application/usesCase/user/LoginUserUseCase';
import  { AuthController } from '../../presentation/controllers/AuthController';
import  { GetUsersUseCase } from '../../application/usesCase/user/GerUsersUseCase';

 

 
 

// Use Cases
 

 

const container = new Container();

// Database
container.bind<PrismaClient>(Types.PrismaClient)
  .toConstantValue(new PrismaClient())
   

// Unit of Work
container.bind<IUnitOfWork>(Types.IUnitOfWork)
  .to(UnitOfWork)
  .inSingletonScope();

// Repositories
container.bind<IUserRepository>(Types.IUserRepository)
  .to(UserRepository)
  .inSingletonScope();

// Use Cases - User
container.bind<CreateUserUseCase>(Types.CreateUserUseCase)
  .to(CreateUserUseCase)
  .inTransientScope();

container.bind<GetUserUseCase>(Types.GetUserUseCase)
  .to(GetUserUseCase)
  .inTransientScope();

container.bind<GetUsersUseCase>(Types.GetUsersUseCase)
  .to(GetUsersUseCase)
  .inTransientScope();

// container.bind<UpdateUserUseCase>(UpdateUserUseCase)
//   .to(UpdateUserUseCase)
//   .inTransientScope();

// container.bind<DeleteUserUseCase>(DeleteUserUseCase)
//   .to(DeleteUserUseCase)
//   .inTransientScope();

// // Use Cases - Auth
 

container.bind<LoginUserUseCase>(Types.LoginUserUseCase)
  .to(LoginUserUseCase)
  .inTransientScope();

// container.bind<ValidateTokenUseCase>(ValidateTokenUseCase)
//   .to(ValidateTokenUseCase)
//   .inTransientScope();

// Controllers
container.bind<UserController>(Types.UserController)
  .to(UserController)
  .inTransientScope();

container.bind<AuthController>(Types.AuthController)
  .to(AuthController)
  .inTransientScope();

export { container };