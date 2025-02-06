import { serviceRegister } from '../service-register';
import { AbstractService } from './abstract-service';

export class ProductsService extends AbstractService {
    async getList() {
        const result = await serviceRegister.db
            .getClient()
            .query(`SELECT * from products ORDER BY id`);

        return result.rows;
    }

    async getCount(productId: number): Promise<number> {
        const result = await serviceRegister.db
            .getClient()
            .query(`SELECT stock FROM products WHERE id = $1;`, [productId]);

        return result.rows[0].stock;
    }

    async makePurchase(userId: number, productId: number) {
        const result = await serviceRegister.db
            .getClient()
            .query(
                `
                    WITH product_price AS (
                        SELECT id, price, stock FROM products WHERE id = $2 FOR UPDATE
                    ),
                    user_balance AS (
                        SELECT SUM(amount) AS balance FROM account_activity WHERE user_id = $1
                    ),
                    transaction_insert AS (
                        INSERT INTO account_activity (user_id, amount, transaction_type, description)
                        SELECT $1, -p.price, 'withdrawal', 'by product ID ' || $2
                        FROM product_price p, user_balance u
                        WHERE u.balance >= p.price AND p.stock > 0
                        RETURNING user_id
                    )
                    UPDATE products
                    SET stock = stock - 1
                    WHERE id = $2 AND stock > 0
                    AND EXISTS (SELECT 1 FROM transaction_insert);
                `,
                [userId, productId]
            );

        return result.rows;
    }
}
