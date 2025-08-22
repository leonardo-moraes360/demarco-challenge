import {
  FileValidator,
  FileTypeValidator,
  type FileTypeValidatorOptions,
} from '@nestjs/common';

type AllowedType = string | RegExp | FileTypeValidatorOptions;

export class MultiFileTypeValidator extends FileValidator<
  { fileTypes: (string | RegExp)[] },
  Express.Multer.File
> {
  private readonly validators: FileTypeValidator[];
  private currentFileType: string | null = null;

  constructor(fileTypes: AllowedType[]) {
    const normalized = fileTypes.map((t) =>
      typeof t === 'string' || t instanceof RegExp ? t : t.fileType,
    );

    super({ fileTypes: normalized });

    this.validators = normalized.map(
      (fileType) => new FileTypeValidator({ fileType }),
    );
  }

  async isValid(file?: Express.Multer.File): Promise<boolean> {
    if (!file) {
      return false;
    }

    const validations = await Promise.all(
      this.validators.map((validator) => validator.isValid(file)),
    );

    const isValid = validations.some(Boolean);

    this.currentFileType = !isValid ? file.mimetype : null;

    return isValid;
  }

  buildErrorMessage(): string {
    const list = this.validationOptions.fileTypes
      .map((t) => (t instanceof RegExp ? t.toString() : t))
      .join(', ');

    return `Tipo de arquivo ${this.currentFileType || 'desconhecido'} é inválido. Os tipos permitidos são ${list}.`;
  }
}
