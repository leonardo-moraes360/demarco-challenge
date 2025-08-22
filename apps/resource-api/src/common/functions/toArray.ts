import { type TransformFnParams } from 'class-transformer';

export function toArray({ value }: TransformFnParams): any {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null) {
    return [];
  }

  return [value];
}
