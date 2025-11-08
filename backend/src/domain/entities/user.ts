import type { Role } from "../enums/Role"


export default class User{
       readonly id: number
       readonly name:string
       readonly email: string
       readonly password: string
       readonly rol: Role
       
       constructor(attrs:{id:number,name:string,email:string,password:string,rol:Role})
       {
              
              this.id=attrs.id
              this.email=attrs.email
              this.name=attrs.name
              this.password=attrs.password
              this.rol=attrs.rol
              
       }
       

      
}


