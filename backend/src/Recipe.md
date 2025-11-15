# Implementación de CRUD para una Nueva Entidad en el Proyecto K-Pop Groups Manager

Este documento describe cómo implementar un CRUD (Create, Read, Update, Delete) completo para una nueva entidad en el proyecto backend de K-Pop Groups Manager. El proyecto sigue una arquitectura limpia (Clean Architecture) con capas bien definidas: **Domain**, **Application**, **Infrastructure** y **Presentation**. Se utiliza InversifyJS para inyección de dependencias, Prisma como ORM para PostgreSQL, y Express.js para la API REST.

Las validaciones de datos se realizan en los DTOs (Data Transfer Objects) de la capa Application. El contenedor de dependencias (DI Container) maneja la resolución de interfaces y clases concretas.

Usaremos la entidad **User** (Usuario) como ejemplo práctico, extrayendo fragmentos de código del proyecto existente para ilustrar cada paso.

## Arquitectura General del Proyecto

- **Domain**: Contiene las entidades de negocio, enums y lógica pura. No depende de otras capas.
- **Application**: Contiene casos de uso (Use Cases), DTOs, interfaces de repositorios y lógica de aplicación. Depende solo de Domain.
- **Infrastructure**: Implementa las interfaces de Application (e.g., repositorios, Unit of Work). Usa Prisma para acceso a datos y Inversify para DI.
- **Presentation**: Controladores y rutas de Express. Maneja HTTP requests/responses y delega a Use Cases.

Cada entidad requiere:
- Entidad en Domain.
- DTOs en Application (Create, Response).
- Interfaces de repositorio en Application.
- Implementación de repositorio en Infrastructure.
- Use Cases en Application.
- Controlador y rutas en Presentation.
- Registro en el DI Container.

## Explicación Detallada por Capas

### 1. Capa Domain
Esta capa define las entidades de negocio y enums. No incluye lógica de aplicación ni acceso a datos.

- **Entidades**: Clases inmutables que representan objetos de negocio. Usan constructores para validar datos básicos.
- **Enums**: Definiciones de valores constantes (e.g., roles, estados).

Para una nueva entidad:
- Crear la clase entidad en [`src/domain/entities`](src/domain/entities ).
- Si necesita enums, crearlos en [`src/domain/enums`](src/domain/enums ).

**Ejemplo con User**:
```ts
import type { Role } from "../enums/Role";

export default class User {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly rol: Role;
    
    constructor(attrs: { id: number, name: string, email: string, password: string, rol: Role }) {
        this.id = attrs.id;
        this.email = attrs.email;
        this.name = attrs.name;
        this.password = attrs.password;
        this.rol = attrs.rol;
    }
}
```

### 2. Capa Application
Maneja la lógica de negocio a través de Use Cases. Incluye DTOs para validaciones, interfaces de repositorios y Unit of Work.

- **DTOs**: Validan y transforman datos de entrada/salida. Usan métodos estáticos como [`create()`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/application/dtos/agency/CreateAgencyDTO.ts ) para validaciones.
- **Interfaces de Repositorios**: Definen contratos para acceso a datos (extienden [`IBaseRepository`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/application/interfaces/repositories/IBaseRepository.ts )).
- **Use Cases**: Implementan operaciones CRUD. Usan repositorios y Unit of Work para transacciones.
- **IUnitOfWork**: Interfaz para manejar transacciones de base de datos.

Para una nueva entidad:
- Crear DTOs en `src/application/dtos/<entity>/`.
- Crear interfaz de repositorio en [`src/application/interfaces/repositories`](src/application/interfaces/repositories ).
- Crear Use Cases en `src/application/usesCase/<entity>/`.
- Usar `@injectable()` y `@inject()` para DI.

**Ejemplo con User**:
- **DTO Create**:
```ts
import { Role } from "../../../domain/enums/Role";

export class CreateUserDto {
    constructor(
        public readonly email: string,
        public readonly name: string,
        private password: string,
        public readonly rol: string
    ) {}

    static Create(body: any): CreateUserDto {
        if (!body.email || !body.name || !body.password || !body.rol) {
            throw new Error('Missing required fields');
        }
        if (!(body.rol in Role)) {
            throw new Error('Invalid Role');
        }
        return new CreateUserDto(body.email, body.name, body.password, body.rol);
    }
    
    public SetHashedPassword(hash: any) {
        this.password = hash;
    }
    
    public GetPassword() {
        return this.password;
    }
}
```

