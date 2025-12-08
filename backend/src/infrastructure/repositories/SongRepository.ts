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
    
    async create(data: CreateSongDto): Promise<Song> {
        const created = await this.db.cancion.create({
      data: {
        titulo: data.title,
        genero: data.genre,
        productor: data.producer,
        fechaLanzamiento: new Date(data.releaseDate),
        Albums: data.albumIds ? {
          connect: data.albumIds.map(id => ({ id }))
        } : undefined
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
    });
    return SongResponseDto.toEntity(created);
    }
    async findById(id: string): Promise<Song | null> {
            const found = await this.db.cancion.findUnique({
      where: { id },
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
    update(id: string, data: any): Promise<Song> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
       await this.db.cancion.delete({
      where: { id }
    });
    }

     addToAlbum(songId: number, albumId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    searchByTitle(title: string): Promise<Song[]> {
        throw new Error("Method not implemented.");
    }
               
}