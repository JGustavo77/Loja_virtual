var larguraTela = window.innerWidth;
const produtos = document.getElementById('produtos');
var count = 0;

if (produtos) {

    var larguraBoxCard = document.querySelector('.box-card').clientWidth;
    var larguraVitrine = document.querySelector('.tela-produtos').clientWidth;
    var quantidadeClicks = 0;

    /*
    Só é necessário fazer 'produtos.style.transition = '1s all'' uma vez. 
    */
    produtos.style.transition = '1s all';

    /* 
    Esse variável é usada quando um usuário mobile clica pra abrir o menu,
    não estava sendo utilizada dentro da função menu(), realoquei ele para cá,
    além disso, agr ela é 'var' assim, trocarBotao() tem acesso a ela, caso 'botaoMenu' estivesse dentro de
    trocarBotao(), ele seria criada de novo e denovo.
    */
    var botaonMenu = document.getElementById('btnMenu');

    var vitrine;
    var padding;


    var quantidadeMaximaItens = produtos.children.length;
    var startX = 0;
    var endX = 0;

    if (larguraVitrine <= 450) {
        vitrine = 1;
        padding = 52;
    } else if (larguraVitrine > 450 && larguraVitrine <= 1150) {
        vitrine = 2;
        padding = 50;
    } else {
        vitrine = 3;
        padding = 50;
    }

    produtos.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    produtos.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        pegaDedo();
    });

    function pegaDedo() {
        const posicaoDedo = startX - endX;

        if (Math.abs(posicaoDedo) > 100 && posicaoDedo > 0) {
            next();
            return;
        }

        prev();
    }
}

function next() {
    console.log(quantidadeClicks);

    if (quantidadeClicks == 0) {
        quantidadeClicks++;

        produtos.style.transform = `translateX(${-quantidadeClicks * (larguraBoxCard + padding)}px)`;

        return;
    }

    if (quantidadeClicks >= 1 && quantidadeClicks < (quantidadeMaximaItens - vitrine)) {
        quantidadeClicks++;

        produtos.style.transform = `translateX(${-quantidadeClicks * (larguraBoxCard + padding)}px)`;

        return;
    }

    quantidadeClicks = 0;
    produtos.style.transform = `translateX(0px)`;

}

function prev() {
    if (quantidadeClicks == 0) {
        quantidadeClicks = (quantidadeMaximaItens - vitrine);


        produtos.style.transform = `translateX(-${(quantidadeClicks) * (larguraBoxCard + padding)}px)`;

        return;
    }

    if (quantidadeClicks == quantidadeMaximaItens) {
        quantidadeClicks = quantidadeMaximaItens;
        quantidadeClicks--;

        produtos.style.transform = `translateX(-${quantidadeClicks * (larguraBoxCard + padding)}px)`;

        return;
    }

    if (quantidadeClicks > 0 && quantidadeClicks <= (quantidadeMaximaItens)) {
        quantidadeClicks--;

        produtos.style.transform = `translateX(-${quantidadeClicks * (larguraBoxCard + padding)}px)`;

        return;
    }

    quantidadeClicks = 0;
    produtos.style.transform = `translateX(${quantidadeMaximaItens * larguraBoxCard}px))`;
}

function menu() {

    if (larguraTela <= 600) {

        const menu = document.getElementById('menu');
        const listaMenu = document.getElementById('listaMenu');

        if (count == 0) {
            count = 1;
            menu.style.width = '100%';
            menu.style.padding = '50px 20px';
            menu.style.transition = '2s';
            listaMenu.style.display = 'flex';
            trocarBotao(count);

            return;
        }

        if (count == 1) {
            count = 0;
            menu.style.width = '0';
            menu.style.padding = '0px 0px';
            menu.style.transition = '2s';
            trocarBotao(count);

            return;
        }

        return;
    }

    return;
}

function trocarBotao(count) {
    if (count == 1) {
        botaonMenu.src = '/public/imgs/icons/x.png';
    } else {
        botaonMenu.src = '/public/imgs/icons/arrow-right.png';
    }
}