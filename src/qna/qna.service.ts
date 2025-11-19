import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ContactsService, Contact } from '../contacts/contacts.service';
import { DevPortalService, DevPortalDoc } from '../dev-portal/dev-portal.service';

export interface QnAItem {
  id: string;
  question: string;
  keywords: string[];
  summary: string;
  answer: string;
  fullGuideLink: string;
  relatedSkills: string[];
  relatedTags: string[];
}

export interface QnAResponse {
  found: boolean;
  question?: string;
  answer?: string;
  summary?: string;
  fullGuideLink?: string;
  suggestedContacts: Contact[];
  relatedDocs: DevPortalDoc[];
  message?: string;
}

@Injectable()
export class QnAService {
  private readonly logger = new Logger(QnAService.name);
  private qnaData: QnAItem[] = [];

  constructor(
    private readonly contactsService: ContactsService,
    private readonly devPortalService: DevPortalService,
  ) {
    this.loadQnAData();
  }

  private loadQnAData() {
    try {
      const filePath = join(__dirname, '..', '..', 'qna', 'qna-data.json');
      this.logger.log(`Loading Q&A data from: ${filePath}`);
      const fileContent = readFileSync(filePath, 'utf-8');
      this.qnaData = JSON.parse(fileContent);
      this.logger.log(`Loaded ${this.qnaData.length} Q&A items`);
    } catch (error) {
      this.logger.error('Failed to load Q&A data', error);
      this.qnaData = [];
    }
  }

  ask(question: string, currentUserId?: string): QnAResponse {
    const searchTerm = question.toLowerCase().trim();
    this.logger.log(`User asked: ${searchTerm}`);

    const matchedQnA = this.findMatchingQnA(searchTerm);

    if (matchedQnA) {
      this.logger.log(`Found exact match for question: ${matchedQnA.id}`);
      
      const contacts = this.findRelatedContacts(matchedQnA.relatedSkills, currentUserId);
      const docs = this.findRelatedDocs(matchedQnA.relatedTags);

      return {
        found: true,
        question: matchedQnA.question,
        answer: matchedQnA.answer,
        summary: matchedQnA.summary,
        fullGuideLink: matchedQnA.fullGuideLink,
        suggestedContacts: contacts,
        relatedDocs: docs,
      };
    } else {
      this.logger.log(`No exact match found, searching for help...`);
      
      const keywords = this.extractKeywords(searchTerm);
      const contacts = this.findContactsByKeywords(keywords, currentUserId);
      const docs = this.findDocsByKeywords(keywords);

      return {
        found: false,
        message: "I don't have an exact answer, but here are some people who might help and related documentation:",
        suggestedContacts: contacts,
        relatedDocs: docs,
      };
    }
  }

  private findMatchingQnA(searchTerm: string): QnAItem | null {
    for (const item of this.qnaData) {
      if (item.question.toLowerCase().includes(searchTerm)) {
        return item;
      }

      const matchesKeyword = item.keywords.some((keyword) =>
        searchTerm.includes(keyword.toLowerCase()),
      );
      if (matchesKeyword) {
        return item;
      }
    }
    return null;
  }

  private extractKeywords(text: string): string[] {
    const stopWords = ['how', 'to', 'what', 'is', 'the', 'a', 'an', 'can', 'i', 'do', 'in', 'with', 'for'];
    const words = text.split(/\s+/).filter((word) => 
      word.length > 2 && !stopWords.includes(word.toLowerCase())
    );
    return words;
  }

  private findRelatedContacts(skills: string[], currentUserId?: string): Contact[] {
    const contacts: Contact[] = [];
    const addedIds = new Set<string>();

    for (const skill of skills) {
      const matchedContacts = this.contactsService.searchBySkillsAndExpertise(skill, currentUserId);
      for (const contact of matchedContacts.slice(0, 3)) {
        if (!addedIds.has(contact.id)) {
          contacts.push(contact);
          addedIds.add(contact.id);
        }
      }
    }

    return contacts.slice(0, 5);
  }

  private findRelatedDocs(tags: string[]): DevPortalDoc[] {
    const docs: DevPortalDoc[] = [];
    const addedUids = new Set<string>();

    for (const tag of tags) {
      const matchedDocs = this.devPortalService.search(tag);
      for (const doc of matchedDocs.slice(0, 3)) {
        if (!addedUids.has(doc.uid)) {
          docs.push(doc);
          addedUids.add(doc.uid);
        }
      }
    }

    return docs.slice(0, 5);
  }

  private findContactsByKeywords(keywords: string[], currentUserId?: string): Contact[] {
    const contacts: Contact[] = [];
    const addedIds = new Set<string>();

    for (const keyword of keywords) {
      const matchedContacts = this.contactsService.searchBySkillsAndExpertise(keyword, currentUserId);
      for (const contact of matchedContacts.slice(0, 2)) {
        if (!addedIds.has(contact.id)) {
          contacts.push(contact);
          addedIds.add(contact.id);
        }
      }
    }

    return contacts.slice(0, 5);
  }

  private findDocsByKeywords(keywords: string[]): DevPortalDoc[] {
    const docs: DevPortalDoc[] = [];
    const addedUids = new Set<string>();

    for (const keyword of keywords) {
      const matchedDocs = this.devPortalService.search(keyword);
      for (const doc of matchedDocs.slice(0, 2)) {
        if (!addedUids.has(doc.uid)) {
          docs.push(doc);
          addedUids.add(doc.uid);
        }
      }
    }

    return docs.slice(0, 5);
  }

  getAllQuestions(): QnAItem[] {
    return this.qnaData;
  }
}
