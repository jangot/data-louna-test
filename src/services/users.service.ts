import { createHash } from 'crypto';
import { UserModel } from '../models/user.model';
import { AbstractService } from './abstract-service';
import { serviceRegister } from '../service-register';

function hashPassword(password: string): string {
    return createHash('md5').update(password).digest('hex');
}

export class UsersService extends AbstractService {
    async getBalance(userId: number) {
        const result = await serviceRegister.db.getClient().query(
            'SELECT SUM(amount) as balance FROM account_activity WHERE user_id = $1',
            [userId]
        );

        return result.rows[0].balance || 0;
    }

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
    async addUser(rowUserData: Omit<UserModel, 'id'>): Promise<UserModel> {
        const userResult = await serviceRegister.db.getClient().query(
            'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *',
            [rowUserData.username, hashPassword(rowUserData.password)]
        );
        const user = userResult.rows[0];
        if (!user) {
            throw new Error('User was not created');
        }

        await serviceRegister.db.getClient().query(
            `
                INSERT INTO account_activity (user_id, amount, transaction_type, description)
                VALUES ($1, 1000.00, 'deposit', 'started bonus');
            `,
            [user.id]
        )

        return userResult.rows[0];
    }

    async setNewPassword(id: number, rawPassword: string) {
        const password = hashPassword(rawPassword);

        await serviceRegister.db.getClient().query(
            'UPDATE users SET password = $1 WHERE id = $2;',
            [password, id]
        )
    }
}


