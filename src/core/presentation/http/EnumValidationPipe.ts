import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export class EnumValidationPipe<E>
  implements PipeTransform<string | undefined, E> {
  private readonly values: Array<string>;

  constructor(enumType: object) {
    this.values = Object.values(enumType);
  }

  transform(value: string, metadata: ArgumentMetadata): E {
    if (!this.values.includes(value)) {
      throw new BadRequestException(`Invalid value ${value}`);
    }

    return value as any;
  }
}
