document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("button[data-accordion-target]");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-accordion-target");
            const content = document.querySelector(targetId);
            const icon = this.querySelector("svg");

            // Cerrar todos los demás acordeones antes de abrir uno nuevo
            document.querySelectorAll("[id^='accordion-collapse-body']").forEach(item => {
                if (item !== content) {
                    item.classList.add("hidden");
                    const btn = document.querySelector(`button[data-accordion-target="#${item.id}"] svg`);
                    btn?.classList.remove("rotate-180");
                }
            });

            // Alternar visibilidad del contenido actual
            content.classList.toggle("hidden");

            // Rotar el ícono al abrir/cerrar
            icon.classList.toggle("rotate-180");
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const btnScrollTop = document.getElementById("btnScrollTop");

    // Mostrar el botón cuando el usuario baja 300px
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            btnScrollTop.classList.add("show");
        } else {
            btnScrollTop.classList.remove("show");
        }
    });

    // Scroll suave al inicio al hacer clic en el botón
    btnScrollTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
