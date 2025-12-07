import type { Application } from "../../../domain";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import type { IBaseRepository } from "./IBaseRepository";
import { apprenticeFields } from '../../../../../frontend/src/config/formSource';

export interface IApplicationRepository extends IBaseRepository<Application,CreateApplicationDto,any> {
    findAll(): Promise<Application[]>;

}
