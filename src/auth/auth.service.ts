import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as schema from '../db/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: NodePgDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);

    if (existing.length > 0) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(password, 10);
    const result = await this.db
      .insert(schema.user)
      .values({ email, hashedPassword: hashed })
      .returning();

    const created = result[0]!;
    return { id: created.id, email: created.email };
  }

  async login(email: string, password: string) {
    const [found] = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);

    if (!found) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, found.hashedPassword);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: found.id, email: found.email });
    return { access_token: token };
  }
}
