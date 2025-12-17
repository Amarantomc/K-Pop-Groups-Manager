import type { Application } from "../../../domain";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import type { IBaseRepository } from "./IBaseRepository";
import type { Group } from "../../../domain/entities/Group";
import type { ApplicationCreateGroupDTO } from "../../dtos/application(solicitud)/ApplicationCreateGroupDTO";
import type { CreateRolApplicationDto } from "../../dtos/application(solicitud)/CreateRolApplicationDto";
import type { Artist } from "../../../domain/entities/Artist";

export interface IApplicationRepository extends IBaseRepository<Application,CreateApplicationDto,any> {
    findAll(): Promise<Application[]>;
    createFromApplication(application:ApplicationCreateGroupDTO,idApplication:number): Promise<Group>;
    createRol(data:CreateRolApplicationDto):Promise<Application>;
    soloistsArtistWhithoutApplication():Promise<Artist[]>;

}
