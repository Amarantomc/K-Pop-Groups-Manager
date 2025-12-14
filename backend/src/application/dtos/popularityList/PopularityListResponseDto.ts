import { PopularityList } from "../../../domain";

export class PopularityListResponseDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly listType: string,
    public readonly songs: {id: number;title: string;position: number;year: number;}[] ) {}

  static fromEntity(popularityList: PopularityList): PopularityListResponseDto {
    return new PopularityListResponseDto(
      popularityList.id,
      popularityList.name,
      popularityList.listType,
      popularityList.songs,
    );
  }

  static toEntity(popularityList: any): PopularityList {
    const songs = popularityList.Canciones?.map((c: any) => ({
      id: c.cancion.id,
      title: c.cancion.titulo,
      position: c.posicion,
      year: c.año,          
    })) ?? [];

    return new PopularityList({
      id: popularityList.id,
      name: popularityList.nombre,
      listType: popularityList.tipoLista,
      songs,
    });
  }

  static fromEntities(popularityLists: PopularityList[]): PopularityListResponseDto[] {
    return popularityLists.map(pl => this.fromEntity(pl));
  }

  static toEntities(popularityLists: any[]): PopularityList[] {
    return popularityLists.map(pl => this.toEntity(pl));
  }
}