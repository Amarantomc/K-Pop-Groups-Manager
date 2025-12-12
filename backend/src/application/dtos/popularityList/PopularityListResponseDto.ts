import { PopularityList } from "../../../domain";

export class PopularityListResponseDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly listType: string,
        public readonly songs: { id: number; title: string; position: number }[], // array de objetos
    ) {}

    static fromEntity(popularityList: PopularityList): PopularityListResponseDto {
        return new PopularityListResponseDto(
            popularityList.id,
            popularityList.name,
            popularityList.listType,
            popularityList.songs, // ya vienen como objetos
        );
    }

    static toEntity(popularityList: any): PopularityList {
        // Convertimos las canciones a objetos {id, title, position}
        const songs: { id: number; title: string; position: number }[] = popularityList.Canciones?.map(
            (c: any) => ({
                id: c.cancion.id,
                title: c.cancion.titulo,
                position: c.posicion
            })
        ) || [];

        return new PopularityList({
            id: popularityList.id,
            name: popularityList.nombre,
            listType: popularityList.tipoLista,
            songs,
        });
    }

    static fromEntities(popularityLists: PopularityList[]): PopularityListResponseDto[] {
        return popularityLists.map(popularityList => this.fromEntity(popularityList));
    }

    static toEntities(popularityLists: any[]): PopularityList[] {
        return popularityLists.map(popularityList => this.toEntity(popularityList));
    }
}