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
        genero: data.gender,
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
     const songs= await this.db.cancion.findMany({
      include:{
        Albums:true
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