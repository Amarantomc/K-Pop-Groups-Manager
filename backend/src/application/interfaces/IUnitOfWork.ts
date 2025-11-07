export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  isTransactionActive(): boolean;
  getTransaction(): any;
}