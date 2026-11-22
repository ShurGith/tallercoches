require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET;

app.post('/register', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
        return res.status(400).json({ error: 'Introduce un email válido y una contraseña de al menos 8 caracteres.' });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashed]);
        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'No se pudo crear el usuario.' });
    }
});

app.post('/login', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) {
        return res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
    }

    try {
        const result = await pool.query('SELECT id, email, password FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'No se pudo iniciar sesión.' });
    }
});

// Middleware para validar token
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Se requiere un token Bearer.' });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) return res.status(401).json({ error: 'Se requiere un token Bearer.' });
    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch {
        res.status(401).json({ error: 'Token no válido o caducado.' });
    }
}

function validateCliente(body) {
    const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const telefono = typeof body?.telefono === 'string' ? body.telefono.trim() : '';
    const notas = typeof body?.notas === 'string' ? body.notas.trim() : '';

    if (!nombre) return { error: 'El nombre del cliente es obligatorio.' };
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: 'Introduce un email válido.' };
    }

    return {
        values: [nombre, email || null, telefono || null, notas || null],
    };
}

function parseClienteId(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function parseOptionalInt(value) {
    if (value === '' || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : NaN;
}

function validateVehiculo(body) {
    const matricula = typeof body?.matricula === 'string'
        ? body.matricula.toUpperCase().replace(/[\s-]/g, '')
        : '';
    const marca = typeof body?.marca === 'string' ? body.marca.trim() : '';
    const modelo = typeof body?.modelo === 'string' ? body.modelo.trim() : '';
    const anio = parseOptionalInt(body?.anio);
    const km = parseOptionalInt(body?.km);

    if (!matricula) return { error: 'La matrícula es obligatoria.' };
    if (!/^[A-Z0-9]{4,10}$/.test(matricula)) return { error: 'Introduce una matrícula válida.' };
    if (!marca) return { error: 'La marca del vehículo es obligatoria.' };
    if (Number.isNaN(anio) || Number.isNaN(km)) {
        return { error: 'El año y los kilómetros deben ser números enteros.' };
    }

    return { values: [matricula, marca, modelo || null, anio, km] };
}

const VEHICULO_COLUMNS = 'id, cliente_id, matricula, marca, modelo, anio, km, created_at, updated_at';

app.get('/clientes', authMiddleware, async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    try {
        const result = await pool.query(
            `SELECT id, nombre, email, telefono, notas, created_at, updated_at
             FROM clientes
             WHERE archivado_en IS NULL
               AND ($1 = '' OR nombre ILIKE $2 OR COALESCE(email, '') ILIKE $2 OR COALESCE(telefono, '') ILIKE $2)
             ORDER BY nombre ASC, id ASC`,
            [q, `%${q}%`],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al listar clientes:', error);
        res.status(500).json({ error: 'No se pudieron cargar los clientes.' });
    }
});

app.post('/clientes', authMiddleware, async (req, res) => {
    const validation = validateCliente(req.body);
    if (validation.error) return res.status(400).json({ error: validation.error });

    try {
        const result = await pool.query(
            `INSERT INTO clientes (nombre, email, telefono, notas)
             VALUES ($1, $2, $3, $4)
             RETURNING id, nombre, email, telefono, notas, created_at, updated_at`,
            validation.values,
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'No se pudo crear el cliente.' });
    }
});

app.get('/clientes/:id', authMiddleware, async (req, res) => {
    const id = parseClienteId(req.params.id);
    if (!id) return res.status(400).json({ error: 'El identificador del cliente no es válido.' });

    try {
        const result = await pool.query(
            `SELECT id, nombre, email, telefono, notas, created_at, updated_at
             FROM clientes
             WHERE id = $1 AND archivado_en IS NULL`,
            [id],
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al consultar cliente:', error);
        res.status(500).json({ error: 'No se pudo cargar el cliente.' });
    }
});

app.put('/clientes/:id', authMiddleware, async (req, res) => {
    const id = parseClienteId(req.params.id);
    if (!id) return res.status(400).json({ error: 'El identificador del cliente no es válido.' });
    const validation = validateCliente(req.body);
    if (validation.error) return res.status(400).json({ error: validation.error });

    try {
        const result = await pool.query(
            `UPDATE clientes
             SET nombre = $1, email = $2, telefono = $3, notas = $4, updated_at = NOW()
             WHERE id = $5 AND archivado_en IS NULL
             RETURNING id, nombre, email, telefono, notas, created_at, updated_at`,
            [...validation.values, id],
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ error: 'No se pudo actualizar el cliente.' });
    }
});

app.delete('/clientes/:id', authMiddleware, async (req, res) => {
    const id = parseClienteId(req.params.id);
    if (!id) return res.status(400).json({ error: 'El identificador del cliente no es válido.' });

    try {
        const result = await pool.query(
            `UPDATE clientes
             SET archivado_en = NOW(), updated_at = NOW()
             WHERE id = $1 AND archivado_en IS NULL
             RETURNING id`,
            [id],
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
        res.status(204).end();
    } catch (error) {
        console.error('Error al archivar cliente:', error);
        res.status(500).json({ error: 'No se pudo archivar el cliente.' });
    }
});

app.get('/clientes/:id/vehiculos', authMiddleware, async (req, res) => {
    const id = parseClienteId(req.params.id);
    if (!id) return res.status(400).json({ error: 'El identificador del cliente no es válido.' });

    try {
        const result = await pool.query(
            `SELECT ${VEHICULO_COLUMNS} FROM vehiculos
             WHERE cliente_id = $1 AND archivado_en IS NULL
             ORDER BY marca ASC, matricula ASC`,
            [id],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al listar vehículos:', error);
        res.status(500).json({ error: 'No se pudieron cargar los vehículos.' });
    }
});

app.post('/clientes/:id/vehiculos', authMiddleware, async (req, res) => {
    const id = parseClienteId(req.params.id);
    if (!id) return res.status(400).json({ error: 'El identificador del cliente no es válido.' });
    const validation = validateVehiculo(req.body);
    if (validation.error) return res.status(400).json({ error: validation.error });

    try {
        const result = await pool.query(
            `INSERT INTO vehiculos (cliente_id, matricula, marca, modelo, anio, km)
             SELECT id, $2::text, $3::text, $4::text, $5::int, $6::int
             FROM clientes
             WHERE id = $1 AND archivado_en IS NULL
             RETURNING ${VEHICULO_COLUMNS}`,
            [id, ...validation.values],
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un vehículo activo con esa matrícula.' });
        }
        console.error('Error al crear vehículo:', error);
        res.status(500).json({ error: 'No se pudo crear el vehículo.' });
    }
});

app.put('/vehiculos/:id', authMiddleware, async (req, res) => {
    const id = parseClienteId(req.params.id);
    if (!id) return res.status(400).json({ error: 'El identificador del vehículo no es válido.' });
    const validation = validateVehiculo(req.body);
    if (validation.error) return res.status(400).json({ error: validation.error });

    try {
        const result = await pool.query(
            `UPDATE vehiculos
             SET matricula = $1, marca = $2, modelo = $3, anio = $4, km = $5, updated_at = NOW()
             WHERE id = $6 AND archivado_en IS NULL
             RETURNING ${VEHICULO_COLUMNS}`,
            [...validation.values, id],
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Vehículo no encontrado.' });
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un vehículo activo con esa matrícula.' });
        }
        console.error('Error al actualizar vehículo:', error);
        res.status(500).json({ error: 'No se pudo actualizar el vehículo.' });
    }
});

app.delete('/vehiculos/:id', authMiddleware, async (req, res) => {
    const id = parseClienteId(req.params.id);
    if (!id) return res.status(400).json({ error: 'El identificador del vehículo no es válido.' });

    try {
        const result = await pool.query(
            `UPDATE vehiculos
             SET archivado_en = NOW(), updated_at = NOW()
             WHERE id = $1 AND archivado_en IS NULL
             RETURNING id`,
            [id],
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Vehículo no encontrado.' });
        res.status(204).end();
    } catch (error) {
        console.error('Error al archivar vehículo:', error);
        res.status(500).json({ error: 'No se pudo archivar el vehículo.' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
