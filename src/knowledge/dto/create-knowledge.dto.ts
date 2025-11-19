import { IsString, IsNotEmpty } from 'class-validator';

export class CreateKnowledgeDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
