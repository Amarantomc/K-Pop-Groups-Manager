
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { IPopularityListRepository } from "../../application/interfaces/repositories/IPopularityListRepository";
import type { CreatePopularityListDto } from "../../application/dtos/popularityList/CreatePopularityListDto";
import { PopularityList, Song } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { PopularityListResponseDto } from "../../application/dtos/popularityList/PopularityListResponseDto";

export class PopularityListRepository implements IPopularityListRepository{

     constructor(
        @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
      ) {}
 
 
  
      private get db() {
        return this.unitOfWork.getTransaction();
      }
      
      
      async updatePositionInPopularityList(popularityListId: number,songId: number,newPosition: number): Promise<PopularityList> {
      
        const songInList = await this.db.CancionEnListaDePopularidad.findFirst({
          where: {
            idLista: popularityListId,
            idCa: songId,
          },
        });
      
        if (!songInList) {
          throw new Error("Song not found in this popularity list");
        }
      
        const currentPosition = songInList.posicion;
      
        if (currentPosition === newPosition) {
          const popularityList = await this.findById(popularityListId);
        
          if (!popularityList) {
            throw new Error("Popularity list not found");
          }
        
          return popularityList;
        }
      
        const totalSongs = await this.db.CancionEnListaDePopularidad.count({
          where: { idLista: popularityListId },
        });
      
        if (newPosition < 1 || newPosition > totalSongs) {
          throw new Error(`Position must be between 1 and ${totalSongs}`);
        }
      
        if (newPosition < currentPosition) {
          await this.db.CancionEnListaDePopularidad.updateMany({
            where: {
              idLista: popularityListId,
              posicion: {
                gte: newPosition,
                lt: currentPosition,
              },
            },
            data: {
              posicion: { increment: 1 },
            },
          });
        }
      
        if (newPosition > currentPosition) {
          await this.db.CancionEnListaDePopularidad.updateMany({
            where: {
              idLista: popularityListId,
              posicion: {
                gt: currentPosition,
                lte: newPosition,
              },
            },
            data: {
              posicion: { decrement: 1 },
            },
          });
        }
      
        await this.db.CancionEnListaDePopularidad.update({
          where: {
            idCa_idLista: {
              idCa: songId,
              idLista: popularityListId,
            },
          },
          data: {
            posicion: newPosition,
          },
        });
      
        const popularityList = await this.findById(popularityListId);

        if (!popularityList) {
            throw new Error("Popularity list not found");
        }

        return popularityList;
      }




      async deleteSongFromPopularityList(popularityListId: number,songId: number): Promise<PopularityList> {
      
        const listForError = await this.findById(popularityListId);
      
        if (!listForError) {
          throw new Error("Popularity list not found");
        }
      
        const songInList = await this.db.CancionEnListaDePopularidad.findFirst({
          where: {
            idLista: popularityListId,
            idCa: songId,
          },
        });
      
        if (!songInList) {
          throw new Error(
            `The song does not exist in the popularity list '${listForError.name}'.`
          );
        }
      
        const deletedPosition = songInList.posicion;
      
        await this.db.CancionEnListaDePopularidad.delete({
          where: {
            idCa_idLista: {
              idCa: songId,
              idLista: popularityListId,
            },
          },
        });
      
        await this.db.CancionEnListaDePopularidad.updateMany({
          where: {
            idLista: popularityListId,
            posicion: {
              gt: deletedPosition,
            },
          },
          data: {
            posicion: {
              decrement: 1,
            },
          },
        });
      
        const popularityList = await this.findById(popularityListId);
      
        if (!popularityList) {
          throw new Error("Popularity list not found");
        }
      
        return PopularityListResponseDto.toEntity(popularityList);
      }






      async findAll(): Promise<PopularityList[]> {

      await this.syncPopularityLists();

        const popularityLists = await this.db.ListaPopularidad.findMany({
            include: {
                Canciones: {
                    include: {
                        cancion: true, // traer toda la info de la canción
                    },
                },
            },
        });
    
        if (!popularityLists || popularityLists.length === 0) {
            throw new Error("Popularity lists not found");
        }
        return PopularityListResponseDto.toEntities(popularityLists);
      }
    






      async findSongByName(songName: string, popularityListId: number): Promise<Song> {
        const list = await this.db.listaPopularidad.findUnique({
          where: { id: popularityListId },
          include: {
            CancionEnListaDePopularidad: {
              include: {
                cancion: true // traemos la entidad Cancion completa
              }
            }
          }
        });
      
        if (!list) {
          throw new Error(`Popularity list with ID ${popularityListId} does not exist.`);
        }
      
        // buscar la canción dentro de la lista por su nombre
        const match = list.CancionEnListaDePopularidad.find(
          (entry: { cancion: { nombre: string; }; }) => entry.cancion.nombre.toLowerCase() === songName.toLowerCase()
        );
      
        if (!match) {
          throw new Error(
            `Song "${songName}" not found in popularity list ${popularityListId}`
          );
        }
        
        return match
        //return SongMapper.toEntity(match.cancion);
      }






