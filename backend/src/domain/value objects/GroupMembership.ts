export class GroupMembership {
  constructor(
    public readonly groupId: number,
    public readonly role: string,
    public readonly startDate: Date,
    public readonly endDate?: Date  // undefined = aún activo
  ) {}

  // Método helper para saber si está activo
  isActive(): boolean {
    return this.endDate === undefined;
  }
}