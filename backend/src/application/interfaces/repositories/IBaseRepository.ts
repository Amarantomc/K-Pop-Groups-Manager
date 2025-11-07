export interface IBaseRepository<T,TCreate,TUpdate> {
  create(data: TCreate): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}