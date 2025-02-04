import { UserModel } from '../models/user.model';
import { ApplicationService } from '../service-register';

const sessions = new Map<string, UserModel>;

export class SessionStorage implements ApplicationService {
    async init (): Promise<void> {};
    async saveSession (sessionId: string, user: UserModel, time: number): Promise<void> {
        sessions.set(sessionId, user);
        setTimeout(() => {
            sessions.delete(sessionId);
        }, time);
    }
    async getUserBySessionId(id: string): Promise<UserModel | undefined> {
        return sessions.get(id);
    }
}

