import { api } from './api';

export interface IcdSearchParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface IcdEntity {
  id: string;
  title: string;
  definition?: string;
  inclusion?: string;
  exclusion?: string;
  code?: string;
}

export interface IcdSearchResponse {
  entities: IcdEntity[];
  totalCount: number;
  offset: number;
  limit: number;
}

export class IcdService {
  static async searchIcd(params: IcdSearchParams): Promise<IcdSearchResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.q) {
      searchParams.append('q', params.q);
    }
    if (params.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params.offset) {
      searchParams.append('offset', params.offset.toString());
    }
    
    const queryString = searchParams.toString();
    const url = queryString ? `icd?${queryString}` : 'icd';
    
    return api.get(url).json<IcdSearchResponse>();
  }

  static async getIcdById(id: string): Promise<IcdEntity> {
    return api.get(`icd/${id}`).json<IcdEntity>();
  }
}
