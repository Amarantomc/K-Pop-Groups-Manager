// src/infrastructure/di/TYPES.ts
const Types = {
  // Database
  PrismaClient: Symbol.for('PrismaClient'),
  
  //  Interfaces
  IUnitOfWork: Symbol.for('IUnitOfWork'),
  IUserRepository: Symbol.for('IUserRepository'),
  IApprenticeRepository : Symbol.for('IApprenticeRepository'),
  
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
   
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  ValidateTokenUseCase: Symbol.for('ValidateTokenUseCase'),
  
  // Presentation
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController'),
  ApprenticeController : Symbol.for('ApprenticeController')
};

export { Types };