import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [LinksModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
