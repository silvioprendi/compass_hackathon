import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { SearchKnowledgeDto } from './dto/search-knowledge.dto';

@Controller('api/knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  async create(@Body() createDto: CreateKnowledgeDto) {
    return this.knowledgeService.create(createDto);
  }

  @Get('search')
  async search(@Query() searchDto: SearchKnowledgeDto) {
    return this.knowledgeService.search(searchDto.q || '');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const article = await this.knowledgeService.findOne(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
}
