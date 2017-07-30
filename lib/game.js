const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Ship = require('./ship.js');
const Util = require('./utils.js')

class Game {
  constructor(num_asteroids) {
    this.num_asteroids = num_asteroids;
    this.DIM_X = window.innerWidth;
    this.DIM_Y = window.innerHeight;
    this.asteroids = this.addAsteroids();
    this.bullets = [];
    let new_ship = new Ship({ pos: this.randomPosition(), game: this });
    this.ships = [new_ship];
    this.createImage();
  }

  createImage() {
    const img = new Image();
    img.onload = () => {
      this.img = img;
    }
    img.src = 'https://static.pexels.com/photos/110854/pexels-photo-110854.jpeg';
  }

  addAsteroids() {
    const asteroids = [];
    for (let i = 0; i < this.num_asteroids; i++) {
      const asteroid = new Asteroid({ pos: this.randomPosition(), game: this });
      asteroids.push(asteroid);
    }

    return asteroids;
  };

  randomPosition() {
    return [Math.random() * this.DIM_X, Math.random() * this.DIM_Y];
  };

  draw(ctx) {
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    ctx.drawImage(this.img, 0, 0, this.DIM_X, this.DIM_Y);
    this.allObjects().forEach(obj => obj.draw(ctx));
  };

  moveObjects() {
    this.allObjects().forEach(obj => obj.move());
  };

  wrap(pos) {
    return [
      Util.wrap(pos[0], this.DIM_X), Util.wrap(pos[1], this.DIM_Y)
    ];
  };

  checkCollisions() {
    const objects = this.allObjects();

    for (let i = 0; i < objects.length - 1; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        if (objects[i].isCollidedWith(objects[j])) {
          objects[i].collideWith(objects[j]);
        }
      }
    }
  };

  step() {
    this.moveObjects();
    this.checkCollisions();
  };

  remove(obj) {
    if (obj instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(obj), 1);
    } else if (obj instanceof Asteroid) {
      this.asteroids.splice(this.asteroids.indexOf(obj), 1);
    } else if (obj instanceof Ship) {
      this.ships.splice(this.ships.indexOf(obj), 1);
    }
  };

  allObjects() {
    return [...this.asteroids, ...this.bullets, ...this.ships];
  };

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[0] > this.DIM_X) || (pos[1] < 0) || (pos[1] > this.DIM_Y);
  }
}

module.exports = Game;
