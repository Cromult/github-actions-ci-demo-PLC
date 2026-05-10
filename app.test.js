const request = require('supertest');
const app = require('./app'); // Importamos tu app
const { pool} = require('./app');

let testServer;

describe('Pruebas CRUD - Entidad Categories', () => {
    beforeAll((done) => {
        // Crear un servidor de prueba si no existe
        testServer = app.listen(0, done);
    });
    let createdCategoryId;

    // Test: Crear una categoría
    test('POST /categories - Debería crear una nueva categoría', async () => {
        const response = await request(app)
            .post('/categories')
            .send({ name: 'Electrónica' });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Electrónica');
        
        createdCategoryId = response.body.id; // Guardamos el ID para las siguientes pruebas
    });

    // Test: Error al crear sin nombre
    test('POST /categories - Debería fallar si no se envía el nombre', async () => {
        const response = await request(app)
            .post('/categories')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('El campo "name" es requerido');
    });

    // Test: Obtener todas las categorías
    test('GET /categories - Debería retornar una lista', async () => {
        const response = await request(app).get('/categories');
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test: Actualizar la categoría creada
    test('PUT /categories/:id - Debería actualizar el nombre', async () => {
        const response = await request(app)
            .put(`/categories/${createdCategoryId}`)
            .send({ name: 'Tecnología' });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Tecnología');
    });

    // Test: Borrar la categoría
    test('DELETE /categories/:id - Debería eliminar la categoría', async () => {
        const response = await request(app).delete(`/categories/${createdCategoryId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('eliminada exitosamente');
    });

    // Test: Error 404 al borrar algo que no existe
    test('DELETE /categories/:id - Debería dar 404 si el ID no existe', async () => {
        const response = await request(app).delete('/categories/9999');
        expect(response.statusCode).toBe(404);
    });

    // Cerrar la conexión después de todas las pruebas
    afterAll(async () => {
        if (testServer) {
            testServer.close();
        }
        await pool.end();
    });
});