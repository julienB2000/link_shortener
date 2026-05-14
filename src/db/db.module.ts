import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // Importe ton fichier schema.ts
import 'dotenv/config';

@Global() // Permet d'utiliser la DB partout sans ré-importer le module
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          throw new Error('DATABASE_URL is missing in .env file');
        }

        const pool = new Pool({
          connectionString: connectionString, // Assure-toi que c'est bien une string
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'], // On l'exporte pour que les autres services y aient accès
})
export class DbModule {}
