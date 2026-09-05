// ================================
// TEMA CON LOCALSTORAGE
// ================================

const botonTema =
    document.getElementById("tema");


// Revisar si había un tema guardado

const temaGuardado =
    localStorage.getItem("tema");

if (temaGuardado === "claro") {

    document.body.classList.add("claro");

    botonTema.textContent = "🌙 Tema oscuro";

}


// Cambiar tema

botonTema.addEventListener("click", function() {

    document.body.classList.toggle("claro");

    if (document.body.classList.contains("claro")) {

        localStorage.setItem("tema", "claro");

        botonTema.textContent = "🌙 Tema oscuro";

    } else {

        localStorage.setItem("tema", "oscuro");

        botonTema.textContent = "🌙 Tema claro";

    }

});


// ================================
// BUSCADOR DE JUEGOS
// ================================

const buscador = document.getElementById("buscador");
const botonesFiltro = document.querySelectorAll(".filtros:not(.filtros-estados) button");
const resultadoBusqueda = document.getElementById("resultadoBusqueda");
const ordenarPor = document.getElementById("ordenarPor");
const favoritosGuardados = JSON.parse(localStorage.getItem("favoritosNexPlay") || "[]");
const botonesEstado = document.querySelectorAll("[data-estado-filtro]");
let generoSeleccionado = "todos";
let favoritosActivo = false;
let estadoSeleccionado = "todos";

const botonConocer = document.getElementById("botonConocer");
const mensaje = document.getElementById("mensaje");
const formularioContacto = document.getElementById("formularioContacto");
const nombre = document.getElementById("nombre");
const juego = document.getElementById("juego");
const resultado = document.getElementById("resultado");

botonConocer.addEventListener("click", function() {
    document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
    mensaje.textContent = "La colección está creciendo. ¡Déjame tu recomendación!";
});

formularioContacto.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const nombreEscrito = nombre.value.trim();
    const juegoEscrito = juego.value.trim();

    if (!nombreEscrito || !juegoEscrito) {
        resultado.textContent = "Completa tu nombre y tu juego favorito.";
        resultado.style.color = "var(--acento-fuerte)";
        return;
    }

    resultado.textContent = `Gracias, ${nombreEscrito}. Tu recomendación de ${juegoEscrito} quedó registrada en esta sesión.`;
    resultado.style.color = "var(--verde)";
    formularioContacto.reset();
});

function actualizarProyectos() {
    const textoBuscado = buscador.value.trim().toLowerCase();
    let resultadosEncontrados = 0;
    const tarjetasCatalogo = Array.from(document.querySelectorAll(".tarjetas .tarjeta"));

    tarjetasCatalogo.sort(function(tarjetaA, tarjetaB) {
        const orden = ordenarPor.value;
        if (orden === "nombre") {
            return tarjetaA.dataset.titulo.localeCompare(tarjetaB.dataset.titulo, "es");
        }
        if (orden === "reciente" || orden === "antiguo") {
            const diferencia = Number(tarjetaB.dataset.anio) - Number(tarjetaA.dataset.anio);
            return orden === "reciente" ? diferencia : -diferencia;
        }
        return parseFloat(tarjetaB.dataset.calificacion) - parseFloat(tarjetaA.dataset.calificacion);
    });

    tarjetasCatalogo.forEach(function(tarjeta) {
        tarjetas.appendChild(tarjeta);
        const coincideGenero =
            generoSeleccionado === "todos" ||
            tarjeta.dataset.genero === generoSeleccionado;
        const coincideFavoritos = !favoritosActivo || favoritosGuardados.includes(tarjeta.dataset.id);
        const coincideEstado = estadoSeleccionado === "todos" || tarjeta.dataset.estado === estadoSeleccionado;
        const contenidoBuscable = [
            tarjeta.dataset.titulo,
            tarjeta.dataset.generoNombre,
            tarjeta.dataset.plataforma,
            tarjeta.dataset.descripcion
        ].join(" ").toLowerCase();
        const coincideBusqueda = contenidoBuscable.includes(textoBuscado);
        const coincide = coincideGenero && coincideFavoritos && coincideEstado && coincideBusqueda;

        tarjeta.style.display = coincide
            ? "block"
            : "none";

        if (coincide) {
            resultadosEncontrados += 1;
        }
    });

    const etiquetaJuego = resultadosEncontrados === 1 ? "juego encontrado" : "juegos encontrados";
    resultadoBusqueda.textContent = `🔎 ${resultadosEncontrados} ${etiquetaJuego}.`;
    document.getElementById("sinResultados").hidden = resultadosEncontrados !== 0;
}

