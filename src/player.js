module.exports = function(Crafty, WIDTH, HEIGHT, MAX_SPEED, BORDER) {
  Crafty.c('PointerWay', {
    init: function() {
      var _this = this;
      this._mouseMovement = {
        x: 0,
        y: 0
      };
      this._speed = {
        x: 0,
        y: 0
      };
      this._mouseMoveAtPointerLock = function(mouseEvent) {
        _this._mouseMovement.x += mouseEvent.movementX;
        _this._mouseMovement.y += mouseEvent.movementY;
      };
      Crafty.addEvent(Crafty.stage.elem, Crafty.stage.elem, 'mousemove',
        this._mouseMoveAtPointerLock);
    },

    remove: function() {
      this.unbind('EnterFrame', this._enterFrame);
      Crafty.removeEvent(Crafty.stage.elem, Crafty.stage.elem, 'mousemove',
        this._mouseMoveAtPointerLock);
    },

    _enterFrame: function() {
      var movX = this._mouseMovement.x;
      var movY = this._mouseMovement.y;
      this._mouseMovement.x = this._mouseMovement.y = 0;
      if (Math.abs(movX) > MAX_SPEED || Math.abs(movY) > MAX_SPEED) {
        var newMovX;
        var newMovY;
        if (Math.abs(movX) > Math.abs(movY)) {
          newMovX = Math.sign(movX) * MAX_SPEED;
          newMovY = movY * (MAX_SPEED / Math.abs(movX));
        } else {
          newMovY = Math.sign(movY) * MAX_SPEED;
          newMovX = movX * (MAX_SPEED / Math.abs(movY));
        }
        movX = Math.round(newMovX);
        movY = Math.round(newMovY);
      }

      this.x += movX;
      this.y += movY;

      if (this._callback) {
        this._callback();
      }
    },

    callback: function(f) {
      console.log('registering callback', this, f);
      if (typeof f === 'function') {
        this._callback = f.bind(this);
      }

      return this;
    },

    speed: function(speed) {
      if (speed.x !== undefined && speed.y !== undefined) {
        this._speed.x = speed.x;
        this._speed.y = speed.y;
      } else {
        this._speed.x = speed;
        this._speed.y = speed;
      }
      return this;
    },
    pointerway: function(speed) {
      this.speed(speed);
      this.bind('EnterFrame', this._enterFrame);
      return this;
    }
  });

  Crafty.c('Player', {
    init: function() {
      this.requires('Quark, Fourway, Persist');
      this._previousFrames = [];
      this.z = 1000;
      this.color('rgb(7, 124, 190)');
      this.fourway(4);
      this.onHit('Active', function() {
        //   this.color('red');
        // }, function() {
        //   this.color('rgb(7, 124, 190)');
        // });
        Crafty.scene('GameOver');
      });
      this.onHit('Tachyon', function(hitInfo) {
        hitInfo.forEach(function(elem) {
          elem.obj.destroy();
        });
        Crafty.scene('Scratch');
      });

      // HACK: adding collision detection to keyboard controls
      this.unbind('EnterFrame', this._enterframe);
      this.bind('EnterFrame', function() {
        this._enterframe();
        if (!this.disableControls) {
          this._collision();
        }
      });
    },
    _collision: function() {
      if (this._x < BORDER) {
        this.x = BORDER;
      } else if (this._x > WIDTH - this.w - BORDER) {
        this.x = WIDTH - this.w - BORDER;
      }

      if (this._y < BORDER) {
        this.y = BORDER;
      } else if (this._y > HEIGHT - this.h - BORDER) {
        this.y = HEIGHT - this.h - BORDER;
      }
    },
    enableKeyboard: function() {
      this.removeComponent('PointerWay');
      this.enableControl();
    },
    enableMouse: function() {
      // only disables Fourway
      var _this = this;
      this.disableControl();
      setTimeout(function() {
        _this.addComponent('PointerWay')
          .pointerway(MAX_SPEED)
          .callback(_this._collision);
      }, 50);
    }
  });
};
