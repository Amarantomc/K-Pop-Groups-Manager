import type { UnitOfWork } from "../PrismaUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import Income from '../../domain/entities/Income';
import type { IIncomeRepository } from "../../application/interfaces/repositories/IIncomeRepository";
import type { CreateIncomeDto } from "../../application/dtos/income/CreateIncomeDto";
import { IncomeResponseDto } from "../../application/dtos/income/IncomeResponseDto";
import type { UpdateIncomeDto } from "../../application/dtos/income/UpdateIncomeDto";
 

@injectable()
export class IncomeRepository implements IIncomeRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  private get db() {
    return this.unitOfWork.getTransaction();
  }
    
      async create(data: CreateIncomeDto): Promise<Income> {

        const actividad = await this.db.actividad.findUnique({
          where: { id: data.idActivity },
          select: { fecha: true }
        });
      
        if (!actividad) {
          throw new Error("Actividad asociada no encontrada");
        }
      
        const income = await this.db.ingreso.create({
          data: {
            idAct: data.idActivity,
            descripcion: data.description,
            monto: data.amount,
            fecha: actividad.fecha
          }
        });
      
        return IncomeResponseDto.toEntity(income);
      }

      
      async findById(id: string): Promise<Income | null> {
        const income = await this.db.Ingreso.findFirst({
          where: { idIng: Number(id) },
          include: {
            actividad: { select: { tipoEvento: true } }
          }
        });
      
        if (!income) return null;
        
        return IncomeResponseDto.toEntity(income);
      }
    

      async update(id: string, data: Partial<UpdateIncomeDto>): Promise<Income> {
        const numericId = Number(id);
      
        //  Buscar todos los ingresos incluyendo solo tipoActividad
        const incomes = await this.db.Ingreso.findMany({
          include: {
            actividad: { select: { tipoActividad: true } } // <- solo tipoActividad
          }
        });
      
        //  Encontrar el ingreso que tenga ese idIng
        const existing = incomes.find((inc: any) => inc.idIng === numericId);
      
        if (!existing) {
          throw new Error(`Income with id ${numericId} not found`);
        }
      
        // Actualizar usando la clave compuesta y traer la actividad actualizada
        const updated = await this.db.Ingreso.update({
          where: {
            idIng_idAct: {
              idIng: existing.idIng,
              idAct: existing.idAct,
            },
          },
          data: {
            descripcion: data.description,
            monto: data.amount,
          },
          include: {
            actividad: { select: { tipoEvento: true } } 
          }
        });

        

        return IncomeResponseDto.toEntity(updated);
      }

      async delete(id: string): Promise<void> {
        const numericId = Number(id);
      
        try {
          // 1. Buscar el ingreso para saber su idAct
          const income = await this.db.ingreso.findFirst({
            where: { idIng: numericId }
          });
      
          if (!income) {
            throw new Error(`Income with id ${id} not found`);
          }
      
          // 2. Borrar usando la clave primaria compuesta
          await this.db.ingreso.delete({
            where: {
              idIng_idAct: {
                idIng: income.idIng,
                idAct: income.idAct
              }
            }
          });
      
        } catch (error) {
          throw new Error(`Error deleting Income with id ${id}: ${error}`);
        }
      }

      async findAll(): Promise<Income[]> {
        const incomes = await this.db.Ingreso.findMany({
          include: {
            actividad: {
              select: { tipoEvento: true } 
            }
          }
        });
        return IncomeResponseDto.toEntities(incomes);
      }
}