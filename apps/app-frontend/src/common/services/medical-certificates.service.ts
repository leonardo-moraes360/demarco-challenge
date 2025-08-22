import { api } from './api';
import type { 
  MedicalCertificate, 
  CreateMedicalCertificateRequest, 
  UpdateMedicalCertificateRequest, 
  MedicalCertificatesResponse,
  MedicalCertificatesQueryParams 
} from '@/common/types/medical-certificate';

export class MedicalCertificatesService {
  static async getCertificates(params?: MedicalCertificatesQueryParams): Promise<MedicalCertificatesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = queryString ? `medical-certificates?${queryString}` : 'medical-certificates';
    
    return api.get(url).json<MedicalCertificatesResponse>();
  }

  static async getCertificate(id: string): Promise<MedicalCertificate> {
    return api.get(`medical-certificates/${id}`).json<MedicalCertificate>();
  }

  static async createCertificate(data: CreateMedicalCertificateRequest): Promise<MedicalCertificate> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'file') {
          formData.append(key, value as File);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    return api.post('medical-certificates', { body: formData }).json<MedicalCertificate>();
  }

  static async updateCertificate(id: string, data: UpdateMedicalCertificateRequest): Promise<MedicalCertificate> {
    return api.patch(`medical-certificates/${id}`, { json: data }).json<MedicalCertificate>();
  }

  static async deleteCertificate(id: string): Promise<void> {
    return api.delete(`medical-certificates/${id}`).json<void>();
  }
}
