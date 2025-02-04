const dotenv = require('dotenv');

dotenv.config();

const { DatabaseService } = require('../dist/services/database.service');

const InitMigration = require('../migrations/0001-init');

(async () => {
    const db = new DatabaseService();
    await db.init();

    try {
        await db.client.query('BEGIN')
        const init = new InitMigration();
        await init.up(db);
        await db.client.query('COMMIT')
        console.log('success')
    } catch (error) {
        await db.client.query('ROLLBACK')
    }

    await db.destroy();
})();
