import { inject, injectable } from "inversify";
import type { ISongRepository } from "../../application/interfaces/repositories/ISongRepository";
import { Types } from "../di/Types";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import type { CreateSongDto } from "../../application/dtos/song/CreateSongDto";
import type { Song } from "../../domain";
import { SongResponseDto } from "../../application/dtos/song/SongResponseDto";

@injectable()
export class SongRepository implements ISongRepository{
   constructor( @inject(Types.PrismaClient)private prismaClient:any,
               @inject(Types.IUnitOfWork) private unitOfWork:UnitOfWork){}
  
     private get db() {
    return this.unitOfWork.getTransaction();
  }


    private async syncPopularityLists(): Promise<void> {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
  
    // 1. Traemos canciones que tengan al menos 1 año
    const songs = await this.db.cancion.findMany({
      where: {
        fechaLanzamiento: {
          lte: oneYearAgo
        }
      },
      include: {
        ListaDePopularidad: true
      }
    });
  
    // 2. Traemos todas las listas de popularidad
    const lists = await this.db.listaPopularidad.findMany();
  
    for (const song of songs) {
      for (const list of lists) {
  
        // 3. Verificamos requisito de reproducciones
        if (song.reproducciones < list.requisito) continue;
  
        // 4. Verificamos que NO esté ya en la lista
        const alreadyExists = song.ListaDePopularidad.some(
          (          lp: { idLista: any; }) => lp.idLista === list.id
        );
  
        if (alreadyExists) continue;
  
        // 5. Insertamos relación
        await this.db.cancionEnListaDePopularidad.create({
          data: {
            idCa: song.id,
            idLista: list.id,
            posicion: 0, // luego puedes recalcular rankings
            año: now.getFullYear()
          }
        });
      }
    }
    }

    async create(data: CreateSongDto): Promise<Song> {
        const created = await this.db.cancion.create({
      data: {
        titulo: data.title,
        genero: data.gender,
        productor: data.producer,
        fechaLanzamiento: new Date(data.releaseDate),
        Albums: data.albumIds ? {
          connect: data.albumIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        Albums: true,
        ListaDePopularidad: {
          include: {
            listaPopularidad: true
          }
        }
      }
    });
    return SongResponseDto.toEntity(created);
    }
    async findById(id: string): Promise<Song | null> {
      
      const found = await this.db.cancion.findUnique({
      where: { id: Number(id)  },
      include: {
        Albums: {
          include: {
            grupo: true
          }
        },
        ListaDePopularidad: {
          include: {
            listaPopularidad: true
          }
        }
      }
    });
    return found ? SongResponseDto.toEntity(found) : null;
    }
    async update(id: string, data: Partial<CreateSongDto>): Promise<Song> {
       const song= await this.db.cancion.update({
        where: { id: Number(id) },
        data:{
          titulo: data.title,
          genero: data.gender,
          productor: data.producer,
        },
        include: {
        Albums: {
          include: {
            grupo: true
          }
        },
        ListaDePopularidad: {
          include: {
            listaPopularidad: true
          }
        }
      }
       })
       return SongResponseDto.toEntity(song);
    }
    async delete(id: string): Promise<void> {
       await this.db.cancion.delete({
      where: { id:Number(id)  }
    });
    }

    async findAll(): Promise<Song[]> {

      await this.syncPopularityLists();

     const songs= await this.db.cancion.findMany({
      include: {
        Albums: true,
        ListaDePopularidad: {
          include: {
            listaPopularidad: true
          }
        }
      }
     })
     return SongResponseDto.toEntities(songs)
  }

     addToAlbum(songId: number, albumId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    searchByTitle(title: string): Promise<Song[]> {
        throw new Error("Method not implemented.");
    }
               
}