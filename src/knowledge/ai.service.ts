import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';

interface AISummary {
  problem: string;
  solution: string;
  tags: string[];
  solved: boolean;
  metadata?: Record<string, any>;
}

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey });
  }

  async summarizeConversation(content: string): Promise<AISummary> {
    const systemPrompt = `Extract structured information from the conversation below.
Return JSON with:
- problem: concise problem statement
- solution: the final solution that worked (or "No solution yet" if unsolved)
- tags: array of 3-7 relevant technical tags
- solved: boolean - true if problem was resolved, false if still open
- metadata: object with any additional info (step_by_step, commands, people_involved, related_docs, etc)

Return ONLY valid JSON.`;

    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_completion_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(
      chatCompletion.choices[0]?.message?.content || '{}',
    );
    return {
      problem: result.problem || 'Unknown problem',
      solution: result.solution || 'No solution yet',
      tags: result.tags || [],
      solved: result.solved || false,
      metadata: result.metadata || null,
    };
  }
}
