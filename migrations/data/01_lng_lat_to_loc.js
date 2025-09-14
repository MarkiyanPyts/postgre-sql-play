
const pg = require('pg')
require('dotenv').config()

const pool = new pg.Pool({
    port: 5432,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

pool.query(`
    UPDATE posts
    SET loc = POINT(lng, lat)
    WHERE loc IS NULL
`).then(() => {
    console.log('Location data migrated successfully')
}).catch(err => {
    console.error('Error migrating location data:', err)
}).finally(() => {
    pool.end()
})
