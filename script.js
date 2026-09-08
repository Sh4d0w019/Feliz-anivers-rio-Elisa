// ===============================
// ANIMAIS
// ===============================

function mostrarAnimal(animal) {
    document.getElementById("lista-animais").style.display = "none";

    const animais = [
        "pinguim",
        "elefante",
        "toupeira",
        "coruja",
        "raposa",
        "cavalo-marinho"
    ];

    animais.forEach(function(nome) {
        const elemento = document.getElementById(nome + "-detalhes");
        if (elemento) {
            elemento.style.display = "none";
        }
    });

    const escolhido = document.getElementById(animal + "-detalhes");

    if (escolhido) {
        escolhido.style.display = "block";
    }
}

function voltarAnimais() {
    const animais = [
        "pinguim",
        "elefante",
        "toupeira",
        "coruja",
        "raposa",
        "cavalo-marinho"
    ];

    animais.forEach(function(nome) {
        const elemento = document.getElementById(nome + "-detalhes");
        if (elemento) {
            elemento.style.display = "none";
        }
    });

    document.getElementById("lista-animais").style.display = "grid";
}


// ===============================
// ANIMAÇÕES AO ROLAR
// ===============================

const elementosReveal = document.querySelectorAll("section, article");

const observador = new IntersectionObserver(function(elementos) {
    elementos.forEach(function(elemento) {
        if (elemento.isIntersecting) {
            elemento.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.15
});

elementosReveal.forEach(function(elemento) {
    elemento.classList.add("reveal");
    observador.observe(elemento);
});


// ===============================
// LUA ARRASTÁVEL 🌙
// ===============================

const luaElisa = document.querySelector(".lua");

if (luaElisa) {

    let luaArrastando = false;
    let luaOffsetX = 0;
    let luaOffsetY = 0;

    luaElisa.addEventListener("pointerdown", function(evento) {
        luaArrastando = true;

        const rect = luaElisa.getBoundingClientRect();

        luaOffsetX = evento.clientX - rect.left;
        luaOffsetY = evento.clientY - rect.top;

        luaElisa.setPointerCapture(evento.pointerId);
    });

    luaElisa.addEventListener("pointermove", function(evento) {
        if (!luaArrastando) return;

        const inicio = document.getElementById("inicio");

        if (!inicio) return;

        const rectInicio = inicio.getBoundingClientRect();

        let novaEsquerda =
            evento.clientX - rectInicio.left - luaOffsetX;

        let novoTopo =
            evento.clientY - rectInicio.top - luaOffsetY;

        const limiteX = rectInicio.width - luaElisa.offsetWidth;
        const limiteY = rectInicio.height - luaElisa.offsetHeight;

        novaEsquerda = Math.max(0, Math.min(novaEsquerda, limiteX));
        novoTopo = Math.max(0, Math.min(novoTopo, limiteY));

        luaElisa.style.left = novaEsquerda + "px";
        luaElisa.style.top = novoTopo + "px";
    });

    function soltarLua() {
        luaArrastando = false;
    }

    luaElisa.addEventListener("pointerup", soltarLua);
    luaElisa.addEventListener("pointercancel", soltarLua);
}

document.querySelectorAll(".carrossel").forEach(function(carrossel) {

    let arrastando = false;
    let inicioX = 0;
    let scrollInicial = 0;

    carrossel.addEventListener("pointerdown", function(evento) {

        arrastando = true;
        inicioX = evento.clientX;
        scrollInicial = carrossel.scrollLeft;

        carrossel.setPointerCapture(evento.pointerId);

        evento.preventDefault();
    });

    carrossel.addEventListener("pointermove", function(evento) {

        if (!arrastando) return;

        const distancia = evento.clientX - inicioX;

        carrossel.scrollLeft =
            scrollInicial - distancia;
    });

    carrossel.addEventListener("pointerup", function(evento) {

        arrastando = false;

        try {
            carrossel.releasePointerCapture(evento.pointerId);
        } catch (e) {}
    });

    carrossel.addEventListener("pointercancel", function(evento) {

        arrastando = false;

        try {
            carrossel.releasePointerCapture(evento.pointerId);
        } catch (e) {}
    });
});

// =========================================
// CARTA INTERATIVA 💌
// =========================================

const envelope = document.getElementById("envelope");
const abaEnvelope = document.getElementById("abaEnvelope");
const papelCarta = document.getElementById("papelCarta");
const instrucaoCarta = document.getElementById("instrucaoCarta");

if (envelope && abaEnvelope && papelCarta) {

    // -----------------------------------------
    // 1. ARRASTAR A ABA DO ENVELOPE
    // -----------------------------------------

    let arrastandoAba = false;
    let inicioY = 0;

    abaEnvelope.addEventListener("pointerdown", function(evento) {

        if (envelope.classList.contains("carta-aberta")) {
            return;
        }

        arrastandoAba = true;
        inicioY = evento.clientY;

        abaEnvelope.setPointerCapture(evento.pointerId);

        evento.preventDefault();
    });

    abaEnvelope.addEventListener("pointermove", function(evento) {

        if (!arrastandoAba) {
            return;
        }

        const distancia = inicioY - evento.clientY;

        // Limita a abertura entre 0 e 180 graus
        const rotacao = Math.max(
            -180,
            Math.min(0, -distancia)
        );

        abaEnvelope.style.transform =
            "rotateX(" + rotacao + "deg)";

        // Depois de puxar suficientemente,
        // a carta aparece.
        if (distancia > 70) {

            envelope.classList.add("carta-disponivel");

            instrucaoCarta.textContent =
                "Agora arraste a carta para cima.";
        }
    });

    abaEnvelope.addEventListener("pointerup", function(evento) {

        arrastandoAba = false;

        if (envelope.classList.contains("carta-disponivel")) {

            abaEnvelope.style.transform =
                "rotateX(-180deg)";

        } else {

            abaEnvelope.style.transform =
                "rotateX(0deg)";
        }
    });

    abaEnvelope.addEventListener("pointercancel", function() {

        arrastandoAba = false;

        if (!envelope.classList.contains("carta-disponivel")) {

            abaEnvelope.style.transform =
                "rotateX(0deg)";
        }
    });

    // -----------------------------------------
    // 2. ARRASTAR O PAPEL PARA FORA
    // -----------------------------------------

    let arrastandoPapel = false;
    let papelInicioY = 0;

    papelCarta.addEventListener("pointerdown", function(evento) {

        if (
            !envelope.classList.contains("carta-disponivel") ||
            envelope.classList.contains("carta-aberta")
        ) {
            return;
        }

        arrastandoPapel = true;
        papelInicioY = evento.clientY;

        papelCarta.setPointerCapture(evento.pointerId);

        evento.preventDefault();
    });

    papelCarta.addEventListener("pointermove", function(evento) {

        if (!arrastandoPapel) {
            return;
        }

        const distancia = papelInicioY - evento.clientY;

        // Quanto a carta já saiu
        const subida = Math.max(
            0,
            Math.min(300, distancia)
        );

        // A carta acompanha o dedo
        const escala = 1 + (subida / 900);

        papelCarta.style.transform =
            "translateX(-50%) translateY(" +
            (-35 - subida) +
            "px) scale(" +
            escala +
            ")";

        // Puxou o suficiente → carta grande
        if (distancia > 180) {

            envelope.classList.add("carta-aberta");

            instrucaoCarta.textContent = "💌";

            arrastandoPapel = false;
        }
    });

    papelCarta.addEventListener("pointerup", function() {

        arrastandoPapel = false;

        if (!envelope.classList.contains("carta-aberta")) {

            papelCarta.style.transform =
                "translateX(-50%) translateY(-35px) scale(1)";
        }
    });

    papelCarta.addEventListener("pointercancel", function() {

        arrastandoPapel = false;

        if (!envelope.classList.contains("carta-aberta")) {

            papelCarta.style.transform =
                "translateX(-50%) translateY(-35px) scale(1)";
        }
    });
}

// =========================================
// BOTÃO — FECHAR CARTA 💌
// =========================================

const botaoFecharCarta = document.getElementById("botaoFecharCarta");

if (botaoFecharCarta) {

    botaoFecharCarta.addEventListener("click", function() {

        // Volta a carta para o envelope
        envelope.classList.remove("carta-aberta");

        // Volta o envelope para o estado fechado
        envelope.classList.remove("carta-disponivel");

        // Fecha a aba
        abaEnvelope.style.transform = "rotateX(0deg)";

        // Reseta a posição da folha
        papelCarta.style.transform =
            "translateX(-50%) translateY(0) scale(0.98)";

        // Volta a instrução original
        instrucaoCarta.textContent =
            "Arraste a aba do envelope para cima.";
    });

}