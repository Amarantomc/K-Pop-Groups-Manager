// src/infrastructure/di/TYPES.ts
const Types = {
  // Database
  PrismaClient: Symbol.for('PrismaClient'),
  
  //  Interfaces
  IUnitOfWork: Symbol.for('IUnitOfWork'),
  IUserRepository: Symbol.for('IUserRepository'),
  
  // Application Use Cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
  AuthenticateUserUseCase: Symbol.for('AuthenticateUserUseCase'),
  ValidateTokenUseCase: Symbol.for('ValidateTokenUseCase'),
  
  // Presentation
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController')
};

export { Types };