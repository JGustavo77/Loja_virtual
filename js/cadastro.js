async function carregarEstados() {
    const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        const selectEstado = document.getElementById("estado");

        dados.sort((a,b) => a.nome.localeCompare(b.nome));

        dados.forEach(estado => {
            const option = document.createElement("option");
            option.value = estado.sigla;
            option.textContent = estado.nome;
            selectEstado.appendChild(option);
        });

    } catch (erro) {
        console.log("Erro ao carregar estados: ", erro);
    }
}

async function carregarCidades(uf) {
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const selectCidade = document.getElementById("cidade");

        selectCidade.innerHTML = '<option value="">Selecione a cidade</option>';

        dados.sort((a,b) => a.nome.localeCompare(b.nome));

        dados.forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            selectCidade.appendChild(option);
        });

    } catch (erro) {
        console.log("Erro ao carregar cidades: ", erro);
    }
}

document.getElementById("estado").addEventListener("change", function() {
    const uf = this.value;

    if (uf) {
        carregarCidades(uf);
    } else {
        document.getElementById("cidade").innerHTML = '<option value="">Selecione a cidade</option>';
    }
});

carregarEstados();

// Controle para evitar chamadas/alerts repetidos para o mesmo CEP
let isFetchingCep = false;
const cepErroCache = new Set(); // guarda CEPs que retornaram erro para evitar alert repetido

async function buscarCEP() {
    const cep = document.getElementById("cep").value.replace(/\D/g, '');

    if (cep.length !== 8) return;

    // Se já tivemos erro para esse CEP, não insista novamente
    if (cepErroCache.has(cep)) return;

    // Evita chamadas concorrentes
    if (isFetchingCep) return;
    isFetchingCep = true;

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.erro) {
            // marca esse CEP como inválido para evitar alertas repetidos
            cepErroCache.add(cep);
            alert("CEP não encontrado");
            return; 
        }

        document.getElementById("endereco").value = dados.logradouro || "";
        document.getElementById("bairro").value = dados.bairro || "";
        document.getElementById("estado").value = dados.uf || "";

        if (dados.uf) {
            await carregarCidades(dados.uf);
            document.getElementById("cidade").value = dados.localidade || "";
        }

    } catch (erro) {
        console.log("Erro ao buscar CEP:", erro);
    } finally {
        // garante que a flag seja limpa mesmo em erro
        isFetchingCep = false;
    }
}

const cepInput = document.getElementById("cep");
if (cepInput) {
    cepInput.addEventListener("blur", buscarCEP);

    cepInput.addEventListener("input", function () {
        const onlyDigits = this.value.replace(/\D/g, '');
        if (onlyDigits.length === 8) {
            buscarCEP();
        }
    });
}

const form = document.getElementById("form-cadastro");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const telefoneInput = document.getElementById("telefone");
const dataNascimentoInput = document.getElementById("data-nascimento");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmar-senha");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Formulário tentou enviar, validando...");
});


function mostrarErro(input, mensagem) {
    const small = input.parentElement.querySelector(".error-message");
    small.innerText = mensagem;
    small.style.color = "red";
    input.style.borderColor = "red";
}

function limparErro(input) {
    const small = input.parentElement.querySelector(".error-message");
    small.innerText = "";
    input.style.borderColor = "";
}

form.addEventListener("input", function () {
    // listener de input não precisa de preventDefault; apenas valida os campos em tempo real
    let valido = true;

    if (nomeInput && (nomeInput.value.trim() === "" || nomeInput.value.length < 6 )){
        mostrarErro(nomeInput, "Por favor, insira seu nome completo.");
        valido = false;
    } else if (nomeInput) {
        limparErro(nomeInput);
    }

    if (valido){
        console.log("Formulário válido e pronto para envio!");
    }
});

