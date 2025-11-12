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
    pgm.createTable('address', {
        id: {
            type: 'SERIAL',
            notNull: true,
            primaryKey: true,
        },
        alamat_lengkap: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        kelurahan: {
            type: 'VARCHAR(64)',
            notNull: true,
        },
        kabupaten_kota: {
            type: 'VARCHAR(64)',
            notNull: true,
        },
        provinsi: {
            type: 'VARCHAR(64)',
            notNull: true,
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('address', {ifExists: true})
};
