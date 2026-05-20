import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DbModule, AuthModule, LinksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
