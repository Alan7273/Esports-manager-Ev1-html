# eSports Arena Manager — Frontend (EP1)

Plataforma para organizar torneos de videojuegos competitivos. Este repositorio contiene la capa de presentación (HTML5, CSS3 y JavaScript) desarrollada para la Evaluación Parcial 1.

## Integrantes
- Alan Cubillos — Programador/Javascripts
- Jorge Gonzalez — Programador/Htmls
- Martin Espinoza — Diseñador/Css

## Requisitos previos
- Navegador web moderno (Chrome, Firefox, Edge).
- No requiere backend ni instalación de dependencias en EP1 (datos simulados en JavaScript).
- Opcional: extensión "Live Server" (VS Code) para levantar el proyecto con recarga automática.

## Instrucciones de ejecución
1. Clonar el repositorio:
```bash
   git clone https://github.com/usuario/repositorio.git
```
2. Entrar a la carpeta del proyecto:
```bash
   cd repositorio
```
3. Abrir `index.html` directamente en el navegador, o levantar un servidor local (ej. con Live Server o `npx serve`).

## Estructura de carpetas

├── index.html # Vista Inicio

├── torneos.html # Listado de torneos 

├── torneo-detalle.html # Detalle de torneo

├── inscripcion.html # Inscripción a torneo

├── equipo.html # Gestión de equipo

├── perfil.html # Perfil de jugador

├── /css

│ └── estilos.css # Hoja de estilos externa compartida

├── /js

│ ├── data.js # Arreglos simulados (torneos, equipos, jugadores, etc.)

│ ├── validaciones.js # Validaciones de formularios

│ └── main.js # Renderizado DOM y lógica de navegación

└── README.md

## Notas
- El repositorio no contiene credenciales, tokens ni claves.
- Las URL de API (para etapas futuras con backend) se configurarán mediante variables de entorno.