
 
 

import type { IGroupRepository } from "../../application/interfaces/repositories/IGroupRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { GroupController } from "../../presentation/controllers/GroupController";
import { CreateGroupUseCase } from "../../application/usesCase/group/CreateGroupUseCase";
import { GetGroupUseCase } from "../../application/usesCase/group/GetGroupUseCase";
import { ListGroupsUseCase } from "../../application/usesCase/group/ListGroupsUseCase";
import { UpdateGroupUseCase } from "../../application/usesCase/group/UpdateGroupUseCase";
import { DeleteGroupUseCase } from "../../application/usesCase/group/DeleteGroupUseCase";
import { AddMembersUseCase } from "../../application/usesCase/group/AddMembersUseCase";
import { RemoveMembersUseCase } from "../../application/usesCase/group/RemoveMembersUseCase";
import { AddAlbumsUseCase } from "../../application/usesCase/group/AddAlbumsUseCase";
import { AddActivitiesUseCase } from "../../application/usesCase/group/AddActivitiesUseCase";
import { FindGroupByNameUseCase } from "../../application/usesCase/group/FindGroupByNameUseCase";
import { FindGroupByDebutUseCase } from "../../application/usesCase/group/FindGroupByDebutUseCase";
import { FindGroupsByStatusUseCase } from "../../application/usesCase/group/FindGroupsByStatusUseCase";
import { FindGroupsByMemberCountUseCase } from "../../application/usesCase/group/FindGroupsByMemberCountUseCase";
import { FindGroupsByMemberUseCase } from "../../application/usesCase/group/FindGroupsByMemberUseCase";
import { FindGroupsByAgencyUseCase } from "../../application/usesCase/group/FindGroupsByAgencyUseCase";
import { FindGroupsByConceptUseCase } from "../../application/usesCase/group/FindGroupsByConceptUseCase";
import { FindGroupByVisualConceptUseCase } from "../../application/usesCase/group/FindGroupByVisualConceptUseCase";

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
import { PopularityListController } from '../../presentation/controllers/PopularityListController';
import { ListPopularityListUseCase } from '../../application/usesCase/popularityList/ListPopularityListUseCase';

import { CreateApplicationUseCase } from "../../application/usesCase/application(solicitud)/CreateApplicatonUseCase";
import { GetApplicationUseCase } from "../../application/usesCase/application(solicitud)/GetApplicationUseCase";
import { DeleteApplicationUseCase } from "../../application/usesCase/application(solicitud)/DeleteApplicationUseCase";
import { ListApplicationUseCase } from "../../application/usesCase/application(solicitud)/ListApplicationUseCase";
//import { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import { UpdateApplicationUseCase } from "../../application/usesCase/application(solicitud)/UpdateApplicationUseCase";

