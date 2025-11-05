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
    pgm.createType('user_role', ['admin', 'user'])
    pgm.createTable('users', {
        id: {
            type: 'SERIAL',
            primaryKey: true,
        },
        username: { 
            type: 'VARCHAR(32)',
            notNull: true, 
            unique: false,
        },
        email: {
            type: 'VARCHAR(255)',
            notNull: true,
            unique: true,
        },
        password: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        role: {
            type: 'user_role',
            default: 'user',
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
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('users', {ifExists: true, cascade: true})
    pgm.dropType('user_role')
};
