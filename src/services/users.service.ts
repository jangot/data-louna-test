import { createHash } from 'crypto';
import { UserModel } from '../models/user.model';
import { ApplicationService } from '../service-register';

const list: UserModel[] = [];

function hashPassword(password: string): string {
    return createHash('md5').update(password).digest('hex');
}

export class UsersService implements ApplicationService {
    async init (): Promise<void> {};
    async isUserNameExists(username: string): Promise<boolean> {
        const user = list.find((user) => user.username === username);

        return !!user;
    }
    async getUserByLoginAndPassword(username: string, rowPassword: string): Promise<UserModel | undefined> {
        const password = hashPassword(rowPassword);

        return list.find((it) => it.username === username && it.password === password);
    }
    async addUser(user: Omit<UserModel, 'id'>): Promise<UserModel> {
        const item = {
            ...user,
            id: new Date().getTime().toString(),
            password: hashPassword(user.password)
        }

        list.push(item);

        return item;
    }

    async setNewPassword(id: string, password: string) {
        const user = list.find((user) => user.id === id);
        if (!user) {
            // TODO create correct exception
            throw new Error(`User ${id} not found`);
        }
        user.password = hashPassword(password);
    }
}

