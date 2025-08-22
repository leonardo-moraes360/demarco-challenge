import type { User } from './auth';

export type IcdVersion = 'ICD_10' | 'ICD_11';
export type CertificateStatus = 'active' | 'inactive';

export interface MedicalCertificate {
  id: string;
  number: string | null;
  verificationCode: string | null;
  icd: string;
  icdVersion: IcdVersion;
  fileName: string;
  fileHash: string;
  fileUri?: string;
  startsAt: string;
  endsAt: string;
  status: CertificateStatus;
  userBelongsToId: string;
  userCreatedById: string;
  userBelongsTo?: User;
  userCreatedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalCertificateRequest {
  number?: string | null;
  verificationCode?: string | null;
  icd: string;
  icdVersion: IcdVersion;
  startsAt: string;
  endsAt: string;
  userBelongsToId: string;
  userCreatedById: string;
  file: File;
}

export interface UpdateMedicalCertificateRequest {
  number?: string | null;
  verificationCode?: string | null;
  icd?: string;
  icdVersion?: IcdVersion;
  startsAt?: string;
  endsAt?: string;
  status?: CertificateStatus;
}

export interface MedicalCertificatesResponse {
  data: MedicalCertificate[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface MedicalCertificatesQueryParams {
  page?: number;
  page_size?: number;
  number?: string;
  verificationCode?: string;
  icd?: string;
  icdVersion?: IcdVersion;
  status?: CertificateStatus;
  startsAt?: string;
  endsAt?: string;
  userBelongsTo?: string;
  userCreatedBy?: string;
  userBelongsToName?: string;
  userCreatedByName?: string;
}
