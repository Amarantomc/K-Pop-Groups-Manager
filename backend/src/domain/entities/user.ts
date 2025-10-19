import type { Role } from "../enums/Role"


export default class User{
       readonly id: number
       readonly name:String
       readonly email: String
       readonly password: String
       readonly rol: Role
       
       constructor(attrs:{id:number,name:String,email:String,password:String,rol:Role})
       {
              
              this.id=attrs.id
              this.email=attrs.email
              this.name=attrs.name
              this.password=attrs.password
              this.rol=attrs.rol
              
       }
       

      
}


