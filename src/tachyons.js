module.exports = function(Crafty, WIDTH, HEIGHT, BORDER, SPAWN_BORDER, SIZE) {
  Crafty.c('Tachyon', {
    init: function() {
      this.requires('2D, DOM, Color');
      this.attr({w: SIZE, h: SIZE});
      this.z = 300;
    }
  });

  Crafty.c('WhiteTachyon', {
    _angle: 0,
    _speed: 0,

    init: function() {
      this.requires('Tachyon');
      this._movement = {
        x: 0,
        y: 0
      };
      this.color('white');
    },
    _enterFrame: function() {
      // remove far-gone particles
      if (this._x < -SPAWN_BORDER) {
        this.destroy();
        return;
      }
      if (this._x > WIDTH - this.w + SPAWN_BORDER) {
        this.destroy();
        return;
      }
      if (this._y < -SPAWN_BORDER) {
        this.destroy();
        return;
      }
      if (this._y > HEIGHT - this.h + SPAWN_BORDER) {
        this.destroy();
        return;
      }

      // move the rest
      this.x += this._movement.x;
      this.y += this._movement.y;
    },
    whiteTachyon: function(x, y, angle, speed) {
      this._angle = angle;
      this._speed = speed;
      this.x = x - Math.round(TACHYON_SIZE / 2);
      this.y = y - Math.round(TACHYON_SIZE / 2);
      this._movement.x = Math.cos(angle) * speed;
      this._movement.y = Math.sin(angle) * speed;
      this.origin('center');
      this.rotation = angle / (Math.PI / 180);
      this.bind('EnterFrame', this._enterFrame);
      return this;
    }
  });
};
