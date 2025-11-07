import { Role } from "../../../domain/enums/Role";

export class CreateUserDto {
  
    constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly rol: string

   ) {}

  static create(body: any): CreateUserDto {
    
    if (!body.email || !body.name || !body.password || !body.rol) {
      throw new Error('Missing required fields');
    }
    if (!( body.rol in Role))
    {
        throw new Error('Invalid Role');
    }
    

    
    return new CreateUserDto(body.email, body.name, body.password,body.rol);
  }

  
}