import { VisualConceptRepository } from '../repositories/VisualConceptRepository';
import { CreateVisualConceptUseCase } from '../../application/usesCase/visualConcept/CreateVisualConceptUseCase';
import { DeleteVisualConceptUseCase } from '../../application/usesCase/visualConcept/DeleteVisualConceptUseCase';
import { GetVisualConceptUseCase } from '../../application/usesCase/visualConcept/GetConceptUseCase';
import { ListVisualConceptUseCase } from '../../application/usesCase/visualConcept/ListVisualConceptUseCase';
import { UpdateVisualConceptUseCase } from '../../application/usesCase/visualConcept/UpdateVisualConceptUseCase';
//import type { IVisualConceptRepository } from '../../application/interfaces/repositories/IVisualConcept';
import  { VisualConceptController } from '../../presentation/controllers/VisualConceptController';
import { CreateAwardUseCase } from '../../application/usesCase/award/CreateAwardUseCase';
import { DeleteAwardUseCase } from '../../application/usesCase/award/DeleteAwardUseCase';
import { GetAwardUseCase } from '../../application/usesCase/award/GetAwardUseCase';
import { ListAwardUseCase } from '../../application/usesCase/award/ListAwardUseCase';
import { UpdateAwardUseCase } from '../../application/usesCase/award/UpdateAwardUseCase';
import { AwardController } from '../../presentation/controllers/AwardController';
import type { IAwardRepository } from '../../application/interfaces/repositories/IAwardRepository';
import { AwardRepository } from '../repositories/AwardRepository';
import type { IContractRepository } from "../../application/interfaces/repositories/IContractRepository";
import { ContractRepository } from "../repositories/ContractRepository";
import { ContractController } from "../../presentation/controllers/ContractController";
import type { IVisualConceptRepository } from "../../application/interfaces/repositories/IVisualConcept";
import { CreateContractUseCase } from "../../application/usesCase/contract/CreateContractUseCase";
import { DeleteContractUseCase } from "../../application/usesCase/contract/DeleteContractUseCase";
import { UpdateContractUseCase } from "../../application/usesCase/contract/UpdateContractUseCase";
import { GetAllContractUseCase } from "../../application/usesCase/contract/GetAllContractUseCase";
import { FindContractByIdUseCase } from "../../application/usesCase/contract/FindContractByIdUseCase";
import { FindActivitiesByGroupUseCase } from "../../application/usesCase/activity/FindActivitiesByGroupUseCase";
import { ApplicationController } from "../../presentation/controllers/ApplicationController";
import type { IApplicationRepository } from "../../application/interfaces/repositories/IApplicationRepository";
import { ApplicationRepository } from "../repositories/ApplicationRepository";
import { SongController } from "../../presentation/controllers/SongController";
import { CreateSongUseCase } from "../../application/usesCase/song/CreateSongUseCase";
import { DeleteSongUseCase } from "../../application/usesCase/song/DeleteSongUseCase";
import { FindSongByIdUseCase } from "../../application/usesCase/song/FindSongByIdUseCase";
import type { ISongRepository } from "../../application/interfaces/repositories/ISongRepository";
import { SongRepository } from "../repositories/SongRepository";
import { UpdateSongUseCase } from "../../application/usesCase/song/UpdateSongUseCase";
import { GetAllSongsUseCase } from "../../application/usesCase/song/GetAllSongsUseCase";
import type { IIncomeRepository } from "../../application/interfaces/repositories/IIncomeRepository";
import { IncomeRepository } from "../repositories/IncomeRepository";
import { CreateIncomeUseCase } from "../../application/usesCase/income/CreateIncomeUseCase";
import { DeleteIncomeUseCase } from "../../application/usesCase/income/DeleteIncomeUseCase";
import { GetIncomeUseCase } from "../../application/usesCase/income/GetIncomeUseCase";
import { ListIncomeUseCase } from "../../application/usesCase/income/ListIncomeUseCase";
import { UpdateIncomeUseCase } from "../../application/usesCase/income/UpdateIncomeUseCase";
import { IncomeController } from "../../presentation/controllers/IncomeController";
import { CreateGroupToApplicationUseCase } from "../../application/usesCase/application(solicitud)/CreateGroupToApplicationUseCase";
import type { IAlbumRepository } from "../../application/interfaces/repositories/IAlbumRepository";
import { AlbumRepository } from "../repositories/AlbumRepository";
import { ListAlbumUseCase } from "../../application/usesCase/album/ListAlbumUseCase";
import { CreateAlbumUseCase } from "../../application/usesCase/album/CreateAlbumUseCase";
import { DeleteAlbumUseCase } from "../../application/usesCase/album/DeleteAlbumUseCase";
import { UpdateAlbumUseCase } from "../../application/usesCase/album/UpdateAlbumUseCase";
import { GetAlbumUseCase } from "../../application/usesCase/album/GetAlbumUseCase";
import { AlbumController } from "../../presentation/controllers/AlbumController";
import { GetArtistsOnDebutUseCase } from "../../application/usesCase/artist/GetArtistsOnDebutUseCase";
 
const container=new Container()
 
 

// Use Cases

// Database
container
	.bind<PrismaClient>(Types.PrismaClient)
	.toConstantValue(new PrismaClient());

// Unit of Work
container
	.bind<IUnitOfWork>(Types.IUnitOfWork)
	.to(UnitOfWork)
	.inSingletonScope();

  //#region Repositories
  // Repositories
 
 
container
	.bind<IUserRepository>(Types.IUserRepository)
	.to(UserRepository)
	.inSingletonScope();

container
	.bind<IApprenticeRepository>(Types.IApprenticeRepository)
	.to(ApprenticeRepository)
	.inSingletonScope();

  container
	.bind<IApplicationRepository>(Types.IApplicationRepository)
	.to(ApplicationRepository)
	.inSingletonScope();

  container
	.bind<IIncomeRepository>(Types.IIncomeRepository)
	.to(IncomeRepository)
	.inSingletonScope();


  container
	.bind<IAlbumRepository>(Types.IAlbumRepository)
	.to(AlbumRepository)
	.inSingletonScope();