- **DTO Response**:
```ts
import { User } from "../../../domain";

export class UserResponseDto {
    constructor(
        public readonly id: number,
        public readonly email: string,
        public readonly name: string,
        public readonly rol: string,
    ) {}

    static fromEntity(user: any): UserResponseDto {
        return new UserResponseDto(user.id, user.email, user.name, user.rol);
    }

    static toEntity(user: any): User {
        return new User({ 
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            rol: user.role.toString(),
        });
    }

    static fromEntities(users: any[]): UserResponseDto[] {
        return users.map(user => this.fromEntity(user));
    }
}
```

- **Interfaz de Repositorio**:
```ts
import type { User } from "../../../domain";
import type { CreateUserDto } from "../../dtos/user/CreateUserDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User, CreateUserDto, any> {
    findByEmail(email: string): Promise<User | null>;
    getUsers(): Promise<User[]>;
}
```

- **Use Case (Create)**:
```ts
import { inject, injectable } from "inversify";
import type { User } from "../../../domain";
import type { CreateUserDto } from "../../dtos/user/CreateUserDto";
import { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import * as bcrypt from 'bcrypt';
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject(Types.IUserRepository) private userRepository: IUserRepository,
        @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
    ) {}

    async execute(command: CreateUserDto): Promise<UserResponseDto> {
        try {
            await this.unitOfWork.beginTransaction();
            const existingUser = await this.userRepository.findByEmail(command.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            const hashedPassword = await bcrypt.hash(command.GetPassword(), 12);
            command.SetHashedPassword(hashedPassword);
            const user = await this.userRepository.create(command);
            await this.unitOfWork.commit();
            return UserResponseDto.fromEntity(user);
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}
```

### 3. Capa Infrastructure
Implementa las interfaces de Application. Usa Prisma para queries y Inversify para DI.

- **Repositorios**: Implementan interfaces de repositorio. Mapean entre entidades Domain y modelos Prisma.
- **Unit of Work**: Maneja transacciones con Prisma.
- **DI Container**: Registra bindings en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts ) y símbolos en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts ).

Para una nueva entidad:
- Implementar repositorio en [`src/infrastructure/repositories`](src/infrastructure/repositories ).
- Agregar bindings en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts ) y símbolos en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts ).

**Ejemplo con User**:
- **Repositorio**:
```ts
import { inject, injectable } from "inversify";
import type { CreateUserDto } from "../../application/dtos/user/CreateUserDto";
import { UserResponseDto } from "../../application/dtos/user/UserResponseDto";
import type { IUserRepository } from "../../application/interfaces/repositories/IUserRepository";
import type { User } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { Types } from "../di/Types";

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(Types.PrismaClient) private prisma: any,
        @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
    ) {}

    private get db() {
        return this.unitOfWork.getTransaction();
    }
    
    async create(data: CreateUserDto): Promise<User> {
        const user = await this.db.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.GetPassword(),
                role: data.rol
            }
        });
        return UserResponseDto.toEntity(user);
    }
    
    async findById(id: any): Promise<User | null> {
        id = Number(id);
        const user = await this.db.user.findUnique({ where: { id } });
        return user ? UserResponseDto.toEntity(user) : null;
    }
    
    async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
        const user = await this.db.user.update({
            where: { id: Number(id) },
            data,
        });
        return UserResponseDto.toEntity(user);
    }
    
    async delete(id: any): Promise<void> {
        id = Number(id);
        await this.db.user.delete({ where: { id } });
    }

    async getUsers(): Promise<User[]> {
        const prismaUsers = await this.db.user.findMany();
        return prismaUsers.map(u => UserResponseDto.toEntity(u));
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.db.user.findUnique({ where: { email } });
        return user ? UserResponseDto.toEntity(user) : null;
    }
}
```

- **Registro en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts )**:
```ts
// Agregar al objeto Types:
CreateUserUseCase: Symbol.for('CreateUserUseCase'),
GetUserUseCase: Symbol.for('GetUserUseCase'),
// ... otros
IUserRepository: Symbol.for('IUserRepository'),
UserController: Symbol.for('UserController'),
```

- **Registro en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts )**:
```ts
// Repositories
container.bind<IUserRepository>(Types.IUserRepository)
    .to(UserRepository)
    .inSingletonScope();

// Use Cases - User
container.bind<CreateUserUseCase>(Types.CreateUserUseCase)
    .to(CreateUserUseCase)
    .inTransientScope();
// ... otros use cases

// Controllers
container.bind<UserController>(Types.UserController)
    .to(UserController)
    .inTransientScope();
```

