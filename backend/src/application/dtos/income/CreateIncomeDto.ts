export class CreateIncomeDto {
    constructor(
      public readonly description: string,
      public readonly amount: number,
      public readonly idActivity: number
    ) {}
  
    static create(body: any): CreateIncomeDto {
      // Validación de campos requeridos
      if (!body.description || body.amount === undefined || !body.idActivity) {
        throw new Error('Missing required fields');
      }
  
      // Creación correcta del DTO
      return new CreateIncomeDto(
        body.description,
        Number(body.amount),
        Number(body.idActivity)
      );
    }
  }