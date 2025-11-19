import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  hierarchyLevel: number;
  hierarchyType: string;
  relationshipToBruno: string;
  skills: string[];
  expertise: string[];
  teamSize: number;
  profileImage: string;
  email: string;
  supportType?: string;
  specialization?: string;
}

export interface ContactsData {
  currentUser: Contact | null;
  contacts: Contact[];
  skillIndex: Record<string, string[]>;
}

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);
  private contactsData: ContactsData;

  constructor() {
    this.loadContacts();
  }

  private loadContacts() {
    try {
      const filePath = join(process.cwd(), 'dist', 'contacts', 'contacts.json');
      const fileContent = readFileSync(filePath, 'utf-8');
      this.contactsData = JSON.parse(fileContent);
      this.logger.log(
        `Loaded ${this.contactsData.contacts.length} contacts for user ${this.contactsData.currentUser?.name || 'Unknown'}`,
      );
    } catch (error) {
      this.logger.error('Failed to load contacts', error);
      this.contactsData = { currentUser: null, contacts: [], skillIndex: {} };
    }
  }

  getCurrentUser(): Contact | null {
    return this.contactsData.currentUser;
  }

  getAllContacts(): Contact[] {
    return this.contactsData.contacts;
  }

  searchBySkillsAndExpertise(query: string, currentUserId?: string): Contact[] {
    if (!query || query.trim() === '') {
      return this.contactsData.contacts.filter(
        (contact) =>
          contact.id !== (currentUserId || this.contactsData.currentUser?.id),
      );
    }

    const searchTerm = query.toLowerCase().trim();
    this.logger.log(`Searching contacts for skill/expertise: ${searchTerm}`);

    const matchedContacts = this.contactsData.contacts.filter((contact) => {
      if (contact.id === (currentUserId || this.contactsData.currentUser?.id)) {
        return false;
      }

      const matchesSkills = contact.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm),
      );
      const matchesExpertise = contact.expertise.some((exp) =>
        exp.toLowerCase().includes(searchTerm),
      );

      return matchesSkills || matchesExpertise;
    });

    return this.sortByRelevance(matchedContacts, searchTerm);
  }

  private sortByRelevance(contacts: Contact[], searchTerm: string): Contact[] {
    return contacts.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, searchTerm);
      const scoreB = this.calculateRelevanceScore(b, searchTerm);
      return scoreB - scoreA;
    });
  }

  private calculateRelevanceScore(
    contact: Contact,
    searchTerm: string,
  ): number {
    let score = 0;

    contact.skills.forEach((skill) => {
      if (skill.toLowerCase() === searchTerm) {
        score += 10;
      } else if (skill.toLowerCase().includes(searchTerm)) {
        score += 5;
      }
    });

    contact.expertise.forEach((exp) => {
      if (exp.toLowerCase() === searchTerm) {
        score += 8;
      } else if (exp.toLowerCase().includes(searchTerm)) {
        score += 3;
      }
    });

    return score;
  }

  findById(id: string): Contact | undefined {
    if (id === this.contactsData.currentUser?.id) {
      return this.contactsData.currentUser;
    }
    return this.contactsData.contacts.find((contact) => contact.id === id);
  }
}
