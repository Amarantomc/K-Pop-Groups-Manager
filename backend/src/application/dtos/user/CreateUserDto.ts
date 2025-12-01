import { Role } from "../../../domain/enums/Role";

export class CreateUserDto {
  
    constructor(
    public readonly email: string,
    public readonly name: string,
    private password: string,
    public readonly role: string,

    public readonly agencyId?: number,
    public readonly IdAp?: number,
    public readonly IdGr?: number,


   ) {}

  static Create(body: any): CreateUserDto {
    
    if (!body.email || !body.name || !body.password || !body.role) {
      throw new Error('Missing required fields');
    }
    if (!( body.role in Role))
    {
        throw new Error('Invalid Role');
    }
    

    
    return new CreateUserDto(body.email, body.name, body.password,body.role,body.agencyId,body.IdAp,body.IdGr);
  }
   
   public SetHashedPassword(hash:any) 
   {
     this.password=hash
   }
   
   public GetPassword()  
   {
    return this.password
   }
   

  
}
