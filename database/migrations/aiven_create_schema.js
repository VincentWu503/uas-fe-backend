const pool = require('../../src/config/db.js');

const createEnums = `
    CREATE TYPE user_role AS ENUM ('admin', 'user');
    CREATE TYPE food_category AS ENUM ('main-dish', 'beverages', 'vegetables', 'add-on');
    CREATE TYPE review_overviews AS ENUM ('rasa-enak', 'porsi-pas', 'bersih', 'lainnya');
`

const createUsersTable = `
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(32) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        created_at timestamp NOT NULL DEFAULT current_timestamp,
        updated_at timestamp NOT NULL DEFAULT current_timestamp
    );
`

const createAddressTable = `
    CREATE TABLE address (
        id SERIAL PRIMARY KEY,
        alamat_lengkap VARCHAR(255) NOT NULL,
        kelurahan VARCHAR(64) NOT NULL,
        kabupaten_kota VARCHAR(64) NOT NULL,
        provinsi VARCHAR(64) NOT NULL
    );
`

const createJwtBlacklistTable = `
    CREATE TABLE jwt_blacklist (
        id SERIAL PRIMARY KEY,
        token VARCHAR(512) NOT NULL,
        blacklisted_at timestamp NOT NULL DEFAULT current_timestamp
    );
`

const createFoodsTable = `
    CREATE TABLE foods (
        item_id SERIAL PRIMARY KEY,
        item_name VARCHAR(64) NOT NULL,
        category food_category NOT NULL DEFAULT 'main-dish',
        dine_in_price DECIMAL(8, 2) NOT NULL,
        online_price DECIMAL(8, 2) NOT NULL,
        description VARCHAR(1024) NOT NULL DEFAULT '',
        image_format VARCHAR(16) NOT NULL,
        image_bytes BYTEA NOT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp,
        updated_at timestamp NOT NULL DEFAULT current_timestamp
    );
`

const createRestaurantReviewsTable = `
    CREATE TABLE restaurant_reviews (
        comment_id SERIAL PRIMARY KEY,
        stars SMALLINT NOT NULL CHECK (stars > 0 AND stars <= 5),
        comment VARCHAR(512) NOT NULL,
        overviews review_overviews[] NOT NULL DEFAULT '{"lainnya"}',
        created_at timestamp NOT NULL DEFAULT current_timestamp,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
`

const createFoodReviewsTable = `
    CREATE TABLE food_reviews (
        comment_id SERIAL PRIMARY KEY,
        stars SMALLINT NOT NULL CHECK (stars > 0 AND stars <= 5),
        comment VARCHAR(512) NOT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp,
        food_id INTEGER NOT NULL REFERENCES foods(item_id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
`

async function createDatabaseSchema() {
    try {
        await pool.query(createEnums);
        await pool.query(createUsersTable);
        await pool.query(createAddressTable);
        await pool.query(createFoodsTable)
        await pool.query(createFoodReviewsTable);
        await pool.query(createJwtBlacklistTable);
        await pool.query(createRestaurantReviewsTable);
        console.log('Schema created successfully for aiven database.');
    } catch (err) {
        console.error(err);
        process.exit(1); 
    }
}

createDatabaseSchema();