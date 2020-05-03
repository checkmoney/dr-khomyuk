import { Transform } from 'class-transformer';

export const TransformBigInt = () =>
  Transform((value: bigint) => value.toString());
