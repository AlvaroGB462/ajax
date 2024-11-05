const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Asumiendo que tu HTML y JS están en 'public'

// Ruta al archivo JSON
const filePath = path.join(__dirname, 'clubs.json');

// Endpoint para registrar un nuevo club
app.post('/register', (req, res) => {
    const newClub = req.body;

    // Leer el contenido actual del archivo
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        const clubs = JSON.parse(data || '{"clubes": []}'); // Asegúrate de que sea un objeto con "clubes"
        clubs.clubes.push(newClub); // Agregar el nuevo club

        // Escribir de nuevo en el archivo
        fs.writeFile(filePath, JSON.stringify(clubs, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir en el archivo' });
            }
            res.status(201).json(newClub); // Devolver el club registrado
        });
    });
});

// Endpoint para obtener todos los clubes
app.get('/clubes', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }
        const clubs = JSON.parse(data || '{"clubes": []}'); // Asegúrate de que sea un objeto
        res.json(clubs); // Enviar la lista de clubes como respuesta
    });
});

app.delete('/clubes/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Solicitando eliminar el club con ID: ${id}`); // Para depuración

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        const clubs = JSON.parse(data || '{"clubes": []}');
        
        // Filtrar el club por ID
        const newClubs = clubs.clubes.filter(club => club.id !== id);

        // Si la longitud de los clubes es la misma, significa que no se encontró el ID
        if (newClubs.length === clubs.clubes.length) {
            return res.status(404).json({ error: 'ID no válido' });
        }

        // Escribir los cambios en el archivo
        fs.writeFile(filePath, JSON.stringify({ clubes: newClubs }, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir en el archivo' });
            }
            console.log(`Club eliminado con ID: ${id}`); // Para depuración
            res.status(200).send('Club eliminado');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
