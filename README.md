# Lista de tareas — Proyecto simple

Pequeña app de ejemplo para manipular el DOM: agregar, editar, filtrar y eliminar tareas.

Contenido del repositorio

- `index.html` — interfaz principal
- `script.js` — lógica de la app (almacenamiento, render, filtros, tema)
- `style.css` — estilos básicos con soporte claro/oscuro

Cómo ejecutar (rápido)

1. Abre una terminal en la carpeta del proyecto.
2. Inicia un servidor estático (recomendado para que `localStorage` funcione correctamente):

```bash
python3 -m http.server 8000
```

3. Abre en el navegador: http://localhost:8000

Uso breve

- Escribe una tarea y pulsa "Agregar" (o Enter).
- Usa los botones de filtro: Todas / Pendientes / Completadas.
- Marca la casilla para alternar completada.
- Pulsa "Editar" para modificar una tarea (aparece un prompt) y confirmar.
- Pulsa "✕" para eliminar una tarea.
- El botón de tema alterna entre modo claro y oscuro; la preferencia se guarda en `localStorage`.

Notas técnicas

- Las tareas se guardan en `localStorage` bajo la clave `ws_tareas`.
- El filtro se guarda en `sessionStorage` bajo `ws_filtro`.
- El tema se guarda en `localStorage` bajo `ws_tema`.

Si quieres, puedo:

- Añadir un `npm` script o `package.json` para servir la app con `serve`.
- Cambiar la edición para que sea inline sin `prompt()`.
- Preparar un commit con estos cambios.