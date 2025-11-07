import type { PrismaClient } from '../generated/prisma';
import type { IUnitOfWork } from "../application/interfaces/IUnitOfWork";

export class UnitOfWork implements IUnitOfWork {
  private transaction: any = null;

  constructor(private prisma: PrismaClient) {}

  async beginTransaction(): Promise<void> {
    if (this.transaction) {
      throw new Error('Transaction already started');
    }
    
      this.transaction = this.prisma;
    
    // Iniciar transacción real de Prisma
    await this.prisma.$executeRaw`BEGIN`;
    
    console.log('✅ Transaction started');

  }

  async commit(): Promise<void> {
      await this.prisma.$executeRaw`COMMIT`;
    this.transaction = null;
  }

  async rollback(): Promise<void> {
     await this.prisma.$executeRaw`ROLLBACK`;
    this.transaction = null;
    throw new Error('Transaction rolled back');
  }

  isTransactionActive(): boolean {
    return this.transaction !== null;
  }

  getTransaction() {
    return this.transaction || this.prisma;
  }
}