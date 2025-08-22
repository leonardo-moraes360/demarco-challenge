import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { IcdProvider } from '../providers/icd.provider';
import { SearchIcdDto } from '../dtos/search-icd.dto';
import { IcdSearchResponseDto, IcdEntityDto } from '../dtos/icd-response.dto';

@Injectable()
export class SearchIcdService {
  constructor(
    private readonly icdProvider: IcdProvider,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async perform(params: SearchIcdDto): Promise<IcdSearchResponseDto> {
    const cacheKey = `icd:search:${JSON.stringify(params)}`;
    
    let result = await this.cacheManager.get<IcdSearchResponseDto>(cacheKey);
    
    if (!result) {
      const apiResult = await this.icdProvider.findAll(params);
      
      result = {
        entities: apiResult.destinationEntities || apiResult.entities || [],
        totalCount: apiResult.totalCount,
        offset: params.offset || 0,
        limit: params.limit || 10,
      };
      
      await this.cacheManager.set(cacheKey, result, 300000);
    }

    return result;
  }

  async findOne(id: string): Promise<IcdEntityDto> {
    const result = await this.icdProvider.findOne(id);
    return result as IcdEntityDto;
  }
}
