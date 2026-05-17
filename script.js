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
// --- CIRCUITO RESPONSIVE (¡ACTUALIZADO UN 30% MÁS A LA DERECHA!) ---
        const isMobile = window.innerWidth < 600;
        
        // Antes en celu el maxRange era 40 para que no se corten. 
        // Ahora lo estiramos a 70 (un 30% más de pista hacia la derecha).
        // En la compu lo subimos a 85 para que usen todo el monitor de lado a lado.
        const maxRange = isMobile ? 70 : 85; 
        const minOffset = 5;                 
        
        // Calcula el punto de inicio en porcentaje (X) usando el nuevo rango estirado
        const randomX = Math.floor(Math.random() * maxRange) + minOffset;
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

        // Retraso al azar para que vayan saliendo escalonadas (de 0 a 8 segundos)
        const randomDelay = (Math.random() * 8).toFixed(2);

        // Velocidad de subida al azar (entre 12 y 22 segundos para que unas pasen a otras)
        const randomDuration = (12 + Math.random() * 10).toFixed(2);

        // Aplicamos los estilos de animación en línea
        burbuja.style.animationDelay = `${randomDelay}s`;
        burbuja.style.animationDuration = `${randomDuration}s`;

        // HACER ARRASTRABLE
        hacerArrastrable(burbuja);

        // Metemos la burbuja en el contenedor de fondo
        container.appendChild(burbuja);

        // CÁLCULO DINÁMICO DE DISTRIBUCIÓN HORIZONTAL (sin cortes)
        // Ahora que está en el DOM, podemos medir su ancho real en la pantalla
        const anchoBurbuja = burbuja.offsetWidth;
        // Calculamos el espacio máximo: el ancho de la pantalla menos el ancho de la frase
        // y le restamos 35px extra para absorber el vaivén del zig-zag a la derecha sin cortarse.
        const maxPx = window.innerWidth - anchoBurbuja - 35; 
        const maxPorcentaje = (maxPx / window.innerWidth) * 100;
        
        // Posición horizontal al azar asegurando que ocupe todo el espacio seguro disponible
        const randomX = Math.random() * (maxPorcentaje - 5) + 5;
        burbuja.style.left = `${randomX}%`;
    });
});
