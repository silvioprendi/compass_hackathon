import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('current')
  @HttpCode(HttpStatus.OK)
  getCurrentUser() {
    return this.contactsService.getCurrentUser();
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAllContacts() {
    return this.contactsService.getAllContacts();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  search(
    @Query('q') query: string,
    @Query('currentUserId') currentUserId?: string,
  ) {
    return this.contactsService.searchBySkillsAndExpertise(
      query,
      currentUserId,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string) {
    const contact = this.contactsService.findById(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }
}
