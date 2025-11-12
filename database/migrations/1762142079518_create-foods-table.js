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
    pgm.createType('food_category', ['main-dish', 'beverages', 'vegetables', 'add-on'])
    pgm.createTable('foods', {
        item_id: {
            type: 'SERIAL',
            primaryKey: true
        },
        item_name: {
            type: 'VARCHAR(64)',
            notNull: true
        },
        category: {
            type: 'food_category',
            default: 'main-dish',
            notNull: true
        },
        dine_in_price: {
            type: 'DECIMAL(8, 2)',
            notNull : true
        },
        online_price: {
            type: 'DECIMAL(8, 2)',
            notNull: true,
        },
        description: {
            type: 'VARCHAR(1024)',
            notNull: true,
            default: ''
        },
        image_format: {
            type: 'VARCHAR(16)',
            notNull: true,
        },
        image_bytes: {
            type: 'BYTEA',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('foods', {ifExists: true, cascade: true})
    pgm.dropType('food_category')
};
