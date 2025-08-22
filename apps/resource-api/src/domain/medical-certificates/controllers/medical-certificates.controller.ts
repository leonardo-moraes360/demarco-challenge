import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE_10MB } from 'common/constants/file-size';
import { MultiFileTypeValidator } from 'common/validators/multi-file-type.validator';
import { JwtAuthGuard } from 'domain/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'domain/auth/decorators/current-user.decorator';
import { CreateMedicalCertificateService } from '../services/create-medical-certificate.service';
import { CreateMedicalCertificateDto } from '../dtos/create-medical-certificate.dto';
import { FindOneMedicalCertificateService } from '../services/find-one-medical-certificates.service';
import { FindOneMedicalCertificateQueryDto } from '../dtos/find-one-medical-certificate-query.dto';
import { FindAllMedicalCertificateService } from '../services/find-all-medical-certificates.service';
import { FindAllMedicalCertificateQueryDto } from '../dtos/find-all-medical-certificate-query.dto';
import { FindAllMedicalCertificateResponseDto } from '../dtos/find-all-medical-certificate-response.dto';
import { UpdateMedicalCertificateService } from '../services/update-medical-certificates.service';
import { UpdateMedicalCertificateDto } from '../dtos/update-medical-certificate.dto';
import { DeleteMedicalCertificateService } from '../services/delete-medical-certificate.service';
import { MedicalCertificateDto } from '../dtos/medical-certificate.dto';

@ApiTags('Atestado Médico')
@ApiBearerAuth()
@Controller('medical-certificates')
@UseGuards(JwtAuthGuard)
export class MedicalCertificatesController {
  constructor(
    private readonly createMedicalCertificateService: CreateMedicalCertificateService,
    private readonly findOneMedicalCertificateService: FindOneMedicalCertificateService,
    private readonly findAllMedicalCertificateService: FindAllMedicalCertificateService,
    private readonly updateMedicalCertificateService: UpdateMedicalCertificateService,
    private readonly deleteMedicalCertificateService: DeleteMedicalCertificateService,
  ) {}

  @ApiOperation({
    summary: 'Cria um novo atestado médico',
    description: 'Cria um novo atestado médico com os dados fornecidos.',
  })
  @ApiCreatedResponse({
    type: MedicalCertificateDto,
    description: 'Atestado médico criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Erro ao criar atestado médico. Verifique os dados fornecidos.',
  })
  @ApiNotFoundResponse({
    description:
      'Algum dos usuários envolvidos na criação do atestado médico não existem.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateMedicalCertificateDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Body() data: CreateMedicalCertificateDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_10MB }),
          new MultiFileTypeValidator([
            { fileType: 'image/jpeg' },
            { fileType: 'image/png' },
            { fileType: 'application/pdf' },
          ]),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<MedicalCertificateDto> {
    return this.createMedicalCertificateService.perform(data, file);
  }

  @ApiOperation({
    summary: 'Lista atestados médicos',
    description:
      'Lista todos os atestados médicos cadastrados pelos filtros fornecidos.',
  })
  @ApiOkResponse({
    type: FindAllMedicalCertificateResponseDto,
    description: 'Atestados médicos encontrados com sucesso.',
  })
  @Get()
  findAll(
    @Query() params: FindAllMedicalCertificateQueryDto,
  ): Promise<FindAllMedicalCertificateResponseDto> {
    return this.findAllMedicalCertificateService.perform(params);
  }

  @ApiOperation({
    summary: 'Busca um atestado médico',
    description: 'Busca um atestado médico ID fornecido.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID do atestado médico',
    required: true,
  })
  @ApiOkResponse({
    type: MedicalCertificateDto,
    description: 'Atestado médico encontrado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Atestado médico não encontrado.',
  })
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() params: FindOneMedicalCertificateQueryDto,
  ): Promise<MedicalCertificateDto> {
    return this.findOneMedicalCertificateService.perform(id, params);
  }

  @ApiOperation({
    summary: 'Atualiza atestado médico',
    description: 'Atualiza um atestado médico pelo ID fornecido.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID do atestado médico',
    required: true,
  })
  @ApiOkResponse({
    type: MedicalCertificateDto,
    description: 'Atestado médico atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Erro ao atualizar atestado médico. Verifique os dados fornecidos.',
  })
  @ApiNotFoundResponse({
    description: 'Atestado médico não encontrado.',
  })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateMedicalCertificateDto,
  ): Promise<MedicalCertificateDto> {
    return this.updateMedicalCertificateService.perform(id, data);
  }

  @ApiOperation({
    summary: 'Deleta atestado médico',
    description: 'Deleta um atestado médico pelo ID fornecido.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID do atestado médico',
    required: true,
  })
  @ApiNoContentResponse({
    description: 'Atestado médico deletado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Atestado médico não encontrado.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleted(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.deleteMedicalCertificateService.perform(id);
  }
}
