import type { Award } from "../../../domain";
import type { CreateAwardDto } from "../../dtos/award/CreateAwardDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IAwardRepository extends IBaseRepository<Award,CreateAwardDto,any> {
    findAll(): Promise<Award[]>;

    //#region Metodos auxiliares
    albumToAwarded(awardId:number,albumId:number):Promise<void>;
    //#endregion
}
