import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IcdController } from 'domain/icd/controllers/icd.controller';
import { SearchIcdService } from 'domain/icd/services/search-icd.service';
import { IcdProvider } from 'domain/icd/providers/icd.provider';
import { oauthIcd } from 'common/configs/oauth-icd';

@Module({
  imports: [ConfigModule.forFeature(oauthIcd)],
  controllers: [IcdController],
  providers: [SearchIcdService, IcdProvider],
  exports: [SearchIcdService, IcdProvider],
})
export class IcdModule {}
