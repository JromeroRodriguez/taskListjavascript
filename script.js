  // Claves de almacenamiento
  const KEY_TAREAS = "ws_tareas";       // localStorage → persiste
  const KEY_FILTRO = "ws_filtro";       // sessionStorage → temporal por sesión
  const KEY_TEMA = "ws_tema";           // localStorage → preferencia persistente
  const KEY_BIENVENIDA = "ws_bienvenida"; // sessionStorage → control de mensaje de bienvenida

function aplicarTema() {
  const temaGuardado = localStorage.getItem(KEY_TEMA);
  const temaSistema =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const tema = temaGuardado || temaSistema;
  document.documentElement.dataset.theme = tema;

  const btn = document.getElementById("btnTema");
  if (btn) {
    btn.textContent = tema === "dark" ? "Modo claro" : "Modo oscuro";
    btn.setAttribute("aria-label", tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  }
}

function alternarTema() {
  const temaActual = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nuevo = temaActual === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nuevo;
  localStorage.setItem(KEY_TEMA, nuevo);
  aplicarTema();
}



function init() {
  aplicarTema();

  // Bienvenida (una sola vez por sesión)
  if (!sessionStorage.getItem(KEY_BIENVENIDA)) {
    const bienvenidaEl = document.getElementById("bienvenida");
    if (bienvenidaEl) bienvenidaEl.textContent = " ¡Bienvenido/a a la lista de tareas";
    sessionStorage.setItem(KEY_BIENVENIDA, "mostrado");
  }

  // Restaurar filtro de la sesión actual (o "todas" por defecto)
  const filtroGuardado = sessionStorage.getItem(KEY_FILTRO) || "todas";
  marcarBotonActivo(filtroGuardado);
  renderizar();

  // Eventos: botones y entradas
  const btnAgregar = document.getElementById("btnAgregar");
  const input = document.getElementById("inputTarea");
  if (btnAgregar && input) btnAgregar.addEventListener("click", agregarTarea);
  if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") agregarTarea(); });

  ["todas", "pendientes", "completadas"].forEach(f => {
    const btn = document.getElementById("btn-" + f);
    if (btn) btn.addEventListener("click", () => cambiarFiltro(f));
  });

  const temaBtn = document.getElementById("btnTema");
  if (temaBtn) temaBtn.addEventListener("click", alternarTema);
}
 

 
function getTareas() {
  return JSON.parse(localStorage.getItem(KEY_TAREAS) || "[]");
}
 
function guardarTareas(tareas) {
  localStorage.setItem(KEY_TAREAS, JSON.stringify(tareas));
}
 
function agregarTarea() {
  const input = document.getElementById("inputTarea");
  if (!input) return;
  const texto = input.value.trim();
  if (!texto) return;

  const tareas = getTareas();
  tareas.push({ id: Date.now(), texto, completada: false });
  guardarTareas(tareas);
  input.value = "";
  renderizar();
}
 
function toggleCompletada(id) {
  const tareas = getTareas().map(t => (t.id === id ? { ...t, completada: !t.completada } : t));
  guardarTareas(tareas);
  renderizar();
}
 
function eliminarTarea(id) {
  guardarTareas(getTareas().filter(t => t.id !== id));
  renderizar();
}
// Edición inline: mantenemos el id de la tarea en edición
function editarTarea(id) {
  const tareas = getTareas();
  const tarea = tareas.find(t => t.id === id);
  if (!tarea) return;
  const nuevo = prompt("Editar tarea", tarea.texto);
  if (nuevo === null) return; // usuario canceló
  const texto = nuevo.trim();
  if (!texto) return;
  const actualizadas = tareas.map(t => (t.id === id ? { ...t, texto } : t));
  guardarTareas(actualizadas);
  renderizar();
  alert("Tarea actualizada");
}
 
 
function cambiarFiltro(valor) {
  sessionStorage.setItem(KEY_FILTRO, valor);
  marcarBotonActivo(valor);
  renderizar();
}
 
function getFiltro() {
  return sessionStorage.getItem(KEY_FILTRO) || "todas";
}
 
function marcarBotonActivo(filtro) {
  ["todas", "pendientes", "completadas"].forEach(f => {
    const btn = document.getElementById("btn-" + f);
    if (btn) btn.classList.toggle("activo", f === filtro);
  });
}
 
    // ─── RENDER ──────────────────────────────────────────────────────────────
function renderizar() {
  const filtro = getFiltro();
  const todasLasTareas = getTareas();

  const visibles = todasLasTareas.filter(t => {
    if (filtro === "pendientes") return !t.completada;
    if (filtro === "completadas") return t.completada;
    return true;
  });

  const lista = document.getElementById("listaTareas");
  if (!lista) return;
  lista.innerHTML = "";

  if (visibles.length === 0) {
    lista.innerHTML = "<li>Sin tareas para mostrar.</li>";
  }

  visibles.forEach(t => {
    const li = document.createElement("li");
    if (t.completada) li.classList.add("completada");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.completada;
    check.addEventListener("change", () => toggleCompletada(t.id));

      const span = document.createElement("span");
      span.textContent = t.texto;

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.style.marginRight = "6px";
      btnEditar.addEventListener("click", () => editarTarea(t.id));

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "✕";
      btnEliminar.addEventListener("click", () => eliminarTarea(t.id));

      li.appendChild(check);
      li.appendChild(span);
      li.appendChild(btnEditar);
      li.appendChild(btnEliminar);
    lista.appendChild(li);
  });

  // Contador de completadas
  const completadas = todasLasTareas.filter(t => t.completada).length;
  const contador = document.getElementById("contador");
  if (contador) contador.textContent = ` ${completadas} de ${todasLasTareas.length} tareas completadas`;
}
 
// Inicializar cuando DOM esté listo
document.addEventListener("DOMContentLoaded", init);