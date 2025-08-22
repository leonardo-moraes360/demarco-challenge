import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from './session.service';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(private readonly sessionService: SessionService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredSessions() {
    try {
      this.logger.log('Starting cleanup of expired sessions...');

      const cleanedCount = await this.sessionService.cleanupExpiredSessions();

      if (cleanedCount > 0) {
        this.logger.log(`Cleaned up ${cleanedCount} expired sessions`);
      } else {
        this.logger.debug('No expired sessions found');
      }
    } catch (error) {
      this.logger.error('Error during session cleanup:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyCleanupReport() {
    try {
      this.logger.log('Running daily session cleanup report...');

      this.logger.log('Daily session cleanup report completed');
    } catch (error) {
      this.logger.error('Error during daily cleanup report:', error);
    }
  }
}
