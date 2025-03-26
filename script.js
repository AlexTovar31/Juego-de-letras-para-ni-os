// Datos del juego
const letras = ['p', 'm', 'l', 's', 'n', 'a', 'e', 'i', 'o', 'u'];
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
let areaPalabra = document.getElementById('area-palabra');
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

    // Solución para evitar duplicación de eventos
    const nuevoAreaPalabra = areaPalabra.cloneNode(false);
    areaPalabra.parentNode.replaceChild(nuevoAreaPalabra, areaPalabra);
    areaPalabra = nuevoAreaPalabra;

    // Generar palabra aleatoria
    const palabrasDisponibles = Object.keys(palabras);
    palabraActual = palabrasDisponibles[Math.floor(Math.random() * palabrasDisponibles.length)];
    imagenActual.src = palabras[palabraActual];
    imagenActual.alt = `Imagen de ${palabraActual}`;

    // Crear letras/sílabas
    letras.forEach(letra => crearElementoArrastrable(letra, 'letra'));
    silabas.forEach(silaba => crearElementoArrastrable(silaba, 'silaba'));

    // Configurar eventos
    configurarAreaDrop();
}

// Crear elementos arrastrables
function crearElementoArrastrable(texto, tipo) {
    const elemento = document.createElement('div');
    elemento.textContent = texto;
    elemento.classList.add(tipo);
    elemento.draggable = true;
    elemento.addEventListener('dragstart', dragStart);
    elemento.addEventListener('click', () => reproducirSonido(texto)); // Sonido al hacer clic
    cuadroLetras.appendChild(elemento);
}

// Configurar área de destino
function configurarAreaDrop() {
    areaPalabra.addEventListener('dragover', (e) => {
        e.preventDefault();
        areaPalabra.classList.add('drag-over');
    });

    areaPalabra.addEventListener('dragleave', () => {
        areaPalabra.classList.remove('drag-over');
    });

    areaPalabra.addEventListener('drop', (e) => {
        e.preventDefault();
        areaPalabra.classList.remove('drag-over');
        const letra = e.dataTransfer.getData('text/plain');
        agregarLetraAlArea(letra);
        verificarPalabra();
    });
}

// Manejar arrastre
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
}

// Agregar letra al área
function agregarLetraAlArea(letra) {
    const letrasEnArea = Array.from(areaPalabra.children).map(el => el.textContent);
    if (letrasEnArea.includes(letra)) {
        retroalimentacion.textContent = '¡Ya usaste esta letra!';
        return;
    }

    const letraElemento = document.createElement('div');
    letraElemento.textContent = letra;
    letraElemento.classList.add('letra-arrastrable');
    letraElemento.draggable = true;
    letraElemento.addEventListener('dragstart', dragStart);
    areaPalabra.appendChild(letraElemento);
}

// Verificar palabra
function verificarPalabra() {
    const palabraFormada = Array.from(areaPalabra.children)
        .map(letra => letra.textContent)
        .join('');

    if (palabraFormada === palabraActual) {
        retroalimentacion.textContent = '¡Correcto! 🎉';
        retroalimentacion.style.color = '#2ecc71';
        reproducirSonido(palabraActual, true); // Sonido de éxito
    } else if (palabraFormada.length === palabraActual.length) {
        retroalimentacion.textContent = '¡Ups! Intenta otra vez';
    }
}

// Función de sonido (¡CORREGIDA!)
function reproducirSonido(texto, esExito = false) {
    // Si es un éxito, usa un tono alegre
    if (esExito) {
        const utterance = new SpeechSynthesisUtterance(`¡Muy bien! ${texto}`);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        synth.speak(utterance);
    } 
    // Si es una letra/sílaba, pronúnciala
    else {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.rate = 0.8;
        utterance.lang = 'es-ES';
        synth.speak(utterance);
    }
}

// Reiniciar juego
botonReiniciar.addEventListener('click', iniciarJuego);