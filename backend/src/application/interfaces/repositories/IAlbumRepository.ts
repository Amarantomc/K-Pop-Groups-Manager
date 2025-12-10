import type { Album } from "../../../domain";
import type { CreateAlbumDto } from "../../dtos/album/CreateAlbumDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IAlbumRepository extends IBaseRepository<Album,CreateAlbumDto,any> {
    findAll(): Promise<Album[]>;


    
}
