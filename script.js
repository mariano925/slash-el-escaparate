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

document.addEventListener("DOMContentLoaded", () => {
    const frasesBurbujas = [
        "«F5 soluciona el 99% de tus problemas»",
        "«Funciona en mi máquina local 🤷‍♂️»",
        "«No es un error, es una característica oculta»",
        "«Mirá mamá, ¡sin usar Bootstrap!»",
        "«Acá no se queman fases, se queman pestañas»",
        "«Trabajando bajo tensión (y con mate frío)»",
        "«Este sitio tiene más conexión que un tablero industrial»",
        "«Hacé clic acá... o no, no hago nada todavía»"
    ];

    const container = document.getElementById("burbujas-container");

    // FUNCIÓN PARA HACER ARRASTRABLES A LAS BURBUJAS
    function hacerArrastrable(el) {
        el.style.pointerEvents = 'auto'; // Permitir que reciba clics a pesar del contenedor
        el.style.cursor = 'grab';
        
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const dragStart = (e) => {
            isDragging = true;
            el.style.cursor = 'grabbing';
            
            // Pausar animación temporalmente
            el.style.animationPlayState = 'paused';
            
            const rect = el.getBoundingClientRect();
            
            // Si es la primera vez que se agarra, convertimos su posición animada a fija
            if (el.style.animation !== 'none') {
                el.style.left = rect.left + 'px';
                el.style.top = rect.top + 'px';
                el.style.bottom = 'auto';
                el.style.transform = 'none';
                el.style.animation = 'none'; // Detenemos definitivamente la animación CSS
            }

            // Coordenadas de inicio (soporta mouse y touch)
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            startX = clientX;
            startY = clientY;
            
            initialLeft = parseFloat(el.style.left) || rect.left;
            initialTop = parseFloat(el.style.top) || rect.top;

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('touchmove', dragMove, { passive: false });
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
            
            el.style.zIndex = 1000; // Pasarlo al frente
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Evita scroll en móviles
            
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            const dx = clientX - startX;
            const dy = clientY - startY;
            
            el.style.left = `${initialLeft + dx}px`;
            el.style.top = `${initialTop + dy}px`;
        };

        const dragEnd = () => {
            isDragging = false;
            el.style.cursor = 'grab';
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
            el.style.zIndex = '';
        };

        el.addEventListener('mousedown', dragStart);
        el.addEventListener('touchstart', dragStart, { passive: false });
        
        // Efecto hover para pausar en escritorio
        el.addEventListener('mouseenter', () => {
            if (!isDragging && el.style.animation !== 'none') {
                el.style.animationPlayState = 'paused';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (!isDragging && el.style.animation !== 'none') {
                el.style.animationPlayState = 'running';
            }
        });
    }

    frasesBurbujas.forEach((frase) => {
        // Creamos la burbuja suelta
        const burbuja = document.createElement("div");
        burbuja.classList.add("burbuja-flotante");
        burbuja.textContent = frase;

        // Detectar si es un dispositivo móvil (ancho menor a 768px)
        const isMobile = window.innerWidth < 768;

        // CÁLCULOS ALEATORIOS PARA LA DISTRIBUCIÓN
        // En móviles, restringir la posición entre 5% y 50% para evitar desbordes
        // En escritorio, mantener entre 5% y 85%
        let randomX;
        if (isMobile) {
            randomX = Math.floor(Math.random() * 45) + 5;
        } else {
            randomX = Math.floor(Math.random() * 80) + 5;
        }

        // Retraso al azar para que vayan saliendo escalonadas (de 0 a 8 segundos)
        const randomDelay = (Math.random() * 8).toFixed(2);

        // Velocidad de subida al azar (entre 12 y 22 segundos para que unas pasen a otras)
        const randomDuration = (12 + Math.random() * 10).toFixed(2);

        // Aplicamos los estilos en línea dinámicamente
        burbuja.style.left = `${randomX}%`;
        burbuja.style.animationDelay = `${randomDelay}s`;
        burbuja.style.animationDuration = `${randomDuration}s`;

        // HACER ARRASTRABLE
        hacerArrastrable(burbuja);

        // Metemos la burbuja en el contenedor de fondo
        container.appendChild(burbuja);
    });
});
