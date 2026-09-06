document.addEventListener("DOMContentLoaded", () => {
    renderInicio();
    renderListadoTorneos();
    renderDetalleTorneo();
    initInscripcion();
    initEquipo();
    initPerfil();
});

    // Inicio

    function renderInicio() {
        const cont = document.getElementById("torneos-destacados");
        if (!cont) return;
        const destacados = torneos.filter(t => t.estado === "abierto" || t.estado === "en_curso");
        cont.innerHTML = "";
        destacados.forEach(t => cont.appendChild(crearTarjetaTorneo(t)));

        const cierres = document.getElementById("proximos-cierres");
        if (cierres) {
            cierres.innerHTML = "";
            torneos
                .filter(t => t.estado === "abierto")
                .sort((a, b) => new Date(a.fechaCierreInscripcion) - new Date(b.fechaCierreInscripcion))
                .forEach(t => {
                    const li = document.createElement("li");
                    li.textContent = `${t.nombre} - cierra el ${t.fechaCierreInscripcion}`;
                    cierres.appendChild(li);
                });
        }
    }

function crearTarjetaTorneo(t) {
    const art = document.createElement("article");
    art.className = "card";
    art.innerHTML = `
<span class="badge ${t.estado}">${t.estado.replace("_", " ")}</span>
<h3>${t.nombre}</h3>
<p>Juego: ${nombreJuego(t.juegoId)}</p>
<p>Modalidad: ${t.modalidad}</p>
<p>Cupos: ${t.cupoOcupado}/${t.cupoMax}</p>
<p>Cierre de inscripción: ${t.fechaCierreInscripcion}</p>
<a href="torneo-detalle.html?id=${t.id}">Ver detalle</a>
`;
    return art;
    }

// ---------- LISTADO DE TORNEOS ----------
function renderListadoTorneos() {
        const cont = document.getElementById("lista-torneos");
        if (!cont) return;

        const form = document.getElementById("form-filtros");
        const fInicio = document.getElementById("filtro-fecha-inicio");
        const fFin = document.getElementById("filtro-fecha-fin");
        const errFechas = document.getElementById("error-fechas");

        function aplicarFiltros() {
            const juego = document.getElementById("filtro-juego").value;
            const estado = document.getElementById("filtro-estado").value;
            const nombre = document.getElementById("filtro-nombre").value.trim().toLowerCase();
            const desde = fInicio.value;
            const hasta = fFin.value;

            if (desde && hasta && desde > hasta) {
                errFechas.textContent = "La fecha inicial no puede ser posterior a la final.";
                return;
            }
            errFechas.textContent = "";

            const filtrados = torneos.filter(t => {
                if (juego && t.juegoId !== juego) return false;
                if (estado && t.estado !==  estado) return false;
                if (nombre && !t.nombre.toLowerCase().includes(nombre)) return false;
                if (desde && t.fechaInicio < desde) return false;
                if (hasta && t.fechaInicio > hasta) return false;
                return true;
            });

            cont.innerHTML = "";
            if (filtrados.length === 0) {
                cont.innerHTML = `<p class="empty-state">No hay torneos que coincidan con los filtros seleccionados.</p>`;
                return;
            }
            filtrados.forEach(t => cont.appendChild(crearTarjetaTorneo(t)));
        }

        form.addEventListener("input", aplicarFiltros);
        form.addEventListener("submit", e => e.preventDefault());
        aplicarFiltros();
    }

    //Detalle de Torneo
function renderDetalleTorneo(){
        const cont = document.getElementById("detalle-torneo");
        if (!cont) return;

        const id = new URLSearchParams(window.location.search).get("id") || torneos[0].id;
        const t = torneos.find(x => x.id === id);
        if (!t) { cont.innerHTML = "<p class='empty-state'>Torneo no encontrado.</p>"; return; }

        document.getElementById("torneo-nombre").textContent = t.nombre;
        document.getElementById("torneo-info").innerHTML = `
        <p>Juego: ${nombreJuego(t.juegoId)} - Modalidad: ${t.modalidad}</p>
        <p>Cupos disponibles: ${t.cupoMax - t.cupoOcupado} de ${t.cupoMax}</p>
        <p>Estado: <span class="badge ${t.estado}">${t.estado}</span></p>`;

        const listaPart = document.getElementById("torneo-participantes");
        listaPart.innerHTML = t.participantes.length
            ? t.participantes.map(p => `<li>${nombreParticipante(p)}</li>`).join("")
            : "<li>Aún no hay participantes inscritos.</li>";

        const tablaPartidas = document.getElementById("torneo-partidas");
        tablaPartidas.innerHTML = t.partidas.length
            ? t.partidas.map(p => `
<tr>
<td>Ronda ${p.ronda}</td>
<td>${p.equipos.map(nombreParticipante).join(" vs ")}</td>
<td>${p.fecha}</td>
<td>${p.estado}</td>
</tr>`).join("") : `<tr><td colspan="4">Calendario aún no publicado.</td></tr>`;

        const tablaPos = document.getElementById("torneo-posiciones");
        tablaPos.innerHTML = t.posiciones.length ? t.posiciones.sort((a, b) => a.pos - b.pos).map(p => `
<tr><td>${p.pos}</td><td>${nombreParticipante(p.participanteId)}</td><td>${p.puntos}</td></tr>
`).join("") : `<tr><td colspan="3">Tabla de posiciones no disponible aún.</td></tr>`;

        const listaPremios = document.getElementById("torneo-premios");
        listaPremios.innerHTML = t.premios.map(p => `<li>Puesto ${p.posicion}: ${p.premio}</li>`).join("");
    }

