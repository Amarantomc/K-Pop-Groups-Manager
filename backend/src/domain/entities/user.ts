import  { Role } from "../enums/Role"


export default abstract class User{
       readonly id: number
       readonly name:string
       readonly email: string
       readonly password: string
       readonly role: Role
       
       constructor(attrs:{id:number,name:string,email:string,password:string,role:Role})
       {
              
              this.id=attrs.id
              this.email=attrs.email
              this.name=attrs.name
              this.password=attrs.password
              this.role=attrs.role
              
       }
        abstract getProfileData(): Record<string, any>
       
    
}



