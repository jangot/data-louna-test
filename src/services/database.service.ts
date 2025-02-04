import { Client } from 'pg';
import { AbstractService } from './abstract-service';

export class DatabaseService extends AbstractService {
    client!: Client;

    async init (): Promise<void> {
        this.client = new Client({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        await this.client.connect();
    };

    getClient() {
        return this.client;
    }

    async destroy() {
        await this.client.end()
    }
}
