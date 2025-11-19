import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { DevPortalService } from './dev-portal.service';

@Controller('dev-portal')
export class DevPortalController {
  constructor(private readonly devPortalService: DevPortalService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.devPortalService.findAll();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  search(@Query('q') query: string) {
    return this.devPortalService.search(query);
  }

  @Get(':uid')
  @HttpCode(HttpStatus.OK)
  findByUid(@Param('uid') uid: string) {
    const doc = this.devPortalService.findByUid(uid);
    if (!doc) {
      throw new NotFoundException(`Document with UID ${uid} not found`);
    }
    return doc;
  }
}
