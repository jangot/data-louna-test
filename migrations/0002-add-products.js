module.exports = class AddProduct {
    async up(db) {
        await db.client.query(`
            INSERT INTO products (name, price, stock) VALUES
                ('Книга правил D&D 5e', 49.99, 10),
                ('Экран мастера подземелий', 25.00, 5),
                ('Набор игровых костей (d20, d12, d10, d8, d6, d4)', 15.99, 20),
                ('Игровой коврик с разметкой', 30.50, 8),
                ('Миниатюры персонажей (набор 10 шт.)', 40.00, 6),
                ('Фигурки монстров (набор 5 шт.)', 35.75, 7),
                ('Набор маркеров и стираемых фишек', 12.50, 15),
                ('Карта мира для кампании', 20.99, 4),
                ('Органайзер для фишек и костей', 18.00, 12),
                ('Светящиеся кубики для игры в темноте', 22.99, 10);
        `);
    }
    down(db) {}
}

