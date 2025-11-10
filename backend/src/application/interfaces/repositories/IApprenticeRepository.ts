import type { Apprentice } from "../../../domain";
import type { CreateApprenticeDto } from "../../dtos/apprentice/CreateApprenticeDto";
import type { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";
import type { IBaseRepository } from "./IBaseRepository";
import { Status } from '../../../domain/enums/ApprenticeStatus';

export interface IApprenticeRepository extends IBaseRepository<Apprentice,CreateApprenticeDto,any> {
    findAll(): Promise<Apprentice[]>;
}

 