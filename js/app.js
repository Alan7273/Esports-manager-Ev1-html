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
    }
}