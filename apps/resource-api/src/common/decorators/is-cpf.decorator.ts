import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsCPFConstraint } from 'common/validators/is-cpf.validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCPFConstraint,
    });
  };
}
