var Crafty = require('craftyjs')
// var $ = require('jquery')
var $ = window.$

// var debug = true

// global consts
var WIDTH = 600
var HEIGHT = 400
var BORDER = 20

// player constants
var MAX_SPEED = 8
var RADIUS = 4.5

Crafty.init(WIDTH, HEIGHT, 'game')
Crafty.background('rgb(0,0,0)')

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
      movX = newMovX
      movY = newMovY
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

// player particle
var player = Crafty.e('Current, 2D, DOM, Color, Collision, Fourway')
  .color('rgb(7, 124, 190)')
  .css('border-radius', '100%')
  .attr({x: WIDTH / 2 - RADIUS, y: HEIGHT / 2 - RADIUS, w: RADIUS * 2, h: RADIUS * 2})
  .fourway(4)
  .origin('center')

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

// hack: adding collision detection to keyboard controls
player.unbind('EnterFrame', player._enterframe)
player.bind('EnterFrame', function () {
  player._enterframe()
  if (!player.disableControls) {
    collision.apply(player)
  }
})

if (this.debug) {
  player.addComponent('WiredHitBox')
  player.addComponent('Keyboard')
  player.bind('KeyDown', function (ke) {
    if (ke.key === Crafty.keys.R) {
      this.x = WIDTH / 2 - RADIUS
      this.y = HEIGHT / 2 - RADIUS
    } else if (ke.key === Crafty.keys.Q) {
      console.log(this.x, this.y)
    }
  })
}

// mouse controls

var game = $(Crafty.stage.elem)
game.on('click', function () {
  this.requestPointerLock()
})

// document.addEventListener('pointerlockerror', lockError, false)

// TODO Remove or rework this later
function lockError () {
  console.log('Pointer lock failed')
}

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
      console.log('mouse activated')
    }, 50)
  } else {
    // reset back to keyboard control
    lockOnce = true
    player.removeComponent('PointerWay')
    player.enableControl()
  }
  console.log('pointerlockchange')
}

$(document).on('pointerlockchange', lockChange)
$(document).on('pointerlockerror', lockError)
