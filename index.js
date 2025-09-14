const express = require('express')
const pg = require('pg')
require('dotenv').config()

const pool = new pg.Pool({
    port: 5432,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/posts', async (req, res) => {
    const result = await pool.query('SELECT * FROM posts')
    console.log(result?.rows)
    res.send(`
        <ul>
            ${result?.rows?.map(row => `<li>${row.id}, ${row.url}, ${row.loc.x}, ${row.loc.y}</li>`).join('')}
        </ul>
        <form action="/posts" method="POST">
            <input type="text" name="url" placeholder="URL" required>
            <input type="text" name="lng" placeholder="Longitude" required>
            <input type="text" name="lat" placeholder="Latitude" required>
            <button type="submit">Add Post</button>
        </form>
    `)
})

app.post('/posts', async (req, res) => {
    const { url, lng, lat } = req.body
    await pool.query(`
        INSERT INTO posts (url, loc) VALUES ($1, $2)`, 
        [url, `(${lat},${lng})`]
    )
    res.redirect('/posts')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})