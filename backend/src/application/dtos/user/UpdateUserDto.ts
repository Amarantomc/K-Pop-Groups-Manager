import { Role } from "../../../domain/enums/Role";

export class UpdateUserDto{
      constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: string,
    public password: string
    
  ) {}

  static create(id:any,body:any):UpdateUserDto{
    
    if(body.role && !(body.role in Role)){
      throw new Error("Invalid Role")
    }
    return new UpdateUserDto(id,body.email,body.name,body.role,body.password)
  }
}