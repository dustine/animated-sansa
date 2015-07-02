var Crafty = require('craftyjs');
this.debug = true;

// # CONSTANTS
// global consts
var game = $('#animated-sansa');
var WIDTH = game.width();
var HEIGHT = game.height();
var BORDER = 20;

// player constants
var MAX_SPEED = 8;
var RADIUS = 5;

Crafty.init(WIDTH, HEIGHT, 'animated-sansa');

// TODO(Dustine): Scenes
Crafty.background('rgb(0,0,0)');

// # CUSTOM COMPONENTS
// mouse control
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

Crafty.c('Quark', {
  init: function() {
    this.requires('2D, DOM, Color, Collision');
    this.attr({x: WIDTH / 2 - RADIUS, y: HEIGHT / 2 - RADIUS, w: RADIUS * 2,
      h: RADIUS * 2});
    this.css('border-radius', '100%');
    this.origin('center');
    // TODO: Uncomment this, as linter throws a hissy fit about it
    // this.collision(new Crafty.circle(this._x / 2, this._y / 2, RADIUS))
  }
});

// # GAME ENTITIES
// Player particle
Crafty.c('CurrentAvatar', {
  init: function() {
    this.requires('Quark, Fourway, Persist');
    this._previousFrames = [];
    this.z = 1000;
  }
});

var player = Crafty.e('CurrentAvatar')
  .color('rgb(7, 124, 190)')
  .fourway(4)
  .onHit('Active', function() {
    this.color('red');
  }, function() {
    this.color('rgb(7, 124, 190)');
  });

// # DEBUG
// Debug commands
if (this.debug) {
  // player.addComponent('WiredHitBox')
  player.addComponent('Keyboard');
  player.bind('KeyDown', function(ke) {
    if (ke.key === Crafty.keys.R) {
      this.x = WIDTH / 2 - RADIUS;
      this.y = HEIGHT / 2 - RADIUS;
    } else if (ke.key === Crafty.keys.Q) {
      console.log(this.x, this.y);
    } else if (ke.key === Crafty.keys.C) {
      if (Crafty._current === 'Loop') {
        Crafty.scene('Scratch');
      }
    }
  });
}

// ## Mouse movements
function collision () {
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
}

// HACK: adding collision detection to keyboard controls
player.unbind('EnterFrame', player._enterframe);
player.bind('EnterFrame', function() {
  player._enterframe();
  if (!player.disableControls) {
    collision.apply(player);
  }
});

// mouse lock mechanism
game.on('click', function() {
  this.requestPointerLock();
});

var lockOnce = true;
function lockChange () {
  // TODO Only bind the EnterFrame once, it's doing every time we click
  if (document.pointerLockElement === Crafty.stage.elem) {
    // enable mouse control, delayed to prevent sudden jump from
    //  accepting the pointer lock prompt
    if (!lockOnce) {
      return;
    }
    lockOnce = false;
    player.disableControl(); // only disables Fourway
    setTimeout(function() {
      player.addComponent('PointerWay')
        .pointerway(MAX_SPEED)
        .callback(collision);
    }, 50);
  } else {
    // reset back to keyboard control
    lockOnce = true;
    player.removeComponent('PointerWay');
    player.enableControl();
  }
}

// TODO(Dustine): Remove or rework this later
function lockError () {
}

$(document).on('pointerlockchange', lockChange);
$(document).on('pointerlockerror', lockError);

// ## Recording location
function recordFirstFrame (frame) {
  this._firstFrame = frame.frame;
}

function record (frame) {
  this._previousFrames[frame.frame] = {
      // dt: frame.dt,
      x: this.x,
      y: this.y
    };
}

Crafty.c('GhostAvatar', {
  _f: 0,
  init: function() {
    this.requires('Quark, Persist');
    this.color('grey');
    this.bind('ResetGhosts', this.reset);
    this.bind('StartGhosts', this.start);
  },
  _init: function() {
    this._f = this._firstFrame;
    this.x = this._previousFrames[this._firstFrame].x;
    this.y = this._previousFrames[this._firstFrame].y;
  },
  ghostAvatar: function(firstFrame, previousFrames) {
    this._firstFrame = firstFrame;
    this._previousFrames = previousFrames;
    this._init();
  },
  reset: function() {
    this.removeComponent('Active');
    this.color('grey');
    this._init();
  },
  start: function() {
    this.addComponent('Active');
  }
});

Crafty.c('Active', {
  init: function() {
    this.requires('GhostAvatar');
    this.color('rgb(209, 210, 167)');
    this.bind('EnterFrame', this._enterFrame);
    this.one('EndPlayback', this._endRecording);
  },
  remove: function() {
    this.unbind('EnterFrame', this._enterFrame);
    this.unbind('EndPlayback', this._endRecording);
  },
  // TODO: Separate Active logic from GhostAvatar
  _endRecording: function() {
    this.color('rgb(117, 27, 192)');
    this.removeComponent('Active'); // seppuku
  },
  _enterFrame: function() {
    if (this._f >= this._previousFrames.length) {
      this.trigger('EndPlayback');
      return;
    }
    var pos = this._previousFrames[this._f++];
    this.x = pos.x;
    this.y = pos.y;
  }
});

// ## update outside GUI
var loops = 1;

function updateLoopCounters (attempts) {
  $('.loop-counter').each(function(i, element) {
    var digits = $(element).children('.digit').toArray();
    attempts = attempts.toString();
    for (; attempts.length < 4 ;) {
      attempts = '0' + attempts;
    }
    if (attempts.length > 4) {
      attempts = '10k+';
    }
    for (var l = 0; l < 4; ++l) {
      digits[l].innerHTML = attempts[l];
    }
  });
}

Crafty.scene('Scratch', function() {
  updateLoopCounters(loops++);
  // set timeout for restart of ghosties
  setTimeout(function() {
    // TODO: wait for the first frame available ?
    Crafty.scene('Loop');
  }, 2000);
});

Crafty.scene('Loop', function() {
  // start player's recording
  player.one('ExitFrame', recordFirstFrame);
  player.bind('ExitFrame', record);

  // and play everyone else's recording
  Crafty.trigger('StartGhosts');
}, function() {

  // stop recording
  player.unbind('ExitFrame', record);
  // save current run's values
  var firstFrame = player._firstFrame || 0;
  var previousFrames = player._previousFrames || [];
  // reset player
  player._previousFrames = [];
  // restart old ghosts
  Crafty.trigger('ResetGhosts');
  // ready the new ghost
  if (previousFrames.length !== 0) {
    Crafty.e('GhostAvatar')
      .ghostAvatar(firstFrame, previousFrames);
  }
});

Crafty.scene('GameOver', function() {
  // Crafty.text
});

Crafty.scene('Scratch');
