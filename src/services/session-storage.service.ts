import { UserModel } from '../models/user.model';
import { AbstractService } from './abstract-service';

const sessions = new Map<string, UserModel>;

export class SessionStorage extends AbstractService {
    async saveSession (sessionId: string, user: UserModel, time: number): Promise<void> {
        sessions.set(sessionId, user);
        setTimeout(() => {
            sessions.delete(sessionId);
        }, time);
    }

    async clearSession(sessionId: string) {
        sessions.delete(sessionId);
    }

    async getUserBySessionId(id: string): Promise<UserModel | undefined> {
        return sessions.get(id);
    }
}

