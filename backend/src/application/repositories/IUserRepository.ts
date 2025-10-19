import type { Role } from "../../domain/enums/Role"

export interface IUserRepository{
    create():Promise<CreateUserRequestDTO>
}

export default class CreateUserRequestDTO{
    name:String
    email:String
    password:String
    role:Role
    constructor(attrs:{name:String, email:String, password:String, role:Role})
    {
        this.name=attrs.name
        this.email=attrs.email
        this.password=attrs.password
        this.role=attrs.role
    }

}