container
	.bind<IAgencyRepository>(Types.IAgencyRepository)
	.to(AgencyRepository)
	.inSingletonScope();

container
	.bind<IGroupRepository>(Types.IGroupRepository)
	.to(GroupRepository)
	.inSingletonScope();

  container.bind<IArtistRepository>(Types.IArtistRepository)
  .to(ArtistRepository)
  .inSingletonScope();

  container.bind<IConceptRepository>(Types.IConceptRepository)
  .to(ConceptRepository)
  .inSingletonScope();

  container.bind<IAwardRepository>(Types.IAwardRepository)
  .to(AwardRepository)
  .inSingletonScope();

  container.bind<IActivityRepository>(Types.IActivityRepository)
  .to(ActivityRepository)

  container.bind<IPopularityListRepository>(Types.IPopularityListRepository)
  .to(PopularityListRepository)
  .inSingletonScope();

  container.bind<IContractRepository>(Types.IContractRepository)
  .to(ContractRepository)
  .inSingletonScope();

   container.bind<IVisualConceptRepository>(Types.IVisualConceptRepository)
  .to(VisualConceptRepository)
  .inSingletonScope();

  container.bind<ISongRepository>(Types.ISongRepository)
  .to(SongRepository)
  .inSingletonScope();

  //#endregion

// Use Cases - User
 // Use Cases - Group
 //#region Group
container
	.bind<CreateGroupUseCase>(Types.CreateGroupUseCase)
	.to(CreateGroupUseCase)
	.inTransientScope();

container
	.bind<GetGroupUseCase>(Types.GetGroupUseCase)
	.to(GetGroupUseCase)
	.inTransientScope();

container
	.bind<ListGroupsUseCase>(Types.ListGroupsUseCase)
	.to(ListGroupsUseCase)
	.inTransientScope();

container
	.bind<UpdateGroupUseCase>(Types.UpdateGroupUseCase)
	.to(UpdateGroupUseCase)
	.inTransientScope();

container
	.bind<DeleteGroupUseCase>(Types.DeleteGroupUseCase)
	.to(DeleteGroupUseCase)
	.inTransientScope();

container
	.bind<AddMembersUseCase>(Types.AddMembersUseCase)
	.to(AddMembersUseCase)
	.inTransientScope();

container
	.bind<RemoveMembersUseCase>(Types.RemoveMembersUseCase)
	.to(RemoveMembersUseCase)
	.inTransientScope();

container
	.bind<AddAlbumsUseCase>(Types.AddAlbumsUseCase)
	.to(AddAlbumsUseCase)
	.inTransientScope();

container
	.bind<AddActivitiesUseCase>(Types.AddActivitiesUseCase)
	.to(AddActivitiesUseCase)
	.inTransientScope();

container
	.bind<FindGroupByNameUseCase>(Types.FindGroupsByNameUseCase)
	.to(FindGroupByNameUseCase)
	.inTransientScope();

container
	.bind<FindGroupByDebutUseCase>(Types.FindGroupsByDebutUseCase)
	.to(FindGroupByDebutUseCase)
	.inTransientScope();

container
	.bind<FindGroupsByStatusUseCase>(Types.FindGroupsByStatusUseCase)
	.to(FindGroupsByStatusUseCase)
	.inTransientScope();

container
	.bind<FindGroupsByMemberCountUseCase>(Types.FindGroupsByMemberCountUseCase)
	.to(FindGroupsByMemberCountUseCase)
	.inTransientScope();

container
	.bind<FindGroupsByMemberUseCase>(Types.FindGroupsByMemberUseCase)
	.to(FindGroupsByMemberUseCase)
	.inTransientScope();

container
	.bind<FindGroupsByAgencyUseCase>(Types.FindGroupsByAgencyUseCase)
	.to(FindGroupsByAgencyUseCase)
	.inTransientScope();

container
	.bind<FindGroupsByConceptUseCase>(Types.FindGroupsByConceptUseCase)
	.to(FindGroupsByConceptUseCase)
	.inTransientScope();

