import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum ProgressType {
  Currency = 'currency',
  Transactions = 'transactions',
}

@Entity('progress')
export class Progress {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'type' })
  type: ProgressType;

  constructor(id: string, userId: string, type: ProgressType) {
    this.id = id;
    this.userId = userId;
    this.type = type;
  }
}
