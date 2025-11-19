import { inject, injectable } from "inversify";
import type { IArtistRepository } from "../../application/interfaces/repositories/IArtistRepository";
import { Types } from "../di/Types";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { CreateArtistDto } from "../../application/dtos/artist/CreateArtistDto";
import type { Artist } from "../../domain/entities/Artist";
import { ArtistResponseDto } from "../../application/dtos/artist/ArtistResponseDto";
import type { UpdateArtistDto } from "../../application/dtos/artist/UpdateArtistDto";

@injectable()
export class ArtistRepository implements IArtistRepository {

    constructor( @inject(Types.PrismaClient) private prisma: any,
                @inject(Types.IUnitOfWork) private unitOfWork :UnitOfWork
                
){}
  
private get db() {
    return this.unitOfWork.getTransaction();
  }

    async create(data: CreateArtistDto): Promise<Artist> {
    
    const artist = await this.db.artista.create({
      data: {
        nombreArtistico: data.ArtistName,
        fsechaDebut: new Date(data.DebutDate),
        estadoArtista: data.Status,
        idAp: data.apprenticeId,   
        idGr: data.groupId          
      }
    })
    return ArtistResponseDto.toEntity(artist);
  }

    async findById(id: any): Promise<Artist | null> {
      const artist = await this.db.artist.findUnique({
        where:{id:Number(id)},
        include:{
            HistorialGrupos:true
        }
      })
      return artist ? ArtistResponseDto.toEntity(artist) : null;
  }

    async delete(id: any): Promise<void> {
    
    await this.db.artista.delete({
      where: {
        id:Number(id)
      }
    });
  }

    async update(id: any, data: Partial<UpdateArtistDto>): Promise<Artist> {
          const artist = await this.db.artist.update({
                    where: { id: Number(id) },
                    data,
                  });
                
                  return ArtistResponseDto.toEntity(artist);
      }
    
    async getAll(): Promise<Artist[]> {
        const artists = await this.db.artista.findMany();
        return artists
    }

    async findByName(name: string): Promise<Artist[]> {
        const artists = await this.db.artista.findMany({
            where: {
                nombreArtistico: {
                    contains: name,
                    mode: 'insensitive'
                }
            }
        });
        return artists;
    }

    async findByStatus(status: string): Promise<Artist[]> {
        const artists = await this.db.artista.findMany({
            where: {
                estadoArtista: status
            }
        });
        return artists;
    }


}