const produtos = document.getElementById('teste');
const widthBoxCard = document.querySelector('.box-card').clientWidth;
const widthProduto = document.querySelector('.tela-produtos').clientWidth;
// let widthBox = widthBoxCard;
let clicksNext = 0;
let clicksPrev = 0;
let maxBoxItems = produtos.children.length;

function next(){
    if(clicksNext == 0){
        clicksNext++;
        console.log(widthBoxCard);
        produtos.style.transform = `translateX(${-clicksNext * (widthBoxCard)}px)`;
        produtos.style.transition = '1s all';
    }else if(clicksNext >= 1 && clicksNext < maxBoxItems - 1){
        clicksNext++;
        console.log(widthBoxCard);
        produtos.style.transform = `translateX(${-clicksNext * (widthBoxCard + 50)}px)`;
        produtos.style.transition = '1s all';
    }else{
        clicks = 0;
        // widthBox = widthBoxCard;
        produtos.style.transform = `translateX(0px)`;
    }
}

function prev(){
    
}