container
	.bind<FindGroupByVisualConceptUseCase>(Types.FindGroupsByVisualConceptUseCase)
	.to(FindGroupByVisualConceptUseCase)
	.inTransientScope();

  //#endregion

  //#region User
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

  //#endregion

  //#region Apprentice

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
 //#endregion
  
  //#region Agency
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
  //#endregion

  //#region Artist

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

   container.bind<GetArtistsOnDebutUseCase>(Types.GetArtistsOnDebutUseCase)
  .to(GetArtistsOnDebutUseCase)
  .inTransientScope();
  //#endregion

  //#region Concept

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

  //#endregion


//#region Income

container.bind<CreateIncomeUseCase>(Types.CreateIncomeUseCase)
.to(CreateIncomeUseCase)
.inTransientScope();

container.bind<DeleteIncomeUseCase>(Types.DeleteIncomeUseCase)
.to(DeleteIncomeUseCase)
.inTransientScope();

container.bind<GetIncomeUseCase>(Types.GetIncomeUseCase)
.to(GetIncomeUseCase)
.inTransientScope();

container.bind<ListIncomeUseCase>(Types.ListIncomeUseCase)
.to(ListIncomeUseCase)
.inTransientScope();

  container.bind<UpdateIncomeUseCase>(Types.UpdateIncomeUseCase)
.to(UpdateIncomeUseCase)
.inTransientScope();

//#endregion




  //#region Popularity

  container.bind<CreatePopularityListUseCase>(Types.CreatePopularityListUseCase)
  .to(CreatePopularityListUseCase)
  .inTransientScope();

container.bind<GetPopularityListUseCase>(Types.GetPopularityListUseCase)
  .to(GetPopularityListUseCase)
  .inTransientScope();

container.bind<ListPopularityListUseCase>(Types.ListPopularityListsUseCase)
  .to(ListPopularityListUseCase)
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

  //#endregion


//#region Application

  container.bind<GetApplicationUseCase>(Types.GetApplicationUseCase)
  .to(GetApplicationUseCase)
  .inTransientScope();

  container.bind<UpdateApplicationUseCase>(Types.UpdateApplicationUseCase)
  .to(UpdateApplicationUseCase)
  .inTransientScope();

  container.bind<DeleteApplicationUseCase>(Types.DeleteApplicationUseCase)
  .to(DeleteApplicationUseCase)
  .inTransientScope();

   container.bind<CreateApplicationUseCase>(Types.CreateApplicationUseCase)
  .to(CreateApplicationUseCase)
  .inTransientScope();

  container.bind<ListApplicationUseCase>(Types.ListApplicationUseCase)
  .to(ListApplicationUseCase)
  .inTransientScope();

  container.bind<CreateGroupToApplicationUseCase>(Types.CreateGroupToApplicationUseCase)
  .to(CreateGroupToApplicationUseCase)
  .inTransientScope();

  //#endregion



//#region Album

  container.bind<GetAlbumUseCase>(Types.GetAlbumUseCase)
  .to(GetAlbumUseCase)
  .inTransientScope();

  container.bind<UpdateAlbumUseCase>(Types.UpdateAlbumUseCase)
  .to(UpdateAlbumUseCase)
  .inTransientScope();

  container.bind<DeleteAlbumUseCase>(Types.DeleteAlbumUseCase)
  .to(DeleteAlbumUseCase)
  .inTransientScope();

   container.bind<CreateAlbumUseCase>(Types.CreateAlbumUseCase)
  .to(CreateAlbumUseCase)
  .inTransientScope();

  container.bind<ListAlbumUseCase>(Types.ListAlbumUseCase)
  .to(ListAlbumUseCase)
  .inTransientScope();

//#endregion

  // // Use Cases - Auth

//#region Auth
container
	.bind<LoginUserUseCase>(Types.LoginUserUseCase)
	.to(LoginUserUseCase)
	.inTransientScope();
//#endregion

//#region Activity

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

   container.bind<FindActivitiesByGroupUseCase>(Types.FindActivitiesByGroupUseCase)
  .to(FindActivitiesByGroupUseCase)
  .inTransientScope();

  //#endregion

  //#region Award Use Case
  container.bind<CreateAwardUseCase>(Types.CreateAwardUseCase)
  .to(CreateAwardUseCase)
  .inTransientScope();

  container.bind<DeleteAwardUseCase>(Types.DeleteAwardUseCase)
  .to(DeleteAwardUseCase)
  .inTransientScope();

  container.bind<GetAwardUseCase>(Types.GetAwardUseCase)
  .to(GetAwardUseCase)
  .inTransientScope();

  container.bind<ListAwardUseCase>(Types.ListAwardUseCase)
  .to(ListAwardUseCase)
  .inTransientScope();

    container.bind<UpdateAwardUseCase>(Types.UpdateAwardUseCase)
  .to(UpdateAwardUseCase)
  .inTransientScope();
