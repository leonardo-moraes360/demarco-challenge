import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchIcdService } from '../services/search-icd.service';
import { SearchIcdDto } from '../dtos/search-icd.dto';
import { IcdSearchResponseDto, IcdEntityDto } from '../dtos/icd-response.dto';

@ApiTags('CID')
@Controller('icd')
export class IcdController {
  constructor(private readonly searchIcdService: SearchIcdService) {}

  @ApiOperation({
    summary: 'Buscar códigos CID',
    description:
      'Busca códigos CID (Classificação Internacional de Doenças) com base nos filtros fornecidos.',
  })
  @ApiOkResponse({
    type: IcdSearchResponseDto,
    description: 'Códigos CID encontrados com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de busca inválidos.',
  })
  @Get()
  findAll(@Query() params: SearchIcdDto): Promise<IcdSearchResponseDto> {
    return this.searchIcdService.perform(params);
  }

  @ApiOperation({
    summary: 'Buscar código CID específico',
    description: 'Busca um código CID específico pelo ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do código CID',
    example: '123456789',
  })
  @ApiOkResponse({
    type: IcdEntityDto,
    description: 'Código CID encontrado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Código CID não encontrado.',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<IcdEntityDto> {
    return this.searchIcdService.findOne(id);
  }
}