      async addSongToPopularityList(popularityListId: number,songId: number): Promise<PopularityList> {
      
        const currentYear = new Date().getFullYear();
      
        const countForYear = await this.db.CancionEnListaDePopularidad.count({
          where: {
            idLista: popularityListId,
            año: currentYear,
          },
        });
      
        await this.db.CancionEnListaDePopularidad.create({
          data: {
            idCa: songId,
            idLista: popularityListId,
            posicion: countForYear + 1,
            año: currentYear,
          },
        });
      
        // 3️⃣ Traer la lista completa ordenada por año y posición
        const popularityList = await this.db.ListaPopularidad.findUnique({
          where: { id: popularityListId },
          include: {
            Canciones: {
              orderBy: [
                { año: "desc" },      // primero el año más reciente
                { posicion: "asc" },  // luego el ranking
              ],
              include: {
                cancion: {
                  select: {
                    id: true,
                    titulo: true,
                  },
                },
              },
            },
          },
        });
      
        if (!popularityList) {
          throw new Error("Popularity list not found");
        }
      
        return PopularityListResponseDto.toEntity(popularityList);
      }

      private async syncPopularityLists(): Promise<void> {
        const now = new Date();
        const currentYear = now.getFullYear();
      
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
      
        // Obtener todas las listas de popularidad
        const lists = await this.db.listaPopularidad.findMany();
      
        for (const list of lists) {
      
          // 1️⃣ Borramos los rankings actuales del año en curso
          await this.db.cancionEnListaDePopularidad.deleteMany({
            where: {
              idLista: list.id,
              año: currentYear,
            },
          });
      
          // 2️⃣ Canciones elegibles para la lista
          const songs = await this.db.cancion.findMany({
            where: {
              fechaLanzamiento: {
                lte: oneYearAgo, // lanzadas hace más de un año
              },
              reproducciones: {
                gte: list.requisito, // cumplen el requisito mínimo
              },
            },
            orderBy: {
              reproducciones: 'desc', // de más a menos reproducciones
            },
          });
      
          let position = 1;
      
          // 3️⃣ Insertar o actualizar canciones en la lista
          for (const song of songs) {
            await this.db.cancionEnListaDePopularidad.upsert({
              where: {
                idCa_idLista: {
                  idCa: song.id,
                  idLista: list.id,
                },
              },
              update: {
                posicion: position,
                año: currentYear,
              },
              create: {
                idCa: song.id,
                idLista: list.id,
                posicion: position,
                año: currentYear,
              },
            });
      
            position++;
          }
        }
      }

    




     async create(data: CreatePopularityListDto): Promise<PopularityList> {
             
            
            const popularityList= await this.db.ListaPopularidad.create({
                data:{
                    nombre: data.name,
                    tipoLista: data.listType,
                    
                }
            })
            
            
            return PopularityListResponseDto.toEntity(popularityList)
        }




        async findById(id: any): Promise<PopularityList | null> {
          id = Number(id);
      
          const popularityList = await this.db.ListaPopularidad.findUnique({
              where: { id },
              include: {
                  Canciones: {
                      include: {
                          cancion: true,
                      },
                  },
              },
          });
      
          if (!popularityList){
            throw new Error("Popularity List not found");
          }
      
          return PopularityListResponseDto.toEntity(popularityList);
      }






    async update(id: string, data: Partial<CreatePopularityListDto>): Promise<PopularityList> {
            const popularityList = await this.db.ListaPopularidad.update({
              where: { id: Number(id) },
              data: {
                nombre:data.name,
                tipoLista:data.listType,
                
              },
            });
          
            return PopularityListResponseDto.toEntity(popularityList);
          }





          async delete(id: string): Promise<void> {
            try {
              await this.db.ListaPopularidad.delete({
                where: { id: Number(id) },
              });
            } catch (error) {
              throw new Error(`Error deleting popularity list with id ${id}: ${error}`);
            }
          }
  
  async findBySongId(songId: number): Promise<PopularityList[]> {
        const popularityLists = await this.db.ListaPopularidad.findMany({
    where: {
      Canciones: {
        some: {
          idCa: songId,
        },
      },
    },
      include: {
    Canciones: {
        include: {
            cancion: true,
        },
    },}
          
  });
      return PopularityListResponseDto.toEntities(popularityLists);
  }
    
}