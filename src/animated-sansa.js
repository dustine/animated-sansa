var Crafty = require('craftyjs')
// var $ = require('jquery')
var $ = window.$

this.debug = true

// # CONSTANTS
// global consts
var WIDTH = 600
var HEIGHT = 400
var BORDER = 20

// player constants
var MAX_SPEED = 8
var RADIUS = 5

Crafty.init(WIDTH, HEIGHT, 'game')
// TODO(Dustine): Scenes
Crafty.background('rgb(0,0,0)')

// # CUSTOM COMPONENTS
// mouse control
Crafty.c('PointerWay', {
  init: function () {
    var that = this
    this._mouseMovement = {
      x: 0,
      y: 0
    }
    this._speed = {
      x: 0,
      y: 0
    }
    this._mouseMoveAtPointerLock = function (mouseEvent) {
      that._mouseMovement.x += mouseEvent.movementX
      that._mouseMovement.y += mouseEvent.movementY
    }
    Crafty.addEvent(Crafty.stage.elem, Crafty.stage.elem, 'mousemove', this._mouseMoveAtPointerLock)
  },
  remove: function () {
    this.unbind('EnterFrame', this._enterFrame)
    Crafty.removeEvent(Crafty.stage.elem, Crafty.stage.elem, 'mousemove', this._mouseMoveAtPointerLock)
  },
  _enterFrame: function () {
    var movX = this._mouseMovement.x
    var movY = this._mouseMovement.y
    this._mouseMovement.x = this._mouseMovement.y = 0
    if (Math.abs(movX) > MAX_SPEED || Math.abs(movY) > MAX_SPEED) {
      var newMovX, newMovY
      if (Math.abs(movX) > Math.abs(movY)) {
        newMovX = Math.sign(movX) * MAX_SPEED
        newMovY = movY * (MAX_SPEED / Math.abs(movX))
      } else {
        newMovY = Math.sign(movY) * MAX_SPEED
        newMovX = movX * (MAX_SPEED / Math.abs(movY))
      }
      movX = Math.round(newMovX)
      movY = Math.round(newMovY)
    }
    this.x += movX
    this.y += movY

    if (this._callback) {
      this._callback()
    }
  },
  callback: function (f) {
    console.log('registering callback', this, f)
    if (typeof f === 'function') {
      this._callback = f.bind(this)
    }
    return this
  },
  speed: function (speed) {
    if (speed.x !== undefined && speed.y !== undefined) {
      this._speed.x = speed.x
      this._speed.y = speed.y
    } else {
      this._speed.x = speed
      this._speed.y = speed
    }
    return this
  },
  pointerway: function (speed) {
    this.speed(speed)
    this.bind('EnterFrame', this._enterFrame)
    return this
  }
})

Crafty.c('Particle', {
  init: function () {
    this.addComponent('2D, DOM, Color')
    this.attr({x: WIDTH / 2 - RADIUS, y: HEIGHT / 2 - RADIUS, w: RADIUS * 2, h: RADIUS * 2})
    this.css('border-radius', '100%')
    this.origin('center')
  }
})

// # GAME ENTITIES
// Player particle
Crafty.c('CurrentAvatar', {
  init: function () {
    this.addComponent('Particle, Collision, Fourway, Persist')
    this._previousFrames = []
    this.z = 1000
  }
})

var player = Crafty.e('CurrentAvatar')
  .color('rgb(7, 124, 190)')
  .fourway(4)

// # DEBUG
// Debug commands
if (this.debug) {
  player.addComponent('WiredHitBox')
  player.addComponent('Keyboard')
  player.bind('KeyDown', function (ke) {
    if (ke.key === Crafty.keys.R) {
      this.x = WIDTH / 2 - RADIUS
      this.y = HEIGHT / 2 - RADIUS
    } else if (ke.key === Crafty.keys.Q) {
      console.log(this.x, this.y)
    } else if (ke.key === Crafty.keys.C) {
      if (Crafty._current === 'Loop') {
        Crafty.scene('Scratch')
      }
    }
  })
}

