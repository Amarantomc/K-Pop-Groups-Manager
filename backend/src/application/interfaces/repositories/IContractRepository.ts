import type { Contract } from "../../../domain";
import type { Artist } from "../../../domain/entities/Artist";
import type { CreateContractDto } from "../../dtos/contract/CreateContractDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IContractRepository extends IBaseRepository<Contract,CreateContractDto,any>{
    findAll(): Promise<Contract[]>;
    findByArtist(apprenticeId:number,groupId:number):Promise<Contract[]>;
    offerContract():Promise<Artist[]>; //artistas con estado en pausa


}