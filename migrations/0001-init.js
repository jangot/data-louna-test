module.exports = class InitMigration {
    async up(db) {
        console.log('GO')
        await db.client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
    down(db) {}
}