// ---------- INSCRIPCIÓN A TORNEO ----------
function initInscripcion() {
        const form = document.getElementById("form-inscripcion");
        if (!form) return;

        const selectTorneo = document.getElementById("insc-torneo");
        const selectEquipo = document.getElementById("insc-equipo");
        const resumen = document.getElementById("insc-resumen");
        const confirmacion = document.getElementById("insc-confirmacion");

        torneos.forEach(t => selectTorneo.add(new Option(t.nombre, t.id)));
        equipos.forEach(e => selectEquipo.add(new Option(e.nombre, e.id)));

        function mostrarError(idCampo, mensaje) {
            document.getElementById(`error-${idCampo}`).textContent = mensaje;
        }

        function validar() {
            let ok = true;
            const torneoId = selectTorneo.value;
            const equipoId = selectEquipo.value;
            const t = torneos.find(x => x.id === torneoId);
            const eq = equipos.find(x => x.id === equipoId);

            ["torneo", "equipo"].forEach(c => mostrarError(c, ""));

            if (!t) { mostrarError("torneo", "Selecciona un torneo."); ok = false; }
            if (!eq) { mostrarError("equipo", "Selecciona un equipo."); ok = false; }
            if (!t || !eq) return ok;

            const hoy = new Date().toISOString().slice(0, 10);
            if (hoy > t.fechaCierreInscripcion) {
                mostrarError("torneo", "El plazo de inscripción para este torneo ya cerró.");
                ok = false;
            }
            if (t.cupoOcupado >= t.cupoMax) {
                mostrarError("torneo", "El torneo no tiene cupos disponibles.");
                ok = false;
            }
            if (t.participantes.includes(equipoId)) {
                mostrarError("equipo", "Este equipo ya está inscrito en el torneo.");
                ok = false;
            }
            const juego = juegos.find(j => j.id === t.juegoId);
            if (eq.integrantes.length < juego.minIntegrantes) {
                mostrarError("equipo", `El juego exige mínimo ${juego.minIntegrantes} integrantes.`);
                ok = false;
            }
            if (!eq.activo) {
                mostrarError("equipo", "El equipo está inactivo y no puede inscribirse.");
                ok = false;
            }
            const capitan = jugadores.find(j => j.id === eq.capitanId);
            const sancionVigente = capitan?.sanciones.some(s => s.vigente);
            if (sancionVigente) {
                mostrarError("equipo", `El capitán ${capitan.apodo} tiene una sanción vigente que bloquea la inscripción.`);
                ok = false;
            }

            resumen.textContent = ok ? `Vas a inscribir a "${eq.nombre}" en "${t.nombre}".` : "";
            return ok;
        }

        form.addEventListener("input", () => { validar(); confirmacion.textContent = ""; });

        form.addEventListener("submit", e => {
            e.preventDefault();
            if (!validar()) return;
            const t = torneos.find(x => x.id === selectTorneo.value);
            t.cupoOcupado++;
            t.participantes.push(selectEquipo.value);
            confirmacion.textContent = "Inscripción registrada correctamente.";
            confirmacion.className = "error-msg";
            confirmacion.style.color = "var(--color-accent)";
        });
    }

