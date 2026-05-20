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
    for (let attempt = 0; attempt < 5; attempt++) {
      const token = randtoken.generate(6);
      const result = await this.db
        .insert(schema.links)
        .values({ url, shortCode: token })
        .returning()
        .catch(() => null);
      if (result) return result[0];
    }
    throw new Error('Failed to generate a unique short code');
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
