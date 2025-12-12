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

    // 1. Traer los artistas del grupo automáticamente
    const groupArtists = await this.db.Artista.findMany({
      where: { idGr: data.idGroup },
      select: { idAp: true }
    });
  
    // 2. Convertirlos al formato [[idAp, idGroup]]
    const autoArtists = groupArtists.map((a: { idAp: number; }) => [a.idAp, data.idGroup] as [number, number]);
  
    // 3. Unir artistas que vengan del body + los del grupo
    const finalArtists = [
      ...(data.artists ?? []),
      ...autoArtists
    ];
  
    // 4. Crear álbum con TODAS las relaciones
    const album = await this.db.Album.create({
      data: {
        idGrupo: data.idGroup,
        productor: data.producer,
        titulo: data.title,
        fechaLanzamiento: new Date(data.releaseDate),
        NoCanciones: data.songs.length,
        NoCopiasVendidas: data.noCopiesSold,
  
        // Canciones M-M
        Canciones: {
          connect: data.songs.map(id => ({ id }))
        },
  
        // Premios M-M con tabla intermedia AlbúmPremiado
        Premios: {
          create: data.awards?.map(idPremio => ({
            idPremio,
            año: new Date().getFullYear()
          })) ?? []
        },
  
        // Lista de artistas involucrados → incluye los auto-detectados
        LanzamientoArtista: {
          create: finalArtists.map(([idAp, idGr]) => ({
            idAp,
            idGr
          }))
        },
  
        // Registro de lanzamiento del grupo
        LanzamientoGrupo: {
          create: [{
            idGr: data.idGroup
          }]
        }
      },
  
      include: {
        Canciones: true,
        Premios: true,
        LanzamientoArtista: true,
        LanzamientoGrupo: true
      }
    });
  
    return AlbumResponseDto.toEntity(album);
  }

  async findById(id: any): Promise<Album | null> {
    const albumId = Number(id);

    const album = await this.db.Album.findUnique({
        where: { id: albumId },
        include: {
            Canciones: true, 

            Premios: {
                include: {
                    premio: true, 
                }
            },

            LanzamientoGrupo: {
                include: {
                    grupo: true, 
                }
            },

            LanzamientoArtista: {
                include: {
                    artista: true,
                }
            }
        }
    });

    if (!album){
      throw new Error('album not found');
    }

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

    async update(id: string, data: Partial<UpdateAlbumDto>): Promise<Album> {
      const albumId = Number(id);
    
      const current = await this.db.album.findUnique({
        where: { id: albumId },
        include: {
          LanzamientoArtista: true,
          Premios: true,
          Canciones: true
        }
      });
    
      if (!current) throw new Error("Album not found");
    
      // Obtener artistas del grupo
      let autoArtists: Array<{ idAp: number; idGr: number }> = [];
    
      if (data.idGroup) {
        const groupArtists = await this.db.artista.findMany({
          where: { idGr: data.idGroup },
          select: { idAp: true }
        });
    
        autoArtists = groupArtists.map((a: { idAp: any; }) => ({
          idAp: a.idAp,
          idGr: data.idGroup!
        }));
      }
    
      const finalArtists = [
        ...(data.artists?.map(([idAp, idGr]) => ({ idAp, idGr })) ?? []),
        ...autoArtists
      ];
    
      let updated = await this.db.album.update({
        where: { id: albumId },
        data: {
          idGrupo: data.idGroup ?? current.idGrupo,
          titulo: data.title ?? current.titulo,
          productor: data.producer ?? current.productor,
          fechaLanzamiento: data.releaseDate
            ? new Date(data.releaseDate)
            : current.fechaLanzamiento,
          NoCopiasVendidas: data.noCopiesSold ?? current.NoCopiasVendidas,
          NoCanciones: data.songs
            ? data.songs.length
            : 0,
          //NoCanciones: data.songs?.length,//le agregue esto, pero dejame dicerte q no l oguarda en la base de datos 
          // RELACIÓN M:N IMPLÍCITA (SOLO set)
          Canciones: data.songs
            ? {
                set: data.songs.map(id => ({ id }))
              }
            : undefined,
    
          // PREMIOS (pivot explícito)
          Premios: data.awards
            ? {
                deleteMany: {},
                create: data.awards.map(idPremio => ({
                  idPremio,
                  año: new Date().getFullYear()
                }))
              }
            : undefined,
    
          // ARTISTAS (pivot explícito)
          LanzamientoArtista:
            finalArtists.length > 0
              ? {
                  deleteMany: {},
                  create: finalArtists.map(a => ({
                    idAp: a.idAp,
                    idGr: a.idGr
                  }))
                }
              : undefined
        },
        include: {
          Canciones: true,
          Premios: true,
          LanzamientoArtista: true
        }
      });
      

      return AlbumResponseDto.toEntity(updated);
    }

    async findAll(): Promise<Album[]> {
      const albums = await this.db.Album.findMany({
          include: {
              Canciones: true, 
  
              Premios: {
                  include: {
                      premio: true, 
                  }
              },
  
              LanzamientoGrupo: {
                  include: {
                      grupo: true, 
                  }
              },
  
              LanzamientoArtista: {
                  include: {
                      artista: true, 
                  }
              }
          }
      });
  
      return AlbumResponseDto.toEntities(albums);
  }
}