import Song from "../../../domain/entities/Song";
 

export class SongResponseDto {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly genre: string,
    public readonly producer: string,
    public readonly releaseDate: string,
    public readonly albums?: Array<{
      id: number;
      title: string;
      releaseDate: string;
       
    }>,
    // public readonly popularityLists?: Array<{
    //   listId: number;
    //   listName: string;
    //   listType: string;
    //   position: number;
    //   year: number;
    // }>
  ) {}

  static fromEntity(song: Song): SongResponseDto {
    return new SongResponseDto(
      song.id,
      song.title,
      song.gender,
      song.producer,
      song.releaseDate.toString(),
      song.albums?.map(album => ({
        id: album.id,
        title: album.title,
        releaseDate: album.releaseDate.toString(),
         
      })),
    //   song.popularityLists?.map(pl => ({
    //     listId: pl.list.id,
    //     listName: pl.list.name,
    //     listType: pl.list.listType,
    //     position: pl.position,
    //     year: pl.year
    //   }))
    );
  }

  static toEntity(dbSong: any): Song {
    return new Song({
      id: dbSong.id,
      title: dbSong.titulo,
      gender: dbSong.genero,
      producer: dbSong.productor,
      releaseDate: new Date(dbSong.fechaLanzamiento),
      albums: dbSong.Albums?.map((a: any) => ({
        id: a.id,
        title: a.titulo,
        releaseDate: new Date(a.fechaLanzamiento),
        type: a.tipoAlbum,
        sales: a.NoCopiasVendidas,
        group: a.grupo ? {
          id: a.grupo.id,
          name: a.grupo.nombreCompleto,
          debut: new Date(a.grupo.fechaDebut),
          status: a.grupo.estadoGrupo,
          memberCount: a.grupo.Nomiembros
        } : null
      })),
    //   popularityLists: dbSong.ListaDePopularidad?.map((pl: any) => ({
    //     list: new PopularityList({
    //       id: pl.listaPopularidad.id,
    //       name: pl.listaPopularidad.nombre,
    //       listType: pl.listaPopularidad.tipoLista
    //     }),
    //     position: pl.posicion,
    //     year: pl.año
    //   }))
    });
  }

  static fromEntities(songs: Song[]): SongResponseDto[] {
    return songs.map(song => this.fromEntity(song));
  }

  static toEntities(dbSongs: any[]): Song[] {
    return dbSongs.map(song => this.toEntity(song));
  }
}