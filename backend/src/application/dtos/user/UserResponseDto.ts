
import { User } from "../../../domain";

export class UserResponseDto {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly name: string,
    public readonly rol: string,
    
  ) {}

  static fromEntity(user: any): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.email,
      user.name,
      user.rol
      
    );
  }

  static toEntity(user:any):User {
    return new User({ 
      id:user.id,
      name:user.name,
      email: user.email,
      password:user.password,
      rol:user.role.toString(),}
     
    )
  }

  static fromEntities(users: any[]): UserResponseDto[] {
    return users.map(user => this.fromEntity(user));
  }
}