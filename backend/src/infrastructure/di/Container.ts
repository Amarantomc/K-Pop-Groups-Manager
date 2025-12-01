
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
import { DeleteUserUseCase } from '../../application/usesCase/user/DeleteUserUseCase';
import { UpdateUserUseCase } from '../../application/usesCase/user/UpdateUserUseCase';
import { ListApprenticeUseCase } from '../../application/usesCase/apprentice/ListApprenticeUseCase';
import type { IArtistRepository } from '../../application/interfaces/repositories/IArtistRepository';
import { ArtistRepository } from '../repositories/ArtistRepository';
import { ArtistController } from '../../presentation/controllers/ArtistController';
import { CreateArtistUseCase } from '../../application/usesCase/artist/CreateArtistUseCase';
import { UpdateArtistUseCase } from '../../application/usesCase/artist/UpdateArtistUseCase';
import { DeleteArtistUseCase } from '../../application/usesCase/artist/DeleteArtistUseCase';
import { FindArtistByIdUseCase } from '../../application/usesCase/artist/FindArtistByIdUseCase';
import  { GetAllArtistsUseCase } from '../../application/usesCase/artist/GetAllArtistsUseCase';
import  { FindArtistByAgencyUseCase } from '../../application/usesCase/artist/FindArtistByAgencyUseCase';
import { ListByAgencyUseCase } from '../../application/usesCase/apprentice/ListByAgencyUseCase';
import { GetApprenticeByNameUseCase } from '../../application/usesCase/apprentice/GetApprenticeByNameUseCase';
import { ConceptController } from '../../presentation/controllers/ConceptController';
import type { IConceptRepository } from '../../application/interfaces/repositories/IConceptRepository';
import { ConceptRepository } from '../repositories/ConceptRepository';
import { CreateConceptUseCase } from '../../application/usesCase/concept/CreateConcept';
import { DeleteConceptUseCase } from '../../application/usesCase/concept/DeleteConcept';
import { GetConceptUseCase } from '../../application/usesCase/concept/GetConceptUseCase';
import { ListConceptUseCase } from '../../application/usesCase/concept/ListConceptUSeCase';
import { UpdateConceptUseCase } from '../../application/usesCase/concept/UpdateConcept';
import type { IActivityRepository } from '../../application/interfaces/repositories/IActivityRepository';
import { CreateActivityUseCase } from '../../application/usesCase/activity/CreateActivityUseCase';
import { DeleteActivityUseCase } from '../../application/usesCase/activity/DeleteActivityUseCase';
import { FindActivityByIdUseCase } from '../../application/usesCase/activity/FindActivityByIdUseCase';
import { GetAllActivitiesUseCase } from '../../application/usesCase/activity/GetAllActivitiesUseCase';
import { UpdateActivityUseCase } from '../../application/usesCase/activity/UpdateActivityUseCase';
import { ActivityController } from '../../presentation/controllers/ActivityController';
import { ActivityRepository } from '../repositories/ActivityRepository';
import { FindActivitiesByArtist } from '../../application/usesCase/activity/FindActivitiesByArtist';
import { AddArtistToActivityUseCase } from '../../application/usesCase/activity/AddArtistToActivityUseCase';
import type { IPopularityListRepository } from '../../application/interfaces/repositories/IPopularityListRepository';
import { CreatePopularityListUseCase } from '../../application/usesCase/popularityList/CreatePopularityListUseCase';
import { GetPopularityListUseCase } from '../../application/usesCase/popularityList/GetPopularityListUseCase';
import { DeletePopularityListUseCase } from '../../application/usesCase/popularityList/DeletePopularityListUseCase';
import { UpdatePopularityListUseCase } from '../../application/usesCase/popularityList/UpdatePopularityListUseCase';
import { AddSongToPopularityListUseCase } from '../../application/usesCase/popularityList/AddSongToPopularityListUseCase';
import { PopularityListRepository } from '../repositories/PopularityListRepository';

 

 
 

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

  container.bind<IArtistRepository>(Types.IArtistRepository)
  .to(ArtistRepository)
  .inSingletonScope();

  container.bind<IConceptRepository>(Types.IConceptRepository)
  .to(ConceptRepository)
  .inSingletonScope();

  container.bind<IActivityRepository>(Types.IActivityRepository)
  .to(ActivityRepository)
  container.bind<IPopularityListRepository>(Types.IPopularityListRepository)
  .to(PopularityListRepository)
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

container.bind<DeleteUserUseCase>(Types.DeleteUserUseCase)
  .to(DeleteUserUseCase)
  .inTransientScope();

