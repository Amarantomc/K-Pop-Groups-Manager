
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { IPopularityListRepository } from "../../application/interfaces/repositories/IPopularityListRepository";
import type { CreatePopularityListDto } from "../../application/dtos/popularityList/CreatepopularityListDto";
import { PopularityList, Song } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { PopularityListResponseDto } from "../../application/dtos/popularityList/PopularityListResponseDto";

export class PopularityListRepository implements IPopularityListRepository{

     constructor(
        @inject(Types.PrismaClient) private prisma: any,
        @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
      ) {}
      private get db() {
        return this.unitOfWork.getTransaction();
      }
      
      async findAll(): Promise<PopularityList[]> {
          const  popularityLists  = await this.db.ListaPopularidad.findMany({
          include: {}});

        return PopularityListResponseDto.fromEntities(popularityLists);
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
        
        throw new Error("Not implemented");
        //return SongMapper.toEntity(match.cancion);
      }
    async addSongToPopularityList(
      popularityListId: number,
      songId: number,
      year: number,
      position: number
    ): Promise<void> {
      await this.db.cancionEnListaDePopularidad.create({
        data: {
          idCa: songId,
          idLista: popularityListId,
          posicion: position,
          año: year
        }
      });
    }
     async create(data: CreatePopularityListDto): Promise<PopularityList> {
             
            
            const popularityList= await this.db.ListaPopularidad.create({
                data:{
                    nombre: data.name,
                    tipoLista: data.listType,
                    Canciones: data.songs
                }
            })
            
            
            return PopularityListResponseDto.toEntity(PopularityList)
        }

    async findById(id: any): Promise<PopularityList | null> {
             id=(Number)(id)
            const popularityList=await this.db.ListaPopularidad.findUnique({
               where:{id}
            })
            return PopularityList ? PopularityListResponseDto.toEntity(PopularityList) : null
        }

    async update(id: string, data: Partial<CreatePopularityListDto>): Promise<PopularityList> {
            const popularityList = await this.db.ListaPopularidad.update({
              where: { id: Number(id) },
              data: {
                nombre:data.name,
                tipoLista:data.listType,
                Canciones: data.songs
              },
            });
          
            return PopularityListResponseDto.toEntity(PopularityList);
          }

          async delete(id: string): Promise<void> {
            try {
              await this.db.ListaPopularidad.delete({
                where: { id: Number(id) },
              });
            } catch (error) {
              throw new Error(`Error deleting concept with id ${id}: ${error}`);
            }
          }
    
}