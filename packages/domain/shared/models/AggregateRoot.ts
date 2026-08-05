export interface Entity<TId> {
  id: TId;
  createdAt: string;
  updatedAt: string;
}

export interface AggregateRoot<TId> extends Entity<TId> {
  version: number;
}
