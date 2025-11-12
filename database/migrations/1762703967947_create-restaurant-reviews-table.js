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
    pgm.createType('review_overviews', ['rasa-enak', 'porsi-pas', 'bersih', 'lainnya'])
    pgm.createTable('restaurant_reviews', {
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
        overview: {
            type: 'review_overviews',
            default: 'lainnya',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
    pgm.dropTable('restaurant_reviews', {ifExists: true})
    pgm.dropType('review_overviews')
};
