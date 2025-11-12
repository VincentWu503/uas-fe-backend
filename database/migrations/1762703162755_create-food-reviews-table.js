/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('food_reviews', {
        comment_id: {
            type: 'SERIAL',
            primaryKey: true
        },
        stars: {
            type: 'SMALLINT',
            notNull: true,
            check: 'stars > 0 AND stars <= 5'
        },
        comment: {
            type: 'VARCHAR(512)',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        food_id: {
            type: 'INTEGER',
            references: 'foods(item_id)',
            onDelete: 'CASCADE',
            notNull: true
        },
        user_id: {
            type: 'INTEGER',
            references: 'users(id)',
            onDelete: 'CASCADE'
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('food_reviews', {ifExists: true})
};
