import type { Prisma } from "@prisma/client";
import { Song } from "../../../domain";
import { popularityListFields } from '../../../../../frontend/src/formSource';

export class SongResponseDTO{
    constructor(
        public readonly id:number,
        public readonly title:string,
        public readonly releaseDate:Date|string,
        public readonly producer: string,
        public readonly gender: string,
    ){}

    static fromEntity(song: any): SongResponseDTO {
        return new SongResponseDTO(
            song.id,
            song.titulo,
            song.fechaLanzamiento,
            song.productor,
            song.genero,
        );
      }

      static toEntity(song: any): Song {
        return new Song(
            {id:song.id,
            title:song.titulo,
            releaseDate:song.fechaLanzamiento,
            producer:song.productor,
            gender:song.genero,
            }
        );
      }

      static fromEntities(songs: any[]): SongResponseDTO[] {
        return songs.map(song => this.fromEntity(song));
      }
}
