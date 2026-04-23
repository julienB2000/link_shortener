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
  postUrl(@Body() createLinkDto: CreateLinkDto) {
    const url = createLinkDto.url;
    const returnUrl = this.linkService.shortenerUrl(url);
    return returnUrl;
  }

  @Get(':code')
  @Redirect()
  async getUrl(@Param('code') code: string) {
    console.log('Je rentre ici');
    const returnUrl = await this.linkService.returnUrlByCode(code);
    console.log(returnUrl);
    if (!returnUrl) throw new NotFoundException();
    console.log('after');
    return { url: returnUrl.url, statusCode: 302 };
  }
}
