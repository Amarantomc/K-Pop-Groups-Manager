import type { UnitOfWork } from "../PrismaUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { Album } from "../../domain";
import type { CreateAlbumDto } from "../../application/dtos/album/CreateAlbumDto";
import { AlbumResponseDto } from "../../application/dtos/album/AlbumResponseDto";
import type { UpdateAlbumDto } from "../../application/dtos/album/UpdateAlbumDto";
import type { IAlbumRepository } from "../../application/interfaces/repositories/IAlbumRepository";
 

@injectable()
export class AlbumRepository implements IAlbumRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}

     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateAlbumDto): Promise<Album> {
         
        
        const album= await this.db.Album.create({
            data:{
                idGrupo: data.idGroup,
                NoCopiasVendidas:data.noCopiesSold,
                productor:data.producer,
                titulo: data.title,
                fechaLanzamiento:data.releaseDate,
                NoCanciones:data.noSongs
            }
        })
        
        
        return AlbumResponseDto.toEntity(album)
    }

    async findById(id: any): Promise<Album| null> {
         id=(Number)(id)
        const album=await this.db.Album.findUnique({
           where:{id},
           include: {
            Canciones: true,
            LanzamientoArtista: true,
            Premios: true,
          }
        })
        return album ? AlbumResponseDto.toEntity(album) : null
    }

    async update(id: string, data: Partial<UpdateAlbumDto>): Promise<Album> {
        const album = await this.db.Album.update({
          where: { id: Number(id) },
          data: {
          },
        });
      
        return AlbumResponseDto.toEntity(album);
      }

      async delete(id: string): Promise<void> {
        const numericId = Number(id);
      
        try {
          // 1. Borrar premios del álbum
          await this.db.AlbumPremiado.deleteMany({
            where: { idAlb: numericId }
          });
      
          // 2. Borrar lanzamientos de grupo
          await this.db.GrupoLanzaAlbum.deleteMany({
            where: { idAlb: numericId }
          });
      
          // 3. Borrar lanzamientos de artista
          await this.db.ArtistaLanzaAlbum.deleteMany({
            where: { idAlb: numericId }
          });
      
          // 4. Finalmente borrar el álbum
          await this.db.Album.delete({
            where: { id: numericId }
          });
      
        } catch (error) {
          throw new Error(`Error deleting album with id ${id}: ${error}`);
        }
      }

    //   async delete(id: string): Promise<void> {
    //     const numericId = Number(id);
      
    //     try {
    //       // 1. Borrar premios del álbum
    //       await this.db.Premios.delete({
    //         where: { idAlb: numericId }
    //       });
      
    //       // 2. Borrar lanzamientos grupo
    //       await this.db.GrupoLanzaAlbum.delete({
    //         where: { idAlb: numericId }
    //       });
      
    //       // 3. Borrar lanzamientos artista
    //       await this.db.ArtistaLanzaAlbum.delete({
    //         where: { idAlb: numericId }
    //       });
      
    //       // 4. Finalmente borrar el álbum
    //       await this.db.Album.delete({
    //         where: { id: numericId }
    //       });
      
    //     } catch (error) {
    //       throw new Error(`Error deleting album with id ${id}: ${error}`);
    //     }
    //   }

      async findAll(): Promise<Album[]> {
        const albums = await this.db.Album.findMany({
          include: {
            Canciones: {
              select: { id: true }
            },
            LanzamientoArtista: {
              select: { idAp: true, idGr: true }
            },
            Premios: {
              select: { idPremio: true, año: true }
            },
            LanzamientoGrupo: {
              select: {
                idGr: true,
                idAlb: true,
                grupo: true
              }
            }
          }
        });
      
        return AlbumResponseDto.toEntities(albums);
      }
}