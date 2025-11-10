import type { PrismaClient } from '../generated/prisma';
import type { IUnitOfWork } from "../application/interfaces/IUnitOfWork";
import { inject, injectable } from 'inversify';
import { Types } from './di/Types';

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private transaction: any = null;

  constructor(@inject(Types.PrismaClient) private prisma: PrismaClient) {}

  async beginTransaction(): Promise<void> {
    if (this.transaction) {
      throw new Error('Transaction already started');
    }
    
      this.transaction = this.prisma;
    
    // Iniciar transacción real de Prisma
    await this.prisma.$executeRaw`BEGIN`;
    
     

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