var Crafty = require('craftyjs');
var DEBUG = false;

/*
Exterior canvas setup
*/

$(function() {
  // initialize counters
  function addIntegerBorderRadius(length, i, elem) {
    i = length - i - 1;
    if (i % 3 === 0) {
      $(elem).addClass('-right');
    }
    if ((i + 1) % 3 === 0) {
      $(elem).addClass('-left');
    }
  }

  $('.counter.-separate').each(function(i, elem) {
    var $children = $(elem).children();
    var $digits = $children.filter('.digit');
    $digits.each(function(i, elem) {
      addIntegerBorderRadius($digits.length, i, elem);
    });
  });

  // initialize canvas
  var $container = $('.timeline');
  var display = $('#tb-display')[0];
  var hits = $('#tb-hits')[0];
  var progress = $('#tb-progress')[0];

  var CANVAS_WIDTH = $container.width();
  var CANVAS_HEIGHT = $container.parent().height() * 0.8;
  $container.height(CANVAS_HEIGHT);

  display.width = hits.width = progress.width = CANVAS_WIDTH;
  display.height = hits.height = progress.height = CANVAS_HEIGHT;
  var context = display.getContext('2d');

  context.lineWidth = 1;
  context.lineCap = 'round';
  context.strokeStyle = '#666';
  var maxDivider = 32;
  for (var divider = 2; divider <= maxDivider; divider *= 2) {
    for (var place = 1; place < divider; place++) {
      context.beginPath();
      context.moveTo(
        Math.round(CANVAS_WIDTH / divider * place) + 0.5,
        CANVAS_HEIGHT
      );
      var pointerLimit = Math.log(divider) / Math.log(maxDivider * maxDivider);
      context.lineTo(
        Math.round(CANVAS_WIDTH / divider * place) + 0.5,
        Math.round(CANVAS_HEIGHT * pointerLimit +
          CANVAS_HEIGHT * 1 / 4)
      );
      context.stroke();
    }
  }

  function updateTimebarHits(current, total, color) {
    color = color || 'red';
    var context = hits.getContext('2d');
    var x = Math.floor(hits.width * (current / total)) - 0.5;
    context.beginPath();
    var gradient = context.createLinearGradient(0, 0, 0, progress.height);
    gradient.addColorStop(0, 'rgb(121, 0, 0)');
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, 'rgb(121, 0, 0)');
    context.strokeStyle = gradient;
    context.lineWidth = 1;
    context.moveTo(x, 0);
    context.lineTo(x, Math.round(hits.height * 0.75));
    context.stroke();
  }

  function updateTimebarProgress(current, total, color) {
    // update bar
    color = color || 'cyan';
    var context = progress.getContext('2d');
    context.clearRect(0, 0, progress.width, progress.height);
    var gradient = context.createLinearGradient(0, 0, 0, progress.height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgb(0, 159, 181)');
    context.fillStyle = gradient;
    var length = Math.min(progress.width * (current / total), progress.width);
    context.fillRect(0, 0, length, progress.height);
  }

  function updateLoopCounters (attempts) {
    var digits = $('.loop-counter .digit')
      .toArray();
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
  }

  // # CONSTANTS
  // global consts
  var game = $('#animated-sansa');
  var WIDTH = game.width();
  var HEIGHT = game.height();
  var BORDER = 20;
  var SPAWN_BORDER = 100;

  // player constants
  var MAX_SPEED = 8;
  var PLAYER_RADIUS = 5;

  // tachyons constants
  var TACHYON_SIZE = 4;

  Crafty.init(WIDTH, HEIGHT, 'animated-sansa');

  // TODO(Dustine): Scenes
  Crafty.background('black');

  // # CUSTOM COMPONENTS

  Crafty.c('Quark', {
    init: function() {
      this.requires('2D, DOM, Color, Collision');
      this.attr({
        x: WIDTH / 2 - PLAYER_RADIUS,
        y: HEIGHT / 2 - PLAYER_RADIUS,
        w: PLAYER_RADIUS * 2,
        h: PLAYER_RADIUS * 2
      });
      this.css('border-radius', '100%');
      this.origin('center');
      this.collision(
        new Crafty.circle(PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_RADIUS)
      );
    }
  });

  require('./player')(Crafty, WIDTH, HEIGHT, MAX_SPEED, BORDER);
  require('./ghost')(Crafty);

  Crafty.c('Tachyon', {
    init: function() {
      this.requires('2D, DOM, Color');
      this.attr({w: TACHYON_SIZE, h: TACHYON_SIZE});
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

  Crafty.c('GameClock', {
    _dt: 0,
    _gameEnd: 0,
    init: function() {
      this.requires('2D');
    },
    _enterFrame: function(frame) {
      updateTimebarProgress(this._dt, this._gameEnd);
      this._dt += frame.dt;
    },
    gameClock: function(gameEnd) {
      this._gameEnd = gameEnd;
      this.bind('EnterFrame', this._enterFrame);
      return this;
    },
    reset: function() {
      this._dt = 0;
      return this;
    }
  });

  Crafty.c('Spawner', {
    _dt: 0,
    _gameEnd: 0,
    init: function() {
      this._deadFrames = 0;
      this._frames = [];
      this.requires('2D, Persist');
    },
    _enterFrame: function() {
      if (!this._frames[this._dt]) {
        this._frames[this._dt] = this._generate();
      }
      this._spawn(this._frames[this._dt++]);
    },
    _generate: function() {
      // TODO: Spawn the Tachyons outside the arena
      // TODO: Regulate the Tachyon spawning to worsen as the game goes on
      // TODO: More kinds of Tachyons
      var spawns = [];
      if (this._deadFrames++ < 4) {
        return spawns;
      }
      this._deadFrames = 0;
      var randomMax = Math.random() * 5 + 1;
      for (var i = 0; i < randomMax; i++) {
        spawns.push([
          Math.round(WIDTH / 2 + 2),
          Math.round(HEIGHT / 2 + 2),
          Math.random() * 2 * Math.PI,
          4
        ]);
      }
      return spawns;
    },
    _spawn: function(frame) {
      frame.forEach(function(elem) {
        // TODO: Add more Tachyon types here too
        Crafty.e('WhiteTachyon')
          .whiteTachyon(elem[0], elem[1], elem[2], elem[3]);
      });
    },
    spawner: function(gameEnd) {
      this._gameEnd = gameEnd;
      return this;
    },
    reset: function() {
      this._dt = 0;
      this.unbind('EnterFrame');
      return this;
    },
    start: function() {
      this.bind('EnterFrame', this._enterFrame);
      return this;
    }
  });

  var player = Crafty.e('Player');

  // mouse lock mechanism
  game.on('click', function() {
    this.requestPointerLock();
  });

  var lockOnce = true;
  function lockChange () {
    if (document.pointerLockElement === Crafty.stage.elem) {
      // enable mouse control, delayed to prevent sudden jump from
      //  accepting the pointer lock prompt
      if (!lockOnce) {
        return;
      }
      lockOnce = false;
      player.enableMouse();
    } else {
      // reset back to keyboard control
      lockOnce = true;
      player.enableKeyboard();
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

  // ## update outside GUI
  var loops = 1;
  var clock;
  var spawner;

  Crafty.scene('Start', function() {
    loops = 1;
    updateLoopCounters(loops++);
    setTimeout(function() {
      Crafty.scene('Loop');
    }, 2000);
  }, function() {
    spawner = Crafty.e('Spawner')
      // TODO: Make this a global constant
      .spawner(3 * 60 * 1000);
  });

  Crafty.scene('Loop', function() {
    if (DEBUG) {
      Crafty('Quark').each(function() {
        this.addComponent('WiredHitBox');
      });
    }
    // start player's recording
    player.one('ExitFrame', recordFirstFrame);
    player.bind('ExitFrame', record);
    // start the game clock
    clock = Crafty.e('GameClock')
      .gameClock(3 * 60 * 1000);
    // and play everyone else's recording
    Crafty.trigger('StartGhosts');
    // AAND start the spawn nonsence
    spawner.start();
  }, function() {
    // mark the hit
    // TODO Prevent access to internal variables
    updateTimebarHits(clock._dt, clock._gameEnd);
    clock.reset();
    // stop the spawner
    spawner.reset();
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
      Crafty.e('Ghost')
        .Ghost(firstFrame, previousFrames);
    }
  });

  Crafty.scene('Scratch', function() {
    updateLoopCounters(loops++);
    // set timeout for restart of ghosties
    setTimeout(function() {
      // TODO: wait for the first frame available ?
      Crafty.scene('Loop');
    }, 2000);
  });

  Crafty.scene('GameOver', function() {
    // Crafty.text
    Crafty('Quark').each(function() {
      this.destroy();
    });
    Crafty.e('2D, DOM, Text')
      .attr({x: 100, y: 100})
      .text('Game Over')
      .textColor('#ffffff')
      .textFont('Open Sans');
  });

  // # DEBUG
  // Debug commands
  if (DEBUG) {
    Crafty('Quark').each(function() {
      this.addComponent('WiredHitBox');
    });
    // player.addComponent('WiredHitBox');
    player.addComponent('Keyboard');
    player.bind('KeyDown', function(ke) {
      if (ke.key === Crafty.keys.R) {
        this.x = WIDTH / 2 - PLAYER_RADIUS;
        this.y = HEIGHT / 2 - PLAYER_RADIUS;
      } else if (ke.key === Crafty.keys.Q) {
        console.log(this.x, this.y);
      } else if (ke.key === Crafty.keys.C) {
        if (Crafty._current === 'Loop') {
          Crafty.scene('Scratch');
        }
      }
    });
  }

  // Start the game proper!
  Crafty.scene('Start');
});
