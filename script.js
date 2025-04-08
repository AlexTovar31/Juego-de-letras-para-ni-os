// Datos del juego
const letras = ['p', 'm', 'l', 't', 's', 'n', 'd', 'a', 'e', 'i', 'o', 'u'];
const silabas = ['pa', 'pe', 'pi', 'ma', 'me', 'mi', 'la', 'le', 'li', 'sa', 'se', 'si', 'na', 'ne', 'ni'];
const palabras = {
    'pato': './imagenes/pato.jpg',
    'mapa': './imagenes/mapa.jpg',
    'luna': './imagenes/luna.jpg',
    'sopa': './imagenes/sopa.jpg',
    'nido': './imagenes/nido.jpg'
};

// Elementos del DOM
const cuadroLetras = document.getElementById('cuadro-letras');
const imagenActual = document.getElementById('imagen-actual');
const areaPalabra = document.getElementById('area-palabra');
const retroalimentacion = document.getElementById('retroalimentacion');
const botonReiniciar = document.getElementById('reiniciar');

// Variables del juego
let palabraActual = '';
const synth = window.speechSynthesis; // API de voz

// Iniciar juego al cargar la página
document.addEventListener('DOMContentLoaded', iniciarJuego);

// Función principal
function iniciarJuego() {
    // Limpiar áreas
    cuadroLetras.innerHTML = '';
    areaPalabra.innerHTML = '';
    retroalimentacion.textContent = '';
    retroalimentacion.style.color = '#ff7675';

    // Generar palabra aleatoria
    const palabrasDisponibles = Object.keys(palabras);
    palabraActual = palabrasDisponibles[Math.floor(Math.random() * palabrasDisponibles.length)];
    imagenActual.src = palabras[palabraActual];
    imagenActual.alt = `Imagen de ${palabraActual}`;

    // Crear letras/sílabas seleccionables por clic
    letras.forEach(letra => crearElementoClickeable(letra, 'letra'));
    silabas.forEach(silaba => crearElementoClickeable(silaba, 'silaba'));
}

// Crear elementos clickeables
function crearElementoClickeable(texto, tipo) {
    const elemento = document.createElement('div');
    elemento.textContent = texto;
    elemento.classList.add(tipo);
    
    // Al hacer clic: solo agregar al área (sin reproducir sonido)
    elemento.addEventListener('click', () => {
        agregarLetraAlArea(texto);
    });
    
    cuadroLetras.appendChild(elemento);
}

// Agregar letra al área
function agregarLetraAlArea(letra) {
    const letraElemento = document.createElement('div');
    letraElemento.textContent = letra;
    letraElemento.classList.add('letra-seleccionada');
    areaPalabra.appendChild(letraElemento);

    // Verificar si la palabra está completa
    verificarPalabra();
}

// Verificar palabra
function verificarPalabra() {
    const palabraFormada = Array.from(areaPalabra.children)
        .map(letra => letra.textContent)
        .join('');

    if (palabraFormada === palabraActual) {
        retroalimentacion.textContent = '¡Correcto! 🎉';
        retroalimentacion.style.color = '#2ecc71';
        reproducirPalabraCompleta(palabraActual); // Solo reproduce la palabra completa
    } else if (palabraFormada.length === palabraActual.length) {
        retroalimentacion.textContent = '¡Ups! Intenta otra vez';
    }
}

// Función para reproducir solo la palabra completa
function reproducirPalabraCompleta(palabra) {
    if (synth.speaking) synth.cancel(); // Detener si hay algo en reproducción

    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'es-ES';
    utterance.text = palabra; // Solo la palabra, sin mensaje adicional
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    
    synth.speak(utterance);
}

// Reiniciar juego
botonReiniciar.addEventListener('click', iniciarJuego);
