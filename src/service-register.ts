import { SessionStorage } from './services/session-storage.service';
import { UsersService } from './services/users.service';
import { DatabaseService } from './services/database.service';
import { RedisService } from './services/redis.service';

export interface ApplicationService {
    init: () => Promise<void>,
    destroy: () => Promise<void>,
}

export const serviceRegister = {
    sessionStorage: new SessionStorage(),
    usersService: new UsersService(),
    db: new DatabaseService(),
    redis: new RedisService(),
}
