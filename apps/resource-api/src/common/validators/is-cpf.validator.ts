import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  type ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCPF' })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const num = value.replace(/\D/g, '');

    if (num.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(num)) {
      return false;
    }

    if (!/^\d{11}$/.test(num)) {
      return false;
    }

    const calcDV = (base: string, pesoInicial: number) => {
      let soma = 0;

      for (let i = 0; i < base.length; i++) {
        soma += Number(base[i]) * (pesoInicial - i);
      }

      const resto = soma % 11;

      return resto < 2 ? 0 : 11 - resto;
    };

    const dv1 = calcDV(num.slice(0, 9), 10);

    const dv2 = calcDV(num.slice(0, 9) + String(dv1), 11);

    return num.endsWith(`${dv1}${dv2}`);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} deve ser um CPF válido.`;
  }
}
