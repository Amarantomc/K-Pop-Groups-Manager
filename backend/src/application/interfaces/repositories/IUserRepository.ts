import type { User } from "../../../domain";
import type { CreateUserDto } from "../../dtos/user/CreateUserDto";

import type { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User,CreateUserDto,any> {
  findByEmail(email: string): Promise<User | null>;
  
}

 