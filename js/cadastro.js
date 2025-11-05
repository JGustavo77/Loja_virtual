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
const numeroInput = document.getElementById("numero");
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
    small.style.display = "block";
    small.style.color = "red";
    input.style.borderColor = "red";
}

function limparErro(input) {
    const small = input.parentElement.querySelector(".error-message");
    small.innerText = "";
    input.style.borderColor = "";
}

form.addEventListener("input", function () {
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

    if (emailInput.value.trim() === "" || !validarEmail(emailInput.value)){
        mostrarErro(emailInput, "Por favor, insira um email válido.");
        valido = false;
    } else {
        limparErro(emailInput);
    }

    if (telefoneInput.value.trim() === "" || !validarTelefone(telefoneInput.value)){
        mostrarErro(telefoneInput, "Por favor, insira um telefone válido.");
        valido = false;
    } else {
        limparErro(telefoneInput);
    }

    if (dataNascimentoInput.value.trim() === "" || !validarDataNascimento(dataNascimentoInput.value)) {
        mostrarErro(dataNascimentoInput, "Por favor, insira uma data de nascimento válida.");
        valido = false;
    } else {
        limparErro(dataNascimentoInput);
    }
    if (numeroInput.value.trim() === "" || numeroInput.value > 100000) {
        mostrarErro(numeroInput, "Por favor, insira um número válido.");
        valido = false;
    } else {
        limparErro(numeroInput);
    }

    if (!validarSenha(senhaInput.value)) {
        mostrarErro(senhaInput, "A senha deve ter entre 8 e 14 caracteres, incluindo uma letra maiúscula e um número.");
        valido = false;
    } else {
        limparErro(senhaInput);
    }

    if (!confirmarSenha(senhaInput.value, confirmarSenhaInput.value)) {
        mostrarErro(confirmarSenhaInput, "As senhas não coincidem.");
        valido = false;
    } else {
        limparErro(confirmarSenhaInput);
    }

    if (!validarCPF(document.getElementById("cpf").value)) {
        mostrarErro(document.getElementById("cpf"), "CPF inválido.");
        valido = false;
    } else {
        limparErro(document.getElementById("cpf"));
    }


    if (valido) {
        console.log("Formulário válido e pronto para envio!");
    }

});

function validarEmail(email ) {
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padraoEmail.test(email);
}

function validarTelefone(telefone ){
    const padraoTelefone = /^\s*(\d{2}|\d{0})[-. ]?(\d{5}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/;
    return padraoTelefone.test(telefone);
}

function validarDataNascimento(dataNascimento) {
    const dataAtual = new Date();
    const dataNascimentoDate = new Date(dataNascimento);
    const idadeMinima = 18;
    const idade = dataAtual.getFullYear() - dataNascimentoDate.getFullYear();
    return idade >= idadeMinima;
}

function validarSenha(senha) {
    const padraoSenha = /^(?=.*[A-Z])(?=.*\d)\S{8,14}$/;
    return padraoSenha.test(senha);
}

function confirmarSenha(senha, confirmarSenha) {
    return senha === confirmarSenha;
}

/**
 * Valida um CPF (lógica simples baseada no seu script Python).
 * @param {string} cpf - O CPF para validar (pode estar formatado ou não).
 * @returns {boolean} - True se for válido, False se for inválido.
 */
function validarCPF(cpf) {
  
  // 1. Limpa o CPF, deixando apenas os números
  // (Equivalente ao seu 'numeros = [int(digito)...]' do Python)
  const cpfLimpo = cpf.replace(/\D/g, '');

  // 2. Verifica se o CPF tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    console.error("CPF deve ter 11 dígitos.");
    return false;
  }

  // 3. Verifica CPFs inválidos conhecidos (todos os dígitos iguais)
  // O seu script Python não tinha isso, mas é uma melhoria simples e importante!
  if (/^(\d)\1+$/.test(cpfLimpo)) {
    console.error("CPF com todos os dígitos iguais é inválido.");
    return false;
  }

  // --- 4. Cálculo do Primeiro Dígito Verificador (DV1) ---
  
  // O seu Python usou: sum(a*b for a, b in zip(numeros[0:9], range(10, 1, -1)))
  // Em JS, um loop 'for' é o jeito mais simples de fazer isso:
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    // Multiplica os 9 primeiros dígitos pela sequência (10, 9, 8, ..., 2)
    soma += parseInt(cpfLimpo[i]) * (10 - i);
  }

  // O seu Python fez: (soma_produtos * 10 % 11) % 10
  // Vamos fazer de um jeito um pouco mais "passo a passo" para entender:
  let resto = (soma * 10) % 11;
  
  // Se o resto for 10 ou 11, ele vira 0
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  
  const dv1 = resto;

  // 5. Verifica se o DV1 é válido
  if (dv1 !== parseInt(cpfLimpo[9])) {
    console.error("Primeiro dígito verificador está incorreto.");
    return false;
  }

  // --- 6. Cálculo do Segundo Dígito Verificador (DV2) ---
  
  // Reinicia a soma para calcular o segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    // Agora multiplica os 10 primeiros dígitos (incluindo o DV1)
    // pela sequência (11, 10, 9, ..., 2)
    soma += parseInt(cpfLimpo[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  const dv2 = resto;

  // 7. Verifica se o DV2 é válido
  if (dv2 !== parseInt(cpfLimpo[10])) {
    console.error("Segundo dígito verificador está incorreto.");
    return false;
  }

  // Se passou por todas as verificações, o CPF é válido!
  console.log(`O CPF ${cpf} é VÁLIDO.`);
  return true;
}


