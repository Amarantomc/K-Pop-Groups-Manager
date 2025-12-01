import type { Application } from "../../../domain";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import type { IBaseRepository } from "./IBaseRepository";
import { apprenticeFields } from '../../../../../frontend/src/config/formSource';

export interface IApplicationRepository extends IBaseRepository<Application,CreateApplicationDto,any> {
    findAll(): Promise<Application[]>;

    findByAgency(agencyId:number,applicationId:Number):Promise<Application[]|null>;
    findByApprentice(apprenticeId:number,applicationId:Number):Promise<Application[]|null>;
    findByArtist(apprenticeId:number,groupId:number,applicationId:number):Promise<Application[]|null>;
}
