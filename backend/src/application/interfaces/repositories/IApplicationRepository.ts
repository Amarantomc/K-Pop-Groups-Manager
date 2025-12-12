import type { Application } from "../../../domain";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import type { IBaseRepository } from "./IBaseRepository";
import type { Group } from "../../../domain/entities/Group";
import type { ApplicationCreateGroupDTO } from "../../dtos/application(solicitud)/ApplicationCreateGroupDTO";

export interface IApplicationRepository extends IBaseRepository<Application,CreateApplicationDto,any> {
    findAll(): Promise<Application[]>;
    createFromApplication(application:ApplicationCreateGroupDTO,idApplication:number): Promise<Group>;
}
