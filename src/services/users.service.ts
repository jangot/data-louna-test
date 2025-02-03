import { createHash } from 'crypto';

interface User {
    id: string;
    username: string;
    password: string;
}

const list: User[] = [];

function hashPassword(password: string): string {
    return createHash('md5').update(password).digest('hex');
}


export const usersService = {
    isUserNameExists: async (username: string): Promise<boolean> => {
        const user = list.find((user) => user.username === username);

        return !!user;
    },
    addUser: async (user: Omit<User, 'id'>): Promise<User> => {
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
