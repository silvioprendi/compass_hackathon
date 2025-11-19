import { Module } from '@nestjs/common';
import { DevPortalService } from './dev-portal.service';
import { DevPortalController } from './dev-portal.controller';

@Module({
  controllers: [DevPortalController],
  providers: [DevPortalService],
  exports: [DevPortalService],
})
export class DevPortalModule {}
