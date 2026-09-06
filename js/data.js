const juegos = [
    {id: "g1", nombre: "valorant", minIntegrantes: 5},
    {id: "g2", nombre: "League of Legends", minIntegrantes: 5},
    {id: "g3", nombre: "Rocket League", minIntegrantes: 3}
];

const jugadores = [
    { id: "j1", apodo: "shadow99", nombre: "Diego Rojas", email: "diego@mail.com",
        equipos: ["e1"], estadisticas: { victorias: 12, derrotas: 4 },
        sanciones: [{ motivo: "Insultos en chat", vigente: false }] },
    { id: "j2", apodo: "nova_x", nombre: "Camila Soto", email: "camila@mail.com",
        equipos: ["e1"], estadisticas: { victorias: 8, derrotas: 6 }, sanciones: [] },
    { id: "j3", apodo: "kriz", nombre: "Bastián Muñoz", email: "bastian@mail.com",
        equipos: [], estadisticas: { victorias: 3, derrotas: 9 },
        sanciones: [{ motivo: "Abandono reiterado", vigente: true }] }
];

const equipos = [
    { id: "e1", nombre: "Los Halcones", juegoId: "g1", capitanId: "j1", activo: true,
        integrantes: [
            { jugadorId: "j1", rol: "Capitán" },
            { jugadorId: "j2", rol: "Duelista" }
        ] },
    { id: "e2", nombre: "Team Fenix", juegoId: "g3", capitanId: "j3", activo: false,
        integrantes: [{ jugadorId: "j3", rol: "Capitán" }] }
];

const torneos = [
    {
        id: "t1", nombre: "Copa Apertura Valorant", juegoId: "g1", estado: "abierto",
        modalidad: "Equipos", cupoOcupado: 6, cupoMax: 16,
        fechaCierreInscripcion: "2026-09-20", fechaInicio: "2026-09-25",
        participantes: ["e1"],
        partidas: [
            { id: "p1", ronda: 1, equipos: ["e1", "e2"], fecha: "2026-09-25 18:00", estado: "programada", resultado: null }
        ],
        posiciones: [{ participanteId: "e1", puntos: 3, pos: 1 }],
        premios: [{ posicion: 1, premio: "$200.000 + trofeo" }, { posicion: 2, premio: "$80.000" }]
    },
    {
        id: "t2", nombre: "Liga LoL Otoño", juegoId: "g2", estado: "en_curso",
        modalidad: "Equipos", cupoOcupado: 10, cupoMax: 10,
        fechaCierreInscripcion: "2026-08-15", fechaInicio: "2026-08-20",
        participantes: [], partidas: [], posiciones: [],
        premios: [{ posicion: 1, premio: "Beca gaming" }]
    },
    {
        id: "t3", nombre: "1v1 Rocket League", juegoId: "g3", estado: "finalizado",
        modalidad: "Individual", cupoOcupado: 32, cupoMax: 32,
        fechaCierreInscripcion: "2026-07-01", fechaInicio: "2026-07-05",
        participantes: [], partidas: [], posiciones: [],
        premios: [{ posicion: 1, premio: "Mouse gamer" }]
    }
];

function nombreJuego(id) {
    const j = juegos.find(x => x.id === id);
    return j ? j.nombre : "—";
}

function nombreParticipante(id) {
    const eq = equipos.find(e => e.id === id);
    if (eq) return eq.nombre;
    const jg = jugadores.find(j => j.id === id);
    return jg ? jg.apodo : id;
}