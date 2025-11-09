function getYear() {
    const anoAtual = new Date().getFullYear();
    const spandAno = document.getElementById("current-year");

    if (spandAno) {
        spandAno.textContent = anoAtual;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getYear();

    const form = document.getElementById("form-cadastro");
    const nomeDoProduto = document.getElementById("nomeProduto");
    const precoDoProduto = document.getElementById("precoProduto");
    const quantidadeDoProduto = document.getElementById("quantidadeProduto");
    const descricaoDoProduto = document.getElementById("descricaoProduto");

    if (!form) {
        console.error("Form não encontrado: verifique id='form-cadastro' no HTML.");
        return;
    }

    function ensureErrorElement(input) {
        if (!input) {
            return null;
        }

        let smallElement = input.parentElement && input.parentElement.querySelector(".error-message");

        if (!smallElement && input.parentElement) {
            smallElement = document.createElement("small");
            smallElement.className = "error-message";
            smallElement.style.display = "none";
            input.parentElement.appendChild(smallElement);
        }

        return smallElement;
    }

    function addInputErrorClass(input) {
        input.classList.add("input-error");
    }

    function removeInputErrorClass(input) {
        input.classList.remove("input-error");
    }

    function mostrarErro(input, mensagem) {
        if (!input) {
            return;
        }

        const smallElement = ensureErrorElement(input);

        if (smallElement) {
            smallElement.innerText = mensagem;
            smallElement.style.display = "block";
            smallElement.style.color = "red";
        }

        addInputErrorClass(input);
    }

    function limparErro(input) {
        if (!input) {
            return;

        }

        const smallElement = input.parentElement && input.parentElement.querySelector(".error-message");

        if (smallElement) {
            smallElement.innerText = "";
            smallElement.style.display = "none";
        }
        removeInputErrorClass(input);
    }

    function validarNomeProduto(nome) {
        const padraoNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{6,}$/;
        return padraoNome.test(nome);
    }

    function parsePrecoToFloat(raw) {
        if (typeof raw !== "string") {
            raw = String(raw || "");
        }

        const limpo = raw.replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
        const n = parseFloat(limpo);

        return isNaN(n) ? null : n;
    }

    function validarPrecoProduto(precoRaw) {
        const valor = parsePrecoToFloat(precoRaw);

        return valor !== null && valor >= 5.0 && valor <= 1000.0;
    }

    function validarQuantidadeEstoque(quantidadeRaw) {
        const quantidade = parseInt(quantidadeRaw, 10);

        return !isNaN(quantidade) && quantidade > 0 && quantidade <= 1000;
    }

    function validarDescricao(descricao) {
        const tamanho = (descricao || "").length;

        return tamanho >= 20 && tamanho <= 3000;
    }
    function temValor(input) {
        return !!input?.value?.trim();
    }

    form.addEventListener("input", () => {
        const nome = nomeDoProduto?.value.trim();
        const preco = precoDoProduto?.value.trim();
        const quantidade = quantidadeDoProduto?.value.trim();
        const descricao = descricaoDoProduto?.value.trim();

        if (nomeDoProduto) {
            if (temValor(nomeDoProduto) && !validarNomeProduto(nome)) {
                mostrarErro(nomeDoProduto, "Por favor, insira um nome válido (mínimo 6 letras).");
            } else {
                limparErro(nomeDoProduto);
            }
        }

        if (precoDoProduto) {
            if (temValor(precoDoProduto) && !validarPrecoProduto(preco)) {
                mostrarErro(precoDoProduto, "O preço deve estar entre R$ 5,00 e R$ 1000,00.");
            } else {
                limparErro(precoDoProduto);
            }
        }

        if (quantidadeDoProduto) {
            if (temValor(quantidadeDoProduto) && !validarQuantidadeEstoque(quantidade)) {
                mostrarErro(quantidadeDoProduto, "A quantidade deve estar entre 1 e 1000 unidades.");
            } else {
                limparErro(quantidadeDoProduto);
            }
        }

        if (descricaoDoProduto) {
            if (temValor(descricaoDoProduto) && !validarDescricao(descricao)) {
                mostrarErro(descricaoDoProduto, "A descrição deve ter entre 20 e 3000 caracteres.");
            } else {
                limparErro(descricaoDoProduto);
            }
        }
    });

    form.addEventListener("submit", (e) => {
        const tudoValido = existeErro

        if (!tudoValido) {
            e.preventDefault();
            if (nomeDoProduto && !validarNomeProduto(nome)) mostrarErro(nomeDoProduto, "Nome inválido.");
            if (precoDoProduto && !validarPrecoProduto(preco)) mostrarErro(precoDoProduto, "Preço inválido.");
            if (quantidadeDoProduto && !validarQuantidadeEstoque(quantidade)) mostrarErro(quantidadeDoProduto, "Quantidade inválida.");
            if (descricaoDoProduto && !validarDescricao(descricao)) mostrarErro(descricaoDoProduto, "Descrição inválida.");
            alert("Corrija os campos destacados antes de enviar.");
        }

    });
});
