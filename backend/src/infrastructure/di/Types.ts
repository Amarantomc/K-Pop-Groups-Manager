// src/infrastructure/di/TYPES.ts
const Types = {
    AlbumController: Symbol.for('AlbumController'),
    IAlbumRepository: Symbol.for('IAlbumRepository'),
    CreateAlbumUseCase: Symbol.for('CreateAlbumUseCase'),
    GetAlbumUseCase: Symbol.for('GetAlbumUseCase'),
    ListAlbumUseCase: Symbol.for('ListAlbumUseCase'),
    UpdateAlbumUseCase: Symbol.for('UpdateAlbumUseCase'),
    DeleteAlbumUseCase: Symbol.for('DeleteAlbumUseCase'),
  // Database
  PrismaClient: Symbol.for('PrismaClient'),
  
  //  Interfaces
  
  //#region Repositories 
  IUnitOfWork: Symbol.for('IUnitOfWork'),
  IUserRepository: Symbol.for('IUserRepository'),
  IApprenticeRepository : Symbol.for('IApprenticeRepository'),
  IApplicationRepository : Symbol.for('IApplicationRepository'),
  IAgencyRepository : Symbol.for('IAgencyRepository'),
  IArtistRepository : Symbol.for('IArtistRepository'),
  IConceptRepository: Symbol.for('IConceptRepository'),
  IActivityRepository: Symbol.for('IActivityRepository'),
  IVisualConceptRepository: Symbol.for('IVisualConceptRepository'),
  IAwardRepository: Symbol.for('IAwardRepository'),
  IPopularityListRepository: Symbol.for('IPopularityListRepository'),
  IGroupRepository : Symbol.for('IGroupRepository'),
  IContractRepository:Symbol.for('IContractRepository'),
  ISongRepository: Symbol.for('ISongRepository'),
  IIncomeRepository: Symbol.for('IIncomeRepository'),
  //#endregion
  
  // Use Cases
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
  GetArtistsOnDebutUseCase :Symbol.for('GetArtistsOnDebutUseCase'),

  CreateConceptUseCase: Symbol.for('CreateConceptUseCase'),
  DeleteConceptUseCase: Symbol.for('DeleteConceptUseCase'),
  GetConceptUseCase: Symbol.for('GetConceptUseCase'),
  UpdateConceptUseCase: Symbol.for('UpdateConceptUseCase'),
  ListConceptUseCase :Symbol.for('ListConceptUseCase'),

  CreateVisualConceptUseCase: Symbol.for('CreateVisualConceptUseCase'),
  DeleteVisualConceptUseCase: Symbol.for('DeleteVisualConceptUseCase'),
  GetVisualConceptUseCase: Symbol.for('GetVisualConceptUseCase'),
  UpdateVisualConceptUseCase: Symbol.for('UpdateVisualConceptUseCase'),
  ListVisualConceptUseCase :Symbol.for('ListVisualConceptUseCase'),

  CreatePopularityListUseCase: Symbol.for('CreatePopularityListUseCase'),
  GetPopularityListUseCase: Symbol.for('GetPopularityListUseCase'),
  ListPopularityListsUseCase: Symbol.for('GetPopularityListsUseCase'),
  UpdatePopularityListUseCase: Symbol.for('UpdatePopularityListUseCase'),
  DeletePopularityListUseCase: Symbol.for('DeletePopularityListUseCase'),
  AddSongToPopularityListUseCase: Symbol.for('AddSongToPopularityListUseCase'),
   
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  ValidateTokenUseCase: Symbol.for('ValidateTokenUseCase'),

//#region Activity
CreateActivityUseCase: Symbol.for('CreateActivityUseCase'),
UpdateActivityUseCase: Symbol.for('UpdateActivityUseCase'),
DeleteActivityUseCase: Symbol.for('DeleteActivityUseCase'),
FindActivityByIdUseCase: Symbol.for('FindActivityByIdUseCase'),
GetAllActivitiesUseCase: Symbol.for('GetAllActivitiesUseCase'),
FindActivitiesByArtist :Symbol.for('FindActivitiesByArtist'),
AddArtistToActivityUseCase:Symbol.for('AddArtistToActivityUseCase'),
FindActivitiesByGroupUseCase:Symbol.for('FindActivitiesByGroupUseCase'),
 
//#endregion 









//#region Application
CreateApplicationUseCase : Symbol.for('CreateApplicationUseCase'),
GetApplicationUseCase : Symbol.for('GetApplicationUseCase'),
DeleteApplicationUseCase : Symbol.for('DeleteApplicationUseCase'),
UpdateApplicationUseCase : Symbol.for('UpdateApplicationUseCase'),
ListApplicationUseCase : Symbol.for('ListApplicationUseCase'),
CreateGroupToApplicationUseCase : Symbol.for('CreateGroupToApplicationUseCase'),
//#endregion

//#region Income
CreateIncomeUseCase : Symbol.for('CreateIncomeUseCase'),
GetIncomeUseCase : Symbol.for('GetIncomeUseCase'),
DeleteIncomeUseCase : Symbol.for('DeleteIncomeUseCase'),
UpdateIncomeUseCase : Symbol.for('UpdateIncomeUseCase'),
ListIncomeUseCase : Symbol.for('ListIncomeUseCase'),
//#endregion





//#region Award
CreateAwardUseCase : Symbol.for('CreateAwardUseCase'),
GetAwardUseCase : Symbol.for('GetAwardUseCase'),
DeleteAwardUseCase : Symbol.for('DeleteAwardUseCase'),
UpdateAwardUseCase : Symbol.for('UpdateAwardUseCase'),
ListAwardUseCase : Symbol.for('ListAwardUseCase'),
//#endregion








//#region Group 
CreateGroupUseCase : Symbol.for('CreateGroupUseCase'),
GetGroupUseCase : Symbol.for('GetGroupUseCase'),
ListGroupsUseCase : Symbol.for('ListGroupsUseCase'),
UpdateGroupUseCase : Symbol.for('UpdateGroupUseCase'),
DeleteGroupUseCase : Symbol.for('DeleteGroupUseCase'),
AddMembersUseCase : Symbol.for('AddMembersUseCase'),
RemoveMembersUseCase : Symbol.for ('RemoveMembersUseCase'),
AddAlbumsUseCase : Symbol.for('AddAlbumsUseCase'),
AddActivitiesUseCase : Symbol.for('AddActivitiesUseCase'),
FindGroupsByNameUseCase : Symbol.for('FindGroupsByNameUseCase'),
FindGroupsByDebutUseCase : Symbol.for('FindGroupsByDebutUseCase'),
FindGroupsByStatusUseCase : Symbol.for('FindGroupsByStatusUseCase'),
FindGroupsByMemberCountUseCase : Symbol.for('FindGroupsByMemberCountUseCase'),
FindGroupsByMemberUseCase : Symbol.for('FindGroupsByMemberUseCase'),
FindGroupsByAgencyUseCase : Symbol.for('FindGroupsByAgencyUseCase'),
FindGroupsByConceptUseCase : Symbol.for('FindGroupsByConceptUseCase'),
FindGroupsByVisualConceptUseCase : Symbol.for('FindGroupsByVisualConceptUseCase'),
//#endregion








//#region Contract
CreateContractUseCase : Symbol.for('CreateContractUseCase'),
FindContractByIdUseCase : Symbol.for('FindContractByIdUseCase'),
GetAllContractsUseCase : Symbol.for('GetAllContractsUseCase'),
UpdateContractUseCase : Symbol.for('UpdateContractUseCase'),
DeleteContractUseCase : Symbol.for('DeleteContractUseCase'),
//#endregion

//#region Song
CreateSongUseCase : Symbol.for('CreateSongUseCase'),
FindSongByIdUseCase : Symbol.for('FindSongByIdUseCase'),
DeleteSongUseCase : Symbol.for('DeleteSongUseCase'),
UpdateSongUseCase : Symbol.for('UpdateSongUseCase'),
GetAllSongsUseCase : Symbol.for('GetAllSongsUseCase'),
//#endregion

//#region Album
//#endregion

  //#region Controllers 
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
  VisualConceptController : Symbol.for('VisualConceptController'),
  AwardController : Symbol.for('AwardController'),
  GroupController :Symbol.for('GroupController'),
  ContractController :Symbol.for('ContractController'),
  SongController :Symbol.for('SongController'),
  IncomeController :Symbol.for('IncomeController'),

  //#endregion

 
};

export { Types };
