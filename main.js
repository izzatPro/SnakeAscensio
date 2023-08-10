//Нужно было разбить по модулям код, для лучшей читаемости, но в тз была строгая структура файлов
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

//Объект по увелечению змейки
class Snake{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

}

// Нажатие клавиш
const KEY_UP = 38 ;
const KEY_DOWN = 40;
const KEY_RIGHT = 39;
const KEY_LEFT = 37 ;
//Координаты по каким осям он сейчас двигается
const keyMap = {
    38: { x: 0, y: -1 }, // up
    40: { x: 0, y: 1 },  // down
    37: { x: -1, y: 0 }, // left
    39: { x: 1, y: 0 }   // right
};


let speed = 7;

let tileCount = 20;
let tileSize = (canvas.width / tileCount);
//Положение головы по X Y
let headX = 10;
let headY = 10;
//Наши хвосты
const snakeParts = [];

//длина начальной змейки
let tailLength = 2;


//Шаг по X Y по нажатию на каливиши.
let xStep = 0;
let yStep = 0;

//Положение нашей еды
let appleX = 5;
let appleY = 5;

//Очки славы
let score = 0;


function startGame(){
    changeSnakePosition();
    //Если игра закончилась, то остальные функции можно не запускать
    let result = isGameOver();
    if (result) {return};
    clearScreen();
    checkIntersection();
    startApple();
    startSnake();
    startScore();
    setTimeout(startGame, 1000/ speed);
}



    //Функционал по стене и кусанию сея

function isGameOver() {
    if (yStep === 0 && xStep === 0) {
        return false;
    }

    const hitLeftWall = headX < 0;
    const hitRightWall = headX === tileCount;
    const hitTopWall = headY < 0;
    const hitBottomWall = headY === tileCount;

    const hitItself = snakeParts.some(part => part.x === headX && part.y === headY);

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitItself) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';
        ctx.fillText('Game Over', canvas.width / 5.6, canvas.height / 2);
        return true;
    }

    return false;
}




//Добавляем очко кода едим яблоко на экран
function startScore(){
    ctx.fillStyle = 'white';
    ctx.font = '10px';
    ctx.fillText("Score " + score, 10, 20);
}


//Очистка экрана
function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

}



//Изначальное положение змейки
function startSnake(){

    //создаем продолжение змейки
    ctx.fillStyle = 'green';
    for(let i = 0 ; i < snakeParts.length ; i++){
        //В массив объектов
        let part = snakeParts[i];
        //Добавляет части тело в нужное место
        // console.log(part.x);
        ctx.fillRect(part.x * tileCount, part.y * tileCount,tileSize, tileSize)
    }

    //Так же инициализирует новый объект т.е квадраик для массива snakeParts
    snakeParts.push(new Snake(headX, headY)); //Увеличивает каждую 1000/ speed, на один квадратик
    if(snakeParts.length > tailLength){
        snakeParts.shift(); // Удаляет хвост, если он не подходит под условие, текущей длины хвоста.
    }
    //Ставим голову в начало, а то наши хвосты голову прикрывают
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize );
    
    // console.log(snakeParts);

}




function checkIntersection(){
    //Если съест, мы должны и яблоко убрать и змейку увеличить
    if(appleX == headX && appleY == headY){
        //Убираем яблоко и вставляем в другое место
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        //Увеличиваем, потому что он съел яблоко
        tailLength++;
        //Когда съел яблоко увеличиваем очко
        score++;
    }
}

//Движение на одну ячейку, взависимости от нажатой кнопки
function changeSnakePosition(){
    headX = headX + xStep;
    headY = headY + yStep;
}


function startApple(){
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount,  appleY * tileCount, tileSize,tileSize)
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    const direction = keyMap[event.keyCode];
    if (direction) {
        if (xStep !== -direction.x) xStep = direction.x;
        if (yStep !== -direction.y) yStep = direction.y;
    }
}

startGame();