// ## Mouse movements
function collision () {
  if (this._x < BORDER) {
    this.x = BORDER
  } else if (this._x > WIDTH - this.w - BORDER) {
    this.x = WIDTH - this.w - BORDER
  }

  if (this._y < BORDER) {
    this.y = BORDER
  } else if (this._y > HEIGHT - this.h - BORDER) {
    this.y = HEIGHT - this.h - BORDER
  }
}

// Hack: adding collision detection to keyboard controls
player.unbind('EnterFrame', player._enterframe)
player.bind('EnterFrame', function () {
  player._enterframe()
  if (!player.disableControls) {
    collision.apply(player)
  }
})

// mouse lock mechanism
var game = $(Crafty.stage.elem)
game.on('click', function () {
  this.requestPointerLock()
})

var lockOnce = true
function lockChange () {
  // TODO Only bind the EnterFrame once, it's doing every time we click
  if (document.pointerLockElement === Crafty.stage.elem) {
    // enable mouse control, delayed to prevent sudden jump from
    //  accepting the pointer lock prompt
    if (!lockOnce) return
    lockOnce = false
    player.disableControl() // only disables Fourway
    setTimeout(function () {
      player.addComponent('PointerWay')
        .pointerway(MAX_SPEED)
        .callback(collision)
    }, 50)
  } else {
    // reset back to keyboard control
    lockOnce = true
    player.removeComponent('PointerWay')
    player.enableControl()
  }
}

// TODO(Dustine): Remove or rework this later
function lockError () {
}

$(document).on('pointerlockchange', lockChange)
$(document).on('pointerlockerror', lockError)

// ## Recording location
function recordFirstFrame (frame) {
  this._firstFrame = frame.frame
}

function record (frame) {
  this._previousFrames[frame.frame] = {
      // dt: frame.dt,
      x: this.x,
      y: this.y
    }
}

Crafty.c('Gone', {
  init: function () {
    this.color('rgb(117, 27, 192)')
    // this.visible = false
  }
})

Crafty.c('GhostAvatar', {
  _f: 0,
  init: function () {
    this.addComponent('Particle, Collision, Persist')
    this.color('grey')
    this.bind('ResetGhosts', this.reset)
    this.bind('StartGhosts', this.start)
  },
  _enterFrame: function () {
    if (this._f >= this._previousFrames.length) {
      this.trigger('EndRecording')
      return
    }
    var pos = this._previousFrames[this._f++]
    this.x = pos.x
    this.y = pos.y
  },
  _endRecording: function () {
    this.unbind('EnterFrame', this._enterFrame)
    this.addComponent('Gone')
  },
  ghostAvatar: function (firstFrame, previousFrames) {
    this._firstFrame = firstFrame
    this._previousFrames = previousFrames
    this._f = this._firstFrame
    this.x = this._previousFrames[this._firstFrame].x
    this.y = this._previousFrames[this._firstFrame].y
  },
  reset: function () {
    this.trigger('EndRecording')
    this._f = this._firstFrame
    this.removeComponent('Gone')
    this.x = this._previousFrames[this._firstFrame].x
    this.y = this._previousFrames[this._firstFrame].y
  },
  start: function () {
    this.color('rgb(209, 210, 167)')
    this.one('EndRecording', this._endRecording)
    this.bind('EnterFrame', this._enterFrame)
  }
})

Crafty.scene('Scratch', function (firstFrame, previousFrames) {
  // set timeout for restart of ghosties
  setTimeout(function () {
    // TODO: wait for the first frame available ?
    Crafty.scene('Loop')
  }, 2000)
})

Crafty.scene('Loop', function () {
  // start player's recording
  player.one('ExitFrame', recordFirstFrame)
  player.bind('ExitFrame', record)
  // and play everyone else's recording
  Crafty.trigger('StartGhosts')
}, function () {
  // stop recording
  player.unbind('ExitFrame', record)
  // save current run's values
  var firstFrame = player._firstFrame || 0
  var previousFrames = player._previousFrames || []
  // reset player
  player._previousFrames = []
  // restart old ghosts
  Crafty.trigger('ResetGhosts')
  // ready the new ghost
  if (previousFrames.length !== 0) {
    Crafty.e('GhostAvatar')
      .ghostAvatar(firstFrame, previousFrames)
  }
})

Crafty.scene('Loop')
