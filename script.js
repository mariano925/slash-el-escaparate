window.addEventListener('DOMContentLoaded', () => {
    // Elemento de estado del sistema
    const dinamico = document.getElementById('dinamico');
    if (dinamico) {
        dinamico.textContent = 'Monitorería de sistema: activo';
    }

    const contenedor = document.getElementById('burbujas-container');
    const maxBurbujas = 25;
    const intervaloCreacion = 400; // ms - aumentado para reducir carga
    let ultimaCreacion = 0;
    let burbujaActiva = false;

    function crearBurbuja() {
        // Evita crear burbujas si ya hay muchas o si se está creando una
        if (!contenedor || contenedor.childElementCount >= maxBurbujas || burbujaActiva) return;

        burbujaActiva = true;
        const burbuja = document.createElement('div');
        burbuja.classList.add('burbuja');

        // Posición y tamaño aleatorio
        const posicion = Math.random() * 100;
        const size = Math.random() * 12 + 8; // Tamaño entre 8-20px
        const opacidad = Math.random() * 0.4 + 0.2; // Opacidad entre 0.2-0.6
        const duracion = Math.random() * 2.5 + 2.5; // Duración entre 2.5-5s

        burbuja.style.left = posicion + '%';
        burbuja.style.width = size + 'px';
        burbuja.style.height = size + 'px';
        burbuja.style.opacity = opacidad;
        burbuja.style.animationDuration = duracion + 's';

        contenedor.appendChild(burbuja);
        burbujaActiva = false;

        // Timeout de seguridad con margen
        const timeoutId = setTimeout(() => {
            if (burbuja.parentNode) burbuja.remove();
        }, (duracion * 1000) + 100);

        // Limpieza al terminar animación
        const handleAnimationEnd = () => {
            clearTimeout(timeoutId);
            burbuja.removeEventListener('animationend', handleAnimationEnd);
            if (burbuja.parentNode) burbuja.remove();
        };

        burbuja.addEventListener('animationend', handleAnimationEnd, { once: true });
    }

    function animar(timeStamp) {
        if (!ultimaCreacion) ultimaCreacion = timeStamp;

        if (timeStamp - ultimaCreacion >= intervaloCreacion) {
            crearBurbuja();
            ultimaCreacion = timeStamp;
        }

        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
});
