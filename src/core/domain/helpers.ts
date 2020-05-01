import { NormalizedTransaction } from './dto/NormalizedTransaction';

export const toAmount = ({ amount }: NormalizedTransaction) => amount;

export const summarize = (prev: bigint, curr: bigint) => prev + curr;
