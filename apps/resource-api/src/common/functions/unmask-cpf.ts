import { type TransformFnParams } from 'class-transformer';

export function unmaskCpf({ value }: TransformFnParams): any {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\D/g, '').trim();
}
