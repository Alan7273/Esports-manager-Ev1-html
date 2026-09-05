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


