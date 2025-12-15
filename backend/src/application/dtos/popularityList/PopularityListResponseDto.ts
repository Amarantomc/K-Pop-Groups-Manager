import { PopularityList } from "../../../domain";

export class PopularityListResponseDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly listType: string,
        public readonly requeriment: number,
        public readonly songs: { id: number; title: string; position: number , year?: number }[], // array de objetos
    ) {}

  static fromEntity(popularityList: PopularityList): PopularityListResponseDto {
    return new PopularityListResponseDto(
      popularityList.id,
      popularityList.name,
      popularityList.listType,
      popularityList.requeriment,
      popularityList.songs,
    );
  }

    static toEntity(popularityList: any): PopularityList {
        // Convertimos las canciones a objetos {id, title, position}
        const songs: { id: number; title: string; position: number, year?: number }[] = popularityList.Canciones?.map(
            (c: any) => ({
                id: c.cancion.id,
                title: c.cancion.titulo,
                position: c.posicion,
                year: c.año
            })
        ) || [];

    return new PopularityList({
      id: popularityList.id,
      name: popularityList.nombre,
      listType: popularityList.tipoLista,
      requeriment: popularityList.requisito,
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