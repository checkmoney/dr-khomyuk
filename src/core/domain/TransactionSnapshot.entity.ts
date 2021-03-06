import { Transaction } from '@checkmoney/soap-opera';
import { Entity, PrimaryColumn, Column } from 'typeorm';

import { NormalizedTransaction } from './dto/NormalizedTransaction';

interface Normalized {
  earnings: NormalizedTransaction[];
  expenses: NormalizedTransaction[];
}

@Entity('transaction_snapshots')
export class TransactionSnapshot implements Transaction {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'amount' })
  amount: string;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'date', type: Date })
  date: Date;

  @Column({ name: 'category' })
  category: string;

  @Column({ name: 'user_id' })
  userId: string;

  constructor(
    id: string,
    amount: string,
    currency: string,
    date: Date,
    category: string,
    userId: string,
  ) {
    this.id = id;
    this.amount = amount;
    this.currency = currency;
    this.date = date;
    this.category = category;
    this.userId = userId;
  }

  static fromTransaction(userId: string) {
    return (transaction: Transaction) =>
      new TransactionSnapshot(
        transaction.id,
        transaction.amount,
        transaction.currency,
        transaction.date,
        transaction.category,
        userId,
      );
  }

  static normalize(transactions: TransactionSnapshot[]): Normalized {
    return {
      earnings: transactions
        .filter((transaction) => parseInt(transaction.amount, 10) > 0)
        .map((transaction) => ({
          ...transaction,
          amount: BigInt(transaction.amount),
        })),
      expenses: transactions
        .filter((transaction) => parseInt(transaction.amount, 10) < 0)
        .map((transaction) => ({
          ...transaction,
          amount: -BigInt(transaction.amount),
        })),
    };
  }

  convertToOtherCurrency(newAmount: string, newCurrency: string) {
    this.amount = newAmount;
    this.currency = newCurrency;
  }
}
