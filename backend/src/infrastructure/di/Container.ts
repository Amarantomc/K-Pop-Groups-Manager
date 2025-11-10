
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
import  { GetApprenticeUseCase } from '../../application/usesCase/apprentice/GetApprenticeUseCase';
import type { IApprenticeRepository } from '../../application/interfaces/repositories/IApprenticeRepository';
import { ApprenticeRepository } from '../repositories/ApprenticeRepository';
import  { UpdateApprenticeUseCase } from '../../application/usesCase/apprentice/UpdateApprentice';
import { DeleteApprenticeUseCase } from '../../application/usesCase/apprentice/DeleteApprentice';
import  { CreateApprenticeUseCase } from '../../application/usesCase/apprentice/CreateApprentice';
import { ApprenticeController } from '../../presentation/controllers/ApprenticeController';
import  { AgencyController } from '../../presentation/controllers/AgencyController';
import  { CreateAgencyUseCase } from '../../application/usesCase/agency/CreateAgencyUseCase';
import { DeleteAgencyUseCase } from '../../application/usesCase/agency/DeleteAgencyUseCase';
import { FindAgenciesByAddressUseCase } from '../../application/usesCase/agency/FindAgenciesByAddressUseCase';
import { FindAgenciesByFoundationUseCase } from '../../application/usesCase/agency/FindAgenciesByFoundationUseCase';
import { FindAgenciesByNameUseCase } from '../../application/usesCase/agency/FindAgenciesByNameUseCase';
import { GetAgencyUseCase } from '../../application/usesCase/agency/GetAgencyUseCase';
import { ListAgenciesUseCase } from '../../application/usesCase/agency/ListAgenciesUseCase';
import { UpdateAgencyUseCase } from '../../application/usesCase/agency/UpdateAgencyUseCase';
import type { IAgencyRepository } from '../../application/interfaces/repositories/IAgencyRepository';
import { AgencyRepository } from '../repositories/AgencyRepository';

 

 
 

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

  container.bind<IApprenticeRepository>(Types.IApprenticeRepository)
  .to(ApprenticeRepository)
  .inSingletonScope();

  container.bind<IAgencyRepository>(Types.IAgencyRepository)
  .to(AgencyRepository)
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

  container.bind<GetApprenticeUseCase>(Types.GetApprenticeUseCase)
  .to(GetApprenticeUseCase)
  .inTransientScope();

  container.bind<UpdateApprenticeUseCase>(Types.UpdateApprenticeUseCase)
  .to(UpdateApprenticeUseCase)
  .inTransientScope();

  container.bind<DeleteApprenticeUseCase>(Types.DeleteApprenticeUseCase)
  .to(DeleteApprenticeUseCase)
  .inTransientScope();

   container.bind<CreateApprenticeUseCase>(Types.CreateApprenticeUseCase)
  .to(CreateApprenticeUseCase)
  .inTransientScope();

   container.bind<CreateAgencyUseCase>(Types.CreateAgencyUseCase)
  .to(CreateAgencyUseCase)
  .inTransientScope();

  container.bind<DeleteAgencyUseCase>(Types.DeleteAgencyUseCase)
  .to(DeleteAgencyUseCase)
  .inTransientScope();

  container.bind<FindAgenciesByAddressUseCase>(Types.FindAgenciesByAddressUseCase)
  .to(FindAgenciesByAddressUseCase)
  .inTransientScope();

  container.bind<FindAgenciesByFoundationUseCase>(Types.FindAgenciesByFoundationUseCase)
  .to(FindAgenciesByFoundationUseCase)
  .inTransientScope();

  container.bind<FindAgenciesByNameUseCase>(Types.FindAgenciesByNameUseCase)
  .to(FindAgenciesByNameUseCase)
  .inTransientScope();

  container.bind<GetAgencyUseCase>(Types.GetAgencyUseCase)
  .to(GetAgencyUseCase)
  .inTransientScope();

  container.bind<ListAgenciesUseCase>(Types.ListAgenciesUseCase)
  .to(ListAgenciesUseCase)
  .inTransientScope();

  container.bind<UpdateAgencyUseCase>(Types.UpdateAgencyUseCase)
  .to(UpdateAgencyUseCase)
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

container.bind<ApprenticeController>(Types.ApprenticeController)
  .to(ApprenticeController)
  .inTransientScope();

container.bind<AgencyController>(Types.AgencyController)
  .to(AgencyController)
  .inTransientScope();

export { container };