export class UpdateIncomeDto {
    constructor(
      public readonly description?: string,
      public readonly amount?: number,
    ) {}
  
    static create(body: any): UpdateIncomeDto {
      return new UpdateIncomeDto(
        body.description,            // string | undefined
        body.amount ? Number(body.amount) : undefined,   // number | undefined
      );
    }
  }