

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


   
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  ValidateTokenUseCase: Symbol.for('ValidateTokenUseCase'),
  
  // Presentation
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController'),
  ApprenticeController : Symbol.for('ApprenticeController'),
  AgencyController : Symbol.for('AgencyController'),
  ArtistController : Symbol.for('ArtistController'),


};

export { Types };