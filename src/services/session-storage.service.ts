import { UserModel } from '../models/user.model';
import { AbstractService } from './abstract-service';
import { serviceRegister } from '../service-register';

export class SessionStorage extends AbstractService {
    async saveSession (sessionId: string, user: UserModel, time: number): Promise<void> {
        await serviceRegister.redis.getClient().set(sessionId, JSON.stringify(user), { EX: time });
    }

    async clearSession(sessionId: string) {
        await serviceRegister.redis.getClient().del(sessionId);
    }

    async getUserBySessionId(sessionId: string): Promise<UserModel | undefined> {
        const data = await serviceRegister.redis.getClient().get(sessionId);
        if (!data) {
            return undefined;
        }
        return JSON.parse(data);
    }
}

