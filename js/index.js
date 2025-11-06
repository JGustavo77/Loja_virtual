const produtos = document.getElementById('teste');
const widthBoxCard = document.querySelector('.box-card').clientWidth;
const widthProduto = document.querySelector('.tela-produtos').clientWidth;
let quantidadeClicks = 0;
let maxBoxItems = produtos.children.length;

function next() {
    console.log("chamando next()");
    if (quantidadeClicks == 0) {
        quantidadeClicks++;
        console.log("Primeiro click (next): " + quantidadeClicks);
        produtos.style.transform = `translateX(${-quantidadeClicks * widthBoxCard}px)`;
        produtos.style.transition = '0.5s all';

    } else if (quantidadeClicks >= 1 && quantidadeClicks < (maxBoxItems - 1)) {
        quantidadeClicks++;
        console.log("Click de nº: " + quantidadeClicks);
        produtos.style.transform = `translateX(${-quantidadeClicks * (widthBoxCard + 50)}px)`;
        produtos.style.transition = '1s all';
    } else {
        quantidadeClicks = 0;
        produtos.style.transform = `translateX(0px)`;
    }
    atualizar(quantidadeClicks + 1);
}

function prev() {
    console.log("chamando prev()");
    if (quantidadeClicks == 0) {
        produtos.style.transform = `translateX(0px)`;
    } else if (quantidadeClicks == 1) {
        quantidadeClicks--;
        console.log("Click de nº: " + quantidadeClicks);
        produtos.style.transform = `translateX(0px)`;
        produtos.style.transition = '1s all';
    } else {
        quantidadeClicks--;
        console.log("Click de nº: " + quantidadeClicks);
        produtos.style.transform = `translateX(${-quantidadeClicks * (widthBoxCard + 50)}px)`;
        produtos.style.transition = '1s all';
    }
    atualizar(quantidadeClicks + 1);

}

function atualizar(n) {
    const p = document.getElementById("contador-produtos");

    p.textContent = `${n}/${maxBoxItems}`
}