container.bind<UpdateUserUseCase>(Types.UpdateUserUseCase)
  .to(UpdateUserUseCase)
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

  container.bind<ListApprenticeUseCase>(Types.ListApprenticeUseCase)
  .to(ListApprenticeUseCase)
  .inTransientScope();

  container.bind<GetApprenticeByNameUseCase>(Types.GetApprenticeByNameUseCase)
  .to(GetApprenticeByNameUseCase)
  .inTransientScope();

  
  
  container.bind<ListByAgencyUseCase>(Types.ListByAgencyUseCase)
  .to(ListByAgencyUseCase)
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

  container.bind<CreateArtistUseCase>(Types.CreateArtistUseCase)
  .to(CreateArtistUseCase)
  .inTransientScope();

  container.bind<UpdateArtistUseCase>(Types.UpdateArtistUseCase)
  .to(UpdateArtistUseCase)
  .inTransientScope();
  
  container.bind<DeleteArtistUseCase>(Types.DeleteArtistUseCase)
  .to(DeleteArtistUseCase)
  .inTransientScope();

   container.bind<FindArtistByIdUseCase>(Types.FindArtistByIdUseCase)
  .to(FindArtistByIdUseCase)
  .inTransientScope();

  container.bind<GetAllArtistsUseCase>(Types.GetAllArtistsUseCase)
  .to(GetAllArtistsUseCase)
  .inTransientScope();

  container.bind<FindArtistByAgencyUseCase>(Types.FindArtistByAgencyUseCase)
  .to(FindArtistByAgencyUseCase)
  .inTransientScope();


   container.bind<CreateConceptUseCase>(Types.CreateConceptUseCase)
  .to(CreateConceptUseCase)
  .inTransientScope();

  container.bind<DeleteConceptUseCase>(Types.DeleteConceptUseCase)
  .to(DeleteConceptUseCase)
  .inTransientScope();

  container.bind<GetConceptUseCase>(Types.GetConceptUseCase)
  .to(GetConceptUseCase)
  .inTransientScope();

  container.bind<ListConceptUseCase>(Types.ListConceptUseCase)
  .to(ListConceptUseCase)
  .inTransientScope();

    container.bind<UpdateConceptUseCase>(Types.UpdateConceptUseCase)
  .to(UpdateConceptUseCase)
  .inTransientScope();

  container.bind<CreatePopularityListUseCase>(Types.CreatePopularityListUseCase)
  .to(CreatePopularityListUseCase)
  .inTransientScope();

container.bind<GetPopularityListUseCase>(Types.GetPopularityListUseCase)
  .to(GetPopularityListUseCase)
  .inTransientScope();

container.bind<GetPopularityListUseCase>(Types.ListPopularityListsUseCase)
  .to(GetPopularityListUseCase)
  .inTransientScope();

container.bind<DeletePopularityListUseCase>(Types.DeletePopularityListUseCase)
  .to(DeletePopularityListUseCase)
  .inTransientScope();

container.bind<UpdatePopularityListUseCase>(Types.UpdatePopularityListUseCase)
  .to(UpdatePopularityListUseCase)
  .inTransientScope();

  container.bind<AddSongToPopularityListUseCase>(Types.AddSongToPopularityListUseCase)
  .to(AddSongToPopularityListUseCase)
  .inTransientScope();
// // Use Cases - Auth
 

container.bind<LoginUserUseCase>(Types.LoginUserUseCase)
  .to(LoginUserUseCase)
  .inTransientScope();


  container.bind<CreateActivityUseCase>(Types.CreateActivityUseCase)
  .to(CreateActivityUseCase)
  .inTransientScope();

container.bind<UpdateActivityUseCase>(Types.UpdateActivityUseCase)
  .to(UpdateActivityUseCase)
  .inTransientScope();

container.bind<DeleteActivityUseCase>(Types.DeleteActivityUseCase)
  .to(DeleteActivityUseCase)
  .inTransientScope();

container.bind<FindActivityByIdUseCase>(Types.FindActivityByIdUseCase)
  .to(FindActivityByIdUseCase)
  .inTransientScope();

container.bind<GetAllActivitiesUseCase>(Types.GetAllActivitiesUseCase)
  .to(GetAllActivitiesUseCase)
  .inTransientScope();

container.bind<FindActivitiesByArtist>(Types.FindActivitiesByArtist)
  .to(FindActivitiesByArtist)
  .inTransientScope();

  container.bind<AddArtistToActivityUseCase>(Types.AddArtistToActivityUseCase)
  .to(AddArtistToActivityUseCase)
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

  container.bind<ArtistController>(Types.ArtistController)
  .to(ArtistController)
  .inTransientScope();

  container.bind<ConceptController>(Types.ConceptController)
  .to(ConceptController)
  .inTransientScope();

  container.bind<ActivityController>(Types.ActivityController)
  .to(ActivityController)
  .inTransientScope();

  

export { container };