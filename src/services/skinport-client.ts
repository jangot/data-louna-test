import axios, { AxiosInstance, isAxiosError } from 'axios';
import { AbstractService } from './abstract-service';
import { SkinportItem } from '../types/skinport';

export enum SkinportClientExceptionCode {
    DATA_WAS_NOT_LOADED = 'data_was_not_loaded',
}

export class SkinportClientException extends Error {
    constructor(public readonly code: SkinportClientExceptionCode) {
        super(code);
    }
}

export class SkinportClient extends AbstractService {
    client!: AxiosInstance;

    async init() {
        this.client = axios.create({
            baseURL: 'https://api.skinport.com/v1',
            headers: {
                'Accept-Encoding': 'br'
            }
        });
    }

    async loadList(tradable: boolean): Promise<SkinportItem[]> {
        try {
            const { data } = await this.client.get<SkinportItem[]>('/items', { params: { tradable: tradable ? 1 : 0 } });

            return data.filter((item) => !!item.market_hash_name);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(error.toJSON());
            } else {
                console.error(error)
            }

            throw new SkinportClientException(SkinportClientExceptionCode.DATA_WAS_NOT_LOADED)
        }
    }
}
