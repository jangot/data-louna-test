const dotenv = require('dotenv');

dotenv.config();

const { DatabaseService } = require('../dist/services/database.service');

const InitMigration = require('../migrations/0001-init');
const AddProductsMigration = require('../migrations/0002-add-products');

const allMigrations = [
    new InitMigration(),
    new AddProductsMigration(),
];

(async () => {
    const db = new DatabaseService();
    await db.init();

    for (let i = 0; i < allMigrations.length; i++) {
        try {
            console.log('will try', allMigrations[i].constructor.name);

            await db.client.query('BEGIN')
            await allMigrations[i].up(db);
            await db.client.query('COMMIT')

            console.log('success')
        } catch (error) {
            await db.client.query('ROLLBACK')
            return;
        }
    }

    await db.destroy();
})();
