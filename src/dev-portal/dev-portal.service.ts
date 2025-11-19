import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface DevPortalDoc {
  name: string;
  title: string;
  description: string;
  tags: string[];
  uid: string;
  link: string;
}

@Injectable()
export class DevPortalService {
  private readonly logger = new Logger(DevPortalService.name);
  private docs: DevPortalDoc[] = [];

  constructor() {
    this.loadDocs();
  }

  private loadDocs() {
    try {
      const filePath = join(
        process.cwd(),
        'dist',
        'dev-portal',
        'dev-portal-docs.json',
      );
      const fileContent = readFileSync(filePath, 'utf-8');
      this.docs = JSON.parse(fileContent);
      this.logger.log(`Loaded ${this.docs.length} dev portal documents`);
    } catch (error) {
      this.logger.error('Failed to load dev portal docs', error);
      this.docs = [];
    }
  }

  findAll(): DevPortalDoc[] {
    return this.docs;
  }

  search(query: string): DevPortalDoc[] {
    if (!query || query.trim() === '') {
      return this.docs;
    }

    const searchTerm = query.toLowerCase().trim();
    this.logger.log(`Searching for: ${searchTerm}`);

    return this.docs.filter((doc) => {
      const matchesName = doc.name.toLowerCase().includes(searchTerm);
      const matchesTitle = doc.title.toLowerCase().includes(searchTerm);
      const matchesDescription = doc.description
        .toLowerCase()
        .includes(searchTerm);
      const matchesTags = doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm),
      );

      return matchesName || matchesTitle || matchesDescription || matchesTags;
    });
  }

  findByUid(uid: string): DevPortalDoc | undefined {
    return this.docs.find((doc) => doc.uid === uid);
  }
}