function actualizarEstadisticas() {
    const tarjetasCatalogo = Array.from(document.querySelectorAll(".tarjetas .tarjeta"));
    const generos = new Set(tarjetasCatalogo.map(function(tarjeta) {
        return tarjeta.dataset.genero;
    }));
    const favoritos = tarjetasCatalogo.filter(function(tarjeta) {
        return favoritosGuardados.includes(tarjeta.dataset.id);
    });
    const completados = tarjetasCatalogo.filter(function(tarjeta) {
        return tarjeta.dataset.estado === "completados" || tarjeta.dataset.estado === "terminado";
    });

    document.getElementById("estadisticaJuegos").textContent = String(tarjetasCatalogo.length).padStart(2, "0");
    document.getElementById("estadisticaGeneros").textContent = String(generos.size).padStart(2, "0");
    document.getElementById("estadisticaFavoritos").textContent = String(favoritos.length).padStart(2, "0");
    document.getElementById("estadisticaCompletados").textContent = String(completados.length).padStart(2, "0");
}

buscador.addEventListener("input", actualizarProyectos);
ordenarPor.addEventListener("change", actualizarProyectos);

botonesFiltro.forEach(function(boton) {
    boton.addEventListener("click", function() {
        favoritosActivo = boton.dataset.favoritos === "true";
        if (favoritosActivo) {
            generoSeleccionado = "todos";
        } else {
            generoSeleccionado = boton.dataset.genero;
        }

        botonesFiltro.forEach(function(otroBoton) {
            otroBoton.classList.remove("activo");
        });
        boton.classList.add("activo");

        actualizarProyectos();
    });
});

botonesEstado.forEach(function(boton) {
    boton.addEventListener("click", function() {
        estadoSeleccionado = boton.dataset.estadoFiltro;
        botonesEstado.forEach(function(otroBoton) {
            otroBoton.classList.remove("activo");
        });
        boton.classList.add("activo");
        actualizarProyectos();
    });
});

// ================================
// AGREGAR JUEGO
// ================================

const formularioJuego = document.getElementById("formularioJuego");
const resultadoJuego = document.getElementById("resultadoJuego");
const tarjetas = document.querySelector(".tarjetas");
const juegosGuardados = JSON.parse(localStorage.getItem("juegosNexPlay") || "[]");
const tituloFormularioJuego = document.getElementById("tituloFormularioJuego");
const guardarJuego = document.getElementById("guardarJuego");
const cancelarEdicion = document.getElementById("cancelarEdicion");
let juegoEnEdicion = null;

function crearElementoTexto(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = texto;
    return elemento;
}

function normalizarEstado(estado) {
    const estadoNormalizado = (estado || "pendientes").toLowerCase();
    if (estadoNormalizado.includes("jugando")) {
        return "jugando";
    }
    if (estadoNormalizado.includes("complet") || estadoNormalizado.includes("termin")) {
        return "completados";
    }
    return "pendientes";
}

function nombreEstado(estado) {
    const nombres = {
        jugando: "🟢 Jugando",
        completados: "🔵 Completados",
        pendientes: "🟡 Pendientes"
    };
    return nombres[normalizarEstado(estado)];
}

