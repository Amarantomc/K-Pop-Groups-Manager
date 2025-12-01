import type { Prisma } from "@prisma/client";
import { PopularityList, Song } from "../../../domain";
import { popularityListFields } from '../../../../../frontend/src/config/formSource';

export class PopularityListResponseDto{
    constructor(
        public readonly id:number,
        public readonly name:string,
        public readonly listType: string,
        public readonly songs: Song[],
        
    ){}

    static fromEntity(PopularityList: PopularityList): PopularityListResponseDto {
        return new PopularityListResponseDto(
            PopularityList.id,
            PopularityList.name,
            PopularityList.listType,
            PopularityList.songs,
        );
      }

      static toEntity(popularityList: any): PopularityList {
        return new PopularityList(
            {id:popularityList.id,
            name:popularityList.nombre,
            listType:popularityList.tipoLista,
            songs:popularityList.Canciones,
            });
      }

      static fromEntities(popularityLists: any[]): PopularityListResponseDto[] {
        return popularityLists.map(popularityList => this.fromEntity(popularityList));
      }

      static toEntities(popularityLists: any[]): PopularityList[] {
        return popularityLists.map(popularityList => this.toEntity(popularityList));
      }
}
