import { UserModel } from '../models/user.model';
import { ApplicationService } from '../service-register';

const sessions = new Map<string, UserModel>;

export class SessionStorage implements ApplicationService {
    async init (): Promise<void> {};
    async saveSession (sessionId: string, user: UserModel) {
        sessions.set(sessionId, user);
    }
    async getUserBySessionId(id: string) {
        return sessions.get(id);
    }
}

