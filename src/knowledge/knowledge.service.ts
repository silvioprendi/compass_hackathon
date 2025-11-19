import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { KnowledgeArticle } from './entities/knowledge-article.entity';
import { AiService } from './ai.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(KnowledgeArticle)
    private knowledgeRepo: Repository<KnowledgeArticle>,
    private aiService: AiService,
  ) {}

  async create(createDto: CreateKnowledgeDto): Promise<KnowledgeArticle> {
    const summary = await this.aiService.summarizeConversation(
      createDto.content,
    );

    const article = this.knowledgeRepo.create({
      rawContent: createDto.content,
      problem: summary.problem,
      solution: summary.solution,
      tags: summary.tags,
      solved: summary.solved,
      metadata: summary.metadata,
    });

    return this.knowledgeRepo.save(article);
  }

  async search(query: string): Promise<KnowledgeArticle[]> {
    if (!query || query.trim() === '') {
      return this.knowledgeRepo.find({
        order: { createdAt: 'DESC' },
        take: 5,
      });
    }

    const articles = await this.knowledgeRepo
      .createQueryBuilder('article')
      .where('article.problem ILIKE :query', { query: `%${query}%` })
      .orWhere('article.solution ILIKE :query', { query: `%${query}%` })
      .orWhere('EXISTS (SELECT 1 FROM unnest(article.tags) AS tag WHERE tag ILIKE :query)', { query: `%${query}%` })
      .orderBy('article.created_at', 'DESC')
      .limit(5)
      .getMany();

    return articles;
  }

  async findOne(id: string): Promise<KnowledgeArticle | null> {
    return this.knowledgeRepo.findOneBy({ id });
  }
}
