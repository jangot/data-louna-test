import { createClient, RedisClientType } from 'redis';

import { AbstractService } from './abstract-service';


export class RedisService extends AbstractService {
    private client!: RedisClientType;

    async init() {
        const { REDIS_HOST = 'localhost', REDIS_PORT = 6379 } = process.env;
        this.client = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
        this.client.on('error', err => console.log('Redis Client Error', err))
        await this.client.connect();
    }

    async destroy() {
        await this.client.disconnect();
    }

    getClient() {
        return this.client;
    }
}
