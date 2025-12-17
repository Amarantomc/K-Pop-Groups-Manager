import { Album } from "../../../domain";

export class AlbumResponseDto {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly releaseDate: Date | string,
    public readonly producer: string,
    public readonly noSongs: number,
    public readonly noCopiesSold: number,
    public readonly apprenticeId?:number|undefined,
    public readonly groupId?:number|undefined,

    public readonly songs?: { id: number; name: string }[],
 
    public readonly awards?:  { idAward: number; year: number; title: string }[],

 
  ) {}

  static fromEntity(album: Album): AlbumResponseDto {
    
    return new AlbumResponseDto(
      album.id,
      album.title,
      album.releaseDate,
      album.producer,
      album.noSongs,
      album.noCopiesSold,
      album.apprenticeId,
      album.groupId,
      album.songs,
      album.awards
      
    );
  }

  static toEntity(raw: any): Album {
    
    return new Album({
      id: raw.id,
      title: raw.titulo,
      releaseDate: raw.fechaLanzamiento,
      producer: raw.productor,
      noSongs: raw.NoCanciones,
      noCopiesSold: raw.NoCopiasVendidas,
      apprenticeId:raw.ArtistaLanzaAlbum?raw.ArtistaLanzaAlbum[0].idAp:undefined,
      groupId:raw.GrupoLanzaAlbum?raw.GrupoLanzaAlbum[0].idGr:undefined,


      songs: raw.Canciones? raw.Canciones?.map(
        (c: { id: number; titulo: string }) => ({
            id: c.id,
            name: c.titulo
        })
      ) : [],
 
      

      awards: raw.Premios?raw.Premios?.map(
        (p: { idPremio: number; año: number; premio: { tituloPremio: string } }) => ({
          idAward: p.idPremio,
          year: p.año,
          title: p.premio.tituloPremio
        })
      ) : [],
      
    });
  }

  static fromEntities(albums: Album[]): AlbumResponseDto[] {
    return albums.map(a => this.fromEntity(a));
  }

  static toEntities(albums: any[]): Album[] {
    return albums.map(a => this.toEntity(a));
  }
}