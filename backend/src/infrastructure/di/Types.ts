


// src/infrastructure/di/TYPES.ts
const Types = {
  // Database
  PrismaClient: Symbol.for('PrismaClient'),
  
  //  Interfaces
  IUnitOfWork: Symbol.for('IUnitOfWork'),
  IUserRepository: Symbol.for('IUserRepository'),
  IApprenticeRepository : Symbol.for('IApprenticeRepository'),
  IAgencyRepository : Symbol.for('IAgencyRepository'),
  IArtistRepository : Symbol.for('IArtistRepository'),
  IConceptRepository: Symbol.for('IConceptRepository'),
  IActivityRepository: Symbol.for('IActivityRepository'),
  IAwardRepository: Symbol.for('IAwardRepository'),
  IPopularityListRepository: Symbol.for('IPopularityListRepository'),
  
  // Application Use Cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),

  CreateApprenticeUseCase: Symbol.for('CreateApprenticeUseCase'),
  DeleteApprenticeUseCase: Symbol.for('DeleteApprenticeUseCase'),
  GetApprenticeUseCase: Symbol.for('GetApprenticeUseCase'),
  UpdateApprenticeUseCase: Symbol.for('UpdateApprenticeUseCase'),
  ListApprenticeUseCase :Symbol.for('ListApprenticeUseCase'),
  ListByAgencyUseCase :Symbol.for('ListByAgencyUseCase'),
  GetApprenticeByNameUseCase :Symbol.for('GetApprenticeByNameUseCase'),

  CreateAgencyUseCase :Symbol.for('CreateAgencyUseCase'),
  DeleteAgencyUseCase :Symbol.for('DeleteAgencyUseCase'),
  FindAgenciesByAddressUseCase :Symbol.for(' FindAgenciesByAddressUseCase'),
  FindAgenciesByFoundationUseCase :Symbol.for('FindAgenciesByFoundationUseCase'),
  FindAgenciesByNameUseCase :Symbol.for('FindAgenciesByNameUseCase'),
  GetAgencyUseCase :Symbol.for('GetAgencyUseCase'),
  UpdateAgencyUseCase :Symbol.for('UpdateAgencyUseCase'),
  ListAgenciesUseCase :Symbol.for('ListAgenciesUseCase'),

  
  CreateArtistUseCase :Symbol.for('CreateArtistUseCase'),
  DeleteArtistUseCase :Symbol.for('DeleteArtistUseCase'),
  UpdateArtistUseCase :Symbol.for('UpdateArtistUseCase'),
  FindArtistByIdUseCase :Symbol.for('FindArtistByIdUseCase'),
  GetAllArtistsUseCase :Symbol.for('GetAllArtistsUseCase'),
  FindArtistByAgencyUseCase :Symbol.for('FindArtistByAgencyUseCase'),

  CreateConceptUseCase: Symbol.for('CreateConceptUseCase'),
  DeleteConceptUseCase: Symbol.for('DeleteConceptUseCase'),
  GetConceptUseCase: Symbol.for('GetConceptUseCase'),
  UpdateConceptUseCase: Symbol.for('UpdateConceptUseCase'),
  ListConceptUseCase :Symbol.for('ListConceptUseCase'),

  CreatePopularityListUseCase: Symbol.for('CreatePopularityListUseCase'),
  GetPopularityListUseCase: Symbol.for('GetPopularityListUseCase'),
  ListPopularityListsUseCase: Symbol.for('GetPopularityListsUseCase'),
  UpdatePopularityListUseCase: Symbol.for('UpdatePopularityListUseCase'),
  DeletePopularityListUseCase: Symbol.for('DeletePopularityListUseCase'),
  AddSongToPopularityListUseCase: Symbol.for('AddSongToPopularityListUseCase'),
   
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  ValidateTokenUseCase: Symbol.for('ValidateTokenUseCase'),


CreateActivityUseCase: Symbol.for('CreateActivityUseCase'),
UpdateActivityUseCase: Symbol.for('UpdateActivityUseCase'),
DeleteActivityUseCase: Symbol.for('DeleteActivityUseCase'),
FindActivityByIdUseCase: Symbol.for('FindActivityByIdUseCase'),
GetAllActivitiesUseCase: Symbol.for('GetAllActivitiesUseCase'),
FindActivitiesByArtist :Symbol.for('FindActivitiesByArtist'),
AddArtistToActivityUseCase:Symbol.for('AddArtistToActivityUseCase'),
 

CreateApplicationUseCase : Symbol.for('CreateApplicationUseCase'),
GetApplicationUseCase : Symbol.for('GetApplicationUseCase'),
DeleteApplicationUseCase : Symbol.for('DeleteApplicationUseCase'),
UpdateApplicationUseCase : Symbol.for('UpdateApplicationUseCase'),
ListApplicationUseCase : Symbol.for('ListApplicationUseCase'),
FindByApprenticeUseCase : Symbol.for('FindByApprenticeUseCase'),

//#region Award
CreateAwardUseCase : Symbol.for('CreateAwardUseCase'),
GetAwardUseCase : Symbol.for('GetAwardUseCase'),
DeleteAwardUseCase : Symbol.for('DeleteAwardUseCase'),
UpdateAwardUseCase : Symbol.for('UpdateAwardUseCase'),
ListAwardUseCase : Symbol.for('ListAwardUseCase'),
//#endregion


  // Presentation
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController'),
  ApprenticeController : Symbol.for('ApprenticeController'),
  AgencyController : Symbol.for('AgencyController'),
  ArtistController : Symbol.for('ArtistController'),
  ConceptController : Symbol.for('ConceptController'),
  ActivityController: Symbol.for('ActivityController'),
  PopularityListController : Symbol.for('PopularityListController'),
  ApplicationController : Symbol.for('ApplicationController'),
  AwardController : Symbol.for('AwardController'),



};

export { Types };