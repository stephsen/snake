var snake;
var apple;
var SnakeGame;

window.onload = function() {

  snakeGame = new SnakeGame(900, 600, 30, 300);
  snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "rigth");
  apple = new Apple([10, 10]);
  apple2 = new Apple([5, 15]);
  snakeGame.init(snake, apple, apple2);
}

document.onkeydown = function handleKeyDown(e) {
  var key = e.keyCode;
  var newDirection;
  switch(key) {
    case 37:
      newDirection = "left";
      break;
    case 38:
      newDirection = "up";
      break;
    case 39:
      newDirection = "rigth";
      break;
    case 40:
      newDirection = "down";
      break;
    case 32:
      snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "rigth");
      apple = new Apple([10, 10]);
      apple2 = new Apple([5, 15]);
      snakeGame.init(snake, apple, apple2);
      return
    default:
      return;
  }
  snakeGame.snake.setDirection(newDirection);
}

function SnakeGame(canvasWidth, canvasHeight, blockSize, delay) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = canvasWidth;
  this.canvas.height = canvasHeight;
  this.canvas.style.border = "30px solid gray";
  this.canvas.style.margin = "50px auto";
  this.canvas.style.display ="block";
  this.canvas.style.backgroundColor =  "#ddd";
  document.body.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.blockSize = blockSize;
  this.delay = delay;
  this.snake;
  this.apple;
  this.widthInBlocks = this.canvas.width / this.blockSize;
  this.heightInBlocks = this.canvas.height / this.blockSize;
  this.score;
  var instance = this;
  var timeout;

  this.init = function(snake, apple, apple2) {
    this.snake = snake;
    this.apple = apple;
    this.apple2 = apple2;
    this.score = 0;
    delay = 300;
    clearTimeout(timeout);
    refreshCanvas();
  };

  var refreshCanvas = function() {
      instance.snake.advance();
      if (instance.checkCollision()) {
        instance.gameOver();
      } else {
        if (instance.snake.isEatingApple(instance.apple) || instance.snake.isEatingApple(instance.apple2)) {
          instance.score ++;
          instance.snake.ateApple = true;
          if (instance.snake.countAteApple == 5) {
            if (delay !== 50) {
              delay = delay - 50;
            }
            instance.snake.countAteApple = 0;
          }
          if (instance.snake.isEatingApple(instance.apple)) {
            do
            {
              instance.apple.setNewPosition(instance.widthInBlocks, instance.heightInBlocks);
            }
            while (instance.apple.isOnSnake(instance.snake))
          } else {
            do
            {
              instance.apple2.setNewPosition(instance.widthInBlocks, instance.heightInBlocks);
            }
            while (instance.apple2.isOnSnake(instance.snake))
          }
        }
        instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
        instance.drawScore();
        timeout = setTimeout(refreshCanvas, delay);
        instance.snake.draw(instance.ctx, instance.blockSize);
        instance.apple.draw(instance.ctx, instance.blockSize);
        instance.apple2.draw(instance.ctx, instance.blockSize);
      }
    };

    this.checkCollision = function() {
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.snake.body[0];
      var rest = this.snake.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = this.widthInBlocks - 1;
      var maxY = this.heightInBlocks - 1;
      var isNotBetweenHorizontaleWalls = snakeX < minX || snakeX > maxX;
      var isNotBetweenVerticaleWalls = snakeY < minY || snakeY > maxY;

      if(isNotBetweenHorizontaleWalls || isNotBetweenVerticaleWalls) {
        wallCollision = true;
      }

      for (let i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };

    this.gameOver = function() {
      this.ctx.save();
      this.ctx.font = "bold 70px sans-serif";
      this.ctx.fillStyle = "#000";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = "5";
      var centreX = this.canvas.width / 2;
      var centreY = this.canvas.height / 2;
      this.ctx.strokeText("Game Over", centreX, centreY - 180);
      this.ctx.fillText("Game Over", centreX, centreY - 180);
      this.ctx.font = "bold 30px sans-serif";
      this.ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
      this.ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
      this.ctx.restore();
    };

    this.drawScore = function() {
      this.ctx.save();
      this.ctx.font = "bold 200px sans-serif";
      this.ctx.fillStyle = "gray";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      var centreX = this.canvas.width / 2;
      var centreY = this.canvas.height / 2;
      this.ctx.fillText(this.score.toString(), centreX, centreY);
      this.ctx.restore();
    };

}

function Snake(body, direction) {
  this.body = body;
  this.direction = direction;
  this.ateApple = false;
  this.countAteApple = 0;
  this.draw = function(ctx, blockSize) {
    ctx.save();
    ctx.fillStyle = "#ff0000";
    for (let i = 0; i < this.body.length; i++) {
      var x = this.body[i][0] * blockSize;
      var y = this.body[i][1] * blockSize;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
    ctx.restore();
  };

  this.advance = function() {
    var nextPosition = this.body[0].slice();
    switch(this.direction) {
      case "left":
      nextPosition[0] -= 1;
        break;
      case "rigth":
        nextPosition[0] += 1;
        break;
      case "down":
        nextPosition[1] += 1;
        break;
      case "up":
        nextPosition[1] -= 1;
        break;
      default:
        throw("Invalid direction");
    }
    this.body.unshift(nextPosition);
    if (!this.ateApple) {
      this.body.pop();
    } else {
      this.ateApple = false;
      this.countAteApple++;
    }
  };

  this.setDirection = function(newDirection) {
    var allowedDirection;
    switch (this.direction) {
      case "left":
      case "rigth":
        allowedDirection = ["up", "down"];
        break;
      case "down":
      case "up":
        allowedDirection = ["left", "rigth"];
        break;
      default:
        throw("Invalid direction");
    }
    if(allowedDirection.indexOf(newDirection) > -1) {
      this.direction = newDirection;
    }
  };

  this.isEatingApple = function(appleToEat) {
    var head = this.body[0];
    if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
      return true;
    } else {
      return false;
    }
  };
}

function Apple(position) {
  this.position = position;
  this.draw = function(ctx, blockSize) {
    ctx.save();
    ctx.fillStyle = "#33cc33";
    ctx.beginPath();
    var radius = blockSize/2;
    var x = this.position[0] * blockSize + radius;
    var y = this.position[1] * blockSize + radius;
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.restore();
  };
  this.setNewPosition = function(widthInBlocks, heightInBlocks) {
    var newX = Math.round(Math.random() * (widthInBlocks -1));
    var newY = Math.round(Math.random() * (heightInBlocks -1));
    this.position = [newX, newY];
  };
  this.isOnSnake = function(snakeToCkeck) {
    var isOnSnake = false;
    for (let i = 0; i < snakeToCkeck.body.length; i++) {
      if(this.position[0] === snakeToCkeck.body[i][0] && this.position[1] === snakeToCkeck.body[i][1]) {
        isOnSnake = true;
      }
    }
    return isOnSnake;
  }
}
