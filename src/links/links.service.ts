import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import randtoken from 'rand-token';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class LinksService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: NodePgDatabase<typeof schema>,
  ) {}
  async shortenerUrl(url: string): Promise<schema.Link | undefined> {
    const token = randtoken.generate(6);

    const returnedUrl = await this.db
      .insert(schema.links)
      .values({ url: url, shortCode: token })
      .returning();
    return returnedUrl[0];
  }

  async returnUrlByCode(code: string): Promise<schema.Link | undefined> {
    const returnedUrl = await this.db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortCode, code))
      .limit(1);
    return returnedUrl[0];
  }
}

/**MEttre en base tout et return le generate url */
