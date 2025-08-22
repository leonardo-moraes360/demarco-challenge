import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export function handleRequestError(error: unknown): never {
  if (error instanceof AxiosError) {
    throw new HttpException(
      error?.message || 'An unknown error occurred',
      error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  throw new HttpException(
    error || 'An unknown error occurred',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