function crearTarjetaJuego(datos) {
    const idJuego = datos.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    datos.id = idJuego;
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.dataset.id = idJuego;
    tarjeta.dataset.creadoUsuario = "true";
    tarjeta.dataset.genero = datos.genero;
    tarjeta.dataset.titulo = datos.titulo;
    tarjeta.dataset.imagen = datos.imagen;
    tarjeta.dataset.generoNombre = datos.generoNombre;
    tarjeta.dataset.calificacion = datos.calificacion;
    tarjeta.dataset.descripcion = datos.descripcion;
    tarjeta.dataset.plataforma = datos.plataforma;
    tarjeta.dataset.anio = datos.anio || new Date().getFullYear();
    tarjeta.dataset.desarrollador = "Por confirmar";
    tarjeta.dataset.estado = normalizarEstado(datos.estado);

    const imagen = document.createElement("img");
    imagen.src = datos.imagen;
    imagen.alt = datos.titulo;

    const cuerpo = document.createElement("div");
    cuerpo.className = "tarjeta-cuerpo";

    const meta = document.createElement("div");
    meta.className = "tarjeta-meta";
    meta.append(
        crearElementoTexto("span", "", datos.generoNombre.toUpperCase()),
        crearElementoTexto("span", "", `★ ${datos.calificacion.split(" ")[0]}`)
    );

    cuerpo.append(
        meta,
        crearElementoTexto("h3", "", datos.titulo),
        crearElementoTexto("span", `estado-badge estado-${normalizarEstado(datos.estado)}`, nombreEstado(datos.estado)),
        crearElementoTexto("p", "", datos.descripcion)
    );

    const informacionAdicional = document.createElement("div");
    informacionAdicional.className = "tarjeta-info-adicional";
    informacionAdicional.append(
        crearElementoTexto("span", "", datos.plataforma),
        crearElementoTexto("span", "", datos.anio || new Date().getFullYear())
    );
    cuerpo.append(informacionAdicional);

    const acciones = document.createElement("div");
    acciones.className = "tarjeta-acciones";

    const boton = crearElementoTexto("button", "boton-detalles", "Ver detalles");
    boton.type = "button";

    const botonEliminar = crearElementoTexto("button", "boton-eliminar", "Eliminar");
    botonEliminar.type = "button";
    botonEliminar.setAttribute("aria-label", `Eliminar ${datos.titulo}`);
    botonEliminar.addEventListener("click", function() {
        if (!window.confirm(`¿Eliminar ${datos.titulo} de tu colección?`)) {
            return;
        }

        const indice = juegosGuardados.findIndex(function(juegoGuardado) {
            return juegoGuardado.id === idJuego;
        });
        if (indice !== -1) {
            juegosGuardados.splice(indice, 1);
            localStorage.setItem("juegosNexPlay", JSON.stringify(juegosGuardados));
        }
        const indiceFavorito = favoritosGuardados.indexOf(idJuego);
        if (indiceFavorito !== -1) {
            favoritosGuardados.splice(indiceFavorito, 1);
            localStorage.setItem("favoritosNexPlay", JSON.stringify(favoritosGuardados));
        }
        tarjeta.remove();
        actualizarProyectos();
        actualizarEstadisticas();
    });

    const botonEditar = crearElementoTexto("button", "boton-editar", "Editar");
    botonEditar.type = "button";
    botonEditar.setAttribute("aria-label", `Editar ${datos.titulo}`);
    botonEditar.addEventListener("click", function() {
        iniciarEdicion(datos, tarjeta);
    });

    const botonFavorito = crearElementoTexto("button", "boton-favorito", "♡");
    botonFavorito.type = "button";
    botonFavorito.setAttribute("aria-label", `Añadir ${datos.titulo} a favoritos`);
    botonFavorito.setAttribute("aria-pressed", "false");

    acciones.append(boton, botonEditar, botonEliminar, botonFavorito);
    tarjeta.append(imagen, cuerpo, acciones);
    configurarBotonDetalles(boton);
    configurarBotonFavorito(tarjeta, botonFavorito);
    return tarjeta;
}

