import { SessionStorage } from './services/session-storage.service';
import { UsersService } from './services/users.service';
import { DatabaseService } from './services/database.service';
import { RedisService } from './services/redis.service';
import { SkinportClient } from './services/skinport-client';
import { SkinportService } from './services/skinport.service';
import { ProductsService } from './services/products-service';

export interface ApplicationService {
    init: () => Promise<void>,
    destroy: () => Promise<void>,
}

export const serviceRegister = {
    sessionStorage: new SessionStorage(),
    usersService: new UsersService(),
    db: new DatabaseService(),
    redis: new RedisService(),
    skinportClient: new SkinportClient(),
    skinportService: new SkinportService(),
    productsService: new ProductsService(),
}
