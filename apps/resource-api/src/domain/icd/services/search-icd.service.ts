import { Injectable } from '@nestjs/common';
import { IcdProvider } from '../providers/icd.provider';
import { SearchIcdDto } from '../dtos/search-icd.dto';
import { IcdSearchResponseDto, IcdEntityDto } from '../dtos/icd-response.dto';

@Injectable()
export class SearchIcdService {
  constructor(private readonly icdProvider: IcdProvider) {}

  async perform(params: SearchIcdDto): Promise<IcdSearchResponseDto> {
    const result = await this.icdProvider.findAll(params);

    return {
      entities: result.destinationEntities || result.entities || [],
      totalCount: result.totalCount,
      offset: params.offset || 0,
      limit: params.limit || 10,
    };
  }

  async findOne(id: string): Promise<IcdEntityDto> {
    const result = await this.icdProvider.findOne(id);
    return result as IcdEntityDto;
  }
}
