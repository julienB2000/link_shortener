import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { CreateLinkDto } from './DTO/create-link.dto';
import { LinksService } from './links.service';

@Controller('links')
export class LinksController {
  constructor(private linkService: LinksService) {}

  @Post()
  async postUrl(@Body() createLinkDto: CreateLinkDto) {
    const url = createLinkDto.url;
    const returnUrl = await this.linkService.shortenerUrl(url);
    return returnUrl;
  }

  @Get(':code')
  @Redirect()
  async getUrl(@Param('code') code: string) {
    const returnUrl = await this.linkService.returnUrlByCode(code);
    if (!returnUrl) throw new NotFoundException();
    return { url: returnUrl.url, statusCode: 302 };
  }
}
