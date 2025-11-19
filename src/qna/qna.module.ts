import { Module } from '@nestjs/common';
import { QnAService } from './qna.service';
import { QnAController } from './qna.controller';
import { ContactsModule } from '../contacts/contacts.module';
import { DevPortalModule } from '../dev-portal/dev-portal.module';

@Module({
  imports: [ContactsModule, DevPortalModule],
  controllers: [QnAController],
  providers: [QnAService],
  exports: [QnAService],
})
export class QnAModule {}
