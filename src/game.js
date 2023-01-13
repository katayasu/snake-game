let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let grid = 16;
let count = 0;
  
let snake = {
  x: 160,
  y: 160,
  
  // скорость змейки. перемещает на одну длину сетки каждый кадр в направлении x или y
  dx: grid,
  dy: 0,
  
  // отслеживать все сетки, которые занимает тело змейки
  cells: [],
  
  // длина змейки. увеличивается, при поедании яблока
  maxCells: 4
};

let apple = {
  x: 320,
  y: 320
};

// получить случайные целые числа в определенном диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// игровой цикл
function loop() {
  requestAnimationFrame(loop);

  // уменьшить скорость игры до 15 fps вместо 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // перемещать змейку по ее скорости
  snake.x += snake.dx;
  snake.y += snake.dy;

  // обернуть положение змейки по горизонтали на краю экрана
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // обернуть положение змейки вертикально на краю экрана
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // отслеживать, где была змея. перед массивом всегда голова
  snake.cells.unshift({x: snake.x, y: snake.y});

  // удаление клетки по мере удаления от неё
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // яблоко
  context.fillStyle = '#2c2c2c';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // клетка змейки
  context.fillStyle = '#2c2c2c';
  snake.cells.forEach(function(cell, index) {
    
    // рисование на 1 пиксель меньше сетки создает эффект сетки в теле змейки, чтобы вы могли видеть, насколько она длинная
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    // змейка съедает яблоко
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // canvas 400x400 т,е 25x25 клеток
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // проверить столкновение со всеми ячейками после этой 
    for (let i = index + 1; i < snake.cells.length; i++) {
      
      // змейка пересекает своё тело. перезапуск игры
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

// отслеживание нажатий клавиатуры для передвижения змейки
document.addEventListener('keydown', function(e) {

  // стрелка влево
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // стрелка вверх
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // стрелка вправо
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // стрелка вниз
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

const start = document.querySelector('#start');
const state = document.querySelector('#state');
start.addEventListener('click', () => {
  // начать игру
  requestAnimationFrame(loop); 
  if (requestAnimationFrame(loop)) {
    state.innerHTML = 'is on';
  }
});