juegosGuardados.forEach(function(datos) {
    tarjetas.appendChild(crearTarjetaJuego(datos));
});
localStorage.setItem("juegosNexPlay", JSON.stringify(juegosGuardados));
document.querySelectorAll(".tarjeta").forEach(function(tarjeta) {
    configurarBotonFavorito(tarjeta, tarjeta.querySelector(".boton-favorito"));
});
actualizarProyectos();
actualizarEstadisticas();

function configurarBotonFavorito(tarjeta, boton) {
    if (!boton) {
        return;
    }

    const idJuego = tarjeta.dataset.id;
    const actualizarEstado = function() {
        const esFavorito = favoritosGuardados.includes(idJuego);
        boton.textContent = esFavorito ? "♥" : "♡";
        boton.classList.toggle("favorito-activo", esFavorito);
        boton.setAttribute("aria-pressed", String(esFavorito));
        boton.setAttribute("aria-label", esFavorito
            ? `Quitar ${tarjeta.dataset.titulo} de favoritos`
            : `Añadir ${tarjeta.dataset.titulo} a favoritos`);
    };

    actualizarEstado();
    boton.addEventListener("click", function() {
        const indice = favoritosGuardados.indexOf(idJuego);
        if (indice === -1) {
            favoritosGuardados.push(idJuego);
        } else {
            favoritosGuardados.splice(indice, 1);
        }
        localStorage.setItem("favoritosNexPlay", JSON.stringify(favoritosGuardados));
        actualizarEstado();
        actualizarProyectos();
        actualizarEstadisticas();
    });
}

function iniciarEdicion(datos, tarjeta) {
    juegoEnEdicion = { datos: datos, tarjeta: tarjeta };
    document.getElementById("nombreJuego").value = datos.titulo;
    document.getElementById("generoJuego").value = datos.genero;
    document.getElementById("calificacionJuego").value = datos.calificacion;
    document.getElementById("estadoJuego").value = normalizarEstado(datos.estado);
    document.getElementById("descripcionJuego").value = datos.descripcion;
    document.getElementById("plataformaJuego").value = datos.plataforma;
    document.getElementById("anioJuego").value = datos.anio || tarjeta.dataset.anio;
    document.getElementById("imagenJuego").required = false;
    tituloFormularioJuego.textContent = "Edita tu juego.";
    guardarJuego.innerHTML = "Guardar cambios <span>✓</span>";
    cancelarEdicion.hidden = false;
    resultadoJuego.textContent = "Modifica los datos y guarda los cambios.";
    resultadoJuego.style.color = "var(--texto-suave)";
    document.getElementById("agregar").scrollIntoView({ behavior: "smooth" });
}

function salirDeEdicion() {
    juegoEnEdicion = null;
    formularioJuego.reset();
    document.getElementById("imagenJuego").required = true;
    tituloFormularioJuego.textContent = "Agrega tu próximo favorito.";
    guardarJuego.innerHTML = "Agregar juego <span>＋</span>";
    cancelarEdicion.hidden = true;
}

cancelarEdicion.addEventListener("click", function() {
    salirDeEdicion();
    resultadoJuego.textContent = "Edición cancelada.";
    resultadoJuego.style.color = "var(--texto-suave)";
});

