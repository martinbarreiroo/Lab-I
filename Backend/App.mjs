import express from 'express';
import {promises as fs} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Directorio donde se almacenarán los datos de los torneos
const dataDir = path.join(__dirname, 'data');

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Ruta para obtener todos los torneos
app.get('/api/torneos', async (req, res) => {
    try {
        const torneos = await obtenerTorneos();
        res.json(torneos);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los torneos' });
    }
});

// Ruta para crear un nuevo torneo
app.post('/api/torneos', async (req, res) => {
    const { nombre, descripcion, participantes } = req.body;
    if (!nombre || !descripcion || !participantes) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const torneos = await obtenerTorneos();
        const nuevoTorneo = { id: Date.now(), nombre, descripcion, participantes };
        torneos.push(nuevoTorneo);
        await guardarTorneos(torneos);
        res.status(201).json(nuevoTorneo);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el torneo' });
    }
});

// Función para obtener los torneos desde el archivo JSON
async function obtenerTorneos() {
    const data = await fs.readFile(path.join(dataDir, 'torneos.json'), 'utf8');
    return JSON.parse(data);
}

// Función para guardar los torneos en el archivo JSON
async function guardarTorneos(torneos) {
    await fs.writeFile(path.join(dataDir, 'torneos.json'), JSON.stringify(torneos, null, 2));
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});