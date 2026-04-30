const contenedor = document.getElementById('burbujas-container');

function crearBurbuja() {
    const div = document.createElement('div');
    div.classList.add('burbuja');
    div.style.left = `${Math.random() * 100}%`;

    const size = Math.random() * 15 + 10;
    div.style.width = `${size}px`;
    div.style.height = `${size}px`;

    div.style.animationDuration = `${Math.random() * 3 + 2}s`;

    contenedor.appendChild(div);

    div.addEventListener('animationend', () => {
        div.remove();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    setInterval(crearBurbuja, 300);
});