// ---------- GESTIÓN DE EQUIPO ----------
function initEquipo() {
        const form = document.getElementById("form-equipo");
        const listaIntegrantes = document.getElementById("equipo-integrantes");
        if (!form || !listaIntegrantes) return;

        const selectJuego = document.getElementById("equipo-juego");
        const selectCapitan = document.getElementById("equipo-capitan");
        juegos.forEach(j => selectJuego.add(new Option(j.nombre, j.id)));
        jugadores.forEach(j => selectCapitan.add(new Option(j.apodo, j.id)));

        let integrantesActuales = [];

        function pintarIntegrantes() {
            listaIntegrantes.innerHTML = "";
            integrantesActuales.forEach(i => {
                const jg = jugadores.find(j => j.id === i.jugadorId);
                const li = document.createElement("li");
                li.textContent = `${jg.apodo} — ${i.rol} `;
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = "Quitar";
                btn.addEventListener("click", () => {
                    integrantesActuales = integrantesActuales.filter(x => x.jugadorId !== i.jugadorId);
                    pintarIntegrantes();
                });
                li.appendChild(btn);
                listaIntegrantes.appendChild(li);
            });
        }

        document.getElementById("btn-agregar-integrante").addEventListener("click", () => {
            const jugadorId = document.getElementById("equipo-nuevo-jugador").value;
            const rol = document.getElementById("equipo-nuevo-rol").value.trim() || "Jugador";
            if (!jugadorId) return;
            if (integrantesActuales.some(i => i.jugadorId === jugadorId)) {
                document.getElementById("error-integrantes").textContent = "Ese jugador ya está en el equipo.";
                return;
            }
            document.getElementById("error-integrantes").textContent = "";
            integrantesActuales.push({ jugadorId, rol });
            pintarIntegrantes();
        });

        jugadores.forEach(j => document.getElementById("equipo-nuevo-jugador").add(new Option(j.apodo, j.id)));

        form.addEventListener("submit", e => {
            e.preventDefault();
            const nombre = document.getElementById("equipo-nombre").value.trim();
            const capitanId = selectCapitan.value;
            let ok = true;

            document.getElementById("error-nombre").textContent = "";
            document.getElementById("error-capitan").textContent = "";

            if (!nombre) {
                document.getElementById("error-nombre").textContent = "El nombre del equipo es obligatorio.";
                ok = false;
            } else if (equipos.some(eq => eq.nombre.toLowerCase() === nombre.toLowerCase())) {
                document.getElementById("error-nombre").textContent = "Ya existe un equipo con ese nombre.";
                ok = false;
            }
            if (!capitanId) {
                document.getElementById("error-capitan").textContent = "Debes seleccionar un capitán.";
                ok = false;
            }
            if (!ok) return;

            equipos.push({
                id: "e" + (equipos.length + 1),
                nombre, juegoId: selectJuego.value, capitanId, activo: true,
                integrantes: integrantesActuales
            });
            document.getElementById("equipo-confirmacion").textContent = `Equipo "${nombre}" creado con éxito.`;
            form.reset();
            integrantesActuales = [];
            pintarIntegrantes();
        });
    }

// ---------- PERFIL DE JUGADOR ----------
function initPerfil() {
        const cont = document.getElementById("perfil-datos");
        if (!cont) return;

        const jugador = jugadores[0]; // simulado: jugador con sesión activa

    cont.innerHTML = `
<p>Nombre: ${jugador.nombre}</p>
<p>Apodo: ${jugador.apodo}</p>
<p>Correo: ${jugador.email}</p>
`;

    document.getElementById("perfil-equipos").innerHTML =
        jugador.equipos.map(id => `<li>${equipos.find(e => e.id === id)?.nombre}</li>`).join("") ||
        "<li>No pertenece a ningún equipo.</li>";

    document.getElementById("perfil-estadisticas").textContent =
        `Victorias: ${jugador.estadisticas.victorias} — Derrotas: ${jugador.estadisticas.derrotas}`;

    document.getElementById("perfil-sanciones").innerHTML =
        jugador.sanciones.length
            ? jugador.sanciones.map(s => `<li>${s.motivo} — ${s.vigente ? "Vigente" : "Cumplida"}</li>`).join("")
            : "<li>Sin sanciones registradas.</li>";

    // Formulario de edición de datos (segundo formulario funcional del sitio)
    const form = document.getElementById("form-perfil");
    form.addEventListener("submit", e => {
        e.preventDefault();
        let ok = true;
        const apodo = document.getElementById("perfil-apodo").value.trim();
        const email = document.getElementById("perfil-email").value.trim();
        const edad = document.getElementById("perfil-edad").value;
        const pass = document.getElementById("perfil-password").value;
        const pass2 = document.getElementById("perfil-password2").value;

        const errores = { apodo: "", email: "", edad: "", password: "", password2: "" };

        if (!apodo) { errores.apodo = "El apodo es obligatorio."; ok = false; }
        else if (/\s/.test(apodo)) { errores.apodo = "El apodo no puede contener espacios."; ok = false; }
        else if (apodo.length < 3 || apodo.length > 15) { errores.apodo = "Debe tener entre 3 y 15 caracteres."; ok = false; }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errores.email = "Correo con formato inválido."; ok = false; }

        if (edad === "" || edad < 13 || edad > 99) { errores.edad = "La edad debe estar entre 13 y 99."; ok = false; }

        if (pass.length < 8) { errores.password = "La contraseña debe tener mínimo 8 caracteres."; ok = false; }
        if (pass !== pass2) { errores.password2 = "Las contraseñas no coinciden."; ok = false; }

        Object.keys(errores).forEach(k => document.getElementById(`error-${k}`).textContent = errores[k]);

        if (!ok) return;
        jugador.apodo = apodo;
        jugador.email = email;
        document.getElementById("perfil-confirmacion").textContent = "Datos actualizados correctamente.";
    });
}