import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
