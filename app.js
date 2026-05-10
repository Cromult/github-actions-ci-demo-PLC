require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuración de conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Inicializar la tabla automáticamente (útil para esta práctica)
pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
`).then(() => console.log("✅ Tabla 'categories' lista en la base de datos"))
  .catch(err => console.error("❌ Error creando la tabla:", err));

// 1. GET /categories: Listar todas
app.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST /categories: Crear
app.post('/categories', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'El campo "name" es requerido' });
    
    try {
        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *', 
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. PUT /categories/:id: Actualizar
app.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'El campo "name" es requerido' });

    try {
        const result = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', 
            [name, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE /categories/:id: Borrar
app.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *', 
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.status(200).json({ message: `Categoría con id ${id} eliminada exitosamente` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



let server;
if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(`🚀 APi funcional${PORT}`);
    });
}

module.exports = app;
module.exports.pool = pool;
module.exports.server = server;