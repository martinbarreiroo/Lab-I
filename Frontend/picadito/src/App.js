import React, { useEffect, useState } from 'react';

const MiComponente = () => {
    const [torneos, setTorneos] = useState([]);
    const [nuevoTorneo, setNuevoTorneo] = useState({ nombre: '', descripcion: '', participantes: [] });

    useEffect(() => {
        obtenerTorneos();
    }, []);

    const obtenerTorneos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/torneos');
            const data = await response.json();
            setTorneos(data);
        } catch (error) {
            console.error('Error al obtener los torneos:', error);
        }
    };

    const crearTorneo = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/torneos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoTorneo)
            });
            const data = await response.json();
            console.log('Torneo creado:', data);
            obtenerTorneos();
        } catch (error) {
            console.error('Error al crear el torneo:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        crearTorneo();
    };

    return (
        <div>
            {/* Aquí puedes mostrar los torneos y el formulario para crear un nuevo torneo */}
            <h2>Torneos</h2>
            <ul>
                {torneos.map((torneo, index) => (
                    <li key={index}>{torneo.nombre}</li>
                ))}
            </ul>
            <h2>Crear Nuevo Torneo</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nuevoTorneo.nombre}
                        onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })}
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        value={nuevoTorneo.descripcion}
                        onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, descripcion: e.target.value })}
                    />
                </div>
                <button type="submit">Crear Torneo</button>
            </form>
        </div>
    );
};

export default MiComponente;