//#endregion

// container.bind<ValidateTokenUseCase>(ValidateTokenUseCase)
//   .to(ValidateTokenUseCase)
//   .inTransientScope();

 //#region VisualConcept  
container.bind<CreateVisualConceptUseCase>(Types.CreateVisualConceptUseCase)
  .to(CreateVisualConceptUseCase)
  .inTransientScope();

  container.bind<DeleteVisualConceptUseCase>(Types.DeleteVisualConceptUseCase)
  .to(DeleteVisualConceptUseCase)
  .inTransientScope();

  container.bind<GetVisualConceptUseCase>(Types.GetVisualConceptUseCase)
  .to(GetVisualConceptUseCase)
  .inTransientScope();

  container.bind<ListVisualConceptUseCase>(Types.ListVisualConceptUseCase)
  .to(ListVisualConceptUseCase)
  .inTransientScope();

    container.bind<UpdateVisualConceptUseCase>(Types.UpdateVisualConceptUseCase)
  .to(UpdateVisualConceptUseCase)
  .inTransientScope();

  //#endregion

  //#region Contract
    container.bind<CreateContractUseCase>(Types.CreateContractUseCase)
  .to(CreateContractUseCase)
  .inTransientScope();

  container.bind<DeleteContractUseCase>(Types.DeleteContractUseCase)
  .to(DeleteContractUseCase)
  .inTransientScope();

  container.bind<UpdateContractUseCase>(Types.UpdateContractUseCase)
  .to(UpdateContractUseCase)
  .inTransientScope();

  container.bind<GetAllContractUseCase>(Types.GetAllContractsUseCase)
  .to(GetAllContractUseCase)
  .inTransientScope();

  container.bind<FindContractByIdUseCase>(Types.FindContractByIdUseCase)
  .to(FindContractByIdUseCase)
  .inTransientScope();
  //#endregion


  //#region Song UseCase
  container.bind<CreateSongUseCase>(Types.CreateSongUseCase)
  .to(CreateSongUseCase)
  .inTransientScope();

   container.bind<DeleteSongUseCase>(Types.DeleteSongUseCase)
  .to(DeleteSongUseCase)
  .inTransientScope();

  container.bind<FindSongByIdUseCase>(Types.FindSongByIdUseCase)
  .to(FindSongByIdUseCase)
  .inTransientScope();

  container.bind<UpdateSongUseCase>(Types.UpdateSongUseCase)
  .to(UpdateSongUseCase)
  .inTransientScope();

  container.bind<GetAllSongsUseCase>(Types.GetAllSongsUseCase)
  .to(GetAllSongsUseCase)
  .inTransientScope();

  //#endregion




















// Controllers
//#region Controllers














container
	.bind<GroupController>(Types.GroupController)
	.to(GroupController)
	.inTransientScope();

container.bind<UserController>(Types.UserController)
  .to(UserController)
  .inTransientScope();

container.bind<AuthController>(Types.AuthController)
  .to(AuthController)
  .inTransientScope();

container.bind<ApprenticeController>(Types.ApprenticeController)
  .to(ApprenticeController)
  .inTransientScope();

  container.bind<IncomeController>(Types.IncomeController)
  .to(IncomeController)
  .inTransientScope();

  container.bind<ApplicationController>(Types.ApplicationController)
  .to(ApplicationController)
  .inTransientScope();

  container.bind<AlbumController>(Types.AlbumController)
  .to(AlbumController)
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

  container.bind<AwardController>(Types.AwardController)
  .to(AwardController)
  .inTransientScope();

  container.bind<ActivityController>(Types.ActivityController)
  .to(ActivityController)
  .inTransientScope();

  container.bind<VisualConceptController>(Types.VisualConceptController)
  .to(VisualConceptController)
  .inTransientScope();
  container.bind<PopularityListController>(Types.PopularityListController)
  .to(PopularityListController)
  .inTransientScope();

  container.bind<ContractController>(Types.ContractController)
  .to(ContractController)
  .inTransientScope();

  container.bind<SongController>(Types.SongController)
  .to(SongController)
  .inTransientScope()
  
  //#endregion


  


export { container };