formularioJuego.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const archivo = document.getElementById("imagenJuego").files[0];
    if (!archivo && !juegoEnEdicion) {
        resultadoJuego.textContent = "Selecciona una imagen de portada.";
        resultadoJuego.style.color = "var(--acento-fuerte)";
        return;
    }

    const guardarDatos = function(imagen) {
        const genero = document.getElementById("generoJuego").value;
        const datos = {
            id: juegoEnEdicion ? juegoEnEdicion.datos.id : null,
            titulo: document.getElementById("nombreJuego").value.trim(),
            genero: genero,
            generoNombre: document.getElementById("generoJuego").selectedOptions[0].textContent,
            descripcion: document.getElementById("descripcionJuego").value.trim(),
            calificacion: document.getElementById("calificacionJuego").value,
            imagen: imagen,
            plataforma: document.getElementById("plataformaJuego").value.trim(),
            anio: document.getElementById("anioJuego").value,
            estado: document.getElementById("estadoJuego").value
        };

        if (juegoEnEdicion) {
            const indice = juegosGuardados.findIndex(function(juegoGuardado) {
                return juegoGuardado.id === juegoEnEdicion.datos.id;
            });
            datos.id = juegoEnEdicion.datos.id;
            juegosGuardados[indice] = datos;
            juegoEnEdicion.tarjeta.replaceWith(crearTarjetaJuego(datos));
            resultadoJuego.textContent = `${datos.titulo} se actualizó correctamente.`;
        } else {
            tarjetas.appendChild(crearTarjetaJuego(datos));
            juegosGuardados.push(datos);
            resultadoJuego.textContent = `${datos.titulo} se añadió a tu colección.`;
        }

        localStorage.setItem("juegosNexPlay", JSON.stringify(juegosGuardados));
        actualizarProyectos();
        actualizarEstadisticas();
        resultadoJuego.style.color = "var(--verde)";
        salirDeEdicion();
        document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    };

    if (archivo) {
        const lector = new FileReader();
        lector.addEventListener("load", function() {
            guardarDatos(lector.result);
        });
        lector.readAsDataURL(archivo);
    } else {
        guardarDatos(juegoEnEdicion.datos.imagen);
    }
});


// ================================
// VENTANA DE DETALLES
// ================================

const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrarModal");
const imagenModal = document.getElementById("imagenModal");
const tituloModal = document.getElementById("tituloModal");
const generoModal = document.getElementById("generoModal");
const descripcionModal = document.getElementById("descripcionModal");
const calificacionModal = document.getElementById("calificacionModal");
const plataformaModal = document.getElementById("plataformaModal");
const anioModal = document.getElementById("anioModal");
const desarrolladorModal = document.getElementById("desarrolladorModal");
const estadoModal = document.getElementById("estadoModal");
let elementoAnteriorAlModal = null;

function configurarBotonDetalles(boton) {
    boton.addEventListener("click", function() {
        const tarjeta = boton.closest(".tarjeta");
        imagenModal.src = tarjeta.dataset.imagen;
        imagenModal.alt = `Portada de ${tarjeta.dataset.titulo}`;
        tituloModal.textContent = tarjeta.dataset.titulo;
        generoModal.textContent = tarjeta.dataset.generoNombre.toUpperCase();
        descripcionModal.textContent = tarjeta.dataset.descripcion;
        calificacionModal.textContent = tarjeta.dataset.calificacion;
        plataformaModal.textContent = tarjeta.dataset.plataforma;
        anioModal.textContent = tarjeta.dataset.anio;
        desarrolladorModal.textContent = tarjeta.dataset.desarrollador;
        estadoModal.textContent = nombreEstado(tarjeta.dataset.estado);
        estadoModal.dataset.estado = normalizarEstado(tarjeta.dataset.estado);
        elementoAnteriorAlModal = document.activeElement;
        modal.classList.add("abierto");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        cerrarModal.focus();
    });
}

document.querySelectorAll(".boton-detalles").forEach(configurarBotonDetalles);

function cerrarVentanaDetalles() {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (elementoAnteriorAlModal) {
        elementoAnteriorAlModal.focus();
    }
}

cerrarModal.addEventListener("click", cerrarVentanaDetalles);

modal.addEventListener("click", function(evento) {
    if (evento.target === modal) {
        cerrarVentanaDetalles();
    }
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        cerrarVentanaDetalles();
    }

    if (evento.key === "Tab" && modal.classList.contains("abierto")) {
        evento.preventDefault();
        cerrarModal.focus();
    }
});