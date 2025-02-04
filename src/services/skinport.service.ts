import { AbstractService } from './abstract-service';
import { serviceRegister } from '../service-register';
import { SkinportItem } from '../types/skinport';

const TRADABLE_CACHE_KEY = 'tradable';
const NON_TRADABLE_CACHE_KEY = 'non_tradable';

export class SkinportService extends AbstractService {
    async loadList(): Promise<any> {
        const [tradable, nonTradable] = await Promise.all([
            this.getOneList(true),
            this.getOneList(false),
        ]);

        return { tradable, nonTradable }
    }

    private async getOneList(tradable: boolean): Promise<SkinportItem[]> {
        const cacheKey = tradable ? TRADABLE_CACHE_KEY : NON_TRADABLE_CACHE_KEY;
        const cache = await this.getFromCache(cacheKey);
        if (cache) {
            return cache;
        }

        try {
            const list = await serviceRegister.skinportClient.loadList(tradable);

            this.saveToCache(cacheKey, list).then(() => console.log(cacheKey, 'saved'));

            return list;
        } catch (error) {
            return [];
        }

    }

    private async saveToCache(KEY: string, data: SkinportItem[]) {
        await serviceRegister.redis.getClient().set(KEY, JSON.stringify(data), { EX: 60 });
    }

    private  async getFromCache(KEY: string): Promise<SkinportItem[] | undefined> {
        const cache = await serviceRegister.redis.getClient().get(TRADABLE_CACHE_KEY);
        if (cache) {
            return JSON.parse(cache);
        }
    }
}