### 4. Capa Presentation
Maneja HTTP. Usa Express para rutas y controladores.

- **Controladores**: Reciben requests, llaman Use Cases, devuelven responses.
- **Rutas**: Definen endpoints y delegan a controladores.

Para una nueva entidad:
- Crear controlador en [`src/presentation/controllers`](src/presentation/controllers ).
- Crear rutas en [`src/presentation/routes`](src/presentation/routes ).
- Agregar rutas al router raíz.

**Ejemplo con User**:
- **Controlador**:
```ts
import { CreateUserUseCase } from "../../application/usesCase/user/CreateUser";
import type { Request, Response } from 'express';
import { CreateUserDto } from '../../application/dtos/user/CreateUserDto';
import { GetUserUseCase } from '../../application/usesCase/user/GetUserUseCase';
import { inject, injectable } from 'inversify';
import { Types } from '../../infrastructure/di/Types';
import type { GetUsersUseCase } from "../../application/usesCase/user/GerUsersUseCase";
import type { DeleteUserUseCase } from "../../application/usesCase/user/DeleteUserUseCase";
import type { UpdateUserUseCase } from "../../application/usesCase/user/UpdateUserUseCase";
import { UserResponseDto } from "../../application/dtos/user/UserResponseDto";

@injectable()
export class UserController {
    constructor(
        @inject(Types.CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
        @inject(Types.GetUserUseCase) private getUserUseCase: GetUserUseCase,
        @inject(Types.GetUsersUseCase) private getUsersUseCase: GetUsersUseCase,
        @inject(Types.DeleteUserUseCase) private deleteUserUseCase: DeleteUserUseCase,
        @inject(Types.UpdateUserUseCase) private updateUserUseCase: UpdateUserUseCase
    ) {}

    async createUser(req: Request, res: Response) {
        try {
            const userDto = CreateUserDto.Create(req.body);
            const user = await this.createUserUseCase.execute(userDto);
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await this.getUserUseCase.execute(id!);
            res.json({ success: true, data: user });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.getUsersUseCase.execute();
            res.json({ success: true, data: users });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deleteUserUseCase.execute(id!);
            res.json({ success: true, message: 'User deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await this.updateUserUseCase.execute(id!, req.body);
            const userResponse = UserResponseDto.fromEntity(user);
            res.json({ success: true, data: userResponse });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
```

- **Rutas**:
```ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class UserRoutes {
    private router: Router;
    private userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = container.get<UserController>(Types.UserController);
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/', (req, res) => this.userController.createUser(req, res));
        this.router.get('/', (req, res) => this.userController.getUsers(req, res));
        this.router.get('/:id', (req, res) => this.userController.getUser(req, res));
        this.router.put('/:id', (req, res) => this.userController.updateUser(req, res));
        this.router.delete('/:id', (req, res) => this.userController.deleteUser(req, res));
    }

    public getRouter(): Router {
        return this.router;
    }
}
```

- Agregar al router raíz:
```ts
import { UserRoutes } from "./userRoutes";
// ...
const userRoutes = new UserRoutes();
rootRouter.use("/user", userRoutes.getRouter());
```

## Paso a Paso para Implementar CRUD de una Nueva Entidad

1. **Definir la Entidad en Domain**: Crear clase y enums si aplica.
2. **Crear DTOs en Application**: Create y Response con validaciones.
3. **Definir Interfaz de Repositorio**: Extender [`IBaseRepository`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/application/interfaces/repositories/IAgencyRepository.ts ).
4. **Implementar Use Cases**: Uno por operación CRUD.
5. **Implementar Repositorio en Infrastructure**: Mapear a Prisma.
6. **Crear Controlador en Presentation**: Inyectar Use Cases.
7. **Crear Rutas en Presentation**: Definir endpoints.
8. **Registrar en DI**: Agregar símbolos en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Types.ts ) y bindings en [`../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/di/Container.ts ).
9. **Actualizar Prisma Schema**: Agregar modelo si es nueva tabla.
10. **Ejecutar Migraciones y Seeds**: `npx prisma migrate dev`, [`npm run db:seed`](../../../../../../../c:/Users/Daniel/Desktop/IS Project/K-Pop-Groups-Manager/backend/src/infrastructure/repositories/AgencyRepository.ts ).
11. **Probar**: Usar Postman o similar para endpoints.

Este proceso asegura separación de responsabilidades y facilidad de testing/mantenimiento. Para entidades complejas, agregar validaciones adicionales en DTOs y lógica en Use Cases.
