import { AbstractService } from './abstract-service';
import { serviceRegister } from '../service-register';
import { SkinportItem } from '../types/skinport';

const TRADABLE_CACHE_KEY = 'tradable';
const NON_TRADABLE_CACHE_KEY = 'non_tradable';

interface Product {
    name: string;
    tradablePrice: number;
    nonTradablePrice: number;
}

export class SkinportService extends AbstractService {
    async loadList(): Promise<Product[]> {
        const [tradable, nonTradable] = await Promise.all([
            this.getOneList(true),
            this.getOneList(false),
        ]);


        const result = new Map<string, Product>();

        tradable.forEach(item => {
            result.set(item.market_hash_name, {
                name: item.market_hash_name,
                tradablePrice: item.min_price,
                nonTradablePrice: 0,
            })
        });

        nonTradable.forEach(item => {
            let product = result.get(item.market_hash_name);
            if (product) {
                product.nonTradablePrice = item.min_price;
            } else {
                product = {
                    name: item.market_hash_name,
                    tradablePrice: 0,
                    nonTradablePrice: item.min_price
                }
            }

            result.set(item.market_hash_name, product);
        });

        return [...result.values()];
    }

    public async getOneList(tradable: boolean): Promise<SkinportItem[]> {
        const cacheKey = tradable ? TRADABLE_CACHE_KEY : NON_TRADABLE_CACHE_KEY;
        const cache = await this.getFromCache(cacheKey);
        if (cache) {
            console.log(cacheKey, 'got from cache');
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
        await serviceRegister.redis.getClient().set(KEY, JSON.stringify(data), { EX: 60 * 8 });
    }

    private  async getFromCache(KEY: string): Promise<SkinportItem[] | undefined> {
        const cache = await serviceRegister.redis.getClient().get(TRADABLE_CACHE_KEY);
        if (cache) {
            return JSON.parse(cache);
        }
    }
}
