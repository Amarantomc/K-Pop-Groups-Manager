import { Album } from "../../../domain";

export class AlbumResponseDto {
  constructor(
    public readonly id: number,
    public readonly idGroup: number,
    public readonly title: string,
    public readonly releaseDate: Date | string,
    public readonly producer: string,
    public readonly noSongs: number,
    public readonly noCopiesSold: number,

    public readonly songs: number[],
    public readonly artists: { idAp: number, idGr: number }[],
    public readonly awards: { idPremio: number, año: number }[],

    // SOLO IDs de los grupos
    public readonly groups: number[],
  ) {}

  static fromEntity(album: any): AlbumResponseDto {
    return new AlbumResponseDto(
      album.id,
      album.idGrupo,
      album.titulo,
      album.fechaLanzamiento,
      album.productor,
      //album.Canciones.length,
      album.NoCanciones,
      album.NoCopiasVendidas,

      // Canciones → Solo IDs
      album.Canciones?.map((c: { id: number }) => c.id) ?? [],

      // Artistas
      album.LanzamientoArtista?.map(
        (a: { idAp: number; idGr: number }) => ({
          idAp: a.idAp,
          idGr: a.idGr,
        })
      ) ?? [],

      // Premios
      album.Premios?.map(
        (p: { idPremio: number; año: number }) => ({
          idPremio: p.idPremio,
          año: p.año,
        })
      ) ?? [],

      // Grupos (IDs)
      album.LanzamientoGrupo?.map(
        (g: { idGr: number }) => g.idGr
      ) ?? []
    );
  }

  static toEntity(raw: any): Album {
    return new Album({
      id: raw.id,
      idGroup: raw.idGrupo,
      title: raw.titulo,
      releaseDate: raw.fechaLanzamiento,
      producer: raw.productor,
      noSongs: raw.NoCanciones,
      noCopiesSold: raw.NoCopiasVendidas,

      songs: raw.Canciones?.map((c: { id: number }) => c.id),
      artists: raw.LanzamientoArtista?.map(
        (a: { idAp: number; idGr: number }) => ({
          idAp: a.idAp,
          idGr: a.idGr,
        })
      ) ,
      awards: raw.Premios?.map((p: { idPremio: number}) => p.idPremio),
      groups: raw.LanzamientoGrupo?.map((g: { idGr: number }) => g.idGr) ?? [],
    });
  }

  static fromEntities(albums: any[]): AlbumResponseDto[] {
    return albums.map(a => this.fromEntity(a));
  }

  static toEntities(albums: any[]): Album[] {
    return albums.map(a => this.toEntity(a));
  }
}