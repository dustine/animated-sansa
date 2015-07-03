module.exports = function(Crafty, BORDER) {
  var WIDTH = Crafty.stage.elem.width;
  var HEIGHT = Crafty.stage.elem.height;

  Crafty.c('CurrentAvatar', {
    init: function() {
      this.requires('Quark, Fourway, Persist');
      this._previousFrames = [];
      this.z = 1000;
      this.color('rgb(7, 124, 190)');
      this.fourway(4);
      this.onHit('Active', function() {
        this.color('red');
      }, function() {
        this.color('rgb(7, 124, 190)');
      });
      this.onHit('Tachyon', function(a) {
        console.log(a);
        Crafty.scene('Scratch');
      });
    }
  });

  var player = Crafty.e('CurrentAvatar');

  player.collision = function collision () {
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
  };

  // HACK: adding collision detection to keyboard controls
  player.unbind('EnterFrame', player._enterframe);
  player.bind('EnterFrame', function() {
    player._enterframe();
    if (!player.disableControls) {
      player.collision();
    }
  });

  return player;
};
