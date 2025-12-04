import type { UnitOfWork } from "../PrismaUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { CreateAwardDto } from "../../application/dtos/award/CreateAwardDto";
import { Award } from "../../domain";
import type { IAwardRepository } from "../../application/interfaces/repositories/IAwardRepository";
import { AwardResponseDto } from "../../application/dtos/award/AwardResposeDto";
import type { UpdateAwardDto } from "../../application/dtos/award/UpdateAwardDto";
 

@injectable()
export class AwardRepository implements IAwardRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}

   async albumToAwarded(awardId: number, albumId: number): Promise<void> {
  try {

    const exists = await this.db.AlbumPremiado.findUnique({
      where: {
        idAlb_idPremio: {
          idAlb: albumId,
          idPremio: awardId
        }
      }
    });

    if (exists) {
      throw new Error(`The album has already been awarded this prize.`);
    }

    await this.db.AlbumPremiado.create({
      data: {
        idAlb: albumId,
        idPremio: awardId,
        año: new Date().getFullYear()    
      }
    });

  } catch (error) {
    throw new Error(`Error awarding the album ${albumId} the award ${awardId}: ${error}`);
  }
}


     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateAwardDto): Promise<Award> {
         
        
        const award= await this.db.Premio.create({
            data:{
                tituloPremio: data.awardTitle,
                nombreAcademia: data.academyName
            }
        })
        
        
        return AwardResponseDto.toEntity(award)
    }
    async findById(id: any): Promise<Award| null> {
         id=(Number)(id)
        const award=await this.db.Premio.findUnique({
           where:{id}
        })
        return award ? AwardResponseDto.toEntity(award) : null
    }

    async update(id: string, data: Partial<UpdateAwardDto>): Promise<Award> {
        const award = await this.db.Premio.update({
          where: { id: Number(id) },
          data: {
            nombreAcademia:data.academyName,
            tituloPremio:data.awardTitle,
          },
        });
      
        return AwardResponseDto.toEntity(award);
      }

      async delete(id: string): Promise<void> {
        const numericId = Number(id);
      
        try {
          await this.db.AlbumPremiado.deleteMany({
            where: { idPremio: numericId }
          });
      
          await this.db.Premio.delete({
            where: { id: numericId }
          });
      
        } catch (error) {
          throw new Error(`Error deleting award with id ${id}: ${error}`);
        }
      }

    async findAll(): Promise<Award[]> {
      const awards = await this.db.Premio.findMany();
      return AwardResponseDto.toEntities(awards)
  }
}