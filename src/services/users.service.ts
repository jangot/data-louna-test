import { createHash } from 'crypto';
import { UserModel } from '../models/user.model';

const list: UserModel[] = [];

function hashPassword(password: string): string {
    return createHash('md5').update(password).digest('hex');
}


export const usersService = {
    isUserNameExists: async (username: string): Promise<boolean> => {
        const user = list.find((user) => user.username === username);

        return !!user;
    },
    getUserByLoginAndPassword: async (username: string, rowPassword: string): Promise<UserModel | undefined> => {
        const password = hashPassword(rowPassword);

        return list.find((it) => it.username === username && it.password === password);
    },
    addUser: async (user: Omit<UserModel, 'id'>): Promise<UserModel> => {
        const item = {
            ...user,
            id: new Date().getTime().toString(),
            password: hashPassword(user.password)
        }

        list.push(item);

        return item;
    },
    find: async (user: string) => {

    }
}
