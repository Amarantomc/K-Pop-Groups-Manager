import { isDate } from "util/types";
import { Income } from "../../../domain";
import { activityColumns } from '../../../../../frontend/src/config/datatableSource';

export class IncomeResponseDto {
  constructor(
    public readonly idIncome: number,
    public readonly idActivity: number,
    public readonly description: string,
    public readonly amount: number,
    public readonly date: Date|string,
    public readonly activityType?: string,

  ) {}

  // ---- FROM ENTITY → DTO ----
  static fromEntity(income: Income): IncomeResponseDto {
    return new IncomeResponseDto(
      income.idIncome,
      income.idActivity,
      income.description,
      income.amount,
      isDate(income.date) ? income.date:new Date(income.date),
      income.activityType
    );
  }

  // ---- DTO → ENTITY ----
  static toEntity(data: any): Income {
    return new Income({
      idIncome: data.idIng,
      idActivity: data.idAct,
      description: data.descripcion,
      amount: data.monto,
      date: new Date(data.fecha),
      activityType: data.actividad?.tipoActividad || null // ← aquí va el nombre real
    });
  }

  // ---- ARRAY (Entities → DTOs) ----
  static fromEntities(incomes: Income[]): IncomeResponseDto[] {
    return incomes.map(income => this.fromEntity(income));
  }

  // ---- ARRAY (DTOs → Entities) ----
  static toEntities(incomes: any[]): Income[] {
    return incomes.map(income => this.toEntity(income));
  }
}