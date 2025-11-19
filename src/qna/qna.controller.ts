import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { QnAService } from './qna.service';

@Controller('qna')
export class QnAController {
  constructor(private readonly qnaService: QnAService) {}

  @Get('ask')
  @HttpCode(HttpStatus.OK)
  ask(
    @Query('q') question: string,
    @Query('currentUserId') currentUserId?: string,
  ) {
    if (!question || question.trim() === '') {
      throw new BadRequestException('Question parameter "q" is required');
    }
    return this.qnaService.ask(question, currentUserId);
  }

  @Get('questions')
  @HttpCode(HttpStatus.OK)
  getAllQuestions() {
    return this.qnaService.getAllQuestions();
  }
}
