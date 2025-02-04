import { createHash } from 'crypto';
import { UserModel } from '../models/user.model';
import { AbstractService } from './abstract-service';
import { serviceRegister } from '../service-register';

const list: UserModel[] = [];

function hashPassword(password: string): string {
    return createHash('md5').update(password).digest('hex');
}

export class UsersService extends AbstractService {
    async isUserNameExists(username: string): Promise<boolean> {
        const result = await serviceRegister.db.getClient().query(
            'SELECT username FROM users WHERE username = $1',
            [username]
        );

        return result.rows.length > 0;
    }
    async getUserByLoginAndPassword(username: string, rawPassword: string): Promise<UserModel | undefined> {
        const password = hashPassword(rawPassword);

        const result = await serviceRegister.db.getClient().query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        return result.rows[0];
    }
    async addUser(user: Omit<UserModel, 'id'>): Promise<UserModel> {
        const result = await serviceRegister.db.getClient().query(
            'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *',
            [user.username, hashPassword(user.password)]
        )

        return result.rows[0];
    }

    async setNewPassword(id: string, rawPassword: string) {
        const password = hashPassword(rawPassword);

        await serviceRegister.db.getClient().query(
            'UPDATE users SET password = $1 WHERE id = $2;',
            [password, id]
        )
    }
}
