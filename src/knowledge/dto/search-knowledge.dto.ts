import { IsString, IsOptional } from 'class-validator';

export class SearchKnowledgeDto {
  @IsString()
  @IsOptional()
  q?: string;
}
