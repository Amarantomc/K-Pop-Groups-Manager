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

    public readonly songs: { id: number; name: string }[],
    public readonly artists: { idAp: number; idGr: number; artisticName: string }[],
    public readonly awards:  { idAward: number; year: number; title: string }[],

    // SOLO IDs de los grupos
    public readonly groups: number[],
  ) {}

  static fromEntity(album: Album): AlbumResponseDto {
    return new AlbumResponseDto(
      album.id,
      album.idGroup,
      album.title,
      album.releaseDate,
      album.producer,
      album.noSongs,
      album.noCopiesSold,
      album.songs,
      album.artists,
      album.awards,
      album.groups
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

      songs: raw.Canciones?.map(
        (c: { id: number; titulo: string }) => ({
            id: c.id,
            name: c.titulo
        })
    ) ?? [],
    artists: raw.LanzamientoArtista?.map(
      (a: { idAp: number; idGr: number; artista: { nombreArtistico: string } }) => ({
        idAp: a.idAp,
        idGr: a.idGr,
        artisticName: a.artista.nombreArtistico
      })
    ) ?? [],
      awards: raw.Premios?.map(
        (p: { idPremio: number; año: number; premio: { tituloPremio: string } }) => ({
          idAward: p.idPremio,
          year: p.año,
          title: p.premio.tituloPremio
        })
      ) ?? [],
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